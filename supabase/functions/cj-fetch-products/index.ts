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
    const CJ_PAT = Deno.env.get('CJ_PERSONAL_ACCESS_TOKEN');

    if (!CJ_PAT) {
      throw new Error('CJ Personal Access Token not configured');
    }

    const { category, keywords, limit = 50 } = await req.json();

    console.log('Fetching CJ products via GraphQL:', { category, keywords, limit });

    // Build GraphQL query for product search
    const searchKeywords = keywords || category || 'wellness';
    const graphqlQuery = {
      query: `
        query ProductSearch {
          products(
            searchText: "${searchKeywords}"
            first: ${limit}
          ) {
            totalCount
            edges {
              node {
                id
                name
                description
                advertiserId
                advertiserName
                price {
                  amount
                  currency
                }
                imageUrl
                buyUrl
                category
              }
            }
          }
        }
      `
    };

    console.log('GraphQL Query:', JSON.stringify(graphqlQuery, null, 2));

    // Call CJ GraphQL API
    const response = await fetch(
      'https://productcatalog.api.cj.com/query',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CJ_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CJ GraphQL API error:', response.status, errorText);
      throw new Error(`CJ API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('CJ GraphQL API response:', JSON.stringify(data, null, 2));

    // Check for GraphQL errors
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const productsData = data.data?.products;
    const totalCount = productsData?.totalCount || 0;
    const edges = productsData?.edges || [];

    console.log('Products found:', {
      totalCount,
      productsReturned: edges.length
    });

    // Transform CJ products to our format
    const products = edges.map((edge: any) => {
      const product = edge.node;
      const priceAmount = product.price?.amount || 0;
      
      return {
        affiliate_program_id: 'cj',
        external_product_id: product.id,
        name: product.name,
        description: product.description || '',
        category: product.category || 'General Wellness',
        image_url: product.imageUrl,
        affiliate_url: product.buyUrl,
        price_usd: priceAmount,
        price_zar: priceAmount * 18.5, // Approximate ZAR conversion
        price_eur: priceAmount * 0.92, // Approximate EUR conversion
        commission_rate: 0.08, // Default 8%, will vary by advertiser
        is_active: true,
        last_synced_at: new Date().toISOString(),
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        totalRecords: totalCount,
        products,
        metadata: {
          category,
          keywords,
          searchText: searchKeywords,
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