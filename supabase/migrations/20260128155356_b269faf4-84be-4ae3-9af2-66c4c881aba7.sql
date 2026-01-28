-- Enable Cal.com integration feature flag
UPDATE public.feature_flags 
SET is_enabled = true, updated_at = now()
WHERE feature_key = 'calcom_integration';

-- If the flag doesn't exist, create it
INSERT INTO public.feature_flags (feature_key, display_name, description, is_enabled, category)
VALUES ('calcom_integration', 'Cal.com Integration', 'Enable Cal.com booking integration across service pages', true, 'integrations')
ON CONFLICT (feature_key) DO UPDATE SET is_enabled = true, updated_at = now();

-- Update Cal.com username in global settings
INSERT INTO public.calcom_global_settings (setting_key, setting_value, description)
VALUES ('calcom_username', 'omni-wellness-media-gqj9mj', 'Cal.com username from user screenshot')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = 'omni-wellness-media-gqj9mj', updated_at = now();