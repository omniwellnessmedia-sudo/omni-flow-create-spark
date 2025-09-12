// Chief Kingsley - Traditional Cultural Guide Profile
import { ProviderDirectory } from '@/types/provider';
import { IMAGES, getImageWithFallback } from '@/constants/images';

export const chiefKingsleyProfile: ProviderDirectory = {
  profile: {
    id: 'chief-kingsley-cultural-guide',
    business_name: 'Chief Kingsley - Traditional Cultural Experiences',
    description: `Authentic traditional cultural guide and storyteller offering immersive experiences in South African heritage, traditional healing practices, and ancestral wisdom. With deep roots in Xhosa traditions and over 25 years of sharing cultural knowledge, I create meaningful connections between modern wellness and ancestral practices.`,
    category: 'Traditional & Cultural',
    location: 'Eastern Cape & Cape Town, South Africa',
    phone: '+27 84 XXX XXXX',
    email: 'chief.kingsley@culturalwellness.co.za',
    website: 'https://traditionalwellnesssa.co.za',
    specialties: [
      'Traditional Healing Practices',
      'Ancestral Wisdom Teachings',
      'Cultural Immersion Experiences',
      'Sacred Plant Medicine Education',
      'Storytelling and Oral Traditions',
      'Drumming and Sacred Music',
      'Traditional Ceremonies',
      'Cultural Wellness Integration'
    ],
    certifications: [
      'Recognized Traditional Healer (Sangoma)',
      'Cultural Heritage Guide Certification',
      'Traditional Medicine Practitioner',
      'Sacred Rituals and Ceremonies Leader',
      'Community Elder Recognition'
    ],
    years_experience: 25,
    verified: true,
    wellcoin_balance: 1850,
    profile_image_url: getImageWithFallback('/lovable-uploads/chief-kingsley-profile.jpg'),
    cover_image: getImageWithFallback('/lovable-uploads/traditional-ceremony-cover.jpg'),
    philosophy: "The wisdom of our ancestors flows through us like a river. My role is to help people reconnect with this ancient knowledge and find healing through traditional practices that have sustained our people for generations.",
    social_media: {
      facebook: 'Chief Kingsley Traditional Wellness',
      instagram: '@traditionalwellnesssa',
      youtube: 'African Traditional Healing'
    },
    rating: 4.9,
    total_clients: 340,
    languages: ['English', 'Xhosa', 'Afrikaans', 'Zulu'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: '08:00 - 18:00 (SAST) - Flexible for ceremonies'
    },
    featured: true,
    badges: ['Traditional Healer', 'Cultural Keeper', 'Ancestral Wisdom Guide', 'Sacred Ceremonies']
  },
  services: [
    {
      id: 'traditional-healing-consultation',
      title: 'Traditional Healing Consultation',
      description: 'Personal consultation combining traditional diagnostic methods with ancestral wisdom to address physical, emotional, and spiritual imbalances.',
      longDescription: 'Experience authentic traditional healing through time-honored methods passed down through generations. This consultation includes traditional diagnostic techniques, herbal medicine guidance, and spiritual healing practices. Each session is tailored to your individual needs while respecting both traditional protocols and modern sensitivities.',
      category: 'Traditional Healing',
      price_zar: 450,
      price_wellcoins: 59,
      duration_minutes: 90,
      location: 'Cape Town / Eastern Cape',
      is_online: false,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/traditional-healing.jpg'),
        getImageWithFallback('/lovable-uploads/healing-herbs.jpg')
      ],
      benefits: [
        'Holistic approach to health and wellness',
        'Connection to ancestral healing wisdom',
        'Natural herbal medicine guidance',
        'Spiritual and emotional balance',
        'Cultural understanding and respect',
        'Traditional diagnostic insights'
      ],
      suitableFor: [
        'Those seeking alternative healing approaches',
        'People interested in traditional medicine',
        'Individuals with chronic health challenges',
        'Anyone wanting spiritual guidance',
        'People exploring cultural healing methods'
      ],
      requirements: [
        'Respect for traditional practices',
        'Open mind to spiritual concepts',
        'Willingness to follow traditional protocols',
        'Health history information',
        'Comfortable clothing'
      ],
      specialFeatures: [
        'Authentic traditional methods',
        'Personalized herbal recommendations',
        'Spiritual cleansing rituals',
        'Ancestral connection guidance',
        'Follow-up support and advice'
      ]
    },
    {
      id: 'cultural-immersion-experience',
      title: 'Full Day Cultural Immersion Experience',
      description: 'Immersive journey into traditional South African culture, including ceremonies, storytelling, traditional foods, and ancestral practices.',
      longDescription: 'Step into the rich tapestry of South African traditional culture through this comprehensive immersion experience. Learn about ancestral practices, participate in traditional ceremonies, enjoy authentic cultural foods, and gain deep understanding of how traditional wisdom applies to modern wellness. Perfect for individuals, families, or small groups.',
      category: 'Cultural Tours',
      price_zar: 1200,
      price_wellcoins: 156,
      duration_minutes: 480,
      location: 'Eastern Cape Cultural Village',
      is_online: false,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/cultural-immersion.jpg'),
        getImageWithFallback('/lovable-uploads/traditional-village.jpg')
      ],
      benefits: [
        'Deep cultural understanding and appreciation',
        'Authentic traditional experiences',
        'Connection to South African heritage',
        'Spiritual and emotional enrichment',
        'Educational and transformative',
        'Community connection and relationships'
      ],
      suitableFor: [
        'Cultural enthusiasts and learners',
        'Tourists seeking authentic experiences',
        'Families wanting cultural education',
        'Spiritual seekers and wellness travelers',
        'Anyone interested in African heritage'
      ],
      requirements: [
        'Respectful attitude toward traditions',
        'Comfortable walking shoes',
        'Sun protection and hat',
        'Open mind and willingness to participate',
        'Basic fitness for cultural activities'
      ],
      specialFeatures: [
        'Traditional ceremony participation',
        'Authentic cultural meals included',
        'Storytelling and oral history',
        'Traditional craft demonstrations',
        'Cultural artifact explanations'
      ]
    },
    {
      id: 'ancestral-wisdom-workshop',
      title: 'Ancestral Wisdom and Modern Wellness Workshop',
      description: 'Educational workshop exploring how traditional ancestral wisdom can be integrated into modern wellness practices.',
      longDescription: 'Bridge ancient wisdom with contemporary wellness in this enlightening workshop. Learn how traditional practices can enhance modern health approaches, explore the spiritual dimensions of wellness, and discover practical ways to honor ancestral knowledge in daily life. Includes meditation, storytelling, and practical applications.',
      category: 'Traditional Healing',
      price_zar: 650,
      price_wellcoins: 85,
      duration_minutes: 150,
      location: 'Cape Town / Eastern Cape',
      is_online: false,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/ancestral-wisdom.jpg'),
        getImageWithFallback('/lovable-uploads/traditional-teachings.jpg')
      ],
      benefits: [
        'Integration of traditional and modern wellness',
        'Deeper spiritual connection',
        'Practical ancestral wisdom applications',
        'Enhanced cultural understanding',
        'Personal transformation and growth',
        'Community and belonging sense'
      ],
      suitableFor: [
        'Wellness practitioners and coaches',
        'Spiritual seekers and learners',
        'Health professionals',
        'Anyone interested in holistic wellness',
        'People exploring their heritage'
      ],
      requirements: [
        'Interest in traditional wisdom',
        'Notebook for learning notes',
        'Open and respectful attitude',
        'Willingness to participate in discussions',
        'Basic understanding of wellness concepts'
      ],
      specialFeatures: [
        'Traditional meditation techniques',
        'Ancestral storytelling sessions',
        'Practical integration strategies',
        'Cultural ceremony participation',
        'Take-home wisdom practices'
      ]
    },
    {
      id: 'sacred-plant-medicine-education',
      title: 'Sacred Plant Medicine Education Session',
      description: 'Educational session about traditional South African medicinal plants, their uses, preparation methods, and spiritual significance.',
      longDescription: 'Discover the profound knowledge of traditional medicinal plants used for centuries in South African healing practices. This educational session covers identification, preparation methods, spiritual significance, and safe usage of traditional plant medicines. Strictly educational and cultural - no consumption involved.',
      category: 'Traditional Healing',
      price_zar: 550,
      price_wellcoins: 72,
      duration_minutes: 120,
      location: 'Cape Town / Eastern Cape',
      is_online: false,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/medicinal-plants.jpg'),
        getImageWithFallback('/lovable-uploads/plant-medicine.jpg')
      ],
      benefits: [
        'Deep knowledge of traditional medicine',
        'Understanding of plant healing properties',
        'Cultural and spiritual insights',
        'Safe usage education',
        'Connection to natural healing',
        'Respect for traditional knowledge'
      ],
      suitableFor: [
        'Herbalists and natural health practitioners',
        'Students of traditional medicine',
        'Healthcare professionals',
        'Botanical enthusiasts',
        'Cultural learners and researchers'
      ],
      requirements: [
        'Serious interest in plant medicine',
        'Respectful approach to sacred knowledge',
        'Note-taking materials',
        'Understanding this is educational only',
        'Commitment to ethical plant use'
      ],
      specialFeatures: [
        'Traditional plant identification',
        'Preparation method demonstrations',
        'Spiritual significance teachings',
        'Cultural context and history',
        'Sustainable harvesting education'
      ]
    },
    {
      id: 'drumming-sacred-music',
      title: 'Traditional Drumming and Sacred Music Session',
      description: 'Interactive session learning traditional South African drumming patterns, sacred songs, and their healing and ceremonial uses.',
      longDescription: 'Connect with the heartbeat of African tradition through drumming and sacred music. Learn traditional rhythms, understand their ceremonial significance, and experience the healing power of communal music-making. This interactive session includes hands-on drumming, singing, and movement in traditional styles.',
      category: 'Traditional Healing',
      price_zar: 380,
      price_wellcoins: 49,
      duration_minutes: 120,
      location: 'Cape Town / Eastern Cape',
      is_online: false,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/traditional-drumming.jpg'),
        getImageWithFallback('/lovable-uploads/sacred-music.jpg')
      ],
      benefits: [
        'Stress relief through rhythmic expression',
        'Connection to African musical traditions',
        'Community bonding and healing',
        'Physical and emotional release',
        'Cultural appreciation and learning',
        'Spiritual connection through music'
      ],
      suitableFor: [
        'Music enthusiasts and learners',
        'Stress relief and wellness seekers',
        'Cultural education participants',
        'Community groups and families',
        'Anyone interested in African traditions'
      ],
      requirements: [
        'No musical experience necessary',
        'Comfortable clothing for movement',
        'Open attitude toward participation',
        'Respect for traditional music',
        'Willingness to sing and drum'
      ],
      specialFeatures: [
        'Traditional instruments provided',
        'Hands-on learning approach',
        'Cultural context and meaning',
        'Group participation and community',
        'Healing through music principles'
      ]
    }
  ],
  packages: [
    {
      id: 'cultural-healing-journey',
      title: 'Complete Cultural Healing Journey',
      description: '7-day intensive cultural immersion and traditional healing experience',
      price_zar: 8500,
      price_wellcoins: 1105,
      includes: [
        'Traditional healing consultation',
        'Full cultural immersion experience',
        'Ancestral wisdom workshops',
        'Sacred plant medicine education',
        'Traditional ceremony participation',
        'Daily drumming and music sessions',
        'Cultural meals and accommodation'
      ],
      savings: 'Complete transformation package with 30% savings',
      duration: '7 days'
    },
    {
      id: 'monthly-traditional-wellness',
      title: 'Monthly Traditional Wellness Program',
      description: 'Ongoing monthly program combining traditional healing with cultural education',
      price_zar: 1800,
      price_wellcoins: 234,
      includes: [
        '2 traditional healing consultations',
        '1 ancestral wisdom workshop',
        '1 drumming and music session',
        'Herbal medicine guidance',
        'Cultural calendar and ceremonies access',
        'Community support group access'
      ],
      savings: 'Regular traditional wellness support with 20% savings',
      duration: '1 month'
    }
  ]
};

export default chiefKingsleyProfile;