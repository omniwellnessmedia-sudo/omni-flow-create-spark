-- Update tour image galleries with authentic wellness community images

-- Cape Point Winter Adventure & Natural Hot Springs
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

-- Valley of Plenty Community Experience (add new tour)
INSERT INTO tours (
  title,
  slug,
  subtitle,
  destination,
  duration,
  price_from,
  max_participants,
  category_id,
  overview,
  highlights,
  inclusions,
  exclusions,
  hero_image_url,
  image_gallery,
  difficulty_level,
  featured,
  active
) VALUES (
  'Valley of Plenty Community Experience',
  'valley-of-plenty-community-experience',
  'Authentic community wellness and sustainable living in Hanover Park',
  'Hanover Park, Cape Town',
  '1 Day',
  850,
  15,
  (SELECT id FROM tour_categories WHERE slug = 'community-wellness' LIMIT 1),
  'Experience authentic community wellness through our groundbreaking Valley of Plenty project. Connect with local community leaders, participate in sustainable farming practices, and witness firsthand how conscious media and community development create lasting change.',
  ARRAY[
    'Meet community leaders and changemakers',
    'Participate in sustainable farming activities',
    'Traditional healing and wellness practices',
    'Community storytelling and media creation',
    'Authentic local meal preparation',
    'Animal therapy and connection'
  ],
  ARRAY[
    'Professional community guide',
    'Traditional wellness session',
    'Sustainable farming workshop',
    'Community-prepared organic lunch',
    'Animal interaction experience',
    'Take-home wellness products'
  ],
  ARRAY[
    'Personal transportation to/from venue',
    'Additional meals and beverages',
    'Personal wellness products',
    'Professional photography'
  ],
  '/lovable-uploads/1b3f083f-5a22-4727-aaf0-82b5126b80ca.png',
  ARRAY[
    '/lovable-uploads/1b3f083f-5a22-4727-aaf0-82b5126b80ca.png', -- Woman with baby - community
    '/lovable-uploads/eb359311-9ec0-46c6-8142-25362f949c17.png', -- Women holding hands - community connection
    '/lovable-uploads/88a81b0a-9d73-46f4-b070-762b9eb15a61.png', -- Group yoga/community activity
    '/lovable-uploads/a018e04a-b37c-46d3-9c2e-899b0799f2b9.png'  -- Man with cow - animal wellness
  ],
  'easy',
  true,
  true
);

-- Musical Wellness & Cultural Exchange
INSERT INTO tours (
  title,
  slug,
  subtitle,
  destination,
  duration,
  price_from,
  max_participants,
  category_id,
  overview,
  highlights,
  inclusions,
  exclusions,
  hero_image_url,
  image_gallery,
  difficulty_level,
  featured,
  active
) VALUES (
  'Musical Wellness & Cultural Exchange',
  'musical-wellness-cultural-exchange',
  'Healing through music, storytelling and community connection',
  'Various Cape Town Communities',
  'Half Day',
  650,
  12,
  (SELECT id FROM tour_categories WHERE slug = 'community-wellness' LIMIT 1),
  'Discover the healing power of music and storytelling in authentic South African communities. This unique experience combines musical therapy, cultural exchange, and community wellness practices.',
  ARRAY[
    'Live musical performance and participation',
    'Cultural storytelling sessions',
    'Community wellness circle',
    'Musical therapy techniques',
    'Traditional instrument experience',
    'Authentic cultural exchange'
  ],
  ARRAY[
    'Professional musical guide',
    'Traditional instrument try-out',
    'Community wellness session',
    'Cultural storytelling experience',
    'Light refreshments',
    'Wellness music playlist'
  ],
  ARRAY[
    'Transportation to/from communities',
    'Full meals',
    'Personal instruments',
    'Professional recordings'
  ],
  '/lovable-uploads/16362f62-3b3d-4bfa-af12-d0b98988b086.png',
  ARRAY[
    '/lovable-uploads/16362f62-3b3d-4bfa-af12-d0b98988b086.png', -- Man playing guitar
    '/lovable-uploads/ce7e6e42-f6c8-4108-a457-03a90f14a5b7.png', -- Community gathering
    '/lovable-uploads/88a81b0a-9d73-46f4-b070-762b9eb15a61.png'  -- Group community activity
  ],
  'easy',
  false,
  true
);