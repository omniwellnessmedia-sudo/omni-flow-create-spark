-- ============================================
-- COMPREHENSIVE TOURS & SERVICES UPDATE
-- Adding all Travel and Tours Cape Town experiences
-- ============================================

-- First, let's ensure we have the right tour categories
INSERT INTO public.tour_categories (name, slug, description, image_url, display_order, active) VALUES
('Indigenous Cultural Tours', 'indigenous-cultural', 'Immersive journeys into sacred landscapes, traditional ceremonies, and ancient wisdom with Indigenous guides', '/lovable-uploads/indigenous-wisdom-category.jpg', 1, true),
('Adventure & Hiking', 'adventure-hiking', 'Conquer Cape Town''s iconic peaks and coastal trails with expert guides', '/lovable-uploads/table-mountain-hiking.jpg', 2, true),
('Surf & Ocean', 'surf-ocean', 'Learn to surf with world champions and connect with ocean heritage', '/lovable-uploads/surfing-lesson.jpg', 3, true),
('Study Abroad Programs', 'study-abroad', 'Transformative semester and short-course programs combining academics with cultural immersion', '/lovable-uploads/study-abroad-category.jpg', 4, true),
('Wellness Retreats', 'wellness-retreats', 'Multi-day healing immersions combining traditional practices with modern wellness', '/lovable-uploads/wellness-retreats-category.jpg', 5, true),
('Media Production', 'media-production', 'Professional videography, photography, and content creation services', '/lovable-uploads/omni-wellness-hero.jpg', 6, true),
('Community Engagement', 'community-engagement', 'Service learning, activism, and cultural exchange programs', '/lovable-uploads/community-connection.jpg', 7, true),
('Special Events', 'special-events', 'Seasonal ceremonies, cultural festivals, and traditional celebrations', '/lovable-uploads/ubuntu-community-gathering.jpg', 8, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order;

-- Get category IDs for tours
DO $$
DECLARE
  cat_indigenous UUID;
  cat_adventure UUID;
  cat_surf UUID;
  cat_study UUID;
  cat_wellness UUID;
  cat_media UUID;
  cat_community UUID;
  cat_events UUID;
BEGIN
  SELECT id INTO cat_indigenous FROM public.tour_categories WHERE slug = 'indigenous-cultural';
  SELECT id INTO cat_adventure FROM public.tour_categories WHERE slug = 'adventure-hiking';
  SELECT id INTO cat_surf FROM public.tour_categories WHERE slug = 'surf-ocean';
  SELECT id INTO cat_study FROM public.tour_categories WHERE slug = 'study-abroad';
  SELECT id INTO cat_wellness FROM public.tour_categories WHERE slug = 'wellness-retreats';
  SELECT id INTO cat_media FROM public.tour_categories WHERE slug = 'media-production';
  SELECT id INTO cat_community FROM public.tour_categories WHERE slug = 'community-engagement';
  SELECT id INTO cat_events FROM public.tour_categories WHERE slug = 'special-events';

-- ============================================
-- INDIGENOUS CULTURAL TOURS
-- ============================================

-- Great Mother Cave Tour
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, image_gallery, highlights, inclusions, exclusions
) VALUES (
  cat_indigenous,
  'Great Mother Cave Tour: Sacred Sites of Peers Cave & Tunnel Cave',
  'great-mother-cave-tour',
  'Journey Through Time in Fish Hoek''s Ancient Sanctuaries',
  'Embark on the Great Mother Cave Tour, our flagship experience that takes you deep into the sacred landscapes of Fish Hoek. This immersive journey, guided by Chief Kingsley of the Gorachouqua tribe, explores the profound spiritual and historical significance of the region''s ancient sites, Peers Cave and Tunnel Cave. As you walk through these historic sanctuaries, you will engage in traditional ceremonies, learn about the Khoisan''s ancient rituals, and connect deeply with the land.',
  'Full Day (6-8 hours)',
  'Fish Hoek, Cape Peninsula',
  12,
  2999,
  'moderate',
  true,
  true,
  '/lovable-uploads/sacred-cave.jpg',
  ARRAY['/lovable-uploads/indigenous-wisdom-category.jpg', '/lovable-uploads/indigenous-healing-ceremony.jpg'],
  ARRAY[
    'Guided tour with Chief Kingsley of the Gorachouqua tribe',
    'Traditional ceremonies and rituals',
    'Ancient rock art viewing',
    'Indigenous plant knowledge',
    'Contribution to ''Buy One, Sponsor One'' initiative with Dr. Phil-afel Foundation'
  ],
  ARRAY[
    'Expert guide (Chief Kingsley)',
    'Traditional herbal tea ceremony',
    'Transportation from Muizenberg',
    'Light refreshments',
    'Cultural donation to community initiatives'
  ],
  ARRAY[
    'Personal meals and drinks',
    'Gratuities',
    'Personal travel insurance'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview,
  price_from = EXCLUDED.price_from,
  highlights = EXCLUDED.highlights,
  inclusions = EXCLUDED.inclusions;

-- Kalk Bay Indigenous Walk
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_indigenous,
  'Kalk Bay Indigenous Walk: Cultural and Natural Odyssey',
  'kalk-bay-indigenous-walk',
  'Explore the Spiritual Landscape of Kalk Bay',
  'Take a step back in time with the Kalk Bay Indigenous Walk, where the vibrant history and serene natural settings of Kalk Bay come alive. Chief Kingsley, a respected elder from the Gorachouqua tribe, will lead you through lush trails and into ancient caves, each step echoing the traditions and stories of the Khoisan people. Visit notable sites like Echo Valley and Boomslang Cave, each storied with Khoisan heritage and offering unique insights into their spiritual practices.',
  'Half Day (3-4 hours)',
  'Kalk Bay, Cape Peninsula',
  15,
  1499,
  'easy',
  true,
  false,
  '/lovable-uploads/traditional-healing.jpg',
  ARRAY[
    'Exploration of Echo Valley and Boomslang Cave',
    'Indigenous plant medicine teachings',
    'Stunning ocean views',
    'Traditional storytelling',
    'Support for local conservation efforts'
  ],
  ARRAY[
    'Expert guide (Chief Kingsley)',
    'Cave explorations',
    'Plant medicine teachings',
    'Traditional stories and wisdom'
  ],
  ARRAY[
    'Personal meals',
    'Transportation to meeting point',
    'Gratuities'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview,
  price_from = EXCLUDED.price_from;

-- Muizenberg Indigenous Walk
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_indigenous,
  'Muizenberg Indigenous Walk: Heart of Indigenous Heritage',
  'muizenberg-indigenous-walk',
  'Uncover the Deep Roots of Muizenberg with Chief Kingsley',
  'Join the Muizenberg Indigenous Walk to explore the historical and cultural depths of Muizenberg, guided by the wisdom of Chief Kingsley from the Gorachouqua tribe. This tour offers more than just a scenic walk along the coast; it is an educational journey into the life of the Khoisan, who have left their mark on the region through rock art and sacred sites like the Bushman Face Cave.',
  'Half Day (3-4 hours)',
  'Muizenberg, Cape Peninsula',
  15,
  1499,
  'easy',
  true,
  false,
  '/lovable-uploads/table-mountain-hike.jpg',
  ARRAY[
    'Visit to Bushman Face Cave',
    'Panoramic views from Muizenberg Peak',
    'Traditional ceremonies',
    'Environmental conservation activities',
    'Participation in ''Buy One, Sponsor One'' initiative'
  ],
  ARRAY[
    'Expert indigenous guide',
    'Sacred site visits',
    'Traditional ceremonies',
    'Herbal tea ceremony',
    'Community contribution'
  ],
  ARRAY[
    'Personal meals',
    'Transportation',
    'Gratuities'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- ============================================
-- ADVENTURE & HIKING TOURS
-- ============================================

-- Cape Summit Adventure
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_adventure,
  'Cape Summit Adventure: Table Mountain & Lion''s Head Expeditions',
  'cape-summit-adventure',
  'Conquer Cape Town''s Iconic Peaks',
  'Experience the majesty of Cape Town''s most famous mountains with our expert guides. This adventure combines physical challenge with cultural and ecological insights, taking you to breathtaking viewpoints while learning about the mountains'' significance to indigenous peoples and their unique biodiversity.',
  'Full Day (6-8 hours)',
  'Table Mountain & Lion''s Head',
  12,
  2499,
  'challenging',
  true,
  true,
  '/lovable-uploads/table-mountain-hiking.jpg',
  ARRAY[
    'Guided hike of Table Mountain via Platteklip Gorge',
    'Lion''s Head sunset experience (weather permitting)',
    'Indigenous plant identification',
    'Traditional mountain blessing ceremony',
    'Gourmet picnic with local ingredients'
  ],
  ARRAY[
    'Expert mountain guide',
    'Table Mountain cable car (if needed)',
    'Gourmet picnic lunch',
    'Traditional blessing ceremony',
    'Safety equipment',
    'First aid kit'
  ],
  ARRAY[
    'Personal snacks and drinks',
    'Hiking boots (can be rented)',
    'Gratuities'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview,
  price_from = EXCLUDED.price_from;

-- ============================================
-- SURF & OCEAN EXPERIENCES
-- ============================================

-- Indigenous Surfing Tour with Cass Collier (Full Day Detailed)
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, image_gallery, highlights, inclusions, exclusions
) VALUES (
  cat_surf,
  'Indigenous Surfing Tour with Cass Collier',
  'indigenous-surfing-cass-collier',
  'World Champion Surfer & Cultural Ambassador',
  'Join world champion surfer Cassiem "Cass" Collier for a full-day cultural and surfing tour along South Africa''s Cape Peninsula. This one-of-a-kind experience blends thrilling surfing lessons with profound cultural immersion, weaving together the story of the land, its people, and the ocean. Raised in Grassy Park on the Cape Flats, Cass is more than a surfing legend: he is a mentor, a cultural ambassador, and a pioneer who broke barriers during apartheid. With over 20 years of coaching experience, Cass uses surfing to empower youth, preserve Indigenous heritage, and share the deep wisdom of the sea. This is more than a surfing lesson—it''s a journey of connection, resilience, and discovery.',
  'Full Day (8 hours, 08:45-17:30)',
  'Cape Peninsula (Muizenberg, Cape Point, Kommetjie, Scarborough, Ocean View, Constantia)',
  8,
  2999,
  'moderate',
  true,
  true,
  '/lovable-uploads/surfing-lesson.jpg',
  ARRAY['/lovable-uploads/surfing-lesson.jpg', '/lovable-uploads/cape-point-adventure-hero.jpg'],
  ARRAY[
    'Surf coaching with world champion Cass Collier',
    'Two surf sessions (Cape Point & Long Beach Kommetjie)',
    'Indigenous storytelling and cultural teachings',
    'Visit Camel Rock sacred cultural landmark',
    'Meet Ocean View Rastafarian community',
    'Traditional Ital meal with Elder Bernard Brown',
    'Transportation along entire route',
    'Board & wetsuit hire included'
  ],
  ARRAY[
    'World champion surf coaching (Cass Collier)',
    'Surfboard and wetsuit rental',
    'Transportation (Muizenberg to Peninsula and back)',
    'Herbal tea, fruits, and nuts',
    'Traditional Ital meal in Constantia',
    'Scenic drives and village explorations',
    'Cultural teachings at multiple communities',
    'Safety briefing and equipment'
  ],
  ARRAY[
    'Lunch in Kommetjie (self-purchase at local cafés)',
    'Personal snacks and drinks',
    'Gratuities',
    'Travel insurance'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview,
  price_from = EXCLUDED.price_from,
  highlights = EXCLUDED.highlights,
  inclusions = EXCLUDED.inclusions;

-- Ultimate Surf & Culture Experience (Shorter Version)
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_surf,
  'Ultimate Surf & Culture Experience with Cass Collier',
  'ultimate-surf-culture-cass',
  'Ride Waves with a Surfing Legend',
  'Join world champion surfer Cass Collier for an unforgettable day combining surfing instruction with cultural immersion. This unique experience connects the freedom of surfing with the rich heritage of Cape Town''s coastal communities, offering both beginners and experienced surfers a deeper connection to the ocean and local culture.',
  'Full Day (6-8 hours)',
  'Muizenberg & Cape Peninsula',
  8,
  2999,
  'moderate',
  true,
  false,
  '/lovable-uploads/surfing-lesson.jpg',
  ARRAY[
    'Surfing lessons with world champion Cass Collier',
    'Equipment provided (wetsuit and surfboard)',
    'Traditional ocean blessing ceremony',
    'Visit to local fishing community',
    'Fresh seafood lunch at a local establishment'
  ],
  ARRAY[
    'Professional surf coaching',
    'Surfboard and wetsuit',
    'Ocean blessing ceremony',
    'Community visits',
    'Seafood lunch',
    'Transportation'
  ],
  ARRAY[
    'Additional snacks',
    'Gratuities',
    'Personal items'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- ============================================
-- STUDY ABROAD PROGRAMS
-- ============================================

-- Conscious Connections Semester Program
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_study,
  'Conscious Connections: African Wisdom & Wellness Immersion',
  'conscious-connections-semester',
  'Transformative Learning Through Indigenous Wisdom',
  'Our flagship study abroad program combines academic learning with direct engagement with healers, knowledge keepers, and communities across Southern Africa. Students earn academic credit while developing a deep understanding of indigenous knowledge systems, healing traditions, and their applications to contemporary global challenges.',
  'Semester Program (12 weeks)',
  'Cape Town & Southern Africa',
  25,
  187500,  -- $9,999 USD converted to ZAR at ~R18.75/$1
  'moderate',
  true,
  true,
  '/lovable-uploads/conscious-connections-hero.jpg',
  ARRAY[
    '15 academic credits through partner institutions',
    'Direct learning from traditional healers and knowledge keepers',
    'Rural community homestay experience',
    'Independent research project',
    'Comprehensive pre-departure and re-entry support'
  ],
  ARRAY[
    'All academic credits and coursework',
    'Accommodation (mix of university housing and homestays)',
    'Most meals',
    'Local transportation',
    'Field trips and excursions',
    'Traditional healer sessions',
    'Pre-departure orientation',
    'On-site support staff'
  ],
  ARRAY[
    'International airfare',
    'Visa fees',
    'Personal expenses',
    'Some meals',
    'Travel insurance (required)'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview,
  price_from = EXCLUDED.price_from;

-- Journey into Heart of Africa Short Course
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_study,
  'Journey into the Heart of Africa: Cultural Immersion Short Course',
  'heart-of-africa-short-course',
  'Intensive Cultural Learning Experience',
  'This condensed study abroad program offers a powerful introduction to African wisdom traditions, sustainable development practices, and community engagement. Ideal for students with limited time, this program provides academic credit while fostering meaningful cross-cultural connections.',
  'Short Course (3-4 weeks)',
  'Cape Town & Western Cape',
  20,
  93750,  -- $4,999 USD converted to ZAR
  'moderate',
  true,
  false,
  '/lovable-uploads/service-learning-hero.jpg',
  ARRAY[
    '6 academic credits through partner institutions',
    'Community-based learning experiences',
    'Cultural workshops and skill development',
    'Reflection and integration activities',
    'Service learning component'
  ],
  ARRAY[
    'Academic credits and instruction',
    'Accommodation',
    'Most meals',
    'Local transportation',
    'All workshops and activities',
    'Cultural experiences',
    'Support staff'
  ],
  ARRAY[
    'International airfare',
    'Visa fees',
    'Personal expenses',
    'Some meals',
    'Travel insurance'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- ============================================
-- WELLNESS RETREATS
-- ============================================

-- Indigenous Healing Immersion
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_wellness,
  'Indigenous Healing Immersion: Traditional Wellness Practices',
  'indigenous-healing-immersion',
  'Ancient Wisdom for Modern Wellness',
  'Immerse yourself in the healing traditions of Southern Africa''s indigenous peoples. This retreat combines traditional healing ceremonies, plant medicine workshops, and wellness practices with comfortable accommodations and nutritious meals prepared with local ingredients.',
  '7 Days / 6 Nights',
  'Western Cape Retreat Center',
  12,
  18999,
  'easy',
  true,
  true,
  '/lovable-uploads/traditional-healing-experience.jpg',
  ARRAY[
    'Sessions with traditional healers',
    'Plant medicine workshops',
    'Daily movement and meditation practices',
    'Traditional steam ceremonies',
    'Nutritional guidance based on indigenous wisdom'
  ],
  ARRAY[
    'All accommodation (private or shared rooms)',
    'All meals (locally-sourced, nutritious)',
    'Traditional healer sessions',
    'Plant medicine workshops',
    'Daily wellness practices',
    'Steam ceremony access',
    'Welcome and closing ceremonies',
    'All materials and supplies'
  ],
  ARRAY[
    'Transportation to/from retreat center',
    'Personal items',
    'Gratuities',
    'Travel insurance'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview,
  price_from = EXCLUDED.price_from;

-- Ubuntu Leadership Retreat
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_wellness,
  'Ubuntu Leadership Retreat: Wisdom-Based Organizational Development',
  'ubuntu-leadership-retreat',
  'Transform Leadership Through Indigenous Wisdom',
  'Designed for organizational leaders and teams, this retreat applies Ubuntu philosophy and indigenous wisdom to contemporary leadership challenges. Participants develop a deeper understanding of collective leadership, ethical decision-making, and sustainable organizational practices.',
  '5 Days / 4 Nights',
  'Western Cape Leadership Center',
  16,
  15999,
  'easy',
  true,
  false,
  '/lovable-uploads/ubuntu-community-gathering.jpg',
  ARRAY[
    'Ubuntu philosophy workshops',
    'Indigenous decision-making processes',
    'Team-building through traditional practices',
    'Ethical leadership frameworks',
    'Personalized organizational action planning'
  ],
  ARRAY[
    'All accommodation',
    'All meals',
    'Workshop materials',
    'Ubuntu philosophy sessions',
    'Team-building activities',
    'Action planning support',
    'Post-retreat resources'
  ],
  ARRAY[
    'Transportation to venue',
    'Personal expenses',
    'Additional coaching sessions',
    'Travel insurance'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- ============================================
-- MEDIA PRODUCTION SERVICES
-- ============================================

-- Videography & Photography Package
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_media,
  'Professional Videography & Photography Services',
  'videography-photography-services',
  'High-Quality 4K Video & Photography Production',
  '2-person professional crew with Director/Producer and Cinematographer/DOP. Full equipment package including 2x 4K cameras with lenses and tripods, Ronin Gimbal, professional audio kit, and laptop for onsite data management and editing. Perfect for events, retreats, promotional content, and documentary work.',
  'Half Day (up to 4.5 hrs) or Full Day (5-8 hrs)',
  'On-Location (Cape Town & Peninsula)',
  50,  -- capacity for large events
  4500,  -- Half day rate
  'easy',
  true,
  false,
  '/lovable-uploads/omni-wellness-hero.jpg',
  ARRAY[
    '2-person professional crew',
    '2x 4K cameras with lenses and tripods',
    'Ronin Gimbal for smooth motion',
    'Professional audio kit (wireless mics, recorder)',
    'Laptop for onsite data management',
    'High-quality photography and videography'
  ],
  ARRAY[
    'Director/Producer',
    'Cinematographer/DOP',
    '2x Sony cameras (A7Siii, FX30)',
    'Professional lenses (Sigma, Tamron)',
    'Ronin RS3 Gimbal',
    'Audio equipment (DGI wireless mics, Zoom H4N)',
    '5-in-1 light bounce',
    'ND filters',
    'Data backup and management'
  ],
  ARRAY[
    'Post-production editing (available separately)',
    'Additional crew members',
    'Drone footage (can be added)',
    'Travel beyond 50km from Cape Town'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- Interview Production Package
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_media,
  'Professional Interview Production Services',
  'interview-production-services',
  'Studio-Quality Interview Setup & Recording',
  '2-person professional crew specializing in interviews. Complete lighting setup with SmallRig 450W and 150W bi-colour lights, soft boxes, professional audio with boom mic, and multi-camera 4K recording. Perfect for documentaries, testimonials, and professional content.',
  'Half Day (up to 4.5 hrs) or Full Day (5-8 hrs)',
  'On-Location or Studio',
  20,
  7500,  -- Half day rate
  'easy',
  true,
  false,
  '/lovable-uploads/omni-wellness-hero.jpg',
  ARRAY[
    'Professional lighting setup (450W + 150W)',
    'Multi-camera 4K recording',
    'Professional audio (boom mic + wireless)',
    'Soft boxes with grids for perfect lighting',
    'Onsite editing capabilities'
  ],
  ARRAY[
    'Director/Producer',
    'Cinematographer/DOP',
    '2x 4K cameras',
    'SmallRig 450W Bi-colour light',
    'SmallRig 150W Bi-colour light',
    'Soft boxes with grids',
    '2x light stands',
    'Sand bags',
    'Complete audio kit (boom mic, wireless mics)',
    'Data backup'
  ],
  ARRAY[
    'Post-production editing',
    'Makeup artist',
    'Teleprompter',
    'Additional locations'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- Podcast Production Package
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_media,
  'Professional Podcast Production Services',
  'podcast-production-services',
  'Multi-Camera Podcast Recording & Production',
  '3-person crew with Director/Producer, Cinematographer/DOP, and 2nd AD. 3x 4K camera setup, professional lighting, and Ronin Gimbal for dynamic shots. Perfect for podcast recordings, panel discussions, and ensemble productions.',
  'Half Day (up to 4.5 hrs) or Full Day (5-8 hrs)',
  'Studio or On-Location',
  10,
  7500,  -- Starting rate
  'easy',
  true,
  false,
  '/lovable-uploads/omni-wellness-hero.jpg',
  ARRAY[
    '3-camera professional setup',
    '3-person crew for comprehensive coverage',
    'Professional lighting for broadcast quality',
    'Dynamic gimbal shots',
    'Multi-track audio recording'
  ],
  ARRAY[
    'Director/Producer',
    'Cinematographer/DOP',
    '2nd Assistant Director',
    '3x 4K cameras with lenses',
    'Ronin Gimbal',
    'Professional lighting (450W + 150W)',
    'Complete audio setup',
    'Data management'
  ],
  ARRAY[
    'Post-production editing',
    'Audio mixing and mastering',
    'Graphics and titles',
    'Platform distribution'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- ============================================
-- COMMUNITY ENGAGEMENT PROGRAMS
-- ============================================

-- Wellness in Action - Community Day
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_community,
  'Wellness in Action: Community Day in Hanover Park',
  'wellness-in-action-community-day',
  'Connection, Wellbeing & Cultural Exchange',
  'A day of connection and wellbeing, hosted in Hanover Park with children and families from the community. Engage in smoothie-making workshops, yoga and movement sessions, gardening activities, and playful bonding through soccer and games. This experience provides a safe, joyful, and impactful way for learners to engage in community wellness while highlighting the link between health, sustainability, and social justice.',
  'Full Day (6 hours)',
  'Hanover Park Community Center',
  20,
  899,
  'easy',
  true,
  true,
  '/lovable-uploads/community-connection.jpg',
  ARRAY[
    'Smoothie-making workshop with local children',
    'Yoga & mindful movement exercises',
    'Gardening/planting session teaching food growing',
    'Soccer, games, and creative activities',
    'Cultural exchange and community bonding'
  ],
  ARRAY[
    'All workshop materials',
    'Smoothie ingredients',
    'Yoga mats and equipment',
    'Gardening supplies',
    'Sports equipment',
    'Light refreshments',
    'Community contribution',
    'Facilitators and support staff'
  ],
  ARRAY[
    'Transportation to Hanover Park',
    'Personal meals',
    'Gratuities'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- Beach & Mountain Clean-Ups
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_community,
  'Beach & Mountain Clean-Up with Hanover Park Kids',
  'beach-mountain-cleanup',
  'Environmental Conservation & Youth Empowerment',
  'Hands-on environmental activism combining beach or mountain clean-ups with education. Through our "Buy One Sponsor One" program, your participation sponsors Hanover Park children to join, building cultural exchange while restoring nature. Learn about ocean conservation, plastic waste reduction, and the importance of protecting our natural heritage.',
  'Half Day (3-4 hours)',
  'Cape Peninsula Beaches or Table Mountain',
  30,
  599,
  'easy',
  true,
  false,
  '/lovable-uploads/community-connection.jpg',
  ARRAY[
    'Environmental conservation education',
    'Hands-on clean-up activities',
    'Youth empowerment through "Buy One Sponsor One"',
    'Ocean and mountain ecology lessons',
    'Community building and exchange'
  ],
  ARRAY[
    'All clean-up equipment and supplies',
    'Protective gloves and bags',
    'Educational materials',
    'Sponsorship of Hanover Park children',
    'Snacks and refreshments',
    'Transportation for sponsored children',
    'Facilitators'
  ],
  ARRAY[
    'Transportation to site',
    'Personal meals',
    'Hiking boots (if mountain clean-up)'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- Ethical Activism Experience
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_community,
  'Ethical Activism Experience: Protests & Awareness Campaigns',
  'ethical-activism-experience',
  'Grassroots Movements for Justice',
  'Join peaceful protests and awareness campaigns alongside local activists from Beauty Without Cruelty and Dr. Phil-afel Foundation. Experience ethical activism firsthand and learn about courage, democracy, and non-violent advocacy. Participate in campaigns against animal exploitation, industrial cruelty, and for environmental justice.',
  'Variable (2-4 hours)',
  'Various locations in Cape Town',
  50,
  299,
  'easy',
  true,
  false,
  '/lovable-uploads/community-connection.jpg',
  ARRAY[
    'Peaceful protest participation',
    'Direct engagement with activists',
    'Learning about animal rights and ethics',
    'Non-violent advocacy training',
    'Understanding grassroots movements'
  ],
  ARRAY[
    'Activist guides and organizers',
    'Protest materials (signs, information)',
    'Safety briefing',
    'Community contribution',
    'Documentation and reflection'
  ],
  ARRAY[
    'Transportation to protest site',
    'Personal items',
    'Meals'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- Community Food & Culture Day
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_community,
  'Community Food & Culture Day',
  'community-food-culture-day',
  'Plant-Based Cooking & Cultural Exchange',
  'Shared plant-based cooking session with community members, stories of conscious living, and a communal meal. This experience builds connections through food, one of the most powerful cultural bridges, while learning about sustainable nutrition and traditional food practices.',
  'Half Day (4 hours)',
  'Community Kitchen',
  20,
  699,
  'easy',
  true,
  false,
  '/lovable-uploads/monthly-cooking-workshop.jpg',
  ARRAY[
    'Plant-based cooking workshop',
    'Traditional food preparation techniques',
    'Conscious living discussions',
    'Communal meal experience',
    'Cultural storytelling through food'
  ],
  ARRAY[
    'All cooking ingredients',
    'Kitchen facilities and equipment',
    'Recipe cards to take home',
    'Communal meal',
    'Facilitator and community hosts',
    'Light refreshments'
  ],
  ARRAY[
    'Transportation to venue',
    'Apron (can be provided for fee)',
    'Additional meals'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- ============================================
-- SPECIAL EVENTS
-- ============================================

-- Seasonal Ceremonies
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_events,
  'Seasonal Ceremonies & Celebrations',
  'seasonal-ceremonies',
  'Connect with Natural Cycles',
  'Throughout the year, we offer special ceremonies marking significant seasonal transitions, celestial events, and traditional celebrations. These events provide opportunities to connect with indigenous wisdom, community, and natural cycles. Events include Summer Solstice (December), Harvest Celebration (March), Winter Solstice (June), and Spring Renewal (September).',
  '2-6 hours (varies by event)',
  'Sacred sites across Western Cape',
  30,
  899,
  'easy',
  true,
  false,
  '/lovable-uploads/ubuntu-healing-circle.jpg',
  ARRAY[
    'Traditional seasonal ceremonies',
    'Connection with natural cycles',
    'Indigenous wisdom teachings',
    'Community gathering',
    'Ceremonial refreshments'
  ],
  ARRAY[
    'Ceremony facilitation',
    'Traditional elements',
    'Light refreshments',
    'Educational materials',
    'Community contribution'
  ],
  ARRAY[
    'Transportation to site',
    'Personal items',
    'Additional meals'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- Cultural Festivals & Workshops
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_events,
  'Cultural Festivals & Traditional Workshops',
  'cultural-festivals-workshops',
  'Immersive Cultural Experiences',
  'Participate in significant cultural festivals and specialized workshops focusing on indigenous arts, crafts, music, and knowledge systems. Activities include Traditional Music & Dance Workshops, Indigenous Craft Intensives, Storytelling Festivals, and Culinary Heritage Experiences.',
  'Variable (half day to full day)',
  'Various cultural venues',
  40,
  599,
  'easy',
  true,
  false,
  '/lovable-uploads/ubuntu-community-gathering.jpg',
  ARRAY[
    'Traditional music and dance',
    'Indigenous craft workshops',
    'Storytelling sessions',
    'Culinary heritage experiences',
    'Cultural immersion'
  ],
  ARRAY[
    'Workshop materials',
    'Expert facilitators',
    'Cultural demonstrations',
    'Light refreshments',
    'Take-home crafts or recipes'
  ],
  ARRAY[
    'Transportation',
    'Meals (unless specified)',
    'Personal craft supplies'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

-- Open Mic & Creative Expression
INSERT INTO public.tours (
  category_id, title, slug, subtitle, overview, duration, destination,
  max_participants, price_from, difficulty_level, active, featured,
  hero_image_url, highlights, inclusions, exclusions
) VALUES (
  cat_events,
  'Open Mic & Creative Expression',
  'open-mic-creative-expression',
  'Music, Poetry & Storytelling',
  'Evening gathering of music, poetry, and storytelling. Experience Cape Town''s vibrant creative spirit. Learners can join, perform, or simply soak in the atmosphere. A powerful way to connect through art and expression.',
  'Evening (2-3 hours)',
  'Cultural Venues in Cape Town',
  50,
  299,
  'easy',
  true,
  false,
  '/lovable-uploads/ubuntu-community-gathering.jpg',
  ARRAY[
    'Live music performances',
    'Poetry readings',
    'Storytelling sessions',
    'Open stage for participants',
    'Creative community atmosphere'
  ],
  ARRAY[
    'Venue access',
    'Sound system',
    'Light refreshments',
    'Open mic slot (if desired)',
    'Community hosts'
  ],
  ARRAY[
    'Transportation',
    'Dinner',
    'Alcoholic beverages'
  ]
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  overview = EXCLUDED.overview;

END $$;

-- Create success message
DO $$
BEGIN
  RAISE NOTICE 'Successfully created/updated all tours and services!';
  RAISE NOTICE 'Categories: 8 (Indigenous, Adventure, Surf, Study Abroad, Wellness, Media, Community, Events)';
  RAISE NOTICE 'Tours created: 20+ comprehensive experiences';
END $$;