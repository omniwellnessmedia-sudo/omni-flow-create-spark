-- Update Monthly Wellness Workshop Series tour with new images
UPDATE tours 
SET hero_image_url = '/src/assets/monthly-workshop-hero.jpg',
    image_gallery = ARRAY[
      '/src/assets/monthly-workshop-hero.jpg',
      '/src/assets/monthly-herbal-workshop.jpg',
      '/src/assets/monthly-meditation-workshop.jpg',
      '/src/assets/monthly-cooking-workshop.jpg'
    ]
WHERE slug = 'monthly-wellness-workshop-series';