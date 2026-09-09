# Handoff: Omni Wellness Media — Service Pack

## Overview
The complete public-facing service pack for omniwellnessmedia.co.za: the services index (19 offers in 7 themed categories), a per-service detail page template (the pattern behind live routes such as `/business-consulting`), the pricing page, the free Revenue Readiness Scorecard, the social specimen sheet and the services promo kit. One data file (`data/services.json`) is the single source of truth for every name, price, inclusion and CTA. Currency is ZAR throughout.

## About the Design Files
These are **design references built in HTML**. Recreate them inside the live site's existing framework and routing (the production site is a JS single-page app on a `/slug` route scheme, so each service becomes `/<slug>`, driven by `services.json`). Do not ship the HTML files directly. `omni.css` holds the tokens; lift them into the codebase's theme layer. The promo kit (`services-promo.html`) is a team tool and can be ported nearly as-is behind an internal route.

## Fidelity
**High-fidelity.** Final colours, type, spacing, copy and interaction states. Recreate pixel-accurately.

## Files
```
data/services.json      Source of truth: categories, 19 services, quotation areas, resources, terms
data/service-detail.json Per-service hero variant, outcome headline, who-it-is-for, hero photo, FAQ
STANDARDS.md            WCAG 2.2 AA / ISO 9241-110 acceptance checklist + conversion rationale
data/tokens.json        Design tokens: colour, type scale, space, radius, shadow, motion, layout, hit sizes
data/ads.json           Sellable ad inventory (zones, slots, filled-slot schema)
components.html         Component specimen: colour, type, buttons (all states), cards, ad tiles, fields, toasts, empty/loading, FAQ
enquire.html            Conversion flow (React): route picker → details/booking/payment → confirmation; validation, busy, toasts
services.html           Services index: 7 category bands, themed offer cards, quotation box, terms, projects
service.html            Service detail template (reads services.json, ?s=<slug>) → one route per service
pricing.html            Three entry tiers, published-rate tables, quotation-based table, final CTA
scorecard.html          Revenue Readiness Scorecard (10 questions, live score, routed recommendation)
social-templates.html   11 social graphics at true export size (specimen sheet)
services-promo.html     Services promo kit: 10 editable dark artboards, 30-day calendar, copy bank
index.html              Internal asset dashboard (team hub, not public)
omni.css                Shared tokens, type, buttons, topbar, footer
image-slot.js           Drag-and-drop image placeholder (design-stage only; replace with <img>)
assets/omni-logo.png    Brand logo · assets/omni-icon.png brand mark
assets/plate-*.png      Brand-coloured PHOTO PLACEHOLDERS (hero, valley, hap, retreat, podcast, workshop). Replace with real photography.
```

## Routes to build
```
/services                      services.html
/services/<slug>               service.html for each slug in services.json (19 pages)
/enquire?s=<slug>&a=<action>  enquire.html (actions: enquire | book | pay | whatsapp)
/components                   components.html (internal)
/pricing                       pricing.html
/scorecard                     scorecard.html
/team/promo-kit                services-promo.html (protected)
```
Slugs: clarity-session, brand-content-audit, website-visibility-audit, revenue-ready-sprint, visibility-conversion-sprint, landing-page, content-starter-pack, brand-identity, bespoke-content-pack, growth-desk, social-media-management, executive-support, podcast-starter, podcast-concept, podcast-launch, campaign-command-centre, event-marketing, screening-campaign, workshops. Map any existing live slugs (e.g. `business-consulting`) to these via redirects or by renaming the slug in the JSON; the slug is the only key.

