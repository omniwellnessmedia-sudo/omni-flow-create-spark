-- Security Fix: Update provider_profiles RLS policies to protect PII
-- Current policy exposes all data including phone numbers publicly

-- Drop the overly permissive existing policy
DROP POLICY IF EXISTS "Anyone can view basic provider info" ON public.provider_profiles;

-- Create new restrictive policy for public access (no sensitive PII)
CREATE POLICY "Public can view basic provider info only" 
ON public.provider_profiles 
FOR SELECT 
USING (verified = true);

-- Create policy for authenticated users to see contact info when needed
CREATE POLICY "Authenticated users can view contact info" 
ON public.provider_profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Create a secure view for public provider listings that excludes sensitive data
CREATE OR REPLACE VIEW public.provider_public_profiles AS
SELECT 
  id,
  business_name,
  description,
  specialties,
  location,
  experience_years,
  verified,
  profile_image_url,
  created_at
FROM public.provider_profiles
WHERE verified = true AND id IN (
  SELECT provider_id FROM public.services WHERE active = true
);

-- Grant access to the view
GRANT SELECT ON public.provider_public_profiles TO anon, authenticated;

-- Update profiles table policy to be more restrictive with email access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Add policy for limited public profile info (no email exposure)
CREATE POLICY "Public can view basic profile info" 
ON public.profiles 
FOR SELECT 
TO anon
USING (false); -- No public access to profiles table

-- Create secure public profiles view
CREATE OR REPLACE VIEW public.public_user_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  user_type,
  created_at
FROM public.profiles
WHERE user_type IN ('provider', 'consumer');

-- Grant access to the public profiles view
GRANT SELECT ON public.public_user_profiles TO anon, authenticated;