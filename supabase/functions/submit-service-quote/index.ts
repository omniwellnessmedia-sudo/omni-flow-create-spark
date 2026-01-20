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

    const { 
      name, 
      email, 
      phone, 
      company, 
      service_type, 
      project_details, 
      budget_range, 
      timeline 
    } = await req.json();

    // Input sanitization function to prevent XSS
    const sanitizeInput = (input: string): string => {
      if (!input) return "";
      return input
        .replace(/[<>]/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "")
        .trim()
        .substring(0, 2000);
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;

    if (!name || !email || !service_type || !project_details) {
      return new Response(
        JSON.stringify({ error: "Name, email, service type, and project details are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (phone && !phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid phone number" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Sanitize all inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;
    const sanitizedCompany = company ? sanitizeInput(company) : null;
    const sanitizedServiceType = sanitizeInput(service_type);
    const sanitizedProjectDetails = sanitizeInput(project_details);
    const sanitizedBudgetRange = budget_range ? sanitizeInput(budget_range) : null;
    const sanitizedTimeline = timeline ? sanitizeInput(timeline) : null;

    const { data, error } = await supabase
      .from("service_quotes")
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        company: sanitizedCompany,
        service_type: sanitizedServiceType,
        project_details: sanitizedProjectDetails,
        budget_range: sanitizedBudgetRange,
        timeline: sanitizedTimeline,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit service quote" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Send email notification to Omni Wellness Media
    if (RESEND_API_KEY) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 15px; }
              .label { font-weight: 600; color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
              .value { color: #111827; font-size: 16px; margin-top: 4px; }
              .footer { background: #1F2937; color: #9CA3AF; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
              .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">🌟 New Service Quote Request</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Omni Wellness Media</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Client Name</div>
                  <div class="value">${sanitizedName}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></div>
                </div>
                ${sanitizedPhone ? `
                <div class="field">
                  <div class="label">Phone</div>
                  <div class="value">${sanitizedPhone}</div>
                </div>
                ` : ''}
                ${sanitizedCompany ? `
                <div class="field">
                  <div class="label">Company</div>
                  <div class="value">${sanitizedCompany}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Service Type</div>
                  <div class="value" style="color: #8B5CF6; font-weight: 600;">${sanitizedServiceType}</div>
                </div>
                <div class="field">
                  <div class="label">Project Details</div>
                  <div class="value">${sanitizedProjectDetails}</div>
                </div>
                ${sanitizedBudgetRange ? `
                <div class="field">
                  <div class="label">Budget Range</div>
                  <div class="value">${sanitizedBudgetRange}</div>
                </div>
                ` : ''}
                ${sanitizedTimeline ? `
                <div class="field">
                  <div class="label">Timeline</div>
                  <div class="value">${sanitizedTimeline}</div>
                </div>
                ` : ''}
                <a href="mailto:${sanitizedEmail}?subject=Re: ${sanitizedServiceType} Quote Request" class="cta">
                  Reply to Client
                </a>
              </div>
              <div class="footer">
                <p>This quote was submitted via omniwellnessmedia.co.za</p>
                <p>© ${new Date().getFullYear()} Omni Wellness Media</p>
              </div>
            </div>
          </body>
          </html>
        `;

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Omni Wellness Media <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `🌟 New Quote Request: ${sanitizedServiceType} - ${sanitizedName}`,
            html: emailHtml,
            reply_to: sanitizedEmail,
          }),
        });

        if (!resendResponse.ok) {
          const errorText = await resendResponse.text();
          console.error("Failed to send notification email:", errorText);
        } else {
          console.log("Quote notification email sent to", ADMIN_EMAIL);
        }
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Don't fail the request if email fails - quote is already saved
      }
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
