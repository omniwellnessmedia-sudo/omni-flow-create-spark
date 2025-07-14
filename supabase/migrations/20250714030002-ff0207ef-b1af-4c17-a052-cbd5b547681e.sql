-- Update Cape Town Service Learning Program tour with new images
UPDATE tours 
SET hero_image_url = '/src/assets/service-learning-hero.jpg',
    image_gallery = ARRAY[
      '/src/assets/service-learning-hero.jpg',
      '/src/assets/service-learning-education.jpg',
      '/src/assets/service-learning-garden.jpg',
      '/src/assets/service-learning-reflection.jpg'
    ]
WHERE slug = 'cape-town-service-learning-program';