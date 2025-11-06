import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { orderId, items, billingInfo } = await req.json();

    console.log('Processing affiliate order:', { orderId, itemCount: items.length });

    // Process each affiliate item
    const affiliateItems = items.filter((item: any) => item.item_type === 'affiliate');
    const conversions = [];

    for (const item of affiliateItems) {
      const clickId = `cj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Track the click/conversion
      const { error: clickError } = await supabaseClient
        .from('affiliate_clicks')
        .insert({
          affiliate_program_id: item.affiliate_program_id,
          click_id: clickId,
          destination_url: item.affiliate_url,
          referrer_url: 'checkout',
        });

      if (clickError) {
        console.error('Error tracking affiliate click:', clickError);
      }

      const commissionEarned = item.price_zar * item.quantity * (item.commission_rate || 0);

      conversions.push({
        product_id: item.id,
        product_name: item.title,
        affiliate_url: item.affiliate_url,
        click_id: clickId,
        quantity: item.quantity,
        commission_earned: commissionEarned,
      });
    }

    // Return fulfillment instructions
    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        conversions,
        message: `Processed ${conversions.length} affiliate products`,
        fulfillmentInstructions: conversions.map(c => ({
          product: c.product_name,
          message: 'Visit partner site to complete purchase',
          trackingId: c.click_id,
        })),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing affiliate order:', error);
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
