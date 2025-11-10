import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting scheduled auto-curation...');

    // Get products before curation
    const { data: beforeProducts, error: beforeError } = await supabase
      .from('affiliate_products')
      .select('id, name, is_featured, is_trending')
      .eq('is_active', true);

    if (beforeError) throw beforeError;

    // Run auto-curation function
    const { error: curationError } = await supabase.rpc('auto_curate_featured_products');
    
    if (curationError) throw curationError;

    // Get products after curation
    const { data: afterProducts, error: afterError } = await supabase
      .from('affiliate_products')
      .select('id, name, is_featured, is_trending, image_url, price_zar, commission_rate')
      .eq('is_active', true);

    if (afterError) throw afterError;

    // Calculate changes
    const beforeFeatured = new Set(beforeProducts?.filter(p => p.is_featured).map(p => p.id) || []);
    const afterFeatured = new Set(afterProducts?.filter(p => p.is_featured).map(p => p.id) || []);
    const beforeTrending = new Set(beforeProducts?.filter(p => p.is_trending).map(p => p.id) || []);
    const afterTrending = new Set(afterProducts?.filter(p => p.is_trending).map(p => p.id) || []);

    const newFeatured = afterProducts?.filter(p => afterFeatured.has(p.id) && !beforeFeatured.has(p.id)) || [];
    const newTrending = afterProducts?.filter(p => afterTrending.has(p.id) && !beforeTrending.has(p.id)) || [];
    const removedFeatured = beforeProducts?.filter(p => beforeFeatured.has(p.id) && !afterFeatured.has(p.id)) || [];
    const removedTrending = beforeProducts?.filter(p => beforeTrending.has(p.id) && !afterTrending.has(p.id)) || [];

    const report = {
      executedAt: new Date().toISOString(),
      featured: {
        total: afterFeatured.size,
        added: newFeatured.length,
        removed: removedFeatured.length,
        newProducts: newFeatured.slice(0, 5).map(p => ({
          name: p.name,
          price: p.price_zar,
          commission: p.commission_rate,
          image: p.image_url
        }))
      },
      trending: {
        total: afterTrending.size,
        added: newTrending.length,
        removed: removedTrending.length,
        newProducts: newTrending.slice(0, 5).map(p => ({
          name: p.name,
          price: p.price_zar,
          commission: p.commission_rate,
          image: p.image_url
        }))
      }
    };

    console.log('Auto-curation completed:', report);

    // Invoke email notification function
    try {
      const { error: emailError } = await supabase.functions.invoke('send-curation-report', {
        body: { report }
      });
      
      if (emailError) {
        console.error('Failed to send email report:', emailError);
      } else {
        console.log('Email report sent successfully');
      }
    } catch (emailErr) {
      console.error('Error invoking email function:', emailErr);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        report,
        message: 'Auto-curation completed successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in scheduled-auto-curate:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to run auto-curation'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
