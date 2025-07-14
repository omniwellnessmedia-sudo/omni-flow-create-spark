-- Update existing tours with authentic images first
UPDATE tours 
SET image_gallery = ARRAY[
  '/lovable-uploads/b06f757c-bbbf-45cc-bea2-39ff54049d39.png', -- Woman hiking on trail
  '/lovable-uploads/6c3c5c2b-d4ad-486f-aa7a-b612c07d9653.png', -- People in natural hot springs
  '/lovable-uploads/d744ac4b-b61e-425e-a6b9-59e8ffbbba47.png'  -- People hiking in nature
],
hero_image_url = '/lovable-uploads/6c3c5c2b-d4ad-486f-aa7a-b612c07d9653.png'
WHERE slug = 'cape-point-winter-adventure-hot-springs';

-- Winter Warmth: Fireplace Yoga & Meditation
UPDATE tours 
SET image_gallery = ARRAY[
  '/lovable-uploads/ce7e6e42-f6c8-4108-a457-03a90f14a5b7.png', -- Group around fire pit
  '/lovable-uploads/611a6c41-63d0-42f7-9a69-956d00945399.png', -- Outdoor yoga session
  '/lovable-uploads/a018e04a-b37c-46d3-9c2e-899b0799f2b9.png'  -- More outdoor yoga
],
hero_image_url = '/lovable-uploads/ce7e6e42-f6c8-4108-a457-03a90f14a5b7.png'
WHERE slug = 'winter-warmth-fireplace-yoga-meditation';

-- Update Monthly Wellness Workshop Series with yoga images
UPDATE tours 
SET image_gallery = ARRAY[
  '/lovable-uploads/611a6c41-63d0-42f7-9a69-956d00945399.png', -- Outdoor yoga session
  '/lovable-uploads/a018e04a-b37c-46d3-9c2e-899b0799f2b9.png', -- More outdoor yoga
  '/lovable-uploads/1b3f083f-5a22-4727-aaf0-82b5126b80ca.png'  -- Community wellness
],
hero_image_url = '/lovable-uploads/611a6c41-63d0-42f7-9a69-956d00945399.png'
WHERE slug = 'monthly-wellness-workshop-series';

-- Update Wine Country tour with hiking and community images
UPDATE tours 
SET image_gallery = ARRAY[
  '/lovable-uploads/b06f757c-bbbf-45cc-bea2-39ff54049d39.png', -- Woman hiking
  '/lovable-uploads/d744ac4b-b61e-425e-a6b9-59e8ffbbba47.png', -- People in vineyard/nature
  '/lovable-uploads/eb359311-9ec0-46c6-8142-25362f949c17.png'  -- Community connection
],
hero_image_url = '/lovable-uploads/d744ac4b-b61e-425e-a6b9-59e8ffbbba47.png'
WHERE slug = 'winter-wine-country-wellness-weekend';