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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { site_name, action } = await req.json();

    if (!site_name || !action) {
      throw new Error('Missing required fields: site_name, action');
    }

    if (action !== 'publish' && action !== 'unpublish') {
      throw new Error('Invalid action. Must be "publish" or "unpublish"');
    }

    // Verify ownership
    const { data: website } = await supabaseClient
      .from('provider_websites')
      .select('*')
      .eq('provider_id', user.id)
      .eq('duda_site_name', site_name)
      .single();

    if (!website) {
      throw new Error('Website not found or unauthorized');
    }

    const dudaUsername = Deno.env.get('DUDA_API_USERNAME');
    const dudaPassword = Deno.env.get('DUDA_API_PASSWORD');

    if (!dudaUsername || !dudaPassword) {
      throw new Error('Duda API credentials not configured');
    }

    const authString = btoa(`${dudaUsername}:${dudaPassword}`);

    console.log(`${action}ing Duda site:`, site_name);

    // Publish or unpublish via Duda API
    const endpoint = action === 'publish' 
      ? `https://api.duda.co/api/sites/multiscreen/publish/${site_name}`
      : `https://api.duda.co/api/sites/multiscreen/unpublish/${site_name}`;

    const dudaResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!dudaResponse.ok) {
      const errorText = await dudaResponse.text();
      console.error('Duda API error:', dudaResponse.status, errorText);
      throw new Error(`Duda API error: ${errorText}`);
    }

    // Update database
    const updateData: any = {
      site_status: action === 'publish' ? 'active' : 'draft',
      published: action === 'publish',
    };

    if (action === 'publish') {
      updateData.duda_last_published = new Date().toISOString();
    }

    await supabaseClient
      .from('provider_websites')
      .update(updateData)
      .eq('id', website.id);

    // Get live URL
    let liveUrl = null;
    if (action === 'publish') {
      const siteInfoResponse = await fetch(`https://api.duda.co/api/sites/multiscreen/${site_name}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authString}`,
        },
      });

      if (siteInfoResponse.ok) {
        const siteInfo = await siteInfoResponse.json();
        liveUrl = siteInfo.published_url || `https://${site_name}.duda.co`;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: action,
        site_status: updateData.site_status,
        live_url: liveUrl,
        message: `Site ${action}ed successfully`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error publishing/unpublishing Duda site:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
