-- Update existing tours to focus on Cape Town and Western Cape destinations
UPDATE tours 
SET destination = 'Cape Town & Western Cape, South Africa',
    overview = CASE 
        WHEN slug = 'conscious-connections-indigenous-wisdom-healing' THEN 
            'Experience a transformative journey into South African indigenous wisdom through Khoisan healing traditions, local plant medicine, and modern wellness practices. This retreat takes you through the diverse landscapes of the Western Cape, from the ancient Cederberg Mountains to pristine coastal environments, connecting you with the rich heritage of South Africa''s first people while honoring sustainable and respectful cultural exchange.'
        WHEN slug = 'fact-wellness-hybrid-classes' THEN 
            'Join Chad and our expert instructors at our innovative wellness studio in Muizenberg for dynamic, hybrid classes that blend in-person and digital experiences. Whether you''re on the beach, in the mountains, or at home, access world-class instruction in yoga, QiGong, Pilates, breathwork, and meditation designed specifically for the unique energy and environment of Cape Town.'
        WHEN slug = 'cape-town-service-learning-program' THEN 
            'Immerse yourself in Cape Town''s vibrant communities through meaningful service projects that address real social and environmental challenges. Work alongside local organizations in townships, coastal conservation areas, and urban farming initiatives while experiencing the incredible diversity of the Mother City and surrounding Western Cape regions.'
        ELSE overview
    END,
    highlights = CASE 
        WHEN slug = 'conscious-connections-indigenous-wisdom-healing' THEN 
            ARRAY[
                'Learn from authentic Khoisan knowledge keepers and traditional healers',
                'Harvest and prepare traditional fynbos medicines in their natural habitat',
                'Experience ancient rock art sites and sacred caves in the Cederberg',
                'Ocean therapy and coastal healing practices at pristine Western Cape beaches',
                'Small group experience (max 16 participants) for personalized attention',
                'Integration workshops combining ancient wisdom with modern wellness science',
                'Take home custom-blended herbal remedies and wellness practices'
            ]
        WHEN slug = 'fact-wellness-hybrid-classes' THEN 
            ARRAY[
                'Led by Chad (licensed yoga instructor and tour guide) and international experts',
                'Unique hybrid technology allows in-person or online participation',
                'Classes designed for Cape Town''s diverse community and climate',
                'Stunning Muizenberg beach location with mountain and ocean views',
                'Multiple weekly sessions accommodating all skill levels',
                'Integration of local South African wellness traditions',
                'Community-focused approach building lasting connections'
            ]
        WHEN slug = 'cape-town-service-learning-program' THEN 
            ARRAY[
                'Work directly with established community organizations and NGOs',
                'Projects focus on education, environmental conservation, and youth development',
                'Cultural immersion including language learning and traditional experiences',
                'Sustainable tourism practices supporting local communities',
                'Academic credit opportunities through partner institutions',
                'Personal growth through meaningful cross-cultural exchange',
                'Explore Cape Town''s diverse neighborhoods and natural wonders'
            ]
        ELSE highlights
    END
WHERE slug IN ('conscious-connections-indigenous-wisdom-healing', 'fact-wellness-hybrid-classes', 'cape-town-service-learning-program');

-- Delete existing itineraries to replace with Cape Town/Western Cape focused ones
DELETE FROM tour_itineraries WHERE tour_id IN (
    SELECT id FROM tours WHERE slug IN ('conscious-connections-indigenous-wisdom-healing', 'fact-wellness-hybrid-classes', 'cape-town-service-learning-program')
);

-- Indigenous Wisdom & Healing Retreat - Western Cape focused itinerary
WITH tour_data AS (
    SELECT id FROM tours WHERE slug = 'conscious-connections-indigenous-wisdom-healing'
)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, location, activities, meals_included, accommodation)
SELECT 
    (SELECT id FROM tour_data),
    1,
    'Arrival in Cape Town',
    'Welcome to the Mother City! Airport transfer to our eco-lodge in the Cederberg Mountains (2.5 hour scenic drive). Welcome ceremony with local Khoisan elder, introduction to the healing journey ahead, gentle sunset yoga with mountain views.',
    'Cape Town to Cederberg Mountains',
    ARRAY['Airport transfer with scenic route', 'Welcome ceremony and blessing', 'Sunset yoga and meditation', 'Traditional fire ceremony'],
    ARRAY['Dinner'],
    'Luxury Eco-Lodge, Cederberg'

