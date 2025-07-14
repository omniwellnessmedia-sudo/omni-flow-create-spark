-- Update Cape Point Winter Adventure tour with new authentic images
UPDATE tours 
SET hero_image_url = '/src/assets/cape-point-adventure-hero.jpg',
    image_gallery = ARRAY[
      '/src/assets/cape-point-adventure-hero.jpg',
      '/src/assets/cape-point-hot-springs.jpg',
      '/src/assets/cape-point-hiking.jpg',
      '/src/assets/cape-point-winter-picnic.jpg'
    ]
WHERE slug = 'cape-point-winter-hot-springs';