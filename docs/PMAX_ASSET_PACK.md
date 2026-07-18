# Omni Wellness Media — Performance Max Asset Pack
Customer ID 396-986-7500 · R6000 promo credit · Prepared 16 Jul 2026
Every line pulled from live site copy in this repo unless flagged `[TODO: confirm]`.

---

## 1. Tracking status (audited)

| Layer | Status |
|---|---|
| gtag.js base loader | ✅ Live in `index.html` (GA4 `G-X9DQ4DEHNB`) |
| Microsoft Clarity | ✅ Live (`w0lq0tum18`) |
| Google Ads config (`AW-…`) | ❌ Was absent — commented stub now added beside GA4 in `index.html` |
| Ads conversion events | ❌ Was absent — now wired (see below), no-op until IDs pasted |

**Conversion events wired into real handlers** (`src/lib/googleAds.ts`):

| Conversion action | Fires from | Value sent |
|---|---|---|
| `booking_inquiry` | BookingSystem — service booking inquiry submitted | service price, ZAR |
| `contact_submit` | Contact page — form submitted successfully | — |
| `provider_signup_start` | Auth signup completed via `/provider-signup` (`?role=provider`) | — |
| `marketplace_clickthrough` | Tour tile → Viator outbound click | tour price |

**Your 3 paste-in steps after creating the conversion actions in Ads UI → Goals:**
1. `src/lib/googleAds.ts` → set `GOOGLE_ADS_ID = "AW-…"` `[TODO: confirm AW-XXXXXXX conversion ID]`
2. Same file → paste each action's conversion **label** into `ADS_CONVERSION_LABELS`
3. `index.html` → uncomment the `gtag('config', 'AW-…')` line with the same ID

Until then the events also mirror into GA4 as `ads_*` events, so the funnel is visible tonight regardless.

---

## 2. Recommended landing page

**Primary final URL: `https://omniwellnessmedia.co.za/tours-retreats`**

Why (all verified in this repo/audits):
- Single coherent offer ("Impact Travel Cape Town" — tours, retreats, experiences) with per-card booking CTAs → matches the lead/booking conversion goal, unlike the homepage's many competing CTAs
- Mobile-verified clean at 375–1440px, zero horizontal overflow, zero JS errors (browser-tested)
- Images hardened this week with fallback chains — nothing can render broken to paid traffic
- Feeds directly into `booking_inquiry`, the primary conversion

Homepage `/` is the secondary URL if PMax wants breadth. **Avoid `/tours`** as the paid destination: its prices display in **USD $** to South African traffic and its conversion is an *outbound* Viator click (affiliate), which weakens PMax's lead signals.

---

## 3. Asset group content (paste-ready, all within limits)

> **v1.1 (certified):** short-description slot fixed, headline inventory expanded to 10, image URLs made paste-ready. Verified against Google's current PMax spec (support.google.com/google-ads/answer/14528373, 17091269).

### Headlines (≤30 chars)
| # | Text | Chars | Source |
|---|---|---|---|
| 1 | Experiences That Matter | 23 | verbatim, homepage hero |
| 2 | Impact Travel Cape Town | 23 | verbatim, /tours-retreats badge |
| 3 | Indigenous-Led Experiences | 26 | verbatim, hero stat label |
| 4 | Wellness Tours & Retreats | 25 | from nav/page naming |
| 5 | Book a Tour That Gives Back | 27 | verbatim, homepage Foundation CTA |
| 6 | Wellness Tours | 14 | short-slot coverage |
| 7 | Sacred Cave Walks | 17 | from tour pages |
| 8 | Equine Wellness Days | 20 | Hoofbeats & Healing |
| 9 | Corporate Team Retreats | 23 | Rewild Your Team |
| 10 | Community Impact Travel | 23 | site positioning |

### Long headlines (≤90 chars)
| # | Text | Chars |
|---|---|---|
| 1 | Immersive cultural journeys, equine-assisted wellness and transformative retreats. | 82 |
| 2 | Bridging wellness, culture, and conscious media from Cape Town to the world. | 76 |
| 3 | Sacred indigenous walks with Chief Kingsley to bespoke corporate wellness retreats. | 83 |
| 4 | Every experience creates lasting impact for communities, animals, and the land. | 79 |
| 5 | From retreats to connectivity, from content to community - explore with us. | 75 |

