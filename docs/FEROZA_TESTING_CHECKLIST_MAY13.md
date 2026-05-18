# Testing Checklist for Feroza — 13 May 2026

This checklist covers (a) the fixes we shipped today and (b) the data-sync scenarios that have been flaky. Work top to bottom — each section takes ~5 minutes.

---

## Before you start

1. **Hard refresh first.** Ctrl/Cmd + Shift + R on the production site to clear cached assets. Stale frontends are the #1 cause of "it's still broken" reports.
2. **Open two tabs.** Many sync bugs only show up when the same record is edited in one tab and viewed in another. Tab A = the editor, Tab B = the viewer.
3. **DevTools open.** F12 → Console tab. If a save silently fails, the red error message is the only signal. Screenshot any red lines and send back.
4. **Log what you tried.** Mark each item ✅ / ❌ / ⚠️. For ❌ include: URL, what you clicked, what you expected, what happened.

---

## 1 · Sandy Mitchell Profile — `/provider/sandy-mitchell`

| # | Test | How | Expected |
|---|---|---|---|
| 1.1 | Instagram button opens new tab | Connect with Sandy section → click "Instagram" | New tab opens druyogacapetown Instagram |
| 1.2 | Facebook button opens new tab | Same section → click "Facebook" | New tab opens DruyogaCT Facebook |
| 1.3 | LinkedIn button (new) opens new tab | Same section → click "LinkedIn" | New tab opens Sandy's LinkedIn |
| 1.4 | Visit Website opens druyogacapetown.co.za | Connect with Sandy → click "Visit Website" | New tab → external Dru Yoga site loads (if it doesn't, that's a vendor-side issue, not ours) |
| 1.5 | Add to Cart shows "Added!" state | Pick a service → click "Add to Cart" | Button turns green, says "Added!", stays that way on page reload |

---

## 2 · Provider Dashboard Pro Tabs — log in as a non-Pro provider

| # | Test | How | Expected |
|---|---|---|---|
| 2.1 | Analytics tab — upgrade card fully visible | Click "Analytics" tab | Compact upgrade card centred over blurred chart, no clipping |
| 2.2 | CRM tab — upgrade card fully visible | Click "Clients" / "CRM" tab | Same — fully visible, no cutoff |
| 2.3 | Financial tab — upgrade card fully visible | Click "Financial" tab | Same |
| 2.4 | "Upgrade — R499/month" button works | Click the button on any of the three | Navigates to `/upgrade` |

---

## 3 · Provider Pro Upgrade Page — `/upgrade`

