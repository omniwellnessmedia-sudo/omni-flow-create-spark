-- Deactivate broken Astronaut Galaxy Star Projector product (AliExpress page no longer exists)
UPDATE public.affiliate_products 
SET is_active = false 
WHERE id = '74746b58-9298-4ea2-8689-d213d24d1a5c';