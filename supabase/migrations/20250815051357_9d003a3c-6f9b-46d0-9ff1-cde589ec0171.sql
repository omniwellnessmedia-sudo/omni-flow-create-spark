-- Fix RLS policy for calendly_config table to allow admin access only
-- Drop the existing overly restrictive policy
DROP POLICY IF EXISTS "Only admins can manage calendly config" ON public.calendly_config;

-- Create proper RLS policy that allows only admin users to manage calendly config
CREATE POLICY "Only admins can manage calendly config" 
ON public.calendly_config
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
);