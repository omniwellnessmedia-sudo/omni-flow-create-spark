-- First create basic profiles
INSERT INTO profiles (
  id,
  email,
  full_name,
  user_type
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'info@factwellness.co.za',
  'Chad Cupido',
  'provider'
),
(
  '22222222-2222-2222-2222-222222222222',
  'info@travelandtourscapetown.com',
  'Travel Tours Team',
  'provider'
);

-- Then create provider profiles
INSERT INTO provider_profiles (
  id,
  business_name,
  description,
  specialties,
  location,
  phone,
  website,
  experience_years,
  verified,
  wellcoin_balance
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'FACT WELLNESS',
  'Innovative hybrid wellness studio offering yoga, QiGong, Pilates, breath work, meditation, and mantra chanting. Our unique approach combines in-person instruction with global online content.',
  ARRAY['Yoga', 'QiGong', 'Pilates', 'Meditation', 'Breath Work', 'Mantra Chanting'],
  'Muizenberg, Cape Town',
  '+27 74 831 5961',
  'www.factwellness.co.za',
  10,
  true,
  50
),
(
  '22222222-2222-2222-2222-222222222222',
  'Travel and Tours Cape Town',
  'Transformative travel experiences rooted in Ubuntu principles and indigenous wisdom. Offering cultural tours, adventure hiking, wellness retreats, and study abroad programs.',
  ARRAY['Cultural Tours', 'Adventure Tourism', 'Wellness Retreats', 'Study Abroad', 'Indigenous Experiences'],
  'Cape Town, Western Cape',
  '+27 74 831 5961',
  'www.travelandtourscapetown.com',
  8,
  true,
  75
);