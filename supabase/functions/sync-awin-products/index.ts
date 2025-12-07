import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback wellness product images from Supabase storage
const FALLBACK_IMAGES = [
  'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat%202.jpg',
  'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg',
  'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg',
];

// Validate if URL is a valid image
const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  if (url.length < 10) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  if (/no[_-]?image|noimaged|placeholder|default/i.test(url)) return false;
  // Check for common image extensions or image-related paths
  const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url);
  const looksLikeImage = /image|img|product|photo|media|cdn|assets/i.test(url);
  return hasImageExtension || looksLikeImage;
};

// Get fallback image based on index for variety
const getFallbackImage = (index: number): string => {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

// Extract best image from various Awin feed formats
const extractImageUrl = (product: any, index: number): string => {
  // Try multiple image fields that Awin might use
  const possibleImageFields = [
    'imageUrl',
    'aw_image_url',
    'merchant_image_url',
    'image_url',
    'imgUrl',
    'productImage',
    'thumbnailUrl',
    'largeImage',
    'mediumImage',
    'smallImage',
    'image',
    'img',
    'picture',
    'photo',
  ];

  for (const field of possibleImageFields) {
    const imageUrl = product[field];
    if (isValidImageUrl(imageUrl)) {
      console.log(`[AWIN] Found valid image in field "${field}": ${imageUrl.substring(0, 50)}...`);
      return imageUrl;
    }
  }

  // Try nested image objects
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === 'string' && isValidImageUrl(firstImage)) {
      return firstImage;
    }
    if (firstImage?.url && isValidImageUrl(firstImage.url)) {
      return firstImage.url;
    }
  }

  console.log(`[AWIN] No valid image found for product ${product.id || product.product_id || 'unknown'}, using fallback`);
  return getFallbackImage(index);
};

