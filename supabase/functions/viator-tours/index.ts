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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, productCode, location, category } = await req.json();

    console.log('Viator API action:', action, 'with API key length:', viatorApiKey.length);

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
      const searchBody = {
        filtering: {
          destination: 21781, // Cape Town destination ID
          tags: [21200, 21207, 21221] // Spas, Wellness & Fitness, Yoga & Meditation
        },
        currency: 'USD',
        pagination: {
          start: 1,
          count: 20
        }
      };

      console.log('Viator search request:', JSON.stringify(searchBody));

      const searchResponse = await fetch(
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
          body: JSON.stringify(searchBody),
        }
      );

      const responseText = await searchResponse.text();
      console.log('Viator response status:', searchResponse.status);
      console.log('Viator response:', responseText);

      if (!searchResponse.ok) {
        console.error('Viator search error:', responseText);
        throw new Error(`Viator search API returned ${searchResponse.status}: ${responseText}`);
      }

      const searchResults = JSON.parse(responseText);
      const products = searchResults.products || [];

      console.log(`Found ${products.length} tours from Viator`);

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
