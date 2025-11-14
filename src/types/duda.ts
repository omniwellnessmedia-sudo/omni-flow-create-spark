export interface DudaSite {
  id: string;
  provider_id: string;
  duda_site_name: string;
  duda_site_url: string;
  duda_external_id: string;
  duda_template_id: string;
  duda_created_at: string;
  duda_last_published: string | null;
  duda_stats: Record<string, any>;
  site_status: 'draft' | 'active' | 'suspended' | 'deleted';
  auto_publish: boolean;
  published: boolean;
  page_title: string;
  page_subtitle: string | null;
  about_section: string | null;
  custom_css_override: string | null;
  branding_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DudaSiteStats {
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  revenue_generated_zar: number;
  commission_earned_zar: number;
  commission_earned_wellcoins: number;
  form_submissions?: number;
  bookings_generated?: number;
}

export interface AIContentSuggestion {
  content: string;
  reasoning: string;
}

export interface AIGeneratedContent {
  id: string;
  provider_id: string;
  website_id: string;
  content_type: AIContentType;
  prompt_used: string | null;
  generated_content: string;
  is_applied: boolean;
  rating: number | null;
  model_used: string;
  generation_time_ms: number | null;
  created_at: string;
}

export type AIContentType = 
  | 'hero_headline'
  | 'hero_subheadline'
  | 'about_section'
  | 'service_description'
  | 'meta_description'
  | 'call_to_action'
  | 'testimonial_request'
  | 'blog_post';

export interface ContentGenerationContext {
  business_name: string;
  specialties: string[];
  location: string;
  target_audience?: string;
}

export interface PartnerWebsiteStats {
  id: string;
  provider_id: string;
  website_id: string;
  period_start: string;
  period_end: string;
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  form_submissions: number;
  bookings_generated: number;
  revenue_generated_zar: number;
  commission_rate: number;
  commission_earned_zar: number;
  commission_earned_wellcoins: number;
  commission_status: 'pending' | 'approved' | 'paid';
  created_at: string;
  updated_at: string;
}
