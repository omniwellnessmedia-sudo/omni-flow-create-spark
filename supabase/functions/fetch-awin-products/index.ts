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

    console.log('[AWIN] Fetching product feeds...');

    // Fetch product feed from Awin API
    // Using the product feed endpoint - adjust based on actual Awin API structure
    const awinApiUrl = `https://productdata.awin.com/${awinPublisherId}/${awinPublisherId}_aw.csv`;
    
    console.log('[AWIN] Requesting:', awinApiUrl);
    
    const response = await fetch(awinApiUrl, {
      headers: {
        'Authorization': `Bearer ${awinApiToken}`,
      },
    });

    if (!response.ok) {
      // If CSV endpoint doesn't work, try alternative JSON feed endpoint
      console.log('[AWIN] CSV feed failed, trying alternative endpoint...');
      
      // Alternative: Try fetching from merchant program list first
      const programsUrl = `https://api.awin.com/publishers/${awinPublisherId}/programmes`;
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

      // For now, return info about available programs
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Product feed endpoint needs configuration. Please check Awin documentation for your specific feed URL.',
          programs_available: programs?.length || 0,
          next_steps: [
            'Check your Awin dashboard for the correct product feed URL',
            'Update the edge function with your specific feed endpoint',
            'Ensure your publisher account has access to product feeds'
          ]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse CSV feed
    const csvText = await response.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    console.log('[AWIN] CSV Headers:', headers);

    const products: any[] = [];
    
    for (let i = 1; i < Math.min(lines.length, 100); i++) { // Limit to 100 products for initial sync
      const line = lines[i];
      if (!line.trim()) continue;

      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const product: any = {};
      
      headers.forEach((header, index) => {
        product[header] = values[index];
      });

      // Map Awin product to our schema
      const mappedProduct = {
        affiliate_program_id: 'awin',
        external_product_id: product.product_id || product.id,
        name: product.product_name || product.name,
        description: product.description,
        price_zar: parseFloat(product.search_price || product.price || '0'),
        commission_rate: parseFloat(product.commission_amount || '0.05'),
        category: product.category_name || product.category,
        image_url: product.aw_image_url || product.image_url,
        affiliate_url: product.aw_deep_link || product.deep_link,
        advertiser_name: product.merchant_name || product.advertiser_name,
        advertiser_id: product.merchant_id || product.advertiser_id,
        brand: product.brand_name || product.brand,
        condition: product.condition,
        color: product.colour || product.color,
        size: product.size,
        material: product.material,
        gtin: product.ean,
        mpn: product.mpn,
        is_active: true,
        is_featured: false,
      };

      products.push(mappedProduct);
    }

    console.log('[AWIN] Parsed', products.length, 'products');

    // Batch upsert products
    if (products.length > 0) {
      const { data, error } = await supabase
        .from('affiliate_products')
        .upsert(products, {
          onConflict: 'affiliate_program_id,external_product_id',
          ignoreDuplicates: false,
        });

      if (error) {
        console.error('[AWIN] Database error:', error);
        throw error;
      }

      console.log('[AWIN] Successfully synced', products.length, 'products');

      // Call auto-curation
      try {
        await supabase.rpc('auto_curate_awin_products');
        console.log('[AWIN] Auto-curation triggered');
      } catch (e) {
        console.log('[AWIN] Auto-curation not available:', e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        products_synced: products.length,
        message: `Successfully fetched and synced ${products.length} products from Awin`,
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
