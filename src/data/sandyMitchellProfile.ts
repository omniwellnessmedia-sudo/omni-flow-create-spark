// Sandy Mitchell - Complete Wellness Profile and Services
// Based on druyogacapetown.co.za and Omni Wellness resources
import { IMAGES } from '@/lib/images';

export interface SandyService {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'Yoga' | 'Meditation' | 'Nutrition Counseling' | 'Life Coaching' | 'Energy Healing';
  price_zar: number;
  price_wellcoins: number;
  duration_minutes: number;
  location: string;
  is_online: boolean;
  active: boolean;
  images: string[];
  benefits: string[];
  suitableFor: string[];
  requirements: string[];
  specialFeatures: string[];
}

export const sandyProviderProfile = {
  id: 'sandy-mitchell-dru-yoga',
  business_name: 'Sandy Mitchell - Dru Yoga Cape Town',
  tagline: 'Breathe gently. Move slowly. Heal deeply.',
  shortBio: `I'm Sandy Mitchell, a Dru Yoga and Buteyko Breathing practitioner based in Cape Town. My work is grounded in heart-based, breath awareness, that meets people where they are. I guide clients gently back to their breath, body, and inner stillness — especially those who feel disconnected from traditional wellness spaces. My sessions are soft, soulful, and rooted in real human experience.`,
  description: `My journey into wellness has been a gradual progression over time, having always taken an interest in wellness and ways to improve one's health with minimal intervention. I've trained in Dru Yoga — a gentle, accessible form of yoga that works through energy block release sequences, flowing sequences and traditional asanas (postures) — as well Buteyko Breathing, a science-based, non-invasive approach to correcting dysfunctional breathing patterns, often linked to adverse health conditions.

I aim to create a space where people feel safe to be themselves, guided by a belief in the power of subtlety and gentleness rather than pushing or forcing. I work with people of all ages, but especially support people who feel overwhelmed, burnt out, or simply stuck. My yoga classes are grounded and accessible, and at times we laugh a lot!

I also collaborate with Omni Wellness Media on workshops, content, and a longer-term vision of co-creating accessible tools for combating stress and living life more in tune with nature and one's self.`,
  location: 'Cape Town, South Africa (Observatory, Stonehurst)',
  phone: '+27 21 XXX XXXX',
  email: 'sandy@druyogacapetown.co.za',
  website: 'https://sandymitchell.co.za/book-a-call/',
  calendly: 'https://sandymitchell.co.za/book-a-call/',
  specialties: [
    'Dru Yoga',
    'Buteyko Breathing',
    'Healthy Back Programme',
    'Energy Block Release',
    'Adaptive Yoga',
    'Breath Work'
  ],
  certifications: [
    'Certified Dru Yoga Instructor',
    'Certified Buteyko Breathing Facilitator',
    'Specialized Back Health Training'
  ],
  years_experience: 8,
  verified: true,
  wellcoin_balance: 2840,
  profile_image_url: IMAGES.sandy.profile,
  cover_image: IMAGES.sandy.hero,
  philosophy: "All bodies are welcome. I believe in creating a relaxed, friendly environment where everyone can experience the benefits of yoga, regardless of their physical abilities or experience level.",
  social_media: {
    instagram: '@druyogacapetown',
    facebook: 'Dru Yoga Cape Town',
    linkedin: 'Sandy Mitchell Yoga',
  },
  rating: 4.9,
  total_clients: 150,
  total_hours_taught: 2400
};

