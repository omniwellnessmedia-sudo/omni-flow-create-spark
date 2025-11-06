import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Official CJ Product Feed GraphQL endpoint
// Reference: https://developers.cj.com/graphql/reference/Product%20Feed
const CJ_PRODUCT_FEED_ENDPOINT = 'https://ads.api.cj.com/query';

// Image validation helper
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  if (url.endsWith('/')) return false;
  const hasValidDomain = url.startsWith('http://') || url.startsWith('https://');
  const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  const looksLikeImage = url.includes('image') || url.includes('img') || url.includes('product');
  return hasValidDomain && (hasImageExtension || looksLikeImage);
};

// Extract domain from advertiser name for logo fetching
const extractDomain = (advertiserName: string): string => {
  if (!advertiserName) return '';
  const cleaned = advertiserName
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/(inc|llc|ltd|corp|corporation|company|co)$/i, '');
  return `${cleaned}.com`;
};

// Fetch brand logo from Clearbit
const fetchBrandLogo = async (advertiserName: string): Promise<string | null> => {
  if (!advertiserName) return null;
  
  const domain = extractDomain(advertiserName);
  
  try {
    const clearbitUrl = `https://logo.clearbit.com/${domain}`;
    const response = await fetch(clearbitUrl, { method: 'HEAD' });
    if (response.ok) {
      return clearbitUrl;
    }
  } catch (error) {
    console.log(`Logo fetch failed for ${domain}`);
  }
  
  return null;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CJ_PAT = Deno.env.get('CJ_PERSONAL_ACCESS_TOKEN');
    const CJ_COMPANY_ID = Deno.env.get('CJ_COMPANY_ID');

    if (!CJ_PAT) {
      throw new Error('CJ Personal Access Token not configured');
    }

    if (!CJ_COMPANY_ID) {
      throw new Error('CJ Company ID not configured. Please add your CJ_COMPANY_ID secret in Supabase.');
    }

    const { category, keywords, limit = 100 } = await req.json();
    const searchKeywords = keywords || category || 'wellness';

    console.log('Fetching CJ products via GraphQL:', { category, keywords, limit, companyId: CJ_COMPANY_ID });

    // Build GraphQL query for Product Search using the official CJ Product Feed API
    // Reference: https://developers.cj.com/graphql/reference/Product%20Feed
    const graphqlQuery = {
      query: `
        query ProductSearch($companyId: ID!, $keywords: [String!], $limit: Int) {
          products(
            companyId: $companyId
            keywords: $keywords
            limit: $limit
          ) {
            totalCount
            resultList {
              id
              title
              description
              advertiserId
              advertiserName
              price {
                amount
                currency
              }
              imageLink
              link
              catalogId
            }
          }
        }
      `,
      variables: {
        companyId: CJ_COMPANY_ID,
        keywords: [searchKeywords],
        limit: limit
      }
    };

    console.log('GraphQL Query:', JSON.stringify(graphqlQuery, null, 2));

    const response = await fetch(CJ_PRODUCT_FEED_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CJ_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CJ API error (${response.status}):`, errorText);
      throw new Error(`CJ API returned HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✓ Success:`, JSON.stringify(data, null, 2));

    // Check for GraphQL errors
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const productsData = data.data?.products;
    const totalCount = productsData?.totalCount || 0;
    const resultList = productsData?.resultList || [];

    console.log('Products found:', {
      totalCount,
      productsReturned: resultList.length
    });

    // Initialize Supabase client for storing products
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Transform CJ products to our format with image validation and brand data
    const productsWithBrands = await Promise.all(
      resultList
        .filter((product: any) => {
          const hasValidImage = isValidImageUrl(product.imageLink);
          if (!hasValidImage) {
            console.log(`Skipping product with invalid image: ${product.title}`);
          }
          return hasValidImage;
        })
        .map(async (product: any) => {
          const priceAmount = parseFloat(product.price?.amount || '0');
          const advertiserName = product.advertiserName || null;
          const advertiserId = product.advertiserId || null;
          
          // Fetch brand logo
          const brandLogoUrl = advertiserName ? await fetchBrandLogo(advertiserName) : null;
          
          return {
            affiliate_program_id: 'cj',
            external_product_id: product.id,
            name: product.title,
            description: product.description || '',
            category: category || 'General Wellness',
            image_url: product.imageLink || null,
            affiliate_url: product.link || '',
            price_usd: priceAmount,
            price_zar: priceAmount * 18.5,
            price_eur: priceAmount * 0.92,
            commission_rate: 0.08,
            is_active: true,
            advertiser_id: advertiserId,
            advertiser_name: advertiserName,
            brand_logo_url: brandLogoUrl,
            last_synced_at: new Date().toISOString(),
          };
        })
    );

    // Store products in database
    if (productsWithBrands.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('affiliate_products')
        .upsert(productsWithBrands, { 
          onConflict: 'external_product_id,affiliate_program_id',
          ignoreDuplicates: false 
        });

      if (insertError) {
        console.error('Error inserting products:', insertError);
      } else {
        console.log(`Inserted ${productsWithBrands.length} products into database`);
      }

      // Update affiliate_brands table
      const uniqueBrands = productsWithBrands
        .filter(p => p.advertiser_id && p.advertiser_name)
        .reduce((acc: any[], product) => {
          if (!acc.find(b => b.advertiser_id === product.advertiser_id)) {
            acc.push({
              advertiser_id: product.advertiser_id,
              name: product.advertiser_name,
              logo_url: product.brand_logo_url
            });
          }
          return acc;
        }, []);

      if (uniqueBrands.length > 0) {
        const { error: brandError } = await supabaseClient
          .from('affiliate_brands')
          .upsert(uniqueBrands, { 
            onConflict: 'advertiser_id',
            ignoreDuplicates: false 
          });

        if (brandError) {
          console.error('Error upserting brands:', brandError);
        } else {
          console.log(`Synced ${uniqueBrands.length} brands`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalRecords: totalCount,
        products: productsWithBrands,
        metadata: {
          category,
          keywords: searchKeywords,
          fetchedAt: new Date().toISOString(),
          endpoint: CJ_PRODUCT_FEED_ENDPOINT
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error fetching CJ products:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
