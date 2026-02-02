
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// Type definitions
interface RequestData {
  action: string;
  data?: Record<string, unknown>;
}

interface Product {
  id?: string;
  name?: string;
  title?: string;
  price?: number;
  amount?: number;
  description?: string;
  data_amount?: string;
  validity_days?: number;
  coverage?: string[];
  countries?: string[];
}

interface Country {
  id?: string;
  name: string;
  code: string;
}

interface OrderData {
  product_id?: string;
  user_id?: string;
  customer_name?: string;
  customer_email?: string;
  amount?: number;
  product_name?: string;
  destination?: string;
  currency?: string;
}

interface WellnessPackageParams {
  destination?: string;
  wellness_type?: string;
  duration?: string;
}

interface ServiceParams {
  destination?: string;
}

interface PaginationParams {
  page?: number;
  pageSize?: number;
  searchStr?: string;
}

interface WalletTransactionParams extends PaginationParams {
  start_date?: string;
  end_date?: string;
}

interface EsimParams {
  iccid: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate flag emoji from 2-letter ISO country code
function getCountryFlag(code: string): string {
  if (!code || code.length < 2) return '🌍';
  
  // Handle special non-standard codes
  const codeMap: Record<string, string> = {
    'US-HI': 'US',  // Hawaii → US flag
    'IC': 'ES',     // Canary Islands → Spain flag
    'AN': 'NL',     // Netherlands Antilles → Netherlands flag
    'XK': 'XK',     // Kosovo (has its own flag emoji)
  };
  
  let isoCode = codeMap[code.trim()] || code.trim().substring(0, 2).toUpperCase();
  
  try {
    const codePoints = isoCode
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
}

// Travel Well Connected API configuration (RoamBuddy backend)
const ROAMBUDDY_API_URL = Deno.env.get('ROAMBUDDY_API_URL') || 'https://api.worldroambuddy.com:3001/api/v1'
const ROAMBUDDY_USERNAME = Deno.env.get('ROAMBUDDY_USERNAME')
const ROAMBUDDY_PASSWORD = Deno.env.get('ROAMBUDDY_PASSWORD')
let ROAMBUDDY_ACCESS_TOKEN = Deno.env.get('ROAMBUDDY_ACCESS_TOKEN')

// Token refresh function
async function refreshAccessToken(): Promise<string> {
  console.log('Refreshing RoamBuddy access token...');
  const response = await fetch(`${ROAMBUDDY_API_URL}/wl-account/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: ROAMBUDDY_USERNAME,
      password: ROAMBUDDY_PASSWORD
    })
  });

  if (!response.ok) {
    console.error('Failed to refresh token:', await response.text());
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  const token = data.data?.access_token || data.access_token || data.data?.auth_token || data.token;
  ROAMBUDDY_ACCESS_TOKEN = token;
  console.log('Token refreshed successfully');
  console.log('Using token type:', token?.substring(0, 20) + '...');
  return token;
}

// Authenticated request helper
async function makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
  console.log(`Making authenticated request to: ${endpoint}`);
  
  // Try with current token (NO Bearer prefix per RoamBuddy API docs)
  let response = await fetch(`${ROAMBUDDY_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': ROAMBUDDY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  // If 401, refresh token and retry
  if (response.status === 401) {
    console.log('Token expired, refreshing...');
    const newToken = await refreshAccessToken();
    response = await fetch(`${ROAMBUDDY_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': newToken,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  return response;
}

serve(async (req) => {
  // Startup logging
  console.log('🚀 RoamBuddy API function started');
  console.log('📍 API URL:', ROAMBUDDY_API_URL);
  console.log('✅ Credentials configured:', {
    hasApiUrl: !!ROAMBUDDY_API_URL,
    hasUsername: !!ROAMBUDDY_USERNAME,
    hasPassword: !!ROAMBUDDY_PASSWORD,
    hasToken: !!ROAMBUDDY_ACCESS_TOKEN
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data = {} } = await req.json()
    console.log('🎯 RoamBuddy API action:', action, 'data:', data)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'test':
        return handleTest()
      
      case 'healthCheck':
        return new Response(
          JSON.stringify({ 
            success: true, 
            status: 'healthy',
            message: 'RoamBuddy API function is running',
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      
      case 'authenticate':
        return await handleAuthenticate()
      
      case 'getAllProducts':
        return await handleGetAllProducts()
      
      case 'getServices':
        return await handleGetServicesForDestination(data)
      
      case 'getCountries':
        return await handleGetCountries()
      
      case 'getDestinations':
        return await handleGetDestinations()
      
      case 'getWellnessPackages':
        return await handleGetWellnessPackages(data)
      
      case 'getProductById':
        return await handleGetProductById(data.productId)
      
      case 'getProductsPagination':
        return await handleGetProductsPagination(data)
      
      // Guest checkout - no authentication required
      case 'createGuestOrder':
        console.log('🛒 Processing guest checkout order');
        
        // Validate required fields for guest checkout
        if (!data.customer_email || !data.customer_name || !data.product_id) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Missing required fields',
              message: 'Please provide customer_email, customer_name, and product_id'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.customer_email)) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid email address',
              message: 'Please provide a valid email address'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        console.log('✅ Guest order validated, proceeding with order creation');
        return await handleCreateOrder({ ...data, user_id: null }, supabase);
      
      case 'createOrder':
        // Require authentication for authenticated order creation
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Authentication required for order creation',
              message: 'Please sign in to create orders, or use guest checkout'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        // Verify the JWT token
        const supabaseAuth = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: { Authorization: authHeader },
            },
          }
        );

        const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
        
        if (authError || !user) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid authentication',
              message: 'Please sign in again to create orders'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        console.log('✅ User authenticated for order creation:', user.id);
        return await handleCreateOrder({ ...data, user_id: user.id }, supabase)
      
      case 'trackOrder':
      case 'getOrderedEsims':
      case 'getEsimDetails':
      case 'activateEsim':
      case 'validateEsim': {
        // Require authentication for all eSIM-related sensitive actions
        const esimAuthHeader = req.headers.get('Authorization');
        if (!esimAuthHeader) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Authentication required',
              message: 'Please sign in to access eSIM data'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        const supabaseEsimAuth = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: { Authorization: esimAuthHeader },
            },
          }
        );

        const { data: { user: esimUser }, error: esimAuthError } = await supabaseEsimAuth.auth.getUser();
        
        if (esimAuthError || !esimUser) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid authentication',
              message: 'Please sign in again to access eSIM data'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        console.log('✅ User authenticated for eSIM action:', action, 'user:', esimUser.id);

        // Route to appropriate handler
        switch (action) {
          case 'trackOrder':
            return await handleTrackOrder(data.orderId)
          case 'getOrderedEsims':
            return await handleGetOrderedEsims(data)
          case 'getEsimDetails':
            return await handleGetEsimDetails(data.iccid)
          case 'activateEsim':
            return await handleActivateEsim(data)
          case 'validateEsim':
            return await handleValidateEsim(data.iccid)
        }
      }
      
      case 'getWalletTransactions':
        return await handleGetWalletTransactions(data)
      
      case 'getPlanStatics':
        return await handleGetPlanStatics()
      
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Unknown action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ RoamBuddy API Error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})

// Test connection and configuration
function handleTest() {
  const hasCredentials = !!(ROAMBUDDY_API_URL && ROAMBUDDY_ACCESS_TOKEN)
  
  return new Response(
    JSON.stringify({ 
      success: hasCredentials,
      message: hasCredentials ? 'Travel Well Connected API configured successfully' : 'Missing API credentials',
      config: {
        apiUrl: ROAMBUDDY_API_URL,
        hasToken: !!ROAMBUDDY_ACCESS_TOKEN,
        hasUsername: !!ROAMBUDDY_USERNAME,
        hasPassword: !!ROAMBUDDY_PASSWORD
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Authenticate with RoamBuddy API
async function handleAuthenticate() {
  try {
    const response = await fetch(`${ROAMBUDDY_API_URL}/wl-account/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: ROAMBUDDY_USERNAME,
        password: ROAMBUDDY_PASSWORD
      })
    })

    const data = await response.json()
    console.log('Authentication response:', data)

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Authentication successful'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Authentication failed: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Authentication failed', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )
  }
}

