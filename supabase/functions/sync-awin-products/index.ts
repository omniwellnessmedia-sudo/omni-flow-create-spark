import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AwinProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: {
    amount: number;
    currency: string;
  };
  commissionRate: number;
  category?: string;
  brand?: string;
  merchantName?: string;
  trackingUrl: string;
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

    console.log(`Syncing ${products.length} Awin products...`);

    // Transform Awin products to our schema
    const transformedProducts = products.map((product: AwinProduct) => {
      const priceZAR = product.price.currency === 'ZAR' 
        ? product.price.amount 
        : product.price.amount * 18.5; // Fallback conversion rate

      return {
        affiliate_program_id: 'awin',
        external_product_id: product.id,
        name: product.name,
        description: product.description || null,
        price_usd: product.price.currency === 'USD' ? product.price.amount : null,
        price_zar: priceZAR,
        price_eur: product.price.currency === 'EUR' ? product.price.amount : null,
        commission_rate: product.commissionRate / 100, // Convert percentage to decimal
        category: product.category || 'General Wellness',
        image_url: product.imageUrl || null,
        affiliate_url: product.trackingUrl,
        advertiser_name: product.merchantName || null,
        brand: product.brand || null,
        is_active: true,
        last_synced_at: new Date().toISOString(),
      };
    });

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
        console.error(`Batch ${i / batchSize + 1} error:`, error);
        errors += batch.length;
      } else {
        syncedCount += batch.length;
        console.log(`Synced batch ${i / batchSize + 1}: ${batch.length} products`);
      }
    }

    // Auto-curate featured products
    await supabaseClient.rpc('auto_curate_awin_products');

    console.log(`Sync complete: ${syncedCount} products synced, ${errors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        products_synced: syncedCount,
        errors: errors,
        total_attempted: products.length,
        message: `Successfully synced ${syncedCount} Awin products`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error syncing Awin products:', error);
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
