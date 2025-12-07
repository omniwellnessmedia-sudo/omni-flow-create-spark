-- Update CJ products with low-quality book/album cover images to use wellness fallbacks
UPDATE affiliate_products 
SET image_url = 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat%202.jpg'
WHERE affiliate_program_id = 'cj' 
AND (
  image_url LIKE '%knetbooks.com%' 
  OR image_url LIKE '%ecampus.com%' 
  OR image_url LIKE '%biggerbooks.com%'
  OR image_url LIKE '%supraphonline.cz/cover/200%'
  OR image_url LIKE '%simages.ecampus%'
);