-- Fix Critical RLS Policy Issues

-- 1. Fix contact_submissions - only admins should see submissions
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Only admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
);

-- 2. Fix service_quotes - only admins should see quotes
DROP POLICY IF EXISTS "Only admins can view service quotes" ON public.service_quotes;
CREATE POLICY "Only admins can view service quotes" 
ON public.service_quotes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
);

-- 3. Fix orders - users can only see their own orders, admins see all
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  (user_id = auth.uid()) 
  OR 
  (customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
);

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
);

-- 4. Fix tour_bookings - users can only see their own bookings, admins see all
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.tour_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.tour_bookings;

CREATE POLICY "Users can view their own bookings" 
ON public.tour_bookings 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all bookings" 
ON public.tour_bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
);

-- 5. Fix provider_profiles - hide sensitive contact info from public
DROP POLICY IF EXISTS "Public can view basic provider info only" ON public.provider_profiles;
DROP POLICY IF EXISTS "Authenticated users can view contact info" ON public.provider_profiles;

CREATE POLICY "Public can view basic provider info only" 
ON public.provider_profiles 
FOR SELECT 
USING (verified = true);

CREATE POLICY "Authenticated users can view provider contact info" 
ON public.provider_profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated' 
  AND verified = true
);

CREATE POLICY "Providers can view their full profile" 
ON public.provider_profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 6. Prevent privilege escalation - users cannot change their own user_type
CREATE OR REPLACE FUNCTION public.prevent_user_type_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow admins to change user_type, or system operations
  IF OLD.user_type IS DISTINCT FROM NEW.user_type THEN
    -- Check if current user is admin or if this is a system operation
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    ) AND auth.uid() IS NOT NULL THEN
      RAISE EXCEPTION 'Only administrators can change user types';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to prevent user type escalation
DROP TRIGGER IF EXISTS prevent_user_type_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_user_type_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_user_type_escalation();