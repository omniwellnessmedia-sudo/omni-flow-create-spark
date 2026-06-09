-- Fix RLS policy for calendly_config table to allow admin access only
-- NOTE: a later migration (20250815062709…) drops the calendly_config table entirely
-- (secrets moved to Edge Function env vars). On fresh Supabase preview branches where
-- the table may have already been removed in a prior step, DROP POLICY / CREATE POLICY
-- on a missing table errors out and blocks every subsequent migration — including PR
-- migrations downstream. Wrapping in a table-existence check makes this idempotent and
-- safe whether the table is still present (preserves the original intent: tighten the
-- policy to admin-only) or already gone (no-op, same end state).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'calendly_config'
  ) THEN
    DROP POLICY IF EXISTS "Only admins can manage calendly config" ON public.calendly_config;

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
  END IF;
END $$;
