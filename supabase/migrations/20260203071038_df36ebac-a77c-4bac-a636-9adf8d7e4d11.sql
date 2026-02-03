-- Fix: Remove overly permissive UPDATE policies on chatbot_conversations
-- The edge function uses SERVICE_ROLE_KEY which bypasses RLS, so client-side updates should be blocked

-- Drop the permissive UPDATE policies
DROP POLICY IF EXISTS "Allow public update for chatbot sessions" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Allow public update on chatbot_conversations" ON public.chatbot_conversations;

-- Keep existing INSERT policy for new conversations (public can start chats)
-- Keep existing SELECT policy if any for reading own session
-- No UPDATE needed from client - edge function handles all updates via service role