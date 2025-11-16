-- Deactivate low quality products for launch
-- Remove cigars, tobacco, extreme prices, and products with no images

UPDATE affiliate_products 
SET is_active = false 
WHERE 
  -- Adult/inappropriate products
  (LOWER(name) LIKE '%cigar%' 
   OR LOWER(name) LIKE '%tobacco%'
   OR LOWER(description) LIKE '%cigar%'
   OR LOWER(description) LIKE '%tobacco%')
  -- Extreme prices (data errors or luxury items)
  OR price_zar > 10000
  OR price_zar < 20
  -- No images or broken images
  OR image_url IS NULL
  OR image_url LIKE '%no_imaged%'
  OR image_url LIKE '%placeholder%'
  OR image_url LIKE '%coming-soon%'
  OR image_url = ''
  -- Generic non-wellness items
  OR LOWER(name) LIKE '%textbook%'
  OR LOWER(name) LIKE '%mechanism%'
  OR LOWER(category) LIKE '%book%'
  OR LOWER(category) LIKE '%literature%';

-- Update products to mark high-quality wellness items as featured
UPDATE affiliate_products 
SET is_featured = true 
WHERE id IN (
  SELECT id FROM affiliate_products
  WHERE is_active = true
    AND category IN ('Fitness Equipment', 'Yoga Equipment', 'Sports Nutrition', 'Vitamins & Supplements', 'Wellness Products')
    AND image_url IS NOT NULL
    AND image_url NOT LIKE '%no_imaged%'
    AND price_zar BETWEEN 50 AND 5000
    AND commission_rate > 0.08
  ORDER BY commission_rate DESC, view_count DESC
  LIMIT 20
);