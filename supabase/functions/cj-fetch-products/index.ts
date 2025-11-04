import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CJProduct {
  catalogId: string;
  advertiserId: string;
  advertiserName: string;
  name: string;
  description: string;
  keywords: string[];
  price: {
    currency: string;
    amount: number;
  };
  imageUrl: string;
  buyUrl: string;
  category: {
    primary: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CJ_API_KEY = Deno.env.get('CJ_AFFILIATE_API_KEY');
    const CJ_CID = Deno.env.get('CJ_AFFILIATE_CID');

    if (!CJ_API_KEY || !CJ_CID) {
      throw new Error('CJ Affiliate credentials not configured');
    }

    const { category, keywords, limit = 50 } = await req.json();

    console.log('Fetching CJ products:', { category, keywords, limit });

    // Build CJ API request
    const params = new URLSearchParams({
      'website-id': CJ_CID,
      'records-per-page': limit.toString(),
    });

    if (category) params.append('category', category);
    if (keywords) params.append('keywords', keywords);

    // Call CJ Product Catalog Search API
    const response = await fetch(
      `https://product-search.api.cj.com/v2/product-search?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${CJ_API_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CJ API error:', response.status, errorText);
      throw new Error(`CJ API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('CJ API response:', {
      totalRecords: data.totalRecords,
      productsReturned: data.products?.length || 0
    });

    // Transform CJ products to our format
    const products = data.products?.map((product: CJProduct) => ({
      affiliate_program_id: 'cj',
      external_product_id: product.catalogId,
      name: product.name,
      description: product.description || '',
      category: product.category?.primary || 'General Wellness',
      image_url: product.imageUrl,
      affiliate_url: product.buyUrl,
      price_usd: product.price?.amount || 0,
      price_zar: (product.price?.amount || 0) * 18.5, // Approximate ZAR conversion
      price_eur: (product.price?.amount || 0) * 0.92, // Approximate EUR conversion
      commission_rate: 0.08, // Default 8%, will vary by advertiser
      is_active: true,
      last_synced_at: new Date().toISOString(),
    })) || [];

    return new Response(
      JSON.stringify({
        success: true,
        totalRecords: data.totalRecords,
        products,
        metadata: {
          category,
          keywords,
          fetchedAt: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error fetching CJ products:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});