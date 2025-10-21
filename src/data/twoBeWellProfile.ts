// 2BeWell - Wellness Products Provider Profile
import { ProviderDirectory } from '@/types/provider';
import { IMAGES } from '@/lib/images';

export const twoBeWellProfile: ProviderDirectory = {
  profile: {
    id: '2bewell-wellness-products',
    business_name: '2BeWell - Curated Wellness Products',
    description: `Premium wellness product curator specializing in natural, sustainable, and ethically-sourced health and wellness products. From organic skincare to mindful lifestyle accessories, we carefully select products that support your journey to complete wellbeing while respecting our planet and communities.`,
    category: 'Wellness Products',
    location: 'Cape Town, South Africa (Worldwide shipping)',
    phone: '+27 21 XXX XXXX',
    email: 'hello@2bewell.co.za',
    website: 'https://2bewell.co.za',
    specialties: [
      'Organic Skincare & Beauty',
      'Natural Health Supplements',
      'Eco-Friendly Lifestyle Products',
      'Mindful Living Accessories',
      'Sustainable Wellness Gear',
      'Aromatherapy & Essential Oils',
      'Meditation & Mindfulness Tools',
      'Ethical Fashion & Accessories'
    ],
    certifications: [
      'Organic Product Certification',
      'Ethical Trade Certified',
      'Sustainable Business Practices',
      'Natural Product Quality Assurance',
      'Fair Trade Partner'
    ],
    years_experience: 8,
    verified: true,
    wellcoin_balance: 4500,
    profile_image_url: IMAGES.twoBeWell.logo,
    cover_image: IMAGES.wellness.wellness,
    philosophy: "True wellness extends beyond the individual to encompass our communities and planet. We believe in products that nurture personal health while supporting ethical practices and environmental sustainability.",
    social_media: {
      instagram: '@2bewellcapetown',
      facebook: '2BeWell Wellness Products',
      twitter: '@2bewellness'
    },
    rating: 4.7,
    total_clients: 1250,
    languages: ['English', 'Afrikaans'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: '09:00 - 17:00 (SAST) - Online store 24/7'
    },
    featured: true,
    badges: ['Organic Certified', 'Ethical Trade', 'Sustainable Products', 'Community Focused']
  },
  services: [
    {
      id: 'personalized-wellness-consultation',
      title: 'Personalized Wellness Product Consultation',
      description: 'One-on-one consultation to create a customized wellness product selection tailored to your health goals and lifestyle.',
      longDescription: 'Discover the perfect wellness products for your unique needs through this comprehensive consultation. We\'ll assess your health goals, lifestyle preferences, skin type, dietary needs, and ethical values to curate a personalized selection of products that truly support your wellness journey.',
      category: 'Health Coaching',
      price_zar: 350,
      price_wellcoins: 46,
      duration_minutes: 60,
      location: 'Cape Town / Online',
      is_online: true,
      active: true,
      images: [
        IMAGES.sandy.teaching,
        IMAGES.twoBeWell.product1
      ],
      benefits: [
        'Personalized product recommendations',
        'Cost-effective wellness shopping',
        'Expert guidance on natural products',
        'Customized wellness routine',
        'Ethical and sustainable choices',
        'Ongoing product support'
      ],
      suitableFor: [
        'New to natural wellness products',
        'Seeking personalized recommendations',
        'Want to optimize product choices',
        'Interested in ethical consumerism',
        'Looking to simplify wellness routine'
      ],
      requirements: [
        'Health goals and concerns information',
        'Current product usage details',
        'Budget considerations',
        'Ethical and sustainability preferences',
        'Lifestyle and routine information'
      ],
      specialFeatures: [
        'Personalized product curation',
        'Ongoing product support',
        'Ethical sourcing information',
        'Usage guides and instructions',
        'Follow-up recommendations'
      ]
    },
    {
      id: 'organic-skincare-starter-kit',
      title: 'Organic Skincare Starter Kit & Consultation',
      description: 'Complete organic skincare starter kit with personalized consultation on natural skincare routines and product selection.',
      longDescription: 'Transform your skincare routine with this comprehensive starter kit featuring carefully selected organic products. Includes consultation to determine your skin type, concerns, and goals, plus a curated selection of cleansers, moisturizers, and treatments perfect for your needs.',
      category: 'Wellness Products',
      price_zar: 1200,
      price_wellcoins: 156,
      duration_minutes: 45,
      location: 'Cape Town / Online + Shipping',
      is_online: true,
      active: true,
      images: [
        IMAGES.twoBeWell.faceSerum,
        IMAGES.twoBeWell.lipBalm
      ],
      benefits: [
        'Complete organic skincare routine',
        'Personalized product selection',
        'Chemical-free natural ingredients',
        'Professional skincare guidance',
        'Sustainable and ethical products',
        'Improved skin health naturally'
      ],
      suitableFor: [
        'Transitioning to natural skincare',
        'Sensitive or problematic skin',
        'Environmental and health conscious',
        'New to organic beauty products',
        'Seeking professional guidance'
      ],
      requirements: [
        'Skin type and concerns assessment',
        'Current skincare routine information',
        'Ingredient sensitivity details',
        'Skincare goals and expectations',
        'Budget and product preferences'
      ],
      specialFeatures: [
        '4-6 full-size organic products',
        'Personalized skincare consultation',
        'Usage instructions and routine guide',
        'Follow-up support and adjustments',
        'Sustainable packaging and sourcing'
      ]
    },
    {
      id: 'mindful-living-essentials',
      title: 'Mindful Living Essentials Package',
      description: 'Curated collection of mindful living products including meditation accessories, aromatherapy, and sustainable lifestyle items.',
      longDescription: 'Create a mindful living space with this thoughtfully curated package of essential products. Includes meditation cushions, essential oils, sustainable home accessories, and mindfulness tools to support your journey toward conscious living and inner peace.',
      category: 'Wellness Products',
      price_zar: 850,
      price_wellcoins: 111,
      duration_minutes: 30,
      location: 'Cape Town / Online + Shipping',
      is_online: true,
      active: true,
      images: [
        IMAGES.sandy.meditation,
        IMAGES.sandy.yoga
      ],
      benefits: [
        'Complete mindful living setup',
        'High-quality meditation accessories',
        'Aromatherapy for relaxation',
        'Sustainable lifestyle products',
        'Enhanced mindfulness practice',
        'Beautiful and functional design'
      ],
      suitableFor: [
        'Starting a mindfulness practice',
        'Creating a meditation space',
        'Seeking sustainable lifestyle products',
        'Interested in aromatherapy',
        'Wanting to live more consciously'
      ],
      requirements: [
        'Space for mindfulness practice',
        'Interest in meditation and mindfulness',
        'Preference for sustainable products',
        'Basic understanding of aromatherapy',
        'Commitment to mindful living practices'
      ],
      specialFeatures: [
        'Premium meditation accessories',
        'Organic essential oil collection',
        'Sustainable and eco-friendly products',
        'Beautiful gift packaging',
        'Mindfulness practice guide included'
      ]
    },
    {
      id: 'natural-health-supplement-guide',
      title: 'Natural Health Supplement Consultation & Selection',
      description: 'Comprehensive consultation and personalized selection of natural health supplements based on your specific health needs and goals.',
      longDescription: 'Navigate the world of natural health supplements with expert guidance. This service includes a detailed health assessment, personalized supplement recommendations, and ongoing support to optimize your natural health routine safely and effectively.',
      category: 'Health Coaching',
      price_zar: 650,
      price_wellcoins: 85,
      duration_minutes: 75,
      location: 'Cape Town / Online',
      is_online: true,
      active: true,
      images: [
        IMAGES.twoBeWell.bodyButter,
        IMAGES.sandy.teaching
      ],
      benefits: [
        'Personalized supplement recommendations',
        'Professional health guidance',
        'Quality natural products',
        'Optimized health routine',
        'Safe supplement practices',
        'Ongoing health support'
      ],
      suitableFor: [
        'New to natural health supplements',
        'Specific health goals or concerns',
        'Seeking professional supplement guidance',
        'Want to optimize current routine',
        'Interested in preventive health'
      ],
      requirements: [
        'Detailed health history',
        'Current medications and supplements',
        'Specific health goals',
        'Lifestyle and dietary information',
        'Budget for recommended supplements'
      ],
      specialFeatures: [
        'Comprehensive health assessment',
        'Personalized supplement plan',
        'Quality product recommendations',
        'Interaction and safety guidance',
        'Follow-up progress monitoring'
      ]
    },
    {
      id: 'sustainable-wellness-lifestyle-kit',
      title: 'Sustainable Wellness Lifestyle Kit',
      description: 'Eco-friendly wellness lifestyle package featuring sustainable products for health, beauty, and mindful living.',
      longDescription: 'Embrace sustainable wellness with this comprehensive lifestyle kit featuring eco-friendly products that support both personal health and environmental responsibility. Includes reusable wellness accessories, organic personal care items, and mindful living tools.',
      category: 'Wellness Products',
      price_zar: 950,
      price_wellcoins: 124,
      duration_minutes: 30,
      location: 'Cape Town / Online + Shipping',
      is_online: true,
      active: true,
      images: [
        IMAGES.wellness.wellness,
        IMAGES.twoBeWell.product2
      ],
      benefits: [
        'Complete sustainable wellness setup',
        'Environmentally responsible choices',
        'High-quality eco-friendly products',
        'Reduced environmental impact',
        'Support for ethical businesses',
        'Long-lasting durable products'
      ],
      suitableFor: [
        'Environmentally conscious individuals',
        'Starting a sustainable lifestyle',
        'Reducing plastic and waste',
        'Supporting ethical businesses',
        'Seeking quality eco-products'
      ],
      requirements: [
        'Commitment to sustainable practices',
        'Interest in eco-friendly products',
        'Willingness to change consumption habits',
        'Basic understanding of sustainability',
        'Support for environmental causes'
      ],
      specialFeatures: [
        'Carefully curated eco-products',
        'Plastic-free packaging',
        'Ethically sourced materials',
        'Sustainability impact information',
        'Supporting local eco-businesses'
      ]
    }
  ],
  packages: [
    {
      id: 'complete-wellness-transformation',
      title: 'Complete Wellness Product Transformation',
      description: '3-month comprehensive wellness product program with consultation and ongoing support',
      price_zar: 4500,
      price_wellcoins: 585,
      includes: [
        'Initial wellness consultation',
        'Personalized skincare starter kit',
        'Mindful living essentials package',
        'Natural health supplement consultation',
        'Monthly product recommendations',
        'Ongoing support and adjustments',
        'Sustainable lifestyle transition guide'
      ],
      savings: 'Complete wellness transformation with 25% savings',
      duration: '3 months'
    },
    {
      id: 'monthly-wellness-box',
      title: 'Monthly Curated Wellness Box',
      description: 'Monthly subscription featuring 4-6 carefully selected wellness products with guidance',
      price_zar: 750,
      price_wellcoins: 98,
      includes: [
        '4-6 premium wellness products monthly',
        'Product information and usage guides',
        'Seasonal wellness tips',
        'Exclusive member discounts',
        'Access to product consultations',
        'Sustainable packaging and shipping'
      ],
      savings: 'Ongoing wellness discovery with member benefits',
      duration: '1 month (renewable)'
    }
  ]
};

export default twoBeWellProfile;