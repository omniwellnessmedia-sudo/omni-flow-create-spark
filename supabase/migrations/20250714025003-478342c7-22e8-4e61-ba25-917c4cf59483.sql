-- Update Winter Warmth: Fireplace Yoga & Meditation tour with new images
UPDATE tours 
SET hero_image_url = '/src/assets/winter-fireplace-yoga-hero.jpg',
    image_gallery = ARRAY[
      '/src/assets/winter-fireplace-yoga-hero.jpg',
      '/src/assets/winter-meditation-circle.jpg',
      '/src/assets/winter-yoga-deck.jpg',
      '/src/assets/winter-restorative-yoga.jpg'
    ]
WHERE slug = 'winter-fireplace-yoga-meditation';