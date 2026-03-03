

# ROAM Launch-Ready Site Fixes

## Summary

10 files modified in one batch to make the site ROAM-launch-ready: ROAM as hero sales section on homepage, Tumelo hidden sitewide, Blog hidden from navigation, chatbot made global and non-intrusive, and critical routing/naming fixes.

## Changes by File

### 1. `src/pages/Index.tsx`
- Remove `TeamPreviewSection` import and usage (Tumelo hidden, section not needed for launch)
- Replace `ToursRetreatsPreview` with new ROAM-focused section component

### 2. `src/components/sections/ToursRetreatsPreview.tsx`
- Complete rewrite as **ROAM Sales Preview** section
- Show 3 featured ROAM eSIM product cards (South Africa, Africa Explorer, Global) with pricing and CTA linking to `/roambuddy-store`
- Keep 1 active tour card (Great Mother Cave Tour) below as "Pair with a Wellness Experience"
- Section title: "Stay Connected on Your Wellness Journey" with ROAM 🧭 branding
- CTA buttons: "Browse All eSIM Plans" -> `/roambuddy-store`, "Explore Tours" -> `/travel-well-connected-store`

### 3. `src/components/sections/TeamPreviewSection.tsx`
- Remove Tumelo from the `team` array (filter out, keeping Chad, Zenith, Feroza)
- Change grid from `grid-cols-2 md:grid-cols-4` to `grid-cols-3 md:grid-cols-3`

### 4. `src/pages/About.tsx`
- Remove Tumelo from team array
- Fix Youth Empowerment image: change `IMAGES.providers.bwc` (BWC logo) to `IMAGES.wellness.communityProject1` (actual community/youth image)

### 5. `src/components/navigation/MegaNavigation.tsx`
- Remove the Blog `NavigationMenuItem` (lines 213-220)

### 6. `src/components/navigation/UnifiedNavigation.tsx`
- Remove Blog from `navigationItems` array (the object with `title: 'Blog'`)

### 7. `src/App.tsx`
- Add route: `<Route path="/blog/:slug" element={<BlogPost />} />` (fixes blog cards linking to `/blog/slug` going to homepage)
- Change catch-all from `<Index />` to `<NotFound />` (prevents broken links silently showing homepage)
- Add global `<RoamBuddySalesBot />` component outside Routes, after Toaster (makes chatbot available on every page)

### 8. `src/components/roambuddy/RoamBuddySalesBot.tsx`
- Remove the auto-open `useEffect` timer (lines 67-82) that forces the popup open after 10 seconds
- Keep the bubble button always visible, user clicks to open
- Fix scroll issue: add `overflow-y: auto` to the message area if not already doing so

### 9. `src/data/roamBuddyProducts.ts`
- Change type definitions from `'ferozza'` to `'feroza'` in `CuratedESIMPick.curator` and `CuratorProfile.curatorId`
- Rename the `ferozza` key in `curatorProfiles` object to `feroza`
- Update all references: `curator: 'ferozza'` -> `curator: 'feroza'`

### 10. `src/components/roambuddy/WellnessCuratorCard.tsx`
- Change `case 'ferozza':` to `case 'feroza':` in the switch statement

## Technical Details

**Blog routing fix**: Currently `/blog/:slug` has no route in App.tsx. Only `/blog-post/:slug` exists. Blog cards generate links like `/blog/the-power-of-authentic-storytelling...` which hits the catch-all `*` route that renders `<Index />` -- hence clicking a blog takes you to the homepage. Adding the route and fixing the catch-all solves both issues.

**Global chatbot**: Moving `<RoamBuddySalesBot />` from `RoamBuddyStore.tsx` (page-level) to `App.tsx` (app-level) ensures Roam 🧭 is available on every page. The auto-open behavior is removed so it only shows as a subtle bubble until clicked.

**ROAM homepage section**: The rewritten `ToursRetreatsPreview` will feature 3 eSIM product cards styled consistently with the RoamBuddy store aesthetic, each with destination, data amount, price, and "Get Connected" CTA. This replaces the outdated "Transformative Wellness Journeys" heading.