## Themed service card (the core component)
`ServiceCard` renders one entry of `services.json`. The hue comes from `service.hue` (falls back to the category hue) and is applied as a CSS variable `--hue` on the card root; everything themed reads that variable.
- Container: `border:1px solid rgba(14,21,19,.16)`, `border-radius:18px`, `padding:30px 28px 26px`, background `linear-gradient(180deg,color-mix(in oklch,var(--hue) 9%,#fff),rgba(255,255,255,.6))` (a faint wash of the service hue), `display:flex; flex-direction:column; gap:16px`, `overflow:hidden`, `transition:.3s cubic-bezier(.22,1,.36,1)`. Hover / focus-within: `translateY(-4px)`, `box-shadow:0 20px 48px rgba(14,21,19,.13)`, border turns the hue.
- Top bar: `::before` 3px tall, full width, `background:var(--hue)`.
- Name links to the service page (`service.html?s=<slug>` → `/services/<slug>`); price is 22px display with a mono uppercase unit (`<small>`) in the hue; `featured:true` renders a top-right hue `badge` reading "Most chosen".
- Name: `h3`, Cormorant Garamond 400, 27px, line-height 1.08, ink `#0E1513`.
- Price: JetBrains Mono 14px, `letter-spacing:.04em`, `color:var(--hue)`. Price note (per month, launch rate) stays in the same line.
- Summary: Inter 15px, `#43524E`.
- Inclusions: 14px, gap 7px, each item prefixed by a 5px circle in `var(--hue)`.
- CTA row: `margin-top:auto`, `padding-top:20px`, `border-top:1px solid rgba(14,21,19,.09)`, gap 10px. Buttons: mono 11px uppercase, `letter-spacing:.12em`, `padding:10px 15px`, `border-radius:999px`, `border:1px solid rgba(14,21,19,.16)`. Primary (`primary:true`): filled `var(--hue)`, white text, weight 500. Hover on any: fills ink `#0E1513`, text cream `#F7F3EA`.
- Excludes note (`excludes`): mono 11.5px, slate `#5A6763`, `letter-spacing:.05em`, 18px above.
- `wide:true` → `grid-column:1/-1`. Grid: `repeat(auto-fit,minmax(330px,1fr))`, gap 20px.
- CTA `action` → route: book → booking calendar · pay → checkout link · enquire → enquiry form · whatsapp → wa.me link. All four are anchors in the prototype and need wiring.

Hero: compact two-column copy row (eyebrow + h1 `clamp(32px,3.8vw,52px)` left; 16px lede + CTAs right) above a full-width 21:9 framed video panel (`.vid`, 14px radius, 1px `rgba(247,243,234,.14)` border, spectrum bar top, `0 40px 90px rgba(0,0,0,.5)` shadow). Video never sits behind text.

## Category band (services index)
`.band` 78px top padding. Head: 9px hue dot (translateY -6px) + eyebrow (mono 11px, `.22em`, uppercase, slate) + `h2` 38px. Category hue sets the default `--hue` for the band; individual cards override it. Order and hues: 01 Clarity and audits (teal) · 02 Websites and sprints (orange) · 03 Content and brand identity (violet) · 04 Ongoing support (teal) · 05 Podcast (blue) · 06 Campaign Command Centre (red) · 07 Quotation-based (clay, rendered as a two-column `.quotebox` panel rather than cards). Jump nav: pill links, mono 11px, 8px gap, in a bordered row under the hero.

## Service detail page (`service.html`)
Six hero variants keyed by `service-detail.json → variant`, all on ink `#0E1513` with cream text and the bright hue (`BRIGHT` map in the script) for labels and the primary CTA fill: `split` (photo panel right, ink fade on its left edge; entry offers) · `diag` (full-bleed photo clipped `polygon(0 0,100% 0,100% 40%,0 58%)`, ink gradient below; sprints) · `disc` (440px circle, 10px hue ring, 80px shadow; content) · `editorial` (photo at .22 opacity under a radial ink vignette, h1 up to 104px; retainers) · `duo` (grayscale photo + hue `mix-blend-mode:multiply` .55; podcast) · `wide` (full-bleed, 90° ink shade from the left; campaigns). Every hero: breadcrumb → mono service name in hue → outcome `h1` (italic clay accent) → lede → price 64px display + unit → CTA row (`min-height:48px`) → trust line. Body: "What you get" panel (hue-washed via `color-mix(in oklch,var(--hue) 9%,#fff)`, 3px hue bar) beside "Who this is for" (numbered list) + primary CTA + scorecard exit → three process cards → FAQ (`details/summary`, 48px rows) → related mini cards → terms. Sticky conversion bar (`#bar`) slides up once the hero leaves the viewport: name, price, primary CTA; `aria-hidden` toggled by IntersectionObserver.
Previous spec for reference. Hero: breadcrumb (hue dot + `NN · Category`, mono 11px) → `h1` `clamp(42px,5.8vw,80px)` → lede 19px → price line (display 56px + mono unit in hue) → CTA row (primary filled in hue, secondaries outlined). Body: 2-column grid `1.1fr .9fr`, 44px gap (1 column under 860px). Left: "What is included" panel (card styling above, inclusions at 15.5px with 6px dots, excludes/category note under a hairline). Right: "How it works", three numbered steps separated by hairlines (mono number in hue, 17px semibold title, 14.5px body). Then "Also in <category>" with up to 3 mini cards (16px radius, 22px name, mono price in hue), then the standard commercial terms (2 columns) closed by the spectrum rule. Services with an empty `includes` array show the summary in place of the list with "Scope is confirmed on enquiry."

