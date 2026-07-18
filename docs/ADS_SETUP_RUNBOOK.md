# Google Ads Setup Runbook — Omni Wellness Media
**Hand this entire document to the browser assistant. It is self-contained — follow top to bottom.**

Account: Customer ID **396-986-7500** · Currency ZAR · Goal: activate Performance Max using the R6000 promo credit.
Site tracking is already deployed: GA4 `G-X9DQ4DEHNB` is live on omniwellnessmedia.co.za; Google Ads conversion code is deployed and waiting only for the IDs captured in Step 2.

**HARD RULES for the operator:**
- Do NOT change billing/payment methods. Only VIEW the promotions page.
- Do NOT enable "Final URL expansion", do NOT set a Target CPA, do NOT add a target ROAS.
- Do NOT publish anything beyond the single campaign described here.
- At the checkpoint in Step 2, STOP and report the captured IDs before continuing is fine — but you may also continue to Step 3 while reporting them.

---

## STEP 1 — Verify the promo credit
1. Go to: `https://ads.google.com/aw/billing/promotions`
2. Confirm the R6000 promotional offer is listed/applied and note its terms (typically: spend R6,000 within 60 days → receive R6,000 credit).
3. Record the exact terms shown — include them in your final report.

## STEP 2 — Create 4 conversion actions ⚠️ CHECKPOINT: capture IDs
Go to: `https://ads.google.com/aw/conversions`
For each row below: **+ New conversion action → Website** → enter domain `omniwellnessmedia.co.za` → scan (or skip scan) → **Add a conversion action manually**:

| # | Conversion name | Category | Goal optimization | Value | Count |
|---|---|---|---|---|---|
| 1 | Booking Inquiry | Submit lead form | Primary | "Use different values for each conversion" (default value 0) | One |
| 2 | Contact Form Submit | Contact | Primary | Don't use a value | One |
| 3 | Provider Signup Start | Sign-up | Secondary | Don't use a value | One |
| 4 | Marketplace Click-Through | Other | Secondary | Use different values (default 0) | Every |

When asked how to install the tag: choose **"Use Google Tag Manager / install manually — the tag is already on the site."** Do NOT email instructions or re-install anything.

**⚠️ CAPTURE AND REPORT (this is the most important output of the whole session):**
- The account conversion ID: format `AW-XXXXXXXXXX` (shown in tag setup / event snippet)
- For EACH of the 4 actions: its **conversion label** — the string after the slash in the event snippet's `send_to: 'AW-XXXXXXXXXX/LABEL'`

Report all five values clearly, e.g.:
```
AW-1234567890
Booking Inquiry: AbCdEfGh123
Contact Form Submit: IjKlMnOp456
Provider Signup Start: QrStUvWx789
Marketplace Click-Through: YzAbCdEf012
```

## STEP 3 — Create the campaign
Go to: `https://ads.google.com/aw/campaigns` → **+ New campaign**

| Setting | Value |
|---|---|
| Objective | **Leads** |
| Conversion goals | Keep: Booking Inquiry, Contact Form Submit (primaries). Remove any unrelated auto-added goals. |
| Campaign type | **Performance Max** |
| Campaign name | `Omni — Impact Travel — PMax` |
| Bidding | **Maximize Conversions** — leave "Set a target cost per action" UNCHECKED |
| Locations | **Cape Town, South Africa** + **Western Cape, South Africa** ("Presence: people in or regularly in" — not "interest") |
| Languages | English |
| Automatically created assets | Text assets: OFF (we supply all text) |
| Final URL expansion | **OFF** |
| Budget | **R200 per day** |

## STEP 4 — Asset group (paste exactly)
Asset group name: `Impact Travel Cape Town`
**Final URL:** `https://omniwellnessmedia.co.za/tours-retreats`

**Headlines (add all 5):**
1. `Experiences That Matter`
2. `Impact Travel Cape Town`
3. `Indigenous-Led Experiences`
4. `Wellness Tours & Retreats`
5. `Book a Tour That Gives Back`

**Long headlines (add all 5):**
1. `Immersive cultural journeys, equine-assisted wellness and transformative retreats.`
2. `Bridging wellness, culture, and conscious media from Cape Town to the world.`
3. `Sacred indigenous walks with Chief Kingsley to bespoke corporate wellness retreats.`
4. `Every experience creates lasting impact for communities, animals, and the land.`
5. `From retreats to connectivity, from content to community - explore with us.`

**Descriptions (add all 5):**
1. `Indigenous-led tours, wellness retreats and conscious experiences in Cape Town. Book now.`
2. `Strategic guidance for conscious businesses creating positive impact.`
3. `Authentic storytelling through video, photography, and multimedia.`
4. `Community-building strategies that drive meaningful engagement.`
5. `12,000 years of heritage. Small groups. Real community impact. Cape Town, South Africa.`

**Business name:** `Omni Wellness Media`

**Images** — download these from the live site, then upload; use the Ads UI's built-in cropper for 1.91:1 (landscape) and 1:1 (square) versions of each:
- Logo (1:1, ready to use): `https://omniwellnessmedia.co.za/branding/omni-badge-512.png`
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/indigenous%20tour%20chief%20kingsley%20explaining.jpg`
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%201.jpg`
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%202.jpg`
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/muizenberg%20cave%20view%202.jpg`

If any image URL fails to load, open `https://omniwellnessmedia.co.za/tours-retreats` and `https://omniwellnessmedia.co.za/` and save the equivalent hero/tour photos from those pages instead. Minimum needed: 3 landscape + 3 square + 1 logo.

**Call to action:** `Book now`

**Audience signal (optional but recommended):** + Audience signal → Search themes → add:
`cape town tours` · `wellness retreat cape town` · `indigenous cultural tour cape town` · `things to do cape town` · `corporate wellness retreat south africa`

## STEP 5 — Review & publish
1. Review the summary screen: confirm budget R200/day, locations Cape Town + Western Cape, bidding Maximize Conversions (no tCPA), 1 asset group, final URL expansion OFF.
2. **Publish the campaign.**
3. Ads go into policy review (hours up to 48h) — "Under review" status is normal.

## STEP 6 — Final report back
Report: promo terms found (Step 1) · the `AW-` ID + 4 labels (Step 2) · campaign published confirmation + any policy warnings · asset group "Ad strength" rating shown.

**The AW- ID + labels must be sent to the site developer (Claude Code session) — pasting them into the site code is the final step that makes conversion tracking live. Until then, the campaign runs but records no conversions.**
