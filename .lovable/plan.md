

# Feroza's Feedback Fixes + ROAM Visibility

This is a large batch of fixes across 10+ areas. Given 5 credits, the plan consolidates all changes into the minimum number of file edits.

## Summary of All Fixes

### 1. ROAM Section - Add to Navigation
The ROAM store page exists at `/roambuddy-store` but is not in the navigation. Add it under the "Store" dropdown in both desktop MegaNavigation and mobile UnifiedNavigation.

### 2. Archive 2BeWell
- Remove `TwoBeWellCTA` section from homepage (`Index.tsx`)
- Remove `2BeWell Shop` from navigation menus (MegaNavigation + UnifiedNavigation)
- Remove `2BeWell Shop` link from Footer
- Keep the actual shop page alive (accessible via direct URL) but hide from all navigation

### 3. Homepage Fixes
- **"Our Services" anchor**: The hero CTA button links to `/services` (a separate page). The "curated" section on the homepage needs an `id` so anchor scrolling works. Update the hero CTA to scroll to `#curated-services` on the homepage instead.
- **Featured section buttons** (Indigenous Wisdom, Wellness Retreats, Study Abroad, Winter Wellness): These are in `FeaturedProjectsSection.tsx` and already link to real pages (`/tours/great-mother-cave-tour`, `/wellness-community`, `/services`). No placeholder `#` links found there. The issue may be in another section -- will verify and fix any `href="#"` links.

### 4. Name Corrections (Sitewide)
- `Zenith Yasin` is correct on About page and TeamPreviewSection
- `Zenith Yassin` (double-s) found in `ViatorWellnessExperiences.tsx` -- fix to `Zenith Yasin`
- `Feroza Begg` is consistently spelled -- confirmed correct

### 5. About Page
- **Remove Stephen Bosch** from the team array (and the `stephenPhoto` import)
- Images use the centralized `IMAGES` system with `onError` fallbacks -- should be working. Will verify `IMAGES.team.*` paths are valid.

### 6. Wellness Retreat Page (`OmniWellnessRetreat.tsx`)
- **Label**: Already says "4th Annual Omni Wellness Retreat" -- correct
- **Dates**: Change `Feb 27 - May 2` to `Dates TBA` (since current dates are inaccurate)
- **Book Now button**: Already linked to `mailto:omniwellnessmedia@gmail.com` -- this is functional
- **Remove Joline's number**: Remove the `081 388 4726` contact line
- **Image review**: The page uses retreat-specific images from Supabase storage -- no shark education image found on this page. Will do a sweep for any irrelevant images.

### 7. Great Mother Cave Tour
No code changes needed now -- structure is ready for Zenith's updated copy.

### 8. Travel Well Connected Store
- **Fish Hoek Walk**: Add as a new local experience option (placeholder copy, Zenith to provide details)
- **Navigation**: Add "Muizenberg Tour" and "Kalk Bay Tour" under the Travel dropdown in MegaNavigation and UnifiedNavigation

### 9. Blog Page
- **Community Blog button**: Currently uses `window.location.href = '/blog/community'` -- this path doesn't exist as a route. Fix to link to `/community` (which maps to `CommunityBlog` page).

### 10. Contact Page
- **Email**: Change `hello@omniwellnessmedia.co.za` to `admin@omniwellnessmedia.co.za`
- **Social buttons**: Add actual URLs to the "Follow our journey" buttons:
  - Facebook: `https://www.facebook.com/omniwellnessmedia`
  - Instagram: `https://www.instagram.com/omniwellnessmedia/`
  - LinkedIn: `https://www.linkedin.com/company/omniwellnessmedia`
  - YouTube: `https://www.youtube.com/@omniwellnessmedia`

### 11. Services Section Links
The `ServicesSection.tsx` on the homepage uses `/services/business-consulting`, `/services/media-production`, etc. but actual routes are `/business-consulting`, `/media-production`. Fix these link paths.

### 12. Footer Updates
- Remove 2BeWell Shop link
- Fix service links from `/services/business-consulting` to `/business-consulting` format
- Update copyright year from 2025 to 2026

## Technical Details - Files to Modify

| File | Changes |
|------|---------|
| `src/components/navigation/MegaNavigation.tsx` | Add ROAM store to Store menu, add Muizenberg + Kalk Bay tours to Travel menu, remove 2BeWell |
| `src/components/navigation/UnifiedNavigation.tsx` | Same nav updates for mobile menu |
| `src/pages/Index.tsx` | Remove TwoBeWellCTA import and section, add `id="curated-services"` to services section |
| `src/components/sections/HeroSection.tsx` | Update "Our Services" CTA to scroll to `#curated-services` |
| `src/components/sections/ServicesSection.tsx` | Fix 4 broken service link paths |
| `src/pages/About.tsx` | Remove Stephen Bosch from team array |
| `src/pages/tours/OmniWellnessRetreat.tsx` | Fix dates to "TBA", remove Joline's number |
| `src/pages/Contact.tsx` | Update email, add social URLs to buttons |
| `src/pages/Blog.tsx` | Fix Community Blog button link |
| `src/pages/ViatorWellnessExperiences.tsx` | Fix "Zenith Yassin" to "Zenith Yasin" |
| `src/components/Footer.tsx` | Remove 2BeWell link, fix service paths, update copyright year |
| `src/pages/TravelWellConnectedStore.tsx` | Add Fish Hoek Walk placeholder |

**RoamBuddy logos from Supabase storage** are already in the `Roambuddy` folder under `provider-images` bucket. The ROAM store page at `/roambuddy-store` should already reference these. No additional asset work needed.

