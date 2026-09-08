-- The task board becomes a task board.
--
-- It stored everything in localStorage under omni_admin_tasks, so a task
-- Feroza created was invisible to Chad, invisible to her on her phone, and
-- gone the moment she cleared site data. It also seeded three invented
-- sample tasks on first load, which read as real work assigned to someone.
--
-- This gives it a table so the board shows the same work to everyone who
-- opens it. It seeds nothing.

DO $tasks$
BEGIN

  CREATE TABLE IF NOT EXISTS public.admin_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL DEFAULT '',
    type text NOT NULL DEFAULT 'general'
      CHECK (type IN ('sales', 'newsletter', 'content', 'outreach', 'general')),
    priority text NOT NULL DEFAULT 'medium'
      CHECK (priority IN ('low', 'medium', 'high')),
    status text NOT NULL DEFAULT 'todo'
      CHECK (status IN ('todo', 'in_progress', 'done')),
    due_date date,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  -- A title with nothing in it is not a task. The form already refuses one,
  -- but the form is not the only way in.
  ALTER TABLE public.admin_tasks
    DROP CONSTRAINT IF EXISTS admin_tasks_title_not_blank;
  ALTER TABLE public.admin_tasks
    ADD CONSTRAINT admin_tasks_title_not_blank CHECK (length(btrim(title)) > 0);

  CREATE INDEX IF NOT EXISTS admin_tasks_status_idx ON public.admin_tasks (status);
  CREATE INDEX IF NOT EXISTS admin_tasks_created_at_idx ON public.admin_tasks (created_at DESC);

  ALTER TABLE public.admin_tasks ENABLE ROW LEVEL SECURITY;

  COMMENT ON TABLE public.admin_tasks IS
    'The shared admin task board. Replaces a localStorage list that was private to one browser.';

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping admin_tasks table, missing dependency: %', SQLERRM;
END
$tasks$;

DO $policies$
BEGIN

  DROP POLICY IF EXISTS "Staff can read tasks" ON public.admin_tasks;
  DROP POLICY IF EXISTS "Staff can create tasks" ON public.admin_tasks;
  DROP POLICY IF EXISTS "Staff can update tasks" ON public.admin_tasks;
  DROP POLICY IF EXISTS "Staff can delete tasks" ON public.admin_tasks;

  -- The same role set that already runs the calendar and the catalogue.
  -- Written out rather than routed through is_events_manager, because a
  -- policy on a tasks table should not be named after events.
  CREATE POLICY "Staff can read tasks" ON public.admin_tasks
    FOR SELECT TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  CREATE POLICY "Staff can create tasks" ON public.admin_tasks
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  CREATE POLICY "Staff can update tasks" ON public.admin_tasks
    FOR UPDATE TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  -- Deleting is held to admin. Moving a card to Done is the reversible act
  -- and everyone can do that; removing someone else's task is not.
  CREATE POLICY "Staff can delete tasks" ON public.admin_tasks
    FOR DELETE TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('admin', 'super_admin')
    ));

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping admin_tasks policies, missing dependency: %', SQLERRM;
END
$policies$;

DO $touch$
BEGIN

  CREATE OR REPLACE FUNCTION public.touch_admin_tasks_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  AS $body$
  BEGIN
    NEW.updated_at := now();
    RETURN NEW;
  END;
  $body$;

  DROP TRIGGER IF EXISTS admin_tasks_touch_updated_at ON public.admin_tasks;
  CREATE TRIGGER admin_tasks_touch_updated_at
    BEFORE UPDATE ON public.admin_tasks
    FOR EACH ROW EXECUTE FUNCTION public.touch_admin_tasks_updated_at();

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping admin_tasks trigger, missing dependency: %', SQLERRM;
END
$touch$;
