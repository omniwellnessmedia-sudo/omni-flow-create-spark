-- First create provider profiles for FACT Wellness and Travel Tours
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
-- FACT Wellness Provider Profile
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
-- Travel and Tours Cape Town Provider Profile  
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

-- Now add services for FACT Wellness
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
  images,
  active
) VALUES
-- FACT Wellness Services
(
  '11111111-1111-1111-1111-111111111111',
  'Hatha Yoga Class (Level 1)',
  'Traditional Hatha yoga class perfect for beginners. Our hybrid format allows you to join in-person or online with expert instructors projected in our studio.',
  'Yoga',
  75,
  15,
  60,
  '150 Main Road, Muizenberg',
  true,
  ARRAY['/src/assets/yoga-studio.jpg'],
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'QiGong Practice (Level 1)',
  'Gentle flowing movements combining breath, movement, and meditation. Improve your energy levels and reduce stress with this ancient Chinese practice.',
  'QiGong',
  75,
  15,
  60,
  '150 Main Road, Muizenberg',
  true,
  ARRAY['/src/assets/qigong-meditation.jpg'],
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'Mantra Chanting & Guided Meditation',
  'Start your day with powerful mantra chanting and guided meditation. Improve mental clarity, focus, and inner peace.',
  'Meditation',
  75,
  15,
  60,
  '150 Main Road, Muizenberg',
  true,
  ARRAY['/src/assets/qigong-meditation.jpg'],
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'Yoga & Pilates Fusion Flow',
  'Dynamic fusion class combining the strength of Pilates with the flexibility of yoga. Suitable for intermediate practitioners.',
  'Pilates',
  75,
  15,
  60,
  '150 Main Road, Muizenberg',
  false,
  ARRAY['/src/assets/yoga-studio.jpg'],
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'Vinyasa Flow Yoga',
  'Energizing vinyasa flow connecting breath with movement. Perfect for building strength and flexibility.',
  'Yoga',
  75,
  15,
  90,
  '150 Main Road, Muizenberg',
  true,
  ARRAY['/src/assets/yoga-studio.jpg'],
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  '5 Class Pass',
  'Save with our 5 class pass. Valid for any of our yoga, QiGong, Pilates, or meditation classes. Expires in 2 months.',
  'Yoga',
  300,
  60,
  0,
  '150 Main Road, Muizenberg',
  true,
  ARRAY['/src/assets/yoga-studio.jpg'],
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  'Monthly Unlimited Pass',
  'Unlimited access to all classes for one month. Perfect for dedicated practitioners wanting maximum flexibility.',
  'Yoga',
  500,
  100,
  0,
  '150 Main Road, Muizenberg',
  true,
  ARRAY['/src/assets/yoga-studio.jpg'],
  true
);

-- Travel and Tours Cape Town Services
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
  images,
  active
) VALUES
(
  '22222222-2222-2222-2222-222222222222',
  'Great Mother Cave Tour',
  'Discover sacred sites of Peers Cave and Tunnel Cave with Chief Kingsley. Full day immersive journey into Khoisan spiritual traditions and ancient wisdom.',
  'Cultural Tours',
  2999,
  600,
  480,
  'Fish Hoek, Cape Town',
  false,
  ARRAY['/src/assets/sacred-cave.jpg'],
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Kalk Bay Indigenous Walk',
  'Cultural and natural odyssey through Kalk Bay with Chief Kingsley. Explore Echo Valley, Boomslang Cave, and learn indigenous plant medicine.',
  'Cultural Tours',
  1499,
  300,
  240,
  'Kalk Bay, Cape Town',
  false,
  ARRAY['/src/assets/sacred-cave.jpg'],
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Cape Summit Adventure',
  'Conquer Table Mountain & Lion\'s Head with expert guides. Combine physical challenge with cultural insights and breathtaking views.',
  'Adventure Tourism',
  2499,
  500,
  480,
  'Table Mountain, Cape Town',
  false,
  ARRAY['/src/assets/table-mountain-hike.jpg'],
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Ultimate Surf & Culture Experience',
  'Ride waves with world champion Cass Collier. Combine surfing instruction with cultural immersion and ocean blessing ceremonies.',
  'Adventure Tourism',
  2999,
  600,
  480,
  'Muizenberg Beach, Cape Town',
  false,
  ARRAY['/src/assets/surfing-lesson.jpg'],
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Indigenous Healing Immersion',
  '7-day wellness retreat combining traditional healing ceremonies, plant medicine workshops, and indigenous wellness practices.',
  'Wellness Retreats',
  18999,
  3800,
  10080,
  'Cape Town & Surrounding Areas',
  false,
  ARRAY['/src/assets/traditional-healing.jpg'],
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Ubuntu Leadership Retreat',
  '5-day transformational retreat applying Ubuntu philosophy to organizational leadership. Perfect for teams and leaders.',
  'Life Coaching',
  15999,
  3200,
  7200,
  'Cape Town & Surrounding Areas',
  false,
  ARRAY['/src/assets/traditional-healing.jpg'],
  true
);