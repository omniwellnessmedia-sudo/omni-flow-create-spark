import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CJ_PRODUCT_FEED_ENDPOINT = 'https://ads.api.cj.com/query';

// Fallback wellness product images from Supabase storage
const FALLBACK_IMAGES = [
  'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat%202.jpg',
  'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg',
  'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg',
];

// Low quality image patterns - these should use fallbacks
const LOW_QUALITY_PATTERNS = [
  'knetbooks.com', 'ecampus.com', 'biggerbooks.com', // Small book thumbnails
  'supraphonline.cz/cover/200', // Small album covers (200px)
  '/thumb/', '/thumbnail/', '/small/', '/tiny/', '/mini/',
  'width=200', 'width=100', 'width=150', 'maxheight=200', 'maxheight=150',
  '_50x50', '_100x100', '_150x150', '_200x200',
  '/50/', '/100/', '/150/', '/200/', // Size in path
  'simages.ecampus.com', 'images.biggerbooks.com'
];

// Check if URL points to a low quality image
const isLowQualityImage = (url: string): boolean => {
  return LOW_QUALITY_PATTERNS.some(pattern => url.toLowerCase().includes(pattern));
};

// Upgrade image quality for known CDN patterns
const upgradeImageUrl = (url: string): string => {
  let enhanced = url;
  
  // Upgrade to HTTPS
  enhanced = enhanced.replace(/^http:\/\//, 'https://');
  
  // Shopify: Request larger image
  if (enhanced.includes('cdn.shopify.com')) {
    enhanced = enhanced.replace(/_\d+x\d*\./, '_1024x1024.');
    enhanced = enhanced.replace(/_\d*x\d+\./, '_1024x1024.');
  }
  
  // Indigo/Chapters books: Request larger
  if (enhanced.includes('indigoimages.ca') || enhanced.includes('indigo.ca')) {
    enhanced = enhanced.replace(/width=\d+/, 'width=800').replace(/maxheight=\d+/, 'maxheight=800');
  }
  
  // Factcool: Already decent quality, no changes needed
  // Cloudfront: Usually good quality, no changes needed
  
  return enhanced;
};

// Enhanced image validation
const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  if (url.length < 10) return false;
  if (url.endsWith('/')) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  // Filter out placeholder images
  if (/no[_-]?image|noimaged|placeholder|default|missing|blank|empty/i.test(url)) return false;
  // Check for valid image indicators
  const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url);
  const looksLikeImage = /image|img|product|photo|media|cdn|assets|pictures/i.test(url);
  return hasImageExtension || looksLikeImage;
};

// Check if image is high quality enough to use
const isHighQualityImage = (url: string): boolean => {
  if (!isValidImageUrl(url)) return false;
  if (isLowQualityImage(url)) return false;
  return true;
};

// Get fallback image with variety
const getFallbackImage = (index: number): string => {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

const extractProductTitle = (title: string, description?: string): string => {
  if (title && title.length > 10 && !['Meditation', 'Wellness', 'Health', 'Yoga'].includes(title)) {
    return title.substring(0, 150);
  }
  if (description && description.length > 20) {
    const firstSentence = description.split(/[.!?]\s/)[0];
    if (firstSentence && firstSentence.length >= 10) {
      return firstSentence.substring(0, 150);
    }
  }
  return title || 'Wellness Product';
};

const inferCategory = (title: string, description: string, providedCategory?: string): string => {
  if (providedCategory && providedCategory !== 'General Wellness') {
    return providedCategory;
  }
  
  const text = `${title} ${description}`.toLowerCase();
  
  if (/yoga|asana|mat|block|strap|bolster/i.test(text)) return 'Yoga Equipment';
  if (/meditat|mindfulness|cushion|zafu|singing bowl/i.test(text)) return 'Meditation Tools';
  if (/essential oil|aromatherapy|diffuser|incense/i.test(text)) return 'Aromatherapy';
  if (/protein|supplement|vitamin|mineral|probiotic|collagen/i.test(text)) return 'Nutrition & Supplements';
  if (/fitness|exercise|resistance band|dumbbell|tracker|smartwatch/i.test(text)) return 'Fitness Equipment';
  if (/tea|herbal|beverage|drink|matcha/i.test(text)) return 'Beverages';
  if (/skincare|cosmetic|beauty|serum|moisturizer|cream/i.test(text)) return 'Beauty & Skincare';
  if (/massage|spa|bodywork|relaxation/i.test(text)) return 'Massage & Bodywork';
  if (/book|guide|manual|journal/i.test(text)) return 'Books & Education';
  
  return 'General Wellness';
};

const extractDomain = (advertiserName: string): string => {
  if (!advertiserName) return '';
  const cleaned = advertiserName
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/(inc|llc|ltd|corp|corporation|company|co)$/i, '');
  return `${cleaned}.com`;
};

