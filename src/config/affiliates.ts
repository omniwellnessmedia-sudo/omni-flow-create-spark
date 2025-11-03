export type AffiliateNetwork = 'cj' | 'awin' | 'direct' | 'shareasale';
export type AffiliateCurrency = 'USD' | 'ZAR' | 'EUR';
export type AffiliateStatus = 'active' | 'testing' | 'paused';
export type CommissionType = 'percentage' | 'fixed' | 'hybrid';

export interface AffiliateProgram {
  id: string;
  name: string;
  network: AffiliateNetwork;
  tier: 1 | 2 | 3;
  commission_type: CommissionType;
  commission_rate: number;
  cookie_duration_days: number;
  currency: AffiliateCurrency;
  tracking_domain: string;
  deep_linking_enabled: boolean;
  categories: string[];
  status: AffiliateStatus;
  launch_date: string;
}

// Tier 1: Launch Nov 3-7
export const AFFILIATE_PROGRAMS: Record<string, AffiliateProgram> = {
  cj: {
    id: 'cj_affiliate',
    name: 'CJ Affiliate',
    network: 'cj',
    tier: 1,
    commission_type: 'percentage',
    commission_rate: 8.5,
    cookie_duration_days: 30,
    currency: 'USD',
    tracking_domain: 'cj.com',
    deep_linking_enabled: true,
    categories: ['wellness', 'travel', 'products', 'supplements'],
    status: 'active',
    launch_date: '2025-11-03'
  },
  getyourguide: {
    id: 'getyourguide',
    name: 'GetYourGuide',
    network: 'direct',
    tier: 1,
    commission_type: 'percentage',
    commission_rate: 7.0,
    cookie_duration_days: 30,
    currency: 'USD',
    tracking_domain: 'getyourguide.com',
    deep_linking_enabled: true,
    categories: ['travel', 'tours', 'experiences', 'wellness-retreats'],
    status: 'active',
    launch_date: '2025-11-03'
  },
  faithful_to_nature: {
    id: 'faithful_to_nature',
    name: 'Faithful to Nature',
    network: 'direct',
    tier: 1,
    commission_type: 'percentage',
    commission_rate: 10.0,
    cookie_duration_days: 30,
    currency: 'ZAR',
    tracking_domain: 'faithful-to-nature.co.za',
    deep_linking_enabled: false,
    categories: ['wellness', 'natural-products', 'supplements', 'eco-friendly'],
    status: 'active',
    launch_date: '2025-11-03'
  },
  
  // Tier 2: Launch Nov 10-14
  awin: {
    id: 'awin',
    name: 'AWIN',
    network: 'awin',
    tier: 2,
    commission_type: 'percentage',
    commission_rate: 6.0,
    cookie_duration_days: 30,
    currency: 'USD',
    tracking_domain: 'awin1.com',
    deep_linking_enabled: true,
    categories: ['wellness', 'travel', 'products', 'fitness'],
    status: 'testing',
    launch_date: '2025-11-10'
  },
  travelstart: {
    id: 'travelstart',
    name: 'Travelstart',
    network: 'direct',
    tier: 2,
    commission_type: 'percentage',
    commission_rate: 5.0,
    cookie_duration_days: 30,
    currency: 'ZAR',
    tracking_domain: 'travelstart.co.za',
    deep_linking_enabled: true,
    categories: ['travel', 'flights', 'hotels', 'wellness-travel'],
    status: 'testing',
    launch_date: '2025-11-10'
  },
  
  // Tier 3: Launch Nov 17+
  shareasale: {
    id: 'shareasale',
    name: 'ShareASale',
    network: 'shareasale',
    tier: 3,
    commission_type: 'percentage',
    commission_rate: 8.0,
    cookie_duration_days: 45,
    currency: 'USD',
    tracking_domain: 'shareasale.com',
    deep_linking_enabled: true,
    categories: ['wellness', 'supplements', 'fitness', 'products'],
    status: 'paused',
    launch_date: '2025-11-17'
  },
  viator: {
    id: 'viator',
    name: 'Viator',
    network: 'direct',
    tier: 3,
    commission_type: 'percentage',
    commission_rate: 8.0,
    cookie_duration_days: 30,
    currency: 'USD',
    tracking_domain: 'viator.com',
    deep_linking_enabled: true,
    categories: ['travel', 'tours', 'experiences', 'wellness-retreats'],
    status: 'paused',
    launch_date: '2025-11-17'
  },
  oura: {
    id: 'oura_rings',
    name: 'Oura Rings',
    network: 'direct',
    tier: 3,
    commission_type: 'percentage',
    commission_rate: 10.0,
    cookie_duration_days: 30,
    currency: 'USD',
    tracking_domain: 'ouraring.com',
    deep_linking_enabled: true,
    categories: ['wellness', 'health-tech', 'wearables', 'sleep'],
    status: 'paused',
    launch_date: '2025-11-17'
  },
  vegan_cuts: {
    id: 'vegan_cuts',
    name: 'Vegan Cuts',
    network: 'direct',
    tier: 3,
    commission_type: 'percentage',
    commission_rate: 12.0,
    cookie_duration_days: 30,
    currency: 'USD',
    tracking_domain: 'vegancuts.com',
    deep_linking_enabled: false,
    categories: ['wellness', 'vegan', 'nutrition', 'products'],
    status: 'paused',
    launch_date: '2025-11-17'
  },
  safari_now: {
    id: 'safari_now',
    name: 'Safari Now',
    network: 'direct',
    tier: 3,
    commission_type: 'percentage',
    commission_rate: 7.5,
    cookie_duration_days: 30,
    currency: 'ZAR',
    tracking_domain: 'safarinow.com',
    deep_linking_enabled: true,
    categories: ['travel', 'safari', 'wellness-retreats', 'adventure'],
    status: 'paused',
    launch_date: '2025-11-17'
  }
};

export const getActiveProgramsByTier = (tier: 1 | 2 | 3): AffiliateProgram[] => {
  return Object.values(AFFILIATE_PROGRAMS).filter(
    program => program.tier === tier && program.status === 'active'
  );
};

export const getActivePrograms = (): AffiliateProgram[] => {
  return Object.values(AFFILIATE_PROGRAMS).filter(
    program => program.status === 'active'
  );
};

export const getProgramById = (id: string): AffiliateProgram | undefined => {
  return AFFILIATE_PROGRAMS[id];
};

export const getProgramsByCategory = (category: string): AffiliateProgram[] => {
  return Object.values(AFFILIATE_PROGRAMS).filter(
    program => program.categories.includes(category) && program.status === 'active'
  );
};
