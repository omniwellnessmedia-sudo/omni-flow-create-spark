

# ROAM Store Hero Cleanup + Mobile Fixes

Two issues remain: (1) Zenith says the ROAM store hero section is too busy and the image loads slowly, (2) the Travel Well Connected page still has a distracting scroll indicator animation.

## Changes

### 1. `src/components/roambuddy/RoamBuddyHero.tsx` -- Simplify hero

The hero currently has: brand badge, large heading with emoji, subheadline, 4 trust badges (grid), CTA button, "Choose your wellness journey" with 4 activity pills, and a "Powered by RoamBuddy" badge. That is 7 visual layers before the user even scrolls.

**Simplify to 4 layers:**
- Keep brand badge (ROAM by Omni)
- Keep headline + subheadline (but smaller, cleaner)
- Keep CTA button ("Find Your Perfect Plan")
- Remove the 4 trust badges grid (move them below the fold or remove entirely)
- Remove the "Choose your wellness journey" activity pills section entirely
- Remove the "Powered by RoamBuddy Technology" bottom badge
- Add `fetchpriority="high"` to the hero image and use a smaller/compressed version or add a CSS background-color placeholder so the dark overlay shows immediately while the image loads

**Result:** Clean hero with badge, headline, subtitle, one CTA button -- much less visual noise.

### 2. `src/pages/TravelWellConnectedStore.tsx` -- Remove scroll indicator

Lines 597-604: Delete the bouncing scroll indicator animation (same fix as was done on HeroSection.tsx).

### 3. `src/pages/About.tsx` -- Verify mobile overflow

The `overflow-x-hidden` was added in prior round. Check if the Hero `split` variant grid is the cause -- on mobile it should stack vertically. The `hero.tsx` already has `lg:grid-cols-2` so it stacks on mobile. If text is still overflowing, add `max-w-full` to the heading in `hero.tsx` for the split variant.

## Files Modified (3 files)

| File | Change |
|------|--------|
| `src/components/roambuddy/RoamBuddyHero.tsx` | Remove trust badges grid, activity pills, powered-by badge; add image loading optimizations |
| `src/pages/TravelWellConnectedStore.tsx` | Remove scroll indicator animation (lines 597-604) |
| `src/components/ui/hero.tsx` | Add `max-w-full` to heading for split variant to prevent mobile overflow |

