import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { action, ...params } = await req.json()
    console.log(`Tour availability action: ${action}`, params)

    // ===================================
    // GET AVAILABILITY
    // Query available dates for a tour
    // ===================================
    if (action === 'get_availability') {
      const { tourId, startDate, endDate, participants = 1 } = params

      if (!tourId || !startDate || !endDate) {
        throw new Error('Missing required parameters: tourId, startDate, endDate')
      }

      // Fetch availability data
      const { data: availability, error } = await supabaseClient
        .from('tour_operator_availability')
        .select('*')
        .eq('tour_id', tourId)
        .gte('available_date', startDate)
        .lte('available_date', endDate)
        .in('status', ['available', 'tentative', 'limited'])
        .order('available_date', { ascending: true })

      if (error) throw error

      // Also check existing bookings to get accurate capacity
      const { data: bookings } = await supabaseClient
        .from('tour_bookings')
        .select('booking_date, participants')
        .eq('tour_id', tourId)
        .gte('booking_date', startDate)
        .lte('booking_date', endDate)
        .in('status', ['confirmed', 'deposit_paid', 'balance_paid'])

      // Check active leases
      const { data: leases } = await supabaseClient
        .from('booking_leases')
        .select('selected_date, participants')
        .eq('tour_id', tourId)
        .gte('selected_date', startDate)
        .lte('selected_date', endDate)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())

      // Calculate actual available capacity for each date
      const processedAvailability = availability?.map(slot => {
        const dateStr = slot.available_date
        
        // Sum booked participants for this date
        const bookedParticipants = bookings
          ?.filter(b => b.booking_date === dateStr)
          .reduce((sum, b) => sum + (b.participants || 0), 0) || 0

        // Sum leased participants for this date  
        const leasedParticipants = leases
          ?.filter(l => l.selected_date === dateStr)
          .reduce((sum, l) => sum + (l.participants || 0), 0) || 0

        const totalBooked = bookedParticipants + leasedParticipants
        const availableCapacity = Math.max(0, (slot.max_capacity || 10) - totalBooked)

        return {
          ...slot,
          booked_capacity: totalBooked,
          available_capacity: availableCapacity,
          can_book: availableCapacity >= participants
        }
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          availability: processedAvailability 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===================================
    // CHECK CAPACITY
    // Verify participants fit on a date
    // ===================================
    if (action === 'check_capacity') {
      const { tourId, date, participants } = params

      if (!tourId || !date || !participants) {
        throw new Error('Missing required parameters: tourId, date, participants')
      }

      // Get slot capacity
      const { data: slot } = await supabaseClient
        .from('tour_operator_availability')
        .select('*')
        .eq('tour_id', tourId)
        .eq('available_date', date)
        .single()

      const maxCapacity = slot?.max_capacity || 10

      // Get current bookings
      const { data: bookings } = await supabaseClient
        .from('tour_bookings')
        .select('participants')
        .eq('tour_id', tourId)
        .eq('booking_date', date)
        .in('status', ['confirmed', 'deposit_paid', 'balance_paid'])

      const bookedParticipants = bookings?.reduce((sum, b) => sum + (b.participants || 0), 0) || 0

      // Get active leases
      const { data: leases } = await supabaseClient
        .from('booking_leases')
        .select('participants')
        .eq('tour_id', tourId)
        .eq('selected_date', date)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())

      const leasedParticipants = leases?.reduce((sum, l) => sum + (l.participants || 0), 0) || 0

      const availableCapacity = maxCapacity - bookedParticipants - leasedParticipants
      const hasCapacity = availableCapacity >= participants

      return new Response(
        JSON.stringify({ 
          success: true,
          hasCapacity,
          availableCapacity,
          maxCapacity,
          bookedCapacity: bookedParticipants + leasedParticipants,
          status: slot?.status || 'available'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===================================
    // CREATE LEASE
    // Temporary hold during checkout (15 min)
    // ===================================
    if (action === 'create_lease') {
      const { tourId, date, time, participants, sessionId, userId } = params

      if (!tourId || !date || !participants || !sessionId) {
        throw new Error('Missing required parameters: tourId, date, participants, sessionId')
      }

      // First check capacity
      const capacityCheck = await checkCapacityInternal(supabaseClient, tourId, date, participants)
      
      if (!capacityCheck.hasCapacity) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Not enough capacity available',
            availableCapacity: capacityCheck.availableCapacity
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Release any existing active leases for this session
      await supabaseClient
        .from('booking_leases')
        .update({ status: 'released' })
        .eq('consumer_session_id', sessionId)
        .eq('status', 'active')

      // Create new lease (15 minute expiry)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

      const { data: lease, error } = await supabaseClient
        .from('booking_leases')
        .insert({
          tour_id: tourId,
          selected_date: date,
          selected_time: time || null,
          participants,
          consumer_session_id: sessionId,
          consumer_id: userId || null,
          expires_at: expiresAt.toISOString(),
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      console.log(`Created booking lease ${lease.id} for tour ${tourId} on ${date}`)

      return new Response(
        JSON.stringify({ 
          success: true,
          lease,
          expiresAt: expiresAt.toISOString(),
          expiresInMinutes: 15
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===================================
    // RELEASE LEASE
    // Cancel unused or expired leases
    // ===================================
    if (action === 'release_lease') {
      const { leaseId, sessionId } = params

      if (!leaseId && !sessionId) {
        throw new Error('Missing required parameters: leaseId or sessionId')
      }

      let query = supabaseClient
        .from('booking_leases')
        .update({ status: 'released' })
        .eq('status', 'active')

      if (leaseId) {
        query = query.eq('id', leaseId)
      } else {
        query = query.eq('consumer_session_id', sessionId)
      }

      const { error } = await query

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, message: 'Lease released' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===================================
    // CONVERT LEASE
    // Convert lease to confirmed booking
    // ===================================
    if (action === 'convert_lease') {
      const { leaseId, bookingId } = params

      if (!leaseId || !bookingId) {
        throw new Error('Missing required parameters: leaseId, bookingId')
      }

      const { error } = await supabaseClient
        .from('booking_leases')
        .update({ 
          status: 'converted',
          converted_to_booking_id: bookingId
        })
        .eq('id', leaseId)
        .eq('status', 'active')

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, message: 'Lease converted to booking' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===================================
    // CLEANUP EXPIRED LEASES
    // Automated cleanup of old leases
    // ===================================
    if (action === 'cleanup_leases') {
      const { data, error } = await supabaseClient
        .from('booking_leases')
        .update({ status: 'expired' })
        .eq('status', 'active')
        .lt('expires_at', new Date().toISOString())
        .select('id')

      if (error) throw error

      console.log(`Cleaned up ${data?.length || 0} expired leases`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          expiredCount: data?.length || 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===================================
    // SET AVAILABILITY
    // Admin: Set availability for a date range
    // ===================================
    if (action === 'set_availability') {
      const { tourId, operatorId, dates, maxCapacity, status, startTime, endTime } = params

      if (!tourId || !dates || !Array.isArray(dates)) {
        throw new Error('Missing required parameters: tourId, dates (array)')
      }

      const records = dates.map((date: string) => ({
        tour_id: tourId,
        operator_id: operatorId,
        available_date: date,
        max_capacity: maxCapacity || 10,
        status: status || 'available',
        start_time: startTime || null,
        end_time: endTime || null,
        external_calendar_sync: 'manual'
      }))

      const { data, error } = await supabaseClient
        .from('tour_operator_availability')
        .upsert(records, { 
          onConflict: 'tour_id,available_date',
          ignoreDuplicates: false 
        })
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ 
          success: true, 
          updated: data?.length || 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ===================================
    // BLOCK DATES
    // Admin: Block specific dates
    // ===================================
    if (action === 'block_dates') {
      const { tourId, operatorId, dates, reason } = params

      if (!tourId || !dates || !Array.isArray(dates)) {
        throw new Error('Missing required parameters: tourId, dates (array)')
      }

      const records = dates.map((date: string) => ({
        tour_id: tourId,
        operator_id: operatorId,
        available_date: date,
        status: 'blocked',
        notes: reason || 'Blocked by operator',
        external_calendar_sync: 'manual'
      }))

      const { data, error } = await supabaseClient
        .from('tour_operator_availability')
        .upsert(records, { 
          onConflict: 'tour_id,available_date',
          ignoreDuplicates: false 
        })
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ 
          success: true, 
          blocked: data?.length || 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Tour availability error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Operation failed', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})

// Internal helper function for capacity check
async function checkCapacityInternal(supabase: any, tourId: string, date: string, participants: number) {
  const { data: slot } = await supabase
    .from('tour_operator_availability')
    .select('max_capacity')
    .eq('tour_id', tourId)
    .eq('available_date', date)
    .single()

  const maxCapacity = slot?.max_capacity || 10

  const { data: bookings } = await supabase
    .from('tour_bookings')
    .select('participants')
    .eq('tour_id', tourId)
    .eq('booking_date', date)
    .in('status', ['confirmed', 'deposit_paid', 'balance_paid'])

  const bookedParticipants = bookings?.reduce((sum: number, b: any) => sum + (b.participants || 0), 0) || 0

  const { data: leases } = await supabase
    .from('booking_leases')
    .select('participants')
    .eq('tour_id', tourId)
    .eq('selected_date', date)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())

  const leasedParticipants = leases?.reduce((sum: number, l: any) => sum + (l.participants || 0), 0) || 0

  const availableCapacity = maxCapacity - bookedParticipants - leasedParticipants

  return {
    hasCapacity: availableCapacity >= participants,
    availableCapacity,
    maxCapacity
  }
}
