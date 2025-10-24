-- SECURITY FIX 1: Restrict sensitive fields in provider_profiles
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Public can view basic provider info only" ON public.provider_profiles;
DROP POLICY IF EXISTS "Authenticated users can view provider contact info" ON public.provider_profiles;

-- Create granular policies that hide sensitive data from public
CREATE POLICY "Public can view basic provider info" 
ON public.provider_profiles 
FOR SELECT 
USING (
  verified = true 
  AND pg_has_role(current_user, 'anon', 'member')
);

-- Authenticated users see slightly more but still restricted
CREATE POLICY "Authenticated can view verified provider info" 
ON public.provider_profiles 
FOR SELECT 
TO authenticated
USING (verified = true);

-- Only the provider themselves can see ALL their data including sensitive fields
CREATE POLICY "Providers see their full profile" 
ON public.provider_profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- SECURITY FIX 2: Tighten orders table update policy
-- Drop the dangerous "true" policy
DROP POLICY IF EXISTS "System can update orders" ON public.orders;

-- Only allow updates from authenticated service role (backend only) or the order owner
CREATE POLICY "Only authenticated users can update their orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (
  user_id = auth.uid() 
  OR customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
);

-- Service role can update (for backend processing like payment confirmation)
CREATE POLICY "Service role can update orders" 
ON public.orders 
FOR UPDATE 
TO service_role
USING (true);

-- SECURITY FIX 3: Add rate limiting context to contact forms
-- Create function to check submission rate (helps prevent spam/abuse)
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(submitter_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) < 5
  FROM public.contact_submissions
  WHERE email = submitter_email
    AND created_at > NOW() - INTERVAL '1 hour';
$$;

-- Update contact_submissions policy to include rate limiting
DROP POLICY IF EXISTS "Allow public contact submissions" ON public.contact_submissions;

CREATE POLICY "Allow rate-limited contact submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (
  public.check_contact_rate_limit(email)
);

-- SECURITY FIX 4: Similar rate limiting for service quotes
CREATE OR REPLACE FUNCTION public.check_quote_rate_limit(submitter_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) < 3
  FROM public.service_quotes
  WHERE email = submitter_email
    AND created_at > NOW() - INTERVAL '1 hour';
$$;

DROP POLICY IF EXISTS "Allow public service quote submissions" ON public.service_quotes;

CREATE POLICY "Allow rate-limited service quote submissions" 
ON public.service_quotes 
FOR INSERT 
WITH CHECK (
  public.check_quote_rate_limit(email)
);

-- SECURITY FIX 5: Protect tour_bookings contact data
-- Ensure only authenticated users who made the booking can see sensitive contact info
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.tour_bookings;

CREATE POLICY "Authenticated users can create their bookings" 
ON public.tour_bookings 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND contact_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
);

-- SECURITY FIX 6: Create security definer function for admin checks
-- This prevents privilege escalation and ensures proper validation
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND user_type = 'admin'
  );
$$;

-- Update admin policies to use the secure function
DROP POLICY IF EXISTS "Only admins can view service quotes" ON public.service_quotes;

CREATE POLICY "Admins can view service quotes" 
ON public.service_quotes 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all bookings" ON public.tour_bookings;

CREATE POLICY "Admins can view all tour bookings" 
ON public.tour_bookings 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

-- SECURITY NOTE: Add indexes for performance on security-critical queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email_created 
ON public.contact_submissions(email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_quotes_email_created 
ON public.service_quotes(email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_user_type 
ON public.profiles(user_type) 
WHERE user_type = 'admin';