
-- Create partner_applications table
CREATE TABLE public.partner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_category TEXT NOT NULL,
  experience_level TEXT,
  bio TEXT,
  website TEXT,
  has_certifications BOOLEAN DEFAULT false,
  has_insurance BOOLEAN DEFAULT false,
  offers_online BOOLEAN DEFAULT false,
  can_travel BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  referral_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create partner_referrals table
CREATE TABLE public.partner_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_application_id UUID NOT NULL REFERENCES public.partner_applications(id),
  referral_code TEXT NOT NULL,
  visitor_ip_hash TEXT,
  page_visited TEXT,
  converted BOOLEAN DEFAULT false,
  conversion_type TEXT,
  commission_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_referrals ENABLE ROW LEVEL SECURITY;

-- partner_applications: anyone can insert (public applications)
CREATE POLICY "Anyone can submit partner applications"
ON public.partner_applications FOR INSERT
WITH CHECK (true);

-- partner_applications: only admins can view
CREATE POLICY "Admins can view partner applications"
ON public.partner_applications FOR SELECT
USING (public.is_admin(auth.uid()));

-- partner_applications: only admins can update
CREATE POLICY "Admins can update partner applications"
ON public.partner_applications FOR UPDATE
USING (public.is_admin(auth.uid()));

-- partner_referrals: anyone can insert (tracking)
CREATE POLICY "Anyone can create referral tracking"
ON public.partner_referrals FOR INSERT
WITH CHECK (true);

-- partner_referrals: admins can view all
CREATE POLICY "Admins can view all referrals"
ON public.partner_referrals FOR SELECT
USING (public.is_admin(auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_partner_applications_updated_at
BEFORE UPDATE ON public.partner_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for referral lookups
CREATE INDEX idx_partner_referrals_code ON public.partner_referrals(referral_code);
CREATE INDEX idx_partner_applications_email ON public.partner_applications(email);
CREATE INDEX idx_partner_applications_status ON public.partner_applications(status);
