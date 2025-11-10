-- Add performance indexes for affiliate_products table
CREATE INDEX IF NOT EXISTS idx_affiliate_products_featured 
  ON public.affiliate_products(is_featured) 
  WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_affiliate_products_trending 
  ON public.affiliate_products(is_trending) 
  WHERE is_trending = true;

CREATE INDEX IF NOT EXISTS idx_affiliate_products_category 
  ON public.affiliate_products(category)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_affiliate_products_view_count 
  ON public.affiliate_products(view_count DESC)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_affiliate_products_active 
  ON public.affiliate_products(is_active) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_affiliate_products_commission 
  ON public.affiliate_products(commission_rate DESC)
  WHERE is_active = true;