

# Final Cross-Device Polish -- Feroza's Review Fixes

With 5 credits and limited changes, this plan batches all fixes into minimum file edits.

## 1. Homepage -- Animation Overlap & Mobile Spacing

**Problem**: FloatingDecorations orbs overlap text on mobile; sections stack poorly.

**Fix** in `HeroSection.tsx`:
- Hide floating orbs on mobile with `hidden md:block` wrapper
- Add `overflow-hidden` to the main content container
- Ensure text containers have proper z-index and `relative` positioning

**Fix** in `gaia-elements.tsx`:
- Add `hidden md:block` to all `FloatingDecorations` variants so orbs only show on desktop

## 2. Chief Kingsley Card Scroll

**Status**: Already fixed -- href is `/tours/great-mother-cave-tour#chief-kingsley` and the target section has `id="chief-kingsley"` with `scroll-mt-24`. The `ScrollToHash` component handles cross-page hash navigation. This should work -- if not scrolling, it may be a timing issue with lazy loading. Add a longer delay (500ms) in `ScrollToHash.tsx`.

## 3. About Page -- Story Images & Warren Photo

**Problem**: Carousel has 9 images from `IMAGES.*` -- some may resolve to the same URL (duplicates) or broken URLs (blank). Warren uses `warren.png` which may not exist.

**Fix** in `About.tsx`:
- Deduplicate carousel images: Remove entries that resolve to same URL (e.g., `IMAGES.providers.chad` and `IMAGES.sandy.yoga` may overlap)
- Replace duplicates with distinct images from `IMAGES.community.*`, `IMAGES.services.*`, and `IMAGES.tours.*`
- Add `onError` handler to carousel images for graceful fallback
- Warren's photo: change from `warren.png` to the known working path or show initials fallback (already has `onError` handler)

## 4. Wellness Retreat Page -- Images & Text Overflow

**Problem**: Feroza reports "Shark Education Centre image still on page" and "Indigenous Heritage image blank" and "words off-screen."

**Fix** in `OmniWellnessRetreat.tsx`:
- Review all image URLs in the gallery and inline sections. The current images are:
  - `IMG_20241010_175744.jpg` (retreat folder -- valid)
  - `IMG_0052 (1).jpg` (retreat folder -- valid)
  - `_MG_0152.jpg` (retreat folder -- valid)
  - `wellness group tour.jpg` (General Images -- valid, but generic)
  - `group tour amazing cave view muizenberg.jpg` (may be the "shark education" confusion -- it's a cave view, not shark)
  - `community outing 1.jpg` (General Images -- valid)
- Replace any ambiguous general images with retreat-specific ones
- The "Indigenous Heritage" image at line 626 uses `khoe indigenous language heritage experience 6.jpg` -- verify URL encoding
- Add `overflow-hidden` and `break-words` to text containers for mobile overflow fix
- Wrap the hero text content in a container with `max-w-full overflow-hidden`

## 5. Kalk Bay Tour -- 404 Fix

**Problem**: `/tours/kalk-bay-tour` has no route in App.tsx but is linked in navigation.

**Fix**: Create a new `KalkBayTour.tsx` page file based on the `MuizenbergCaveTours.tsx` template, with placeholder content for Zenith's copy. Register route in `App.tsx`.

## 6. Joel Erasmus Photo -- Muizenberg Cave Tour

**Problem**: Joel's avatar uses `muizenberg cave view 2.jpg` (a landscape, not a portrait).

**Fix** in `MuizenbergCaveTours.tsx`: Replace avatar `src` with a proper portrait. Since no Joel portrait exists in storage, use the `AvatarFallback` with initials "JE" by removing the broken `AvatarImage` src, or use a placeholder portrait from the team folder.

## 7. Travel Well Connected -- Curator Photos & See Picks

**Problem**: Zenith and Chad show group/generic photos. "See Picks" has no action.

**Fix** in `TravelWellConnectedStore.tsx`:
- Update `curatorProfiles.zenith.avatar` to `IMAGES.team.zenith` (individual portrait)
- Update `curatorProfiles.chad.avatar` to `IMAGES.team.chad` (individual portrait)
- "See Our Picks" buttons already scroll to local tours section (fixed in prior round). Verify the target `id` exists.

## 8. RoamBuddy Store -- Feroza Photo

**Problem**: Feroza's profile picture not visible on laptop.

**Fix**: The `feroza` curator profile image uses `feroza begg - portrait.jpg` in General Images. Verify URL encoding is correct in `roamBuddyProducts.ts` and `WellnessCuratorCard.tsx`.

## 9. Contact Page -- Discovery Call Button

**Problem**: "Book Your Discovery Call" doesn't work.

**Fix** in `CalComBooking.tsx`: Change `fallbackEmail` default from `hello@omniwellnessmedia.co.za` to `admin@omniwellnessmedia.co.za` (line 51). The Cal.com integration may be disabled via feature flag, causing it to use the fallback email. The button itself works -- it opens a mailto link. If Cal.com embed fails to load, the fallback is functional.

## 10. Chatbot -- Scroll & Text Delivery

**Problem**: Bot delivers text in a block and user must scroll.

**Fix** in `RoamBuddySalesBot.tsx`:
- Already uses `ScrollArea` with auto-scroll `useEffect`
- Ensure `scrollRef` targets the correct element
- The `h-[350px]` fixed height may be too small on mobile. Change to `h-[300px] sm:h-[350px]` for responsive sizing

## 11. Curator Tip Images Too Small

**Problem**: Curator quote images are tiny.

**Fix** in `CuratorTip.tsx`: Increase avatar sizes from `w-8 h-8` (banner) and `w-12 h-12` (inline) to `w-12 h-12` and `w-16 h-16` respectively. Also increase in `gaia-elements.tsx` GuidePresence from `w-10 h-10` to `w-14 h-14`.

## Files to Modify (11 files)

| File | Changes |
|------|---------|
| `src/components/ui/gaia-elements.tsx` | Hide FloatingDecorations on mobile, increase GuidePresence avatar size |
| `src/components/navigation/ScrollToHash.tsx` | Increase delay for hash scroll to handle lazy loading |
| `src/pages/About.tsx` | Deduplicate story carousel images, ensure distinct images |
| `src/pages/tours/OmniWellnessRetreat.tsx` | Fix image URLs, add mobile overflow protection |
| `src/pages/tours/KalkBayTour.tsx` | **NEW FILE** -- placeholder tour page |
| `src/App.tsx` | Add `/tours/kalk-bay-tour` route |
| `src/pages/tours/MuizenbergCaveTours.tsx` | Remove broken Joel avatar image |
| `src/pages/TravelWellConnectedStore.tsx` | Update Zenith & Chad curator portrait URLs |
| `src/components/booking/CalComBooking.tsx` | Change fallback email to admin@ |
| `src/components/roambuddy/RoamBuddySalesBot.tsx` | Fix mobile height, verify scroll behavior |
| `src/components/curator/CuratorTip.tsx` | Increase curator avatar sizes |

