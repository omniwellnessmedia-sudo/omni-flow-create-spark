-- A working unsubscribe link.
--
-- Every campaign the newsletter editor produced carried a footer link to
-- https://omniwellnessmedia.com/unsubscribe. No such route existed, so the
-- link returned the not found page and there was no way to opt out other
-- than replying and asking someone to edit the row by hand. Direct
-- marketing has to carry a working opt out, so this adds the one function
-- the public page needs.
--
-- The link is addressed by the subscriber's id, which is a uuid the sender
-- puts in the URL for that recipient only. That keeps the page from being
-- an address prober: you cannot type an email in and unsubscribe someone
-- else, and the function never reports whether an id exists.

-- newsletter_subscribers was created in the dashboard, so a preview branch
-- replaying this history from empty does not have it. Guarded rather than
-- assumed, the same way the rest of this history is.
DO $subs$
BEGIN

  -- Make "unsubscribed" answerable.
  --
  -- The column is nullable and the subscribe function never writes it, so a
  -- new subscriber can sit at NULL. Every query in the application asks for
  -- unsubscribed = false, and NULL is not false, so those rows are silently
  -- left out of every send and every count. Anyone with an unsubscribed_at
  -- stamp genuinely opted out and is set to true; everyone else is false.
  UPDATE public.newsletter_subscribers
     SET unsubscribed = (unsubscribed_at IS NOT NULL)
   WHERE unsubscribed IS NULL;

  ALTER TABLE public.newsletter_subscribers
    ALTER COLUMN unsubscribed SET DEFAULT false;

  ALTER TABLE public.newsletter_subscribers
    ALTER COLUMN unsubscribed SET NOT NULL;

EXCEPTION
  WHEN undefined_table OR undefined_column THEN
    RAISE NOTICE 'Skipping newsletter_subscribers backfill, missing dependency: %', SQLERRM;
END
$subs$;

DO $fn$
BEGIN

  CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(subscriber_id uuid)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $body$
  DECLARE
    matched integer;
  BEGIN
    IF subscriber_id IS NULL THEN
      RETURN jsonb_build_object('status', 'not_found');
    END IF;

    UPDATE public.newsletter_subscribers
       SET unsubscribed = true,
           unsubscribed_at = COALESCE(unsubscribed_at, now()),
           updated_at = now()
     WHERE id = subscriber_id;

    GET DIAGNOSTICS matched = ROW_COUNT;

    -- Repeat visits to the same link are a success, not an error. A person
    -- who clicks twice has not failed at anything.
    IF matched = 0 THEN
      RETURN jsonb_build_object('status', 'not_found');
    END IF;

    RETURN jsonb_build_object('status', 'unsubscribed');
  END;
  $body$;

  -- Anonymous, because the recipient of a newsletter is not signed in and
  -- must not have to be. The uuid in the link is the only thing that
  -- authorises the change, and it changes nothing else.
  GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(uuid) TO anon;
  GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(uuid) TO authenticated;

  COMMENT ON FUNCTION public.unsubscribe_newsletter(uuid) IS
    'Marks one newsletter subscriber as unsubscribed, addressed by the id carried in their own campaign footer link. Returns {status: unsubscribed | not_found}.';

EXCEPTION
  WHEN undefined_table OR undefined_object THEN
    RAISE NOTICE 'Skipping unsubscribe_newsletter, missing dependency: %', SQLERRM;
END
$fn$;