// Infer category from product data
const inferCategory = (product: any): string => {
  const text = `${product.name || ''} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  
  if (/yoga|asana|mat|block|strap/i.test(text)) return 'Yoga Equipment';
  if (/meditat|mindfulness|cushion|zafu/i.test(text)) return 'Meditation Tools';
  if (/essential oil|aromatherapy|diffuser|incense/i.test(text)) return 'Aromatherapy';
  if (/supplement|vitamin|mineral|probiotic/i.test(text)) return 'Nutrition & Supplements';
  if (/fitness|exercise|resistance|dumbbell/i.test(text)) return 'Fitness Equipment';
  if (/tea|herbal|beverage|matcha/i.test(text)) return 'Beverages';
  if (/skincare|beauty|serum|moisturizer/i.test(text)) return 'Beauty & Skincare';
  if (/massage|spa|relaxation/i.test(text)) return 'Massage & Bodywork';
  if (/book|guide|journal/i.test(text)) return 'Books & Education';
  
  return product.category_name || product.category || 'General Wellness';
};

interface AwinProduct {
  id?: string;
  product_id?: string;
  name?: string;
  product_name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  aw_image_url?: string;
  image_url?: string;
  price?: {
    amount: number;
    currency: string;
  };
  search_price?: string;
  currency?: string;
  commissionRate?: number;
  commission_group?: string;
  category?: string;
  category_name?: string;
  brand?: string;
  brand_name?: string;
  merchantName?: string;
  merchant_name?: string;
  merchant_id?: string;
  trackingUrl?: string;
  aw_deep_link?: string;
  affiliate_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated and has admin role
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check admin status using the secure is_admin function
    const { data: isAdmin, error: adminError } = await supabaseClient
      .rpc('is_admin', { user_id: user.id });

    if (adminError || !isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    const { products } = await req.json();
    
    if (!products || !Array.isArray(products)) {
      throw new Error('Invalid products data. Expected an array of products.');
    }

    console.log(`[AWIN] Syncing ${products.length} Awin products...`);

    // Track image statistics for debugging
    let validImages = 0;
    let fallbackImages = 0;

    // Transform Awin products to our schema with flexible field mapping
    const transformedProducts = products.map((product: AwinProduct, index: number) => {
      // Extract product ID from multiple possible fields
      const productId = product.id || product.product_id || `awin-${Date.now()}-${index}`;
      
      // Extract name from multiple possible fields
      const productName = product.name || product.product_name || product.title || 'Wellness Product';
      
      // Extract price with flexible format handling
      let priceAmount = 0;
      let priceCurrency = 'ZAR';
      
      if (product.price && typeof product.price === 'object') {
        priceAmount = product.price.amount || 0;
        priceCurrency = product.price.currency || 'USD';
      } else if (product.search_price) {
        priceAmount = parseFloat(product.search_price) || 0;
        priceCurrency = product.currency || 'ZAR';
      }

      // Convert to ZAR if needed
      let priceZAR = priceAmount;
      let priceUSD = null;
      let priceEUR = null;

      if (priceCurrency === 'USD') {
        priceUSD = priceAmount;
        priceZAR = priceAmount * 18.5;
      } else if (priceCurrency === 'EUR') {
        priceEUR = priceAmount;
        priceZAR = priceAmount * 20.1;
      } else if (priceCurrency === 'GBP') {
        priceZAR = priceAmount * 23.3;
      }

      // Extract commission rate
      let commissionRate = 0.08; // Default 8%
      if (product.commissionRate) {
        commissionRate = product.commissionRate / 100;
      } else if (product.commission_group) {
        // Try to parse commission from group name (e.g., "10% Commission")
        const match = product.commission_group.match(/(\d+(?:\.\d+)?)\s*%/);
        if (match) {
          commissionRate = parseFloat(match[1]) / 100;
        }
      }

      // Extract image URL with validation
      const imageUrl = extractImageUrl(product, index);
      if (imageUrl.includes('supabase.co')) {
        fallbackImages++;
      } else {
        validImages++;
      }

      // Extract affiliate URL
      const affiliateUrl = product.trackingUrl || product.aw_deep_link || product.affiliate_url || '';

      // Extract brand/merchant
      const brandName = product.brand || product.brand_name || product.merchantName || product.merchant_name || null;

      return {
        affiliate_program_id: 'awin',
        external_product_id: String(productId),
        name: productName,
        description: product.description || null,
        price_usd: priceUSD,
        price_zar: Math.round(priceZAR * 100) / 100,
        price_eur: priceEUR,
        commission_rate: commissionRate,
        category: inferCategory(product),
        image_url: imageUrl,
        affiliate_url: affiliateUrl,
        advertiser_id: product.merchant_id || null,
        advertiser_name: product.merchantName || product.merchant_name || null,
        brand: brandName,
        is_active: true,
        last_synced_at: new Date().toISOString(),
      };
    });

    console.log(`[AWIN] Image stats: ${validImages} valid, ${fallbackImages} fallbacks`);

    // Batch upsert products
    const batchSize = 100;
    let syncedCount = 0;
    let errors = 0;

    for (let i = 0; i < transformedProducts.length; i += batchSize) {
      const batch = transformedProducts.slice(i, i + batchSize);
      
      const { error } = await supabaseClient
        .from('affiliate_products')
        .upsert(batch, {
          onConflict: 'affiliate_program_id,external_product_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`[AWIN] Batch ${i / batchSize + 1} error:`, error);
        errors += batch.length;
      } else {
        syncedCount += batch.length;
        console.log(`[AWIN] Synced batch ${i / batchSize + 1}: ${batch.length} products`);
      }
    }

    // Auto-curate featured products
    try {
      await supabaseClient.rpc('auto_curate_awin_products');
      console.log('[AWIN] Auto-curation complete');
    } catch (curationError) {
      console.log('[AWIN] Auto-curation skipped:', curationError);
    }

    console.log(`[AWIN] Sync complete: ${syncedCount} products synced, ${errors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        products_synced: syncedCount,
        errors: errors,
        total_attempted: products.length,
        image_stats: {
          valid_images: validImages,
          fallback_images: fallbackImages,
        },
        message: `Successfully synced ${syncedCount} Awin products (${validImages} with images, ${fallbackImages} with fallbacks)`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('[AWIN] Error syncing products:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
