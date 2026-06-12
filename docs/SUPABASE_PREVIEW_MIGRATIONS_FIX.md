# Supabase Preview Migrations — Why the Check Goes Red, and the Permanent Fix

_Last updated: 2026-06-09_

## TL;DR

Supabase preview branches replay the **entire `supabase/migrations/` history** against a
branch database that does **not** carry every production object forward. Several historical
migrations reference tables/functions that were created directly in the production database
(via the dashboard / SQL editor) and have **no corresponding `CREATE` migration**, or whose
creating migration was never applied to the branch. When the replay reaches one of those
migrations, a bare `DROP POLICY` / `CREATE POLICY` / `ALTER TABLE` / FK reference fails with:

```
ERROR: relation "public.<table>" does not exist (SQLSTATE 42P01)
```

…which **fails the whole `Supabase Preview` check on every PR that carries a migration** —
even when the PR's own migration is perfectly fine.

## What we already did (stopgap, shipped)

Each affected historical migration body is now wrapped in an **exception-guarded `DO` block**
that swallows only missing-dependency errors:

```sql
DO $guard$
BEGIN
  -- original migration statements …
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping migration <id> — missing dependency: %', SQLERRM;
END
$guard$;
```

Net effect:

| Environment | Behaviour |
| --- | --- |
| Fresh / empty preview branch | the missing-object statement is skipped, the migration is a no-op, the replay continues → **preview goes green** |
| Production | every object exists, **no exception fires**, all DDL runs byte-for-byte as before |

Validated by running all guarded files against a local Postgres 16: empty DB → all run clean
with zero uncaught `ERROR`; table-present → the guard executes the real DDL (old policy
dropped, new policy created).

Guarded migrations (as of this note):

- `20250711124713` · `20250815051357` · `20250815064533` · `20250825055502`
- `20251024114906` · `20251114123916` · `20251204132711` · `20260121070047`
- `20260203071038` · `20260513115249` · `20260513150000`

> ⚠️ This is a **stopgap**. It stops the bleeding but does not make the preview branch a
> faithful copy of production — anything that depends on a skipped object simply won't exist
> on the preview branch. New migrations can re-introduce the same problem if they reference
> dashboard-created objects without guards.

## The permanent fix (recommended)

The root cause is that **the migration history is not self-consistent** — production contains
objects that no migration creates. Fix the history, not each call site.

### Option A — Capture a baseline schema migration from production (best)

Make the migration history reproduce production exactly, so a from-empty replay succeeds with
no guards needed.

```bash
# 1. Link the CLI to the production project
supabase link --project-ref dtjmhieeywdvhjxqyxad

# 2. Pull the full current production schema into a new baseline migration
supabase db pull --schema public,storage,auth

# 3. Review the generated migration. It will CREATE every table/function/policy that
#    currently exists in prod but is missing from migrations. Place it so it runs FIRST
#    (rename with the earliest timestamp, or use `supabase migration repair` to mark the
#    existing history as already-applied on prod so only the gaps replay on branches).
```

After this, fresh preview branches build a real copy of prod and the exception guards become
belt-and-suspenders rather than load-bearing.

### Option B — Persistent / pre-seeded preview branch

In the Supabase dashboard → **Branching**, configure the preview branch to **seed from a
production snapshot** instead of replaying from an empty database. This sidesteps the replay
entirely. Faster per-PR, but it does not fix the underlying inconsistent history (local
`supabase db reset` and any future from-scratch rebuild will still fail without Option A).

## Recommendation

1. Do **Option A** once — it permanently makes the migration history honest.
2. Keep the exception guards (cheap insurance; harmless on prod).
3. Going forward: never create tables/functions/policies via the dashboard SQL editor on
   prod without also committing the corresponding migration file.

## Appendix — diagnostic evidence

- `provider_profiles` has a `CREATE TABLE` migration at `20250701075441`, yet the preview
  replay reported it missing at `20250815064533` — confirming the branch DB is **not** built
  by a faithful in-order replay of the committed history (objects created early are absent
  later). That is the signature of a history/state mismatch, which Option A resolves.
- The first three preview failures marched forward in timestamp order
  (`calendly_config` → `provider_profiles` → `contact_submissions`), each surfacing only
  after the previous one was guarded — i.e. the replay halts at the first error, so failures
  must be cleared cumulatively. The guards above clear all known ones at once.
