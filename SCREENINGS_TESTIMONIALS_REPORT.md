# Screenings Testimonials Report

Branch: `feat/screenings-testimonials`. Date: 26 August 2026. No em dashes appear in any file created or modified. This report is written for a public repository, so it references private consent restrictions by class and location rather than reproducing their contents; the file and line references give the team everything needed to act.

## 1. Where the route lives and what changed

The `/screenings` route is declared in `src/App.tsx` and renders `src/pages/Screenings.tsx` (lazy loaded). Changes made:

- `src/data/testimonials.ts`: new consent register, eleven records, typed schema with the extended `ConsentStatus` union (including `anonymous_permitted`), `reidentificationRisk` and `reidentificationNotes`.
- `src/data/blockedTerms.ts`: the anonymity blocklist (contents reproduced in section 6).
- `src/lib/testimonialGate.ts`: `isPublishable` with Branch A (attributed) and Branch B (anonymous), plus `blockingReason` and `firstBlockedTerm` so the gate, tests and audit share one implementation.
- `src/lib/__tests__/testimonialGate.test.ts`: 29 tests, every failing condition asserted individually. All pass.
- `scripts/audit-testimonials.mjs`: build-time audit, wired first in `npm run build`, writes `TESTIMONIAL_CONSENT_AUDIT.md`, never fails the build.
- `scripts/prerender-screenings.mjs`: post-build static shell for `/screenings` carrying the route head (title, description, og, twitter, self-referencing canonical, no person's name in any tag) and exactly the gate-published quotes, so crawlers see them and the acceptance greps run against real HTML.
- `src/components/screenings/TestimonialWall.tsx`: the wall. Zero publishable records means the section is absent from the DOM entirely.
- `src/pages/Screenings.tsx`: the previous inline empty testimonial block replaced with `<TestimonialWall />`, below the SKU section and above the enquiry call to action; SKU content, pricing and copy untouched. Governance header rule 6 updated to point at the register, gate and wall. `useSEO` gains `image`, `url` and `type`.
- `package.json`: `test` script (vitest) and the two build steps.

## 2. Consent audit table as at build time

| id | consent status | publishable | blocking reason |
|---|---|---|---|
| michelle-t | anonymous_permitted | yes | publishable |
| karen-de-klerk | anonymous_permitted | yes | publishable |
| valerie-text | anonymous_permitted | yes | publishable |
| caitlin | anonymous_permitted | yes | publishable |
| luana-pasanisi | none | no | consent status is "none", publication requires "written" or "anonymous_permitted" |
| amanda | none | no | consent status is "none" (partnership offer, not a testimonial; third-party chain of custody unresolved) |
| mymoena-scholtz | none | no | consent status is "none" (did not attend; personal family disclosure must never be published) |
| nicky-voicenote | none | no | consent status is "none" (request for assistance, not a testimonial) |
| alex-dodd-audio | requested | no | consent status is "requested"; also untranscribed audio |
| nicola-vernon-audio | requested | no | consent status is "requested"; also untranscribed audio |
| samantha-phillips-audio | requested | no | consent status is "requested"; also untranscribed audio |

## 3. Branch results

- Passed via Branch B (anonymous): michelle-t, karen-de-klerk, valerie-text, caitlin. All four render with the static attribution "Attendee, August 2026" and appear exactly once each in the built HTML shell.
- Passed via Branch A (attributed): none. No record holds written attributed consent yet.
- Failed: the seven records above, each with the specific blocking condition shown. The three audio records would remain blocked by the transcription requirement even if consent arrived today.

## 4. Event metrics on the page

The page carries the figure 306 in two places. The proof band states it fully qualified: "306 session admissions across three separately ticketed sessions". The stats bar renders a large "306" numeral with the label "session admissions, three sessions" directly beneath it in the same tile. Per instruction I have not changed anything and flag the stats tile for a ruling: the qualifier is adjacent rather than inline, so whether the tile counts as a bare number is the team's call. No other attendance-like figure appears; the governed header forbids the superseded figures and none appear.

## 5. Names, quotes and likenesses rendered without a traceable consent record

A five-way parallel audit swept the repository and each finding was then independently verified (187 raw findings; 115 verified confirmed, 24 rejected as false positives and excluded below, 48 whose verification pass was cut short by session limits, marked "sweep only"). The confirmed picture, most severe first:

### 5.1 Publicly served internal ceremony files (most severe)

`public/events/wwpl/ceremony-mq7v3/screen-deck.html` and `public/events/wwpl/ceremony-mq7v3/booth-running-order.html` sit under `public/`, so they ship in every deploy and are URL-reachable by anyone. Confirmed renderings include:

- Honouree names, roles, organisations, award titles and portrait images (Drive-hosted and local) for the ceremony roster, at screen-deck.html lines 60 to 90 (43 confirmed findings in this file).
- The booth sheet publishes individuals' private consent restrictions and name-handling notes in its "Production controls" box (booth-running-order.html around line 112), for at least five named women. Publishing a person's restriction is itself a disclosure. Contents deliberately not reproduced here.
- The booth sheet footer marks itself "Not for distribution" (line 43) yet it is publicly distributed by being in `public/`.
- Identity discrepancies render publicly: one honouree is spelled differently between the deck and `awardees.ts`; another's slide notes her spelling is unconfirmed.
- A performer's stage name is linked to her legal name (screen-deck.html line 190 and booth sheet line 81).

Recommendation (no action taken, out of scope for this branch): move `ceremony-mq7v3/` out of `public/` immediately; it was event-night tooling, not web content.

### 5.2 Awards register

`src/data/awards-2026.json` renders all 37 honouree names on public certificate pages via `netlify/functions/awards.mjs:148` (routes `/awards/<serial>?v=<token>`; tokens are printed on the physical certificates, so the pages are public by design). The only consent evidence found is the print brief note ("Names locked per the print brief, 9 Aug") at `scripts/generate-award-tokens.mjs:19`, which is print approval, not web publication consent. `src/pages/events/wwpl/awardees.ts` additionally renders cleared awardee cards with names, citations and portraits on `/events/stunning-pigs`; its own register distinguishes cleared from not cleared, which is the closest thing to a traceable record found anywhere in the repo.

### 5.3 Toni (flag only, per instruction, nothing changed)

No testimonial record for Toni exists anywhere; the sweep confirmed zero quote attributions to her. Her name and likeness do render elsewhere: `src/data/awards-2026.json:294` (certificate vfw-2026-037), `src/pages/events/wwpl/awardees.ts:46` and `:49` (name, citation, portrait `/awardees/toni-brockhoven.webp` on the event page), `public/events/wwpl/ceremony-mq7v3/screen-deck.html:70` and `:183` (including a reflection slide announcing her stepping down), the booth sheet lines 77 and 80, and `src/pages/team/bwcTeamData.ts:84` where the staging card renders her name beside the recorded caveat that public references to her were removed at her request. That caveat coexisting with her full rendering on the event page, deck and register is an unresolved contradiction the team should rule on. All left untouched.

### 5.4 BWC team staging

`src/pages/team/bwcTeamData.ts` renders real people's photographs, biographies and verbatim personal statements at `/bwc-team-staging`. The verification pass confirmed the route is noindex and unlinked but NOT authenticated: anyone with the URL sees it, including one entry whose recorded register decision is "Do not publish" (line 124) and team members' private outstanding-items notes (around line 70). Several audit findings on this file were rejected as "working as designed" because the page is a documented review staging surface; the audit position is that a "Do not publish" record rendering on any unauthenticated URL deserves a ruling.

### 5.5 The screenings gallery likenesses

`src/pages/Screenings.tsx` renders identifiable people from the event night with no model release on record: the host (line 331, mc-poster-portrait.webp), panellists and audience members (line 324 and the collage reuse at line 540, qa-panel-wide.webp), and the performer (line 338, performance-wide.webp). These were consent-classified as team-side or wide-shot when added, with a courtesy flag raised at the time; formal releases remain outstanding.

### 5.6 Fabricated testimonials and reviews elsewhere on the site (different problem, same page family)

The sweep confirmed invented quotes attributed to plausible-sounding people rendering as social proof on public routes: `src/components/sections/TestimonialsSection.tsx` (homepage testimonials with names and titles), `src/data/roamBuddyProducts.ts` (three), `src/pages/tours/OmniWellnessRetreat.tsx` and `src/pages/experiences/CartHorseUrbanWellness.tsx` (sample testimonials with names), `src/components/product/ReviewSystem.tsx`, and a seeded database migration (`supabase/migrations/20250710090731...sql`). One invented testimonial attaches a real university's name to a fictitious research fellow. Separately, `src/data/curatorTips.ts` renders scripted first-person quotes in team members' real names and photos. None of these carry consent records because the people are invented, which is the inverse problem: fabricated social proof on a commercial site. Flagged for removal or replacement by the consent-gated system built here; nothing changed on this branch.

### 5.7 This branch's own residual disclosure (flagged by the audit, by design of the brief)

The full register ships to the client in the Screenings JS bundle: record ids carry names (for example `mymoena-scholtz` beside its re-identification note), and `blockedTerms.ts` enumerates every sender's first name and surname. The built HTML contains none of these (verified), but the bundle does. This follows the brief's architecture (component reads `testimonials.ts` directly). Recommendation: split the register so only gate-passing records reach the client bundle, with the full register living in a build-time-only module. One line of import changes when you want it.

## 6. Contents of blockedTerms.ts

First names: Michelle, Karen, Valerie, Caitlin, Luana, Amanda, Mymoena, Nicky, Alex, Nicola, Samantha. Surnames: de Klerk, Pasanisi, Scholtz, Dodd, Vernon, Phillips. Places: Mowbray, Cape Town, Muizenberg. The dataset currently contains no organisation names; the file instructs adding them the moment one enters a record.

Interpretation note for the acceptance grep: "Cape Town" appears five times in `dist/screenings/index.html`, every occurrence inside the page's own meta description ("Southern Peninsula, Cape Town"), which is company self-description. Zero blocked terms appear inside any testimonial markup (verified by parsing the four figure elements), and zero person or surname terms appear anywhere in the file.

## 7. Foundation branding reachable from /screenings

None found, verified across the full reachable component tree of `/screenings` including `UnifiedNavigation` and `Footer`: no Dr Phil-afel Foundation branding, no donation links, no Section 18A language, no Foundation domain references. For completeness, elsewhere in the repo (not reachable from this page, flagged only): Foundation logo asset constants exist unused in `src/lib/images.ts:133-135`; the Foundation renders as a partner card on the event page (`src/pages/events/wwpl/event.ts:391`) while `bwcTeamData.ts:42-44` records that logo permission is not confirmed; and `src/data/communityEvents.ts:89` contains a fabricated sample event claiming a Foundation partnership, date-anchored so it always appears current. All three deserve attention outside this branch.

## 8. Decisions taken under ambiguity

1. `quoteVerbatim` is committed only for the four records whose text is already approved for publication. This repository is public, so committing unconsented private messages (including a personal family disclosure) would itself be the breach this system prevents. The received texts belong in the private consent register.
2. The audit script is `scripts/audit-testimonials.mjs` rather than `.ts`: the build image runs plain Node, which cannot execute TypeScript, and the script bundles the real TypeScript gate via esbuild (already a Vite dependency) so no new dependency was added.
3. The acceptance requires quotes present in built HTML; as a client-rendered SPA the route had no built HTML, so `/screenings` now prerenders a static shell through the real gate (same mechanism as the proven event-page prerender). The shell and the runtime component cannot disagree because both call `isPublishable`.
4. Attribution renders as the static literal "Attendee, August 2026" per the direction of 26 August; the attributionMode rendering (full name, first name, initials) returns when the first written attributed consent arrives, and the mode logic remains encoded in the schema and gate meanwhile.
5. `sourceDate` values are the message dates as best known (11 or 12 August 2026); correct them in the register if the filed dates differ.
6. Vitest was added as a dev dependency: the repo had no test runner and the brief requires unit tests.
7. This report names people only where their names already appear in the repository, and describes private restriction contents by class rather than quoting them.

## 9. Acceptance results

- `npm run build` passes clean, running the consent audit first and both prerenders after.
- The four approved quotes each appear exactly once in `dist/screenings/index.html` and exactly once in the rendered DOM (verified in Chromium).
- Zero blocked person or place terms inside any testimonial markup; the only "Cape Town" occurrences are the page's own meta description (section 6).
- All 29 gate tests pass, both branches, every negative case including requested-with-populated-quote, medium risk with everything else valid, and a blocked term in the published span.
- `TESTIMONIAL_CONSENT_AUDIT.md` and this report exist at the repo root.
- No em dash or en dash character appears in any file created or modified (checked per file by codepoint).
