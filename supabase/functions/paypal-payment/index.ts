// Phase 12: Secured PayPal payment endpoint with JWT verification and rate limiting
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// LIVE PayPal API endpoints (PRODUCTION)
const PAYPAL_API_BASE = 'https://api-m.paypal.com';

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // Max 10 orders per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

// Input validation
function validateOrderInput(data: any): { valid: boolean; error?: string } {
  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    return { valid: false, error: 'Invalid amount' };
  }
  if (!data.customerEmail || typeof data.customerEmail !== 'string' || !data.customerEmail.includes('@')) {
    return { valid: false, error: 'Invalid customer email' };
  }
  if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.length < 2) {
    return { valid: false, error: 'Invalid customer name' };
  }
  if (!data.productId || typeof data.productId !== 'string') {
    return { valid: false, error: 'Invalid product ID' };
  }
  if (!data.productName || typeof data.productName !== 'string') {
    return { valid: false, error: 'Invalid product name' };
  }
  // Sanitize strings to prevent injection
  if (data.customerName.length > 100 || data.customerEmail.length > 255 || data.productName.length > 200) {
    return { valid: false, error: 'Input too long' };
  }
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role for database operations
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Create client with user's token to verify authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Rate limiting based on user ID
    const rateLimitKey = `paypal_${user.id}`;
    if (!checkRateLimit(rateLimitKey)) {
      console.warn(`Rate limit exceeded for user: ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Too many payment requests. Please try again later.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      )
    }

    const { action, ...data } = await req.json()

    if (action === 'create_order') {
      // Validate input
      const validation = validateOrderInput(data);
      if (!validation.valid) {
        return new Response(
          JSON.stringify({ error: validation.error }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Get PayPal access token
      const authResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Authorization': `Basic ${btoa(`${Deno.env.get('PAYPAL_CLIENT_ID')}:${Deno.env.get('PAYPAL_CLIENT_SECRET')}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      })

      if (!authResponse.ok) {
        throw new Error('Failed to get PayPal access token')
      }

      const authData = await authResponse.json()
      const accessToken = authData.access_token

      // Create PayPal order
      const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: (data.amount * 0.054).toFixed(2) // Convert ZAR to USD approximately
            },
            description: (data.description || 'Omni Wellness Purchase').substring(0, 127)
          }],
          application_context: {
            return_url: `${data.returnUrl}?success=true`,
            cancel_url: `${data.returnUrl}?cancelled=true`
          }
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create PayPal order')
      }

      const orderData = await orderResponse.json()

      // Store order in database using service role (bypasses RLS)
      const { error: dbError } = await supabaseService
        .from('orders')
        .insert({
          order_number: `OMW-${Date.now()}`,
          customer_name: data.customerName.substring(0, 100),
          customer_email: data.customerEmail.substring(0, 255),
          amount: data.amount,
          currency: 'ZAR',
          product_id: data.productId,
          product_name: data.productName.substring(0, 200),
          product_type: data.productType || 'service',
          status: 'pending',
          user_id: user.id, // Link order to authenticated user
          paypal_payer_id: orderData.id
        })

      if (dbError) {
        console.error('Database error:', dbError)
      }

      console.log(`Order created for user ${user.id}: ${orderData.id}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          orderId: orderData.id,
          approveUrl: orderData.links.find((link: any) => link.rel === 'approve')?.href
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'capture_order') {
      if (!data.orderId || typeof data.orderId !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid order ID' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Get PayPal access token
      const authResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Authorization': `Basic ${btoa(`${Deno.env.get('PAYPAL_CLIENT_ID')}:${Deno.env.get('PAYPAL_CLIENT_SECRET')}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      })

      const authData = await authResponse.json()
      const accessToken = authData.access_token

      // Capture PayPal order
      const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(data.orderId)}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      })

      if (!captureResponse.ok) {
        throw new Error('Failed to capture PayPal payment')
      }

      const captureData = await captureResponse.json()

      // Update order status in database using service role
      const { error: updateError } = await supabaseService
        .from('orders')
        .update({ 
          status: captureData.status === 'COMPLETED' ? 'completed' : 'failed',
          stripe_payment_intent_id: captureData.id // Reusing field for PayPal payment ID
        })
        .eq('paypal_payer_id', data.orderId)
        .eq('user_id', user.id) // Ensure user can only update their own orders

      if (updateError) {
        console.error('Failed to update order:', updateError)
      }

      console.log(`Order captured for user ${user.id}: ${captureData.status}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          status: captureData.status,
          paymentId: captureData.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('PayPal payment error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Payment processing failed', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})