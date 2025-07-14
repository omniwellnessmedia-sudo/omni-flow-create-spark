-- Add detailed itinerary for Indigenous Wisdom & Healing tour
WITH tour_data AS (
  SELECT id FROM tours WHERE slug = 'conscious-connections-indigenous-wisdom-healing'
)
INSERT INTO public.tour_itineraries (
  tour_id, day_number, title, description, location, activities, meals_included, accommodation
) 
SELECT 
  (SELECT id FROM tour_data),
  1,
  'Arrival and Welcome',
  'Airport meet and greet, transfer to eco-wellness retreat in Cederberg Mountains. Welcome ceremony with Khoisan healer, introduction to indigenous wellness concepts, gentle yoga and meditation session.',
  'Cederberg Mountains, Cape Town',
  ARRAY['Airport transfer', 'Welcome ceremony', 'Yoga and meditation', 'Orientation session'],
  ARRAY['Dinner'],
  'Luxury Eco-Retreat, Cederberg'

UNION ALL SELECT (SELECT id FROM tour_data), 2, 'Khoisan Healing Traditions Day 1', 
'Morning nature walks and plant medicine teachings. Workshops on Khoisan healing practices and plant-based remedies. Hands-on preparation of traditional herbal remedies.',
'Cederberg Mountains', 
ARRAY['Nature walks', 'Plant medicine teachings', 'Herbal remedy preparation', 'Sound healing'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Eco-Retreat, Cederberg'

UNION ALL SELECT (SELECT id FROM tour_data), 3, 'Khoisan Healing Traditions Day 2',
'Continue exploring Khoisan healing practices. Sound healing sessions with indigenous instruments. Evening storytelling and mythology around the fire.',
'Cederberg Mountains',
ARRAY['Advanced healing workshops', 'Sound healing', 'Storytelling', 'Fire ceremony'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Eco-Retreat, Cederberg'

UNION ALL SELECT (SELECT id FROM tour_data), 4, 'Coastal Healing Day 1',
'Transfer to coastal retreat near Hermanus. Guided fasting and cleansing program (optional). Marine therapy sessions and thalassotherapy.',
'Hermanus Coast',
ARRAY['Transfer to coast', 'Marine therapy', 'Thalassotherapy', 'Ocean meditation'],
ARRAY['Breakfast', 'Light lunch', 'Dinner'], 'Luxury Coastal Lodge, Hermanus'

UNION ALL SELECT (SELECT id FROM tour_data), 5, 'Coastal Healing Day 2',
'Workshops on ocean conservation and sustainable seafood. Evening whale watching and ocean meditation (seasonal).',
'Hermanus Coast',
ARRAY['Conservation workshops', 'Whale watching', 'Ocean meditation', 'Sustainable seafood education'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Coastal Lodge, Hermanus'

UNION ALL SELECT (SELECT id FROM tour_data), 6, 'Fynbos Aromatherapy Day 1',
'Transfer to botanical retreat in Stellenbosch winelands. Guided walks in fynbos-rich landscapes. Workshops on aromatherapy and essential oil production.',
'Stellenbosch Winelands',
ARRAY['Transfer to winelands', 'Fynbos walks', 'Aromatherapy workshops', 'Essential oil production'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Vineyard Spa Resort, Stellenbosch'

UNION ALL SELECT (SELECT id FROM tour_data), 7, 'Fynbos Aromatherapy Day 2',
'Fynbos-infused spa treatments. Organic wine tasting and lessons on mindful consumption.',
'Stellenbosch Winelands',
ARRAY['Spa treatments', 'Wine tasting', 'Mindful consumption workshops', 'Botanical healing'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Vineyard Spa Resort, Stellenbosch'

UNION ALL SELECT (SELECT id FROM tour_data), 8, 'Zulu Traditional Healing Day 1',
'Morning flight to Durban, transfer to Zulu cultural village. Introduction to Zulu cosmology and healing traditions. Participation in traditional ceremonies.',
'KwaZulu-Natal',
ARRAY['Flight to Durban', 'Cultural village visit', 'Zulu ceremonies', 'Traditional healing introduction'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Zulu-inspired Eco-Lodge, KwaZulu-Natal'

UNION ALL SELECT (SELECT id FROM tour_data), 9, 'Zulu Traditional Healing Day 2',
'One-on-one consultations with Zulu Sangomas (traditional healers). Workshops on dream interpretation and ancestral communication. Prepare traditional Zulu healing foods.',
'KwaZulu-Natal',
ARRAY['Sangoma consultations', 'Dream interpretation', 'Ancestral communication', 'Traditional food preparation'],
ARRAY['Breakfast', 'Lunch', 'Dinner'], 'Luxury Zulu-inspired Eco-Lodge, KwaZulu-Natal'

UNION ALL SELECT (SELECT id FROM tour_data), 10, 'Integration and Departure',
'Final integration circle and closing ceremony. Morning gentle yoga and meditation. Transfer to King Shaka International Airport.',
'KwaZulu-Natal to Durban',
ARRAY['Integration circle', 'Closing ceremony', 'Yoga and meditation', 'Airport transfer'],
ARRAY['Breakfast'], 'Day of departure';

-- Add some testimonials for the tour
WITH tour_data AS (
  SELECT id FROM tours WHERE slug = 'conscious-connections-indigenous-wisdom-healing'
)
INSERT INTO public.tour_testimonials (
  tour_id, name, title, testimonial_text, rating, image_url, approved, featured
)
SELECT 
  (SELECT id FROM tour_data),
  'Sarah Mitchell',
  'Wellness Coach from California',
  'This retreat completely transformed my understanding of healing. The combination of indigenous wisdom and modern wellness practices created a profound journey of self-discovery. The healers were incredibly knowledgeable and the locations were breathtaking.',
  5,
  '/lovable-uploads/wellness-humans.png',
  true,
  true

UNION ALL SELECT 
  (SELECT id FROM tour_data),
  'Michael Chen',
  'Yoga Instructor from Vancouver',
  'An absolutely life-changing experience. The integration of different healing traditions from Khoisan to Zulu was seamless and deeply respectful. I returned home with not just knowledge, but with a completely new perspective on wellness.',
  5,
  '/lovable-uploads/traditional-healing.jpg',
  true,
  true

UNION ALL SELECT 
  (SELECT id FROM tour_data),
  'Dr. Elena Rodriguez',
  'Holistic Medicine Practitioner',
  'As a medical practitioner, I was fascinated by the scientific basis of traditional healing methods. This retreat provided an incredible bridge between ancient wisdom and modern understanding of wellness.',
  5,
  '/lovable-uploads/sacred-cave.jpg',
  true,
  false;