## Pricing page
Three `.tier` cards (20px radius) in a 3-column grid; middle tier `feature` uses `rgba(43,185,185,.13)` fill and `rgba(43,185,185,.5)` border, labelled "Most chosen". Amount 44px display; unit 11px mono uppercase. Three tables: header row mono 10.5px `.16em` uppercase, rate column mono teal nowrap, 16px/14px cell padding, `rgba(14,21,19,.09)` row rules. Final CTA panel: 22px radius, centred, two buttons.

## Scorecard
Ten questions, four options each (Not yet / Partly / Mostly / Yes = 0–3), sticky 340px panel with `n/30` score and a 6px spectrum-gradient meter (`width:score/30`, `transition:width .5s cubic-bezier(.22,1,.36,1)`). Bands: ≤10 Foundations missing → Clarity Session · ≤18 Leaking revenue → Website & Visibility Audit · ≤25 Ready to convert → Revenue-Ready Sprint · else Ready to scale → Growth Desk. Verdict renders only when all ten are answered. Capture form (name, email, consent) must post to the CRM with score, answers and source.

## Promo kit (team tool)
Ten dark artboards authored at true export size (1080×1080, 1080×1920, 1200×627) and scaled with `transform:scale()` inside fixed `.frame` wrappers; exported with html-to-image@1.11.11 at `transform:none`. Editable text via `[data-edit]` + contenteditable → localStorage (`osp:` namespace); photo replace via canvas resize (max 1800px, JPEG .85); 7-swatch hue switcher setting `--hue` on the artboard; per-card Reset. Artboards use the bright artboard hue set and stay dark by design. Replace Unsplash hotlinks with repo-hosted copies (IDs: 1506126613408, 1455390582262, 1497032628192, 1454165804606, 1416879595882, 1502920917128, 1478737270239, 1522202176988).

## Interactions
- Hover: `.btn` inverts to cream-on-ink; `.btn-solid` goes teal; cards lift surface to `#fff`. Easing `.25s cubic-bezier(.22,1,.36,1)`.
- Sticky topbar 74px, `rgba(247,243,234,.88)` + `backdrop-filter:blur(14px)`; nav links hidden under 760px; `.wrap` gutter 32px → 20px.
- No loading/error states on public pages; scorecard state is derived only (see above).

## Design Tokens
Spectrum (light theme, contrast-checked on cream): red `#BE2029` · orange `#A34E0C` · yellow `#8A6A05` · green `#337A29` · teal `#0E6E70` · blue `#2C6FB5` · violet `#5C2A8A`. Accent clay `#8A7444`, slate `#5A6763`.
Artboard set (dark graphics only): `#E63946 #F38020 #F5C518 #4FAE3F #2BB9B9 #2C6FB5 #5C2A8A`.
Neutrals: ink `#0E1513` · ink-2 `#15201F` · deep `#1F2F27` · mist (body) `#43524E` · slate (labels) `#5A6763` · cream (ground) `#F7F3EA` · cream-2 `#FAF8F2`.
Surfaces: card `linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,.55))` · panel `rgba(255,255,255,.72)` · border `rgba(14,21,19,.16)` · hairline `rgba(14,21,19,.09)`.
Type: Cormorant Garamond 300–600 (display; italic + clay is the headline accent) · Inter 300–700 (body, line-height 1.6, `text-wrap:pretty`) · JetBrains Mono 400–500 (eyebrows, labels, prices; uppercase, `.1em–.22em`). Scale: h1 `clamp(46px,6.4vw,86px)` · h2 38px · card h3 27px · body 15px · small 13.5–14px · label 10.5–11px. Self-host fonts in production.
Radius: 16 / 18 / 20–22 px panels, 999px pills. Max width 1180px. Section rhythm 64–96px. Spectrum rule: 3px, red→violet gradient, section terminator.

