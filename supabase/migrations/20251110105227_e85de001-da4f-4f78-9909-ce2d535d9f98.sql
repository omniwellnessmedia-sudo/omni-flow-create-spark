-- User Wishlist/Favorites System
CREATE TABLE IF NOT EXISTS public.user_wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.affiliate_products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.user_wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist"
  ON public.user_wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist"
  ON public.user_wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist"
  ON public.user_wishlists FOR DELETE
  USING (auth.uid() = user_id);

-- Product Comparison System
CREATE TABLE IF NOT EXISTS public.product_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_ids uuid[] NOT NULL,
  comparison_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their comparisons"
  ON public.product_comparisons FOR ALL
  USING (auth.uid() = user_id);

-- Auto-curate Featured Products Function
CREATE OR REPLACE FUNCTION auto_curate_featured_products()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mark products as featured if they have:
  -- 1. High commission rate (>15%)
  -- 2. Good image (not null)
  -- 3. Active status
  UPDATE affiliate_products
  SET 
    is_featured = true,
    updated_at = now()
  WHERE 
    is_active = true
    AND commission_rate > 0.15
    AND image_url IS NOT NULL
    AND image_url != ''
    AND is_featured = false;
    
  -- Mark top viewed products as trending
  WITH top_viewed AS (
    SELECT id 
    FROM affiliate_products 
    WHERE is_active = true 
    AND view_count > 0
    ORDER BY view_count DESC 
    LIMIT 50
  )
  UPDATE affiliate_products
  SET 
    is_trending = true,
    updated_at = now()
  WHERE id IN (SELECT id FROM top_viewed)
  AND is_trending = false;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION auto_curate_featured_products() TO authenticated;
GRANT EXECUTE ON FUNCTION auto_curate_featured_products() TO service_role;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_wishlists_user_id ON public.user_wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wishlists_product_id ON public.user_wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_product_comparisons_user_id ON public.product_comparisons(user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_comparison_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_product_comparisons_updated_at
  BEFORE UPDATE ON public.product_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_comparison_updated_at();