| # | Test | How | Expected |
|---|---|---|---|
| 3.1 | "Activate via WhatsApp" opens WhatsApp | Click the green WhatsApp button | New tab → wa.me link with prefilled message |
| 3.2 | Email link opens mail client | Click `hello@omniwellnessmedia.co.za` | Mail app opens with subject "Provider Pro Upgrade Request" (skip if you don't have a mail app set up) |
| 3.3 | Copy email button works | Click the small copy icon next to the email | Icon turns into a green tick, email is on clipboard — paste anywhere to verify |

---

## 4 · "View Public Profile" links — log in as any provider that isn't Sandy

| # | Test | How | Expected |
|---|---|---|---|
| 4.1 | Header → "Preview Profile" goes to YOUR profile | Click button in dashboard header | Lands on your own provider profile, not `/provider/sandy-mitchell` |
| 4.2 | Same from dashboard quick action | Any "View Public Profile" link in the dashboard | Same — your profile |

---

## 5 · Admin → Leads — `/admin` → Leads tab

| # | Test | How | Expected |
|---|---|---|---|
| 5.1 | Pipeline tabs filter the lists | Click Active / Quoted / Closed / Archived in turn | Contact and Quote lists shorten to only matching status |
| 5.2 | Marking a lead Responded removes it from Active | On an Active lead → click "Responded" | Card disappears from Active view, appears in Quoted/Responded |
| 5.3 | Marking Closed moves to Closed | Same flow with "Closed" | Card moves to Closed tab |
| 5.4 | Expand drawer opens | Click "Expand →" on any lead | Drawer slides in with inline edit fields |
| 5.5 | Edit fields save | Change a name or follow-up date → click Save | Drawer shows saved confirmation; card in list reflects new value |
| 5.6 | One-click email templates work | In drawer → click any template button | Mail app opens with the template prefilled |

---

## 6 · 🚨 DATA SYNC TESTS — the most important section

These are the bugs Feroza flagged. They tend to show up as: "I changed X, hit save, the page reloads with the OLD value" or "I changed X in one place but it didn't update in another".

### 6.1 · Edit-persistence (single-tab)

For each editable surface below: open it, change a value, save, close the page, reopen. The change MUST still be there.

| # | Surface | Steps |
|---|---|---|
| 6.1.a | Admin Leads — Expand drawer | Edit notes → Save → close drawer → re-open same lead → notes preserved |
| 6.1.b | Provider Dashboard — Edit Profile | Change bio → Save → log out → log back in → bio preserved |
| 6.1.c | Service edit | Edit a service price → Save → reload page → price preserved |
| 6.1.d | Blog post draft | Open editor → type content → click Draft → close tab → reopen post in editor → content preserved |
| 6.1.e | Cart | Add item → close tab → reopen site → item still in cart (this one uses localStorage, should always work) |

### 6.2 · Cross-tab sync

Open Tab A (editor) and Tab B (viewer) on the same record. Make a change in A. Check B.

| # | Test | A does | B should |
|---|---|---|---|
| 6.2.a | Admin Leads | Change status of lead from Active → Closed in Tab A | After ~5s (or after refresh in B), B's list reflects the change |
| 6.2.b | Provider services | Edit a service in Tab A | Tab B's public service detail page reflects the edit after refresh |
| 6.2.c | Blog post publish | Publish a draft in Tab A | Tab B's blog index lists the new post after refresh |

If B does NOT reflect even after manual refresh, that's a real data-sync bug — log it with exact steps.

### 6.3 · Cross-surface sync (the "I saved it but the dashboard count didn't change" class of bug)

| # | Test | Expected |
|---|---|---|
| 6.3.a | Mark a Lead as Responded | Active count badge in admin nav decreases by 1 |
| 6.3.b | Add a new service as a provider | Provider dashboard service count goes up; service appears in public marketplace after refresh |
| 6.3.c | Customer submits a Contact form | New row appears in Admin → Leads → Contact tab |
| 6.3.d | Provider publishes a blog post | Post appears in `/blog` after refresh |

---

## 7 · Common gotchas to rule out before reporting

- **Stale cache.** If something looks wrong, do a hard refresh BEFORE reporting. ~half of "still broken" turns out to be cache.
- **Wrong account.** Some bugs only show as admin / only as provider / only as consumer. Note which role you were signed in as.
- **Permission error in DevTools console.** If you see `403`, `401`, or `permission denied` in the console — that's an RLS (database permissions) issue, not a UI bug. Screenshot the console.
- **Update vs Publish.** Lovable's Publish button is what makes the live site reflect the latest code. If a recent fix isn't visible, confirm Publish was hit.

---

## How to report a failure

For each ❌, send one bundle containing:

1. **URL** you were on
2. **Account / role** you were signed in as
3. **Exact steps** ("clicked X, typed Y, clicked Save")
4. **What you expected**
5. **What actually happened** (one sentence)
6. **Screenshot** of the failure
7. **Console log screenshot** if there were red errors

That single bundle saves a 20-minute back-and-forth and lets us fix it the same day.

---

**Estimated full pass time: 45 minutes for sections 1–5, plus 30 minutes for section 6.**

Ping Tumelo when complete — or after each failed item if you want them fixed live during the pass.
