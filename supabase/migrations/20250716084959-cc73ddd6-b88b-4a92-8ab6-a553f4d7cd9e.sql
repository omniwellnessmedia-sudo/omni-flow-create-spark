-- Update tour prices to be more affordable and realistic
UPDATE tours SET 
  price_from = 1850.00,
  overview = 'Experience the perfect blend of luxury and wellness in the heart of Stellenbosch wine country. This intimate weekend retreat combines daily yoga sessions led by Chad with world-class wine tastings, spa treatments, and farm-to-table dining. Stay in luxury accommodations surrounded by vineyards, enjoy cozy evenings by the fire, and leave feeling completely refreshed and renewed. Perfect for couples or solo travelers seeking a luxurious yet mindful escape.'
WHERE slug = 'winter-wine-country-wellness';

UPDATE tours SET 
  price_from = 225.00,
  overview = 'Escape Cape Town''s winter chill with our unique fireplace yoga sessions held in the city''s most beautiful venues. Chad guides intimate groups through warming yoga flows, breathwork, and meditation while you stay perfectly cozy by crackling fires. These therapeutic sessions focus on internal heat generation, warming pranayama, and restorative practices that will leave you feeling energized and peaceful. Perfect for all levels, from complete beginners to experienced practitioners.'
WHERE slug = 'winter-fireplace-yoga-meditation';

UPDATE tours SET 
  price_from = 3850.00,
  overview = 'Embark on a profound journey of cultural exchange and personal transformation through authentic indigenous wisdom traditions. Work respectfully with Khoisan knowledge keepers and traditional healers to learn time-honored healing practices, plant medicine preparation, and ancient philosophies. This ethically-designed program takes you through the diverse landscapes of the Western Cape, from sacred Cederberg rock art sites to pristine coastal healing environments, creating lasting connections between ancient wisdom and modern wellness.'
WHERE slug = 'conscious-connections-indigenous-wisdom-healing';

UPDATE tours SET 
  price_from = 2950.00,
  overview = 'Make a meaningful impact while experiencing the incredible diversity of Cape Town and the Western Cape. Work alongside local organizations in townships, coastal conservation areas, and urban farming initiatives that address real social and environmental challenges. This immersive program combines hands-on service learning with cultural experiences, language learning, and personal growth opportunities. Includes accommodation, meals, and transformative experiences that will change your perspective on community, sustainability, and global citizenship.'
WHERE slug = 'cape-town-service-learning-program';

UPDATE tours SET 
  price_from = 45.00,
  overview = 'Join Chad and expert instructors at our innovative wellness studio in beautiful Muizenberg for dynamic classes that blend in-person and digital experiences. Whether you''re on the beach, in the mountains, or at home, access world-class instruction in yoga, QiGong, Pilates, breathwork, and meditation designed specifically for Cape Town''s unique energy and environment. Our hybrid technology allows you to participate fully regardless of your location, building a supportive community of wellness practitioners.'
WHERE slug = 'fact-wellness-hybrid-classes';

UPDATE tours SET 
  price_from = 185.00,
  overview = 'Deepen your wellness practice with monthly intensive workshops led by Chad and expert guest facilitators. Each month explores a different wellness topic in depth - from advanced breathwork and meditation techniques to plant-based nutrition and herbal medicine preparation. These hands-on workshops provide practical skills, take-home resources, and ongoing community support. Perfect for wellness enthusiasts who want to expand their knowledge and connect with like-minded practitioners.'
WHERE slug = 'monthly-wellness-workshop-series';

UPDATE tours SET 
  price_from = 495.00,
  overview = 'Experience Cape Town''s dramatic winter beauty with guided adventures through Cape Point Nature Reserve, followed by rejuvenating sessions at natural hot springs. Chad combines his expertise as a licensed tour guide with wellness practices, including post-hike yoga stretches and meditation. This full-day experience includes transportation, meals, and access to therapeutic hot springs - perfect for staying active during winter while enjoying warming recovery and spectacular scenery with fewer crowds.'
WHERE slug = 'cape-point-winter-hot-springs';