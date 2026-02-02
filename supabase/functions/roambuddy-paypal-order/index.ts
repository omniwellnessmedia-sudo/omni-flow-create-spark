import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Get PayPal access token via OAuth
async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal OAuth error:", response.status, errorText);
    throw new Error(`Failed to get PayPal access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, amount, description, orderId } = await req.json();
    console.log(`PayPal order action: ${action}`, { amount, description, orderId });

    const accessToken = await getPayPalAccessToken();

    if (action === "create") {
      // Create PayPal order server-side with proper OAuth
      const orderPayload = {
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: amount,
          },
          description: description,
        }],
        // No billing address required for digital goods
        application_context: {
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "Omni Wellness - RoamBuddy",
        },
      };

      console.log("Creating PayPal order:", JSON.stringify(orderPayload));

      const response = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body: JSON.stringify(orderPayload),
      });

      const order = await response.json();
      
      if (!response.ok) {
        console.error("PayPal create order error:", response.status, order);
        throw new Error(order.message || `Failed to create order: ${response.status}`);
      }

      console.log("PayPal order created:", order.id);

      return new Response(JSON.stringify({ 
        success: true,
        orderId: order.id,
        status: order.status 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "capture") {
      if (!orderId) {
        throw new Error("Order ID is required for capture");
      }

      console.log(`Capturing PayPal order: ${orderId}`);

      const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error("PayPal capture error:", response.status, result);
        throw new Error(result.message || `Failed to capture order: ${response.status}`);
      }

      console.log("PayPal order captured:", result.id, result.status);

      return new Response(JSON.stringify({ 
        success: true,
        ...result 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error(`Invalid action: ${action}`);

  } catch (error) {
    console.error("PayPal order error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