export const sandyServices: SandyService[] = [
  {
    id: 'dru-yoga-class',
    title: 'Dru Yoga Class',
    description: 'Gentle, flowing yoga designed for all bodies. Includes breath, movement, stillness.',
    longDescription: 'Join our weekly Dru Yoga classes held at two convenient locations in Cape Town. These gentle, flowing sessions are designed to be accessible for all bodies and fitness levels. Each class incorporates breath work, mindful movement, and deep stillness, creating a holistic practice that nurtures body, mind, and spirit. Fridays at 9:00 AM in Stonehurst or Thursdays at 17:45 in Observatory.',
    category: 'Yoga',
    price_zar: 120,
    price_wellcoins: 16,
    duration_minutes: 60,
    location: 'In-person: Fridays 9:00 AM Stonehurst, Thursdays 17:45 Observatory',
    is_online: false,
    active: true,
    images: [
      IMAGES.sandy.teaching,
      IMAGES.sandy.yoga
    ],
    benefits: [
      'Gentle movements suitable for all bodies',
      'Stress reduction and deep relaxation',
      'Improved flexibility and strength',
      'Better posture and awareness',
      'Community connection',
      'Energy block release'
    ],
    suitableFor: [
      'All fitness levels',
      'Complete beginners',
      'Those seeking gentle yoga',
      'People wanting regular practice',
      'Anyone seeking community'
    ],
    requirements: [
      'Yoga mat',
      'Comfortable clothing',
      'Water bottle',
      'Open mind'
    ],
    specialFeatures: [
      'Weekly classes at two locations',
      'Energy Block Release sequences',
      'Breath awareness techniques',
      'All bodies welcome',
      'Friendly, relaxed environment'
    ]
  },
  {
    id: 'dru-backcare-course',
    title: 'Dru Backcare Course',
    description: 'A 5-10 week programme to relieve back pain. Simple, easy-to-do exercises. Stretch and strengthen the muscles that support your spine.',
    longDescription: 'Transform your relationship with back pain through this comprehensive 5-10 week programme. Using gentle Dru Yoga movements specifically designed for back health, you\'ll learn simple, easy-to-do exercises that stretch and strengthen the muscles supporting your spine. Each session builds progressively, addressing the root causes of back discomfort while building awareness, flexibility, and strength. You\'ll receive tools you can use for life to maintain a healthy, pain-free back.',
    category: 'Yoga',
    price_zar: 600,
    price_wellcoins: 79,
    duration_minutes: 60,
    location: 'In-person',
    is_online: false,
    active: true,
    images: [
      IMAGES.sandy.yoga,
      IMAGES.wellness.yoga
    ],
    benefits: [
      'Reduced back pain and tension',
      'Improved spinal mobility',
      'Better posture awareness',
      'Strengthened core and back muscles',
      'Simple exercises for daily practice',
      'Long-term back health strategies'
    ],
    suitableFor: [
      'Anyone with back pain or stiffness',
      'Office workers with poor posture',
      'People recovering from back injury',
      'Those wanting to prevent back problems',
      'Anyone who sits for long periods'
    ],
    requirements: [
      'Commitment to attend sessions',
      'Comfortable clothing',
      'Yoga mat',
      'Willingness to practice at home'
    ],
    specialFeatures: [
      'Progressive 5-10 week structure',
      'Easy-to-follow exercises',
      'Take-home practice routine',
      'Gentle therapeutic approach',
      'Personalized modifications'
    ]
  },
  {
    id: 'buteyko-private-session',
    title: 'Buteyko Private Session',
    description: 'Personalised breathing retraining for anxiety, sleep, respiratory disorders or general health. Includes 4/5 sessions. Handouts, MP3s and WhatsApp support is included.',
    longDescription: 'Discover the transformative power of proper breathing with personalized Buteyko Method training. This comprehensive package includes 4-5 private sessions where you\'ll learn science-based breathing techniques to address anxiety, sleep issues, respiratory disorders, or general health optimization. Each session builds on the last, with personalized attention to your specific needs. You\'ll receive handouts, MP3 practice recordings, and ongoing WhatsApp support between sessions to ensure your success.',
    category: 'Meditation',
    price_zar: 350,
    price_wellcoins: 46,
    duration_minutes: 60,
    location: 'Zoom or in-person',
    is_online: true,
    active: true,
    images: [
      IMAGES.sandy.meditation,
      IMAGES.wellness.meditation
    ],
    benefits: [
      'Improved breathing efficiency',
      'Reduced anxiety and stress',
      'Better sleep quality',
      'Enhanced athletic performance',
      'Reduced asthma and respiratory symptoms',
      'Increased energy and vitality'
    ],
    suitableFor: [
      'People with breathing difficulties',
      'Those experiencing anxiety or panic attacks',
      'Athletes wanting to improve performance',
      'Anyone with sleep issues',
      'People with asthma or respiratory conditions',
      'Stress management seekers'
    ],
    requirements: [
      'Commitment to 4-5 session package',
      'Quiet environment for sessions',
      'Notebook for techniques',
      'Daily practice commitment'
    ],
    specialFeatures: [
      'Includes 4-5 personalized sessions',
      'Handouts and MP3 recordings',
      'WhatsApp support included',
      'Evidence-based breathing method',
      'Flexible Zoom or in-person format'
    ]
  },
  {
    id: 'dru-mental-wellness-course',
    title: 'Dru Mental Wellness Course',
    description: 'A 5 week Yoga course to improve one\'s feeling of wellbeing. Focusing on calming yoga flows, relaxation and better breathing.',
    longDescription: 'Nurture your mental and emotional wellbeing through this supportive 5-week yoga course. Each session focuses on calming yoga flows, deep relaxation techniques, and breathing practices specifically designed to improve your overall sense of wellbeing. You\'ll learn tools to manage stress, cultivate inner peace, and develop a sustainable practice for ongoing mental health support. Perfect for those feeling overwhelmed, burnt out, or simply seeking more balance and calm in daily life.',
    category: 'Yoga',
    price_zar: 600,
    price_wellcoins: 79,
    duration_minutes: 60,
    location: 'In-person',
    is_online: false,
    active: true,
    images: [
      IMAGES.sandy.teaching,
      IMAGES.wellness.meditation
    ],
    benefits: [
      'Improved sense of wellbeing',
      'Reduced stress and anxiety',
      'Better emotional regulation',
      'Enhanced relaxation skills',
      'Improved breathing patterns',
      'Tools for ongoing mental wellness'
    ],
    suitableFor: [
      'Anyone feeling stressed or overwhelmed',
      'Those experiencing burnout',
      'People seeking emotional balance',
      'Anyone wanting mental wellness tools',
      'Those new to mindfulness practices'
    ],
    requirements: [
      'Commitment to 5-week course',
      'Yoga mat',
      'Comfortable clothing',
      'Willingness to practice at home'
    ],
    specialFeatures: [
      'Structured 5-week programme',
      'Calming yoga flows',
      'Relaxation techniques',
      'Breathing practice focus',
      'Supportive group environment'
    ]
  },
  {
    id: 'free-discovery-call',
    title: 'Free Discovery Call',
    description: '15-min consult to understand your needs and see if we\'re a fit.',
    longDescription: 'Not sure where to start? Book a complimentary 15-minute discovery call to explore how Dru Yoga or Buteyko Breathing might support your wellness journey. This friendly, no-pressure conversation allows us to discuss your needs, answer questions, and determine which service would be the best fit for you. Whether you\'re curious about yoga, struggling with breathing issues, or seeking support for stress and anxiety, this call will help clarify the best path forward.',
    category: 'Life Coaching',
    price_zar: 0,
    price_wellcoins: 0,
    duration_minutes: 15,
    location: 'Zoom/Phone',
    is_online: true,
    active: true,
    images: [
      IMAGES.sandy.teaching,
      IMAGES.wellness.community
    ],
    benefits: [
      'No cost, no obligation',
      'Understand which service fits your needs',
      'Ask questions freely',
      'Get to know Sandy\'s approach',
      'Receive personalized recommendations',
      'Feel confident in your decision'
    ],
    suitableFor: [
      'Anyone curious about the services',
      'Those new to yoga or breathing work',
      'People unsure which service to choose',
      'Anyone with questions or concerns',
      'Those wanting to meet Sandy first'
    ],
    requirements: [
      'Phone or Zoom access',
      'Brief list of questions or goals',
      'Open communication'
    ],
    specialFeatures: [
      'Completely free',
      '15 minutes, no pressure',
      'Personalized recommendations',
      'Friendly, relaxed conversation',
      'Zoom or phone - your choice'
    ]
  },
  {
    id: 'monthly-workshop',
    title: 'Monthly Workshop',
    description: 'Themed sessions combining Dru Yoga & Buteyko with space for sharing, rest, and community. 90-120 minutes of deep restoration.',
    longDescription: 'Join our monthly themed workshops that weave together Dru Yoga and Buteyko Breathing in extended sessions designed to go deeper. Each workshop focuses on a specific theme - whether that\'s stress relief, back health, breathing for sleep, or seasonal wellness practices. These extended sessions (90-120 minutes) allow time for practice, learning, community connection, and deep rest. Price ranges from R250-R300 depending on the workshop.',
    category: 'Yoga',
    price_zar: 250,
    price_wellcoins: 33,
    duration_minutes: 90,
    location: 'In-person',
    is_online: false,
    active: true,
    images: [
      IMAGES.sandy.teaching,
      IMAGES.wellness.community
    ],
    benefits: [
      'Extended deep practice time',
      'Themed wellness focus',
      'Community connection',
      'Integrated yoga & breathing work',
      'Space for sharing and rest',
      'Monthly wellness ritual'
    ],
    suitableFor: [
      'Anyone wanting deeper practice',
      'Those seeking community connection',
      'People who enjoy themed workshops',
      'Anyone wanting monthly wellness time',
      'Those interested in both yoga and breathing'
    ],
    requirements: [
      'Yoga mat',
      'Comfortable clothing',
      'Water bottle',
      'Open to group sharing'
    ],
    specialFeatures: [
      'Monthly themed sessions',
      'Extended 90-120 minute format',
      'Combines Dru Yoga & Buteyko',
      'Community sharing circles',
      'Deep rest and integration time'
    ]
  }
];

// Monthly packages and special offerings
export const sandyPackages = [
  {
    id: 'monthly-unlimited',
    title: 'Monthly Unlimited Yoga Package',
    description: 'Unlimited access to all group classes and 1 private session per month',
    price_zar: 1890,
    price_wellcoins: 248,
    includes: [
      'Unlimited small group classes',
      '1 private session monthly',
      'Online class access',
      'Workshop discounts',
      'Wellness resources library'
    ],
    savings: 'Save 25% compared to individual sessions'
  },
  {
    id: 'beginner-journey',
    title: 'Beginner\'s Yoga Journey (8 weeks)',
    description: 'Complete beginner programme with progressive learning and support',
    price_zar: 2200,
    price_wellcoins: 288,
    includes: [
      '8 progressive yoga sessions',
      'Healthy Back Programme',
      'Breathing technique training',
      'Wellness consultation',
      'Practice resources and materials'
    ],
    savings: 'Complete starter package with ongoing support'
  }
];

export default {
  profile: sandyProviderProfile,
  services: sandyServices,
  packages: sandyPackages
};