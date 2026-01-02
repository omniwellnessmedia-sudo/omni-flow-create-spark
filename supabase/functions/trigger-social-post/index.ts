import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current time in SAST (UTC+2)
    const now = new Date();
    const sastOffset = 2 * 60; // 2 hours in minutes
    const sastTime = new Date(now.getTime() + (sastOffset * 60 * 1000));
    const currentDate = sastTime.toISOString().split('T')[0];
    const currentTime = sastTime.toISOString().split('T')[1].substring(0, 5);

    console.log(`Checking for posts to publish at ${currentDate} ${currentTime} SAST`);

    // Find posts that are due to be published (within 5 minute window)
    const { data: duePosts, error: fetchError } = await supabase
      .from('scheduled_social_posts')
      .select('*')
      .eq('status', 'scheduled')
      .eq('scheduled_date', currentDate)
      .lte('scheduled_time', currentTime)
      .order('scheduled_time', { ascending: true })
      .limit(10);

    if (fetchError) {
      throw fetchError;
    }

    if (!duePosts || duePosts.length === 0) {
      console.log('No posts due for publishing');
      return new Response(
        JSON.stringify({ message: 'No posts due', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${duePosts.length} posts to publish`);

    // Get Zapier webhook URL from settings
    const { data: settings } = await supabase
      .from('social_automation_settings')
      .select('setting_value')
      .eq('setting_key', 'zapier_webhook_url')
      .single();

    const webhookUrl = settings?.setting_value;

    if (!webhookUrl) {
      console.log('No Zapier webhook URL configured');
      // Mark posts as failed if no webhook is configured
      for (const post of duePosts) {
        await supabase
          .from('scheduled_social_posts')
          .update({ status: 'failed' })
          .eq('id', post.id);
      }
      return new Response(
        JSON.stringify({ error: 'No webhook URL configured', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const results = [];

    for (const post of duePosts) {
      try {
        // Prepare payload for Zapier
        const payload = {
          id: post.id,
          platform: post.platform,
          content: post.content_text,
          hashtags: post.hashtags?.join(' ') || '',
          image_url: post.image_url || '',
          campaign_name: post.campaign_name || '',
          content_pillar: post.content_pillar || '',
          scheduled_time: `${post.scheduled_date} ${post.scheduled_time}`,
        };

        console.log(`Sending post ${post.id} to Zapier for ${post.platform}`);

        // Send to Zapier webhook
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (webhookResponse.ok) {
          // Mark as posted
          await supabase
            .from('scheduled_social_posts')
            .update({ status: 'posted' })
            .eq('id', post.id);
          
          results.push({ id: post.id, status: 'posted', platform: post.platform });
          console.log(`Post ${post.id} sent successfully`);
        } else {
          // Mark as failed
          await supabase
            .from('scheduled_social_posts')
            .update({ status: 'failed' })
            .eq('id', post.id);
          
          results.push({ id: post.id, status: 'failed', error: await webhookResponse.text() });
          console.error(`Post ${post.id} failed: ${webhookResponse.status}`);
        }
      } catch (postError) {
        console.error(`Error processing post ${post.id}:`, postError);
        await supabase
          .from('scheduled_social_posts')
          .update({ status: 'failed' })
          .eq('id', post.id);
        
        results.push({ id: post.id, status: 'failed', error: String(postError) });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${results.length} posts`,
        count: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in trigger-social-post:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
