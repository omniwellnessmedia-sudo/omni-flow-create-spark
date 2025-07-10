-- Insert Sandy Mitchell's provider profile
INSERT INTO provider_profiles (
  id,
  business_name,
  description,
  location,
  phone,
  website,
  specialties,
  certifications,
  experience_years,
  verified,
  wellcoin_balance
) VALUES (
  '351e4f5a-a27f-4fe5-957f-fa0ea1210040',
  'Sandy Mitchell Wellness',
  'I''m Sandy Mitchell, a Dru Yoga and Buteyko Breathing practitioner based in Cape Town. My work is grounded in heart-based, breath awareness, that meets people where they are. I guide clients gently back to their breath, body, and inner stillness — especially those who feel disconnected from traditional wellness spaces. My sessions are soft, soulful, and rooted in real human experience.

My journey into wellness has been a gradual progression over time, having always taken an interest in wellness and ways to improve one''s health with minimal intervention. I''ve trained in Dru Yoga — a gentle, accessible form of yoga that works through energy block release sequences and the five koshas — as well Buteyko Breathing, a science-based, non-invasive approach to correcting dysfunctional breathing patterns, often linked to health conditions.

What makes my approach different is its tenderness. I don''t believe in pushing, striving, or showing off. I create a space where it''s safe to exhale — to soften, to reconnect, to begin again.

I work with people of all ages, but especially support women and adults in their 30s–60s who feel overwhelmed, burnt out, or simply stuck. My classes and private sessions are welcoming, real, and grounded in lived experience.',
  'Cape Town, South Africa',
  '+27-XXX-XXX-XXXX',
  'https://sandymitchell.co.za',
  ARRAY['Dru Yoga', 'Buteyko Breathing', 'Breathwork', 'Trauma-Informed Practice', 'Mental Wellness'],
  ARRAY['Dru Yoga Instructor', 'Buteyko Breathing Practitioner'],
  5,
  true,
  100
);

-- Insert Sandy's services
INSERT INTO services (
  provider_id,
  title,
  description,
  category,
  price_zar,
  price_wellcoins,
  duration_minutes,
  location,
  is_online,
  active
) VALUES 
(
  '351e4f5a-a27f-4fe5-957f-fa0ea1210040',
  'Dru Yoga Class - Stonehurst',
  'Gentle, flowing yoga designed for all bodies. Includes breath, movement, stillness. Fridays 9:00 AM at Stonehurst.',
  'Yoga & Movement',
  120,
  100,
  60,
  'Stonehurst, Cape Town',
  false,
  true
),
(
  '351e4f5a-a27f-4fe5-957f-fa0ea1210040',
  'Dru Yoga Class - Observatory',
  'Gentle, flowing yoga designed for all bodies. Includes breath, movement, stillness. Thursdays 5:45 PM at Observatory.',
  'Yoga & Movement',
  120,
  100,
  60,
  'Observatory, Cape Town',
  false,
  true
),
(
  '351e4f5a-a27f-4fe5-957f-fa0ea1210040',
  'Dru Backcare Course',
  'A 5-10 week programme to relieve back pain. Simple, easy-to-do exercises. Stretch and strengthen the muscles along your spine.',
  'Therapeutic Wellness',
  600,
  500,
  60,
  'Cape Town',
  false,
  true
),
(
  '351e4f5a-a27f-4fe5-957f-fa0ea1210040',
  'Dru Mental Wellness Course',
  'A 5 week Yoga course to improve one''s sense of wellbeing. Focusing on mental clarity and emotional balance.',
  'Mental Health & Wellness',
  600,
  500,
  60,
  'Cape Town',
  false,
  true
),
(
  '351e4f5a-a27f-4fe5-957f-fa0ea1210040',
  'Buteyko Breathing Private Session',
  'Personalized breathing retraining for anxiety, sleep, or general health. Includes intake, education, and gentle guidance.',
  'Breathwork & Meditation',
  350,
  300,
  60,
  'Cape Town or Online',
  true,
  true
),
(
  '351e4f5a-a27f-4fe5-957f-fa0ea1210040',
  'Free Discovery Call',
  '15-min consult to understand your needs and see if we''re a fit. Perfect introduction to my approach.',
  'Consultation',
  0,
  0,
  15,
  'Online',
  true,
  true
),
(
  '351e4f5a-a27f-4fe5-957f-fa0ea1210040',
  'Monthly Wellness Workshop',
  'Themed sessions combining Dru Yoga & Buteyko with space for sharing, rest, and community. 90-120 minutes of deep restoration.',
  'Workshops & Events',
  275,
  230,
  105,
  'Cape Town',
  false,
  true
);

-- Create welcome transaction
INSERT INTO transactions (
  user_id,
  transaction_type,
  description,
  amount_wellcoins,
  amount_zar,
  status
) VALUES (
  '351e4f5a-a27f-4fe5-957f-fa0ea1210040',
  'bonus',
  'Welcome to Omni Wellness Exchange! Your starting WellCoins.',
  100,
  0,
  'completed'
);