// Comprehensive Provider Directory Types
// Enhanced from Sandy Mitchell profile structure

export type ProviderCategory = 
  | 'Yoga & Meditation' 
  | 'Business Development' 
  | 'Traditional & Cultural' 
  | 'Wellness Products'
  | 'Fitness & Movement'
  | 'Nutrition & Health'
  | 'Life Coaching'
  | 'Energy Healing'
  | 'Travel & Tourism'
  | 'Technology & Digital'
  | 'Art & Creativity';

export type ServiceCategory = 
  | 'Yoga' 
  | 'Meditation' 
  | 'Nutrition Counseling' 
  | 'Life Coaching' 
  | 'Energy Healing'
  | 'Business Consulting'
  | 'Web Development'
  | 'Traditional Healing'
  | 'Cultural Tours'
  | 'Wellness Products'
  | 'Fitness Training'
  | 'Health Coaching';

export interface ProviderService {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: ServiceCategory;
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

export interface ProviderPackage {
  id: string;
  title: string;
  description: string;
  price_zar: number;
  price_wellcoins: number;
  includes: string[];
  savings: string;
  duration?: string;
}

export interface ProviderProfile {
  id: string;
  business_name: string;
  description: string;
  category: ProviderCategory;
  location: string;
  phone: string;
  email: string;
  website?: string;
  specialties: string[];
  certifications: string[];
  years_experience: number;
  verified: boolean;
  wellcoin_balance: number;
  profile_image_url: string;
  cover_image: string;
  philosophy: string;
  social_media: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  rating: number;
  total_clients: number;
  total_hours_taught?: number;
  languages: string[];
  availability: {
    days: string[];
    hours: string;
  };
  featured: boolean;
  badges?: string[];
}

export interface ProviderDirectory {
  profile: ProviderProfile;
  services: ProviderService[];
  packages: ProviderPackage[];
}

export interface ProviderFilterState {
  category?: ProviderCategory;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  verified?: boolean;
  featured?: boolean;
  searchQuery?: string;
  availability?: 'online' | 'in-person' | 'both';
}