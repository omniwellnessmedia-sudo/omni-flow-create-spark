import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('=== DUDA CONNECTION TEST ===');

    // Check environment variables
    const dudaUsername = Deno.env.get('DUDA_API_USERNAME');
    const dudaPassword = Deno.env.get('DUDA_API_PASSWORD');
    const dudaTemplateId = Deno.env.get('DUDA_PARTNER_TEMPLATE_ID');

    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {
        username_set: !!dudaUsername,
        password_set: !!dudaPassword,
        template_id_set: !!dudaTemplateId,
        template_id_value: dudaTemplateId || 'NOT SET',
      },
      credentials_valid: false,
      api_accessible: false,
      template_accessible: false,
      errors: [],
    };

    console.log('Environment Check:');
    console.log('- Username:', dudaUsername ? dudaUsername.substring(0, 4) + '***' : 'NOT SET');
    console.log('- Password:', dudaPassword ? `${dudaPassword.length} chars` : 'NOT SET');
    console.log('- Template ID:', dudaTemplateId || 'NOT SET');

    if (!dudaUsername || !dudaPassword) {
      results.errors.push('Missing DUDA_API_USERNAME or DUDA_API_PASSWORD');
      return new Response(
        JSON.stringify(results),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!dudaTemplateId) {
      results.errors.push('Missing DUDA_PARTNER_TEMPLATE_ID - should be "b998ee66"');
    }

    const authString = btoa(`${dudaUsername}:${dudaPassword}`);
    console.log('Auth String Length:', authString.length);

    // Test 1: Basic API connectivity - list sites
    console.log('\n=== TEST 1: API Connectivity ===');
    try {
      const apiTestResponse = await fetch('https://api.duda.co/api/sites/multiscreen', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API Test Status:', apiTestResponse.status);
      console.log('API Test Status Text:', apiTestResponse.statusText);

      if (apiTestResponse.ok) {
        results.credentials_valid = true;
        results.api_accessible = true;
        const sites = await apiTestResponse.json();
        results.site_count = sites.length || 0;
        console.log('✅ API accessible, found', results.site_count, 'sites');
      } else {
        const errorText = await apiTestResponse.text();
        results.errors.push(`API returned ${apiTestResponse.status}: ${errorText}`);
        console.error('❌ API Error:', apiTestResponse.status, errorText);
      }
    } catch (error) {
      results.errors.push(`API connectivity error: ${error.message}`);
      console.error('❌ API Connectivity Error:', error);
    }

    // Test 2: Template accessibility (only if template ID is set)
    if (dudaTemplateId) {
      console.log('\n=== TEST 2: Template Accessibility ===');
      try {
        const templateTestResponse = await fetch(
          `https://api.duda.co/api/sites/multiscreen/templates/${dudaTemplateId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${authString}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Template Test Status:', templateTestResponse.status);

        if (templateTestResponse.ok) {
          results.template_accessible = true;
          const templateInfo = await templateTestResponse.json();
          results.template_info = {
            template_id: templateInfo.template_id,
            template_name: templateInfo.template_name,
            preview_url: templateInfo.preview_url,
          };
          console.log('✅ Template accessible:', templateInfo.template_name);
        } else {
          const errorText = await templateTestResponse.text();
          results.errors.push(`Template not accessible: ${templateTestResponse.status} - ${errorText}`);
          console.error('❌ Template Error:', templateTestResponse.status, errorText);
        }
      } catch (error) {
        results.errors.push(`Template test error: ${error.message}`);
        console.error('❌ Template Test Error:', error);
      }
    }

    // Overall status
    results.overall_status = results.credentials_valid && results.api_accessible 
      ? (results.template_accessible ? 'READY' : 'TEMPLATE_ISSUE')
      : 'CREDENTIALS_ISSUE';

    console.log('\n=== TEST RESULTS ===');
    console.log('Overall Status:', results.overall_status);
    console.log('Credentials Valid:', results.credentials_valid);
    console.log('API Accessible:', results.api_accessible);
    console.log('Template Accessible:', results.template_accessible);
    console.log('Errors:', results.errors.length);

    const statusCode = results.overall_status === 'READY' ? 200 : 
                       results.overall_status === 'TEMPLATE_ISSUE' ? 206 : 401;

    return new Response(
      JSON.stringify(results, null, 2),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode,
      }
    );
  } catch (error) {
    console.error('❌ Test function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
