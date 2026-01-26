
# Comprehensive Bug Fix Plan: Feroza's Feedback Items

## Overview
This plan addresses all 9 outstanding issues reported by Feroza, plus uploads Dr. Sharyn Spicer's profile photo for the UWC page.

---

## Issue Summary Table

| # | Issue | Root Cause | Fix Required |
|---|-------|------------|--------------|
| 1 | 2BeWell section image banner not displaying | Incorrect Supabase folder path with `**` characters | Correct URL encoding in `imageHelpers.ts` |
| 2 | Social Media Strategy scroll issue | Button scrolls to adjacent section (no separation) | Remove scroll behavior OR add section spacing |
| 3 | Book My Strategy redirects to blank page | No issue found - button should open mailto | Verify and test the mailto link |
| 4 | Placeholder text not visible on live | Text updated but may need republish | Confirm text exists in code |
| 5 | ✅ Conscious Media Partnership | Working correctly | No changes needed |
| 6 | UWC Apply buttons don't open email | `window.open('mailto:...')` blocked on some browsers | Change to `window.location.href` for mailto |
| 7 | Web Dev "View our work" doesn't scroll | Target `#portfolio` section doesn't exist | Add `id="portfolio"` to projects section |
| 8 | Web Dev "Book consultation" doesn't open | Using `window.open` for mailto | Change to `window.location.href` |
| 9 | Media Production "Book my creative session" | Using `window.open` for mailto | Change to `window.location.href` |
| 10 | Dr. Sharyn Spicer photo | New photo uploaded | Copy to project and add to UWC team section |

---

## Phase 1: Fix 2BeWell Image Banner (Issue #1)

### Problem
The `imageHelpers.ts` uses folder path `product-images** (2BeWell)` with literal `**` characters, which creates invalid URLs. The actual Supabase storage folder is `product-images (2BeWell Products)` (URL encoded as `product-images%20(2BeWell%20Products)`).

### Solution
**File**: `src/lib/imageHelpers.ts`

Change line 8:
```typescript
// FROM:
const PRODUCT_FOLDER = 'product-images** (2BeWell)';

// TO:
const PRODUCT_FOLDER = 'product-images%20(2BeWell%20Products)';
```

Also update `TwoBeWellCTA.tsx` to add `onError` handlers with fallbacks to prevent blank images.

---

## Phase 2: Fix Social Media Strategy Scroll (Issue #2)

### Problem
The "Get Strategy Audit" button scrolls to `#audit-form`, but this form is immediately adjacent in the same grid column, making the scroll feel unnecessary/jumpy.

### Solution
**File**: `src/pages/SocialMediaStrategy.tsx`

Option A: Remove the scroll entirely since the form is already visible in the hero
Option B: Keep scroll but ensure smooth scroll to a section with proper offset

We'll implement Option A - remove the onClick scroll handler since the form is already prominently displayed in the hero section. The button will instead submit the form directly or provide visual emphasis.

---

## Phase 3: Fix All mailto Links (Issues #3, #6, #7, #8, #9)

### Problem
Using `window.open('mailto:...')` is blocked by popup blockers on many browsers (especially iOS Safari). This affects:
- Social Media Strategy "Book My Strategy" button
- UWC "Apply Early" and "Apply Now" buttons
- Web Development "Book consultation" button
- Media Production "Book my creative session" button

### Solution
Replace all `window.open('mailto:...')` with `window.location.href = 'mailto:...'` OR use `<a href="mailto:...">` wrapped in buttons.

**Files to modify**:
1. `src/pages/SocialMediaStrategy.tsx` - Check for booking section
2. `src/pages/programs/UWCHumanAnimalProgram.tsx` - Lines 422, 447, 588
3. `src/pages/WebDevelopment.tsx` - Line 382
4. `src/pages/MediaProduction.tsx` - Line 454

Pattern change:
```typescript
// FROM:
onClick={() => window.open('mailto:...', '_blank')}

// TO:
onClick={() => { window.location.href = 'mailto:...'; }}
```

---

## Phase 4: Fix Web Development Portfolio Scroll (Issue #7)

