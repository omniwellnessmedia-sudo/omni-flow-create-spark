-- Update Calendly configuration with provided keys
-- Note: These should be stored in Supabase Edge Function Secrets for security

-- First, let's check if we have a calendly_config table, if not create it
CREATE TABLE IF NOT EXISTS public.calendly_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  webhook_signing_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.calendly_config ENABLE ROW LEVEL SECURITY;

-- Only allow admin access to calendly config
CREATE POLICY "Only admins can manage calendly config"
ON public.calendly_config
FOR ALL
USING (false); -- This ensures only direct database access or edge functions can manage this

-- Insert or update the calendly configuration
INSERT INTO public.calendly_config (client_id, client_secret, webhook_signing_key)
VALUES (
  'VKO_xxtZZisfAI56TxllEXAZwPt0JSBMk75DAf-HoQU',
  'AVA5Lf6FXQh0YfH2SPlzDuQ6DkjdwxChv75Eye5ys-Y',
  '7g0rbN5Q3srzZ6x1xQVtiuwuHcuxZjVTHFOVLq92nm0'
)
ON CONFLICT (id) 
DO UPDATE SET 
  client_id = EXCLUDED.client_id,
  client_secret = EXCLUDED.client_secret,
  webhook_signing_key = EXCLUDED.webhook_signing_key,
  updated_at = NOW();