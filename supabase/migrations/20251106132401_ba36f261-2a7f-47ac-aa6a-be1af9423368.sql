-- Clean up bad product data before re-sync
-- Remove products with generic single-word titles
DELETE FROM public.affiliate_products 
WHERE affiliate_program_id = 'cj' 
AND (
  name IN ('Meditation', 'Wellness', 'Health', 'Yoga')
  OR LENGTH(name) < 10
  OR image_url LIKE '%//'
  OR image_url LIKE '%/'
  OR price_usd <= 0
  OR price_usd IS NULL
);

-- Remove duplicate products (keep most recent)
DELETE FROM public.affiliate_products a
USING public.affiliate_products b
WHERE a.affiliate_program_id = 'cj'
AND b.affiliate_program_id = 'cj'
AND a.external_product_id = b.external_product_id
AND a.created_at < b.created_at;