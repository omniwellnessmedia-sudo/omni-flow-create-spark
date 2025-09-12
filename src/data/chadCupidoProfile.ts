// Chad Cupido - Business Developer Profile
import { ProviderDirectory } from '@/types/provider';
import { IMAGES, getImageWithFallback } from '@/constants/images';

export const chadCupidoProfile: ProviderDirectory = {
  profile: {
    id: 'chad-cupido-business',
    business_name: 'Chad Cupido - Strategic Business Development',
    description: `Experienced business developer and strategic consultant specializing in startup growth, digital transformation, and sustainable business practices. With over 12 years in the industry, I help wellness entrepreneurs and traditional businesses scale effectively while maintaining their core values and mission.`,
    category: 'Business Development',
    location: 'Cape Town, South Africa (Remote services available)',
    phone: '+27 82 XXX XXXX',
    email: 'chad@omniwellness.co.za',
    website: 'https://chadbusinessdev.co.za',
    specialties: [
      'Startup Strategy & Scaling',
      'Digital Transformation',
      'Wellness Business Development',
      'Market Research & Analysis',
      'Strategic Partnerships',
      'Investment Readiness',
      'Sustainable Business Practices',
      'Team Building & Leadership'
    ],
    certifications: [
      'Certified Business Development Professional',
      'Digital Marketing Strategy Certificate',
      'Lean Startup Methodology',
      'Agile Project Management (Scrum Master)',
      'Sustainable Business Practices Certificate'
    ],
    years_experience: 12,
    verified: true,
    wellcoin_balance: 3200,
    profile_image_url: getImageWithFallback('/lovable-uploads/chad-cupido-profile.jpg'),
    cover_image: getImageWithFallback('/lovable-uploads/business-development-cover.jpg'),
    philosophy: "Every business has the potential to create positive impact. My role is to unlock that potential through strategic thinking, sustainable practices, and human-centered development approaches.",
    social_media: {
      linkedin: 'Chad Cupido Business Development',
      twitter: '@chadcupidodev',
      instagram: '@chadbusinessgrowth'
    },
    rating: 4.8,
    total_clients: 89,
    languages: ['English', 'Afrikaans', 'Basic Xhosa'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: '09:00 - 17:00 (SAST)'
    },
    featured: true,
    badges: ['Top Business Developer', 'Wellness Industry Specialist', 'Startup Mentor']
  },
  services: [
    {
      id: 'business-strategy-consultation',
      title: 'Strategic Business Development Consultation',
      description: 'Comprehensive business strategy session to identify growth opportunities and create actionable development plans.',
      longDescription: 'Transform your business vision into a concrete growth strategy. This in-depth consultation covers market analysis, competitive positioning, revenue optimization, and sustainable scaling strategies. Perfect for wellness entrepreneurs, existing businesses looking to expand, or anyone wanting to validate their business concept.',
      category: 'Business Consulting',
      price_zar: 2500,
      price_wellcoins: 325,
      duration_minutes: 120,
      location: 'Cape Town / Remote',
      is_online: true,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/business-consultation.jpg'),
        getImageWithFallback(IMAGES.GENERAL.OFFICE_PROFESSIONAL)
      ],
      benefits: [
        'Clear business growth roadmap',
        'Market opportunity identification',
        'Competitive advantage strategies',
        'Revenue optimization plans',
        'Risk assessment and mitigation',
        'Resource allocation guidance'
      ],
      suitableFor: [
        'Startup founders and entrepreneurs',
        'Existing businesses wanting to scale',
        'Wellness practitioners expanding services',
        'Anyone validating business concepts',
        'Companies entering new markets'
      ],
      requirements: [
        'Business concept or existing business',
        'Financial overview (if existing business)',
        'Clear goals and objectives',
        'Market research (basic understanding)',
        'Commitment to implementation'
      ],
      specialFeatures: [
        'Customized strategy document',
        '90-day action plan',
        'Follow-up support session',
        'Industry-specific insights',
        'Resource and contact recommendations'
      ]
    },
    {
      id: 'digital-transformation-package',
      title: 'Digital Transformation Strategy (3-Month Program)',
      description: '3-month comprehensive program to digitally transform your business operations and customer experience.',
      longDescription: 'Navigate the digital landscape with confidence through this structured 3-month transformation program. We\'ll audit your current digital presence, identify opportunities for automation and optimization, and implement sustainable digital solutions that align with your business goals and budget.',
      category: 'Business Consulting',
      price_zar: 18500,
      price_wellcoins: 2400,
      duration_minutes: 180,
      location: 'Cape Town / Remote',
      is_online: true,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/digital-transformation.jpg'),
        getImageWithFallback('/lovable-uploads/technology-consulting.jpg')
      ],
      benefits: [
        'Streamlined digital operations',
        'Enhanced customer experience',
        'Automated business processes',
        'Improved online presence',
        'Data-driven decision making',
        'Competitive digital advantage'
      ],
      suitableFor: [
        'Traditional businesses going digital',
        'Companies with outdated systems',
        'Businesses wanting to automate processes',
        'Organizations improving customer experience',
        'Companies scaling their operations'
      ],
      requirements: [
        'Existing business operations',
        'Basic technology infrastructure',
        'Team member availability for training',
        'Budget for recommended tools',
        'Commitment to 3-month program'
      ],
      specialFeatures: [
        'Comprehensive digital audit',
        'Custom technology roadmap',
        'Staff training and support',
        'Implementation assistance',
        'Ongoing optimization support'
      ]
    },
    {
      id: 'wellness-business-accelerator',
      title: 'Wellness Business Accelerator Program',
      description: 'Specialized 6-week program designed specifically for wellness practitioners and health-focused businesses.',
      longDescription: 'Accelerate your wellness business with this industry-specific program. Combining business development fundamentals with wellness industry insights, this program covers everything from client acquisition to sustainable pricing, ethical marketing, and building authentic wellness communities.',
      category: 'Business Consulting',
      price_zar: 8500,
      price_wellcoins: 1105,
      duration_minutes: 90,
      location: 'Cape Town / Remote',
      is_online: true,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/wellness-business.jpg'),
        getImageWithFallback(IMAGES.GENERAL.WELLNESS_COMMUNITY)
      ],
      benefits: [
        'Wellness-specific business strategies',
        'Ethical marketing approaches',
        'Client retention and community building',
        'Sustainable pricing models',
        'Wellness industry network access',
        'Authentic brand development'
      ],
      suitableFor: [
        'Yoga instructors and wellness coaches',
        'Alternative health practitioners',
        'Wellness product entrepreneurs',
        'Health food and supplement businesses',
        'Retreat and workshop facilitators'
      ],
      requirements: [
        'Wellness-related business or concept',
        'Basic business understanding',
        'Commitment to 6-week program',
        'Willingness to implement strategies',
        'Authentic passion for wellness'
      ],
      specialFeatures: [
        'Industry-specific strategies',
        'Wellness community integration',
        'Ethical business practices focus',
        'Peer network development',
        'Ongoing wellness industry updates'
      ]
    },
    {
      id: 'startup-mentorship',
      title: 'Startup Mentorship & Support',
      description: 'Ongoing mentorship program for early-stage startups, providing guidance and support throughout the entrepreneurial journey.',
      longDescription: 'Navigate the challenging but rewarding startup journey with experienced guidance. This mentorship program provides ongoing support, strategic advice, and practical solutions as you build and scale your business. Includes regular check-ins, problem-solving sessions, and access to my professional network.',
      category: 'Business Consulting',
      price_zar: 3500,
      price_wellcoins: 455,
      duration_minutes: 60,
      location: 'Cape Town / Remote',
      is_online: true,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/startup-mentorship.jpg'),
        getImageWithFallback('/lovable-uploads/business-meeting.jpg')
      ],
      benefits: [
        'Experienced startup guidance',
        'Problem-solving support',
        'Strategic decision-making help',
        'Network access and introductions',
        'Accountability and motivation',
        'Risk mitigation strategies'
      ],
      suitableFor: [
        'First-time entrepreneurs',
        'Early-stage startup founders',
        'Anyone validating business ideas',
        'Entrepreneurs facing challenges',
        'Startups preparing for funding'
      ],
      requirements: [
        'Active startup or validated business idea',
        'Commitment to regular sessions',
        'Openness to feedback and advice',
        'Willingness to take action',
        'Basic business plan or concept'
      ],
      specialFeatures: [
        'Flexible scheduling',
        'Industry connections and introductions',
        'Resource sharing and recommendations',
        'Problem-solving focus',
        'Long-term relationship building'
      ]
    },
    {
      id: 'market-research-analysis',
      title: 'Comprehensive Market Research & Analysis',
      description: 'Thorough market research and competitive analysis to inform your business strategy and positioning.',
      longDescription: 'Make informed business decisions with comprehensive market intelligence. This service provides deep market analysis, competitor research, customer persona development, and opportunity identification. Perfect for businesses entering new markets or validating product concepts.',
      category: 'Business Consulting',
      price_zar: 4500,
      price_wellcoins: 585,
      duration_minutes: 60,
      location: 'Cape Town / Remote',
      is_online: true,
      active: true,
      images: [
        getImageWithFallback('/lovable-uploads/market-research.jpg'),
        getImageWithFallback('/lovable-uploads/data-analysis.jpg')
      ],
      benefits: [
        'Comprehensive market understanding',
        'Competitive intelligence',
        'Customer insight and personas',
        'Opportunity identification',
        'Risk assessment',
        'Data-driven decision support'
      ],
      suitableFor: [
        'Businesses entering new markets',
        'Companies launching new products',
        'Startups validating concepts',
        'Businesses repositioning themselves',
        'Organizations seeking growth opportunities'
      ],
      requirements: [
        'Clear research objectives',
        'Defined target market or area',
        'Access to relevant business information',
        'Budget for research tools and resources',
        'Timeline for research completion'
      ],
      specialFeatures: [
        'Professional research methodology',
        'Detailed analysis report',
        'Visual data presentations',
        'Actionable recommendations',
        'Follow-up strategy session'
      ]
    }
  ],
  packages: [
    {
      id: 'complete-business-transformation',
      title: 'Complete Business Transformation Package',
      description: 'Comprehensive 6-month business development and transformation program',
      price_zar: 35000,
      price_wellcoins: 4550,
      includes: [
        'Initial strategic consultation',
        'Digital transformation program',
        'Monthly mentorship sessions',
        'Market research and analysis',
        'Implementation support',
        'Staff training and development',
        'Ongoing optimization support'
      ],
      savings: 'Save 25% compared to individual services',
      duration: '6 months'
    },
    {
      id: 'startup-success-bundle',
      title: 'Startup Success Bundle',
      description: 'Everything you need to launch and scale your startup successfully',
      price_zar: 15000,
      price_wellcoins: 1950,
      includes: [
        'Business strategy consultation',
        'Market research and analysis',
        '3 months of mentorship',
        'Digital presence setup guidance',
        'Investor readiness preparation',
        'Network introduction opportunities'
      ],
      savings: 'Complete startup support package with 20% savings',
      duration: '3 months'
    }
  ]
};

export default chadCupidoProfile;