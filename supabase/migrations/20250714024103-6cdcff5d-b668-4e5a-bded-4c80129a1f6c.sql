-- Update Conscious Connections tour with new authentic Cape Town images
UPDATE tours 
SET hero_image_url = '/src/assets/conscious-connections-hero.jpg',
    image_gallery = ARRAY[
      '/src/assets/conscious-connections-hero.jpg',
      '/src/assets/conscious-connections-healer.jpg',
      '/src/assets/conscious-connections-medicine.jpg',
      '/src/assets/conscious-connections-community.jpg'
    ]
WHERE slug = 'conscious-connections-indigenous-wisdom-healing';