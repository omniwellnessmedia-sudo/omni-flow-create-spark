import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      full_name,
      email,
      phone,
      service_category,
      experience_level,
      bio,
      website,
      has_certifications,
      has_insurance,
      offers_online,
      can_travel
    } = await req.json();

    // Validate required fields
    if (!full_name || !email || !service_category || !bio) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: full_name, email, service_category, bio' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Insert application
    const { data: application, error: insertError } = await supabaseClient
      .from('partner_applications')
      .insert({
        full_name: full_name.trim().slice(0, 200),
        email: email.trim().toLowerCase().slice(0, 255),
        phone: phone?.trim().slice(0, 30) || null,
        service_category,
        experience_level: experience_level || null,
        bio: bio.trim().slice(0, 2000),
        website: website?.trim().slice(0, 500) || null,
        has_certifications: !!has_certifications,
        has_insurance: !!has_insurance,
        offers_online: !!offers_online,
        can_travel: !!can_travel,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Send email notification via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: ['omniwellnessmedia@gmail.com'],
            subject: `New Partner Application: ${full_name}`,
            html: `
              <h2>New Partner Application Received</h2>
              <table style="border-collapse:collapse;width:100%;max-width:600px;">
                <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${full_name}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${phone || 'N/A'}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Category</td><td style="padding:8px;">${service_category}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Experience</td><td style="padding:8px;">${experience_level || 'N/A'}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Bio</td><td style="padding:8px;">${bio}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Website</td><td style="padding:8px;">${website || 'N/A'}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Certifications</td><td style="padding:8px;">${has_certifications ? 'Yes' : 'No'}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Insurance</td><td style="padding:8px;">${has_insurance ? 'Yes' : 'No'}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Online Services</td><td style="padding:8px;">${offers_online ? 'Yes' : 'No'}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Can Travel</td><td style="padding:8px;">${can_travel ? 'Yes' : 'No'}</td></tr>
              </table>
              <p style="margin-top:20px;">Review this application in the admin dashboard.</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('Failed to send notification email:', emailErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, application_id: application.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error submitting partner application:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
