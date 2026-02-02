import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Chad's WhatsApp number
const CHAD_WHATSAPP = "27748315961";

interface WhatsAppRequest {
  type: 'lead' | 'sale';
  email: string;
  destination?: string;
  duration?: string;
  productName?: string;
  amount?: number;
  currency?: string;
  orderId?: string;
}

function formatLeadMessage(data: WhatsAppRequest): string {
  return `🎯 *New RoamBuddy Lead!*

📧 Email: ${data.email}
${data.destination ? `🌍 Destination: ${data.destination}` : ''}
${data.duration ? `📅 Duration: ${data.duration}` : ''}

_Captured via AI Sales Bot_`;
}

function formatSaleMessage(data: WhatsAppRequest): string {
  const currencySymbol = data.currency === 'USD' ? '$' : 'R';
  return `💰 *New RoamBuddy Sale!*

📦 ${data.productName || 'eSIM Plan'}
💵 ${currencySymbol}${data.amount?.toFixed(2) || '0.00'}
📧 ${data.email}
${data.destination ? `🌍 ${data.destination}` : ''}
${data.orderId ? `🔖 Order: ${data.orderId}` : ''}

_Ka-ching! 🎉_`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: WhatsAppRequest = await req.json();
    
    console.log("📱 Processing WhatsApp notification:", data.type);

    // Check for Twilio credentials
    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    const TWILIO_WHATSAPP_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM");

    // If Twilio is not configured, return WhatsApp click-to-chat URL instead
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
      console.log("⚠️ Twilio not configured, generating click-to-chat link");
      
      const message = data.type === 'lead' 
        ? formatLeadMessage(data) 
        : formatSaleMessage(data);
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappLink = `https://wa.me/${CHAD_WHATSAPP}?text=${encodedMessage}`;
      
      return new Response(JSON.stringify({ 
        success: true,
        method: 'click-to-chat',
        whatsappLink,
        message: 'WhatsApp link generated (Twilio not configured)'
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If Twilio is configured, send automated message
    const message = data.type === 'lead' 
      ? formatLeadMessage(data) 
      : formatSaleMessage(data);

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const authString = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_WHATSAPP_FROM,
        To: `whatsapp:+${CHAD_WHATSAPP}`,
        Body: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twilio error:", errorText);
      throw new Error(`Twilio API error: ${response.status}`);
    }

    const twilioData = await response.json();
    console.log("✅ WhatsApp message sent via Twilio:", twilioData.sid);

    return new Response(JSON.stringify({ 
      success: true,
      method: 'twilio',
      messageId: twilioData.sid,
      message: 'WhatsApp message sent successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-whatsapp:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
