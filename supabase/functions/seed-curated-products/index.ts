import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Curated wellness products seed data
    const curatedProducts = await fetch('https://raw.githubusercontent.com/omniwellnessmedia-sudo/omni-flow-create-spark/main/src/data/curated_wellness_seed.json')
      .then(res => res.json());

    const productsToInsert = curatedProducts.map((p: any) => ({
      id: p.id,
      affiliate_program_id: p.affiliate_program_id,
      external_product_id: p.external_product_id,
      name: p.name,
      description: p.description,
      long_description: p.long_description,
      category: p.category,
      brand: p.brand,
      advertiser_name: p.advertiser_name,
      image_url: p.image_url,
      additional_images: p.additional_images,
      affiliate_url: p.affiliate_url,
      price_zar: p.price_zar,
      price_usd: p.price_usd,
      price_eur: p.price_eur,
      sale_price_zar: p.sale_price_zar,
      commission_rate: p.commission_rate,
      is_active: true,
      is_featured: p.is_featured,
      is_trending: p.is_trending,
      product_highlights: p.product_highlights,
      product_details: p.product_details,
    }));

    const { data, error } = await supabaseClient
      .from('affiliate_products')
      .upsert(productsToInsert, { onConflict: 'id' });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, count: productsToInsert.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
