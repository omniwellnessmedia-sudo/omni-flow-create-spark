# Google Ads Runbook — Omni Wellness Media — **FINAL v1.1 (CERTIFIED)**
**Status: CERTIFIED FINAL — supersedes v1.0 after the 4-agent preflight audit (asset spec · links · conversion wiring · CRO). Immutable reference = the merge commit on `main`. Changes require v1.2, not edits.**
**v1.1 changelog:** short-description blockers fixed in both campaigns · headline inventory 5→10 each · title-case policy fallback for "STUNNING PIGS" · video auto-gen review step · sensitive-imagery gate added · canonical-host redirect + robots/sitemap host fix · gclid preserved through /provider-signup · conversion firing hardened (success-gated, double-submit-proof, verified live in dataLayer).
Account: Customer ID **396-986-7500** · Currency ZAR · R6000 promo (spend-match — verify terms at `https://ads.google.com/aw/billing/promotions`)

---

# ARCHITECTURE — 70/30 split, two campaigns

Google Ads has no per-link "bid distribution ratio" inside one campaign — the only real control over a 70/30 weight is **separate campaigns with separate daily budgets**:

| Campaign | Weight | Daily budget | Goal | Status |
|---|---|---|---|---|
| **B — STUNNING PIGS Tickets** | **70%** | **R140/day** | Purchases (`Ticket Purchase`) | 🔒 **GATED — do not activate until the 5 gates below pass** |
| **A — Impact Travel (tours + ROAM + Dr Phil-afel uplift)** | **30%** | **R60/day** | Leads (`Booking Inquiry`, `Contact Form Submit`) | ✅ Ready now |
| *Total* | | *R200/day* | *≈ R6,000/30 days → full promo match* | |

**Until Campaign B's gates pass, run Campaign A at the full R200/day**, then drop it to R60/day the day B activates. Dr Phil-afel gets its uplift **through Campaign A's linked pages** (the Foundation section on the homepage and "Book a Tour That Gives Back" flow) — it must NOT have its own campaign and NO ticket revenue may route through the Foundation (entity-separation rule).

---

# CAMPAIGN B GATES — all five must be true before activation
1. ☐ Event database layer applied to production (screening_events migration — SQL editor)
2. ☐ Event flipped to `published` (page live, ticket sales unlocked; today it is draft + unlisted and **cannot convert**)
3. ☐ PayPal entity resolved — Omni's own account wired (ticket money may not settle to Dr Phil-afel Pty)
4. ☐ `AW-` ID + `Ticket Purchase` conversion label pasted into `src/lib/googleAds.ts` (tracking is wired in code and fires with ZAR value + transaction ID on every completed ticket order)
5. ☐ **Destination + imagery policy audit:** the published event page shows NO visible placeholders ({{image}}/{{logo}} boxes read as "under construction" → destination-not-working disapproval) and NO graphic footage/stills (Shocking Content policy evaluates the landing page, not just the ad); ad images use only the dignified portrait + venue/audience shots. If disapproved anyway, appeal from the account — animal-topic educational ads have restoration precedent.

---

# TAM & OPPORTUNITY ANALYSIS (the "idealistic opportunity", investigated)

**Inventory:** 3 screenings × 169 = **507 seats** · Single R150 / Couple R200 → ≈362 transactions, ceiling revenue ≈ **R62–76k**.

**Clicks needed to SELL OUT** (from repo TAM model):

| Conversion rate | Clicks needed | Spend @ R3 CPC | @ R5 | @ R8 |
|---|---|---|---|---|
| 5.0% (your stated max) | 7,243 | R21,700 | R36,200 | R57,900 |
| 3.0% (good) | 12,071 | R36,200 | R60,400 | R96,600 |
| 1.5% (typical events) | 24,143 | R72,400 | R120,700 | R193,100 |

**What the 70% budget actually fills:** R4,200 (or R8,400 once the match credit lands) at R4–6 CPC and 1.5–5% CVR = **15–74 seats (3–14% of house)**; with the match credit up to **~29% of house** at the optimistic ceiling.

**Verdict:** sell-out via paid ads alone is not achievable on this budget — that's the honest read of the 5% scenario. Ads are the *accelerant*; the house gets filled by the free channels: BWC/G.A.R.D./Pigs 'n Paws partner networks, @masquetheatresa, the site's newsletter list (`source=stunningpigs` opt-in is already live capturing interest), and Women's Day press. Plan accordingly.

---

# HYPERLOCAL TARGETING (Campaign B)