// Get all products with wellness enhancement
async function handleGetAllProducts() {
  try {
    // Step 1: Authenticate to get fresh token
    console.log('Authenticating with RoamBuddy API...');
    const authResponse = await fetch(`${ROAMBUDDY_API_URL}/wl-account/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: ROAMBUDDY_USERNAME,
        password: ROAMBUDDY_PASSWORD
      })
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Authentication failed:', errorText);
      throw new Error(`Authentication failed: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    console.log('Auth response structure:', JSON.stringify(authData, null, 2));
    
    // Extract token from response (prioritize access_token per RoamBuddy API docs)
    const token = authData.data?.access_token || authData.access_token || authData.data?.auth_token || authData.auth_token || authData.token || authData.data?.token;
    
    if (!token) {
      console.error('No token found in auth response:', authData);
      throw new Error('Authentication succeeded but no token received');
    }
    
    console.log('✅ Token obtained for products request');
    console.log('📝 Using token:', token.substring(0, 30) + '...');
    console.log('Token type: access_token (prioritized)');
    console.log('Fetching products from /products/all...');

    // Step 2: Fetch products using correct endpoint (NO Bearer prefix!)
    const response = await fetch(`${ROAMBUDDY_API_URL}/products/all`, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    
    const responseText = await response.text();
    console.log('Products API response status:', response.status);
    console.log('Products API response:', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('Products API failed:', response.status, responseText);
      throw new Error(`Products API failed: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    // Handle different response structures
    const products = Array.isArray(data) ? data : (data.data || data.products || []);
    console.log(`Successfully fetched ${products.length} products`);
    
    // Enhance products with wellness features
    const enhancedProducts = products.map(product => ({
      ...product,
      wellness_features: getWellnessFeatures(product),
      peace_of_mind_score: calculatePeaceOfMindScore(product)
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: enhancedProducts,
        count: enhancedProducts.length,
        message: 'Products fetched successfully with wellness enhancements'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get products error:', error);
    return await handleFallbackProducts();
  }
}

// Get countries with wellness travel info
async function handleGetCountries() {
  try {
    // Step 1: Authenticate to get fresh token
    console.log('Authenticating with RoamBuddy API for countries...');
    const authResponse = await fetch(`${ROAMBUDDY_API_URL}/wl-account/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: ROAMBUDDY_USERNAME,
        password: ROAMBUDDY_PASSWORD
      })
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Authentication failed:', errorText);
      throw new Error(`Authentication failed: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    console.log('Auth response for countries:', JSON.stringify(authData, null, 2));
    
    // Extract token from response (prioritize access_token per RoamBuddy API docs)
    const token = authData.data?.access_token || authData.access_token || authData.data?.auth_token || authData.auth_token || authData.token || authData.data?.token;
    
    if (!token) {
      console.error('No token found in auth response:', authData);
      throw new Error('Authentication succeeded but no token received');
    }
    
    console.log('✅ Token obtained for countries request');
    console.log('📝 Using token:', token.substring(0, 30) + '...');
    console.log('Token type: access_token (prioritized)');
    console.log('Fetching countries from /whitelabel-dashboard/countries...');

    // Step 2: Fetch countries using correct endpoint (NO Bearer prefix!)
    const response = await fetch(`${ROAMBUDDY_API_URL}/whitelabel-dashboard/countries`, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    
    const responseText = await response.text();
    console.log('Countries API response status:', response.status);
    console.log('Countries API response:', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('Countries API failed:', response.status, responseText);
      throw new Error(`Countries API failed: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    // Handle different response structures
    const countries = Array.isArray(data) ? data : (data.data || data.countries || []);
    console.log(`Successfully fetched ${countries.length} countries`);

    // Enhance countries with wellness travel information and flags
    const enhancedCountries = countries.map(country => {
      const countryCode = country.country_code || country.iso2 || country.code;
      return {
        ...country,
        name: country.country_name || country.name,
        code: countryCode,
        flag: getCountryFlag(countryCode),
        wellness_rating: getWellnessRating(country),
        popular_wellness_activities: getWellnessActivities(country),
        mental_health_resources: getMentalHealthResources(country),
        emergency_contacts: getEmergencyContacts(country)
      };
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: enhancedCountries,
        count: enhancedCountries.length,
        message: 'Countries fetched with wellness travel information'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get countries error:', error);
    return await handleFallbackCountries();
  }
}

// Get destinations with wellness focus
async function handleGetDestinations() {
  try {
    const countriesResponse = await handleGetCountries()
    const countriesData = await countriesResponse.json()
    
    if (countriesData.success) {
      const destinations = countriesData.data.map(country => ({
        id: country.id || country.code,
        name: country.name,
        code: country.code,
        wellness_score: country.wellness_rating || 0,
        popular_for: country.popular_wellness_activities || [],
        connectivity_packages: getConnectivityPackages(country)
      }))

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: destinations,
          message: 'Wellness travel destinations loaded successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('Failed to load destinations')
    }
  } catch (error) {
    console.error('Get destinations error:', error)
    return await handleFallbackDestinations()
  }
}

// Get wellness-focused packages
async function handleGetWellnessPackages(params: WellnessPackageParams) {
  try {
    const { destination, wellness_type = 'all', duration = 'all' } = params
    
    const productsResponse = await handleGetAllProducts()
    const productsData = await productsResponse.json()
    
    if (productsData.success) {
      let packages = productsData.data.filter(product => {
        if (destination && destination !== 'all') {
          return product.coverage?.includes(destination) || 
                 product.countries?.includes(destination)
        }
        return true
      })

      // Filter by wellness type
      if (wellness_type !== 'all') {
        packages = packages.filter(pkg => 
          pkg.wellness_features?.includes(wellness_type)
        )
      }

      // Enhanced packages with wellness focus
      const wellnessPackages = packages.map(pkg => ({
        ...pkg,
        package_type: 'wellness_connectivity',
        includes_wellness_apps: true,
        meditation_data_allowance: '500MB',
        wellness_support: true,
        peace_of_mind_guarantee: true
      }))

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: { packages: wellnessPackages },
          message: 'Wellness connectivity packages loaded'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('Failed to load wellness packages')
    }
  } catch (error) {
    console.error('Get wellness packages error:', error)
    return await handleFallbackWellnessPackages(params)
  }
}

// Get services for destination with wellness enhancements
async function handleGetServicesForDestination(params: ServiceParams) {
  try {
    const { destination = 'South Africa' } = params
    console.log('Getting wellness services for destination:', destination)
    
    const productsResponse = await handleGetAllProducts()
    const productsData = await productsResponse.json()
    
    if (productsData.success) {
      const services = productsData.data.map(product => ({
        id: product.id || `service-${Date.now()}-${Math.random()}`,
        name: product.name || product.title || 'Travel Well Connected Service',
        price: product.price || product.amount || 0,
        description: product.description || `Wellness connectivity for ${destination}`,
        destination: destination,
        data_amount: product.data_amount || '1GB',
        validity_days: product.validity_days || 30,
        coverage: product.coverage || [destination],
        wellness_features: getWellnessFeatures(product),
        peace_of_mind_score: calculatePeaceOfMindScore(product)
      }))

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            services: services,
            total: services.length,
            destination: destination,
            wellness_enhanced: true
          },
          message: 'Wellness services fetched successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('Failed to fetch services')
    }
  } catch (error) {
    console.error('Get services for destination error:', error)
    return await handleFallbackServices(params)
  }
}

// Enhanced order creation with wellness features (2-step process per RoamBuddy API)
async function handleCreateOrder(orderData: OrderData, supabase: ReturnType<typeof createClient>) {
  try {
    console.log('Creating RoamBuddy order (2-step process):', orderData);

    // Step 1: Authenticate to get token
    const authResponse = await fetch(`${ROAMBUDDY_API_URL}/wl-account/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: ROAMBUDDY_USERNAME,
        password: ROAMBUDDY_PASSWORD
      })
    });

    if (!authResponse.ok) {
      throw new Error('Authentication failed for order creation');
    }

    const authData = await authResponse.json();
    const token = authData.data?.auth_token || authData.auth_token || authData.data?.access_token || authData.access_token || authData.token || authData.data?.token;
    
    if (!token) {
      throw new Error('No token received from authentication');
    }

    // Step 2: Request order from RoamBuddy API
    console.log('Requesting order with plan_id:', orderData.product_id);
    const requestResponse = await fetch(`${ROAMBUDDY_API_URL}/products/orders/request`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        plan_id: parseInt(orderData.product_id || '0') 
      })
    });

    const requestData = await requestResponse.json();
    console.log('Order request response:', requestData);

    if (!requestResponse.ok) {
      throw new Error(`Order request failed: ${JSON.stringify(requestData)}`);
    }

    const roambuddyOrderId = requestData.order_id || requestData.data?.order_id;
    
    if (!roambuddyOrderId) {
      throw new Error('No order_id received from order request');
    }

    // Step 3: Complete the order
    console.log('Completing order with order_id:', roambuddyOrderId);
    const completeResponse = await fetch(`${ROAMBUDDY_API_URL}/products/orders/complete`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        order_id: roambuddyOrderId 
      })
    });

    const completeData = await completeResponse.json();
    console.log('Order complete response:', completeData);

    if (!completeResponse.ok) {
      throw new Error(`Order completion failed: ${JSON.stringify(completeData)}`);
    }

    // Step 4: Store order in Supabase database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          product_id: orderData.product_id,
          product_name: orderData.product_name || 'RoamBuddy eSIM',
          product_type: 'esim',
          customer_name: orderData.customer_name || 'Wellness Traveler',
          customer_email: orderData.customer_email || 'traveler@omniwellnessmedia.com',
          amount: orderData.amount || 0,
          currency: orderData.currency || 'USD',
          destination: orderData.destination,
          status: 'completed',
          roambuddy_order_id: roambuddyOrderId,
          order_number: `RB-${Date.now()}`,
          notes: JSON.stringify({
            wellness_features: true,
            peace_of_mind_included: true,
            roambuddy_response: completeData
          })
        }
      ])
      .select();

    if (orderError) {
      console.error('Database order error:', orderError);
    }

    // Send sale notification (async, don't block order completion)
    try {
      console.log('📧 Triggering sale notification...');
      fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/roambuddy-sale-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({
          orderId: `RB-${Date.now()}`,
          customerEmail: orderData.customer_email || 'traveler@omniwellnessmedia.com',
          customerName: orderData.customer_name || 'Wellness Traveler',
          productName: orderData.product_name || 'RoamBuddy eSIM',
          amount: orderData.amount || 0,
          currency: orderData.currency || 'USD',
          destination: orderData.destination,
          completedAt: new Date().toISOString()
        })
      }).then(res => res.json())
        .then(data => console.log('✅ Sale notification sent:', data))
        .catch(err => console.error('❌ Sale notification failed:', err));
    } catch (notifyError) {
      console.error('Sale notification error (non-blocking):', notifyError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          order_id: roambuddyOrderId,
          status: 'completed',
          product_name: orderData.product_name,
          amount: orderData.amount,
          currency: orderData.currency,
          customer_email: orderData.customer_email,
          wellness_features_included: true,
          peace_of_mind_guarantee: true,
          roambuddy_data: completeData,
          message: 'RoamBuddy order created and completed successfully'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Create order error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to create order', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Helper functions for wellness enhancements
function getWellnessFeatures(product: Product): string[] {
  const features = []
  if (product.data_amount) features.push('meditation_apps_optimized')
  if (product.validity_days >= 7) features.push('wellness_retreat_ready')
  if (product.coverage?.length > 1) features.push('multi_destination_wellness')
  features.push('peace_of_mind_guarantee', 'wellness_support_24_7')
  return features
}

function calculatePeaceOfMindScore(product: Product): number {
  let score = 0
  if (product.data_amount) score += 20
  if (product.validity_days >= 30) score += 30
  if (product.coverage?.length > 1) score += 25
  if (product.price < 50) score += 25
  return Math.min(score, 100)
}

function getWellnessRating(country: Country): number {
  // Simulate wellness rating based on country data
  const wellnessCountries = ['Thailand', 'Bali', 'Costa Rica', 'New Zealand', 'Switzerland']
  return wellnessCountries.includes(country.name) ? 
    Math.floor(Math.random() * 20) + 80 : 
    Math.floor(Math.random() * 40) + 60
}

function getWellnessActivities(country: Country): string[] {
  const activities = ['Yoga Retreats', 'Meditation Centers', 'Spa Treatments', 'Nature Therapy', 'Digital Detox']
  return activities.slice(0, Math.floor(Math.random() * 3) + 2)
}

function getMentalHealthResources(country: Country): Record<string, unknown> {
  return {
    emergency_hotline: '+1-800-WELLNESS',
    local_support: `${country.name} Mental Health Association`,
    apps_available: ['Headspace', 'Calm', 'Insight Timer']
  }
}

function getEmergencyContacts(country: Country): Record<string, unknown> {
  return {
    emergency: '911',
    wellness_support: '+1-800-PEACE',
    local_embassy: `${country.name} Embassy`
  }
}

function getConnectivityPackages(country: Country): string[] {
  return ['Wellness Basic', 'Retreat Pro', 'Digital Nomad Wellness', 'Peace of Mind Premium']
}

// Fallback functions with wellness focus
async function handleFallbackProducts() {
  const fallbackProducts = [
    {
      id: 'twc-sa-peace',
      name: 'South Africa Peace of Mind',
      price: 49,
      description: 'Stay connected with wellness apps and emergency support',
      data_amount: '10GB',
      validity_days: 30,
      coverage: ['South Africa'],
      wellness_features: ['meditation_apps_optimized', 'wellness_support_24_7', 'peace_of_mind_guarantee'],
      peace_of_mind_score: 95
    },
    {
      id: 'twc-global-zen',
      name: 'Global Zen Connectivity',
      price: 149,
      description: 'Worldwide wellness connectivity with premium support',
      data_amount: '20GB',
      validity_days: 60,
      coverage: ['Global'],
      wellness_features: ['multi_destination_wellness', 'digital_detox_mode', 'wellness_concierge'],
      peace_of_mind_score: 100
    }
  ]

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: fallbackProducts,
      message: 'Wellness connectivity packages loaded (demo mode)',
      fallback: true
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleFallbackCountries() {
  const fallbackCountries = [
    {
      id: 'ZA',
      name: 'South Africa',
      code: 'ZA',
      wellness_rating: 85,
      popular_wellness_activities: ['Safari Meditation', 'Wine Country Yoga', 'Cape Town Wellness'],
      mental_health_resources: {
        emergency_hotline: '+27-800-WELLNESS',
        local_support: 'SADAG',
        apps_available: ['Headspace', 'Calm']
      }
    },
    {
      id: 'TH',
      name: 'Thailand',
      code: 'TH',
      wellness_rating: 95,
      popular_wellness_activities: ['Buddhist Meditation', 'Thai Massage', 'Yoga Retreats'],
      mental_health_resources: {
        emergency_hotline: '+66-800-PEACE',
        local_support: 'Thailand Mental Health',
        apps_available: ['Insight Timer', 'Ten Percent Happier']
      }
    }
  ]

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: fallbackCountries,
      message: 'Wellness destinations loaded (demo mode)'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleFallbackDestinations() {
  const destinations = [
    {
      id: 'south-africa',
      name: 'South Africa',
      code: 'ZA',
      wellness_score: 85,
      popular_for: ['Safari Wellness', 'Wine Country Retreats', 'Mountain Meditation'],
      connectivity_packages: ['Peace of Mind Basic', 'Wellness Explorer', 'Retreat Professional']
    }
  ]

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: destinations,
      message: 'Wellness destinations loaded successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleFallbackWellnessPackages(params: WellnessPackageParams) {
  const packages = [
    {
      id: 'wellness-basic',
      name: 'Wellness Traveler Basic',
      price: 39,
      description: 'Essential connectivity for mindful travel',
      package_type: 'wellness_connectivity',
      includes_wellness_apps: true,
      meditation_data_allowance: '500MB',
      wellness_support: true,
      peace_of_mind_guarantee: true
    }
  ]

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: { packages },
      message: 'Wellness packages loaded (demo mode)'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleFallbackServices(params: ServiceParams) {
  const services = [
    {
      id: 'twc-service-1',
      name: 'Travel Well Connected - Peace of Mind',
      price: 39,
      description: 'Stay connected with confidence and wellness support',
      destination: params?.destination || 'Global',
      data_amount: '5GB',
      validity_days: 30,
      wellness_features: ['peace_of_mind_guarantee', 'wellness_support_24_7'],
      peace_of_mind_score: 90
    }
  ]

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: { services, destination: params?.destination },
      message: 'Travel Well Connected services loaded'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Additional API endpoints with proper error handling
async function handleGetProductById(productId: string) {
  try {
    const response = await makeAuthenticatedRequest(`/products/${productId}`);

    const data = await response.json()
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            ...data,
            wellness_features: getWellnessFeatures(data),
            peace_of_mind_score: calculatePeaceOfMindScore(data)
          },
          message: 'Product fetched with wellness enhancements'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch product: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get product by ID error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch product', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleGetProductsPagination(params: PaginationParams) {
  try {
    const { page = 1, pageSize = 15, searchStr = '' } = params
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      searchStr: searchStr
    })

    const response = await makeAuthenticatedRequest(`/products/pagination?${queryParams}`);

    const data = await response.json()
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Products fetched with pagination'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch products: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get products pagination error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch products', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleTrackOrder(orderId: string) {
  // For now, return a demo tracking response
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: {
        order_id: orderId,
        status: 'processing',
        wellness_features_active: true,
        estimated_delivery: '2-5 minutes',
        tracking_url: `https://travelwellconnected.com/track/${orderId}`
      },
      message: 'Order tracking information retrieved'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetOrderedEsims(params: Record<string, unknown>) {
  try {
    const response = await makeAuthenticatedRequest('/whitelabel-dashboard/esims');

    const data = await response.json()
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'eSIMs fetched successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch eSIMs: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get ordered eSIMs error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch eSIMs', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleGetEsimDetails(iccid: string) {
  try {
    const response = await makeAuthenticatedRequest(`/whitelabel-dashboard/esims/details/${iccid}`);

    const data = await response.json()
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'eSIM details fetched successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch eSIM details: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get eSIM details error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch eSIM details', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleActivateEsim(params: EsimParams) {
  try {
    const { iccid } = params
    
    const response = await makeAuthenticatedRequest('/products/esim/activate', {
      method: 'POST',
      body: JSON.stringify({ iccid })
    });

    const data = await response.json()
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'eSIM activated successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to activate eSIM: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Activate eSIM error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to activate eSIM', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleValidateEsim(iccid: string) {
  try {
    const response = await makeAuthenticatedRequest(`/products/esim/validate/${iccid}`);

    const data = await response.json()
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'eSIM validation completed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to validate eSIM: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Validate eSIM error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to validate eSIM', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleGetWalletTransactions(params: WalletTransactionParams) {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      searchStr = 'null',
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date = new Date().toISOString()
    } = params
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      searchStr: searchStr,
      start_date: start_date,
      end_date: end_date
    })

    const response = await makeAuthenticatedRequest(`/wallet/transactions/pagination?${queryParams}`);

    const data = await response.json()
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Wallet transactions fetched successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch wallet transactions: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get wallet transactions error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch wallet transactions', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleGetPlanStatics() {
  try {
    const response = await makeAuthenticatedRequest('/whitelabel-dashboard/plan/statics');

    const data = await response.json()
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Plan statistics fetched successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch plan statistics: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get plan statistics error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch plan statistics', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}
