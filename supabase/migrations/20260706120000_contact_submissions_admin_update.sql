-- contact_submissions has RLS policies for INSERT (public, rate-limited) and
-- SELECT (admins), but no UPDATE policy was ever added. RLS defaults to deny
-- when no policy matches, so admin status changes ("Responded"/"Close") in
-- AdminDashboard silently affect zero rows: the update call reports success
-- (the code doesn't chain .select() to notice), but the status never actually
-- changes. Every service booking/lead stays "New" forever. Mirrors the ALL
-- policy already in place for tour_bookings ("Admins can manage all tour
-- bookings" USING (is_admin(auth.uid()))).

DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
