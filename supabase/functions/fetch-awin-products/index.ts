import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AwinProductFeed {
  product_id: string;
  product_name: string;
  description?: string;
  merchant_name?: string;
  merchant_id?: string;
  aw_deep_link: string;
  search_price: string;
  currency: string;
  category_name?: string;
  aw_image_url?: string;
  brand_name?: string;
  commission_group?: string;
  base_price?: string;
  delivery_cost?: string;
  condition?: string;
  colour?: string;
  size?: string;
  material?: string;
  ean?: string;
  mpn?: string;
  specifications?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const awinApiToken = Deno.env.get('AWIN_API_TOKEN');
    const awinPublisherId = Deno.env.get('AWIN_PUBLISHER_ID');

    if (!awinApiToken || !awinPublisherId) {
      throw new Error('Awin API credentials not configured');
    }

    console.log('[AWIN] Fetching product feeds using Awin API...');

    // Awin requires fetching from individual advertiser product feeds
    // First, get active programs
    const programsUrl = `https://api.awin.com/publishers/${awinPublisherId}/programmes`;
    console.log('[AWIN] Fetching programs from:', programsUrl);
    
    const programsResponse = await fetch(programsUrl, {
      headers: {
        'Authorization': `Bearer ${awinApiToken}`,
      },
    });

    if (!programsResponse.ok) {
      throw new Error(`Awin API error: ${programsResponse.status} - ${await programsResponse.text()}`);
    }

    const programs = await programsResponse.json();
    console.log('[AWIN] Found', programs?.length || 0, 'programs');

    // Since direct product feed access requires specific advertiser setup,
    // we'll guide the user to manually download and upload their product feed
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Awin product feeds require manual setup. Please follow these steps:',
        programs_available: programs?.length || 0,
        instructions: [
          '1. Go to your Awin dashboard → Tools → Product Feeds',
          '2. Select an advertiser/merchant you want to promote',
          '3. Download their product feed (usually CSV or JSON format)',
          '4. Use the "Upload JSON" button to import the products',
          '5. Or contact Awin support to get API access to specific advertiser product feeds'
        ],
        alternative: 'For now, use the existing products in the database or manually curate products from advertisers'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[AWIN] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
