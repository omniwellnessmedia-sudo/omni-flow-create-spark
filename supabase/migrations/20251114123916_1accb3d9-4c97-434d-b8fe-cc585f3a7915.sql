-- =====================================================
-- DUDA PARTNER WEBSITE PLATFORM - DATABASE SCHEMA
-- Phase 1: Database Architecture
-- =====================================================

-- Step 1: Extend provider_websites table with Duda integration columns
ALTER TABLE public.provider_websites 
ADD COLUMN IF NOT EXISTS duda_site_name TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS duda_site_url TEXT,
ADD COLUMN IF NOT EXISTS duda_external_id TEXT,
ADD COLUMN IF NOT EXISTS duda_template_id TEXT DEFAULT 'omni-wellness-partner',
ADD COLUMN IF NOT EXISTS duda_created_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS duda_last_published TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS duda_stats JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS site_status TEXT DEFAULT 'draft' CHECK (site_status IN ('draft', 'active', 'suspended', 'deleted')),
ADD COLUMN IF NOT EXISTS auto_publish BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_css_override TEXT,
ADD COLUMN IF NOT EXISTS branding_config JSONB DEFAULT '{}'::jsonb;

-- Create indexes for Duda lookups
CREATE INDEX IF NOT EXISTS idx_provider_websites_duda_site_name 
  ON public.provider_websites(duda_site_name);

CREATE INDEX IF NOT EXISTS idx_provider_websites_site_status 
  ON public.provider_websites(site_status);

-- Step 2: Create partner website stats table for commission tracking
CREATE TABLE IF NOT EXISTS public.partner_website_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE,
  website_id UUID REFERENCES provider_websites(id) ON DELETE CASCADE,
  
  -- Traffic Stats (from Duda API)
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_session_duration INTEGER, -- seconds
  
  -- Conversion Stats
  form_submissions INTEGER DEFAULT 0,
  bookings_generated INTEGER DEFAULT 0,
  revenue_generated_zar DECIMAL(10,2) DEFAULT 0,
  
  -- Commission
  commission_rate DECIMAL(5,4) DEFAULT 0.10, -- 10% default
  commission_earned_zar DECIMAL(10,2) DEFAULT 0,
  commission_earned_wellcoins INTEGER DEFAULT 0,
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'approved', 'paid')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(website_id, period_start, period_end)
);

-- Indexes for partner_website_stats performance
CREATE INDEX IF NOT EXISTS idx_partner_stats_provider ON public.partner_website_stats(provider_id);
CREATE INDEX IF NOT EXISTS idx_partner_stats_website ON public.partner_website_stats(website_id);
CREATE INDEX IF NOT EXISTS idx_partner_stats_period ON public.partner_website_stats(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_partner_stats_commission_status ON public.partner_website_stats(commission_status);

-- RLS Policies for partner_website_stats
ALTER TABLE public.partner_website_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can view their own stats" ON public.partner_website_stats;
CREATE POLICY "Providers can view their own stats"
  ON public.partner_website_stats FOR SELECT
  USING (provider_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all stats" ON public.partner_website_stats;
CREATE POLICY "Admins can manage all stats"
  ON public.partner_website_stats FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Trigger for updated_at on partner_website_stats
DROP TRIGGER IF EXISTS update_partner_stats_updated_at ON public.partner_website_stats;
CREATE TRIGGER update_partner_stats_updated_at
  BEFORE UPDATE ON public.partner_website_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 3: Create AI content generation tracking table
CREATE TABLE IF NOT EXISTS public.website_ai_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE,
  website_id UUID REFERENCES provider_websites(id) ON DELETE CASCADE,
  
  content_type TEXT NOT NULL CHECK (content_type IN (
    'hero_headline', 
    'hero_subheadline', 
    'about_section', 
    'service_description',
    'meta_description',
    'call_to_action',
    'testimonial_request',
    'blog_post'
  )),
  
  prompt_used TEXT,
  generated_content TEXT NOT NULL,
  is_applied BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- AI Metadata
  model_used TEXT DEFAULT 'google/gemini-2.5-flash',
  generation_time_ms INTEGER,
  tokens_used INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for website_ai_content
CREATE INDEX IF NOT EXISTS idx_ai_content_provider ON public.website_ai_content(provider_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_website ON public.website_ai_content(website_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_type ON public.website_ai_content(content_type);

-- RLS Policies for website_ai_content
ALTER TABLE public.website_ai_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can view their own AI content" ON public.website_ai_content;
CREATE POLICY "Providers can view their own AI content"
  ON public.website_ai_content FOR SELECT
  USING (provider_id = auth.uid());

DROP POLICY IF EXISTS "Providers can manage their own AI content" ON public.website_ai_content;
CREATE POLICY "Providers can manage their own AI content"
  ON public.website_ai_content FOR INSERT
  WITH CHECK (provider_id = auth.uid());