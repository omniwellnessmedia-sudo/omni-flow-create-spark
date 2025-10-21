-- Add detailed itinerary for Indigenous Surfing Tour with Cass Collier
DO $$
DECLARE
  v_tour_id UUID;
BEGIN
  -- Get the tour ID for the Indigenous Surfing Tour
  SELECT id INTO v_tour_id FROM public.tours WHERE slug = 'indigenous-surfing-cass-collier';

  -- Delete existing itinerary items if any
  DELETE FROM public.tour_itineraries WHERE tour_id = v_tour_id;

  -- Insert detailed itinerary
  INSERT INTO public.tour_itineraries (tour_id, day_number, title, description, location, activities, meals_included) VALUES
  (v_tour_id, 1, '08:45 | Meet in Muizenberg', 'Gather at Surfers Corner (Surfers Circle Walk of Fame). Welcome briefing and safety orientation with Cass.', 'Muizenberg - Surfers Corner', ARRAY['Welcome briefing', 'Safety orientation with Cass', 'Equipment check'], NULL),
  
  (v_tour_id, 2, '09:15 | Depart for Cape Point', 'Scenic drive along the coastline with educational insights into Indigenous history, flora, and fauna.', 'Cape Peninsula Coastal Route', ARRAY['Scenic coastal drive', 'Indigenous history lessons', 'Flora and fauna education'], NULL),
  
  (v_tour_id, 3, '10:00 | Surf Session at Cape Point', 'Thrilling surf coaching with Cass. Learn techniques while riding waves at a culturally significant location. Cultural context of the ocean for the First People.', 'Cape Point', ARRAY['Professional surf coaching', 'Wave riding techniques', 'Cultural teachings about ocean significance', 'Indigenous ocean wisdom'], ARRAY['Herbal tea', 'Fruits', 'Nuts']),
  
  (v_tour_id, 4, '12:00 | Scenic Drive to Kommetjie', 'Scenic coastal drive with continued cultural storytelling.', 'Cape Point to Kommetjie', ARRAY['Scenic drive', 'Cultural storytelling'], NULL),
  
  (v_tour_id, 5, '12:30 | Explore Kommetjie Village', 'Village walk and storytelling with local residents. Meet Khoikhoi descendants and discover the area''s surfing roots.', 'Kommetjie Village', ARRAY['Village walking tour', 'Meet local Khoikhoi descendants', 'Learn about surfing history', 'Cultural exchange with community'], NULL),
  
  (v_tour_id, 6, '13:30 | Lunch Break in Kommetjie', 'Relax and connect with fellow participants at local cafés/shops (self-purchase).', 'Kommetjie Village', ARRAY['Free time', 'Lunch at local establishments', 'Connect with group'], ARRAY['Self-purchase at local cafés']),
  
  (v_tour_id, 7, '14:30 | Surf Session at Long Beach', 'Second surf session at one of South Africa''s most iconic surf spots. Progression coaching: trimming, timing, and wave selection. Learn about Long Beach''s role in South Africa''s surf history.', 'Long Beach, Kommetjie', ARRAY['Advanced surf coaching', 'Wave trimming techniques', 'Timing and wave selection', 'Surf history education'], NULL),
  
  (v_tour_id, 8, '15:30 | Visit Scarborough', 'Explore Camel Rock, a sacred cultural landmark. Optional short surf check and natural exploration.', 'Scarborough - Camel Rock', ARRAY['Visit sacred Camel Rock landmark', 'Cultural teachings', 'Optional surf check', 'Natural landscape exploration'], NULL),
  
  (v_tour_id, 9, '16:00 | Visit Ocean View Community', 'Learn about the displacement of coastal Indigenous communities under apartheid. Engage with the Rastafarian community and hear stories of resilience and cultural survival.', 'Ocean View', ARRAY['Community visit', 'Apartheid history education', 'Meet Rastafarian community', 'Stories of resilience', 'Cultural survival teachings'], NULL),
  
  (v_tour_id, 10, '17:00 | Visit Constantia', 'Meet Elder Bernard Brown of the Burning Spear Movement. Learn about Indigenous herbal traditions and healing plants like buchu. Enjoy a traditional Ital meal as part of the cultural exchange.', 'Constantia', ARRAY['Meet Elder Bernard Brown', 'Learn about Indigenous herbal traditions', 'Healing plants education (buchu)', 'Cultural exchange'], ARRAY['Traditional Ital meal']),
  
  (v_tour_id, 11, '17:30 | Wrap Up & Return', 'Scenic return drive to Muizenberg. Closing circle with Cass and the team.', 'Return to Muizenberg', ARRAY['Scenic return drive', 'Closing circle ceremony', 'Group reflection', 'Farewell'], NULL);

  RAISE NOTICE 'Successfully added 11 itinerary items for Indigenous Surfing Tour with Cass Collier';
END $$;