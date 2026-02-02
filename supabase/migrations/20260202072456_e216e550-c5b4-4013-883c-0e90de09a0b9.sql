-- Add lead source and nurture tracking to newsletter_subscribers
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'website',
ADD COLUMN IF NOT EXISTS nurture_sequence_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS nurture_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMP WITH TIME ZONE;

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

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_session ON public.chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_lead ON public.chatbot_conversations(lead_captured);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_nurture ON public.newsletter_subscribers(nurture_sequence_step);