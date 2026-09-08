-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

DO $g1$
BEGIN
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
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;

DO $g2$
BEGIN
-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g2$;

DO $g3$
BEGIN
-- RLS Policies for feature_flags
CREATE POLICY "Anyone can read feature flags"
ON public.feature_flags FOR SELECT
USING (true);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g3$;

DO $g4$
BEGIN
CREATE POLICY "Admins can manage feature flags"
ON public.feature_flags FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g4$;

DO $g5$
BEGIN
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
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g5$;

DO $g6$
BEGIN
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
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g6$;

DO $g7$
BEGIN
-- Enable RLS
ALTER TABLE public.service_time_slots ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g7$;

DO $g8$
BEGIN
-- RLS Policies for service_time_slots
CREATE POLICY "Anyone can read time slots"
ON public.service_time_slots FOR SELECT
USING (true);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g8$;

DO $g9$
BEGIN
CREATE POLICY "Admins can manage time slots"
ON public.service_time_slots FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g9$;

DO $g10$
BEGIN
-- Indexes
CREATE INDEX idx_service_time_slots_service ON public.service_time_slots(service_id);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g10$;

DO $g11$
BEGIN
CREATE INDEX idx_service_time_slots_day ON public.service_time_slots(day_of_week);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g11$;

DO $g12$
BEGIN
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
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g12$;

DO $g13$
BEGIN
-- Enable RLS
ALTER TABLE public.calcom_settings ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g13$;

DO $g14$
BEGIN
-- RLS Policies for calcom_settings
CREATE POLICY "Providers can view own settings"
ON public.calcom_settings FOR SELECT
TO authenticated
USING (provider_id = auth.uid() OR public.is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g14$;

DO $g15$
BEGIN
CREATE POLICY "Providers can manage own settings"
ON public.calcom_settings FOR ALL
TO authenticated
USING (provider_id = auth.uid() OR public.is_admin(auth.uid()))
WITH CHECK (provider_id = auth.uid() OR public.is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g15$;

DO $g16$
BEGIN
-- 4. Cal.com Global Settings
CREATE TABLE public.calcom_global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g16$;

DO $g17$
BEGIN
-- Enable RLS
ALTER TABLE public.calcom_global_settings ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g17$;

DO $g18$
BEGIN
-- RLS Policies for calcom_global_settings
CREATE POLICY "Anyone can read global cal.com settings"
ON public.calcom_global_settings FOR SELECT
USING (true);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g18$;

DO $g19$
BEGIN
CREATE POLICY "Admins can manage global cal.com settings"
ON public.calcom_global_settings FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g19$;

DO $g20$
BEGIN
-- Pre-populate global cal.com settings
INSERT INTO public.calcom_global_settings (setting_key, setting_value, description) VALUES
  ('calcom_username', 'omniwellnessmedia', 'Default Cal.com username for Omni services'),
  ('default_event_slug', 'discovery-call', 'Default event type for general bookings'),
  ('embed_mode', 'popup', 'Default embed mode: inline, popup, or modal');
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g20$;

DO $g21$
BEGIN
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
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g21$;

DO $g22$
BEGIN
-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g22$;

DO $g23$
BEGIN
-- RLS Policies for team_members
CREATE POLICY "Authenticated users can view team members"
ON public.team_members FOR SELECT
TO authenticated
USING (true);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g23$;

DO $g24$
BEGIN
CREATE POLICY "Admins can manage team members"
ON public.team_members FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g24$;

DO $g25$
BEGIN
-- Create index for team_members
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g25$;

DO $g26$
BEGIN
CREATE INDEX idx_team_members_email ON public.team_members(email);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g26$;

DO $g27$
BEGIN
-- 6. Update triggers for timestamps
CREATE TRIGGER update_feature_flags_updated_at
BEFORE UPDATE ON public.feature_flags
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g27$;

DO $g28$
BEGIN
CREATE TRIGGER update_service_time_slots_updated_at
BEFORE UPDATE ON public.service_time_slots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g28$;

DO $g29$
BEGIN
CREATE TRIGGER update_calcom_settings_updated_at
BEFORE UPDATE ON public.calcom_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g29$;

DO $g30$
BEGIN
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g30$;
