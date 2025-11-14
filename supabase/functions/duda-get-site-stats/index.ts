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

    const url = new URL(req.url);
    const site_name = url.searchParams.get('site_name');
    const period = url.searchParams.get('period') || '30d';

    if (!site_name) {
      throw new Error('Missing required parameter: site_name');
    }

    // Verify ownership
    const { data: website } = await supabaseClient
      .from('provider_websites')
      .select('*')
      .eq('provider_id', user.id)
      .eq('duda_site_name', site_name)
      .single();

    if (!website) {
      throw new Error('Website not found or unauthorized');
    }

    // Validate credentials
    const dudaUsername = Deno.env.get('DUDA_API_USERNAME');
    const dudaPassword = Deno.env.get('DUDA_API_PASSWORD');

    if (!dudaUsername || !dudaPassword) {
      console.error('❌ Missing Duda credentials');
      throw new Error('Duda API credentials not configured');
    }

    console.log('✅ Credentials validated for stats');
    const authString = btoa(`${dudaUsername}:${dudaPassword}`);

    // Calculate date range
    const periodDays = parseInt(period.replace('d', ''));
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    console.log('=== FETCHING DUDA STATS ===');
    console.log('Site Name:', site_name);
    console.log('Period:', period);
    console.log('Date Range:', startDate.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);

    // Fetch stats from Duda API
    const dudaResponse = await fetch(
      `https://api.duda.co/api/sites/multiscreen/analytics/${site_name}?from=${startDate.toISOString().split('T')[0]}&to=${endDate.toISOString().split('T')[0]}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authString}`,
        },
      }
    );

    let stats = {
      page_views: 0,
      unique_visitors: 0,
      bounce_rate: 0,
      avg_session_duration: 0,
    };

    if (dudaResponse.ok) {
      const dudaStats = await dudaResponse.json();
      stats = {
        page_views: dudaStats.page_views || 0,
        unique_visitors: dudaStats.unique_visitors || 0,
        bounce_rate: dudaStats.bounce_rate || 0,
        avg_session_duration: dudaStats.avg_session_duration || 0,
      };
    } else {
      console.warn('Duda stats API returned non-200:', dudaResponse.status);
    }

    // Store stats in database
    const { data: savedStats, error: statsError } = await supabaseClient
      .from('partner_website_stats')
      .upsert({
        provider_id: user.id,
        website_id: website.id,
        period_start: startDate.toISOString().split('T')[0],
        period_end: endDate.toISOString().split('T')[0],
        ...stats,
      })
      .select()
      .single();

    if (statsError) {
      console.error('Error saving stats:', statsError);
    }

    // Calculate commission (10% of revenue)
    const revenue = 0; // TODO: Implement revenue tracking from bookings
    const commission_zar = revenue * 0.10;
    const commission_wellcoins = Math.floor(commission_zar * 10); // 1 ZAR = 10 WellCoins

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          ...stats,
          revenue_generated_zar: revenue,
          commission_earned_zar: commission_zar,
          commission_earned_wellcoins: commission_wellcoins,
        },
        period: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
          days: periodDays,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching Duda site stats:', error);
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
