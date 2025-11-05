import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CJ_PAT = Deno.env.get('CJ_PERSONAL_ACCESS_TOKEN');

    if (!CJ_PAT) {
      throw new Error('CJ Personal Access Token not configured');
    }

    console.log('Running CJ connectivity check...');
    
    const results = {
      productCatalog: { status: 'unknown', endpoint: '', error: null as any },
      commissions: { status: 'unknown', endpoint: '', error: null as any },
      auth: { status: 'unknown', error: null as any },
    };

    // Test endpoints list for Product Catalog
    const productCatalogEndpoints = [
      'https://productcatalog.api.cj.com/query',
      'https://product-catalog.api.cj.com/query',
      'https://catalog.api.cj.com/query',
    ];

    // Test Product Catalog endpoints
    for (const endpoint of productCatalogEndpoints) {
      try {
        console.log(`Testing Product Catalog endpoint: ${endpoint}`);
        
        const testQuery = {
          query: `query { __typename }` // Simple introspection query
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CJ_PAT}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testQuery)
        });

        results.productCatalog.endpoint = endpoint;
        results.productCatalog.status = response.ok ? 'success' : 'failed';
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✓ Product Catalog working at ${endpoint}:`, data);
          results.auth.status = 'success';
          break; // Found working endpoint
        } else {
          const errorText = await response.text();
          results.productCatalog.error = `HTTP ${response.status}: ${errorText}`;
          console.error(`✗ Product Catalog failed at ${endpoint}:`, errorText);
        }
      } catch (error) {
        results.productCatalog.error = error.message;
        console.error(`✗ Product Catalog error at ${endpoint}:`, error.message);
      }
    }

    // Test Commissions API (known good endpoint)
    try {
      console.log('Testing Commissions API...');
      const response = await fetch('https://commissions.api.cj.com/query', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CJ_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query { __typename }`
        })
      });

      results.commissions.endpoint = 'https://commissions.api.cj.com/query';
      results.commissions.status = response.ok ? 'success' : 'failed';

      if (!response.ok) {
        const errorText = await response.text();
        results.commissions.error = `HTTP ${response.status}: ${errorText}`;
      }
    } catch (error) {
      results.commissions.error = error.message;
      results.commissions.status = 'error';
    }

    // Determine overall auth status
    if (results.productCatalog.status === 'success' || results.commissions.status === 'success') {
      results.auth.status = 'success';
    } else if (results.productCatalog.error || results.commissions.error) {
      results.auth.status = 'failed';
      results.auth.error = 'Authentication may be invalid or endpoints unreachable';
    }

    console.log('Connectivity check results:', JSON.stringify(results, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        results,
        recommendations: generateRecommendations(results),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Connectivity check error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateRecommendations(results: any): string[] {
  const recommendations: string[] = [];

  if (results.productCatalog.status !== 'success') {
    recommendations.push('Product Catalog API is not accessible. Check if your CJ account has access to the Product Catalog API.');
    recommendations.push('Verify your CJ_PERSONAL_ACCESS_TOKEN is valid and has the correct permissions.');
  }

  if (results.commissions.status !== 'success') {
    recommendations.push('Commissions API is not accessible. This may indicate authentication issues.');
  }

  if (results.auth.status !== 'success') {
    recommendations.push('Check your CJ Personal Access Token in Supabase edge function secrets.');
    recommendations.push('Ensure your token has not expired and has the required scopes.');
  }

  if (recommendations.length === 0) {
    recommendations.push('All connectivity checks passed! You can proceed with product sync.');
  }

  return recommendations;
}