### Problem
The "View Our Work" button tries to scroll to `#portfolio`, but the page doesn't have a section with that ID.

### Solution
**File**: `src/pages/WebDevelopment.tsx`

Add a portfolio/projects section with `id="portfolio"` OR change the scroll target to an existing section. Since the page doesn't have a dedicated portfolio section, we should either:
- Add one showcasing completed web projects
- Or scroll to the "Services Grid" section that lists capabilities

We'll add a simple portfolio section between services and technology sections.

---

## Phase 5: Add Dr. Sharyn Spicer's Photo (Issue #10)

### Process
1. Copy the uploaded image to project assets
2. Add her to the UWC team section
3. Update the team data array

**File**: `src/pages/programs/UWCHumanAnimalProgram.tsx`

The photo will be copied to `src/assets/team/dr-sharyn-spicer.jpg` and imported into the component.

---

## Phase 6: Verify Placeholder Text (Issue #4)

### Current State
The placeholder text "✓ Click below to schedule your free strategy session" exists in:
- `WebDevelopment.tsx` line 377
- `MediaProduction.tsx` line 449

### Action
Confirm this text is in the code and visible. If the live site doesn't show it, it may require a publish/update.

---

## Technical Implementation Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/imageHelpers.ts` | Fix Supabase folder path encoding |
| `src/components/sections/TwoBeWellCTA.tsx` | Add onError fallbacks to images |
| `src/pages/SocialMediaStrategy.tsx` | Remove unnecessary scroll, fix any mailto |
| `src/pages/programs/UWCHumanAnimalProgram.tsx` | Fix 3 mailto buttons, add Dr. Spicer photo |
| `src/pages/WebDevelopment.tsx` | Fix mailto, add portfolio section with id |
| `src/pages/MediaProduction.tsx` | Fix mailto button |

### Image Path Corrections

**Current (Broken)**:
```
product-images** (2BeWell)/13.jpg
```

**Fixed (Working)**:
```
product-images%20(2BeWell%20Products)/13.jpg
```

### mailto Pattern Fix

**Before** (blocked on iOS/Safari):
```tsx
<Button onClick={() => window.open('mailto:...', '_blank')}>
```

**After** (universal compatibility):
```tsx
<Button 
  asChild 
  className="..."
>
  <a href="mailto:omniwellnessmedia@gmail.com?subject=...">
    Book Now
  </a>
</Button>
```

Or:
```tsx
<Button onClick={() => { window.location.href = 'mailto:...'; }}>
```

---

## Verification Checklist

After implementation:

- [ ] 2BeWell section images load correctly on homepage
- [ ] Social Media Strategy page scroll behavior is intuitive
- [ ] All mailto buttons open email client on desktop & mobile
- [ ] UWC Apply buttons work on all devices including iOS Safari
- [ ] Web Development "View Our Work" scrolls to portfolio
- [ ] Web Development "Book Consultation" opens email
- [ ] Media Production "Book Creative Session" opens email
- [ ] Dr. Sharyn Spicer photo appears in UWC team section
- [ ] Placeholder confirmation text is visible

---

## Cross-Device Testing Required

Per the critical mandate in project memory:
> All pages must be fully accessible and functional on all devices, including iPhone/iOS Safari.

After implementation, all mailto links and button functionality must be tested on:
- Desktop Chrome
- Desktop Safari
- iOS Safari (iPhone)
- Android Chrome

---

## Summary

This comprehensive fix addresses all 9 issues reported by Feroza:
1. **2BeWell images**: Fix Supabase URL encoding
2. **Social Media scroll**: Remove unnecessary scroll or improve UX
3. **Book My Strategy**: Fix mailto approach
4. **Placeholder text**: Verify presence in code
5. **Conscious Media Partnership**: ✅ Already working
6. **UWC Apply buttons**: Change window.open to window.location.href
7. **Web Dev View Work**: Add portfolio section with proper ID
8. **Web Dev Book Consultation**: Fix mailto
9. **Media Production Book Session**: Fix mailto
10. **Dr. Spicer photo**: Upload and add to team section
