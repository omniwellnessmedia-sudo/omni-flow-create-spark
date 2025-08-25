-- Fix Security Definer Views and Function Issues

-- 1. Drop the problematic Security Definer views
DROP VIEW IF EXISTS public.provider_public_profiles CASCADE;
DROP VIEW IF EXISTS public.public_user_profiles CASCADE;

-- 2. Fix the function search path for prevent_user_type_escalation
CREATE OR REPLACE FUNCTION public.prevent_user_type_escalation()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- 3. Fix other functions that might have search path issues
CREATE OR REPLACE FUNCTION public.update_wellcoin_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.transaction_type IN ('earning', 'bonus', 'referral') THEN
        -- Add to balance
        IF EXISTS (SELECT 1 FROM public.provider_profiles WHERE id = NEW.user_id) THEN
            UPDATE public.provider_profiles 
            SET wellcoin_balance = COALESCE(wellcoin_balance, 0) + NEW.amount_wellcoins
            WHERE id = NEW.user_id;
        END IF;
        
        IF EXISTS (SELECT 1 FROM public.consumer_profiles WHERE id = NEW.user_id) THEN
            UPDATE public.consumer_profiles 
            SET wellcoin_balance = COALESCE(wellcoin_balance, 0) + NEW.amount_wellcoins
            WHERE id = NEW.user_id;
        END IF;
    ELSIF NEW.transaction_type = 'spending' THEN
        -- Subtract from balance
        IF EXISTS (SELECT 1 FROM public.provider_profiles WHERE id = NEW.user_id) THEN
            UPDATE public.provider_profiles 
            SET wellcoin_balance = COALESCE(wellcoin_balance, 0) - NEW.amount_wellcoins
            WHERE id = NEW.user_id;
        END IF;
        
        IF EXISTS (SELECT 1 FROM public.consumer_profiles WHERE id = NEW.user_id) THEN
            UPDATE public.consumer_profiles 
            SET wellcoin_balance = COALESCE(wellcoin_balance, 0) - NEW.amount_wellcoins
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 4. Fix other Security Definer functions
CREATE OR REPLACE FUNCTION public.ensure_provider_profile(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'user_type', 'consumer')
  );
  RETURN new;
END;
$$;