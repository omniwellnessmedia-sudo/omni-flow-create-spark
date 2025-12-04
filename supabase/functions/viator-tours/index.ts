import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ViatorProduct {
  productCode: string;
  title: string;
  description?: string;
  duration?: string;
  pricing?: {
    summary?: {
      fromPrice?: number;
      fromPriceBeforeDiscount?: number;
    };
    currency?: string;
  };
  location?: {
    name?: string;
  };
  productOptions?: Array<{
    description?: string;
    duration?: {
      fixedDurationInMinutes?: number;
    };
  }>;
  images?: Array<{
    imageSource?: string;
    caption?: string;
  }>;
  reviews?: {
    combinedAverageRating?: number;
    totalReviews?: number;
  };
  bookingInfo?: {
    bookingUrl?: string;
  };
  tags?: Array<{
    tagName?: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const viatorApiKey = Deno.env.get('VIATOR_API_KEY');
    if (!viatorApiKey) {
      throw new Error('VIATOR_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    const { action, productCode, location, category } = await req.json();

    console.log('Viator API action:', action, 'with API key length:', viatorApiKey.length);

    // Allow 'get_cached_tours' and 'search_tours' without authentication for public access
    // Admin operations like 'fetch_product' still require authentication
    if (action !== 'get_cached_tours' && action !== 'search_tours') {
      // Verify user is authenticated and has admin role for write operations
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized - admin access required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check admin status using the secure is_admin function
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_admin', { user_id: user.id });

      if (adminError || !isAdmin) {
        return new Response(
          JSON.stringify({ error: 'Admin access required for this operation' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Action: Fetch specific product details
    if (action === 'fetch_product') {
      if (!productCode) {
        return new Response(
          JSON.stringify({ error: 'Product code is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(
        `https://api.viator.com/partner/products/${productCode}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json;version=2.0',
            'Accept-Language': 'en-US',
            'exp-api-key': viatorApiKey,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Viator API error:', response.status, errorText);
        throw new Error(`Viator API returned ${response.status}: ${errorText}`);
      }

      const product: ViatorProduct = await response.json();

      // Cache in database
      const tourData = {
        viator_product_code: product.productCode,
        title: product.title,
        description: product.description || '',
        duration: product.productOptions?.[0]?.duration?.fixedDurationInMinutes 
          ? `${Math.floor(product.productOptions[0].duration.fixedDurationInMinutes / 60)} hours`
          : product.duration || 'Varies',
        price_from: product.pricing?.summary?.fromPrice || 0,
        currency: product.pricing?.currency || 'USD',
        location: product.location?.name || '',
        category: product.tags?.[0]?.tagName || 'Tour',
        rating: product.reviews?.combinedAverageRating || 0,
        review_count: product.reviews?.totalReviews || 0,
        image_url: product.images?.[0]?.imageSource || '',
        booking_url: `https://www.viator.com/tours/${product.productCode}`,
        availability: 'Available',
        highlights: product.productOptions || [],
        last_synced_at: new Date().toISOString(),
        is_active: true,
      };

      const { error: upsertError } = await supabase
        .from('viator_tours')
        .upsert(tourData, { onConflict: 'viator_product_code' });

      if (upsertError) {
        console.error('Error caching tour:', upsertError);
      }

      return new Response(
        JSON.stringify({ success: true, product: tourData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Search and sync tours from Viator
    if (action === 'search_tours') {
      const products: ViatorProduct[] = [];
      
      // Search 1: South Africa destination (destination ID 318)
      const saSearchBody = {
        filtering: {
          destination: 318, // South Africa destination ID
        },
        currency: 'USD',
        pagination: {
          start: 1,
          count: 30
        }
      };

      console.log('Viator search request (South Africa):', JSON.stringify(saSearchBody));

      const saResponse = await fetch(
        'https://api.viator.com/partner/products/search',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json;version=2.0',
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept-Language': 'en-US',
            'exp-api-key': viatorApiKey,
          },
          body: JSON.stringify(saSearchBody),
        }
      );

      const saResponseText = await saResponse.text();
      console.log('SA response status:', saResponse.status);
      console.log('SA response preview:', saResponseText.substring(0, 500));

      if (saResponse.ok) {
        const saResults = JSON.parse(saResponseText);
        products.push(...(saResults.products || []));
        console.log(`Found ${saResults.products?.length || 0} tours from South Africa`);
      }

      // Search 2: Wellness/Spa tags globally
      const wellnessSearchBody = {
        filtering: {
          tags: [21911] // Spa & Wellness tag
        },
        currency: 'USD',
        pagination: {
          start: 1,
          count: 20
        }
      };

      console.log('Viator search request (Wellness):', JSON.stringify(wellnessSearchBody));

      const wellnessResponse = await fetch(
        'https://api.viator.com/partner/products/search',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json;version=2.0',
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept-Language': 'en-US',
            'exp-api-key': viatorApiKey,
          },
          body: JSON.stringify(wellnessSearchBody),
        }
      );

      if (wellnessResponse.ok) {
        const wellnessResults = await wellnessResponse.json();
        // Add unique products
        const existingCodes = new Set(products.map(p => p.productCode));
        for (const product of wellnessResults.products || []) {
          if (!existingCodes.has(product.productCode)) {
            products.push(product);
          }
        }
        console.log(`Found ${wellnessResults.products?.length || 0} wellness tours`);
      }

      // Search 3: Nature & Wildlife
      const natureSearchBody = {
        filtering: {
          tags: [11889] // Nature & Wildlife tag
        },
        currency: 'USD',
        pagination: {
          start: 1,
          count: 20
        }
      };

      const natureResponse = await fetch(
        'https://api.viator.com/partner/products/search',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json;version=2.0',
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept-Language': 'en-US',
            'exp-api-key': viatorApiKey,
          },
          body: JSON.stringify(natureSearchBody),
        }
      );

      if (natureResponse.ok) {
        const natureResults = await natureResponse.json();
        const existingCodes = new Set(products.map(p => p.productCode));
        for (const product of natureResults.products || []) {
          if (!existingCodes.has(product.productCode)) {
            products.push(product);
          }
        }
        console.log(`Found ${natureResults.products?.length || 0} nature tours`);
      }

      console.log(`Total unique tours found: ${products.length}`);

      // Cache all products in database
      const toursToCache = products.map((product: ViatorProduct) => ({
        viator_product_code: product.productCode,
        title: product.title,
        description: product.description || '',
        duration: product.productOptions?.[0]?.duration?.fixedDurationInMinutes 
          ? `${Math.floor(product.productOptions[0].duration.fixedDurationInMinutes / 60)} hours`
          : product.duration || 'Varies',
        price_from: product.pricing?.summary?.fromPrice || 0,
        currency: product.pricing?.currency || 'USD',
        location: product.location?.name || location || 'Cape Town',
        category: product.tags?.[0]?.tagName || category || 'Tour',
        rating: product.reviews?.combinedAverageRating || 0,
        review_count: product.reviews?.totalReviews || 0,
        image_url: product.images?.[0]?.imageSource || '',
        booking_url: `https://www.viator.com/tours/${product.productCode}`,
        availability: 'Available',
        highlights: product.productOptions || [],
        last_synced_at: new Date().toISOString(),
        is_active: true,
      }));

      if (toursToCache.length > 0) {
        const { error: bulkUpsertError } = await supabase
          .from('viator_tours')
          .upsert(toursToCache, { onConflict: 'viator_product_code' });

        if (bulkUpsertError) {
          console.error('Error bulk caching tours:', bulkUpsertError);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          count: products.length,
          tours: toursToCache 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Get cached tours from database
    if (action === 'get_cached_tours') {
      let query = supabase
        .from('viator_tours')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data: tours, error } = await query.limit(20);

      if (error) {
        console.error('Error fetching cached tours:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true, tours: tours || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use: fetch_product, search_tours, or get_cached_tours' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in viator-tours function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
