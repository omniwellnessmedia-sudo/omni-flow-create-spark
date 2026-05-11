# Email to Feroza & Team — May 7

**Subject:** Omni Wellness — CRM workspace shipped + QA fixes deployed (re-test request)

---

Hi Feroza, Chad, Zenith, Tumelo,

Thank you for the latest QA pass. Below is what's now live on staging/preview and ready for your re-test.

## 1. CRM Workspace (Admin → Leads)

The admin Leads page has been upgraded from a flat list into a full pipeline workspace:

- **Pipeline tabs**: Active · Quoted/Responded · Closed · Archived (filtering applies across Contacts & Quotes).
- **Outreach Pipeline tab**: your full outreach tracker (≈68 organisations from the XLSX) is now seeded into the system — searchable, filterable by campaign (Overall, Zacri, Youth Sports, Women, ECD/Reading, Tech), exportable to CSV.
- **Expand drawer (per lead)**:
  - Inline edit (name, email, phone, org, sector, follow-up date, internal notes)
  - One-click email templates: First contact · Follow-up · Send quote · Decline thanks · Partner onboarding (opens prefilled mailto with the Omni Cal.com link)
  - Status pipeline buttons (move between stages)
  - Activity timeline (notes + automatic status-change / email-sent log)
  - Quick actions: Copy email · Archive · Delete
  - Suggested next action ("Follow-up overdue", "Send quote", etc.) based on status + days since last contact
- **Bulk operations**: select mode for mass-email via newsletter system; CSV export per pipeline view.

## 2. Database

New tables: `outreach_leads`, `lead_activities`. Existing `contact_submissions` and `service_quotes` extended with `archived_at`, `assigned_to`, `internal_notes`. All admin-only via `is_admin(auth.uid())` RLS.

## 3. QA fixes deployed

- **Great Mother Cave Tour**: image fallbacks added for missing tour and Chief Kingsley imagery.
- **Blog editor & post rendering**: draft saving fixed (correct new-vs-existing detection, slug sanitisation), DOMPurify-sanitised markdown rendering, image-failure fallbacks.
- **Provider Dashboard**: live realtime sync (bookings, services, blog posts, stats) with "Live data synced" indicator.
- **Realtime publication**: blog_posts, blog_comments, blog_likes, provider_profiles, services, bookings, transactions are now broadcasting changes.
- **Navigation**: legacy `/wellness-community` rolled into `/blog` redirects; store routes consolidated to `/roambuddy-store`.
- **Experience pages**: Cart Horse Urban Wellness and Corporate Wellness Retreat live at `/experiences/...` and featured on Tours + homepage.

## 4. Still in flight (next pass)

These remain on the board for the next sprint — flagging now so you can re-test the above without confusion:

- Provider Pro-tab blur containers (CRM tab works; Analytics + Financial replicate)
- WellnessAccount profile-edit form upsert + mobile skeleton
- Sandy Mitchell: image dedupe, website/socials button polish, persistent "Added" cart state
- Floating eSIM help button: sizing + repositioning
- AdminDashboard: persistent dismissal for pending-tour banners
- Sitewide collapsible provider cards with admin inline CMS edit

## 5. Deployment note

If updates aren't reflecting on your side, please do a hard refresh (Ctrl/Cmd + Shift + R) — frontend changes require the "Update" button in Publish, and we re-deployed this morning.

Please run a fresh pass on the CRM workspace + the items in section 3 and ping me with anything that still looks off.

Thanks again,
Tumelo
