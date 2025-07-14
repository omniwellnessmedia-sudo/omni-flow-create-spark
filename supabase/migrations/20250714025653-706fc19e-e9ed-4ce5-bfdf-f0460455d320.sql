-- Update Winter Wine Country Wellness Weekend tour with new images
UPDATE tours 
SET hero_image_url = '/src/assets/wine-country-yoga-hero.jpg',
    image_gallery = ARRAY[
      '/src/assets/wine-country-yoga-hero.jpg',
      '/src/assets/wine-country-spa.jpg',
      '/src/assets/wine-country-tasting.jpg',
      '/src/assets/wine-country-dining.jpg'
    ]
WHERE slug = 'winter-wine-country-wellness';