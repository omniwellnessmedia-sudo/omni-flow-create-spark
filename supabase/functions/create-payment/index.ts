import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client for database operations
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { productData, customerData, successUrl, cancelUrl } = await req.json();
    
    console.log('Creating payment for:', productData);

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Create or retrieve Stripe customer
    let customerId;
    if (customerData.email) {
      const customers = await stripe.customers.list({ 
        email: customerData.email, 
        limit: 1 
      });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: customerData.email,
          name: customerData.name || 'Wellness Traveler',
        });
        customerId = customer.id;
      }
    }

    // Generate order number
    const orderNumber = `OMW-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // Create order in database first
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert({
        order_number: orderNumber,
        product_id: productData.id,
        product_name: productData.name,
        product_type: productData.category || 'esim',
        amount: productData.price,
        currency: productData.currency || 'USD',
        customer_email: customerData.email,
        customer_name: customerData.name || 'Wellness Traveler',
        destination: productData.destination,
        data_amount: productData.data_amount,
        validity_days: productData.validity_days,
        coverage: productData.coverage,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerData.email,
      line_items: [
        {
          price_data: {
            currency: productData.currency?.toLowerCase() || 'usd',
            product_data: {
              name: productData.name,
              description: `${productData.data_amount} for ${productData.validity_days} days`,
              metadata: {
                type: productData.category || 'esim',
                destination: productData.destination || '',
                coverage: productData.coverage?.join(', ') || ''
              }
            },
            unit_amount: Math.round(productData.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/payment-cancelled?order_id=${order.id}`,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
        product_type: productData.category || 'esim'
      }
    });

    // Update order with Stripe session ID
    await supabaseService
      .from('orders')
      .update({
        stripe_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    console.log('Payment session created:', {
      sessionId: session.id,
      orderId: order.id,
      orderNumber: orderNumber
    });

    return new Response(JSON.stringify({ 
      url: session.url,
      orderId: order.id,
      orderNumber: orderNumber
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create payment session' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});