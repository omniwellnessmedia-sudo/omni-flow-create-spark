# Google Ads Runbook — Omni Wellness Media — **FINAL v1.3**
**v1.3 changelog:** canonical Quicket URL confirmed (gate 3 ✓) · official event artwork received (Quicket 800×800 square — valid 1:1 ad image ≥300px; 1500×500 banner is 3:1 — crop to 1.91:1 in the Ads UI) · official video exists: "Stunning Pigs Intro Trailer.mp4" (Drive, 2.4GB) — now embedded on the event page; for PMax, upload the trailer to the Omni YouTube channel and attach it to the asset group (a supplied video also disables Google's auto-generated videos, closing that risk) · site weight: lovable-uploads compressed 82→42MB in place (same URLs).
**Status: CERTIFIED FINAL — v1.2 realigns Campaign B to the authoritative event facts verified from the Chad ↔ The Masque correspondence (18 Jul). Immutable reference = the merge commit on `main`. Changes require v1.3, not edits.**
**v1.2 changelog:** event corrected to "Celebrating Women Who Protect Life", **Mon 10 Aug 2026**, sessions What Feeds Us 10:00 / Stunning Pigs 12:00 / Voices for Women Awards 14:00, **R150/session** (no couple ticket; full-day via PRIVATE discount code — never print it) · **ticketing is Quicket** (live since 13 Jul, assigned seating) — our page is now a pre-lander routing to Quicket; native cart permanently retired for this event · Campaign B conversion = `quicket_ticket_click` (cross-domain purchases reconciled from Quicket Sales Reports) · billing: Omni Ads account, **BWC billed as client** (per agreed plan) · PayPal-entity and event-DB gates removed (moot — Quicket pays BWC directly under the signed venue agreement).
**v1.1 changelog:** short-description blockers fixed in both campaigns · headline inventory 5→10 each · title-case policy fallback for "STUNNING PIGS" · video auto-gen review step · sensitive-imagery gate added · canonical-host redirect + robots/sitemap host fix · gclid preserved through /provider-signup · conversion firing hardened (success-gated, double-submit-proof, verified live in dataLayer).
Account: Customer ID **396-986-7500** · Currency ZAR · R6000 promo (spend-match — verify terms at `https://ads.google.com/aw/billing/promotions`)

---

# ARCHITECTURE — 70/30 split, two campaigns

Google Ads has no per-link "bid distribution ratio" inside one campaign — the only real control over a 70/30 weight is **separate campaigns with separate daily budgets**:

| Campaign | Weight | Daily budget | Goal | Status |
|---|---|---|---|---|
| **B — Women Who Protect Life · Tickets** | **70%** | **R140/day** | `Quicket Ticket Click` (purchases reconciled in Quicket Sales Reports) | 🔒 **GATED — 3 gates below** |
| **A — Impact Travel (tours + ROAM + Dr Phil-afel uplift)** | **30%** | **R60/day** | Leads (`Booking Inquiry`, `Contact Form Submit`) | ✅ Ready now |
| *Total* | | *R200/day* | *≈ R6,000/30 days → full promo match* | |

**Until Campaign B's gates pass, run Campaign A at the full R200/day**, then drop it to R60/day the day B activates. Dr Phil-afel gets its uplift **through Campaign A's linked pages** (the Foundation section on the homepage and "Book a Tour That Gives Back" flow) — it must NOT have its own campaign and NO ticket revenue may route through the Foundation (entity-separation rule).

---

# CAMPAIGN B GATES — all three must be true before activation
1. ☐ `AW-` ID + `Quicket Ticket Click` conversion label pasted into `src/lib/googleAds.ts` (wired: fires with R150 proxy value on every click-out to Quicket from hero, session cards, tickets section and sticky bar)
2. ☐ **Destination + imagery policy audit:** the event page shows NO visible placeholders ({{image}}/{{logo}} boxes read as "under construction" → destination-not-working disapproval) and NO graphic footage/stills (Shocking Content policy evaluates the landing page); ad images use only the dignified portrait + venue/audience shots. Appeal path documented if false-positive disapproved.
3. ☐ Date-correct ad assets (10 Aug) and, if going Quicket-direct, the full `quicket.co.za` event URL from Chad (a `qkt.io` short link as final URL risks destination-mismatch disapproval).

*Removed vs v1.1 (moot):* event-DB migration and publish-flip gates (page no longer sells natively — Quicket owns inventory and seat plan; parallel native sales would double-sell and are permanently retired) and the PayPal-entity gate (Quicket settles to BWC under the signed venue agreement — no money touches our PayPal or the Foundation).

---

# TAM & OPPORTUNITY ANALYSIS (the "idealistic opportunity", investigated)

**Inventory:** 3 sessions × 169 = **507 seats**, each a **R150 Quicket ticket** (no couple ticket; full-day = 3 tickets with the private discount code) → ceiling **R76,050** + donations.

**Clicks needed to SELL OUT** (from repo TAM model):

| Conversion rate | Clicks needed | Spend @ R3 CPC | @ R5 | @ R8 |
|---|---|---|---|---|
| 5.0% (your stated max) | 10,140 | R30,400 | R50,700 | R81,100 |
| 3.0% (good) | 16,900 | R50,700 | R84,500 | R135,200 |
| 1.5% (typical events) | 33,800 | R101,400 | R169,000 | R270,400 |

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
- **Quicket booking page (canonical — valid as Quicket-direct ad final URL):** `https://www.quicket.co.za/events/386047-celebrating-women-who-protect-life-featuring-the-cape-town-premiere-of-stunning/` (short alias `qkt.io/Eu8CpR` for print/WhatsApp only — never as an ad final URL)
- Pre-lander / final URL (default): `https://omniwellnessmedia.co.za/events/stunning-pigs` — every CTA on it routes to Quicket with the `quicket_ticket_click` conversion firing
- Sitelink anchors: `.../events/stunning-pigs#sessions` · `#tickets` · `#about`
- Tracking layers per the agreed Chad plan: Quicket **Link Campaigns** per partner (Omni, BWC, G.A.R.D, Vegan Streetfood, TNT, singers, honourees) + UTM'd short links; paid-ads sales reconciled against Quicket Sales Reports by date/campaign

**Campaign B asset copy** (draft — verbatim from the event page; finalize when gates pass):
- Headlines (≤30): `Women Who Protect Life` (22) · `Stunning Pigs Premiere` (22) · `The Masque · 10 August` (22) · `Tickets R150 on Quicket` (23) · `Women's Day, Muizenberg` (23) · `Three Sessions, One Day` (23) · `Awards & Live Showcase` (22) · `What Feeds Us — 10:00` (21) · `Book Your Seat Today` (20) · `Cape Town Premiere` (18)
- Long headlines (≤90): `Celebrating Women Who Protect Life — featuring the Cape Town premiere of Stunning Pigs.` (87) · `Three sessions, one powerful day at The Masque Theatre: film, food, voices and awards.` (86) · `Women's Day at The Masque: What Feeds Us, Stunning Pigs, and the Voices for Women Awards.` (89)
- Descriptions — **first is the SHORT slot (≤60 required)**: `Women's Day at The Masque, Muizenberg. Tickets R150.` (52) · `Three sessions on 10 Aug: What Feeds Us, Stunning Pigs premiere, Voices for Women Awards.` (89)
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
