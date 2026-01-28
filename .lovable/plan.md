
# Comprehensive Fix Plan: QA Feedback Resolution

## Executive Summary

This plan addresses all 13 test cases identified in the consolidated QA feedback. The issues fall into several categories:
1. **Navigation/Routing Issues** (Tests 2, 3, 4, 6) - Cards and buttons not navigating correctly
2. **Image Loading Issues** (Tests 1, 5, 11) - Wrong images or misaligned logos
3. **Interactive Button Issues** (Tests 7, 8, 9, 10, 12, 13) - Buttons not working across devices
4. **Cross-Device Compatibility** - Several issues are device-specific (MacBook vs. mobile)

---

## Detailed Analysis & Fixes

### Test 1: 2BeWell Product Images (Priority: High)
**Issue**: Homepage 2BeWell section shows wrong product images.
**Root Cause**: The `TwoBeWellCTA.tsx` component uses `getLifestyleImage()`, `getTeamImage()`, and `getProductImage()` from `imageHelpers.ts`, which has incorrect path mappings that don't match actual Supabase storage structure.
**File**: `src/lib/imageHelpers.ts`
**Fix**: 
- Update `storageMap` to use correct file names from the actual Supabase storage folder `product-images (2BeWell Products)`
- Align with the correct mappings already defined in `src/lib/images.ts` (IMAGES.twoBeWell)

---

### Test 2: Chief Kingsley's Wisdom Card (Priority: High)
**Issue**: Card does not open/navigate on any device.
**Root Cause**: The `CommunityCard` component uses `<Link>` which should work, but the `href` `/tours/indigenous-wisdom` may not have a matching route in `App.tsx`.
**File**: `src/App.tsx` (verify route exists)
**File**: `src/components/sections/HeroSection.tsx` (line 94)
**Fix**:
- Verify route `/tours/indigenous-wisdom` exists in App.tsx
- If missing, either create the route or update href to existing page like `/tours/great-mother-cave-tour`

---

### Test 3: Indigenous Teachings (Priority: High)
**Issue**: Does not navigate correctly on any device.
**Root Cause**: Same as Test 2 - the card links to `/tours/great-mother-cave-tour` which may not load the intended section.
**File**: `src/components/sections/HeroSection.tsx` (line 126)
**Fix**: Verify the destination page exists and loads correctly. May need hash anchor to scroll to specific section.

---

### Test 4: Wellness Community Links (Priority: High)
**Issue**: "Community Wellness Outings" and "Conscious Meditation" redirect to footer.
**Root Cause**: These cards link to `/wellness-community` which is a valid route, but the page may have rendering issues or the scroll behavior is broken. The page exists and renders correctly based on the code review. The issue may be that these links are somehow triggering the skip navigation or there's a scroll conflict.
**File**: `src/components/sections/HeroSection.tsx` (lines 136-156)
**Fix**:
- Ensure the `/wellness-community` route is correctly configured
- Check if there are any `#footer` anchors accidentally attached to these links
- The links appear correct (`href: "/wellness-community"`) - may need to check CommunityCard component for any scroll behavior

---

### Test 5: Welcome Page Logos (Priority: Medium)
**Issue**: Logos are misaligned and do not function correctly.
**Root Cause**: The `PartnersSection.tsx` uses partner logos from `IMAGES.partners` which uses URLs with `**` encoding in the path (`partner-logos** (Brand Assets)`) which may cause issues.
**File**: `src/lib/images.ts`
**File**: `src/components/sections/PartnersSection.tsx`
**Fix**:
- Correct the URL encoding in partner logo paths from `partner-logos**%20(Brand%20Assets)` to the actual correct path
- Ensure consistent path encoding throughout

---

### Test 6: Projects & Services Navigation (Priority: High)
**Issue**: Featured projects cards (Wellness Education & Growth, Indigenous Wisdom & Healing, etc.) have "View Project" buttons that don't navigate.
**Root Cause**: In `FeaturedProjectsSection.tsx`, the "View Project" buttons are `<Button variant="soft">` without any `onClick` handler or `asChild` wrapping a `<Link>`. They're non-functional buttons.
**File**: `src/components/sections/FeaturedProjectsSection.tsx` (lines 62-66)
**Fix**: Add proper navigation using either:
- Wrap button with Link component using `asChild`
- Add `onClick` handler with `navigate()`
- Define destination routes for each project card

---

### Test 7: RoamBuddy Team Picks (Priority: Medium)
**Issue**: "See the team's picks" button doesn't scroll or redirect.
**Root Cause**: In `WellnessCuratorCard.tsx`, the button has an `onClick` that scrolls to `#editor-picks`, but this section may not have that ID or the scroll behavior isn't working correctly.
**File**: `src/components/roambuddy/WellnessCuratorCard.tsx` (lines 28-32)
**File**: `src/pages/RoamBuddyStore.tsx`
**Fix**:
- Verify the "Editor's Picks" section has `id="editor-picks"` attribute
- If missing, add the ID to the section element in RoamBuddyStore.tsx

---

### Test 8: Travel Well Connected Welcome Buttons (Priority: Medium)
**Issue**: Welcome section buttons don't scroll or redirect.
**Root Cause**: Need to examine the TravelWellConnectedStore.tsx hero section for button implementations.
**File**: `src/pages/TravelWellConnectedStore.tsx`
**Fix**: 
- Identify the welcome buttons and ensure they have proper scroll handlers or navigation
- Add smooth scroll behavior to target sections

---

