-- Update tour categories with new images
UPDATE tour_categories 
SET image_url = '/src/assets/winter-wellness-category.jpg'
WHERE slug = 'winter-wellness';

UPDATE tour_categories 
SET image_url = '/src/assets/weekend-retreats-category.jpg'
WHERE slug = 'weekend-retreats';