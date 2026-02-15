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
    const leaddynoApiKey = Deno.env.get('LEADDYNO_API_KEY');
    
    if (!leaddynoApiKey) {
      console.log('LeadDyno API key not configured yet - webhook endpoint ready for future use');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'LeadDyno webhook endpoint is ready. API key not yet configured.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload = await req.json();
    console.log('LeadDyno webhook received:', JSON.stringify(payload));

    // Handle different LeadDyno event types
    const { event_type, affiliate, lead, purchase } = payload;

    switch (event_type) {
      case 'lead_created':
        // Track new lead from affiliate
        if (lead?.affiliate_code) {
          await supabaseClient.from('partner_referrals').insert({
            referral_code: lead.affiliate_code,
            visitor_ip_hash: lead.ip || null,
            page_visited: lead.landing_page || null,
            converted: false,
            conversion_type: 'signup',
          });
        }
        break;

      case 'purchase_created':
        // Track purchase conversion
        if (purchase?.affiliate_code) {
          await supabaseClient.from('partner_referrals').insert({
            referral_code: purchase.affiliate_code,
            converted: true,
            conversion_type: 'purchase',
            commission_amount: purchase.commission_amount || 0,
          });
        }
        break;

      default:
        console.log(`Unhandled LeadDyno event type: ${event_type}`);
    }

    return new Response(
      JSON.stringify({ success: true, event_type }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('LeadDyno webhook error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
