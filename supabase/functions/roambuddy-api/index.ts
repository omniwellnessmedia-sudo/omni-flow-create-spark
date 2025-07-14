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
    // Test multiple potential endpoints to find the working one
    const testEndpoints = [
      '/test',
      '/ping', 
      '/health',
      '/status',
      '/products', // Try products endpoint
      '/services' // Try services endpoint
    ];

    console.log('Testing RoamBuddy API connection...');
    
    for (const endpoint of testEndpoints) {
      try {
        const response = await fetch(`${ROAMBUDDY_CONFIG.baseURL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ROAMBUDDY_CONFIG.token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(`Testing endpoint ${endpoint}: Status ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Success with endpoint ${endpoint}:`, data);
          return { 
            success: true, 
            endpoint: endpoint, 
            data: data,
            status: 'online'
          };
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
        continue;
      }
    }

    // If no endpoints work, return error info
    return { 
      error: 'No working endpoints found', 
      message: 'Tested multiple endpoints but none responded successfully',
      status: 'offline',
      testedEndpoints: testEndpoints
    };
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
    // Try multiple potential service endpoints
    const serviceEndpoints = [
      '/services',
      '/products', 
      '/packages',
      '/esim-packages',
      '/data-packages'
    ];

    console.log('Fetching RoamBuddy services for destination:', destination);

    for (const endpoint of serviceEndpoints) {
      try {
        const url = destination 
          ? `${ROAMBUDDY_CONFIG.baseURL}${endpoint}?destination=${encodeURIComponent(destination)}`
          : `${ROAMBUDDY_CONFIG.baseURL}${endpoint}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ROAMBUDDY_CONFIG.token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(`Testing services endpoint ${endpoint}: Status ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`Services success with endpoint ${endpoint}:`, data);
          
          // Return the services data in a consistent format
          return {
            success: true,
            endpoint: endpoint,
            services: data.services || data.products || data.packages || data || [],
            data: data
          };
        }
      } catch (endpointError) {
        console.log(`Services endpoint ${endpoint} failed:`, endpointError.message);
        continue;
      }
    }

    // If no endpoints work, return our mock eSIM data
    console.log('No working service endpoints found, returning mock eSIM data');
    return { 
      error: 'No working service endpoints found',
      message: 'API endpoints not responding, using fallback data',
      services: [
        { id: 'esim-sa-1gb', name: 'South Africa eSIM - 1GB', price: 12, description: '1GB data valid for 7 days in South Africa' },
        { id: 'esim-sa-3gb', name: 'South Africa eSIM - 3GB', price: 25, description: '3GB data valid for 30 days in South Africa' },
        { id: 'esim-sa-5gb', name: 'South Africa eSIM - 5GB', price: 39, description: '5GB data valid for 30 days in South Africa' },
        { id: 'esim-africa-regional', name: 'Africa Regional eSIM - 2GB', price: 35, description: '2GB data for multiple African countries, 30 days' },
      ]
    };
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return { 
      error: 'Failed to fetch services',
      message: error.message,
      services: [
        { id: 'esim-sa-1gb', name: 'South Africa eSIM - 1GB', price: 12, description: '1GB data valid for 7 days in South Africa' },
        { id: 'esim-sa-3gb', name: 'South Africa eSIM - 3GB', price: 25, description: '3GB data valid for 30 days in South Africa' },
        { id: 'esim-sa-5gb', name: 'South Africa eSIM - 5GB', price: 39, description: '5GB data valid for 30 days in South Africa' },
        { id: 'esim-africa-regional', name: 'Africa Regional eSIM - 2GB', price: 35, description: '2GB data for multiple African countries, 30 days' },
      ]
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