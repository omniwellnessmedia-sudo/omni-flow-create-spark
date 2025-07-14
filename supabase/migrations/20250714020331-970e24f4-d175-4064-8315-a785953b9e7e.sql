-- Add itineraries for the new winter tours

-- Winter Fireplace Yoga & Meditation itinerary
WITH tour_data AS (
    SELECT id FROM tours WHERE slug = 'winter-fireplace-yoga-meditation'
)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, location, activities, meals_included, accommodation)
SELECT 
    (SELECT id FROM tour_data),
    1,
    'Monday Evening: Gentle Flow by Fire',
    'Begin your week with a gentle yoga flow in a cozy venue with a crackling fireplace. Chad guides you through warming sequences, breathwork to generate internal heat, and meditation to set intentions for the week ahead.',
    'Boutique Studio, City Bowl, Cape Town',
    ARRAY['Warming yoga flow', 'Fire gazing meditation', 'Breathwork for internal heat', 'Intention setting'],
    ARRAY['Herbal tea', 'Healthy winter snacks'],
    'N/A - Evening session'

UNION ALL SELECT (SELECT id FROM tour_data), 2, 'Wednesday Morning: Energizing Fire Flow',
'Mid-week energy boost with dynamic yoga sequences designed to combat winter lethargy. Practice includes sun salutations by the fire, energizing pranayama, and meditation techniques for maintaining vitality during the colder months.',
'Wine Farm Venue, Constantia',
ARRAY['Dynamic morning flow', 'Sun salutations', 'Energizing breathwork', 'Vitality meditation'],
ARRAY['Herbal tea', 'Energy-boosting snacks'], 'N/A - Morning session'

UNION ALL SELECT (SELECT id FROM tour_data), 3, 'Friday Evening: Restorative Fireside',
'End your week with deeply restorative yoga by the fire. Gentle stretches, supported poses with bolsters and blankets, and guided relaxation help you release the week''s tension while staying wonderfully warm.',
'Historic Venue, Gardens, Cape Town',
ARRAY['Restorative yoga poses', 'Guided relaxation', 'Stress release techniques', 'Weekly reflection'],
ARRAY['Calming herbal tea', 'Comfort snacks'], 'N/A - Evening session'

UNION ALL SELECT (SELECT id FROM tour_data), 4, 'Saturday Afternoon: Community Fire Circle',
'Special weekend session combining yoga with community connection. Practice together, share warm drinks by the fire, and participate in a gratitude circle. Perfect for building connections while staying cozy.',
'Community Center, Observatory',
ARRAY['Community yoga flow', 'Gratitude circle', 'Group meditation', 'Social connection time'],
ARRAY['Hot chocolate', 'Community snacks'], 'N/A - Afternoon session';

-- Weekend Wine Country Wellness itinerary
WITH tour_data AS (
    SELECT id FROM tours WHERE slug = 'winter-wine-country-wellness'
)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, location, activities, meals_included, accommodation)
SELECT 
    (SELECT id FROM tour_data),
    1,
    'Saturday: Arrival and Wine Country Immersion',
    'Arrive at our luxury wine estate and settle into your accommodation. Begin with a welcome yoga session overlooking the vineyards, followed by a private wine tasting and farm-to-table lunch. Afternoon spa treatment and evening fireside dinner with wine pairings.',
    'Luxury Wine Estate, Stellenbosch',
    ARRAY['Check-in and welcome', 'Vineyard yoga session', 'Private wine tasting', 'Spa treatment', 'Farm-to-table dining'],
    ARRAY['Welcome refreshments', 'Farm lunch', 'Dinner with wine pairings'],
    'Luxury Wine Estate Suite'

UNION ALL SELECT (SELECT id FROM tour_data), 2, 'Sunday: Morning Yoga and Farewell',
'Start with sunrise yoga in the vineyards led by Chad, followed by a gourmet breakfast. Enjoy a final wine tasting or cellar tour before departure. Professional photos of your experience and take-home gifts complete this perfect weekend.',
    'Luxury Wine Estate, Stellenbosch',
    ARRAY['Sunrise vineyard yoga', 'Gourmet breakfast', 'Final wine tasting or cellar tour', 'Professional photography', 'Departure'],
    ARRAY['Gourmet breakfast', 'Farewell refreshments'],
    'Check-out by 11 AM';

-- Cape Point Winter Adventure itinerary
WITH tour_data AS (
    SELECT id FROM tours WHERE slug = 'cape-point-winter-hot-springs'
)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, location, activities, meals_included, accommodation)
SELECT 
    (SELECT id FROM tour_data),
    1,
    'Full Day: Cape Point Winter Adventure',
    'Early morning departure from Cape Town for the scenic drive to Cape Point. Guided winter hike through the nature reserve with spectacular views and minimal crowds. After the hike, warm up with yoga stretches and meditation, then relax in natural hot springs. Return to Cape Town in the evening.',
    'Cape Point Nature Reserve & Hot Springs',
    ARRAY[
        'Scenic drive to Cape Point',
        'Guided winter hiking', 
        'Wildlife spotting',
        'Post-hike yoga and stretching',
        'Natural hot springs therapy',
        'Warming meditation session',
        'Return journey to Cape Town'
    ],
    ARRAY['Warming lunch with ocean views', 'Hot beverages throughout day'],
    'Day trip - return to Cape Town evening';

