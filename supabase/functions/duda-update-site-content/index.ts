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

    const { site_name, updates } = await req.json();

    if (!site_name || !updates) {
      throw new Error('Missing required fields: site_name, updates');
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

    console.log('Updating Duda site content:', site_name);

    // Update site content via Duda API
    const dudaResponse = await fetch(`https://api.duda.co/api/sites/multiscreen/${site_name}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site_data: {
          site_texts: {
            custom: updates
          }
        }
      }),
    });

    if (!dudaResponse.ok) {
      const errorText = await dudaResponse.text();
      console.error('Duda API error:', dudaResponse.status, errorText);
      throw new Error(`Duda API error: ${errorText}`);
    }

    // Update local database record
    const localUpdates: any = {};
    if (updates.hero_title) localUpdates.page_title = updates.hero_title;
    if (updates.hero_subtitle) localUpdates.page_subtitle = updates.hero_subtitle;
    if (updates.about_text) localUpdates.about_section = updates.about_text;

    if (Object.keys(localUpdates).length > 0) {
      await supabaseClient
        .from('provider_websites')
        .update(localUpdates)
        .eq('id', website.id);
    }

    // Auto-publish if enabled
    if (website.auto_publish) {
      await fetch(`https://api.duda.co/api/sites/multiscreen/publish/${site_name}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json',
        },
      });

      await supabaseClient
        .from('provider_websites')
        .update({
          duda_last_published: new Date().toISOString(),
          site_status: 'active',
        })
        .eq('id', website.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Content updated successfully',
        auto_published: website.auto_publish,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error updating Duda site content:', error);
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
