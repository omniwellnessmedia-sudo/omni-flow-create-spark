-- Add winter-focused tours for immediate revenue generation
-- First, let's add a few winter tour categories if they don't exist
INSERT INTO tour_categories (name, slug, description, active, display_order)
VALUES 
    ('Winter Wellness', 'winter-wellness', 'Embrace Cape Town''s beautiful winter season with warming wellness experiences', true, 4),
    ('Weekend Retreats', 'weekend-retreats', 'Perfect short getaways for busy schedules', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Winter Fireplace Yoga & Meditation Retreats (Perfect for July!)
WITH category_data AS (
    SELECT id FROM tour_categories WHERE slug = 'winter-wellness'
)
INSERT INTO tours (
    title, subtitle, overview, duration, max_participants, price_from, destination, 
    hero_image_url, image_gallery, highlights, inclusions, exclusions, 
    difficulty_level, category_id, slug, active, featured
)
SELECT 
    'Winter Warmth: Fireplace Yoga & Meditation',
    'Cozy indoor wellness sessions by crackling fires in Cape Town''s most beautiful venues',
    'Escape the winter chill with our warming yoga and meditation sessions held in carefully selected venues with beautiful fireplaces. Chad leads intimate sessions combining gentle yoga flows, breathwork, and meditation while you stay perfectly warm and cozy. Perfect for Cape Town''s winter months, these sessions focus on internal heat generation, warming pranayama, and restorative practices.',
    '3 hours per session, multiple sessions weekly',
    12,
    450.00,
    'Cape Town & Western Cape, South Africa',
    '/lovable-uploads/b69f9a35-02ab-45fd-868d-4a8df59e9ef1.png',
    ARRAY[
        '/lovable-uploads/e6789c18-637e-45cc-8fe4-eda77834167c.png',
        '/lovable-uploads/b69f9a35-02ab-45fd-868d-4a8df59e9ef1.png',
        '/lovable-uploads/9c5aba11-91e9-42a2-a75d-1e9d53a54ef1.png'
    ],
    ARRAY[
        'Expert instruction by licensed yoga instructor Chad',
        'Beautiful venues with working fireplaces',
        'Warming yoga sequences designed for winter',
        'Hot herbal tea and healthy winter snacks included',
        'Small groups for personalized attention (max 12)',
        'All yoga props and blankets provided',
        'Perfect for beginners and experienced practitioners'
    ],
    ARRAY[
        'Professional yoga instruction in fireplace venues',
        'All yoga equipment (mats, bolsters, blankets)',
        'Warming herbal teas and healthy snacks',
        'Guided meditation and breathwork',
        'Take-home winter wellness tips',
        'Cozy atmosphere with soft lighting and music'
    ],
    ARRAY[
        'Transportation to venues',
        'Personal yoga equipment (available for purchase)',
        'Meals beyond provided snacks'
    ],
    'beginner',
    (SELECT id FROM category_data),
    'winter-fireplace-yoga-meditation',
    true,
    true;

-- Weekend Wine Country Wellness Escape (Perfect for winter!)
WITH category_data AS (
    SELECT id FROM tour_categories WHERE slug = 'weekend-retreats'
)
INSERT INTO tours (
    title, subtitle, overview, duration, max_participants, price_from, destination, 
    hero_image_url, image_gallery, highlights, inclusions, exclusions, 
    difficulty_level, category_id, slug, active, featured
)
SELECT 
    'Winter Wine Country Wellness Weekend',
    'Luxury weekend retreat in Stellenbosch with spa treatments, yoga, and wine tastings',
    'Indulge in the perfect winter weekend getaway in the heart of Stellenbosch wine country. Stay in luxury accommodations while enjoying daily yoga sessions led by Chad, spa treatments, wine tastings, farm-to-table dining, and cozy evening activities by the fire. This retreat combines wellness with the best of Cape Town''s world-renowned wine region.',
    '2 days / 1 night',
    8,
    2850.00,
    'Stellenbosch Wine Country, Western Cape',
    '/lovable-uploads/640bba04-9344-4dab-8fe2-ca1fc4006c80.png',
    ARRAY[
        '/lovable-uploads/e6789c18-637e-45cc-8fe4-eda77834167c.png',
        '/lovable-uploads/640bba04-9344-4dab-8fe2-ca1fc4006c80.png',
        '/lovable-uploads/dd4158b7-7645-4ed7-b907-9c2a96575522.png'
    ],
    ARRAY[
        'Luxury wine estate accommodation',
        'Daily yoga sessions with Chad in vineyard settings',
        'Private wine tastings with sommelier',
        'Spa treatments using local botanical ingredients',
        'Farm-to-table gourmet meals',
        'Small intimate group experience (max 8 guests)',
        'Professional photography of your experience included'
    ],
    ARRAY[
        '1 night luxury wine estate accommodation',
        'All meals (breakfast, lunch, dinner) with wine pairings',
        'Daily yoga and meditation sessions',
        '60-minute spa treatment per person',
        'Private wine tasting and cellar tour',
        'Transportation from Cape Town',
        'Welcome gift bag with local products',
        'Professional photographer for group sessions'
    ],
    ARRAY[
        'Additional spa treatments',
        'Extra wine purchases',
        'Personal expenses',
        'Travel insurance'
    ],
    'beginner',
    (SELECT id FROM category_data),
    'winter-wine-country-wellness',
    true,
    true;

-- Cape Point Winter Hiking & Hot Springs
WITH category_data AS (
    SELECT id FROM tour_categories WHERE slug = 'winter-wellness'
)
INSERT INTO tours (
    title, subtitle, overview, duration, max_participants, price_from, destination, 
    hero_image_url, image_gallery, highlights, inclusions, exclusions, 
    difficulty_level, category_id, slug, active, featured
)
SELECT 
    'Cape Point Winter Adventure & Natural Hot Springs',
    'Invigorating winter hikes followed by relaxing hot spring therapy',
    'Experience Cape Town''s dramatic winter beauty with guided hikes through Cape Point Nature Reserve, followed by rejuvenating sessions at natural hot springs. Chad combines his expertise as a licensed tour guide with wellness practices, including post-hike yoga stretches and meditation. Perfect for those who want to stay active during winter while enjoying warming recovery experiences.',
    '6 hours (full day)',
    10,
    950.00,
    'Cape Point & Surrounds, Western Cape',
    '/lovable-uploads/dd4158b7-7645-4ed7-b907-9c2a96575522.png',
    ARRAY[
        '/lovable-uploads/dd4158b7-7645-4ed7-b907-9c2a96575522.png',
        '/lovable-uploads/8147b3e9-6b38-4827-a312-432b0e2ed031.png',
        '/lovable-uploads/a045fef8-5243-4990-a695-c17fe80d419f.png'
    ],
    ARRAY[
        'Licensed tour guide Chad with local expertise',
        'Spectacular winter scenery with fewer crowds',
        'Natural hot springs for post-hike recovery',
        'Yoga and stretching sessions included',
        'Warming lunch with ocean views',
        'Small groups for safety and personalization',
        'All hiking equipment provided if needed'
    ],
    ARRAY[
        'Professional tour guide and yoga instructor',
        'Transportation to and from Cape Town',
        'Entry fees to Cape Point Nature Reserve',
        'Hot springs access and facilities',
        'Warming lunch with hot beverages',
        'Post-hike yoga and meditation session',
        'First aid and safety equipment',
        'Hiking poles if needed'
    ],
    ARRAY[
        'Personal hiking gear (clothing, boots)',
        'Additional food and beverages',
        'Spa treatments at hot springs',
        'Gratuities'
    ],
    'moderate',
    (SELECT id FROM category_data),
    'cape-point-winter-hot-springs',
    true,
    false;

-- Monthly Wellness Workshops Series (Ongoing revenue)
WITH category_data AS (
    SELECT id FROM tour_categories WHERE slug = 'wellness-retreats'
)
INSERT INTO tours (
    title, subtitle, overview, duration, max_participants, price_from, destination, 
    hero_image_url, image_gallery, highlights, inclusions, exclusions, 
    difficulty_level, category_id, slug, active, featured
)
SELECT 
    'Monthly Wellness Workshop Series',
    'Deep-dive monthly workshops on specific wellness topics with expert facilitators',
    'Join our monthly deep-dive wellness workshops where Chad and guest experts explore specific wellness topics in depth. Each month focuses on a different theme - from breathwork and meditation techniques to nutrition and plant medicine (legal herbs and teas). These 4-hour intensive workshops provide hands-on learning, take-home resources, and ongoing community support.',
    '4 hours monthly',
    16,
    350.00,
    'Various locations in Cape Town',
    '/lovable-uploads/a52350ad-ae19-4d77-b79d-4cdd18b94367.png',
    ARRAY[
        '/lovable-uploads/cf5cd20e-6ef2-4728-902c-4ced28da0fb1.png',
        '/lovable-uploads/a52350ad-ae19-4d77-b79d-4cdd18b94367.png',
        '/lovable-uploads/9c5aba11-91e9-42a2-a75d-1e9d53a54ef1.png'
    ],
    ARRAY[
        'Expert facilitators including Chad and guest teachers',
        'Different topic each month for ongoing learning',
        'Hands-on practical sessions with take-home resources',
        'Small group setting for personalized attention',
        'Monthly community building and support',
        'Digital resources and follow-up materials',
        'Option to attend single workshops or subscribe for series'
    ],
    ARRAY[
        'Expert facilitation and instruction',
        'All workshop materials and handouts',
        'Healthy snacks and herbal teas',
        'Take-home resource package',
        'Access to private community group',
        'Follow-up digital resources',
        'Certificate of completion for series attendance'
    ],
    ARRAY[
        'Personal notebooks or journals',
        'Transportation to venues',
        'Additional books or products mentioned in workshops'
    ],
    'beginner',
    (SELECT id FROM category_data),
    'monthly-wellness-workshop-series',
    true,
    false;