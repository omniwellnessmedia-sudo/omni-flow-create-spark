import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Official CJ Product Feed GraphQL endpoint
// Reference: https://developers.cj.com/graphql/reference/Product%20Feed
const CJ_PRODUCT_FEED_ENDPOINT = 'https://ads.api.cj.com/query';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CJ_PAT = Deno.env.get('CJ_PERSONAL_ACCESS_TOKEN');
    const CJ_COMPANY_ID = Deno.env.get('CJ_COMPANY_ID');

    if (!CJ_PAT) {
      throw new Error('CJ Personal Access Token not configured');
    }

    if (!CJ_COMPANY_ID) {
      throw new Error('CJ Company ID not configured. Please add your CJ_COMPANY_ID secret in Supabase.');
    }

    const { category, keywords, limit = 100 } = await req.json();
    const searchKeywords = keywords || category || 'wellness';

    console.log('Fetching CJ products via GraphQL:', { category, keywords, limit, companyId: CJ_COMPANY_ID });

    // Build GraphQL query for Product Search using the official CJ Product Feed API
    // Reference: https://developers.cj.com/graphql/reference/Product%20Feed
    const graphqlQuery = {
      query: `
        query ProductSearch($companyId: ID!, $keywords: [String!], $limit: Int) {
          products(
            companyId: $companyId
            keywords: $keywords
            limit: $limit
          ) {
            totalCount
            resultList {
              id
              title
              description
              advertiserId
              advertiserName
              price {
                amount
                currency
              }
              imageUrl
              link
              catalogId
            }
          }
        }
      `,
      variables: {
        companyId: CJ_COMPANY_ID,
        keywords: [searchKeywords],
        limit: limit
      }
    };

    console.log('GraphQL Query:', JSON.stringify(graphqlQuery, null, 2));

    const response = await fetch(CJ_PRODUCT_FEED_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CJ_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CJ API error (${response.status}):`, errorText);
      throw new Error(`CJ API returned HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✓ Success:`, JSON.stringify(data, null, 2));

    // Check for GraphQL errors
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const productsData = data.data?.products;
    const totalCount = productsData?.totalCount || 0;
    const resultList = productsData?.resultList || [];

    console.log('Products found:', {
      totalCount,
      productsReturned: resultList.length
    });

    // Transform CJ products to our format
    const products = resultList.map((product: any) => {
      const priceAmount = parseFloat(product.price?.amount || '0');
      
      return {
        affiliate_program_id: 'cj',
        external_product_id: product.id,
        name: product.title,
        description: product.description || '',
        category: category || 'General Wellness',
        image_url: product.imageUrl || null,
        affiliate_url: product.link || '',
        price_usd: priceAmount,
        price_zar: priceAmount * 18.5, // Approximate ZAR conversion
        price_eur: priceAmount * 0.92, // Approximate EUR conversion
        commission_rate: 0.08, // Default 8%, will vary by advertiser
        is_active: true,
        last_synced_at: new Date().toISOString(),
        advertiser_id: product.advertiserId || null,
        advertiser_name: product.advertiserName || null,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        totalRecords: totalCount,
        products,
        metadata: {
          category,
          keywords: searchKeywords,
          fetchedAt: new Date().toISOString(),
          endpoint: CJ_PRODUCT_FEED_ENDPOINT
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
