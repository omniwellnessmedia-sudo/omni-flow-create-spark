// Unified Marketplace Content Types for Omni Wellness Platform
// This defines the taxonomy for all wellness content

export interface BaseWellnessContent {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  provider_id: string;
  provider_name: string;
  category: string;
  subcategory?: string;
  images: string[];
  location: string;
  is_online: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  rating: number;
  review_count: number;
  tags: string[];
}

// 1. SERVICES - Individual sessions/appointments
export interface WellnessService extends BaseWellnessContent {
  content_type: 'service';
  price_zar: number;
  price_wellcoins: number;
  duration_minutes: number;
  benefits: string[];
  requirements: string[];
  suitable_for: string[];
  booking_type: 'appointment' | 'drop_in' | 'subscription';
  max_participants: number;
  cancellation_policy: string;
}

// 2. PACKAGES - Bundled services or multi-session offerings
export interface WellnessPackage extends BaseWellnessContent {
  content_type: 'package';
  price_zar: number;
  price_wellcoins: number;
  total_sessions: number;
  session_duration_minutes: number;
  validity_days: number;
  included_services: string[];
  package_benefits: string[];
  savings_percentage: number;
}

// 3. PRODUCTS - Physical or digital products for purchase
export interface WellnessProduct extends BaseWellnessContent {
  content_type: 'product';
  price_zar: number;
  price_wellcoins: number;
  product_type: 'physical' | 'digital' | 'subscription';
  stock_quantity?: number;
  is_unlimited_stock: boolean;
  shipping_required: boolean;
  digital_delivery_url?: string;
  product_specifications: Record<string, any>;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price_zar: number;
  price_wellcoins: number;
  stock_quantity?: number;
  attributes: Record<string, string>; // size, color, etc.
}

// 4. EXPERIENCES - Multi-day or special events (retreats, workshops, courses)
export interface WellnessExperience extends BaseWellnessContent {
  content_type: 'experience';
  price_zar: number;
  price_wellcoins: number;
  experience_type: 'retreat' | 'workshop' | 'course' | 'ceremony' | 'tour';
  start_date: string;
  end_date: string;
  duration_days: number;
  max_participants: number;
  current_participants: number;
  includes: string[];
  accommodation_included: boolean;
  meals_included: boolean;
  transport_included: boolean;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
}

// 5. DEALS - Special offers, discounts, promotions
export interface WellnessDeal extends BaseWellnessContent {
  content_type: 'deal';
  original_price_zar: number;
  deal_price_zar: number;
  original_price_wellcoins: number;
  deal_price_wellcoins: number;
  discount_percentage: number;
  deal_type: 'flash_sale' | 'bundle' | 'early_bird' | 'loyalty' | 'seasonal';
  valid_from: string;
  valid_until: string;
  quantity_available?: number;
  quantity_claimed: number;
  terms_conditions: string[];
  related_content_ids: string[]; // IDs of services/products/experiences included
}

// Union type for all marketplace content
export type WellnessMarketplaceItem = 
  | WellnessService 
  | WellnessPackage 
  | WellnessProduct 
  | WellnessExperience 
  | WellnessDeal;

// Provider profile with comprehensive capabilities
export interface WellnessProvider {
  id: string;
  user_id: string;
  business_name: string;
  business_type: 'individual' | 'business' | 'organization';
  description: string;
  location: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
    social_media: Record<string, string>;
  };
  profile_image_url: string;
  cover_image_url: string;
  specialties: string[];
  certifications: string[];
  years_experience: number;
  is_verified: boolean;
  rating: number;
  review_count: number;
  wellcoin_balance: number;
  
  // Business capabilities
  capabilities: {
    can_sell_services: boolean;
    can_sell_products: boolean;
    can_create_experiences: boolean;
    can_offer_deals: boolean;
    can_accept_wellcoins: boolean;
    has_ecommerce_enabled: boolean;
    has_booking_system: boolean;
  };
  
  // Settings
  settings: {
    auto_approve_bookings: boolean;
    requires_deposit: boolean;
    deposit_percentage: number;
    cancellation_window_hours: number;
    timezone: string;
    business_hours: Record<string, { open: string; close: string }>;
  };
}

// Unified search/filter interface
export interface MarketplaceFilters {
  content_types: ('service' | 'package' | 'product' | 'experience' | 'deal')[];
  categories: string[];
  location_radius?: number;
  location_center?: { lat: number; lng: number };
  price_range?: { min: number; max: number };
  is_online?: boolean;
  rating_min?: number;
  availability?: {
    start_date: string;
    end_date: string;
  };
  provider_ids?: string[];
  tags?: string[];
  sort_by: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'distance';
}

// User journey states
export interface UserJourney {
  current_step: 'discover' | 'compare' | 'book' | 'pay' | 'confirm' | 'experience' | 'review';
  selected_items: string[];
  cart_total_zar: number;
  cart_total_wellcoins: number;
  booking_preferences: {
    preferred_times: string[];
    special_requirements: string;
    group_size: number;
  };
}