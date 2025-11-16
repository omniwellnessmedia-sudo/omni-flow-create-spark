-- Phase 2: Public Profile View Policy
-- Create a view with only safe, public profile fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  user_type,
  avatar_url,
  created_at
FROM public.profiles;

-- Grant SELECT on the view to authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_invoker = on);

COMMENT ON VIEW public.public_profiles IS 'Public profile information viewable by authenticated users. Excludes sensitive fields like email, phone, etc.';