UNION ALL SELECT (SELECT id FROM tour_data), 2, 'Khoisan Healing Traditions - Day 1',
'Dawn meditation in the ancient mountains. Learn about Khoisan cosmology and healing philosophy. Guided fynbos walk to identify and harvest traditional medicinal plants. Hands-on workshop preparing traditional teas and remedies.',
'Cederberg Mountains',
ARRAY['Dawn meditation', 'Khoisan cosmology teaching', 'Medicinal plant walk and harvesting', 'Traditional remedy preparation', 'Sound healing with indigenous instruments'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Eco-Lodge, Cederberg'

UNION ALL SELECT (SELECT id FROM tour_data), 3, 'Sacred Sites and Rock Art',
'Visit ancient Khoisan rock art sites (UNESCO World Heritage). Learn about the spiritual significance of these sacred places. Meditation and contemplation in ancient caves. Evening storytelling around the fire with traditional music.',
'Cederberg Rock Art Sites',
ARRAY['Sacred site visits', 'Rock art interpretation', 'Cave meditation', 'Cultural storytelling', 'Traditional music and dance'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Eco-Lodge, Cederberg'

UNION ALL SELECT (SELECT id FROM tour_data), 4, 'Coastal Healing Journey',
'Transfer to Hermanus via scenic route. Introduction to marine-based healing practices. Whale watching (seasonal) and ocean meditation. Thalassotherapy and seaweed treatments using local marine resources.',
'Hermanus Coast',
ARRAY['Scenic coastal drive', 'Whale watching (seasonal)', 'Ocean meditation', 'Marine therapy treatments', 'Beach walking meditation'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Boutique Coastal Lodge, Hermanus'

UNION ALL SELECT (SELECT id FROM tour_data), 5, 'Ocean Wellness and Conservation',
'Dawn beach yoga and breathwork. Learn about marine conservation from local experts. Optional kelp forest snorkeling. Integration workshop connecting ocean health with personal wellness.',
'Hermanus Coast',
ARRAY['Beach yoga and breathwork', 'Marine conservation education', 'Kelp forest snorkeling (optional)', 'Ocean wellness integration', 'Coastal conservation project'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Boutique Coastal Lodge, Hermanus'

UNION ALL SELECT (SELECT id FROM tour_data), 6, 'Wine Country Wellness',
'Transfer to Stellenbosch Winelands. Fynbos aromatherapy workshop using indigenous plants. Organic wine tasting focusing on mindful consumption. Spa treatments incorporating local botanical ingredients.',
'Stellenbosch Winelands',
ARRAY['Fynbos aromatherapy workshop', 'Organic wine tasting', 'Botanical spa treatments', 'Vineyard meditation walk', 'Farm-to-table cooking class'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Wine Estate, Stellenbosch'

UNION ALL SELECT (SELECT id FROM tour_data), 7, 'Traditional Healing Integration',
'Workshop with local traditional healer (Sangoma) - respectful cultural exchange. Learn about medicinal plants native to the Western Cape. Create your personal healing blend to take home.',
'Stellenbosch Winelands',
ARRAY['Traditional healer consultation', 'Medicinal plant education', 'Personal remedy creation', 'Healing circle ceremony', 'Integration journaling'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Wine Estate, Stellenbosch'

UNION ALL SELECT (SELECT id FROM tour_data), 8, 'Cape Peninsula Adventure',
'Transfer to Cape Town. Cape Peninsula tour including Cape Point and Boulders Beach penguins. Table Mountain cable car (weather permitting). Introduction to urban indigenous plant use.',
'Cape Peninsula',
ARRAY['Cape Point and Good Hope', 'Penguin colony visit', 'Table Mountain ascent', 'Urban indigenous plants tour', 'City wellness practices'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Boutique Hotel, Cape Town'

UNION ALL SELECT (SELECT id FROM tour_data), 9, 'Community Connection and Markets',
'Visit local markets and meet traditional healers in Cape Town communities. Participate in community wellness project. Learn about modern applications of traditional healing in urban settings.',
'Cape Town',
ARRAY['Traditional markets visit', 'Community healers meeting', 'Wellness project participation', 'Urban healing practices', 'Cultural exchange sessions'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Boutique Hotel, Cape Town'

UNION ALL SELECT (SELECT id FROM tour_data), 10, 'Integration and Departure',
'Final integration circle sharing experiences and insights. Create personal wellness plan incorporating learned practices. Closing ceremony and blessing. Airport transfer with sacred plant goodbye gift.',
'Cape Town',
ARRAY['Integration circle', 'Personal wellness planning', 'Closing ceremony', 'Sacred plant gift ceremony', 'Airport transfer'],
ARRAY['Breakfast'], 'Day of departure';

-- FACT Wellness Classes - Ongoing program itinerary
WITH tour_data AS (
    SELECT id FROM tours WHERE slug = 'fact-wellness-hybrid-classes'
)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, location, activities, meals_included, accommodation)
SELECT 
    (SELECT id FROM tour_data),
    1,
    'Monday: Energizing Flow',
    'Start your week with dynamic yoga flow designed to build strength and energy. Chad combines traditional Hatha with modern movement science, perfect for Cape Town''s active lifestyle.',
    'FACT Wellness Studio, 150 Main Road, Muizenberg',
    ARRAY['Dynamic yoga flow', 'Strength building poses', 'Breathwork techniques', 'Goal setting meditation'],
    ARRAY[]::text[],
    'N/A - Class based'

UNION ALL SELECT (SELECT id FROM tour_data), 2, 'Tuesday: Mindful Movement',
'Gentle QiGong and mindful movement practices perfect for recovery and centering. Focus on breath awareness and body alignment with ocean views.',
'FACT Wellness Studio, 150 Main Road, Muizenberg',
ARRAY['QiGong flowing sequences', 'Mindful walking meditation', 'Breath awareness practice', 'Body alignment work'],
ARRAY[]::text[], 'N/A - Class based'

UNION ALL SELECT (SELECT id FROM tour_data), 3, 'Wednesday: Core Power',
'Pilates-inspired core strengthening class combining traditional exercises with modern functional movement. Build stability for surfing, hiking, and daily life.',
'FACT Wellness Studio, 150 Main Road, Muizenberg',
ARRAY['Pilates core work', 'Functional movement patterns', 'Stability training', 'Injury prevention techniques'],
ARRAY[]::text[], 'N/A - Class based'

UNION ALL SELECT (SELECT id FROM tour_data), 4, 'Thursday: Breathwork Journey',
'Transformative breathwork session incorporating various techniques from around the world. Experience the power of conscious breathing for healing and transformation.',
'FACT Wellness Studio, 150 Main Road, Muizenberg',
ARRAY['Conscious breathing techniques', 'Pranayama practices', 'Breath-based meditation', 'Stress release methods'],
ARRAY[]::text[], 'N/A - Class based'

UNION ALL SELECT (SELECT id FROM tour_data), 5, 'Friday: Community Flow',
'End the week with our signature community class combining yoga, movement, and meditation. Open to all levels with modifications and variations offered.',
'FACT Wellness Studio, 150 Main Road, Muizenberg',
ARRAY['Community yoga flow', 'Partner poses', 'Group meditation', 'Intention sharing circle'],
ARRAY[]::text[], 'N/A - Class based'

UNION ALL SELECT (SELECT id FROM tour_data), 6, 'Saturday: Beach Yoga',
'Take practice to the beautiful Muizenberg beach. Weather-dependent outdoor session combining yoga with the healing energy of ocean and sand.',
'Muizenberg Beach (weather permitting)',
ARRAY['Beach yoga flow', 'Ocean meditation', 'Sand-based exercises', 'Sunrise/sunset sessions'],
ARRAY[]::text[], 'N/A - Class based'

UNION ALL SELECT (SELECT id FROM tour_data), 7, 'Sunday: Restorative & Reflection',
'Gentle restorative practice perfect for rest and renewal. Meditation, gentle stretching, and reflection to prepare for the week ahead.',
'FACT Wellness Studio, 150 Main Road, Muizenberg',
ARRAY['Restorative yoga poses', 'Guided meditation', 'Gentle stretching', 'Weekly intention setting'],
ARRAY[]::text[], 'N/A - Class based';

-- Cape Town Service Learning Program itinerary
WITH tour_data AS (
    SELECT id FROM tours WHERE slug = 'cape-town-service-learning-program'
)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, location, activities, meals_included, accommodation)
SELECT 
    (SELECT id FROM tour_data),
    1,
    'Week 1: Arrival and Orientation',
    'Welcome to Cape Town! Settle into accommodation, meet your cohort, and begin cultural orientation. Visit key historical sites including Robben Island and District Six Museum to understand South Africa''s complex history.',
    'Cape Town City and surrounding areas',
    ARRAY['Airport transfer and check-in', 'Group orientation sessions', 'Historical site visits', 'Cultural sensitivity workshops', 'Safety briefings', 'Welcome dinner with local families'],
    ARRAY['All meals included during program week'],
    'Greyton Eco Lodge and partner accommodations'

UNION ALL SELECT (SELECT id FROM tour_data), 2, 'Week 2: Community Immersion',
'Begin work placements with local NGOs and community organizations in townships and urban areas. Focus on education support, youth development, and community wellness initiatives.',
'Various Cape Town communities and townships',
ARRAY['NGO project assignments', 'Community school support', 'Youth mentorship programs', 'Basic conversational language classes', 'Cultural exchange dinners'],
ARRAY['All meals included during program week'], 'Greyton Eco Lodge and partner accommodations'

UNION ALL SELECT (SELECT id FROM tour_data), 3, 'Week 3: Environmental Conservation',
'Shift focus to environmental projects including coastal conservation, urban farming, and indigenous plant restoration. Work with organizations protecting Cape Town''s unique biodiversity.',
'Cape Peninsula, Kirstenbosch, coastal areas',
ARRAY['Coastal cleanup and monitoring', 'Urban farming projects', 'Indigenous plant restoration', 'Penguin colony conservation work', 'Environmental education programs'],
ARRAY['All meals included during program week'], 'Zeekoegat Farm and eco-accommodations'

UNION ALL SELECT (SELECT id FROM tour_data), 4, 'Week 4: Skills Development',
'Focus on building practical skills through workshops and continued service work. Learn about sustainable development, project management, and cross-cultural communication.',
'Cape Town and surrounding Western Cape',
ARRAY['Skills development workshops', 'Project management training', 'Continued service placements', 'Cross-cultural communication', 'Leadership development activities'],
ARRAY['All meals included during program week'], 'Mixed accommodations based on projects'

UNION ALL SELECT (SELECT id FROM tour_data), 5, 'Week 5: Project Implementation',
'Take leadership roles in ongoing projects. Plan and implement a small-scale community initiative with support from local partners and program staff.',
'Community-based locations across Cape Town',
ARRAY['Project planning and implementation', 'Community leadership roles', 'Impact assessment activities', 'Cultural celebration participation', 'Reflection and documentation'],
ARRAY['All meals included during program week'], 'Community-based accommodations'

UNION ALL SELECT (SELECT id FROM tour_data), 6, 'Week 6: Integration and Departure',
'Complete projects, participate in closing ceremonies with community partners, and integrate learning experiences. Cultural celebration and farewell events before departure.',
'Cape Town',
ARRAY['Project completion and handover', 'Community closing ceremonies', 'Impact presentation preparation', 'Cultural celebration events', 'Airport transfers and departure'],
ARRAY['All meals included until departure'], 'Final nights at Greyton Eco Lodge';