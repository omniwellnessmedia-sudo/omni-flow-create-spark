

# Comprehensive Fix: Homepage Link, Tour Pages Update & Travel Store Polish

## Context
The site is live. Zenith and Mandeep (RoamBuddy) are sharing it. Several issues need immediate attention: broken links, outdated tour copy/pricing, and the Travel Well Connected store page has mobile issues.

## Changes

### 1. Homepage Hero Card Link Fix (`src/components/sections/HeroSection.tsx`)
- Line 79: Change `href: "/travel-well-connected"` to `href: "/roambuddy-store"`
- Line 290: Change the "Travel Store" button link from `/travel-well-connected-store` to `/roambuddy-store`

### 2. Update All Three Tour Pages with Production Copy from Strategy Doc

**Great Mother Cave Tour (`src/pages/tours/GreatMotherCaveTour.tsx`)**
- Update pricing from R1,500 to tiered pricing: R2,330 (1-4 pax), R2,050 (5-9), R1,850 (10-12)
- Update location from "Muizenberg" to "Fish Hoek, Cape Town" (start: Fish Hoek Athletics Club)
- Update duration to "4-5 hours"
- Replace description with production copy from the strategy doc (12,000-year heritage, Ascension Tunnel, Peer's Cave)
- Update SEO meta description
- Add "What's Included" section: Expert Indigenous Guidance, Deep Cultural Immersion, Traditional Refreshments, Herbal Gift, Commemorative Gift, Safety Support
- Add optional lunch add-on (R200/person)
- Add "Buy One Sponsor One" community impact note linking to Dr. Phil-afel Foundation
- Update group size to max 12
- Add partner credit: "Operated by Travel & Tours Cape Town Pty Ltd"

**Muizenberg Living Heritage Walk (`src/pages/tours/MuizenbergCaveTours.tsx`)**
- Update subtitle to "An Experience of Ancient History by the Sea"
- Replace description with production copy: Surfers Corner start, Boyes Drive ascent, ancient foraging paths, shell middens, marine resources
- Update start point to "Surfers Corner Circle (Walk of Fame)"
- Update duration to "5-6 hours"
- Update difficulty to "Challenging"
- Update pricing to tiered: R2,330/R2,050/R1,850
- Update group size to max 12
- Remove Joel Erasmus references (doc doesn't mention him) -- replace with Chief Kingsley + T&T team
- Add same inclusions grid and Dr. Phil-afel Foundation link
- Update SEO meta

**Kalk Bay Rich Tapestry Walk (`src/pages/tours/KalkBayTour.tsx`)**
- Full page rebuild from placeholder to production-ready
- Subtitle: "Ancient Whispers, Healing Herbs"
- Replace description with production copy: historic harbour, herb stands, Khoi marine knowledge, ancient trade routes, plant medicine
- Start point: "Next to the Brass Bell Restaurant entrance"
- Duration: 5-6 hours, Difficulty: Challenging, Max 12
- Same tiered pricing and inclusions
- Add booking sidebar component (same as Great Mother Cave)
- Change all `/travel-well-connected-store` links to `/roambuddy-store`
- Remove "Coming Soon" status -- this is a live product
- Add Dr. Phil-afel Foundation community impact section

### 3. Travel Well Connected Store Fixes (`src/pages/TravelWellConnectedStore.tsx`)
- Update local tour data to match new pricing (all walks R1,850-R2,330 tiered)
- Update Muizenberg tour title to "Muizenberg's Living Heritage" and description
- Update Fish Hoek walk to link to Great Mother Cave tour (same route, Fish Hoek start)
- Fix hero image loading: add `fetchPriority="high"` and `loading="eager"`
- Add `overflow-x-hidden` to root container for mobile
- Fix tab buttons: add responsive sizing for mobile (`text-sm` on small screens)

### 4. Cross-Site Link Updates
- `KalkBayTour.tsx` lines 41, 159: `/travel-well-connected-store` → `/roambuddy-store`
- `ToursRetreatsPreview.tsx` line 155: `/travel-well-connected-store` → `/roambuddy-store`
- `Footer.tsx` line 286: update Travel Store link to `/roambuddy-store`

### 5. Dr. Phil-afel Foundation Integration
- Add a shared "Community Impact" card component to all three tour pages showing:
  - "Buy One Sponsor One" model explanation
  - 20% of proceeds support Dr. Phil-afel Foundation community projects
  - Section 18A tax-deductible donation note
  - Link to foundation (existing drphilafel route or external)

## Files Modified (6 files)
| File | Change |
|------|--------|
| `src/components/sections/HeroSection.tsx` | Fix ROAM card + Travel Store button links to `/roambuddy-store` |
| `src/pages/tours/GreatMotherCaveTour.tsx` | Full copy update: pricing, description, location, inclusions, Dr. Phil-afel |
| `src/pages/tours/MuizenbergCaveTours.tsx` | Full copy update: description, pricing, start point, guide references |
| `src/pages/tours/KalkBayTour.tsx` | Rebuild from placeholder to production page with booking sidebar |
| `src/pages/TravelWellConnectedStore.tsx` | Update local tour data, fix hero image loading, mobile fixes |
| `src/components/sections/ToursRetreatsPreview.tsx` | Update store link |

## What This Does NOT Cover
- Supabase tours table records (Phase 1 DB task per strategy doc)
- Stripe payment integration (Phase 3, Month 2)
- Viator/GetYourGuide external listings (done outside platform)
- WellCoin earn rate configuration (requires DB setup)
- Automated booking confirmation emails (edge function, Phase 3)

