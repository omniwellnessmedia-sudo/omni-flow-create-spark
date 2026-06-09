-- Create function to check and create provider profile when needed
--
-- Wrapped in an exception-guarded DO block so this migration is a no-op on
-- environments where referenced objects don't yet exist (e.g. fresh Supabase
-- preview branches replaying history out of prod-state). Production is
-- unaffected: every object exists there, so no exception fires and all
-- statements run exactly as before.
DO $guard$
BEGIN

CREATE OR REPLACE FUNCTION public.ensure_provider_profile(user_id uuid)
RETURNS void AS $$
BEGIN
  -- First, update the user's type to provider if they're trying to create services
  UPDATE public.profiles
  SET user_type = 'provider'
  WHERE id = user_id AND user_type != 'provider';

  -- Create provider profile if it doesn't exist
  INSERT INTO public.provider_profiles (id, wellcoin_balance, verified)
  VALUES (user_id, 50, false)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the services RLS policy to allow creating with automatic provider profile creation
DROP POLICY IF EXISTS "Providers can manage their own services" ON public.services;

CREATE POLICY "Providers can manage their own services"
ON public.services
FOR ALL
USING (
  auth.uid() = provider_id AND (
    auth.uid() IN (SELECT id FROM provider_profiles) OR
    (SELECT user_type FROM profiles WHERE id = auth.uid()) = 'provider'
  )
)
WITH CHECK (
  auth.uid() = provider_id AND (
    auth.uid() IN (SELECT id FROM provider_profiles) OR
    (SELECT user_type FROM profiles WHERE id = auth.uid()) = 'provider'
  )
);

-- Create trigger to automatically ensure provider profile on service creation
CREATE OR REPLACE FUNCTION public.auto_create_provider_profile()
RETURNS trigger AS $$
BEGIN
  -- Ensure provider profile exists when creating a service
  PERFORM public.ensure_provider_profile(NEW.provider_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_create_provider_profile ON public.services;
CREATE TRIGGER trigger_auto_create_provider_profile
  BEFORE INSERT ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_provider_profile();

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping migration 20250711124713 — missing dependency: %', SQLERRM;
END
$guard$;
