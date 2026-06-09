-- Fix: Remove overly permissive UPDATE policies on chatbot_conversations
-- The edge function uses SERVICE_ROLE_KEY which bypasses RLS, so client-side updates should be blocked
--
-- Wrapped in an exception-guarded DO block so this migration is a no-op on
-- environments where chatbot_conversations doesn't yet exist (e.g. fresh
-- Supabase preview branches). Production is unaffected: the table exists there,
-- so no exception fires and all statements run exactly as before.
DO $guard$
BEGIN

-- Drop the permissive UPDATE policies
DROP POLICY IF EXISTS "Allow public update for chatbot sessions" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Allow public update on chatbot_conversations" ON public.chatbot_conversations;

-- Keep existing INSERT policy for new conversations (public can start chats)
-- Keep existing SELECT policy if any for reading own session
-- No UPDATE needed from client - edge function handles all updates via service role

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping migration 20260203071038 — missing dependency: %', SQLERRM;
END
$guard$;
