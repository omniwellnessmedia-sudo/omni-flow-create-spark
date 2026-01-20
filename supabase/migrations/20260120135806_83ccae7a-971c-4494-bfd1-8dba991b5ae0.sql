-- Create table for UWC Programme lead tracking
CREATE TABLE public.uwc_programme_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Contact Info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  institution TEXT,
  
  -- Recruitment Channel Data
  channel TEXT NOT NULL CHECK (channel IN ('uwc_institutional', 'professional', 'digital', 'study_abroad')),
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Pipeline Stage
  stage TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'applied', 'accepted', 'enrolled', 'withdrawn')),
  
  -- Programme Details
  cohort TEXT DEFAULT '2026-07',
  is_international BOOLEAN DEFAULT false,
  
  -- Notes & Assignment
  notes TEXT,
  assigned_to TEXT,
  
  -- Follow-up tracking
  last_contact_date TIMESTAMPTZ,
  next_follow_up_date TIMESTAMPTZ,
  follow_up_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.uwc_programme_leads ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can view all UWC leads"
ON public.uwc_programme_leads
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert UWC leads"
ON public.uwc_programme_leads
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update UWC leads"
ON public.uwc_programme_leads
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete UWC leads"
ON public.uwc_programme_leads
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Allow public inserts for lead capture form (with validation)
CREATE POLICY "Public can submit interest forms"
ON public.uwc_programme_leads
FOR INSERT
WITH CHECK (stage = 'lead');

-- Create index for faster queries
CREATE INDEX idx_uwc_leads_stage ON public.uwc_programme_leads(stage);
CREATE INDEX idx_uwc_leads_channel ON public.uwc_programme_leads(channel);
CREATE INDEX idx_uwc_leads_created ON public.uwc_programme_leads(created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_uwc_leads_updated_at
BEFORE UPDATE ON public.uwc_programme_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();