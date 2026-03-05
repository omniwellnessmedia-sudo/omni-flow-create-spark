

# Final Polish: Animations, Mobile Overflow, Broken Images & Routing

Fixing all reported issues except tour copy (will be handled separately when PDF content is available).

## Changes by File (8 files)

### 1. `src/components/sections/HeroSection.tsx`
- **Remove scroll indicator** (lines 303-311): Delete the bouncing mouse/scroll animation at bottom of hero that Feroza flagged as distracting and overlapping buttons on mobile
- **Hide gaia orbs on mobile** (lines 242-247): Add `hidden md:block` wrapper around the 4 floating orb divs to prevent text overlap on small screens

### 2. `src/pages/About.tsx`
- **Fix mobile overflow**: Add `overflow-x-hidden` to the root `<div className="min-h-screen">` container (line 102)
- **Fix Hero heading size**: The `split` variant heading is too wide for mobile. Wrap the `omniVoice.pageIntros.about.headline` in a responsive container to prevent overflow
- **Deduplicate/fix story images**: Some `storyImages` resolve to the same URL or broken URLs. Replace any duplicates with distinct images from `IMAGES.wellness.*`, `IMAGES.services.*`, `IMAGES.community.*`
- **Fix Warren photo**: Add `onError` handler to show initials fallback when `warren.png` doesn't load (already has gradient initials base layer, so this should work via the existing `onError` pattern at line 241)

### 3. `src/pages/tours/OmniWellnessRetreat.tsx`
- **Remove shark/aquarium images**:
  - Line 339: Replace `community outing 1.jpg` (shows person at aquarium) with `Wellness retreat 2.jpg` or another retreat-folder image
  - Line 618: Replace `community outing 2.jpg` (kids at dolphin mural) with retreat-specific image from the `Annual Omni Wellness Retreat` folder
- **Fix broken indigenous heritage image** (line 625): The URL `khoe indigenous language heritage experience 6.jpg` likely has encoding issues. Fix URL encoding (spaces to `%20`)
- **Add mobile overflow protection**: Add `overflow-x-hidden` to the main container and `break-words` to text-heavy sections
- **Fix hero text overflow**: Ensure the hero text container at line 46 has proper mobile constraints

### 4. `src/components/sections/ToursRetreatsPreview.tsx`
- **Fix retreat card link** (line 137): Change from `/tour-detail/winter-wine-country-wellness` to the correct route. The retreat page route IS `/tour-detail/winter-wine-country-wellness` per App.tsx line 223, so this is actually correct. No change needed.

### 5. `src/pages/tours/MuizenbergCaveTours.tsx`
- **Update tour title**: Change from "Muizenberg Cave & Coastal Wellness Walk" to "Muizenberg Living Heritage Walk" (per Zenith's PDF filename `Walk2-Muizenberg-Living-Heritage.pdf`)
- **Update SEO and hero copy** to use the new name throughout the page
- Joel's avatar already uses initials fallback "JE" (fixed in prior round)

### 6. `src/pages/tours/KalkBayTour.tsx`
- **Update tour title**: Change from "Kalk Bay Coastal & Cultural Tour" to "Kalk Bay Rich Tapestry Walk" (per Zenith's PDF filename `Walk3-Kalk-Bay-Rich-Tapestry.pdf`)
- **Update hero and heading copy** to reflect the new name

### 7. `src/pages/tours/GreatMotherCaveTour.tsx`
- Verify title matches "The Great Mother Cave Tour" (per `Walk1-Great-Mother-Cave.pdf`) -- current title is correct, no change needed

### 8. `src/components/ui/hero.tsx`
- **Fix mobile text overflow for split variant**: Add `overflow-hidden` and `break-words` to the text container in the split variant layout (line 57). Reduce the heading font size slightly on the smallest breakpoint: change `text-3xl` to `text-2xl` for the split variant

## What This Does NOT Cover
- Full tour copy replacement from Zenith's PDFs (requires content to be pasted manually)
- Viator individual activity deep links (partner shop model limitation per existing memory)
- Curator profile photo updates (Zenith and Chad photos use the images available in Supabase storage)

