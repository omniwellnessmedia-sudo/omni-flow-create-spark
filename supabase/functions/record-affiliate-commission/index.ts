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

    const {
      orderId,
      clickId,
      orderAmount,
      currency = 'ZAR'
    } = await req.json();

    if (!orderId || !clickId) {
      throw new Error('Missing required fields: orderId and clickId');
    }

    // Get click record to retrieve program info
    const { data: click, error: clickError } = await supabaseClient
      .from('affiliate_clicks')
      .select('*')
      .eq('click_id', clickId)
      .single();

    if (clickError || !click) {
      throw new Error('Invalid click ID or click not found');
    }

    // Get program configuration
    const programId = click.affiliate_program_id;
    
    // Default commission rates (will be enhanced when secrets are available)
    const commissionRates: Record<string, number> = {
      'cj_affiliate': 8.5,
      'getyourguide': 7.0,
      'faithful_to_nature': 10.0,
      'awin': 6.0,
      'travelstart': 5.0,
      'shareasale': 8.0,
      'viator': 8.0,
      'oura_rings': 10.0,
      'vegan_cuts': 12.0,
      'safari_now': 7.5
    };

    const commissionRate = commissionRates[programId] || 5.0;
    const commissionAmount = (orderAmount * commissionRate) / 100;

    // Get user if authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      userId = user?.id;
    }

    // Insert commission record
    const { data: commission, error: commissionError } = await supabaseClient
      .from('affiliate_commissions')
      .insert({
        affiliate_program_id: programId,
        click_id: clickId,
        order_id: orderId,
        user_id: userId,
        order_amount: orderAmount,
        commission_amount: commissionAmount,
        commission_currency: currency,
        commission_rate: commissionRate,
        status: 'pending'
      })
      .select()
      .single();

    if (commissionError) throw commissionError;

    // Update order with commission reference
    await supabaseClient
      .from('orders')
      .update({
        affiliate_click_id: clickId,
        affiliate_program_id: programId,
        affiliate_commission_id: commission.id
      })
      .eq('id', orderId);

    return new Response(
      JSON.stringify({
        success: true,
        commission_id: commission.id,
        commission_amount: commissionAmount,
        currency: currency,
        message: 'Commission recorded successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error recording commission:', error);
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
