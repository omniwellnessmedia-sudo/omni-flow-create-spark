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
      programId,
      destinationUrl,
      referrerUrl,
      userAgent,
      ipAddress
    } = await req.json();

    if (!programId || !destinationUrl) {
      throw new Error('Missing required fields: programId and destinationUrl');
    }

    // Generate unique click ID
    const clickId = `${programId}_${Date.now()}_${crypto.randomUUID()}`;

    // Get user if authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      userId = user?.id;
    }

    // Detect device type from user agent
    const deviceType = userAgent?.includes('Mobile') ? 'mobile' : 
                       userAgent?.includes('Tablet') ? 'tablet' : 'desktop';

    // Insert click record
    const { error } = await supabaseClient
      .from('affiliate_clicks')
      .insert({
        click_id: clickId,
        affiliate_program_id: programId,
        destination_url: destinationUrl,
        referrer_url: referrerUrl,
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        device_type: deviceType
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        click_id: clickId,
        message: 'Click tracked successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error tracking click:', error);
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