### Test 9: UWC Programme Apply Buttons (Priority: High)
**Issue**: Apply/Express Interest buttons not working on any device.
**Root Cause**: In UWCHumanAnimalProgram.tsx, the "Begin Your Journey" button uses `onClick={() => scrollToSection('apply')}` which should work. The issue may be with the scroll function or the target section ID.
**File**: `src/pages/programs/UWCHumanAnimalProgram.tsx` (lines 178-183)
**Fix**:
- Verify `scrollToSection` function works correctly
- Ensure `id="apply"` exists on the target section
- Consider using `window.scrollTo()` as fallback for cross-browser compatibility

---

### Test 10: UWC Programme Email Links (Priority: High)
**Issue**: Email links work on iOS/Android but NOT on MacBook.
**Root Cause**: The email buttons use `onClick={() => { window.location.href = 'mailto:...' }}` which works on mobile but may be blocked by popup blockers or handled differently on desktop browsers.
**File**: `src/pages/programs/UWCHumanAnimalProgram.tsx` (lines 601-609)
**Fix**: Change from Button with onClick to native `<a>` tag using `asChild` pattern:
```tsx
<Button asChild>
  <a href="mailto:omniwellnessmedia@gmail.com?subject=UWC Programme Interest">
    <Mail /> Email Us
  </a>
</Button>
```

---

### Test 11: Dr. Sharyn Spicer Image (Status: Known)
**Issue**: Placeholder image displaying.
**Status**: This is a known limitation. The image uses an Unsplash placeholder until the actual photo can be uploaded to Supabase storage post-maintenance.
**Action**: Document as expected behavior; update after Supabase maintenance.

---

### Test 12: Web Development Book Consultation (Priority: High)
**Issue**: Works on iOS/Android (opens email), but MacBook redirects to contact page.
**Root Cause**: The button at line 421-430 already uses the correct `asChild` + `<a href="mailto:...">` pattern. If MacBook redirects to contact page, there may be a route conflict or JavaScript preventing the default behavior.
**File**: `src/pages/WebDevelopment.tsx` (lines 421-430)
**Fix**: The current implementation looks correct. Need to:
- Verify there's no `preventDefault()` being called
- Ensure the `asChild` prop is working correctly
- Check if there's any navigation interceptor in the Router

---

### Test 13: Media Production Book Session (Priority: Critical)
**Issue**: Does not open email on ANY device (MacBook, iOS, Android).
**Root Cause**: The button at lines 453-462 uses the same pattern as WebDevelopment which should work. The implementation looks correct but may have a bug.
**File**: `src/pages/MediaProduction.tsx` (lines 453-462)
**Fix**: 
- Review for any typos or syntax issues
- Ensure the `href` attribute is correctly formatted
- Convert to standard `<a>` tag if Button+asChild has issues

---

## Technical Implementation

### File Changes Summary

| File | Changes |
|------|---------|
| `src/lib/imageHelpers.ts` | Fix product image URL mappings |
| `src/lib/images.ts` | Correct partner logo URL encoding (`partner-logos**` to proper encoding) |
| `src/components/sections/HeroSection.tsx` | Verify/fix navigation hrefs for Chief Kingsley and Indigenous Teachings |
| `src/components/sections/FeaturedProjectsSection.tsx` | Add navigation to "View Project" buttons |
| `src/components/roambuddy/WellnessCuratorCard.tsx` | Verify scroll target exists |
| `src/pages/RoamBuddyStore.tsx` | Add `id="editor-picks"` to section if missing |
| `src/pages/TravelWellConnectedStore.tsx` | Fix welcome button scroll handlers |
| `src/pages/programs/UWCHumanAnimalProgram.tsx` | Fix Apply buttons + convert email buttons to native `<a>` tags |
| `src/pages/WebDevelopment.tsx` | Verify email button implementation |
| `src/pages/MediaProduction.tsx` | Fix email button to use native `<a>` tag pattern |
| `src/App.tsx` | Verify all required routes exist |

---

## Priority Order

1. **Critical** (Broken on all devices):
   - Test 13: Media Production email button
   - Test 2: Chief Kingsley navigation
   - Test 6: Featured Projects buttons

2. **High** (Affects core functionality):
   - Test 1: 2BeWell images
   - Test 9: UWC Apply buttons
   - Test 10: UWC Email (MacBook)
   - Test 12: Web Dev Consultation (MacBook)
   - Test 3 & 4: Navigation issues

3. **Medium** (UX issues):
   - Test 5: Logo alignment
   - Test 7 & 8: RoamBuddy/Travel scroll buttons

4. **Known/Documented**:
   - Test 11: Dr. Spicer placeholder (expected)

---

## Cross-Device Compatibility Strategy

To ensure consistent behavior across MacBook, iOS, and Android:
1. Use native `<a>` tags for all email/phone links instead of JavaScript handlers
2. Use `<Link>` component from react-router-dom for internal navigation
3. For scroll behavior, use `scrollIntoView({ behavior: 'smooth' })` with fallback
4. Avoid `window.open()` for mailto links (triggers popup blockers on desktop)
5. Test all interactive elements with keyboard navigation for accessibility

---

## Testing Checklist After Implementation

After implementing these fixes, the following should be verified on MacBook, iOS, and Android:

1. [ ] 2BeWell section shows correct product images
2. [ ] Chief Kingsley card navigates to tours page
3. [ ] Indigenous Teachings navigates correctly
4. [ ] Wellness Community links work (not footer redirect)
5. [ ] Partner logos aligned and load correctly
6. [ ] Featured Projects "View Project" buttons navigate
7. [ ] RoamBuddy "See team's picks" scrolls to section
8. [ ] Travel Well Connected welcome buttons work
9. [ ] UWC Programme Apply/Express Interest buttons scroll
10. [ ] UWC Programme email links open email app on ALL devices
11. [ ] Dr. Spicer placeholder displays (expected)
12. [ ] Web Development consultation button opens email
13. [ ] Media Production creative session button opens email
