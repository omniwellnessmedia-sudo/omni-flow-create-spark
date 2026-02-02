import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Chad's WhatsApp number for notifications
const CHAD_WHATSAPP = "27748315961";

interface SaleNotificationRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  productName: string;
  amount: number;
  currency: string;
  destination?: string;
  dataAmount?: string;
  validityDays?: number;
  completedAt: string;
  // eSIM activation details
  iccid?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  apn?: string;
  dataRoaming?: string;
}

function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'ZAR': 'R',
    'EUR': '€',
    'GBP': '£'
  };
  return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
}

function estimateCommission(amount: number): number {
  // Estimate ~10% commission on eSIM sales
  return amount * 0.10;
}

function generateWhatsAppLink(sale: SaleNotificationRequest): string {
  const message = `🎉 New RoamBuddy Sale!

📦 ${sale.productName}
💰 ${formatCurrency(sale.amount, sale.currency)}
📧 ${sale.customerEmail}
👤 ${sale.customerName}
🌍 ${sale.destination || 'International'}

Order: ${sale.orderId}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CHAD_WHATSAPP}?text=${encodedMessage}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const saleData: SaleNotificationRequest = await req.json();
    
    console.log("📧 Processing sale notification for order:", saleData.orderId);
    
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(RESEND_API_KEY);
    
    // Format the sale date
    const saleDate = new Date(saleData.completedAt);
    const formattedDate = saleDate.toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Johannesburg'
    });

    const commission = estimateCommission(saleData.amount);
    const whatsappLink = generateWhatsAppLink(saleData);

    // Build the email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New RoamBuddy Sale</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">💰 New eSIM Sale!</h1>
      <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 28px; font-weight: bold;">${formatCurrency(saleData.amount, saleData.currency)}</p>
    </div>
    
    <!-- Sale Details -->
    <div style="padding: 24px;">
      
      <!-- Product Info -->
      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Product</p>
        <p style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 600;">📦 ${saleData.productName}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">🌍 Destination</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500;">${saleData.destination || 'International'}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">📧 Customer Email</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500;">${saleData.customerEmail}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">👤 Customer Name</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500;">${saleData.customerName}</span>
          </td>
        </tr>
        ${saleData.dataAmount ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">📶 Data</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500;">${saleData.dataAmount}</span>
          </td>
        </tr>
        ` : ''}
        ${saleData.validityDays ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 14px;">📅 Validity</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #0f172a; font-weight: 500;">${saleData.validityDays} days</span>
          </td>
        </tr>
        ` : ''}
      </table>
      
      <!-- Order Details -->
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #0f172a; font-size: 14px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Order ID</td>
            <td style="padding: 8px 0; text-align: right; color: #0f172a; font-weight: 500; font-family: monospace;">${saleData.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status</td>
            <td style="padding: 8px 0; text-align: right;">
              <span style="background-color: #10b981; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Completed</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Payment</td>
            <td style="padding: 8px 0; text-align: right; color: #0f172a; font-weight: 500;">PayPal</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date</td>
            <td style="padding: 8px 0; text-align: right; color: #0f172a; font-weight: 500;">${formattedDate}</td>
          </tr>
        </table>
      </div>
      
      <!-- Commission -->
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <p style="margin: 0 0 4px 0; font-size: 14px; color: #92400e;">Estimated Commission</p>
        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #b45309;">~${formatCurrency(commission, saleData.currency)}</p>
      </div>
      
      <!-- Quick Actions -->
      <div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px; margin: 0 0 12px 0;">Quick Actions:</p>
        <table style="width: 100%;">
          <tr>
            <td style="padding-right: 8px;">
              <a href="https://omni-flow-create-spark.lovable.app/admin/roambuddy-sales" style="display: block; background-color: #10b981; color: #ffffff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; text-align: center;">📊 View Dashboard</a>
            </td>
            <td style="padding-left: 8px;">
              <a href="${whatsappLink}" style="display: block; background-color: #25D366; color: #ffffff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; text-align: center;">📱 Open in WhatsApp</a>
            </td>
          </tr>
        </table>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">RoamBuddy eSIM Store • Omni Wellness Media</p>
      <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Order: ${saleData.orderId}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'RoamBuddy Sales <onboarding@resend.dev>',
      to: ['omniwellnessmedia@gmail.com'],
      subject: `💰 New RoamBuddy Sale: ${formatCurrency(saleData.amount, saleData.currency)}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("✅ Admin sale notification sent successfully:", data);
    console.log("📱 WhatsApp link included:", whatsappLink);

    // Send customer confirmation email with eSIM activation details
    let customerEmailResult = null;
    if (saleData.qrCodeUrl || saleData.qrCode) {
      console.log("📧 Sending customer eSIM activation email to:", saleData.customerEmail);
      
      const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your eSIM is Ready!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🌍 Your eSIM is Ready!</h1>
      <p style="color: #d1fae5; margin: 12px 0 0 0; font-size: 18px;">${saleData.destination || 'International Travel'}</p>
    </div>
    
    <!-- Welcome Message -->
    <div style="padding: 24px;">
      <p style="color: #0f172a; font-size: 16px; margin: 0 0 16px 0;">Hi ${saleData.customerName},</p>
      <p style="color: #64748b; font-size: 14px; margin: 0 0 24px 0;">Thank you for your purchase! Your eSIM is ready to be installed. Follow the instructions below to get connected.</p>
      
      <!-- QR Code Section -->
      <div style="background-color: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <h2 style="color: #059669; font-size: 18px; margin: 0 0 16px 0;">📱 SCAN TO ACTIVATE</h2>
        ${saleData.qrCodeUrl ? `<img src="${saleData.qrCodeUrl}" alt="eSIM QR Code" style="max-width: 200px; height: auto; margin: 0 auto 16px auto; display: block; border-radius: 8px; border: 1px solid #e2e8f0;" />` : ''}
        <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">Or enter this code manually:</p>
        <code style="display: block; background-color: #ffffff; padding: 12px; border-radius: 6px; font-size: 11px; color: #0f172a; word-break: break-all; border: 1px solid #e2e8f0;">${saleData.qrCode || 'N/A'}</code>
      </div>
      
      <!-- Installation Instructions -->
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 16px 0;">📲 HOW TO INSTALL YOUR eSIM</h3>
        
        <div style="margin-bottom: 16px;">
          <p style="color: #0f172a; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">iPhone (iOS 12.1+):</p>
          <ol style="color: #64748b; font-size: 13px; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 4px;">Go to <strong>Settings → Cellular → Add eSIM</strong></li>
            <li style="margin-bottom: 4px;">Tap <strong>"Use QR Code"</strong> and scan the code above</li>
            <li>Follow the prompts to activate</li>
          </ol>
        </div>
        
        <div>
          <p style="color: #0f172a; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">Android:</p>
          <ol style="color: #64748b; font-size: 13px; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 4px;">Go to <strong>Settings → Network & Internet → SIMs</strong></li>
            <li style="margin-bottom: 4px;">Tap <strong>"Add eSIM"</strong> or <strong>"Download eSIM"</strong></li>
            <li>Scan the QR code above</li>
          </ol>
        </div>
      </div>
      
      <!-- Important Notes -->
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <h4 style="color: #92400e; font-size: 14px; margin: 0 0 8px 0;">⚠️ IMPORTANT</h4>
        <ul style="color: #92400e; font-size: 13px; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">Install <strong>BEFORE</strong> you travel (while on WiFi)</li>
          <li style="margin-bottom: 4px;">Enable <strong>Data Roaming</strong> when you arrive</li>
          <li>APN: <strong>${saleData.apn || 'plus'}</strong> (usually auto-configured)</li>
        </ul>
      </div>
      
      <!-- Order Summary -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <h3 style="color: #0f172a; font-size: 14px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Product</td>
            <td style="padding: 8px 0; text-align: right; color: #0f172a; font-weight: 500; font-size: 13px;">${saleData.productName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Amount Paid</td>
            <td style="padding: 8px 0; text-align: right; color: #0f172a; font-weight: 500; font-size: 13px;">${formatCurrency(saleData.amount, saleData.currency)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Order ID</td>
            <td style="padding: 8px 0; text-align: right; color: #0f172a; font-family: monospace; font-size: 12px;">${saleData.orderId}</td>
          </tr>
          ${saleData.iccid ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">ICCID</td>
            <td style="padding: 8px 0; text-align: right; color: #0f172a; font-family: monospace; font-size: 11px;">${saleData.iccid}</td>
          </tr>
          ` : ''}
        </table>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0;">Need help? Contact us at <a href="mailto:omniwellnessmedia@gmail.com" style="color: #10b981;">omniwellnessmedia@gmail.com</a></p>
      <p style="color: #94a3b8; font-size: 11px; margin: 0;">RoamBuddy eSIM Store • Omni Wellness Media</p>
      <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Safe travels! 🌍✈️</p>
    </div>
  </div>
</body>
</html>
      `;

      try {
        const customerResult = await resend.emails.send({
          from: 'RoamBuddy eSIM <onboarding@resend.dev>',
          to: [saleData.customerEmail],
          subject: `🌍 Your eSIM is Ready! - ${saleData.productName}`,
          html: customerEmailHtml,
        });

        if (customerResult.error) {
          console.error("Customer email error:", customerResult.error);
        } else {
          console.log("✅ Customer eSIM email sent successfully:", customerResult.data);
          customerEmailResult = customerResult.data;
        }
      } catch (customerEmailError) {
        console.error("Failed to send customer email (non-blocking):", customerEmailError);
      }
    } else {
      console.log("⚠️ No eSIM activation details provided, skipping customer email");
    }

    // Initialize Supabase for logging
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Log admin notification to database
    await supabase.from("notification_logs").insert({
      notification_type: 'sale_complete',
      recipient: 'omniwellnessmedia@gmail.com',
      payload: saleData,
      status: 'sent',
      message_id: data?.id
    });

    // Log customer notification if sent
    if (customerEmailResult) {
      await supabase.from("notification_logs").insert({
        notification_type: 'customer_esim_activation',
        recipient: saleData.customerEmail,
        payload: { orderId: saleData.orderId, iccid: saleData.iccid, productName: saleData.productName },
        status: 'sent',
        message_id: customerEmailResult?.id
      });
    }

    // Try to send WhatsApp notification (non-blocking)
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({
          type: 'sale',
          email: saleData.customerEmail,
          destination: saleData.destination,
          productName: saleData.productName,
          amount: saleData.amount,
          currency: saleData.currency,
          orderId: saleData.orderId
        })
      });
    } catch (whatsappError) {
      console.error("WhatsApp notification failed (non-blocking):", whatsappError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      messageId: data?.id,
      whatsappLink: whatsappLink
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in roambuddy-sale-notification:", error);

    // Log failed notification
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      await supabase.from("notification_logs").insert({
        notification_type: 'sale_complete',
        recipient: 'omniwellnessmedia@gmail.com',
        payload: {},
        status: 'failed',
        error_message: error instanceof Error ? error.message : "Unknown error"
      });
    } catch (logError) {
      console.error("Failed to log notification error:", logError);
    }

    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
