import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ROAMBUDDY_CONFIG = {
  baseURL: 'https://api.worldroambuddy.com:3001/api/v1',
  username: 'T&TCapeTownSA', 
  password: '5XLLCJki3D72Z68GkM4XYY25625$',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlQmVENhcGVUb3duU0EiLCJlbWFpbCI6ImNoYWQuY3VwaWRvOTFAZ21haWwuY29tIiwiaWQiOjU2LCJ3YWxsZXRfYmFsYW5jZSI6IjAuMDAiLCJpYXQiOjE3NTA4MzU5ODV9.i4QtxscGrmKl5cmPGy0Ot-hV9yCQlEJjswLcHHprx-g'
};

interface RoamBuddyRequest {
  action: 'test' | 'getServices' | 'createBooking';
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { action, data }: RoamBuddyRequest = await req.json();
    console.log(`RoamBuddy API Request: ${action}`, data);

    let result;

    switch (action) {
      case 'test':
        result = await testConnection();
        break;
      
      case 'getServices':
        result = await getServices(data?.destination);
        break;
      
      case 'createBooking':
        result = await createBooking(data);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('RoamBuddy API Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

async function testConnection() {
  try {
    const response = await fetch(`${ROAMBUDDY_CONFIG.baseURL}/test`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ROAMBUDDY_CONFIG.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('RoamBuddy Connection Test Result:', data);
    return data;
  } catch (error) {
    console.error('RoamBuddy Connection Test Failed:', error);
    return { 
      error: 'Connection failed', 
      message: error.message,
      status: 'offline' 
    };
  }
}

async function getServices(destination?: string) {
  try {
    const url = destination 
      ? `${ROAMBUDDY_CONFIG.baseURL}/services?destination=${encodeURIComponent(destination)}`
      : `${ROAMBUDDY_CONFIG.baseURL}/services`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ROAMBUDDY_CONFIG.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('RoamBuddy Services Result:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return { 
      error: 'Failed to fetch services',
      message: error.message,
      services: []
    };
  }
}

async function createBooking(bookingData: any) {
  try {
    const response = await fetch(`${ROAMBUDDY_CONFIG.baseURL}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ROAMBUDDY_CONFIG.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('RoamBuddy Booking Result:', data);
    return data;
  } catch (error) {
    console.error('Booking creation failed:', error);
    return { 
      error: 'Booking failed',
      message: error.message,
      booking_id: null
    };
  }
}

serve(handler);