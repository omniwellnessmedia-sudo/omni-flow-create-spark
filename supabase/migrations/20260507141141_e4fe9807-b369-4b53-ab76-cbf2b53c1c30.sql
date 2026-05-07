
-- CRM: outreach pipeline + lead activities + archive flags
CREATE TABLE IF NOT EXISTS public.outreach_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation text NOT NULL,
  sector text,
  contact_method text,
  contact_email text,
  contact_person text,
  programme text,
  website text,
  csr_url text,
  status text NOT NULL DEFAULT 'no_response',
  campaign text,
  last_contacted date,
  follow_up_due date,
  notes text,
  owner_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.outreach_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage outreach leads" ON public.outreach_leads
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER outreach_leads_updated
  BEFORE UPDATE ON public.outreach_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_outreach_status ON public.outreach_leads(status);
CREATE INDEX idx_outreach_campaign ON public.outreach_leads(campaign);

-- Activity log for all lead types
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type text NOT NULL,
  lead_id uuid NOT NULL,
  actor_id uuid,
  action text NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lead activities" ON public.lead_activities
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE INDEX idx_lead_activities_lookup ON public.lead_activities(lead_type, lead_id);

-- Add archive + assignment + internal notes to existing tables
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS internal_notes text;

ALTER TABLE public.service_quotes
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS internal_notes text;
