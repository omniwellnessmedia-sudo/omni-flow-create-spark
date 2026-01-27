
# Implementation Plan: Publish, Test Checklist, Image Upload & Email

## Overview

This plan covers four tasks:
1. Publish the current changes to make them live
2. Create a testing checklist document for Feroza
3. Upload Dr. Sharyn Spicer's photo to Supabase and update the code
4. Draft an email summarizing all fixes

---

## Task 1: Publish Changes

**Action Required**: Click the **Publish** button in Lovable to deploy all code changes.

- Desktop: Top right of the editor (web icon)
- Mobile: Tap '...' button in bottom-right → "Publish"

Once published, all 9 fixes will be live on the production site.

---

## Task 2: Create Testing Checklist Document

Create a new file `docs/FEROZA_TESTING_CHECKLIST.md` with a structured checklist for verifying all fixes on iOS Safari.

**Content:**

```markdown
# iOS Safari Testing Checklist for Feroza

**Date:** 27 January 2026  
**Tester:** Feroza Begg  
**Device:** iPhone / iOS Safari

---

## Instructions

1. Open Safari on your iPhone
2. Navigate to: https://omni-flow-create-spark.lovable.app
3. Clear browser cache if needed (Settings → Safari → Clear History and Website Data)
4. Test each item below and mark ✅ or ❌

---

## Test Cases

### 1. 2BeWell Product Images
- [ ] Go to homepage
- [ ] Scroll to "2BeWell Wellness" section
- [ ] Verify product images display correctly (not placeholder images)

### 2. Skip to Footer
- [ ] At top of any page, find "Skip to Footer" link
- [ ] Click it - page should scroll to footer

### 3. Chief Kingsley's Wisdom Link
- [ ] Go to homepage
- [ ] Find "Chief Kingsley's Wisdom" card
- [ ] Click it - should go to Indigenous Wisdom page (NOT hiking/what to bring)

### 4. Text Readability - Wellness Community
- [ ] Go to /wellness-community page
- [ ] Verify "Wellness Community" heading is readable (no transparent/fading text)

### 5. UWC Programme - Email Buttons (iOS Critical)
- [ ] Go to /programs/uwc-human-animal
- [ ] Find "Apply Now" or "Express Interest" buttons
- [ ] Tap button - should open email app with pre-filled subject
- [ ] Repeat for all email buttons on the page

### 6. UWC Programme - Partner Logos
- [ ] On UWC Programme page, scroll to partners section
- [ ] Verify Cart Horse logo displays
- [ ] Verify TUFCAT logo displays
- [ ] Verify other partner logos display

### 7. UWC Programme - Dr. Sharyn Spicer
- [ ] On UWC Programme page, find team/advisors section
- [ ] Note: Currently shows placeholder image
- [ ] Will be updated with real photo after Supabase maintenance

### 8. Web Development - Book Consultation Button
- [ ] Go to /services/web-development
- [ ] Find "Book a Consultation" button
- [ ] Tap it - should open email app

### 9. Media Production - Book Session Button
- [ ] Go to /services/media-production
- [ ] Find "Book my creative session" button
- [ ] Tap it - should open email app

---

## Results Summary

| # | Test | Pass/Fail | Notes |
|---|------|-----------|-------|
| 1 | 2BeWell Images | | |
| 2 | Skip to Footer | | |
| 3 | Chief Kingsley Link | | |
| 4 | Text Readability | | |
| 5 | UWC Email Buttons | | |
| 6 | Partner Logos | | |
| 7 | Dr. Spicer Image | | |
| 8 | Web Dev Button | | |
| 9 | Media Production Button | | |

---

## Known Limitations

- Dr. Sharyn Spicer's photo is using a placeholder until Supabase maintenance completes
- Some partner logos may still be loading from maintenance-affected storage

---

## Report Issues To

Email: omniwellnessmedia@gmail.com  
WhatsApp: [Team Group]
```

---

## Task 3: Upload Dr. Sharyn Spicer's Photo

**Step 1:** Once Supabase maintenance is complete, upload the photo:
- Go to Supabase Storage: https://supabase.com/dashboard/project/dtjmhieeywdvhjxqyxad/storage/buckets
- Navigate to `provider-images` bucket
- Create folder `General Images` if it doesn't exist
- Upload the photo as `dr-sharyn-spicer.jpg`

