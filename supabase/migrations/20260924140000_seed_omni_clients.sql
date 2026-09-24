-- Omni's own client book, on the Pipeline.
--
-- Six accounts moving into the Omni back end so the whole tool runs end to
-- end on real names: board, client card, quotation, payment.
--
-- WHAT IS ASSERTED AND WHAT IS NOT. The organisation names and the service
-- line are from Tumelo. Nothing else is. No email address, contact person
-- or phone number is written here, because none is on file in this
-- repository and a guessed address on a client record is worse than a
-- blank one: somebody will send to it. Those fields are null and the
-- drawer fills them in.
--
-- THE STAGES ARE A STARTING POINT, NOT A RECORD. Each row is placed where
-- the account most likely sits so the board demonstrates the flow, and
-- every note says so. Confirm each one before anybody reads the board as
-- fact or quotes off it.
--
-- Re-running this changes nothing: every row is keyed on the organisation
-- name and skipped if it is already there, so it cannot double up a client
-- that the team has since edited.

DO $clients$
BEGIN

  INSERT INTO public.outreach_leads
    (organisation, sector, contact_method, programme, status, campaign, notes)
  SELECT v.organisation, v.sector, 'existing client', v.programme, v.status, 'omni-clients', v.notes
  FROM (VALUES
    (
      'Beauty Without Cruelty SA',
      'Non-profit',
      'Social media management',
      'contacted',
      'Omni manages the website and the social. Stage is a starting point for the 24 September review, confirm before relying on it.'
    ),
    (
      'Eduponics',
      'Education',
      'Social media management',
      'contacted',
      'Portfolio entity, already in the accounting entity list. Stage is a starting point, confirm it.'
    ),
    (
      'Landmark Foundation',
      'Non-profit',
      'Social media management',
      'quoted',
      'Stage is a starting point for the 24 September review, confirm before relying on it. No quotation has been issued from this system yet.'
    ),
    (
      'O2 Architects',
      'Professional services',
      'Brand and content audit',
      'contacted',
      'Brand and content work. Stage is a starting point, confirm it.'
    ),
    (
      'Noni Funeral Home',
      'Funeral services',
      'Social media management',
      'contacted',
      'Stage is a starting point, confirm it.'
    ),
    (
      'Tekkers',
      'Retail',
      'Social media management',
      'new',
      'Stage is a starting point, confirm it.'
    )
  ) AS v(organisation, sector, programme, status, notes)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.outreach_leads o WHERE lower(o.organisation) = lower(v.organisation)
  );

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping Omni client seed, missing dependency: %', SQLERRM;
END
$clients$;
