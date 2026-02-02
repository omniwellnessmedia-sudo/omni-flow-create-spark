import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidateRequest {
  code: string;
  orderAmount: number;
  productId?: string;
}

serve(async (req) => {
  console.log('🎫 Validate Discount Code function started');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, orderAmount, productId }: ValidateRequest = await req.json();
    
    if (!code) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Discount code is required' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Validating code:', code, 'for order amount:', orderAmount);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the discount code
    const { data: discountCode, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single();

    if (error || !discountCode) {
      console.log('Code not found or error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid discount code',
          message: 'This code does not exist or has expired'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if code has expired
    if (discountCode.valid_until && new Date(discountCode.valid_until) < new Date()) {
      console.log('Code expired:', discountCode.valid_until);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Code expired',
          message: 'This discount code has expired'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if code hasn't started yet
    if (discountCode.valid_from && new Date(discountCode.valid_from) > new Date()) {
      console.log('Code not yet valid:', discountCode.valid_from);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Code not yet valid',
          message: 'This discount code is not yet active'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check usage limits
    if (discountCode.max_uses && discountCode.current_uses >= discountCode.max_uses) {
      console.log('Code usage limit reached:', discountCode.current_uses, '/', discountCode.max_uses);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Code limit reached',
          message: 'This discount code has reached its usage limit'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check minimum order amount
    if (discountCode.min_order_amount && orderAmount < discountCode.min_order_amount) {
      console.log('Order amount too low:', orderAmount, '< min:', discountCode.min_order_amount);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Minimum not met',
          message: `Minimum order amount of $${discountCode.min_order_amount} required`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check applicable products
    if (discountCode.applicable_products && discountCode.applicable_products.length > 0 && productId) {
      if (!discountCode.applicable_products.includes(productId)) {
        console.log('Product not applicable:', productId);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Not applicable',
            message: 'This code cannot be used for this product'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discountCode.discount_type === 'percentage') {
      discountAmount = orderAmount * (discountCode.discount_value / 100);
    } else {
      discountAmount = Math.min(discountCode.discount_value, orderAmount);
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalAmount = Math.round((orderAmount - discountAmount) * 100) / 100;

    console.log('✅ Code validated successfully');
    console.log('Discount:', discountAmount, 'Final:', finalAmount, 'WellCoins bonus:', discountCode.wellcoins_bonus);

    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          code: discountCode.code,
          discountType: discountCode.discount_type,
          discountValue: discountCode.discount_value,
          discountAmount: discountAmount,
          finalAmount: finalAmount,
          wellcoinsBonus: discountCode.wellcoins_bonus || 0,
          description: discountCode.description,
          message: discountCode.discount_type === 'percentage' 
            ? `${discountCode.discount_value}% off applied!`
            : `$${discountCode.discount_value} off applied!`
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Validate discount code error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Validation failed',
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
