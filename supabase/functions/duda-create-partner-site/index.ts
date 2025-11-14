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

    const { business_name, custom_subdomain } = await req.json();

    // Verify user is a provider
    const { data: providerProfile } = await supabaseClient
      .from('provider_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!providerProfile) {
      throw new Error('User is not a provider');
    }

    // Generate unique site name
    const siteName = custom_subdomain || 
      `${business_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-omni-wellness`;

    // Check if site already exists for this provider
    const { data: existingSite } = await supabaseClient
      .from('provider_websites')
      .select('*')
      .eq('provider_id', user.id)
      .maybeSingle();

    if (existingSite && existingSite.duda_site_name) {
      return new Response(
        JSON.stringify({ 
          error: 'Site already exists for this provider',
          existing_site: {
            site_name: existingSite.duda_site_name,
            site_url: existingSite.duda_site_url,
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Prepare Duda API credentials
    const dudaUsername = Deno.env.get('DUDA_API_USERNAME');
    const dudaPassword = Deno.env.get('DUDA_API_PASSWORD');
    const dudaTemplateId = Deno.env.get('DUDA_PARTNER_TEMPLATE_ID') || 'omni-wellness-partner';

    if (!dudaUsername || !dudaPassword) {
      throw new Error('Duda API credentials not configured');
    }

    const authString = btoa(`${dudaUsername}:${dudaPassword}`);

    console.log('Creating Duda site:', siteName);

    // Create site from template via Duda API
    const dudaResponse = await fetch('https://api.duda.co/api/sites/multiscreen/create', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: dudaTemplateId,
        site_name: siteName,
        site_data: {
          site_business_info: {
            business_name: business_name,
            email: user.email,
          },
          site_texts: {
            overview: providerProfile.description || '',
          }
        }
      }),
    });

    if (!dudaResponse.ok) {
      const errorText = await dudaResponse.text();
      console.error('Duda API error:', dudaResponse.status, errorText);
      throw new Error(`Duda API error: ${errorText}`);
    }

    const dudaSite = await dudaResponse.json();

    console.log('Duda site created:', dudaSite);

    // Store site details in database
    const websiteData = {
      provider_id: user.id,
      duda_site_name: siteName,
      duda_site_url: dudaSite.preview_url || `https://${siteName}.multiscreensite.com`,
      duda_external_id: dudaSite.site_name || siteName,
      duda_template_id: dudaTemplateId,
      duda_created_at: new Date().toISOString(),
      site_status: 'draft',
      page_title: business_name,
      published: false,
    };

    let savedWebsite;
    if (existingSite) {
      // Update existing website record
      const { data, error } = await supabaseClient
        .from('provider_websites')
        .update(websiteData)
        .eq('id', existingSite.id)
        .select()
        .single();

      if (error) throw error;
      savedWebsite = data;
    } else {
      // Create new website record
      const { data, error } = await supabaseClient
        .from('provider_websites')
        .insert(websiteData)
        .select()
        .single();

      if (error) throw error;
      savedWebsite = data;
    }

    return new Response(
      JSON.stringify({
        success: true,
        site_name: siteName,
        preview_url: dudaSite.preview_url || `https://${siteName}.multiscreensite.com`,
        editor_url: `https://editor.duda.co/editor/${siteName}`,
        duda_external_id: dudaSite.site_name || siteName,
        website_id: savedWebsite.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating Duda site:', error);
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
