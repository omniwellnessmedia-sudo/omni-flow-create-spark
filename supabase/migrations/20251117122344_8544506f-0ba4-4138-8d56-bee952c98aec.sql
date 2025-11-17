-- Add Awin-specific indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_affiliate_products_awin 
ON public.affiliate_products(affiliate_program_id, is_active, is_featured) 
WHERE affiliate_program_id = 'awin';

-- Create function to auto-curate Awin products
CREATE OR REPLACE FUNCTION public.auto_curate_awin_products()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Mark high-value Awin products as featured
  UPDATE affiliate_products
  SET 
    is_featured = true,
    updated_at = now()
  WHERE 
    affiliate_program_id = 'awin'
    AND is_active = true
    AND commission_rate > 0.10
    AND image_url IS NOT NULL
    AND image_url != ''
    AND price_zar > 100
    AND is_featured = false;
END;
$$;