-- Monthly Wellness Workshop Series itinerary
WITH tour_data AS (
    SELECT id FROM tours WHERE slug = 'monthly-wellness-workshop-series'
)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, location, activities, meals_included, accommodation)
SELECT 
    (SELECT id FROM tour_data),
    1,
    'Month 1: Breathwork Fundamentals',
    'Deep dive into various breathing techniques from around the world. Learn pranayama, Wim Hof method, breathwork for anxiety, and breathing for energy. Hands-on practice with take-home guides and audio recordings.',
    'Wellness Studio, Green Point',
    ARRAY['Breathwork theory and benefits', 'Pranayama techniques', 'Wim Hof method introduction', 'Anxiety-relief breathing', 'Energy-boosting breath patterns'],
    ARRAY['Herbal teas', 'Healthy snacks'],
    'N/A - Workshop format'

UNION ALL SELECT (SELECT id FROM tour_data), 2, 'Month 2: Meditation Mastery',
'Explore different meditation styles and find what works for you. From mindfulness and loving-kindness to movement meditation and sound healing. Create your personal meditation practice with ongoing support.',
'Various locations around Cape Town',
ARRAY['Mindfulness meditation', 'Loving-kindness practice', 'Walking meditation', 'Sound healing session', 'Personal practice development'],
ARRAY['Meditation snacks', 'Calming teas'], 'N/A - Workshop format'

UNION ALL SELECT (SELECT id FROM tour_data), 3, 'Month 3: Nutrition and Plant Medicine',
'Learn about nutrition for optimal wellness and explore legal plant medicines and herbal remedies. Hands-on preparation of healing teas, tinctures, and nourishing foods. Focus on local South African plants and herbs.',
'Kitchen Studio, Woodstock',
ARRAY['Nutrition fundamentals', 'Local medicinal plants', 'Herbal tea blending', 'Tincture preparation', 'Healing food preparation'],
ARRAY['Prepared healing foods', 'Herbal tea tastings'], 'N/A - Workshop format'

UNION ALL SELECT (SELECT id FROM tour_data), 4, 'Month 4: Movement and Embodiment',
'Explore different movement practices beyond traditional yoga. Ecstatic dance, qigong, tai chi, and somatic movement. Connect with your body in new ways and discover joyful movement practices.',
'Dance Studio, Observatory',
ARRAY['Ecstatic dance', 'Qigong fundamentals', 'Tai chi practice', 'Somatic movement', 'Embodiment exercises'],
ARRAY['Energy snacks', 'Hydrating beverages'], 'N/A - Workshop format';

-- Add testimonials for new tours
WITH tour_data AS (
    SELECT id, slug FROM tours WHERE slug IN ('winter-fireplace-yoga-meditation', 'winter-wine-country-wellness', 'cape-point-winter-hot-springs', 'monthly-wellness-workshop-series')
)
INSERT INTO tour_testimonials (tour_id, name, title, testimonial_text, rating, image_url, approved, featured)
SELECT 
    t.id,
    CASE 
        WHEN t.slug = 'winter-fireplace-yoga-meditation' THEN 'Lisa Thompson'
        WHEN t.slug = 'winter-wine-country-wellness' THEN 'James Wilson'
        WHEN t.slug = 'cape-point-winter-hot-springs' THEN 'Maria Santos'
        WHEN t.slug = 'monthly-wellness-workshop-series' THEN 'David Kim'
    END,
    CASE 
        WHEN t.slug = 'winter-fireplace-yoga-meditation' THEN 'Cape Town Local'
        WHEN t.slug = 'winter-wine-country-wellness' THEN 'International Visitor'
        WHEN t.slug = 'cape-point-winter-hot-springs' THEN 'Adventure Enthusiast'
        WHEN t.slug = 'monthly-wellness-workshop-series' THEN 'Wellness Student'
    END,
    CASE 
        WHEN t.slug = 'winter-fireplace-yoga-meditation' THEN 'Perfect for Cape Town winters! The fireplace sessions are so cozy and warming. Chad creates such a welcoming atmosphere, and I always leave feeling energized despite the cold weather outside.'
        WHEN t.slug = 'winter-wine-country-wellness' THEN 'An absolutely magical weekend! The combination of luxury accommodation, world-class wine, and Chad''s expert yoga instruction made this the perfect winter escape. The spa treatments were divine.'
        WHEN t.slug = 'cape-point-winter-hot-springs' THEN 'What an incredible way to experience Cape Point in winter! The hiking was invigorating and the hot springs afterward were pure bliss. Chad''s guidance made the whole experience safe and enriching.'
        WHEN t.slug = 'monthly-wellness-workshop-series' THEN 'These workshops have transformed my wellness practice. Each month I learn something new and practical. The community aspect is wonderful - I''ve made lasting friendships through these sessions.'
    END,
    5,
    CASE 
        WHEN t.slug = 'winter-fireplace-yoga-meditation' THEN '/lovable-uploads/b69f9a35-02ab-45fd-868d-4a8df59e9ef1.png'
        WHEN t.slug = 'winter-wine-country-wellness' THEN '/lovable-uploads/640bba04-9344-4dab-8fe2-ca1fc4006c80.png'
        WHEN t.slug = 'cape-point-winter-hot-springs' THEN '/lovable-uploads/dd4158b7-7645-4ed7-b907-9c2a96575522.png'
        WHEN t.slug = 'monthly-wellness-workshop-series' THEN '/lovable-uploads/a52350ad-ae19-4d77-b79d-4cdd18b94367.png'
    END,
    true,
    true
FROM tour_data t;