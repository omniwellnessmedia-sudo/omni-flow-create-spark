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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this is a test email request
    const body = await req.json().catch(() => ({}));
    
    if (body.test) {
      // Send test email
      const { email, subject, html, from_name } = body;
      
      console.log(`Sending test email to ${email}`);
      
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${from_name} <onboarding@resend.dev>`,
          to: [email],
          subject: `[TEST] ${subject}`,
          html: html,
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        throw new Error(`Resend API error: ${errorText}`);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Test email sent' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process scheduled newsletters
    const now = new Date();
    console.log(`Checking for newsletters to send at ${now.toISOString()}`);

    // Find campaigns that are scheduled and due
    const { data: dueCampaigns, error: fetchError } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_send_time', now.toISOString())
      .limit(5);

    if (fetchError) {
      throw fetchError;
    }

    if (!dueCampaigns || dueCampaigns.length === 0) {
      console.log('No newsletters due for sending');
      return new Response(
        JSON.stringify({ message: 'No newsletters due', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${dueCampaigns.length} newsletters to send`);

    // Get confirmed subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email, full_name')
      .eq('confirmed', true)
      .eq('unsubscribed', false);

    if (subError) {
      throw subError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No confirmed subscribers found');
      return new Response(
        JSON.stringify({ message: 'No subscribers', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Sending to ${subscribers.length} subscribers`);

    const results = [];

    for (const campaign of dueCampaigns) {
      try {
        // Mark as sending
        await supabase
          .from('newsletter_campaigns')
          .update({ status: 'sending' })
          .eq('id', campaign.id);

        let sentCount = 0;
        let failCount = 0;

        // Send to each subscriber (in batches for production, simplified here)
        for (const subscriber of subscribers) {
          try {
            // Personalize HTML if needed
            let personalizedHtml = campaign.html_content;
            if (subscriber.full_name) {
              personalizedHtml = personalizedHtml.replace(
                /{{name}}/g, 
                subscriber.full_name
              );
            }

            const resendResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: `${campaign.from_name} <onboarding@resend.dev>`,
                to: [subscriber.email],
                subject: campaign.subject,
                html: personalizedHtml,
              }),
            });

            if (resendResponse.ok) {
              sentCount++;
            } else {
              failCount++;
              console.error(`Failed to send to ${subscriber.email}`);
            }

            // Rate limiting - small delay between emails
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (emailError) {
            failCount++;
            console.error(`Error sending to ${subscriber.email}:`, emailError);
          }
        }

        // Update campaign status
        await supabase
          .from('newsletter_campaigns')
          .update({ 
            status: 'sent',
            sent_count: sentCount
          })
          .eq('id', campaign.id);

        results.push({
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          sent: sentCount,
          failed: failCount,
        });

        console.log(`Campaign ${campaign.id} sent: ${sentCount} success, ${failCount} failed`);

      } catch (campaignError) {
        console.error(`Error processing campaign ${campaign.id}:`, campaignError);
        
        // Mark as draft on error (so it can be retried)
        await supabase
          .from('newsletter_campaigns')
          .update({ status: 'draft' })
          .eq('id', campaign.id);

        results.push({
          campaign_id: campaign.id,
          error: String(campaignError),
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${results.length} campaigns`,
        count: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-scheduled-newsletter:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
