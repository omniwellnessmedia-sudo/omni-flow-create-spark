-- Update tours with the new authentic images we uploaded
UPDATE tours 
SET hero_image_url = '/lovable-uploads/6c3c5c2b-d4ad-486f-aa7a-b612c07d9653.png',
    image_gallery = ARRAY[
      '/lovable-uploads/b06f757c-bbbf-45cc-bea2-39ff54049d39.png',
      '/lovable-uploads/6c3c5c2b-d4ad-486f-aa7a-b612c07d9653.png',
      '/lovable-uploads/d744ac4b-b61e-425e-a6b9-59e8ffbbba47.png'
    ]
WHERE slug = 'cape-point-winter-adventure-hot-springs';

UPDATE tours 
SET hero_image_url = '/lovable-uploads/ce7e6e42-f6c8-4108-a457-03a90f14a5b7.png',
    image_gallery = ARRAY[
      '/lovable-uploads/ce7e6e42-f6c8-4108-a457-03a90f14a5b7.png',
      '/lovable-uploads/611a6c41-63d0-42f7-9a69-956d00945399.png',
      '/lovable-uploads/a018e04a-b37c-46d3-9c2e-899b0799f2b9.png'
    ]
WHERE slug = 'winter-warmth-fireplace-yoga-meditation';

UPDATE tours 
SET hero_image_url = '/lovable-uploads/611a6c41-63d0-42f7-9a69-956d00945399.png',
    image_gallery = ARRAY[
      '/lovable-uploads/611a6c41-63d0-42f7-9a69-956d00945399.png',
      '/lovable-uploads/a018e04a-b37c-46d3-9c2e-899b0799f2b9.png',
      '/lovable-uploads/1b3f083f-5a22-4727-aaf0-82b5126b80ca.png'
    ]
WHERE slug = 'monthly-wellness-workshop-series';

UPDATE tours 
SET hero_image_url = '/lovable-uploads/d744ac4b-b61e-425e-a6b9-59e8ffbbba47.png',
    image_gallery = ARRAY[
      '/lovable-uploads/b06f757c-bbbf-45cc-bea2-39ff54049d39.png',
      '/lovable-uploads/d744ac4b-b61e-425e-a6b9-59e8ffbbba47.png',
      '/lovable-uploads/eb359311-9ec0-46c6-8142-25362f949c17.png'
    ]
WHERE slug = 'winter-wine-country-wellness-weekend';

-- Update other existing tours with some of the community images
UPDATE tours 
SET hero_image_url = '/lovable-uploads/1b3f083f-5a22-4727-aaf0-82b5126b80ca.png',
    image_gallery = ARRAY[
      '/lovable-uploads/1b3f083f-5a22-4727-aaf0-82b5126b80ca.png',
      '/lovable-uploads/eb359311-9ec0-46c6-8142-25362f949c17.png',
      '/lovable-uploads/88a81b0a-9d73-46f4-b070-762b9eb15a61.png'
    ]
WHERE title = 'Conscious Connections: Indigenous Wisdom & Healing';

UPDATE tours 
SET hero_image_url = '/lovable-uploads/16362f62-3b3d-4bfa-af12-d0b98988b086.png',
    image_gallery = ARRAY[
      '/lovable-uploads/16362f62-3b3d-4bfa-af12-d0b98988b086.png',
      '/lovable-uploads/ce7e6e42-f6c8-4108-a457-03a90f14a5b7.png',
      '/lovable-uploads/88a81b0a-9d73-46f4-b070-762b9eb15a61.png'
    ]
WHERE title = 'FACT Wellness Hybrid Classes';