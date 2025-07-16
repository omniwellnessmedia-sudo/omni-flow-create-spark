import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { action, ...data } = await req.json()

    if (action === 'create_order') {
      // Get PayPal access token
      const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
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
      const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
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
            description: data.description || 'Omni Wellness Purchase'
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

      // Store order in database
      const { error: dbError } = await supabaseClient
        .from('orders')
        .insert({
          order_number: `OMW-${Date.now()}`,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          amount: data.amount,
          currency: 'ZAR',
          product_id: data.productId,
          product_name: data.productName,
          product_type: data.productType || 'service',
          status: 'pending',
          paypal_order_id: orderData.id
        })

      if (dbError) {
        console.error('Database error:', dbError)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          orderId: orderData.id,
          approveUrl: orderData.links.find(link => link.rel === 'approve')?.href
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'capture_order') {
      // Get PayPal access token
      const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
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
      const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${data.orderId}/capture`, {
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

      // Update order status in database
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          status: captureData.status === 'COMPLETED' ? 'completed' : 'failed',
          paypal_payment_id: captureData.id
        })
        .eq('paypal_order_id', data.orderId)

      if (updateError) {
        console.error('Failed to update order:', updateError)
      }

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