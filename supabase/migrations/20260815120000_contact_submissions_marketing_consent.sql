-- POPIA consent capture on contact submissions.
--
-- An enquiry is not consent to be marketed to. Only an explicitly ticked,
-- default-unchecked box is. This records that tick as a boolean plus the
-- moment it was given, so the consent is auditable rather than assumed.
--
-- marketing_consent defaults to FALSE so every historical row, and any row
-- written by a caller that does not send the field, is correctly treated as
-- "no consent given" rather than unknown.

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS marketing_consent_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN public.contact_submissions.marketing_consent IS
  'TRUE only when the sender explicitly ticked the optional marketing opt-in. Never set this from the act of enquiring.';

COMMENT ON COLUMN public.contact_submissions.marketing_consent_at IS
  'Timestamp the consent was given. NULL when marketing_consent is false.';

-- Only rows carrying real consent may be selected for marketing sends.
CREATE INDEX IF NOT EXISTS contact_submissions_marketing_consent_idx
  ON public.contact_submissions (marketing_consent)
  WHERE marketing_consent = true;
