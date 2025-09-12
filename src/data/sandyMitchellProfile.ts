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
  description: `Certified Dru Yoga Instructor and Buteyko Breathing Facilitator offering personalized, gentle yoga classes in Cape Town. Specializing in the Healthy Back Programme and adaptive yoga for all bodies. My approach combines traditional Hatha yoga with Energy Block Release sequences, emphasizing breath work and flowing movements.`,
  location: 'Cape Town, South Africa (Observatory, Muizenberg, Stonehurst)',
  phone: '+27 21 XXX XXXX',
  email: 'sandy@druyogacapetown.co.za',
  website: 'https://druyogacapetown.co.za/',
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
    id: 'dru-yoga-private-session',
    title: 'Private Dru Yoga Session',
    description: 'Personalized one-on-one Dru Yoga session tailored to your individual needs, abilities, and wellness goals.',
    longDescription: 'Experience the transformative power of Dru Yoga in a completely personalized setting. This private session is designed specifically for your body, your needs, and your wellness journey. We\'ll work together to create a practice that honors where you are today while gently guiding you toward your goals. Perfect for beginners, those with specific physical considerations, or anyone wanting dedicated attention.',
    category: 'Yoga',
    price_zar: 650,
    price_wellcoins: 85,
    duration_minutes: 75,
    location: 'Observatory, Cape Town',
    is_online: true,
    active: true,
    images: [
      IMAGES.sandy.teaching,
      IMAGES.sandy.yoga
    ],
    benefits: [
      'Personalized instruction and modifications',
      'Focus on your specific needs and goals',
      'Gentle movements suitable for all bodies',
      'Stress reduction and deep relaxation',
      'Improved flexibility and strength',
      'Better posture and back health'
    ],
    suitableFor: [
      'Complete beginners',
      'Those with back issues or physical limitations',
      'People recovering from injury',
      'Anyone wanting personalized attention',
      'Seniors and mature adults',
      'Pregnant women (with modifications)'
    ],
    requirements: [
      'Comfortable clothing for movement',
      'Yoga mat (can be provided)',
      'Water bottle',
      'Open mind and willingness to try'
    ],
    specialFeatures: [
      'Energy Block Release sequences',
      'Functional breathing techniques',
      'Soft joint movements',
      'Adaptive modifications',
      'Relaxation and meditation'
    ]
  },
  {
    id: 'healthy-back-programme',
    title: 'Healthy Back Programme (4-Week Course)',
    description: 'Specialized 4-week programme focused on back health, combining Dru Yoga movements with therapeutic techniques.',
    longDescription: 'Transform your relationship with back pain through this evidence-based 4-week programme. Combining the gentle movements of Dru Yoga with specialized therapeutic techniques, this course addresses the root causes of back discomfort while building strength, flexibility, and awareness. Each session builds progressively, giving you tools you can use for life.',
    category: 'Yoga',
    price_zar: 1800,
    price_wellcoins: 240,
    duration_minutes: 60,
    location: 'Observatory, Cape Town',
    is_online: true,
    active: true,
    images: [
      IMAGES.sandy.yoga,
      IMAGES.wellness.yoga
    ],
    benefits: [
      'Reduced back pain and tension',
      'Improved spinal mobility',
      'Better posture awareness',
      'Strengthened core muscles',
      'Stress relief and relaxation',
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
      'Commitment to attend all 4 sessions',
      'Comfortable clothing',
      'Yoga mat',
      'Journal for tracking progress'
    ],
    specialFeatures: [
      'Progressive 4-week structure',
      'Take-home exercises',
      'Posture assessment',
      'Breathing techniques for pain relief',
      'Lifetime access to resources'
    ]
  },
  {
    id: 'buteyko-breathing-session',
    title: 'Buteyko Breathing Method Session',
    description: 'Learn the scientifically-proven Buteyko Breathing Method to improve your respiratory health and overall wellbeing.',
    longDescription: 'Discover the power of proper breathing with the Buteyko Method, a scientifically-validated approach that can transform your health. This session teaches you how to optimize your breathing patterns, reduce anxiety, improve sleep, and enhance your overall vitality. Perfect for those with breathing difficulties, anxiety, or anyone wanting to optimize their respiratory health.',
    category: 'Meditation',
    price_zar: 550,
    price_wellcoins: 72,
    duration_minutes: 90,
    location: 'Observatory, Cape Town',
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
      'Reduced asthma symptoms',
      'Increased energy levels'
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
      'Comfortable seated position',
      'Quiet environment',
      'Notebook for techniques',
      'Commitment to daily practice'
    ],
    specialFeatures: [
      'Evidence-based breathing method',
      'Personalized breathing assessment',
      'Daily practice routine',
      'Follow-up support materials',
      'Progress tracking techniques'
    ]
  },
  {
    id: 'dru-yoga-small-group',
    title: 'Small Group Dru Yoga Class',
    description: 'Intimate group yoga class limited to 6 people, ensuring personal attention while enjoying community energy.',
    longDescription: 'Experience the best of both worlds - personalized attention in a supportive group setting. These small classes create a warm, inclusive environment where everyone feels welcome and supported. With a maximum of 6 participants, I can offer modifications and adjustments while you enjoy the energy and encouragement of practicing with others.',
    category: 'Yoga',
    price_zar: 280,
    price_wellcoins: 37,
    duration_minutes: 75,
    location: 'Observatory, Cape Town',
    is_online: false,
    active: true,
    images: [
      IMAGES.sandy.teaching,
      IMAGES.wellness.community
    ],
    benefits: [
      'Community connection and support',
      'Personal attention and modifications',
      'Motivation from group energy',
      'Cost-effective compared to private sessions',
      'Regular practice routine',
      'Social wellness aspect'
    ],
    suitableFor: [
      'Beginners to intermediate practitioners',
      'Those wanting community connection',
      'People comfortable in small groups',
      'Anyone seeking regular practice',
      'Those on a wellness budget'
    ],
    requirements: [
      'Yoga mat',
      'Comfortable clothes',
      'Water bottle',
      'Regular attendance commitment'
    ],
    specialFeatures: [
      'Maximum 6 participants',
      'Individual modifications offered',
      'Seasonal themes and variations',
      'Community building activities',
      'Progressive skill development'
    ]
  },
  {
    id: 'online-dru-yoga',
    title: 'Online Dru Yoga Session',
    description: 'Connect from anywhere in the world for a live, interactive Dru Yoga session via video call.',
    longDescription: 'Bring the benefits of Dru Yoga to your own space with these live, interactive online sessions. Perfect for those who can\'t travel to Cape Town, have mobility constraints, or simply prefer practicing at home. You\'ll receive the same quality instruction and personal attention as in-person sessions.',
    category: 'Yoga',
    price_zar: 380,
    price_wellcoins: 50,
    duration_minutes: 60,
    location: 'Online (Worldwide)',
    is_online: true,
    active: true,
    images: [
      IMAGES.sandy.yoga,
      IMAGES.wellness.meditation
    ],
    benefits: [
      'Practice from home comfort',
      'No travel time required',
      'Global accessibility',
      'Flexible scheduling',
      'Same quality instruction',
      'Recorded session available'
    ],
    suitableFor: [
      'Anyone with reliable internet',
      'Those preferring home practice',
      'International students',
      'People with mobility constraints',
      'Busy professionals',
      'Parents with young children'
    ],
    requirements: [
      'Stable internet connection',
      'Computer/tablet with camera',
      'Quiet space for practice',
      'Yoga mat',
      'Good lighting'
    ],
    specialFeatures: [
      'Live interactive instruction',
      'Real-time modifications',
      'Recording available for 48 hours',
      'Chat support during session',
      'Technical setup assistance'
    ]
  },
  {
    id: 'wellness-consultation',
    title: 'Holistic Wellness Consultation',
    description: 'Comprehensive wellness consultation to create your personalized yoga and breathing practice plan.',
    longDescription: 'Begin your wellness journey with a thorough consultation that considers your whole being - physical, mental, and emotional. We\'ll discuss your health history, goals, lifestyle, and create a personalized plan incorporating yoga, breathing techniques, and lifestyle recommendations. This session sets the foundation for all future work together.',
    category: 'Life Coaching',
    price_zar: 450,
    price_wellcoins: 59,
    duration_minutes: 60,
    location: 'Observatory, Cape Town',
    is_online: true,
    active: true,
    images: [
      IMAGES.sandy.teaching,
      IMAGES.wellness.marketplace
    ],
    benefits: [
      'Personalized wellness strategy',
      'Clear understanding of your needs',
      'Integrated approach to health',
      'Goal setting and planning',
      'Resource recommendations',
      'Ongoing support structure'
    ],
    suitableFor: [
      'New clients starting their wellness journey',
      'Those with complex health considerations',
      'Anyone wanting a holistic approach',
      'People unsure where to start',
      'Those with specific goals'
    ],
    requirements: [
      'Health history information',
      'List of current concerns/goals',
      'Open communication',
      'Commitment to recommendations'
    ],
    specialFeatures: [
      'Comprehensive intake assessment',
      'Personalized practice plan',
      'Resource recommendations',
      'Follow-up support included',
      'Integration with other practitioners'
    ]
  },
  {
    id: 'energy-healing-session',
    title: 'Energy Block Release Session',
    description: 'Specialized session focusing on Energy Block Release sequences to clear energetic blockages and restore balance.',
    longDescription: 'Experience the unique aspect of Dru Yoga through focused Energy Block Release work. These sessions use specific movements and breathing techniques to identify and release energetic blockages in the body, promoting deep healing and emotional release. A gentle yet powerful approach to holistic wellness.',
    category: 'Energy Healing',
    price_zar: 580,
    price_wellcoins: 76,
    duration_minutes: 90,
    location: 'Observatory, Cape Town',
    is_online: true,
    active: true,
    images: [
      IMAGES.sandy.meditation,
      IMAGES.wellness.meditation
    ],
    benefits: [
      'Release of energetic blockages',
      'Emotional healing and balance',
      'Improved energy flow',
      'Deep relaxation and peace',
      'Enhanced intuition',
      'Stress and trauma release'
    ],
    suitableFor: [
      'Those feeling emotionally stuck',
      'People with chronic stress',
      'Anyone seeking deep healing',
      'Those interested in energy work',
      'People processing life transitions'
    ],
    requirements: [
      'Open mind to energy work',
      'Comfortable loose clothing',
      'Willingness to experience emotions',
      'Quiet, private space'
    ],
    specialFeatures: [
      'Unique Dru Yoga energy work',
      'Gentle trauma-informed approach',
      'Integration techniques',
      'Emotional support provided',
      'Follow-up recommendations'
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