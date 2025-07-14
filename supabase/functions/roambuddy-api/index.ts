import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// RoamBuddy API configuration
const ROAMBUDDY_API_URL = Deno.env.get('ROAMBUDDY_API_URL') || 'https://api.worldroambuddy.com:3001/api/v1'
const ROAMBUDDY_USERNAME = Deno.env.get('ROAMBUDDY_USERNAME')
const ROAMBUDDY_PASSWORD = Deno.env.get('ROAMBUDDY_PASSWORD')
const ROAMBUDDY_ACCESS_TOKEN = Deno.env.get('ROAMBUDDY_ACCESS_TOKEN')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    console.log('RoamBuddy API action:', action, 'data:', data)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'test':
        return handleTest()
      
      case 'authenticate':
        return await handleAuthenticate()
      
      case 'getAllProducts':
        return await handleGetAllProducts()
      
      case 'getServices':
        // Map getServices to getAllProducts for backward compatibility
        return await handleGetServicesForDestination(data)
      
      case 'getProductById':
        return await handleGetProductById(data.productId)
      
      case 'getProductsPagination':
        return await handleGetProductsPagination(data)
      
      case 'getWalletTransactions':
        return await handleGetWalletTransactions(data)
      
      case 'createOrder':
        return await handleCreateOrder(data, supabase)
      
      case 'getCountries':
        return await handleGetCountries()
      
      case 'getPlanStatics':
        return await handleGetPlanStatics()
      
      case 'getOrderedEsims':
        return await handleGetOrderedEsims()
      
      case 'getEsimDetails':
        return await handleGetEsimDetails(data.iccid)
      
      case 'activateEsim':
        return await handleActivateEsim(data)
      
      case 'validateEsim':
        return await handleValidateEsim(data.iccid)
      
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Unknown action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

  } catch (error) {
    console.error('RoamBuddy API Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})

// Test connection
function handleTest() {
  const hasCredentials = !!(ROAMBUDDY_API_URL && ROAMBUDDY_ACCESS_TOKEN)
  
  return new Response(
    JSON.stringify({ 
      success: hasCredentials,
      message: hasCredentials ? 'RoamBuddy API configured successfully' : 'Missing RoamBuddy credentials',
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

// Authenticate with RoamBuddy
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

// Get all products
async function handleGetAllProducts() {
  try {
    const response = await fetch(`${ROAMBUDDY_API_URL}/products/all`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Get all products response:', data)

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Products fetched successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch products: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get products error:', error)
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

// Get services for destination - maps to getAllProducts with filtering
async function handleGetServicesForDestination(params: any) {
  try {
    const { destination } = params
    console.log('Getting services for destination:', destination)
    
    // Get all products from RoamBuddy
    const response = await fetch(`${ROAMBUDDY_API_URL}/products/all`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Get services for destination response:', data)

    if (response.ok) {
      // Transform products to services format and filter by destination if needed
      let services = []
      
      if (data && Array.isArray(data)) {
        services = data.map((product: any) => ({
          id: product.id || `service-${Date.now()}-${Math.random()}`,
          name: product.name || product.title || 'eSIM Service',
          price: product.price || product.amount || 0,
          description: product.description || `Data plan for ${destination}`,
          destination: destination,
          data_amount: product.data_amount || '1GB',
          validity_days: product.validity_days || 30,
          coverage: product.coverage || [destination]
        }))
      }

      // If no products returned or API fails, return default South Africa services
      if (services.length === 0) {
        services = [
          { 
            id: 'esim-sa-1gb', 
            name: 'South Africa eSIM - 1GB', 
            price: 12, 
            description: '1GB data valid for 7 days in South Africa',
            destination: destination,
            data_amount: '1GB',
            validity_days: 7,
            coverage: ['South Africa']
          },
          { 
            id: 'esim-sa-3gb', 
            name: 'South Africa eSIM - 3GB', 
            price: 25, 
            description: '3GB data valid for 30 days in South Africa',
            destination: destination,
            data_amount: '3GB',
            validity_days: 30,
            coverage: ['South Africa']
          },
          { 
            id: 'esim-sa-5gb', 
            name: 'South Africa eSIM - 5GB', 
            price: 39, 
            description: '5GB data valid for 30 days in South Africa',
            destination: destination,
            data_amount: '5GB',
            validity_days: 30,
            coverage: ['South Africa']
          },
          { 
            id: 'esim-africa-regional', 
            name: 'Africa Regional eSIM - 2GB', 
            price: 35, 
            description: '2GB data for multiple African countries, 30 days',
            destination: destination,
            data_amount: '2GB',
            validity_days: 30,
            coverage: ['South Africa', 'Kenya', 'Nigeria', 'Ghana']
          }
        ]
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            services: services,
            total: services.length,
            destination: destination
          },
          message: 'Services fetched successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch services: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get services for destination error:', error)
    
    // Return fallback services on error
    const fallbackServices = [
      { 
        id: 'esim-sa-1gb', 
        name: 'South Africa eSIM - 1GB', 
        price: 12, 
        description: '1GB data valid for 7 days in South Africa',
        destination: params?.destination || 'South Africa',
        data_amount: '1GB',
        validity_days: 7
      },
      { 
        id: 'esim-sa-3gb', 
        name: 'South Africa eSIM - 3GB', 
        price: 25, 
        description: '3GB data valid for 30 days in South Africa',
        destination: params?.destination || 'South Africa',
        data_amount: '3GB',
        validity_days: 30
      },
      { 
        id: 'esim-sa-5gb', 
        name: 'South Africa eSIM - 5GB', 
        price: 39, 
        description: '5GB data valid for 30 days in South Africa',
        destination: params?.destination || 'South Africa',
        data_amount: '5GB',
        validity_days: 30
      },
      { 
        id: 'esim-africa-regional', 
        name: 'Africa Regional eSIM - 2GB', 
        price: 35, 
        description: '2GB data for multiple African countries, 30 days',
        destination: params?.destination || 'South Africa',
        data_amount: '2GB',
        validity_days: 30
      }
    ]

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          services: fallbackServices,
          total: fallbackServices.length,
          destination: params?.destination || 'South Africa',
          fallback: true
        },
        message: 'Services fetched (fallback data)'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Get product by ID
async function handleGetProductById(productId: string) {
  try {
    const response = await fetch(`${ROAMBUDDY_API_URL}/products/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Get product by ID response:', data)

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Product fetched successfully'
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

// Get products with pagination
async function handleGetProductsPagination(params: any) {
  try {
    const { page = 1, pageSize = 15, searchStr = '' } = params
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      searchStr: searchStr
    })

    const response = await fetch(`${ROAMBUDDY_API_URL}/products/pagination?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Get products pagination response:', data)

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Products fetched successfully'
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

// Get wallet transactions
async function handleGetWalletTransactions(params: any) {
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

    const response = await fetch(`${ROAMBUDDY_API_URL}/wallet/transactions/pagination?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Get wallet transactions response:', data)

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

// Create order - For now, this will be a demo implementation
// You'll need to implement the actual order creation endpoint when RoamBuddy provides it
async function handleCreateOrder(orderData: any, supabase: any) {
  try {
    console.log('Creating order with data:', orderData)

    // Store order in our database for tracking
    const { data: order, error: orderError } = await supabase
      .from('tour_bookings')
      .insert([
        {
          tour_id: orderData.product_id || 'roambuddy-esim',
          user_id: orderData.user_id || '00000000-0000-0000-0000-000000000000',
          contact_name: orderData.customer_name || 'eSIM Customer',
          contact_email: orderData.customer_email || 'customer@omniwellnessmedia.com',
          total_price: orderData.amount || 0,
          booking_date: new Date().toISOString().split('T')[0],
          participants: 1,
          status: 'pending',
          payment_status: 'pending',
          roambuddy_services: {
            product_name: orderData.product_name,
            destination: orderData.destination,
            currency: orderData.currency
          }
        }
      ])
      .select()

    if (orderError) {
      console.error('Database order error:', orderError)
    }

    // For now, return a demo success response
    // When RoamBuddy provides the order creation endpoint, integrate it here
    const demoOrderId = `RB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          order_id: demoOrderId,
          status: 'pending',
          product_name: orderData.product_name,
          amount: orderData.amount,
          currency: orderData.currency,
          customer_email: orderData.customer_email,
          message: 'Order created successfully - Integration with RoamBuddy payment gateway pending',
          demo_mode: true,
          payment_url: null // When available, this would be the RoamBuddy payment URL
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Create order error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to create order', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

// Get countries list
async function handleGetCountries() {
  try {
    const response = await fetch(`${ROAMBUDDY_API_URL}/whitelabel-dashboard/countries`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Get countries response:', data)

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Countries fetched successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch countries: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get countries error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch countries', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

// Get plan statistics
async function handleGetPlanStatics() {
  try {
    const response = await fetch(`${ROAMBUDDY_API_URL}/whitelabel-dashboard/plan/statics`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Get plan statics response:', data)

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
    console.error('Get plan statics error:', error)
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

// Get ordered eSIMs
async function handleGetOrderedEsims() {
  try {
    const response = await fetch(`${ROAMBUDDY_API_URL}/whitelabel-dashboard/esims`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Get ordered eSIMs response:', data)

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Ordered eSIMs fetched successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(`Failed to fetch ordered eSIMs: ${data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Get ordered eSIMs error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch ordered eSIMs', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

// Get eSIM details
async function handleGetEsimDetails(iccid: string) {
  try {
    const response = await fetch(`${ROAMBUDDY_API_URL}/whitelabel-dashboard/esims/details/${iccid}`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Get eSIM details response:', data)

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

// Activate eSIM
async function handleActivateEsim(params: any) {
  try {
    const { iccid } = params
    
    const response = await fetch(`${ROAMBUDDY_API_URL}/products/esim/activate`, {
      method: 'POST',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ iccid })
    })

    const data = await response.json()
    console.log('Activate eSIM response:', data)

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

// Validate eSIM
async function handleValidateEsim(iccid: string) {
  try {
    const response = await fetch(`${ROAMBUDDY_API_URL}/products/esim/validate/${iccid}`, {
      method: 'GET',
      headers: {
        'Authorization': ROAMBUDDY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Validate eSIM response:', data)

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