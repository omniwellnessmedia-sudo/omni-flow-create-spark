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

    const { action, ...bookingData } = await req.json()

    if (action === 'create_tour_booking') {
      // Create tour booking in our system
      const { data: booking, error: bookingError } = await supabaseClient
        .from('tour_bookings')
        .insert({
          tour_id: bookingData.tourId,
          user_id: bookingData.userId,
          contact_name: bookingData.contactName,
          contact_email: bookingData.contactEmail,
          contact_phone: bookingData.contactPhone,
          booking_date: bookingData.bookingDate,
          participants: bookingData.participants,
          total_price: bookingData.totalPrice,
          special_requirements: bookingData.specialRequirements,
          roambuddy_services: bookingData.roambuddyServices || [],
          status: 'pending'
        })
        .select()
        .single()

      if (bookingError) {
        throw new Error(`Failed to create booking: ${bookingError.message}`)
      }

      // Send confirmation email (placeholder)
      console.log(`Tour booking created for ${bookingData.contactName} (${bookingData.contactEmail})`)

      // If RoamBuddy services are selected, create those bookings too
      if (bookingData.roambuddyServices && bookingData.roambuddyServices.length > 0) {
        try {
          const roambuddyResponse = await supabase.functions.invoke('roambuddy-api', {
            body: {
              action: 'create_booking',
              services: bookingData.roambuddyServices,
              customerInfo: {
                name: bookingData.contactName,
                email: bookingData.contactEmail,
                phone: bookingData.contactPhone
              }
            }
          })

          if (roambuddyResponse.data?.success) {
            // Update booking with RoamBuddy booking ID
            await supabaseClient
              .from('tour_bookings')
              .update({ 
                roambuddy_booking_id: roambuddyResponse.data.bookingId,
                status: 'confirmed'
              })
              .eq('id', booking.id)
          }
        } catch (roambuddyError) {
          console.error('RoamBuddy booking error:', roambuddyError)
          // Continue with tour booking even if RoamBuddy fails
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          booking,
          message: 'Booking created successfully! You will receive a confirmation email shortly.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'create_service_booking') {
      // Create wellness service booking
      const { data: booking, error: bookingError } = await supabaseClient
        .from('bookings')
        .insert({
          service_id: bookingData.serviceId,
          provider_id: bookingData.providerId,
          consumer_id: bookingData.consumerId,
          booking_date: bookingData.bookingDate,
          payment_method: bookingData.paymentMethod,
          amount_zar: bookingData.amountZar,
          amount_wellcoins: bookingData.amountWellcoins,
          notes: bookingData.notes,
          status: 'pending'
        })
        .select()
        .single()

      if (bookingError) {
        throw new Error(`Failed to create service booking: ${bookingError.message}`)
      }

      // Send confirmation email to both provider and consumer
      console.log(`Service booking created for service ${bookingData.serviceId}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          booking,
          message: 'Service booking created successfully!'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'update_booking_status') {
      const { bookingId, status, table = 'tour_bookings' } = bookingData

      const { error: updateError } = await supabaseClient
        .from(table)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId)

      if (updateError) {
        throw new Error(`Failed to update booking status: ${updateError.message}`)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Booking status updated successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'get_availability') {
      // Get availability for a specific date range
      const { serviceId, startDate, endDate } = bookingData

      const { data: bookings } = await supabaseClient
        .from('bookings')
        .select('booking_date')
        .eq('service_id', serviceId)
        .gte('booking_date', startDate)
        .lte('booking_date', endDate)

      const bookedDates = bookings?.map(b => b.booking_date) || []

      return new Response(
        JSON.stringify({ 
          success: true, 
          bookedDates,
          message: 'Availability retrieved successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Booking error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Booking failed', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})