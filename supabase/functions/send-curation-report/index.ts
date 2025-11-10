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
    const { report } = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get admin emails from user_roles table
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .in('role', ['admin', 'super_admin']);

    if (rolesError) throw rolesError;

    const adminUserIds = adminRoles?.map(r => r.user_id) || [];
    
    // Get profiles for admin emails
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email')
      .in('id', adminUserIds);

    if (profilesError) throw profilesError;

    const adminEmails = profiles?.map(p => p.email).filter(Boolean) || [];
    
    // Add primary admin email
    const recipientEmails = ['omnimediawellness@gmail.com', ...adminEmails];

    const date = new Date(report.executedAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Product Curation Report</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📊 Daily Curation Report</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${date}</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <!-- Featured Products Section -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">⭐ Featured Products</h2>
      <div style="display: grid; gap: 10px; margin: 15px 0;">
        <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 5px;">
          <span>Total Featured:</span>
          <strong style="color: #667eea;">${report.featured.total}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px; background: #e7f5e9; border-radius: 5px;">
          <span>Newly Added:</span>
          <strong style="color: #28a745;">+${report.featured.added}</strong>
        </div>
        ${report.featured.removed > 0 ? `
        <div style="display: flex; justify-content: space-between; padding: 10px; background: #ffe8e8; border-radius: 5px;">
          <span>Removed:</span>
          <strong style="color: #dc3545;">-${report.featured.removed}</strong>
        </div>
        ` : ''}
      </div>
      
      ${report.featured.newProducts.length > 0 ? `
      <h3 style="font-size: 16px; margin: 20px 0 10px 0; color: #495057;">New Featured Products:</h3>
      <div style="display: grid; gap: 15px;">
        ${report.featured.newProducts.map(product => `
        <div style="display: flex; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; align-items: center;">
          ${product.image ? `
          <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; border: 2px solid #dee2e6;">
          ` : ''}
          <div style="flex: 1;">
            <div style="font-weight: bold; color: #212529; margin-bottom: 5px;">${product.name}</div>
            <div style="display: flex; gap: 15px; font-size: 14px;">
              <span style="color: #28a745; font-weight: bold;">R${product.price?.toFixed(0) || 'N/A'}</span>
              <span style="color: #667eea; background: #e7e9fc; padding: 2px 8px; border-radius: 3px;">
                ${((product.commission || 0) * 100).toFixed(0)}% Commission
              </span>
            </div>
          </div>
        </div>
        `).join('')}
      </div>
      ` : ''}
    </div>

    <!-- Trending Products Section -->
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #764ba2;">
      <h2 style="color: #764ba2; margin-top: 0; font-size: 20px;">🔥 Trending Products</h2>
      <div style="display: grid; gap: 10px; margin: 15px 0;">
        <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 5px;">
          <span>Total Trending:</span>
          <strong style="color: #764ba2;">${report.trending.total}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px; background: #e7f5e9; border-radius: 5px;">
          <span>Newly Added:</span>
          <strong style="color: #28a745;">+${report.trending.added}</strong>
        </div>
        ${report.trending.removed > 0 ? `
        <div style="display: flex; justify-content: space-between; padding: 10px; background: #ffe8e8; border-radius: 5px;">
          <span>Removed:</span>
          <strong style="color: #dc3545;">-${report.trending.removed}</strong>
        </div>
        ` : ''}
      </div>

      ${report.trending.newProducts.length > 0 ? `
      <h3 style="font-size: 16px; margin: 20px 0 10px 0; color: #495057;">New Trending Products:</h3>
      <div style="display: grid; gap: 15px;">
        ${report.trending.newProducts.map(product => `
        <div style="display: flex; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; align-items: center;">
          ${product.image ? `
          <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; border: 2px solid #dee2e6;">
          ` : ''}
          <div style="flex: 1;">
            <div style="font-weight: bold; color: #212529; margin-bottom: 5px;">${product.name}</div>
            <div style="display: flex; gap: 15px; font-size: 14px;">
              <span style="color: #28a745; font-weight: bold;">R${product.price?.toFixed(0) || 'N/A'}</span>
              <span style="color: #764ba2; background: #f3e7fc; padding: 2px 8px; border-radius: 3px;">
                ${((product.commission || 0) * 100).toFixed(0)}% Commission
              </span>
            </div>
          </div>
        </div>
        `).join('')}
      </div>
      ` : ''}
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://omniwellnessmedia.lovable.app/admin" 
         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        View Admin Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px;">
      <p style="margin: 5px 0;">
        This is an automated report from <strong>Omni Wellness Media</strong>
      </p>
      <p style="margin: 5px 0;">
        Auto-curation runs daily at 2:00 AM SAST
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email via Resend
    for (const email of recipientEmails) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Omni Wellness Media <noreply@omniwellnessmedia.com>',
          to: [email],
          subject: `Daily Product Curation Report - ${date}`,
          html: emailHtml,
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        console.error(`Failed to send email to ${email}:`, errorText);
      } else {
        console.log(`Email sent successfully to ${email}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Report sent to ${recipientEmails.length} recipients`,
        recipients: recipientEmails
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-curation-report:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send curation report'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
