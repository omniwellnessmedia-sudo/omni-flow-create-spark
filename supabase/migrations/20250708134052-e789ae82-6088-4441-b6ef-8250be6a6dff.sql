-- Create Sandy Mitchell's provider profile and services
-- First, we need to manually create her user account via Supabase Auth dashboard
-- This script sets up her provider profile and services

-- Insert Sandy's provider profile (we'll use a placeholder UUID that matches her auth user)
-- Note: The actual user ID will need to be updated after creating the auth user
INSERT INTO public.provider_profiles (
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
  '00000000-0000-0000-0000-000000000001', -- Placeholder - will need actual user ID
  'Sandy Mitchell Wellness',
  'I''m Sandy Mitchell, a Dru Yoga and Buteyko Breathing practitioner based in Cape Town. My work is grounded in heart-based, breath awareness, that meets people where they are. I guide clients gently back to their breath, body, and inner stillness — especially those who feel disconnected from traditional wellness spaces. My sessions are soft, soulful, and rooted in real human experience.',
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
INSERT INTO public.services (
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
-- Dru Yoga Classes
(
  '00000000-0000-0000-0000-000000000001',
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
  '00000000-0000-0000-0000-000000000001',
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
-- Dru Backcare Course
(
  '00000000-0000-0000-0000-000000000001',
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
-- Dru Mental Wellness Course
(
  '00000000-0000-0000-0000-000000000001',
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
-- Buteyko Private Session
(
  '00000000-0000-0000-0000-000000000001',
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
-- Free Discovery Call
(
  '00000000-0000-0000-0000-000000000001',
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
-- Monthly Workshop
(
  '00000000-0000-0000-0000-000000000001',
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

-- Create a welcome transaction for Sandy
INSERT INTO public.transactions (
  user_id,
  transaction_type,
  description,
  amount_wellcoins,
  amount_zar,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'bonus',
  'Welcome to Omni Wellness Exchange! Your starting WellCoins.',
  100,
  0,
  'completed'
);