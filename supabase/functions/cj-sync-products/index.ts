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

    // Fetch products for each category
    for (const category of categories) {
      try {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/cj-fetch-products`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              keywords: category,
              limit: 100,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          allProducts.push(...(data.products || []));
          syncResults.totalFetched += data.products?.length || 0;
          console.log(`Fetched ${data.products?.length || 0} products for ${category}`);
        } else {
          const errText = await response.text();
          console.error(`cj-fetch-products returned ${response.status} for ${category}:`, errText);
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
        const { error } = await supabase
          .from('affiliate_products')
          .upsert(
            {
              ...product,
              last_synced_at: new Date().toISOString(),
            },
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