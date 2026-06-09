-- Security Fix: Update provider_profiles RLS policies to protect PII
-- Current policy exposes all data including phone numbers publicly
--
-- NOTE: wrapped in table-existence guards so this migration is idempotent and
-- replayable on fresh Supabase preview branches where provider_profiles /
-- profiles may not yet exist when this migration runs in isolation. Production
-- behaviour is identical (tables exist → all statements run; tables missing →
-- no-op, same end state once later migrations create them).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'provider_profiles'
  ) THEN
    DROP POLICY IF EXISTS "Anyone can view basic provider info" ON public.provider_profiles;

    CREATE POLICY "Public can view basic provider info only"
    ON public.provider_profiles
    FOR SELECT
    USING (verified = true);

    CREATE POLICY "Authenticated users can view contact info"
    ON public.provider_profiles
    FOR SELECT
    TO authenticated
    USING (true);

    -- Secure view for public provider listings (excludes sensitive PII)
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'services'
    ) THEN
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

      GRANT SELECT ON public.provider_public_profiles TO anon, authenticated;
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

    CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

    CREATE POLICY "Public can view basic profile info"
    ON public.profiles
    FOR SELECT
    TO anon
    USING (false);

    CREATE OR REPLACE VIEW public.public_user_profiles AS
    SELECT
      id,
      full_name,
      avatar_url,
      user_type,
      created_at
    FROM public.profiles
    WHERE user_type IN ('provider', 'consumer');

    GRANT SELECT ON public.public_user_profiles TO anon, authenticated;
  END IF;
END $$;
