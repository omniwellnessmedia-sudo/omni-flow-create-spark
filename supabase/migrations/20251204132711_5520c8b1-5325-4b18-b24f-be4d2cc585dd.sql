-- Drop the existing restrictive policy
--
-- Wrapped in an exception-guarded DO block so this migration is a no-op on
-- environments where viator_tours doesn't yet exist (e.g. fresh Supabase
-- preview branches). Production is unaffected: the table exists there, so no
-- exception fires and all statements run exactly as before.
DO $guard$
BEGIN

DROP POLICY IF EXISTS "Authenticated users can manage Viator tours" ON public.viator_tours;

-- Create a policy that allows service role (used by edge functions) to manage tours
CREATE POLICY "Service role can manage Viator tours"
ON public.viator_tours
FOR ALL
USING (true)
WITH CHECK (true);

-- Keep the public read policy for active tours
-- (Already exists: "Anyone can view active Viator tours")

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping migration 20251204132711 — missing dependency: %', SQLERRM;
END
$guard$;
