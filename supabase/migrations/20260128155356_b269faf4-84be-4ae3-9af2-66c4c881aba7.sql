-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

DO $g1$
BEGIN
-- Enable Cal.com integration feature flag
UPDATE public.feature_flags 
SET is_enabled = true, updated_at = now()
WHERE feature_key = 'calcom_integration';
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;

DO $g2$
BEGIN
-- If the flag doesn't exist, create it
INSERT INTO public.feature_flags (feature_key, display_name, description, is_enabled, category)
VALUES ('calcom_integration', 'Cal.com Integration', 'Enable Cal.com booking integration across service pages', true, 'integrations')
ON CONFLICT (feature_key) DO UPDATE SET is_enabled = true, updated_at = now();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g2$;

DO $g3$
BEGIN
-- Update Cal.com username in global settings
INSERT INTO public.calcom_global_settings (setting_key, setting_value, description)
VALUES ('calcom_username', 'omni-wellness-media-gqj9mj', 'Cal.com username from user screenshot')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = 'omni-wellness-media-gqj9mj', updated_at = now();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g3$;
