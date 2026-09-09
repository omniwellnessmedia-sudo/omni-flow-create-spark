-- Paid booking links, off until somebody switches one on.
--
-- The Clarity Session can be booked and paid for in one step through a
-- Cal.com link with Cal Pay enabled. The link exists and the price is
-- live on Cal.com, but money cannot leave that balance yet: Cal Pay runs
-- on Whop, the balance is held in USD at a US bank, identity
-- verification is outstanding and no payout method has been added.
--
-- So the row is seeded EMPTY on purpose. The site renders no book and pay
-- button until somebody pastes a URL in, which means the button cannot go
-- live before the money can actually reach the account. A link that takes
-- R1,500 into a balance nobody can withdraw is worse than no link.
--
-- Paste the URL only once identity verification has passed AND a South
-- African payout method has been added and accepted.

DO $seed$
BEGIN

  INSERT INTO public.site_settings (key, value, label, help, is_public)
  VALUES (
    'booking_url_clarity_session',
    '',
    'Clarity Session booking link',
    'A Cal.com link with payment enabled, for example https://cal.com/your-name/ai-business-clarity-session. Leave this empty and no book and pay button appears anywhere. Only fill it in once the payment processor can actually pay out to a South African bank account, because the button charges people the moment it is live.',
    true
  )
  ON CONFLICT (key) DO NOTHING;

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping booking link seed, missing dependency: %', SQLERRM;
END
$seed$;
