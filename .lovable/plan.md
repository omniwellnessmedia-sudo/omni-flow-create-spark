
Context recap (what’s broken per team feedback)
- Welcome page category cards (Indigenous Wisdom & Healing / Wellness Retreats / Study Abroad / Winter Wellness) look clickable but the action is unclear.
- 2BeWell product image(s) still not showing across devices.
- Great Mother Cave Tour opens, but doesn’t auto-scroll/anchor to Chief Kingsley’s section.
- Some “Email” CTAs don’t open the email client on MacBook (common when using window.open for mailto).
- Cal.com CTAs do not open/redirect on desktop or phones.
- Travel Well Connected “Browse Global Adventures” button does nothing.
- Team photos: Warren/Stephen not visible where expected; Tumelo photo not visible.

Root causes found in code (high confidence)
1) Welcome page UX ambiguity
- The screenshot matches the “Quick Links to Categories” grid in `src/components/sections/ToursRetreatsPreview.tsx`.
- Those cards are wrapped in `<Link>` so they are clickable, but there is no explicit “this is a link” affordance (no arrow, no “Explore” label/button, no secondary cue).

2) 2BeWell product image not displaying
- `src/components/sections/TwoBeWellCTA.tsx` uses:
  `product-images**%20(2BeWell)/10.png`
  This is not URL-encoded correctly for folders containing `**`.
- Your own image system (`src/lib/images.ts`) explicitly says `**` must be encoded as `%2A%2A`.
- Result: the image URL likely 404s on all devices, so users see “no changes”.

3) Chief Kingsley anchor not working
- `src/pages/tours/GreatMotherCaveTour.tsx` has a “Meet Chief Kingsley” section, but it does not have an `id` like `chief-kingsley`.
- Links currently point to `/tours/great-mother-cave-tour` without a hash.
- Also, React Router won’t automatically scroll to a hash on route change unless we implement it.

4) Email buttons not opening (MacBook)
- There are still multiple `window.open('mailto:...')` usages (confirmed across several pages/components).
- Modern browsers often block `window.open()` for mailto (pop-up blocker / gesture detection quirks).
- The most reliable cross-device pattern is:
  - Use a real `<a href="mailto:...">` (preferred)
  - Or set `window.location.href = 'mailto:...'` (acceptable fallback)
  - Avoid `window.open('mailto:...')`

5) Cal.com buttons not opening
- Current `CalComBooking` relies on injecting the Cal embed script and calling `window.Cal("popup"/"modal")`.
- This is fragile on mobile Safari and in environments with script loading timing issues.
- The fastest reliable fix is to provide a “direct-link” mode:
  - Use a normal `<a href="https://cal.com/{username}/{eventSlug}" target="_blank" rel="noopener noreferrer">`
  - That avoids any popup/embed JS issues and works on all devices.

6) Travel Well Connected “Browse Global Adventures” button not working
- In `src/pages/TravelWellConnectedStore.tsx`, the button calls:
  `document.getElementById('viator-tours')?.scrollIntoView()`
- But `#viator-tours` is inside `<TabsContent value="viator" id="viator-tours">`.
- The Tabs default is `local`, so the `viator` content may not be mounted in the DOM when inactive; the element doesn’t exist, so scroll does nothing.
- Fix requires switching the tab to `viator` first, then scrolling after render.

7) Team photos not visible
- Homepage “TeamPreviewSection” only includes 4 members (Chad, Tumelo, Zenith, Feroza). Warren & Stephen won’t appear on the homepage unless we add them there.
- Tumelo is currently `image: null` everywhere, so he will always show initials until we wire in his uploaded photo.
- About page currently uses Warren/Stephen Supabase URLs (good), but if users are checking the homepage they won’t see them.

Implementation plan (ASAP, minimal-risk, cross-device first)

Phase 1 — Fix 2BeWell images everywhere (highest visibility)
1) Update `src/components/sections/TwoBeWellCTA.tsx`
   - Replace `product-images**%20(2BeWell)` with the properly encoded folder name:
     `product-images%2A%2A%20(2BeWell)`
   - Keep the existing onError UI fallback, but avoid `innerHTML` injection if possible (safer to do state-based fallback rendering). If we keep it, ensure it doesn’t break hydration.
2) Quick audit for other `product-images**` occurrences
   - Replace any unencoded `**` folder usage with `%2A%2A`.

Expected outcome:
- The 2BeWell CTA product image should load consistently on Mac/iPhone/Android.

Phase 2 — Fix Chief Kingsley anchor (route + hash scroll)
1) Add an anchor target in `src/pages/tours/GreatMotherCaveTour.tsx`
   - Add `id="chief-kingsley"` to the “Meet Chief Kingsley” section wrapper.
   - Add `scroll-mt-24` (or similar) so the section isn’t hidden under the fixed header.
2) Update all CTAs that should jump to the profile section
   - Where relevant (Hero cards / community cards), change href to:
     `/tours/great-mother-cave-tour#chief-kingsley`
3) Implement global “scroll-to-hash on route change”
   - Add a small component (e.g., `ScrollToHash`) that uses React Router’s `useLocation()`:
     - On location change, if `location.hash` exists:
       - `setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))`
     - Else scroll to top on normal page changes (optional).
   - Mount it once inside the Router (likely in `src/App.tsx`).

Expected outcome:
- Clicking “Chief Kingsley’s Wisdom” lands directly at his profile section on all devices.