const fetchBrandLogo = async (advertiserName: string): Promise<string | null> => {
  if (!advertiserName) return null;
  
  const domain = extractDomain(advertiserName);
  
  try {
    const clearbitUrl = `https://logo.clearbit.com/${domain}`;
    const response = await fetch(clearbitUrl, { method: 'HEAD' });
    if (response.ok) {
      return clearbitUrl;
    }
  } catch (error) {
    console.log(`[CJ] Logo fetch failed for ${domain}`);
  }
  
  return null;
};

// Find best available HIGH QUALITY image from product data
const extractBestImage = (product: any, index: number): { url: string; isFallback: boolean; reason?: string } => {
  const allCandidates: string[] = [];
  
  // Collect all candidate images
  if (product.imageLink) allCandidates.push(product.imageLink);
  if (Array.isArray(product.additionalImageLinks)) {
    allCandidates.push(...product.additionalImageLinks);
  }
  if (product.additionalImageLink) {
    if (Array.isArray(product.additionalImageLink)) {
      allCandidates.push(...product.additionalImageLink);
    } else {
      allCandidates.push(product.additionalImageLink);
    }
  }
  
  // First pass: Look for high-quality images
  for (const img of allCandidates) {
    if (isHighQualityImage(img)) {
      const enhancedUrl = upgradeImageUrl(img);
      console.log(`[CJ] Using high-quality image for ${product.id}: ${enhancedUrl}`);
      return { url: enhancedUrl, isFallback: false };
    }
  }
  
  // Second pass: Accept valid images even if low quality (better than nothing)
  for (const img of allCandidates) {
    if (isValidImageUrl(img)) {
      // But still upgrade it if possible
      const enhancedUrl = upgradeImageUrl(img);
      console.log(`[CJ] Using lower-quality image for ${product.id} (no HQ available): ${enhancedUrl}`);
      return { url: enhancedUrl, isFallback: false, reason: 'low-quality-source' };
    }
  }
  
  // Use fallback wellness image for products with no valid images
  console.log(`[CJ] No valid image for product ${product.id}, using wellness fallback`);
  return { url: getFallbackImage(index), isFallback: true, reason: 'no-source-image' };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CJ_PAT = Deno.env.get('CJ_PERSONAL_ACCESS_TOKEN');
    const CJ_COMPANY_ID = Deno.env.get('CJ_COMPANY_ID');

    if (!CJ_PAT) throw new Error('CJ Personal Access Token not configured');
    if (!CJ_COMPANY_ID) throw new Error('CJ Company ID not configured');

    // Create supabase client with service role for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Optional: Verify admin if Authorization header provided
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const userClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );
      
      const { data: { user }, error: userError } = await userClient.auth.getUser();
      if (user) {
        const { data: isAdmin } = await userClient.rpc('is_admin', { user_id: user.id });
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin access required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }
        console.log('[CJ] Admin user verified:', user.id);
      }
    }

    const { category, keywords, limit = 100 } = await req.json();
    const searchKeywords = keywords || category || 'wellness';

    console.log('[CJ] Fetching products:', { category, keywords, limit, companyId: CJ_COMPANY_ID });

    const graphqlQuery = {
      query: `
        query ProductSearch($companyId: ID!, $keywords: [String!], $limit: Int) {
          products(companyId: $companyId, keywords: $keywords, limit: $limit) {
            totalCount
            resultList {
              id
              title
              description
              brand
              advertiserId
              advertiserName
              catalogId
              imageLink
              additionalImageLink
              link
              mobileLink
              price { amount currency }
              salePrice { amount currency }
              ... on Shopping {
                additionalImageLinks
                color
                size
                material
                condition
                availability
                gtin
                mpn
                productHighlight
                productDetail { attributeName attributeValue }
                googleProductCategory { id name }
              }
            }
          }
        }
      `,
      variables: { companyId: CJ_COMPANY_ID, keywords: [searchKeywords], limit }
    };

    const response = await fetch(CJ_PRODUCT_FEED_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CJ_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CJ API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.errors) throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);

    const productsData = data.data?.products;
    const resultList = productsData?.resultList || [];

    console.log(`[CJ] Fetched ${resultList.length} products from API`);

    // Track image statistics
    let validImages = 0;
    let fallbackImages = 0;
    let skippedProducts = 0;

    const productsWithBrands = await Promise.all(
      resultList
        .map(async (product: any, index: number) => {
          // Extract best image
          const { url: imageUrl, isFallback } = extractBestImage(product, index);
          
          if (isFallback) {
            fallbackImages++;
          } else {
            validImages++;
          }

          // Skip products without title or valid price
          if (!product.title || product.title.length < 5) {
            skippedProducts++;
            return null;
          }
          if (parseFloat(product.price?.amount || '0') <= 0) {
            skippedProducts++;
            return null;
          }

          const priceAmount = parseFloat(product.price?.amount || '0');
          const priceCurrency = product.price?.currency || 'USD';
          const salePriceAmount = parseFloat(product.salePrice?.amount || '0');
          const salePriceCurrency = product.salePrice?.currency || priceCurrency;
          const cleanTitle = extractProductTitle(product.title, product.description);
          const inferredCategory = inferCategory(cleanTitle, product.description || '', category);
          
          const brandLogoUrl = product.advertiserName ? await fetchBrandLogo(product.advertiserName) : null;
          
          // Currency conversion helper
          const convertCurrency = (amount: number, currency: string) => {
            if (currency === 'USD') return { usd: amount, zar: amount * 18.5, eur: amount * 0.92 };
            if (currency === 'EUR') return { usd: amount * 1.09, zar: amount * 20.1, eur: amount };
            if (currency === 'ZAR') return { usd: amount * 0.054, zar: amount, eur: amount * 0.05 };
            if (currency === 'GBP') return { usd: amount * 1.27, zar: amount * 23.3, eur: amount * 1.16 };
            return { usd: amount, zar: amount * 18.5, eur: amount * 0.92 };
          };

          const prices = convertCurrency(priceAmount, priceCurrency);
          const saleConv = salePriceAmount > 0 ? convertCurrency(salePriceAmount, salePriceCurrency) : null;

          // Process product details
          const productDetails: Record<string, string> = {};
          if (Array.isArray(product.productDetail)) {
            product.productDetail.forEach((detail: any) => {
              if (detail.attributeName && detail.attributeValue) {
                productDetails[detail.attributeName] = detail.attributeValue;
              }
            });
          }

          // Process additional images
          const additionalImages: string[] = [];
          if (Array.isArray(product.additionalImageLinks)) {
            additionalImages.push(...product.additionalImageLinks.filter((img: string) => isValidImageUrl(img)));
          }
          if (product.additionalImageLink) {
            if (Array.isArray(product.additionalImageLink)) {
              additionalImages.push(...product.additionalImageLink.filter((img: string) => isValidImageUrl(img)));
            } else if (isValidImageUrl(product.additionalImageLink)) {
              additionalImages.push(product.additionalImageLink);
            }
          }

          const description = product.description || '';
          const shortDesc = description.length > 200 ? description.substring(0, 200) + '...' : description;
          const longDesc = description || (product.brand && cleanTitle ? `${product.brand} - ${cleanTitle}` : '');

          return {
            external_product_id: product.id,
            affiliate_program_id: 'cj',
            name: cleanTitle,
            description: shortDesc || cleanTitle,
            long_description: longDesc || shortDesc || cleanTitle,
            category: inferredCategory,
            image_url: imageUrl,
            affiliate_url: product.link || '',
            price_usd: Math.round(prices.usd * 100) / 100,
            price_zar: Math.round(prices.zar * 100) / 100,
            price_eur: Math.round(prices.eur * 100) / 100,
            sale_price_usd: saleConv ? Math.round(saleConv.usd * 100) / 100 : null,
            sale_price_zar: saleConv ? Math.round(saleConv.zar * 100) / 100 : null,
            sale_price_eur: saleConv ? Math.round(saleConv.eur * 100) / 100 : null,
            commission_rate: 0.08,
            is_active: true,
            advertiser_id: product.advertiserId,
            advertiser_name: product.advertiserName,
            brand_logo_url: brandLogoUrl,
            brand: product.brand || null,
            manufacturer: null,
            condition: product.condition || null,
            availability: product.availability || null,
            color: product.color || null,
            size: product.size || null,
            material: product.material || null,
            gtin: product.gtin || null,
            mpn: product.mpn || null,
            product_highlights: Array.isArray(product.productHighlight) ? product.productHighlight.filter((h: any) => h) : [],
            product_details: productDetails,
            additional_images: additionalImages.length > 0 ? additionalImages : [imageUrl],
            google_category: product.googleProductCategory ? { id: product.googleProductCategory.id, name: product.googleProductCategory.name } : {},
            last_synced_at: new Date().toISOString(),
          };
        })
    );

    // Filter out null entries
    const validProducts = productsWithBrands.filter(p => p !== null);
    console.log(`[CJ] Processed ${validProducts.length} valid products (${skippedProducts} skipped)`);
    console.log(`[CJ] Image stats: ${validImages} valid, ${fallbackImages} fallbacks`);

    // De-duplicate products
    const productMap = new Map();
    validProducts.forEach(product => {
      const key = `${product.external_product_id}|${product.affiliate_program_id}`;
      if (!productMap.has(key)) {
        productMap.set(key, product);
      }
    });
    const uniqueProducts = Array.from(productMap.values());
    console.log(`[CJ] De-duplicated to ${uniqueProducts.length} unique products`);

    let inserted = 0;
    let updated = 0;

    if (uniqueProducts.length > 0) {
      const externalIds = uniqueProducts.map(p => p.external_product_id);
      const { data: existingProducts } = await supabaseClient
        .from('affiliate_products')
        .select('external_product_id')
        .eq('affiliate_program_id', 'cj')
        .in('external_product_id', externalIds);

      const existingIds = new Set(existingProducts?.map(p => p.external_product_id) || []);
      inserted = uniqueProducts.filter(p => !existingIds.has(p.external_product_id)).length;
      updated = existingProducts?.length || 0;

      const { error: productsError } = await supabaseClient
        .from('affiliate_products')
        .upsert(uniqueProducts, { 
          onConflict: 'external_product_id,affiliate_program_id',
          ignoreDuplicates: false 
        });

      if (productsError) {
        console.error('[CJ] Error upserting products:', productsError);
        throw productsError;
      } else {
        console.log(`[CJ] Upserted products: ${inserted} new, ${updated} updated`);
      }

      // Upsert brands
      const uniqueBrands = uniqueProducts
        .filter(p => p.advertiser_id && p.advertiser_name)
        .reduce((acc: any[], product) => {
          if (!acc.find(b => b.advertiser_id === product.advertiser_id)) {
            acc.push({
              advertiser_id: product.advertiser_id,
              name: product.advertiser_name,
              logo_url: product.brand_logo_url
            });
          }
          return acc;
        }, []);

      if (uniqueBrands.length > 0) {
        const { error: brandsError } = await supabaseClient
          .from('affiliate_brands')
          .upsert(uniqueBrands, { 
            onConflict: 'advertiser_id',
            ignoreDuplicates: false 
          });

        if (brandsError) {
          console.error('[CJ] Error upserting brands:', brandsError);
        } else {
          console.log(`[CJ] Upserted ${uniqueBrands.length} brands`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: {
          inserted,
          updated,
          totalFetched: resultList.length,
          skipped: skippedProducts,
        },
        image_stats: {
          valid_images: validImages,
          fallback_images: fallbackImages,
        },
        processedCount: uniqueProducts.length,
        totalRecords: productsData?.totalCount || 0,
        products: uniqueProducts.slice(0, 5), // Return first 5 for debugging
        metadata: {
          category,
          keywords: searchKeywords,
          fetchedAt: new Date().toISOString(),
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('[CJ] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
