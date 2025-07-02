-- Update default wellcoin balance to 50 for new users
ALTER TABLE public.consumer_profiles ALTER COLUMN wellcoin_balance SET DEFAULT 50;
ALTER TABLE public.provider_profiles ALTER COLUMN wellcoin_balance SET DEFAULT 50;

-- Add a welcome transaction when a user signs up
CREATE OR REPLACE FUNCTION public.create_welcome_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create a welcome bonus transaction
  INSERT INTO public.transactions (
    user_id,
    transaction_type,
    description,
    amount_wellcoins,
    amount_zar,
    status
  ) VALUES (
    NEW.id,
    'bonus',
    'Welcome to Omni Wellness! Your free WellCoins to get started.',
    50,
    0,
    'completed'
  );
  
  RETURN NEW;
END;
$$;

-- Create triggers for both provider and consumer profiles
CREATE TRIGGER create_welcome_transaction_provider
  AFTER INSERT ON public.provider_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_welcome_transaction();

CREATE TRIGGER create_welcome_transaction_consumer
  AFTER INSERT ON public.consumer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_welcome_transaction();