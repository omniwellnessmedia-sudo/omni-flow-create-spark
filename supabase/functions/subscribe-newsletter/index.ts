import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "omniwellnessmedia@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, full_name, source, interests } = await req.json();

    // Input validation
    const sanitizeInput = (input: string): string => {
      if (!input) return "";
      return input
        .replace(/[<>]/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "")
        .trim()
        .substring(0, 500);
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedName = full_name ? sanitizeInput(full_name) : null;
    const sanitizedSource = source ? sanitizeInput(source) : 'website';
    const sanitizedInterests = interests && Array.isArray(interests) 
      ? interests.map((i: string) => sanitizeInput(i)).slice(0, 10) 
      : null;

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, unsubscribed")
      .eq("email", sanitizedEmail)
      .single();

    if (existing) {
      if (existing.unsubscribed) {
        // Resubscribe
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({ 
            unsubscribed: false, 
            unsubscribed_at: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Resubscription error:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to resubscribe" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: "Welcome back! We're so glad you're here again. Check your inbox for a warm hello." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "You're already part of the Omni family! 🙏" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: sanitizedEmail,
        full_name: sanitizedName,
        source: sanitizedSource,
        interests: sanitizedInterests,
        confirmed: true,
        confirmed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to subscribe. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send welcome email to subscriber
    if (RESEND_API_KEY) {
      try {
        const welcomeHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #8B5CF6, #06B6D4, #10B981); color: white; padding: 40px 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { padding: 40px 30px; background: #ffffff; }
              .highlight { background: linear-gradient(135deg, #f0e7ff, #e0f7fa); padding: 20px; border-radius: 10px; margin: 20px 0; }
              .footer { background: #1F2937; color: #9CA3AF; padding: 30px; text-align: center; font-size: 12px; }
              .cta { display: inline-block; background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
              .social-link { color: #8B5CF6; text-decoration: none; margin: 0 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🙏 Welcome to Omni Wellness Media!</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Your journey to conscious living starts here</p>
              </div>
              <div class="content">
                <p>Hi${sanitizedName ? ` ${sanitizedName}` : ''},</p>
                <p>Thank you for joining the Omni Wellness Media community! You're now part of a movement dedicated to conscious media, wellness, and positive change.</p>
                
                <div class="highlight">
                  <h3 style="margin-top: 0; color: #8B5CF6;">🌟 What to Expect</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    <li>Inspiring content on wellness and conscious living</li>
                    <li>Updates on community projects like Valley of Plenty</li>
                    <li>Exclusive resources and educational materials</li>
                    <li>Special offers from our wellness partners</li>
                  </ul>
                </div>
                
                <p style="text-align: center;">
                  <a href="https://www.omniwellnessmedia.co.za" class="cta">Explore Our Website</a>
                </p>
                
                <p>We're excited to have you on this journey with us!</p>
                <p>With wellness,<br><strong>The Omni Wellness Media Team</strong></p>
              </div>
              <div class="footer">
                <p>Follow us for daily inspiration:</p>
                <p>
                  <a href="https://facebook.com/omniwellnessmedia" class="social-link">Facebook</a> |
                  <a href="https://instagram.com/omniwellnessmedia" class="social-link">Instagram</a> |
                  <a href="https://tiktok.com/@omniwellnessmedia" class="social-link">TikTok</a>
                </p>
                <p style="margin-top: 20px;">© ${new Date().getFullYear()} Omni Wellness Media</p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Send welcome email to subscriber
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Omni Wellness Media <onboarding@resend.dev>',
            to: [sanitizedEmail],
            subject: '🙏 Welcome to Omni Wellness Media!',
            html: welcomeHtml,
          }),
        });

        // Notify admin
        const adminHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10B981, #06B6D4); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 12px; }
              .label { font-weight: 600; color: #6B7280; font-size: 12px; text-transform: uppercase; }
              .value { color: #111827; font-size: 16px; margin-top: 4px; }
              .footer { background: #1F2937; color: #9CA3AF; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">📧 New Newsletter Subscriber</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value">${sanitizedEmail}</div>
                </div>
                ${sanitizedName ? `
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${sanitizedName}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Source</div>
                  <div class="value">${sanitizedSource}</div>
                </div>
                ${sanitizedInterests ? `
                <div class="field">
                  <div class="label">Interests</div>
                  <div class="value">${sanitizedInterests.join(', ')}</div>
                </div>
                ` : ''}
              </div>
              <div class="footer">
                <p>Subscriber added via omniwellnessmedia.co.za</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Omni Wellness Media <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `📧 New Subscriber: ${sanitizedEmail}`,
            html: adminHtml,
          }),
        });

        console.log("Newsletter emails sent successfully");
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Don't fail the subscription if email fails
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Welcome to the Omni family! We're so glad you're here. Check your inbox for a warm hello from our team. 🙏", data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
