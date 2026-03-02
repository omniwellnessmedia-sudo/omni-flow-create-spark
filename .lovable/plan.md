

# Feroza's Complete Fix List -- Implementation Plan

This is a large batch of fixes spanning the homepage, tours, travel store, blog, contact, and sitewide name corrections. The issues are organized by page and priority.

## Fixes by File

### 1. Homepage -- HeroSection.tsx
- **Remove 2BeWell card** from `workspaceItems` array (line 69-75) -- it still appears in the "curated for you" section
- **Chief Kingsley card** (line 93-103): Change `href` from `/tours/great-mother-cave-tour` to `/tours/great-mother-cave-tour#chief-kingsley` so it scrolls to Chief Kingsley's section
- **"Our Services" CTA** (line 291): Currently links to `/services` via React Router `<Link>`. Change to native `<a href="/#curated-services">` to enable proper scroll behavior, and add `id="curated-services"` to the workspace section div

### 2. Homepage -- ToursRetreatsPreview.tsx
- **Category buttons** (lines 127-142): Currently link to `/tours-retreats/indigenous-wisdom`, `/tours-retreats/wellness-retreats`, etc. -- these routes do not exist. Fix to:
  - Indigenous Wisdom & Healing -> `/tours/great-mother-cave-tour`
  - Wellness Retreats -> `/tour-detail/winter-wine-country-wellness`
  - Study Abroad -> `/tours/muizenberg-cave-tours`
  - Winter Wellness -> `/tour-detail/winter-wine-country-wellness`

### 3. Homepage -- PartnersSection.tsx
- **Remove 2BeWell** from partners array (line 9)

### 4. Homepage -- TestimonialsSection.tsx
- **Remove 2BeWell testimonial** (lines 16-20)

### 5. Muizenberg Cave Tour -- MuizenbergCaveTours.tsx
- **Joel's avatar** (line 93): Currently shows Chief Kingsley's image (`indigenous%20tour%20chief%20kingsley%20explaining.jpg`). Replace with Joel's actual portrait. Need to use a different image -- will use the Muizenberg tour guide portrait or a generic fallback since Joel's individual portrait is not in storage

### 6. Travel Well Connected -- TravelWellConnectedStore.tsx
- **Name correction**: Change `"Ferozza"` to `"Feroza"` in curator profiles (line 146)
- **Curator photos**: Replace Zenith's group photo avatar with her individual portrait; add Chad's portrait photo (currently showing initials fallback)
- **"See Picks" buttons** (lines 505-517): Currently only fires a tracking event with no navigation. Add scroll behavior to scroll to the local/viator tours section when clicked
- **Viator links** (line 458): Currently uses `search=` parameter which shows all results. This is the intended affiliate partner shop behavior per existing memory -- the Viator partner shop model doesn't support direct product deep links

### 7. Wellness Retreat -- OmniWellnessRetreat.tsx
- **Remove incorrect images**: The retreat page gallery (lines 14-21) contains generic images. Review and ensure no shark/ECD images are present. The current images appear to be from the retreat folder and general wellness -- will verify the actual URLs
- **Add more gallery images**: Currently 6 images in the gallery array, which is reasonable

### 8. Blog -- Blog.tsx
- **Blog cards not clickable**: The blog cards (line 138-169) are wrapped in `<Card>` with `cursor-pointer` but have no `onClick` or `<Link>` wrapper. Add click navigation to `/blog/{slug}` for each post
- **Zenith name**: Search confirms Zenith is spelled "Zenith Yasin" throughout -- Feroza requests "Zenith Yassin" (double-s). Need to update sitewide to "Zenith Yassin"

### 9. Contact -- Contact.tsx
- **Discovery Call button**: Uses `CalComBooking` component which loads Cal.com embed. If the `calcom_integration` feature flag is disabled, it falls back to `mailto:hello@omniwellnessmedia.co.za`. Update fallback email to `admin@omniwellnessmedia.co.za`

### 10. RoamBuddy Store
- **Name correction**: No "Feroza/Ferozza" references found in RoamBuddy components -- this may be rendered via WellnessCuratorCard which uses `ferozza` key. Fix to `feroza`
- **Pop-up**: Need to identify and soften the dominant pop-up -- likely the RoamBuddy sales bot chatbot widget

### 11. Sitewide Name Corrections
Feroza specifically requests **"Zenith Yassin"** (double-s). Currently the codebase uses "Zenith Yasin" (single-s). Files to update:
- `src/data/curatorTips.ts`
- `src/components/sections/TeamPreviewSection.tsx`
- `src/pages/About.tsx`
- `src/pages/ViatorWellnessExperiences.tsx`

And "Ferozza" -> "Feroza" across:
- `src/pages/TravelWellConnectedStore.tsx`
- `src/pages/ConsciousMediaInfrastructurePage.tsx`
- `src/components/conscious-media/ProductFilter.tsx`
- `src/pages/admin/AdminTools.tsx`
- `src/components/roambuddy/WellnessCuratorCard.tsx`

## Files to Modify (13 files)

| File | Changes |
|------|---------|
| `src/components/sections/HeroSection.tsx` | Remove 2BeWell card, fix Chief Kingsley href to include #chief-kingsley, change "Our Services" to scroll anchor |
| `src/components/sections/ToursRetreatsPreview.tsx` | Fix 4 category button links to real routes |
| `src/components/sections/PartnersSection.tsx` | Remove 2BeWell from partners array |
| `src/components/sections/TestimonialsSection.tsx` | Remove 2BeWell testimonial |
| `src/pages/tours/MuizenbergCaveTours.tsx` | Fix Joel's avatar image URL |
| `src/pages/TravelWellConnectedStore.tsx` | Fix "Ferozza"->"Feroza", update curator photos, make "See Picks" scroll to tours |
| `src/pages/Blog.tsx` | Make blog cards clickable with Link wrapper |
| `src/pages/Contact.tsx` | Update CalComBooking fallback email |
| `src/data/curatorTips.ts` | "Zenith Yasin" -> "Zenith Yassin" |
| `src/components/sections/TeamPreviewSection.tsx` | "Zenith Yasin" -> "Zenith Yassin" |
| `src/pages/About.tsx` | "Zenith Yasin" -> "Zenith Yassin" |
| `src/pages/ViatorWellnessExperiences.tsx` | "Zenith Yasin" -> "Zenith Yassin" |
| `src/components/roambuddy/WellnessCuratorCard.tsx` | "ferozza" -> "feroza" |

