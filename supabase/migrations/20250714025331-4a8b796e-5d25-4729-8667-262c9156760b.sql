-- Update FACT Wellness Hybrid Classes tour with new images
UPDATE tours 
SET hero_image_url = '/src/assets/fact-wellness-hero.jpg',
    image_gallery = ARRAY[
      '/src/assets/fact-wellness-hero.jpg',
      '/src/assets/fact-outdoor-fitness.jpg',
      '/src/assets/fact-personal-training.jpg',
      '/src/assets/fact-community-wellness.jpg'
    ]
WHERE slug = 'fact-wellness-hybrid-classes';