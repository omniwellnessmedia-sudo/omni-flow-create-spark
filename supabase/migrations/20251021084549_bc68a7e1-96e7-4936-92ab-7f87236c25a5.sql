-- ============================================
-- INDIGENOUS SURFING TOUR ITINERARY
-- Detailed day-by-day itinerary for Cass Collier tour
-- ============================================

-- Get the tour ID for the Indigenous Surfing Tour
DO $$
DECLARE
  tour_id_var UUID;
BEGIN
  SELECT id INTO tour_id_var FROM public.tours WHERE slug = 'indigenous-surfing-cass-collier';

  -- Day 1: Meet in Muizenberg & Travel to Cape Point
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    1,
    '08:45 | Meet in Muizenberg',
    'Gather at Surfers Corner (Surfers Circle Walk of Fame) for welcome briefing and safety orientation with Cass. Learn about the day ahead, meet fellow participants, and prepare for an unforgettable journey.',
    'Muizenberg - Surfers Corner',
    ARRAY['Welcome briefing with Cass Collier', 'Safety orientation', 'Meet fellow participants', 'Equipment check'],
    ARRAY[]::text[],
    NULL
  );

  -- Day 2: Depart for Cape Point
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    2,
    '09:15 | Depart for Cape Point (45 min drive)',
    'Scenic drive along the stunning coastline with educational insights into Indigenous history, flora, and fauna. Cass shares stories of the First People and their deep connection to the ocean.',
    'Cape Peninsula Coastal Route',
    ARRAY['Scenic coastal drive', 'Indigenous history teachings', 'Flora and fauna education', 'Cultural storytelling'],
    ARRAY[]::text[],
    NULL
  );

  -- Day 3: First Surf Session at Cape Point
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    3,
    '10:00 | Surf Session at Cape Point (2 hours)',
    'Thrilling surf coaching with world champion Cass Collier. Learn fundamental and advanced techniques while riding waves at a culturally significant location. Understand the ocean''s spiritual importance to the First People and how surfing connects us to ancestral wisdom.',
    'Cape Point Beach',
    ARRAY['Surf coaching with Cass Collier', 'Wave riding and techniques', 'Ocean safety and awareness', 'Cultural context of the ocean', 'Traditional water blessing'],
    ARRAY['Herbal tea', 'Fresh fruits', 'Nuts']::text[],
    NULL
  );

  -- Day 4: Scenic Drive to Kommetjie
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    4,
    '12:00 | Scenic Drive to Kommetjie (30 min)',
    'Continue along the dramatic Peninsula coastline, taking in breathtaking ocean views and learning about the area''s surfing heritage and Indigenous significance.',
    'Cape Point to Kommetjie',
    ARRAY['Scenic coastal views', 'Photo opportunities', 'Historical insights'],
    ARRAY[]::text[],
    NULL
  );

  -- Day 5: Explore Kommetjie Village
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    5,
    '12:30 | Explore Kommetjie (1 hour)',
    'Village walk and storytelling with local residents. Meet Khoikhoi descendants and discover Kommetjie''s deep surfing roots. Learn how this coastal community has preserved its heritage while embracing surf culture.',
    'Kommetjie Village',
    ARRAY['Village walk', 'Meet Khoikhoi descendants', 'Local storytelling', 'Discover surfing history', 'Community engagement'],
    ARRAY[]::text[],
    NULL
  );

  -- Day 6: Lunch Break in Kommetjie
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    6,
    '13:30 | Lunch Break in Kommetjie (30 min)',
    'Relax and refuel at local cafés and shops. Self-purchase lunch while connecting with fellow participants and reflecting on the morning''s experiences. Kommetjie offers excellent seafood and vegetarian options.',
    'Kommetjie Village',
    ARRAY['Lunch at local cafés (self-purchase)', 'Relaxation time', 'Connect with participants', 'Local cuisine exploration'],
    ARRAY[]::text[],
    NULL
  );

  -- Day 7: Second Surf Session at Long Beach
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    7,
    '14:30 | Surf Session at Long Beach, Kommetjie (1 hour)',
    'Second surf session at one of South Africa''s most iconic surf spots. Progression coaching focusing on trimming, timing, and wave selection. Learn about Long Beach''s pivotal role in South Africa''s surf history and how it became a symbol of freedom during apartheid.',
    'Long Beach, Kommetjie',
    ARRAY['Advanced surf coaching', 'Wave selection and timing', 'Trimming techniques', 'Surf history of Long Beach', 'Cultural significance of surfing during apartheid'],
    ARRAY[]::text[],
    NULL
  );

  -- Day 8: Visit Scarborough
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    8,
    '15:30 | Visit Scarborough (1 hour)',
    'Explore Camel Rock, a sacred cultural landmark with deep spiritual significance to the Indigenous peoples. Optional short surf check and natural exploration of this pristine coastal area. Learn about the geological and cultural importance of this protected site.',
    'Scarborough - Camel Rock',
    ARRAY['Visit Camel Rock sacred site', 'Cultural landmark exploration', 'Optional surf check', 'Natural landscape discovery', 'Spiritual teachings'],
    ARRAY[]::text[],
    NULL
  );

  -- Day 9: Visit Ocean View
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    9,
    '16:00 | Visit Ocean View (30 min)',
    'Powerful visit to Ocean View, learning about the displacement of coastal Indigenous communities under apartheid. Engage with the Rastafarian community and hear stories of resilience, cultural survival, and the ongoing struggle for justice and recognition.',
    'Ocean View',
    ARRAY['Learn about apartheid displacement', 'Meet Rastafarian community', 'Stories of resilience', 'Cultural survival discussions', 'Social justice education'],
    ARRAY[]::text[],
    NULL
  );

  -- Day 10: Visit Constantia & Traditional Meal
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    10,
    '17:00 | Visit Constantia (1 hour)',
    'Meet Elder Bernard Brown of the Burning Spear Movement, a respected knowledge keeper. Learn about Indigenous herbal traditions and healing plants like buchu (South Africa''s sacred herb). Enjoy a traditional Ital meal as part of the cultural exchange, experiencing Rastafarian plant-based cuisine prepared with consciousness and love.',
    'Constantia - Burning Spear Movement',
    ARRAY['Meet Elder Bernard Brown', 'Indigenous herbal traditions workshop', 'Learn about buchu and healing plants', 'Traditional Ital meal experience', 'Cultural exchange and wisdom sharing'],
    ARRAY['Traditional Ital meal']::text[],
    NULL
  );

  -- Day 11: Wrap Up & Return
  INSERT INTO public.tour_itineraries (
    tour_id, day_number, title, description, location, activities, meals_included, accommodation
  ) VALUES (
    tour_id_var,
    11,
    '17:30 | Wrap Up & Return',
    'Scenic return drive to Muizenberg with time for reflection and integration. Closing circle with Cass and the team to share experiences, insights, and gratitude. Exchange contact information with new friends and receive recommendations for continuing your journey.',
    'Return to Muizenberg',
    ARRAY['Scenic return drive', 'Closing circle with Cass', 'Experience sharing', 'Reflection and gratitude', 'Group photo', 'Exchange contact information'],
    ARRAY[]::text[],
    NULL
  );

  RAISE NOTICE 'Successfully created detailed itinerary for Indigenous Surfing Tour with Cass Collier!';
  RAISE NOTICE 'Total itinerary stops: 11 (from 08:45 to 17:30)';
END $$;