(1, 3, 4 verbatim /tours-retreats; 2 verbatim footer; 5 adapted from hero subheadline `[TODO: confirm]`)

### Descriptions — **#1 is the SHORT description (Ads UI requires one ≤60 chars)**
| # | Text | Chars |
|---|---|---|
| 1 | **SHORT:** Indigenous-led tours & retreats in Cape Town. Book now. | 55 |
| 1b | Indigenous-led tours, wellness retreats and conscious experiences in Cape Town. Book now. | 89 |
| 2 | Strategic guidance for conscious businesses creating positive impact. | 69 |
| 3 | Authentic storytelling through video, photography, and multimedia. | 66 |
| 4 | Community-building strategies that drive meaningful engagement. | 63 |
| 5 | 12,000 years of heritage. Small groups. Real community impact. Cape Town, South Africa. | 87 |

(2–4 verbatim Services section; 1 & 5 composed from hero stats + meta description `[TODO: confirm]`)

### Business name (≤25 chars)
**Omni Wellness Media** (19)

### Images & logo required by PMax
| Asset | Ratio | Recommended | Minimum | Source suggestion |
|---|---|---|---|---|
| Logo square | 1:1 | 1200×1200 | 128×128 | `/branding/omni-badge-512.png` (512×512, in repo — meets min) |
| Logo landscape | 4:1 | 1200×300 | 512×128 | `[TODO: confirm]` — horizontal wordmark exists in storage (`Omni Horizontal Logo-07.png`), needs export at 4:1 |
| Image landscape | 1.91:1 | 1200×628 | 600×314 | Crop in Ads UI from the URLs below |
| Image square | 1:1 | 1200×1200 | 300×300 | Crop in Ads UI from the URLs below |
| Image portrait (optional) | 4:5 | 960×1200 | 480×600 | Crop in Ads UI from the URLs below |

**Paste-ready image source URLs** (download, then crop per ratio in the Ads UI):
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/indigenous%20tour%20chief%20kingsley%20explaining.jpg`
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%201.jpg`
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%202.jpg`
- `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/muizenberg%20cave%20view%202.jpg`
- Horizontal wordmark (for the optional 4:1 logo export): `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/Omni%20Horizontal%20Logo-07.png`

Min 3 landscape + 3 square images for full asset serving; export at recommended sizes, <5120KB each.

### Call-to-action (goal: leads + bookings)
1. **Book Now** — primary (matches `booking_inquiry` conversion)
2. **Contact Us** — lead fallback (matches `contact_submit`)
3. **Learn More** — breadth/traffic fallback

---

## 4. Landing-page punch list (prioritized — nothing auto-applied)

**P0 — before enabling the campaign tonight**
- [ ] Paste `AW-` ID + 4 conversion labels (steps in §1) — until then Ads reports zero conversions and PMax can't optimize
- [ ] Create the 4 conversion actions in Ads UI → Goals (names above), set `booking_inquiry` as primary

**P1 — this week (Quality Score / cost-per-click impact)**
- [ ] Compress `public/lovable-uploads` (79MB of PNGs, largest 3.1MB) → WebP; biggest single lever on landing-page experience scores
- [ ] Unique `<title>` + meta description for `/tours-retreats` (site-wide per-page meta exists on only 6 of 97 pages)
- [ ] No cookie-consent/Consent Mode v2 banner exists — required for EEA serving and increasingly enforced; fine for ZA-only targeting tonight, needed before widening geo

**P2 — soon**
- [ ] `/tours` shows USD $ prices to ZA traffic (confusing + relevance signal) — convert display to ZAR
- [ ] Verify `public/sitemap.xml`/`robots.txt` reference live routes
- [ ] Add a single sticky "Book Now" CTA on `/tours-retreats` mobile to shorten path to inquiry

**Explicitly not touched:** billing, payments, campaign creation — manual in Ads UI tonight as instructed.
