
-- Fix overly permissive RLS policies flagged by security scanner

-- 1. newsletter_subscribers: remove public UPDATE policy
DROP POLICY IF EXISTS "Allow public update on newsletter_subscribers" ON public.newsletter_subscribers;

-- 2. tour_bookings: remove unauthenticated INSERT (authenticated policy already exists)
DROP POLICY IF EXISTS "Users can create tour bookings" ON public.tour_bookings;

-- 3. booking_leases: restrict UPDATE to service_role / admins
DROP POLICY IF EXISTS "System can update leases" ON public.booking_leases;
CREATE POLICY "Service role can update leases"
ON public.booking_leases
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- 4. booking_requests: require authentication for INSERT
DROP POLICY IF EXISTS "Users can create booking requests" ON public.booking_requests;
CREATE POLICY "Authenticated users can create booking requests"
ON public.booking_requests
FOR INSERT
TO authenticated
WITH CHECK (consumer_id = auth.uid());

-- 5. Lock down content tables to admins only for write operations
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can manage deals" ON public.product_deals;
CREATE POLICY "Admins can manage deals" ON public.product_deals
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can manage tours" ON public.tours;
CREATE POLICY "Admins can manage tours" ON public.tours
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can manage itineraries" ON public.tour_itineraries;
CREATE POLICY "Admins can manage itineraries" ON public.tour_itineraries
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.tour_categories;
CREATE POLICY "Admins can manage categories" ON public.tour_categories
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON public.tour_testimonials;
CREATE POLICY "Admins can manage testimonials" ON public.tour_testimonials
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.roambuddy_services;
CREATE POLICY "Admins can manage roambuddy services" ON public.roambuddy_services
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 6. transactions: remove public INSERT (handled by triggers / service role)
DROP POLICY IF EXISTS "System can insert transactions" ON public.transactions;
CREATE POLICY "Service role can insert transactions"
ON public.transactions
FOR INSERT
TO service_role
WITH CHECK (true);

-- 7. affiliate_commissions: restrict INSERT to service role
DROP POLICY IF EXISTS "System can insert commissions" ON public.affiliate_commissions;
CREATE POLICY "Service role can insert commissions"
ON public.affiliate_commissions
FOR INSERT
TO service_role
WITH CHECK (true);

-- 8. team_members: restrict SELECT to admins
DROP POLICY IF EXISTS "Authenticated users can view team members" ON public.team_members;
CREATE POLICY "Admins can view team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- 9. business-documents bucket: remove public SELECT.
-- Owner-scoped and admin SELECT policies already exist.
DROP POLICY IF EXISTS "Anyone can view business documents" ON storage.objects;
