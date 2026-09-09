# UI/UX standards alignment

There is no IEEE standard that specifies web UI. The recognised standards this pack is aligned to, and how, are listed below. Treat this file as the acceptance checklist for every route.

## WCAG 2.2 Level AA (W3C; referenced by ISO/IEC 40500)
- Contrast: light-theme spectrum hues (`#BE2029 #A34E0C #8A6A05 #337A29 #0E6E70 #2C6FB5 #5C2A8A`) all ≥4.5:1 on cream `#F7F3EA`; dark heroes use the bright set only for labels ≥11px mono or as fills behind ink text. Body `#43524E` on cream = 8.2:1.
- Target size (2.5.8): every button and CTA pill has `min-height:44px`; `.btn` is 46px; FAQ summaries 48px.
- Focus visible (2.4.7 / 2.4.11): global `:focus-visible` 3px teal outline, 3px offset. Nothing removes outlines.
- Bypass blocks (2.4.1): skip link on every page (`.skip`), landmarks `header / nav[aria-label] / main / footer`.
- Headings (1.3.1 / 2.4.6): one `h1` per page, sections labelled via `aria-labelledby`.
- Motion (2.3.3): `prefers-reduced-motion` collapses all transitions and the marquee.
- Non-text (1.1.1): decorative brand mark `alt=""`; hero photos carry descriptive alt from `service-detail.json`.
- Consistent navigation and identification (3.2.3 / 3.2.4): same topbar, footer, CTA vocabulary (Book / Pay now / Enquire / WhatsApp) on every route.
- Accordion uses native `details/summary`: keyboard and screen-reader semantics for free.
- Sticky CTA bar toggles `aria-hidden` so it is not announced while off-screen.

## ISO 9241-110:2020 dialogue principles
- Suitability for the task: price, scope, exclusions and the primary action are visible in the first viewport of every service page.
- Self-descriptiveness: breadcrumb `NN · Category`, service name eyebrow, outcome headline, then facts. Trust line states the process (scope in writing, ZAR, 14-day validity).
- Conformity with expectations: pricing vocabulary matches the rate card exactly; "from" always means quoted.
- Error tolerance: nothing is purchased without the written-scope step (How it works, step 02). FAQ answers the exclusion questions before checkout.
- Controllability: secondary exit on every page ("Not sure? Take the free scorecard").

## ISO/IEC 25010 quality attributes to test
Usability (learnability, accessibility), performance efficiency (hero image `loading="eager"`, everything else lazy; self-host fonts), compatibility (no framework assumptions in the data model), maintainability (one JSON source for facts).

## Requirements documentation (IEEE 29148 / IEEE 830 spirit)
`README.md` is the requirements document: unambiguous values, traceable copy (client-approved, in `services.json`), verifiable acceptance criteria (this file). Any change to a price or inclusion is a change to `services.json` only.

## Conversion design rationale (per service)
Each category has a distinct hero treatment so the pages do not read as one template repeated: entry offers use a split frame with the price as the headline (low-risk, buy-now); sprints use a diagonal full-bleed photo with a fixed-scope promise; content offers use a circular crop with the hue ring; retainers are editorial and quiet; podcast pages are duotone; campaigns are wide cinematic frames. Every page carries: outcome headline → price → primary CTA → trust line → inclusions + exclusions → who it is for → three-step process → objections FAQ → related offers → terms → sticky CTA once the hero scrolls away.
