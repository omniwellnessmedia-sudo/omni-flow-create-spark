-- Let a super admin grant and revoke roles by email, without opening profiles.
--
-- THE PROBLEM. The role manager in /admin/tools resolves a colleague's email
-- against public.profiles and then inserts into public.user_roles. Neither
-- step can work from the browser:
--
--   1. profiles has exactly one SELECT policy for authenticated users,
--      "Users can view their own profile" USING (auth.uid() = id). There is
--      no admin read policy. So the lookup returns zero rows for everyone
--      except yourself, with no error, and the screen then tells you the
--      person needs to sign up first. They already had.
--
--   2. Widening that policy is the wrong fix. profiles carries personal data
--      and the reason it is locked down is sound. Granting a role needs one
--      specific lookup, not general read access.
--
-- THE SHAPE OF THE FIX. Two SECURITY DEFINER functions that do the whole
-- operation server side and are themselves guarded on super_admin, which is
-- the role the "Super admins can manage user roles" policy already requires
-- for writes. The client never reads profiles and never learns anything about
-- an address beyond whether an account exists for it.
--
-- WHY A DISCRIMINATED RESULT. "No account with that address", "they already
-- have that role" and "you are not allowed to do this" need different words
-- on screen. Returning a status string keeps that distinction instead of
-- collapsing everything into a failed insert.
--
-- REVOKING THE LAST SUPER ADMIN IS REFUSED. If the only super_admin removes
-- their own super_admin row, nobody can grant or revoke anything ever again
-- through the application, and the recovery is a manual SQL statement against
-- production. The function refuses that specific case.
--
-- Idempotent and safe to replay. Guarded per repo convention.
--
-- No em dashes in this file.

DO $fns$
BEGIN

CREATE OR REPLACE FUNCTION public.grant_role_by_email(p_email text, p_role text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target uuid;
  inserted int;
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RETURN jsonb_build_object('status', 'forbidden');
  END IF;

  IF p_role NOT IN ('catalogue_manager', 'accountant', 'admin') THEN
    -- super_admin is deliberately not grantable from the application.
    RETURN jsonb_build_object('status', 'role_not_allowed');
  END IF;

  SELECT id INTO target
  FROM public.profiles
  WHERE lower(email) = lower(btrim(p_email))
  LIMIT 1;

  IF target IS NULL THEN
    RETURN jsonb_build_object('status', 'no_account');
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target, p_role::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  GET DIAGNOSTICS inserted = ROW_COUNT;
  RETURN jsonb_build_object(
    'status', CASE WHEN inserted = 1 THEN 'granted' ELSE 'already_had_it' END,
    'user_id', target
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_role(p_user_id uuid, p_role text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  remaining int;
  removed int;
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RETURN jsonb_build_object('status', 'forbidden');
  END IF;

  IF p_role = 'super_admin' THEN
    SELECT count(*) INTO remaining FROM public.user_roles WHERE role::text = 'super_admin';
    IF remaining <= 1 THEN
      -- Removing the last one locks everybody out of role management, and
      -- the only way back is a SQL statement against production.
      RETURN jsonb_build_object('status', 'last_super_admin');
    END IF;
  END IF;

  DELETE FROM public.user_roles WHERE user_id = p_user_id AND role::text = p_role;
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN jsonb_build_object('status', CASE WHEN removed > 0 THEN 'revoked' ELSE 'not_found' END);
END;
$$;

-- Callable by any signed in account: both functions check super_admin
-- themselves and tell an unauthorised caller so, rather than failing opaquely.
GRANT EXECUTE ON FUNCTION public.grant_role_by_email(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_role(uuid, text) TO authenticated;

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping role grant functions, missing dependency: %', SQLERRM;
END
$fns$;

COMMENT ON FUNCTION public.grant_role_by_email(text, text) IS
  'Resolves an email to an account and grants it a role, entirely server side, so the admin screen never needs read access to public.profiles. Requires super_admin. Returns {status}: granted, already_had_it, no_account, role_not_allowed or forbidden.';
