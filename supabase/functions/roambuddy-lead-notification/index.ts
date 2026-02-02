import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LeadNotificationRequest {
  email: string;
  messages: Message[];
  sessionId: string;
  capturedAt: string;
}

// Extract intelligence from conversation
function extractLeadIntelligence(messages: Message[]): {
  destination: string | null;
  duration: string | null;
  dataNeeds: string | null;
  device: string | null;
  urgency: string | null;
} {
  const fullConversation = messages.map(m => m.content.toLowerCase()).join(' ');
  
  // Destination detection
  const destinations = [
    'thailand', 'vietnam', 'japan', 'korea', 'singapore', 'malaysia', 'indonesia', 'bali',
    'philippines', 'cambodia', 'laos', 'myanmar', 'india', 'sri lanka', 'nepal',
    'usa', 'united states', 'america', 'canada', 'mexico',
    'uk', 'england', 'france', 'germany', 'spain', 'italy', 'portugal', 'greece',
    'netherlands', 'belgium', 'switzerland', 'austria', 'europe',
    'australia', 'new zealand',
    'dubai', 'uae', 'qatar', 'saudi arabia',
    'south africa', 'kenya', 'egypt', 'morocco',
    'brazil', 'argentina', 'chile', 'peru', 'colombia'
  ];
  const destination = destinations.find(d => fullConversation.includes(d)) || null;
  
  // Duration detection
  const durationMatch = fullConversation.match(/(\d+)\s*(days?|weeks?|months?)/i);
  const duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : null;
  
  // Data needs detection
  let dataNeeds = null;
  if (fullConversation.includes('video call') || fullConversation.includes('work')) {
    dataNeeds = 'Heavy usage (video calls, work)';
  } else if (fullConversation.includes('stream') || fullConversation.includes('netflix') || fullConversation.includes('youtube')) {
    dataNeeds = 'Heavy usage (streaming)';
  } else if (fullConversation.includes('social') || fullConversation.includes('instagram') || fullConversation.includes('whatsapp')) {
    dataNeeds = 'Medium usage (social media)';
  } else if (fullConversation.includes('maps') || fullConversation.includes('navigation') || fullConversation.includes('light')) {
    dataNeeds = 'Light usage (maps, messaging)';
  }
  
  // Device detection
  let device = null;
  if (fullConversation.includes('iphone')) device = 'iPhone';
  else if (fullConversation.includes('samsung')) device = 'Samsung';
  else if (fullConversation.includes('pixel')) device = 'Google Pixel';
  else if (fullConversation.includes('android')) device = 'Android';
  
  // Urgency detection
  let urgency = null;
  if (fullConversation.includes('tomorrow') || fullConversation.includes('today')) {
    urgency = '🔥 Leaving very soon!';
  } else if (fullConversation.includes('next week') || fullConversation.includes('few days')) {
    urgency = '⚡ Leaving within a week';
  } else if (fullConversation.includes('next month') || fullConversation.includes('planning')) {
    urgency = '📅 Planning ahead';
  }
  
  return { destination, duration, dataNeeds, device, urgency };
}

function formatConversation(messages: Message[]): string {
  return messages.map(m => {
    const prefix = m.role === 'assistant' ? 'Roam' : 'User';
    // Truncate long messages
    const content = m.content.length > 200 ? m.content.substring(0, 200) + '...' : m.content;
    return `${prefix}: ${content}`;
  }).join('\n');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, messages, sessionId, capturedAt }: LeadNotificationRequest = await req.json();
    
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(RESEND_API_KEY);
    
    // Extract intelligence from conversation
    const intelligence = extractLeadIntelligence(messages);
    
    // Format the captured date
    const capturedDate = new Date(capturedAt);
    const formattedDate = capturedDate.toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Johannesburg'
    });

    // Build the email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New RoamBuddy Lead</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎯 New eSIM Lead Captured!</h1>
    </div>
    
    <!-- Lead Details -->
    <div style="padding: 24px;">
      <div style="background-color: #f0f9ff; border-left: 4px solid #2563eb; padding: 16px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Lead Email</p>
        <p style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 600;">${email}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">📅 Captured</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500;">${formattedDate}</span>
          </td>
        </tr>
        ${intelligence.destination ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">🌍 Destination</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500; text-transform: capitalize;">${intelligence.destination}${intelligence.duration ? ` (${intelligence.duration})` : ''}</span>
          </td>
        </tr>
        ` : ''}
        ${intelligence.dataNeeds ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">📱 Data Needs</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500;">${intelligence.dataNeeds}</span>
          </td>
        </tr>
        ` : ''}
        ${intelligence.device ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">📲 Device</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500;">${intelligence.device}</span>
          </td>
        </tr>
        ` : ''}
        ${intelligence.urgency ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">⏰ Urgency</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500;">${intelligence.urgency}</span>
          </td>
        </tr>
        ` : ''}
      </table>
      
      <!-- Conversation Transcript -->
      <div style="margin-top: 24px;">
        <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">💬 Conversation Transcript</h3>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #334155; max-height: 400px; overflow-y: auto;">${formatConversation(messages)}</div>
      </div>
      
      <!-- Quick Actions -->
      <div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px; margin: 0 0 12px 0;">Quick Actions:</p>
        <a href="https://omni-flow-create-spark.lovable.app/admin/roambuddy-sales" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-right: 10px; margin-bottom: 10px;">View Dashboard</a>
        <a href="https://omni-flow-create-spark.lovable.app/admin/newsletter" style="display: inline-block; background-color: #64748b; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">All Subscribers</a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">RoamBuddy AI Sales Bot • Omni Wellness Media</p>
      <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Session ID: ${sessionId}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'RoamBuddy <onboarding@resend.dev>',
      to: ['omniwellnessmedia@gmail.com'],
      subject: `🎯 New RoamBuddy Lead: ${email}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Lead notification sent successfully:", data);

    return new Response(JSON.stringify({ 
      success: true,
      messageId: data?.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in roambuddy-lead-notification:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
