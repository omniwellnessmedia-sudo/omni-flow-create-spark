import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CJ_PRODUCT_FEED_ENDPOINT = 'https://ads.api.cj.com/query';

const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  if (url.endsWith('/')) return false;
  if (url.length < 10) return false;
  // Filter out placeholder images
  if (/no[_-]?image|noimaged|placeholder|default/i.test(url)) return false;
  const hasValidDomain = url.startsWith('http://') || url.startsWith('https://');
  const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  const looksLikeImage = url.includes('image') || url.includes('img') || url.includes('product') || url.includes('photo');
  return hasValidDomain && (hasImageExtension || looksLikeImage);
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
    console.log(`Logo fetch failed for ${domain}`);
  }
  
  return null;
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

    const { category, keywords, limit = 100 } = await req.json();
    const searchKeywords = keywords || category || 'wellness';

    console.log('Fetching CJ products:', { category, keywords, limit, companyId: CJ_COMPANY_ID });

    // Fixed GraphQL query with correct field names and inline fragments
    const graphqlQuery = {
      query: `
        query ProductSearch($companyId: ID!, $keywords: [String!], $limit: Int) {
          products(companyId: $companyId, keywords: $keywords, limit: $limit) {
            totalCount
            resultList {
              id
              title
              description
              longDescription
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

    console.log(`Fetched ${resultList.length} products from CJ API`);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const productsWithBrands = await Promise.all(
      resultList
        .filter((product: any) => {
          if (!isValidImageUrl(product.imageLink)) return false;
          if (!product.title || product.title.length < 5) return false;
          if (parseFloat(product.price?.amount || '0') <= 0) return false;
          return true;
        })
        .map(async (product: any) => {
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

          // Process additional images from both fields
          const additionalImages: string[] = [];
          
          // Add images from additionalImageLinks array (Shopping type)
          if (Array.isArray(product.additionalImageLinks)) {
            additionalImages.push(...product.additionalImageLinks.filter((img: string) => isValidImageUrl(img)));
          }
          
          // Add single additionalImageLink if present
          if (product.additionalImageLink) {
            if (Array.isArray(product.additionalImageLink)) {
              additionalImages.push(...product.additionalImageLink.filter((img: string) => isValidImageUrl(img)));
            } else if (typeof product.additionalImageLink === 'string' && isValidImageUrl(product.additionalImageLink)) {
              additionalImages.push(product.additionalImageLink);
            }
          }

          // If no additional images, at least include main image for gallery
          if (additionalImages.length === 0 && isValidImageUrl(product.imageLink)) {
            additionalImages.push(product.imageLink);
          }

          // Get the best description available
          const longDesc = product.longDescription || product.description || '';
          const shortDesc = product.description || '';
          
          // Defensive: synthesize description if completely empty
          const finalLongDesc = longDesc || (product.brand && cleanTitle ? `${product.brand} - ${cleanTitle}` : shortDesc);
          const finalShortDesc = shortDesc || cleanTitle;

          return {
            external_product_id: product.id,
            affiliate_program_id: 'cj',
            name: cleanTitle,
            description: finalShortDesc,
            long_description: finalLongDesc,
            category: inferredCategory,
            image_url: product.imageLink,
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
            manufacturer: null, // Field doesn't exist in CJ API
            condition: product.condition || null,
            availability: product.availability || null,
            color: product.color || null,
            size: product.size || null,
            material: product.material || null,
            gtin: product.gtin || null,
            mpn: product.mpn || null,
            product_highlights: Array.isArray(product.productHighlight) ? product.productHighlight.filter((h: any) => h) : [],
            product_details: productDetails,
            additional_images: additionalImages,
            google_category: product.googleProductCategory ? { id: product.googleProductCategory.id, name: product.googleProductCategory.name } : {},
            last_synced_at: new Date().toISOString(),
          };
        })
    );

    console.log(`Processed ${productsWithBrands.length} valid products`);

    // De-duplicate products before upsert to prevent ON CONFLICT errors
    const productMap = new Map();
    productsWithBrands.forEach(product => {
      const key = `${product.external_product_id}|${product.affiliate_program_id}`;
      if (!productMap.has(key)) {
        productMap.set(key, product);
      }
    });
    const uniqueProducts = Array.from(productMap.values());
    console.log(`De-duplicated to ${uniqueProducts.length} unique products`);

    let inserted = 0;
    let updated = 0;

    if (uniqueProducts.length > 0) {
      // Get existing product IDs to calculate inserted vs updated
      const externalIds = uniqueProducts.map(p => p.external_product_id);
      const { data: existingProducts } = await supabaseClient
        .from('affiliate_products')
        .select('external_product_id')
        .eq('affiliate_program_id', 'cj')
        .in('external_product_id', externalIds);

      const existingIds = new Set(existingProducts?.map(p => p.external_product_id) || []);
      inserted = uniqueProducts.filter(p => !existingIds.has(p.external_product_id)).length;
      updated = existingProducts?.length || 0;

      // Upsert products with proper conflict resolution
      const { error: productsError } = await supabaseClient
        .from('affiliate_products')
        .upsert(uniqueProducts, { 
          onConflict: 'external_product_id,affiliate_program_id',
          ignoreDuplicates: false 
        });

      if (productsError) {
        console.error('Error upserting products:', productsError);
        throw productsError;
      } else {
        console.log(`Upserted products: ${inserted} new, ${updated} updated`);
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
          console.error('Error upserting brands:', brandsError);
        } else {
          console.log(`Upserted ${uniqueBrands.length} brands`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: {
          inserted,
          updated,
          totalFetched: resultList.length
        },
        processedCount: uniqueProducts.length,
        totalRecords: productsData?.totalCount || 0,
        products: uniqueProducts.slice(0, 10), // Return first 10 for debugging
        metadata: {
          category,
          keywords: searchKeywords,
          fetchedAt: new Date().toISOString(),
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
