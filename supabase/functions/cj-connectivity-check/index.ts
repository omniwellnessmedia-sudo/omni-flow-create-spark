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
      productFeed: { status: 'unknown', endpoint: 'https://ads.api.cj.com/query', error: null as any },
      commissions: { status: 'unknown', endpoint: '', error: null as any },
      auth: { status: 'unknown', error: null as any },
      companyId: { status: 'unknown', error: null as any },
    };

    // Check for Company ID
    const CJ_COMPANY_ID = Deno.env.get('CJ_COMPANY_ID');
    if (!CJ_COMPANY_ID) {
      results.companyId.status = 'missing';
      results.companyId.error = 'CJ_COMPANY_ID not configured';
      console.error('✗ CJ_COMPANY_ID not configured');
    } else {
      results.companyId.status = 'configured';
      console.log(`✓ CJ_COMPANY_ID configured: ${CJ_COMPANY_ID}`);
    }

    // Test Product Feed API (official endpoint)
    try {
      console.log('Testing Product Feed API at https://ads.api.cj.com/query');
      
      const testQuery = {
        query: `query { __typename }` // Simple introspection query
      };

      const response = await fetch('https://ads.api.cj.com/query', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CJ_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testQuery)
      });

      results.productFeed.status = response.ok ? 'success' : 'failed';
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✓ Product Feed API working:`, data);
        results.auth.status = 'success';
      } else {
        const errorText = await response.text();
        results.productFeed.error = `HTTP ${response.status}: ${errorText}`;
        console.error(`✗ Product Feed API failed:`, errorText);
      }
    } catch (error) {
      results.productFeed.error = error.message;
      results.productFeed.status = 'error';
      console.error(`✗ Product Feed API error:`, error.message);
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
    if (results.productFeed.status === 'success' || results.commissions.status === 'success') {
      results.auth.status = 'success';
    } else if (results.productFeed.error || results.commissions.error) {
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

  if (results.companyId.status === 'missing') {
    recommendations.push('⚠️ CRITICAL: Add your CJ_COMPANY_ID secret in Supabase. This is required for Product Feed API access.');
    recommendations.push('Find your Company ID in CJ Account Manager under Settings > Company Information.');
  }

  if (results.productFeed.status !== 'success') {
    recommendations.push('Product Feed API is not accessible. Check if your CJ account has Product Feed API access enabled.');
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
    recommendations.push('✅ All connectivity checks passed! You can proceed with product sync.');
  }

  return recommendations;
}
