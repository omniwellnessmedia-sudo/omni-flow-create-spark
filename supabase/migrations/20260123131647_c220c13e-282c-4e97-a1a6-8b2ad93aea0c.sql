-- =============================================
-- Cal.com Integration & Enhanced Admin Dashboard
-- =============================================

-- 1. Feature Flags Table
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'general',
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feature_flags
CREATE POLICY "Anyone can read feature flags"
ON public.feature_flags FOR SELECT
USING (true);

CREATE POLICY "Admins can manage feature flags"
ON public.feature_flags FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Pre-populate feature flags
INSERT INTO public.feature_flags (feature_key, display_name, description, category) VALUES
  ('booking_system', 'Booking System', 'Enable/disable the booking functionality', 'booking'),
  ('wellcoin_payments', 'WellCoin Payments', 'Allow WellCoin as payment method', 'payments'),
  ('tour_bookings', 'Tour Bookings', 'Enable tour booking functionality', 'booking'),
  ('affiliate_products', 'Affiliate Products', 'Show affiliate products in marketplace', 'marketplace'),
  ('provider_portal', 'Provider Portal', 'Enable provider dashboard access', 'access'),
  ('social_scheduler', 'Social Scheduler', 'Enable social media scheduling', 'marketing'),
  ('newsletter', 'Newsletter System', 'Enable newsletter functionality', 'marketing'),
  ('calcom_integration', 'Cal.com Integration', 'Use Cal.com for bookings', 'booking');

-- 2. Service Time Slots Table
CREATE TABLE public.service_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER DEFAULT 60,
  is_available BOOLEAN DEFAULT true,
  max_bookings_per_slot INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_id, day_of_week, start_time)
);

-- Enable RLS
ALTER TABLE public.service_time_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_time_slots
CREATE POLICY "Anyone can read time slots"
ON public.service_time_slots FOR SELECT
USING (true);

CREATE POLICY "Admins can manage time slots"
ON public.service_time_slots FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_service_time_slots_service ON public.service_time_slots(service_id);
CREATE INDEX idx_service_time_slots_day ON public.service_time_slots(day_of_week);

-- 3. Cal.com Settings (Provider-specific)
CREATE TABLE public.calcom_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE,
  calcom_username TEXT,
  calcom_api_key TEXT,
  event_type_slug TEXT,
  embed_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider_id)
);

-- Enable RLS
ALTER TABLE public.calcom_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calcom_settings
CREATE POLICY "Providers can view own settings"
ON public.calcom_settings FOR SELECT
TO authenticated
USING (provider_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Providers can manage own settings"
ON public.calcom_settings FOR ALL
TO authenticated
USING (provider_id = auth.uid() OR public.is_admin(auth.uid()))
WITH CHECK (provider_id = auth.uid() OR public.is_admin(auth.uid()));

-- 4. Cal.com Global Settings
CREATE TABLE public.calcom_global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calcom_global_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calcom_global_settings
CREATE POLICY "Anyone can read global cal.com settings"
ON public.calcom_global_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage global cal.com settings"
ON public.calcom_global_settings FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Pre-populate global cal.com settings
INSERT INTO public.calcom_global_settings (setting_key, setting_value, description) VALUES
  ('calcom_username', 'omniwellnessmedia', 'Default Cal.com username for Omni services'),
  ('default_event_slug', 'discovery-call', 'Default event type for general bookings'),
  ('embed_mode', 'popup', 'Default embed mode: inline, popup, or modal');

-- 5. Team Members Table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
  department TEXT,
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_members
CREATE POLICY "Authenticated users can view team members"
ON public.team_members FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage team members"
ON public.team_members FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create index for team_members
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_members_email ON public.team_members(email);

-- 6. Update triggers for timestamps
CREATE TRIGGER update_feature_flags_updated_at
BEFORE UPDATE ON public.feature_flags
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_time_slots_updated_at
BEFORE UPDATE ON public.service_time_slots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calcom_settings_updated_at
BEFORE UPDATE ON public.calcom_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();