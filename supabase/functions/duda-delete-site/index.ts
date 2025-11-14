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

    const { site_name, permanent } = await req.json();

    if (!site_name) {
      throw new Error('Missing required field: site_name');
    }

    // Verify ownership or admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.user_type === 'admin';

    const { data: website } = await supabaseClient
      .from('provider_websites')
      .select('*')
      .eq('duda_site_name', site_name)
      .single();

    if (!website) {
      throw new Error('Website not found');
    }

    if (website.provider_id !== user.id && !isAdmin) {
      throw new Error('Unauthorized to delete this site');
    }

    const dudaUsername = Deno.env.get('DUDA_API_USERNAME');
    const dudaPassword = Deno.env.get('DUDA_API_PASSWORD');

    if (!dudaUsername || !dudaPassword) {
      throw new Error('Duda API credentials not configured');
    }

    const authString = btoa(`${dudaUsername}:${dudaPassword}`);

    console.log('Deleting Duda site:', site_name, 'permanent:', permanent);

    if (permanent) {
      // Permanently delete from Duda (use with caution!)
      const dudaResponse = await fetch(`https://api.duda.co/api/sites/multiscreen/${site_name}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${authString}`,
        },
      });

      if (!dudaResponse.ok && dudaResponse.status !== 404) {
        const errorText = await dudaResponse.text();
        console.error('Duda delete error:', dudaResponse.status, errorText);
      }

      // Delete from database
      await supabaseClient
        .from('provider_websites')
        .delete()
        .eq('id', website.id);
    } else {
      // Soft delete - unpublish and mark as deleted
      await fetch(`https://api.duda.co/api/sites/multiscreen/unpublish/${site_name}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
        },
      });

      await supabaseClient
        .from('provider_websites')
        .update({
          site_status: 'deleted',
          published: false,
        })
        .eq('id', website.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: permanent ? 'Site permanently deleted' : 'Site soft deleted (can be restored)',
        permanent: permanent || false,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error deleting Duda site:', error);
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