Venue: The Masque Theatre, 37 Main Road, Muizenberg. Evening event → distance-sensitive.
- **Location:** radius **25 km around Muizenberg** (covers Kalk Bay, Fish Hoek, St James, Lakeside, Tokai, Constantia, Wynberg, Claremont, Rondebosch, City Bowl edge). Presence-based, not interest.
- **Audience signals:** animal welfare & animal rights · documentary film · vegan/vegetarian lifestyle · Women's Day events Cape Town · community theatre
- **Search themes:** `stunning pigs documentary` · `womens day events cape town 2026` · `masque theatre muizenberg` · `animal welfare event cape town` · `documentary screening cape town`
- **Schedule note:** front-load spend in the 3 weeks before 8 Aug; tickets for a dated event don't benefit from slow pacing.

**Campaign B links (transcribed):**
- Final URL / tickets: `https://omniwellnessmedia.co.za/events/stunning-pigs`
- Ticket anchor deep-link (ad sitelink once live): `https://omniwellnessmedia.co.za/events/stunning-pigs#tickets`
- About anchor: `https://omniwellnessmedia.co.za/events/stunning-pigs#about`

**Campaign B asset copy** (draft — verbatim from the event page; finalize when gates pass):
- Headlines (≤30): `STUNNING PIGS — The Film` (23) · `Women's Day Screening` (21) · `The Masque Theatre, 8 Aug` (25) · `Tickets R150 — Book Now` (23) · `Three Sessions, 169 Seats` (25) · `Tickets From R150` (17) · `Film + Public Q&A` (17) · `The Masque Theatre` (18) · `8 Aug: Women's Day` (18) · `Three Screenings Only` (21)
- Long headline (≤90): `BWC and Friends present a Women's Day animal-protection screening and education event.` (86)
- Descriptions — **first is the SHORT slot (≤60 required)**: `Women's Day documentary screening in Muizenberg. Book now.` (58) · `The STUNNING PIGS documentary plus public Q&A at The Masque Theatre, Muizenberg. Book now.` (90)
- **Policy fallback (capitalization):** if automated review disapproves the ALL-CAPS film title, swap immediately to title case: `Stunning Pigs — The Film` / `The Stunning Pigs documentary plus public Q&A at The Masque Theatre, Muizenberg. Book now.` — then appeal; film titles are a legitimate exception but automated review often rejects first.
- **Video:** with no uploaded video, Google auto-generates videos from your images/text with no approval step — unacceptable risk for this subject matter. Either upload one 10s+ vertical video, or add a post-publish step: Assets → review auto-generated videos → remove any off-brand ones within 24h.
- CTA: **Book now**

---

# CAMPAIGN A — ACTIVATE TONIGHT (unchanged from prior brief, condensed)

1. **Conversions** `https://ads.google.com/aw/conversions` — create **5** actions (choose "tag already installed"):
   Booking Inquiry (Submit lead form, Primary, values) · Contact Form Submit (Contact, Primary) · Provider Signup Start (Sign-up, Secondary) · Marketplace Click-Through (Other, Secondary, values) · **Ticket Purchase (Purchase, Secondary for now → flip to Primary when Campaign B activates, values)**
   **⚠️ CAPTURE: the `AW-XXXXXXXXXX` ID + all 5 conversion labels → send to the developer session.**
2. **Campaign** `https://ads.google.com/aw/campaigns`: Leads → Performance Max → `Omni — Impact Travel — PMax` → Maximize Conversions (NO tCPA) → Cape Town + Western Cape (presence) → English → Final URL expansion **OFF** → text auto-assets OFF → **R200/day** (drop to R60/day when Campaign B goes live).
3. **Asset group** `Impact Travel Cape Town` → Final URL `https://omniwellnessmedia.co.za/tours-retreats` → paste the 5/5/5 lines, business name `Omni Wellness Media`, CTA **Book now**, images incl. logo `https://omniwellnessmedia.co.za/branding/omni-badge-512.png` (full copy + image URLs: `docs/PMAX_ASSET_PACK.md`).
4. Publish. Review takes hours–48h.

**Operator hard rules:** view-only on billing · no tCPA/tROAS · Final URL expansion OFF · publish exactly one campaign (A) · Campaign B is built only after the 4 gates are checked off.

---

# WHAT THE DEVELOPER NEEDS FROM YOU (Tumelo)
1. `AW-` ID + 5 conversion labels (after step 1) → pasted into code within minutes
2. Run the production SQL (event migration + the two pending fixes) — SQL editor, blocks Campaign B gate #1
3. PayPal decision: Omni business account credentials for the swap — gate #3
4. Event assets: dignified pig portrait, G.A.R.D. + Pigs 'n Paws logos, session times — then flip to `published` — gate #2
5. Confirm the R6000 promo terms seen in Billing → Promotions

*Prepared 17 Jul 2026 · TAM model source: seat inventory + pricing in `supabase/migrations/20260705120000_screening_events.sql` and `src/pages/events/StunningPigs.tsx` · Conversion wiring: `src/lib/googleAds.ts`*
