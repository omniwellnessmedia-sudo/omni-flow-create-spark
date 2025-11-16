-- Phase 3: Security Events Monitoring
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_security_events_severity ON public.security_events(severity, timestamp DESC);
CREATE INDEX idx_security_events_unresolved ON public.security_events(resolved) WHERE resolved = FALSE;

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage security events"
  ON public.security_events FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

COMMENT ON TABLE public.security_events IS 'Security event logging for monitoring unauthorized access attempts and suspicious activity';