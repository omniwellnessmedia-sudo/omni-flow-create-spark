import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const CJ_API_KEY = Deno.env.get('CJ_AFFILIATE_API_KEY');
    const CJ_CID = Deno.env.get('CJ_AFFILIATE_CID');

    if (!CJ_API_KEY || !CJ_CID) {
      throw new Error('CJ Affiliate credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get commission reports from CJ
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    console.log('Fetching CJ commissions:', {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    const response = await fetch(
      `https://commission-detail.api.cj.com/v3/commissions?date-type=event&start-date=${startDate.toISOString().split('T')[0]}&end-date=${endDate.toISOString().split('T')[0]}`,
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
      throw new Error(`CJ API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('CJ commissions fetched:', data.records?.length || 0);

    const commissionsToStore = [];

    // Process each commission
    for (const commission of data.records || []) {
      const commissionData = {
        affiliate_program_id: 'cj',
        click_id: commission.websiteId || null,
        product_id: commission.sku || commission.orderId,
        product_name: commission.productName || 'Unknown Product',
        order_amount: parseFloat(commission.saleAmount?.amount || '0'),
        commission_amount: parseFloat(commission.commissionAmount?.amount || '0'),
        commission_currency: commission.commissionAmount?.currency || 'USD',
        commission_rate: parseFloat(commission.commissionRate || '0'),
        status: commission.actionStatus === 'locked' ? 'approved' : 'pending',
        notes: `Order ID: ${commission.orderId}, Action ID: ${commission.actionTrackerId}`,
        created_at: commission.eventDate,
      };

      commissionsToStore.push(commissionData);
    }

    // Store commissions in database
    if (commissionsToStore.length > 0) {
      const { data: inserted, error } = await supabase
        .from('affiliate_commissions')
        .upsert(commissionsToStore, {
          onConflict: 'click_id,product_id',
          ignoreDuplicates: false,
        })
        .select();

      if (error) {
        console.error('Error storing commissions:', error);
        throw error;
      }

      console.log('Stored commissions:', inserted?.length || 0);
    }

    return new Response(
      JSON.stringify({
        success: true,
        commissionsProcessed: commissionsToStore.length,
        totalEarnings: commissionsToStore.reduce((sum, c) => sum + c.commission_amount, 0),
        currency: 'USD',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error tracking CJ commissions:', error);
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