## Media (Pixabay)
- `data/media.json`: every Pixabay asset in use (video 11473 by Templune as the services hero banner and sprint detail heroes; photos 2838921, 1964816, 374771 as band art tiles and detail heroes) with page URL, CDN URL, credit and a shortlist of further "graphic designer working" candidates. Pixabay Content License: free for commercial use, no attribution required; download originals into the repo and stop hotlinking before launch. Keep the courtesy credit line.
- Hero video: `<video autoplay muted loop playsinline>` behind an ink gradient, poster from the CDN, a 44px Pause/Play toggle (WCAG 2.2.2), hidden entirely under `prefers-reduced-motion` (poster shows instead).
- Band art tile (`.card.art`): grayscale photo + hue `mix-blend-mode:multiply` .6 + ink gradient, 30px display caption with italic clay accent, mono credit line. One per category band on the services index (Websites, Content, Ongoing support).

## Conversion flow (`enquire.html`)
Every CTA on every card and detail page links to `/enquire?s=<slug>&a=<action>`. Step 1 shows the routes the offer supports (`services.json → cta[].action`, enquire always present) as selectable route cards. `whatsapp` opens `wa.me/<number>?text=` with the offer pre-filled (set `WA` constant). Step 2 is a form: name, org, email, phone (SA format), plus per-route fields: enquire adds message (20+ chars), timing and budget selects; book adds a 10-weekday picker and six SAST time slots (unavailable slots disabled); pay adds an optional note. POPIA consent checkbox is required. Validation runs on submit, inline `role=alert` messages, first invalid field receives focus, toast summarises. Submit shows a busy spinner (1.1s mock) then step 3: reference `OWM-nnnn`, route-specific confirmation, next actions (pay: "Continue to payment" → Yoco/PayFast hosted checkout). Sticky side panel shows the selected offer with a switcher across all 19 offers. Backend contract: POST `{slug, action, name, org, email, phone, message, timing, budget, day, time, consent, source}`; return `{reference}`; for `pay` return a hosted-checkout URL.

## Mobile navigation
Under 760px the nav links and topbar CTA collapse into a 44px hamburger (`.menu`, animated to a cross via `aria-expanded`) that opens a full-height cream drawer (`#drawer`, display-font links 30px, 48px rows, CTA at the bottom). Body scroll locks while open; any link click closes it.

## Advertising inventory
`data/ads.json` defines sellable slots. Two formats: **strip tile** (`.ad`, 3-up `.adbar` directly under the hero, 84px min height, 56px thumbnail, label + title + line) and **grid card** (`.card.ad`, fills empty cells so every service band is a complete 3-column row; 120px thumbnail, label, title, line, "Visit →"). `available:true` renders a dashed "Ad space · Available" placeholder linking to `#advertise`; a filled slot renders partner label, thumbnail, copy and a `rel="sponsored noopener"` link. Zones: `hero-strip`, `band:build`, `band:content`, `band:retainer`. The grid is fixed `repeat(3,1fr)` (2 under 900px, 1 under 620px) so slot counts stay predictable: bands with an art tile + 3 offers take 2 ad cards to complete the second row. Back this with a small CMS table (id, zone, partner, title, line, img, href, cta, start/end) and an impressions/clicks log.

## Content rules
Names, prices, inclusions and terms in `services.json` are client-approved copy: do not reword. Keep prices in the one JSON file so pages and promo assets cannot drift. No em dashes in copy. Social-media tier rates, photography/videography prices, marketplace rates and VAT treatment stay unpublished pending sign-off.

## Before launch
1. Replace every `assets/plate-*.png` with real photography (three project cards); download the Pixabay media in `data/media.json` into the repo.
2. Wire the four CTA actions (book, pay, enquire, whatsapp) to real endpoints.
3. Connect the scorecard capture to the CRM.
4. Put `index.html` and `services-promo.html` behind team auth.
5. Add redirects from any legacy service slugs to the new `/services/<slug>` routes.
