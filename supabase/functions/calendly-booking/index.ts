import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { serviceId, customerEmail, customerName, selectedTime, selectedDate } = await req.json()

    // Get Calendly credentials from secure environment variables
    const calendlyClientId = Deno.env.get('CALENDLY_CLIENT_ID')
    const calendlyClientSecret = Deno.env.get('CALENDLY_CLIENT_SECRET')
    const calendlyWebhookSigningKey = Deno.env.get('CALENDLY_WEBHOOK_SIGNING_KEY')

    if (!calendlyClientId || !calendlyClientSecret || !calendlyWebhookSigningKey) {
      throw new Error('Calendly configuration not found in environment variables')
    }

    // Create Calendly event (this is a simplified example)
    // In a real implementation, you would use Calendly's API
    const calendlyResponse = await fetch('https://api.calendly.com/scheduled_events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('CALENDLY_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'wellness-consultation',
        invitee_email: customerEmail,
        invitee_name: customerName,
        start_time: `${selectedDate}T${selectedTime}:00.000Z`,
        // Add other Calendly-specific fields as needed
      })
    })

    if (!calendlyResponse.ok) {
      throw new Error('Failed to create Calendly booking')
    }

    const calendlyData = await calendlyResponse.json()

    // Store booking confirmation in Supabase
    const { error: dbError } = await supabaseClient
      .from('bookings')
      .update({ 
        calendly_event_id: calendlyData.resource.uri,
        status: 'confirmed'
      })
      .eq('service_id', serviceId)
      .eq('consumer_id', customerEmail) // or however you identify the user

    if (dbError) {
      console.error('Database update error:', dbError)
    }

    // Send confirmation email (placeholder)
    console.log(`Booking confirmed for ${customerName} (${customerEmail}) on ${selectedDate} at ${selectedTime}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Booking confirmed! You will receive a confirmation email shortly.',
        calendly_link: calendlyData.resource.uri
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Calendly booking error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Booking failed', 
        details: error.message,
        message: 'We were unable to complete your booking. Please try again or contact support.' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})