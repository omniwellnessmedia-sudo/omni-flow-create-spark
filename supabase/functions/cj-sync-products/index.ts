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

    const { categories = ['wellness', 'natural', 'organic', 'health', 'fitness'] } = await req.json();

    console.log('Starting CJ product sync for categories:', categories);

    let allProducts = [];
    let syncResults = {
      totalFetched: 0,
      inserted: 0,
      updated: 0,
      errors: 0,
    };

    // Fetch products for each category using Supabase client
    for (const category of categories) {
      try {
        console.log(`Calling cj-fetch-products for category: ${category}`);
        
        const { data, error } = await supabase.functions.invoke('cj-fetch-products', {
          body: {
            keywords: category,
            limit: 100,
          },
        });

        if (error) {
          console.error(`cj-fetch-products error for ${category}:`, error);
          syncResults.errors++;
        } else if (data && data.success && data.products) {
          allProducts.push(...data.products);
          syncResults.totalFetched += data.products.length;
          console.log(`Fetched ${data.products.length} products for ${category}`);
        } else {
          console.error(`cj-fetch-products returned no products for ${category}:`, data);
          syncResults.errors++;
        }
      } catch (error) {
        console.error(`Error fetching products for ${category}:`, error);
        syncResults.errors++;
      }
    }

    // Upsert products to database
    console.log(`Upserting ${allProducts.length} products to database`);

    for (const product of allProducts) {
      try {
        // Whitelist only valid columns for affiliate_products table
        const toUpsert = {
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
          is_active: true,
          last_synced_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('affiliate_products')
          .upsert(
            toUpsert,
            {
              onConflict: 'affiliate_program_id,external_product_id',
            }
          );

        if (error) {
          console.error('Error upserting product:', error);
          syncResults.errors++;
        } else {
          syncResults.inserted++;
        }
      } catch (error) {
        console.error('Error processing product:', error);
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