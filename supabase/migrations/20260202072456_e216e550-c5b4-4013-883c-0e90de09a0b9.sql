-- Add lead source and nurture tracking to newsletter_subscribers
-- Exception-guarded on 4 September 2026 per docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md:
-- public.newsletter_subscribers was created via the dashboard and has no CREATE
-- migration, so on a fresh preview branch this block must skip rather than fail
-- the replay. On production the table exists and the DDL runs as before.
DO $newsletter_guard$
BEGIN
  ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS nurture_sequence_step INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nurture_started_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMP WITH TIME ZONE;

  CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_nurture ON public.newsletter_subscribers(nurture_sequence_step);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping newsletter_subscribers enhancement, missing dependency: %', SQLERRM;
END
$newsletter_guard$;

-- Create table for chatbot conversations tracking
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_email TEXT,
  messages JSONB DEFAULT '[]'::jsonb,
  products_recommended JSONB DEFAULT '[]'::jsonb,
  lead_captured BOOLEAN DEFAULT false,
  lead_source TEXT DEFAULT 'roambuddy-sales-bot',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Allow public insert for anonymous chatbot users
CREATE POLICY "Allow public insert for chatbot"
ON public.chatbot_conversations
FOR INSERT
WITH CHECK (true);

-- Allow public update for chatbot sessions
CREATE POLICY "Allow public update for chatbot sessions"
ON public.chatbot_conversations
FOR UPDATE
USING (true);

-- Guarded: is_admin() and update_updated_at_column() come from earlier
-- migrations that a preview branch may have skipped.
DO $chatbot_admin_guard$
BEGIN
  -- Allow admins to view all conversations
  CREATE POLICY "Admins can view all chatbot conversations"
  ON public.chatbot_conversations
  FOR SELECT
  USING (is_admin(auth.uid()));

  -- Create trigger for updated_at
  CREATE TRIGGER update_chatbot_conversations_updated_at
  BEFORE UPDATE ON public.chatbot_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping chatbot admin policy and trigger, missing dependency: %', SQLERRM;
END
$chatbot_admin_guard$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_session ON public.chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_lead ON public.chatbot_conversations(lead_captured);
