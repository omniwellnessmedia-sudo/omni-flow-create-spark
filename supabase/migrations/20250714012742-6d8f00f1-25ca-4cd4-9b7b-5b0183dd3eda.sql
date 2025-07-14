-- Insert tour categories
INSERT INTO public.tour_categories (id, name, slug, description, image_url, active, display_order) VALUES 
(gen_random_uuid(), 'Indigenous Wisdom', 'indigenous-wisdom', 'Connect with ancient healing traditions and indigenous knowledge systems', '/lovable-uploads/sacred-cave.jpg', true, 1),
(gen_random_uuid(), 'Wellness Retreats', 'wellness-retreats', 'Transformative wellness journeys combining modern and traditional healing', '/lovable-uploads/yoga-studio.jpg', true, 2),
(gen_random_uuid(), 'Conscious Living', 'conscious-living', 'Immersive experiences in sustainable and mindful living practices', '/lovable-uploads/wellness-humans.png', true, 3),
(gen_random_uuid(), 'Study Abroad', 'study-abroad', 'Educational service-learning programs in Cape Town', '/lovable-uploads/table-mountain-hike.jpg', true, 4);

-- Get category IDs for tours
WITH category_ids AS (
  SELECT id as indigenous_id FROM tour_categories WHERE slug = 'indigenous-wisdom'
), wellness_ids AS (
  SELECT id as wellness_id FROM tour_categories WHERE slug = 'wellness-retreats'  
), study_ids AS (
  SELECT id as study_id FROM tour_categories WHERE slug = 'study-abroad'
)

-- Insert FACT Wellness tours
INSERT INTO public.tours (
  id, category_id, title, subtitle, slug, duration, destination, price_from, max_participants,
  overview, hero_image_url, image_gallery, highlights, inclusions, exclusions, 
  difficulty_level, featured, active
) 
SELECT 
  gen_random_uuid(),
  (SELECT indigenous_id FROM category_ids),
  'Conscious Connections: Indigenous Wisdom & Healing',
  'A transformative 10-day journey blending ancient wisdom with modern wellness',
  'conscious-connections-indigenous-wisdom-healing',
  '10 days / 9 nights',
  'South Africa (Western Cape & KwaZulu-Natal)',
  6500,
  16,
  'The Indigenous Wellness and Healing Retreat is a transformative journey that blends ancient wisdom with modern wellness practices. This 10-day immersive experience offers participants a unique opportunity to explore traditional healing modalities, engage in mindfulness practices, and connect deeply with nature and indigenous cultures.',
  '/lovable-uploads/traditional-healing.jpg',
  ARRAY['/lovable-uploads/sacred-cave.jpg', '/lovable-uploads/qigong-meditation.jpg', '/lovable-uploads/wellness-humans.png'],
  ARRAY[
    'Integration of multiple indigenous healing traditions',
    'Personalized wellness consultations with traditional healers',
    'Custom-blended herbal remedies to take home',
    'Immersion in diverse healing landscapes',
    'Balance of active and contemplative practices',
    'Limited group size for personalized attention'
  ],
  ARRAY[
    '9 nights luxury eco-accommodation',
    'All meals (organic, locally-sourced, with dietary options)',
    'Ground transportation in comfortable vehicles',
    'Experienced facilitators and indigenous healers',
    'All workshops, ceremonies, and wellness activities',
    'Personal wellness journal and herbal remedy kit',
    'Carbon offsetting for all program activities'
  ],
  ARRAY[
    'International and domestic flights',
    'Visa fees (if applicable)',
    'Travel insurance (mandatory)',
    'Personal expenses and gratuities',
    'Optional activities not listed in itinerary'
  ],
  'moderate',
  true,
  true

UNION ALL

SELECT 
  gen_random_uuid(),
  (SELECT wellness_id FROM wellness_ids),
  'FACT Wellness Hybrid Classes',
  'Innovative yoga, QiGong, Pilates, and meditation experiences',
  'fact-wellness-hybrid-classes',
  'Ongoing weekly classes',
  'Muizenberg, Cape Town',
  75,
  20,
  'Welcome to FACT WELLNESS! We offer a new and innovative way to practice yoga, QiGong, Pilates, breath work, meditation, mantra chanting and MORE. Our hybrid classes combine in-person instruction with online pre-recorded content, giving you the flexibility to choose how you want to participate.',
  '/lovable-uploads/yoga-studio.jpg',
  ARRAY['/lovable-uploads/qigong-meditation.jpg', '/lovable-uploads/wellness-humans.png'],
  ARRAY[
    'Experienced instructors from international yoga community',
    'Hybrid format - attend in-person or online',
    'Projected instruction on whiteboard for immersive experience',
    'Variety of teaching styles and techniques from around the world',
    'Welcoming and inclusive studio environment',
    'Multiple class options throughout the week'
  ],
  ARRAY[
    'Access to hybrid class technology',
    'Professional instruction',
    'Studio space at 150 Main Road, Muizenberg',
    'Class materials and equipment',
    'Community support and guidance'
  ],
  ARRAY[
    'Personal yoga equipment (mats, blocks, etc.)',
    'Transportation to studio',
    'Food and beverages',
    'Private sessions (available separately)'
  ],
  'beginner',
  true,
  true

UNION ALL

SELECT 
  gen_random_uuid(),
  (SELECT study_id FROM study_ids),
  'Cape Town Service Learning Program',
  'Empowering Communities, Enriching Lives: 6-week study abroad journey',
  'cape-town-service-learning-program',
  '6 weeks',
  'Cape Town, South Africa',
  4500,
  20,
  'Join us for a transformative 6-week study abroad program in Cape Town, South Africa, where you will embark on a service-based learning journey that combines cultural immersion, community engagement, and personal growth. Our program provides a unique blend of academic rigor, meaningful service projects, and impactful activities.',
  '/lovable-uploads/table-mountain-hike.jpg',
  ARRAY['/lovable-uploads/surfing-lesson.jpg', '/lovable-uploads/wellness-humans.png'],
  ARRAY[
    'Cultural immersion and language training',
    'Community-based service projects',
    'Environmental conservation work',
    'Education and youth development initiatives',
    'Health and wellness programs',
    'Wildlife and conservation tours',
    'Academic credit opportunities'
  ],
  ARRAY[
    'Accommodation at Greyton Eco Lodge and Zeekoegat Farm',
    'All meals during program',
    'Transportation for program activities',
    'Tour experiences and cultural activities',
    'Service-based learning projects',
    'Program administration and support',
    'Reflective workshops and sessions'
  ],
  ARRAY[
    'International airfare',
    'Travel insurance',
    'Personal expenses',
    'Additional tours or activities',
    'Visa fees if applicable'
  ],
  'moderate',
  true,
  true;