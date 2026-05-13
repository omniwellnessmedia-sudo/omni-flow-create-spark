# Phase 1 CRM Workspace + Feroza QA Fixes

Credit-efficient plan: one focused build pass covering the highest-impact items from Feroza's QA + the new CRM operationalization request.

## 1. AdminLeads → CRM Workspace (`src/pages/admin/AdminLeads.tsx`)

Replace the flat Contacts/Quotes tabs with a pipeline-style workspace:

**New tab structure (per record type):**
- Active (status: pending / in_progress / null)
- Quoted / Responded
- Closed
- Archived

Driven by client-side filtering on existing `status` column — no DB migration needed. Counts shown per tab.

**Per-row capabilities (manage, capture, sort, save, file, edit, delete, share, expand):**
- Expand row → drawer (Sheet) with full detail, inline edit (name, email, phone, org, notes), notes timeline, activity log, assigned-to selector
- Quick-actions: Reply (mailto), Send Quote (mailto template), WhatsApp, Copy email, Share (clipboard link), Archive, Delete (admin-only, soft via status='archived')
- Bulk select: mass email, mass status change, mass archive, CSV export
- Filter bar: search, sector, date range, sort

**Outreach Tracker (new sub-tab):**
- Loads from a new `outreach_leads` table (org, sector, contact_method, status, last_contacted, notes, source_campaign, owner)
- Seeded with Feroza's tracker: Overall Organisation, Zacri Campaign, Youth Sports, Women Empowerment, ECD/Reading, Tech/Digital sheets (~80 rows)
- Same expand drawer + pipeline columns

## 2. DB additions (one migration)

```sql
-- Outreach pipeline
create table outreach_leads (
  id uuid primary key default gen_random_uuid(),
  organisation text not null, sector text, contact_method text,
  contact_email text, contact_person text, programme text,
  website text, csr_url text,
  status text default 'no_response',  -- no_response, contacted, positive, declined, applied, registered, awaiting, archived
  campaign text,                       -- 'overall','zacri','youth_sports','women','ecd','tech','foundation','funder'
  last_contacted date, follow_up_due date, notes text,
  owner_id uuid, created_at timestamptz default now(), updated_at timestamptz default now()
);
-- RLS: admins manage all (is_admin)

-- Lightweight per-lead notes/activity (works for contacts, quotes, outreach)
create table lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_type text not null,    -- 'contact' | 'quote' | 'outreach'
  lead_id uuid not null,
  actor_id uuid, action text not null, -- 'note','status_change','email_sent','assigned'
  payload jsonb default '{}', created_at timestamptz default now()
);
-- RLS: admins manage all

-- Add to contact_submissions/service_quotes: archived_at timestamptz, assigned_to uuid, internal_notes text
```

Seed `outreach_leads` from the parsed XLSX (one INSERT migration with the ~80 rows).

## 3. Marketing Suite link-in (CRM ↔ resources)

In the lead drawer add a "Resources" panel pulling from existing `roamMarketingAssets` / partner resources docs:
- Quick-attach onboarding sequence (Influencer / Partner / Foundation) → opens prefilled mailto with template + Cal.com link + brand brief PDF link
- Copy-link buttons for: ROAM Executive Resources doc, Cal.com booking, brand assets folder

## 4. Admin Copilot helper (`src/components/admin/LeadCopilot.tsx`)

Small inline component in the drawer:
- Suggested next action based on status + days since contact ("Follow up overdue", "Send quote", "Move to closed")
- One-click templates: First contact, Follow-up #1/#2, Quote, Decline thanks, Archive
- Calls existing `submit-contact` / mailto for delivery (no new edge fn needed)

## 5. Feroza QA fixes (rolled into same pass)

- **AdminDashboard notifications**: persist dismissal — currently `SmartGreeting` already does sessionStorage; pending-tour banner in `AdminDashboard.tsx` needs `dismissed_at` write to local state + filter on status change. Patch the pending-tours list to re-fetch after status update.
- **Provider Dashboard Pro gating**: `CRMDashboard` is correct; replicate the same `relative + absolute overlay` blur pattern used there in the other two Pro tabs (Analytics works → mirror its container) so cards don't get clipped. Verify `min-h` on each blur container.
- **UpgradePage mobile**: tighten hero stack spacing, fix email button (use native `<a href="mailto:...">` not `window.open`), confirm `admin@omniwellnessmedia.co.za` is intended (yes per memory: admin@ = public).
- **WellnessAccount** edit: wire profile edit form to `consumer_profiles` upsert; add loading skeleton instead of indefinite spinner on mobile.
- **Sandy Mitchell**: dedupe images (filter unique URLs), fix website link, fix socials button on desktop, persistent "Added" cart-button state via `useState` toggle.
- **Floating "Need eSIM Help?" mobile button**: reduce size, reposition to `bottom-20 right-3`, lower z-index.
- **Great Mother Cave Tour**: add fallback for missing tour images + Chief Kingsley portrait.

## 6. Email to Feroza & team

Generate `docs/EMAIL_RESPONSE_FEROZA_MAY7.md` recapping: CRM workspace shipped, all 7 QA items addressed, deployment confirmation, ask for re-test pass.

## Files
**New:** `src/components/admin/LeadDrawer.tsx`, `src/components/admin/LeadCopilot.tsx`, `src/components/admin/OutreachPipeline.tsx`, `supabase/migrations/<ts>_crm_workspace.sql`, `supabase/migrations/<ts>_seed_outreach.sql`, `docs/EMAIL_RESPONSE_FEROZA_MAY7.md`
**Edited:** `src/pages/admin/AdminLeads.tsx`, `src/pages/AdminDashboard.tsx`, `src/pages/UpgradePage.tsx`, `src/pages/ProviderDashboard.tsx` (mirror Pro blur pattern), `src/pages/WellnessAccount.tsx`, `src/pages/SandyMitchellProfile.tsx`, `src/pages/tours/GreatMotherCaveTour.tsx`, `src/components/RoamHelpFAB.tsx` (or wherever the eSIM help button lives — to be located)

## Out of scope (next pass)
- Per-record email-thread sync (needs IMAP/Gmail API)
- Provider-side lead pipeline (this pass = admin only; provider extension uses same components later)
- Automated follow-up scheduler (cron edge function — Phase 2)
