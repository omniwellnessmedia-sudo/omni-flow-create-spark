-- Create notification_logs table for audit trail
CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL, -- 'lead_capture', 'sale_complete', 'email', 'whatsapp'
  recipient TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  message_id TEXT, -- Resend/WhatsApp message ID
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view notification logs
CREATE POLICY "Admins can view notification logs" ON public.notification_logs
  FOR SELECT USING (is_admin(auth.uid()));

-- Service role can insert logs (from edge functions)
CREATE POLICY "Service role can insert notification logs" ON public.notification_logs
  FOR INSERT WITH CHECK (true);

-- Add index for efficient querying
CREATE INDEX idx_notification_logs_type ON public.notification_logs(notification_type);
CREATE INDEX idx_notification_logs_created_at ON public.notification_logs(created_at DESC);