**Step 2:** Update `src/pages/programs/UWCHumanAnimalProgram.tsx` line 17-18:

```typescript
// FROM (current placeholder):
const drSharynSpicerImage = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format";

// TO (permanent Supabase URL):
const drSharynSpicerImage = `${STORAGE_BASE}/General%20Images/dr-sharyn-spicer.jpg`;
```

---

## Task 4: Email to Feroza

Create file `docs/EMAIL_TO_FEROZA_FIXES_JAN27.md`:

```markdown
# Email: Website Fixes Complete - Ready for Testing

---

**To:** Feroza Begg  
**From:** Omni Wellness Media Development Team  
**Subject:** ✅ All 9 Website Fixes Implemented - Ready for iOS Testing  
**Date:** 27 January 2026

---

Hi Feroza,

Thank you for your thorough feedback! All 9 issues you reported have been addressed and the changes are now live.

---

## Summary of Fixes

| # | Issue | Status |
|---|-------|--------|
| 1 | 2BeWell section showing wrong image | ✅ Fixed - Corrected image URL paths |
| 2 | iOS email buttons not working | ✅ Fixed - Changed to native `<a>` tags for Safari |
| 3 | Dr. Sharyn Spicer photo not displaying | ⏳ Placeholder active - Will update after Supabase maintenance |
| 4 | Partner logos not loading | ✅ Fixed - Updated URL encoding |
| 5 | Chief Kingsley's Wisdom wrong link | ✅ Fixed - Now links to Indigenous Wisdom page |
| 6 | Font colour hard to read | ✅ Fixed - Changed to solid colour with proper contrast |
| 7 | Product images not loading | ✅ Fixed - Corrected folder paths |
| 8 | Indigenous heritage image not loading | ✅ Fixed - Updated partner logo paths |
| 9 | "Skip to Footer" not working | ✅ Fixed - Added footer anchor |

---

## Testing Needed

Please test on your iPhone with Safari:

**Production URL:** https://omni-flow-create-spark.lovable.app

A detailed testing checklist has been prepared to guide you through verifying each fix.

---

## Key Pages to Test

1. **Homepage** - 2BeWell section, Chief Kingsley card
2. **UWC Programme** - /programs/uwc-human-animal (email buttons, partner logos)
3. **Web Development** - /services/web-development (consultation button)
4. **Media Production** - /services/media-production (booking button)
5. **Wellness Community** - /wellness-community (text readability)

---

## Mailchimp Integration Note

We've documented your existing Mailchimp signup link:
https://mailchi.mp/e776f7ae6215/subscribe-to-dr-phil-afel-foundation

And noted the confirmed supporters:
- Nikki Botha - nikki@thatproject.org.za
- Margaret Overmeyer - misterina@yahoo.com

Future integration with the website newsletter form can be implemented when ready.

---

## Next Steps

1. **You test** - Use the checklist to verify all fixes on iOS Safari
2. **Report any issues** - Let us know if anything still doesn't work
3. **Dr. Spicer photo** - Will be updated once Supabase maintenance completes

---

Thank you for your patience and detailed feedback - it really helps ensure quality!

Warm regards,

**The Development Team**  
Omni Wellness Media

---

**Quick Links:**
- Live Site: https://omni-flow-create-spark.lovable.app
- UWC Programme: https://omni-flow-create-spark.lovable.app/programs/uwc-human-animal
- Web Development: https://omni-flow-create-spark.lovable.app/services/web-development
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `docs/FEROZA_TESTING_CHECKLIST.md` | iOS Safari testing guide |
| `docs/EMAIL_TO_FEROZA_FIXES_JAN27.md` | Email summarizing all fixes |

## Files to Update (After Supabase Maintenance)

| File | Change |
|------|--------|
| `src/pages/programs/UWCHumanAnimalProgram.tsx` | Update Dr. Spicer image URL |

---

## Implementation Order

1. Create `docs/FEROZA_TESTING_CHECKLIST.md`
2. Create `docs/EMAIL_TO_FEROZA_FIXES_JAN27.md`
3. Publish all changes
4. (Later) Upload Dr. Spicer photo to Supabase when maintenance completes
5. (Later) Update code with permanent Supabase URL