Phase 3 — Make Welcome page category cards’ action obvious
Target file:
- `src/components/sections/ToursRetreatsPreview.tsx`

Changes:
1) Keep navigation (since they already route to category pages), but add explicit affordance:
   - Add a small “Explore” label + Arrow icon inside each card.
   - Add `aria-label` like `Explore Indigenous Wisdom & Healing`.
   - Ensure cursor/hover states match: if clickable, keep `cursor-pointer` but also add visible cue.
2) Optional improvement:
   - Make the entire card clickable AND add a small button-like chip (“Explore”) so users immediately understand the action.

Expected outcome:
- No more “looks clickable but not sure what it does” feedback.

Phase 4 — Fix email CTAs (stop using window.open mailto)
Targets (based on matches found):
- `src/components/programs/RecruitmentJourney.tsx` (uses window.open mailto)
- `src/pages/programs/UWCRecruitment.tsx` (mailto template button)
- `src/pages/programs/UWCUniversityPartners.tsx` (mailto)
- `src/pages/programs/UWCSponsors.tsx` (mailto)
- `src/pages/BusinessConsulting.tsx` (mailto)
- Potentially other pages identified by the same pattern

Changes:
1) Replace `window.open('mailto:...', '_blank')` with either:
   - `<Button asChild><a href="mailto:...">...</a></Button>` (preferred)
   - OR `onClick={() => { window.location.href = 'mailto:...'; }}` (fallback)
2) Ensure all mailto buttons meet iOS Safari + accessibility standard:
   - Minimum 44px touch target (already mostly handled by your Button component)

Expected outcome:
- Mail client opens reliably on MacBook/iPhone/Android.

Phase 5 — Make Cal.com booking work reliably (remove fragile popup dependency)
Targets:
- `src/components/booking/CalComBooking.tsx`
- Pages using it: `src/pages/WebDevelopment.tsx`, `src/pages/MediaProduction.tsx`, others

Approach (fastest reliable):
1) Add “direct link” booking mode:
   - Build the URL: `https://cal.com/{calUsername}/{eventTypeSlug}`
   - Render as `<a target="_blank" rel="noopener noreferrer">Book with Cal.com</a>`
2) Update service pages:
   - Keep “Email to Book” as mailto anchor
   - Make “Book with Cal.com” a direct link button (not embed popup)
   - Fix mobile layout so buttons are balanced (stacked full-width on small screens, equal spacing)
3) Optional: keep embed popup as enhancement
   - If you still want the popup experience, keep it behind a feature toggle or only after confirming it works on iOS Safari.
   - But the direct link should always exist as the reliable path.

Expected outcome:
- Cal.com booking works on all devices immediately.

Phase 6 — Fix Travel Well Connected “Browse Global Adventures”
Target:
- `src/pages/TravelWellConnectedStore.tsx`

Changes:
1) Convert Tabs to controlled state:
   - `const [tab, setTab] = useState<'local' | 'viator'>('local')`
   - `<Tabs value={tab} onValueChange={(v) => setTab(v as any)} ...>`
2) Update “Browse Global Adventures” button:
   - `setTab('viator')`
   - After render: `setTimeout(() => document.getElementById('viator-tours')?.scrollIntoView(...), 100)`
3) Add a secondary fallback link:
   - A plain `<a>` that goes to the Viator partner shop URL (external) in case the Viator tab has no data yet.

Expected outcome:
- Button always does something: switches to Viator tab and scrolls, plus external fallback.

Phase 7 — Team photos: show Warren/Stephen where expected + add Tumelo photo
Targets:
- `src/pages/About.tsx`
- `src/components/sections/TeamPreviewSection.tsx`

Changes:
1) About page (already using Warren/Stephen Supabase URLs)
   - Keep as-is but add `loading="lazy"` and ensure `object-position` is appropriate.
2) Homepage team preview:
   - Decide expectation: if the team expects to see Warren & Stephen on the homepage, add them to `TeamPreviewSection` (currently only 4 people).
3) Tumelo photo integration:
   - Use the uploaded Tumelo photo (`user-uploads://image-21.png`) by copying it into the project and referencing it safely:
     - Preferred: `src/assets/team/tumelo.png` and import it
     - Or: `public/lovable-uploads/tumelo.png` and reference `"/lovable-uploads/tumelo.png"`
   - Then set Tumelo’s `image` to that URL/import in both About and TeamPreview.

Expected outcome:
- Warren/Stephen visible in the sections where the team expects them.
- Tumelo shows a real photo instead of initials.

QA checklist (must be done before calling it “fixed”)
- Welcome page: category cards clearly indicate action (“Explore”) and still navigate correctly.
- 2BeWell: the hero/CTA product image loads on Mac + iPhone Safari + Android Chrome.
- Great Mother Cave Tour: clicking Chief Kingsley CTAs lands directly at the profile section without manual scroll.
- UWC Apply/Email CTAs: mail client opens on MacBook.
- Web Dev / Media Production:
  - “Email to Book” opens mail client
  - “Book with Cal.com” opens Cal.com in a new tab reliably (desktop + mobile)
  - Buttons look balanced on mobile (full-width stack)
- Travel Well Connected: “Browse Global Adventures” switches to Viator tab and scrolls; external fallback link works.

If you want, I can proceed immediately with implementation in a new request (this message is read-only by instruction).