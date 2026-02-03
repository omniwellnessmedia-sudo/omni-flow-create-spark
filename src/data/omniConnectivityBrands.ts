// Omni Connectivity Ecosystem - Brand Architecture
// RoamBuddy is our technology partner, these are our customer-facing brands

export interface OmniConnectivityBrand {
  id: string;
  name: string;
  fullName: string;
  tagline: string;
  icon: string;
  gradient: string;
  primaryColor: string;
  targetAudience: string;
  aiAgent: string;
  aiAgentPersonality: string;
  curatorLead: 'zenith' | 'chad' | 'ferozza';
  urls: string[];
  features: string[];
  trustBadges: { icon: string; label: string }[];
}

export const omniConnectivityBrands: Record<string, OmniConnectivityBrand> = {
  roam: {
    id: 'roam',
    name: 'ROAM',
    fullName: 'ROAM by Omni',
    tagline: 'Stay Connected to Your Wellness Journey',
    icon: '🧭',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    primaryColor: 'teal',
    targetAudience: 'Individual wellness travelers, retreat attendees, digital nomads',
    aiAgent: 'Roam',
    aiAgentPersonality: 'Mindful, wellness-literate, activity-focused, calm and grounded',
    curatorLead: 'zenith',
    urls: ['/roam-store', '/esim-store', '/roambuddy-store'],
    features: [
      'Activity-based eSIM selection',
      '30 wellness categories mapped',
      'Curator recommendations',
      'Wellness Intent Badges',
      'Preference-aware chatbot'
    ],
    trustBadges: [
      { icon: '🧘', label: 'Retreat-Ready' },
      { icon: '🌿', label: 'Wellness Optimized' },
      { icon: '🧭', label: 'Curator Picks' },
      { icon: '✨', label: 'Peace of Mind' }
    ]
  },
  wellconnect: {
    id: 'wellconnect',
    name: 'WELLCONNECT',
    fullName: 'WellConnect by Omni',
    tagline: 'Seamless Connectivity for Healing Journeys',
    icon: '🌿',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    primaryColor: 'green',
    targetAudience: 'Retreat centers, yoga studios, wellness practitioners, group organizers',
    aiAgent: 'Flora',
    aiAgentPersonality: 'Calm, retreat-focused, group coordination expert',
    curatorLead: 'zenith',
    urls: ['/wellconnect', '/travel-well-connected-esim', '/wellness-roaming-packages'],
    features: [
      'Bulk/group eSIM ordering',
      'Retreat coordinator packages',
      'Emergency-only options for digital detox',
      'Pre-configured for wellness apps',
      'Group discount pricing'
    ],
    trustBadges: [
      { icon: '🌿', label: 'Retreat-Optimized' },
      { icon: '👥', label: 'Group Packages' },
      { icon: '🧘', label: 'Mindful Connectivity' },
      { icon: '💚', label: 'Healing Support' }
    ]
  },
  globalData: {
    id: 'globalData',
    name: 'OMNI GLOBAL DATA',
    fullName: 'Omni Global Data',
    tagline: 'Production-Ready Connectivity Worldwide',
    icon: '✈️',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    primaryColor: 'orange',
    targetAudience: 'Media production teams, business travelers, content creators, documentary filmmakers',
    aiAgent: 'Atlas',
    aiAgentPersonality: 'Professional, data-focused, production-savvy, efficient',
    curatorLead: 'chad',
    urls: ['/global-data', '/data-products'],
    features: [
      'High-data plans prioritized (10GB+)',
      'Multi-device hotspot emphasis',
      'Team/production coordination',
      'Invoice-ready for business expense',
      'Priority support'
    ],
    trustBadges: [
      { icon: '✈️', label: 'Global Coverage' },
      { icon: '📸', label: 'Production-Ready' },
      { icon: '⚡', label: 'High-Speed Data' },
      { icon: '💼', label: 'Business Invoicing' }
    ]
  }
};

// Helper function to get brand by URL path
export const getBrandByPath = (path: string): OmniConnectivityBrand | null => {
  for (const brand of Object.values(omniConnectivityBrands)) {
    if (brand.urls.some(url => path.includes(url.replace('/', '')))) {
      return brand;
    }
  }
  return omniConnectivityBrands.roam; // Default to ROAM
};

// Wellness Intent Badges for product cards
export const wellnessIntentBadges = {
  meditation: { icon: '🧘', label: 'Meditation & Mindfulness', dataRange: '1-3GB' },
  ocean: { icon: '🌊', label: 'Ocean & Water Wellness', dataRange: '5GB' },
  adventure: { icon: '🥾', label: 'Active Adventure', dataRange: '5-10GB' },
  nature: { icon: '🌿', label: 'Nature Immersion', dataRange: '3-5GB' },
  community: { icon: '🎪', label: 'Community & Events', dataRange: '10GB+' },
  healing: { icon: '✨', label: 'Healing Journeys', dataRange: '3GB' },
  documentation: { icon: '📸', label: 'Documentation & Creation', dataRange: '10-20GB' },
  explorer: { icon: '🧭', label: 'Explorer & Multi-Country', dataRange: 'Unlimited' }
};

// Get wellness intent based on data amount
export const getWellnessIntentBadge = (dataAmount: string): { icon: string; label: string } => {
  const dataLower = dataAmount?.toLowerCase() || '';
  
  if (dataLower.includes('unlimited')) {
    return wellnessIntentBadges.explorer;
  }
  
  // Parse GB amount
  const gbMatch = dataLower.match(/(\d+)/);
  const gb = gbMatch ? parseInt(gbMatch[1]) : 5;
  
  if (gb <= 3) return wellnessIntentBadges.meditation;
  if (gb <= 5) return wellnessIntentBadges.ocean;
  if (gb <= 10) return wellnessIntentBadges.adventure;
  if (gb <= 20) return wellnessIntentBadges.documentation;
  
  return wellnessIntentBadges.community;
};

// Partnership disclosure with Omni-first branding
export const partnershipDisclosure = {
  headline: 'Powered by RoamBuddy Technology',
  description: `ROAM by Omni leverages RoamBuddy's global eSIM infrastructure to deliver wellness-optimized connectivity. We've curated their offerings through a wellness lens, so you get the right data for your journey type.`,
  disclosure: `When you purchase through our platform, we earn a small commission that directly supports community development projects like Valley of Plenty.`,
  techPartner: {
    name: 'RoamBuddy',
    role: 'Global eSIM Infrastructure Partner',
    website: 'https://www.roambuddy.world'
  }
};
