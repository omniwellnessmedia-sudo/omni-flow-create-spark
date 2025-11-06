import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract domain from advertiser name
const extractDomain = (advertiserName: string): string => {
  if (!advertiserName) return '';
  const cleaned = advertiserName
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/(inc|llc|ltd|corp|corporation|company|co)$/i, '');
  return `${cleaned}.com`;
};

// Fetch brand logo from Clearbit
const fetchBrandLogo = async (advertiserName: string): Promise<string | null> => {
  if (!advertiserName) return null;
  
  const domain = extractDomain(advertiserName);
  
  try {
    const clearbitUrl = `https://logo.clearbit.com/${domain}`;
    const response = await fetch(clearbitUrl, { method: 'HEAD' });
    if (response.ok) {
      return clearbitUrl;
    }
  } catch (error) {
    console.log(`Logo fetch failed for ${domain}:`, error);
  }
  
  return null;
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

    console.log('Fetching brands without logos...');

    // Get all brands that don't have logos yet
    const { data: brands, error: fetchError } = await supabaseClient
      .from('affiliate_brands')
      .select('*')
      .is('logo_url', null);

    if (fetchError) {
      console.error('Error fetching brands:', fetchError);
      throw fetchError;
    }

    if (!brands || brands.length === 0) {
      console.log('No brands need logo updates');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No brands need logo updates',
          updated: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    console.log(`Found ${brands.length} brands needing logos`);

    // Fetch logos for each brand
    const updates = await Promise.all(
      brands.map(async (brand) => {
        const logoUrl = await fetchBrandLogo(brand.name);
        if (logoUrl) {
          return {
            id: brand.id,
            logo_url: logoUrl
          };
        }
        return null;
      })
    );

    // Filter out nulls and update brands with logos
    const validUpdates = updates.filter(u => u !== null);
    
    let updatedCount = 0;
    for (const update of validUpdates) {
      const { error: updateError } = await supabaseClient
        .from('affiliate_brands')
        .update({ logo_url: update.logo_url })
        .eq('id', update.id);

      if (updateError) {
        console.error(`Error updating brand ${update.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} brand logos`);

    return new Response(
      JSON.stringify({
        success: true,
        total: brands.length,
        updated: updatedCount,
        message: `Updated ${updatedCount} of ${brands.length} brands`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in fetch-brand-logos:', error);
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