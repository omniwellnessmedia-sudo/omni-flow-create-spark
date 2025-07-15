import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { sessionId, orderId } = await req.json();
    
    console.log('Verifying payment:', { sessionId, orderId });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      throw new Error("Session not found");
    }

    // Get order from database
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    let updateData: any = {
      stripe_payment_intent_id: session.payment_intent,
      updated_at: new Date().toISOString()
    };

    // Update order status based on payment status
    if (session.payment_status === 'paid') {
      updateData.status = 'completed';
      
      // Generate mock eSIM data for completed orders
      if (order.product_type === 'esim') {
        updateData.esim_qr_code = `QR_${order.order_number}_${Date.now()}`;
        updateData.esim_activation_code = `ESIM_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        // For demo: Try to create actual RoamBuddy order
        try {
          const roambuddyResult = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/roambuddy-api`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`
            },
            body: JSON.stringify({
              action: 'createOrder',
              data: {
                product_id: order.product_id,
                product_name: order.product_name,
                amount: order.amount,
                currency: order.currency,
                customer_email: order.customer_email,
                customer_name: order.customer_name,
                destination: order.destination
              }
            })
          });
          
          const roambuddyData = await roambuddyResult.json();
          if (roambuddyData?.success && roambuddyData?.order_id) {
            updateData.roambuddy_order_id = roambuddyData.order_id;
            updateData.notes = 'RoamBuddy order created successfully';
          }
        } catch (error) {
          console.log('RoamBuddy order creation failed (using demo data):', error);
          updateData.notes = 'Demo eSIM - Real integration pending';
        }
      }
    } else if (session.payment_status === 'unpaid') {
      updateData.status = 'failed';
    }

    // Update order in database
    const { error: updateError } = await supabaseService
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) {
      console.error('Order update error:', updateError);
      throw new Error('Failed to update order');
    }

    console.log('Payment verified and order updated:', {
      orderId,
      status: updateData.status,
      paymentStatus: session.payment_status
    });

    return new Response(JSON.stringify({
      success: true,
      order: {
        ...order,
        ...updateData
      },
      paymentStatus: session.payment_status
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to verify payment' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});