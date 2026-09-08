-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

DO $g1$
BEGIN
-- contact_submissions has RLS policies for INSERT (public, rate-limited) and
-- SELECT (admins), but no UPDATE policy was ever added. RLS defaults to deny
-- when no policy matches, so admin status changes ("Responded"/"Close") in
-- AdminDashboard silently affect zero rows: the update call reports success
-- (the code doesn't chain .select() to notice), but the status never actually
-- changes. Every service booking/lead stays "New" forever. Mirrors the ALL
-- policy already in place for tour_bookings ("Admins can manage all tour
-- bookings" USING (is_admin(auth.uid()))).

DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;

DO $g2$
BEGIN
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g2$;
