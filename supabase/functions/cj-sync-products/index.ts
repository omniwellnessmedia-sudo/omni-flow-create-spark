import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Define specific wellness product searches with category mapping
    const wellnessSearches = [
      { keywords: 'yoga mat', category: 'Yoga Equipment', limit: 50 },
      { keywords: 'yoga block', category: 'Yoga Equipment', limit: 30 },
      { keywords: 'meditation cushion', category: 'Meditation Tools', limit: 30 },
      { keywords: 'essential oils', category: 'Aromatherapy', limit: 50 },
      { keywords: 'aromatherapy diffuser', category: 'Aromatherapy', limit: 30 },
      { keywords: 'protein powder', category: 'Nutrition & Supplements', limit: 50 },
      { keywords: 'vitamins supplements', category: 'Nutrition & Supplements', limit: 50 },
      { keywords: 'fitness tracker', category: 'Fitness Equipment', limit: 30 },
      { keywords: 'resistance bands', category: 'Fitness Equipment', limit: 30 },
      { keywords: 'herbal tea', category: 'Beverages', limit: 30 },
      { keywords: 'organic skincare', category: 'Beauty & Skincare', limit: 40 },
      { keywords: 'natural cosmetics', category: 'Beauty & Skincare', limit: 30 },
      { keywords: 'massage oil', category: 'Massage & Bodywork', limit: 30 },
      { keywords: 'wellness books', category: 'Books & Education', limit: 20 },
    ];

    console.log(`Starting CJ product sync with ${wellnessSearches.length} targeted searches`);

    let allProducts = [];
    let syncResults = {
      totalFetched: 0,
      inserted: 0,
      updated: 0,
      errors: 0,
      skipped: 0,
    };

    // Fetch products for each search term
    for (const search of wellnessSearches) {
      try {
        console.log(`Fetching: "${search.keywords}" → Category: ${search.category}`);
        
        const { data, error } = await supabase.functions.invoke('cj-fetch-products', {
          body: {
            keywords: search.keywords,
            category: search.category,
            limit: search.limit,
          },
        });

        if (error) {
          console.error(`Error for "${search.keywords}":`, error);
          syncResults.errors++;
        } else if (data && data.success && data.products) {
          allProducts.push(...data.products);
          syncResults.totalFetched += data.products.length;
          console.log(`✓ Fetched ${data.products.length} products for "${search.keywords}"`);
        } else {
          console.log(`⊘ No products for "${search.keywords}"`);
          syncResults.errors++;
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Exception for "${search.keywords}":`, error);
        syncResults.errors++;
      }
    }

    console.log(`\nTotal products fetched: ${allProducts.length}`);

    // Deduplicate products by external_product_id
    const uniqueProducts = allProducts.reduce((acc: any[], product) => {
      if (!acc.find(p => p.external_product_id === product.external_product_id)) {
        acc.push(product);
      } else {
        syncResults.skipped++;
      }
      return acc;
    }, []);

    console.log(`After deduplication: ${uniqueProducts.length} unique products (${syncResults.skipped} duplicates removed)`);

    // Validate and clean product data before upserting
    const validProducts = uniqueProducts.filter(product => {
      // Validate title length
      if (!product.name || product.name.length < 5) {
        console.log(`Skipping product with short title: "${product.name}"`);
        syncResults.skipped++;
        return false;
      }
      
      // Validate image URL
      if (!product.image_url || product.image_url.endsWith('/')) {
        console.log(`Skipping product with invalid image: ${product.name}`);
        syncResults.skipped++;
        return false;
      }
      
      // Validate price
      if (!product.price_usd || product.price_usd <= 0) {
        console.log(`Skipping product with invalid price: ${product.name}`);
        syncResults.skipped++;
        return false;
      }
      
      return true;
    });

    console.log(`After validation: ${validProducts.length} valid products`);

    // Batch upsert products
    if (validProducts.length > 0) {
      const productsToUpsert = validProducts.map(product => ({
        affiliate_program_id: product.affiliate_program_id,
        external_product_id: product.external_product_id,
        name: product.name,
        description: product.description ?? null,
        category: product.category ?? null,
        image_url: product.image_url ?? null,
        affiliate_url: product.affiliate_url,
        price_usd: Number.isFinite(product.price_usd) ? product.price_usd : null,
        price_eur: Number.isFinite(product.price_eur) ? product.price_eur : null,
        price_zar: Number.isFinite(product.price_zar) ? product.price_zar : null,
        commission_rate: product.commission_rate ?? null,
        advertiser_id: product.advertiser_id ?? null,
        advertiser_name: product.advertiser_name ?? null,
        brand_logo_url: product.brand_logo_url ?? null,
        is_active: true,
        last_synced_at: new Date().toISOString(),
      }));

      try {
        const { error, count } = await supabase
          .from('affiliate_products')
          .upsert(productsToUpsert, {
            onConflict: 'affiliate_program_id,external_product_id',
            count: 'exact'
          });

        if (error) {
          console.error('Batch upsert error:', error);
          syncResults.errors++;
        } else {
          syncResults.inserted = count || validProducts.length;
          console.log(`✓ Successfully upserted ${syncResults.inserted} products`);
        }
      } catch (error) {
        console.error('Exception during batch upsert:', error);
        syncResults.errors++;
      }
    }

    // Update sync stats
    console.log('Sync completed:', syncResults);

    return new Response(
      JSON.stringify({
        success: true,
        results: syncResults,
        completedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error syncing CJ products:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});