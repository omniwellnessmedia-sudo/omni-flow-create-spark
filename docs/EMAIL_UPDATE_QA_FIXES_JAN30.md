# QA Update Email - January 30, 2026

**Subject:** All Reported Issues Resolved + Testing Instructions ✅

---

Hi Feroza,

Thank you for your detailed QA feedback. I've addressed all the issues you reported across MacBook, iPhone, and Android. Below is a comprehensive summary of all fixes with testing instructions for each.

---

## Issue Summary & Fixes

### 1. Welcome Page - Unclear Clickable Cards ✅ FIXED

**Your feedback:** "The items on this page look clickable, but it's not clear what they are supposed to do."

**Fix applied:**
- Added clear "Explore →" label with arrow icon to each category card
- Added `aria-label` for accessibility (e.g., "Explore Indigenous Wisdom & Healing")
- Cards now have obvious visual affordance indicating they are clickable links

**Testing:**
1. Visit: https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app/welcome
2. Scroll to the category cards (Indigenous Wisdom, Wellness Retreats, Study Abroad, Winter Wellness)
3. Verify each card shows "Explore →" label at bottom
4. Click any card → should navigate to the relevant category page

---

### 2. 2BeWell Product Images ✅ FIXED

**Your feedback:** "The product images are not displaying correctly on MacBook, Android, or iPhone."

**Root cause:** URL encoding issue - folder name contained `**` characters that weren't properly encoded for web URLs.

**Fix applied:**
- Corrected URL encoding from `product-images**` to `product-images%2A%2A` 
- Images now load from Supabase storage correctly

**Testing:**
1. Visit: https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app
2. Scroll to "2BeWell Wellness" section
3. Verify product bottle image displays correctly
4. Test on all devices: MacBook, iPhone, Android

---

### 3. Chief Kingsley's Wisdom - Anchor Scroll ✅ FIXED

**Your feedback:** "It opens the Great Mother Cave page but I need to scroll down to reach his personal section."

**Fix applied:**
- Added anchor ID `#chief-kingsley` to Chief Kingsley's profile section
- Added scroll margin to account for fixed header
- Implemented global scroll-to-hash functionality across the site
- Updated all CTAs to link directly to `/tours/great-mother-cave-tour#chief-kingsley`

**Testing:**
1. Visit: https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app
2. Find "Chief Kingsley's Wisdom" card on homepage
3. Click → should navigate AND auto-scroll directly to Chief Kingsley's profile section
4. No manual scrolling should be needed
5. Test on all devices

---

### 4. UWC Programme - Apply/Email Buttons ✅ FIXED

**Your feedback:** "The email client does not open on my laptop (MacBook)."

**Root cause:** Used `window.open('mailto:...')` which is blocked by modern browsers.

**Fix applied:**
- Replaced all `window.open('mailto:...')` with native `<a href="mailto:...">` elements
- This is the most reliable cross-browser/cross-device method
- Applied to ALL UWC pages: Main Programme, Recruitment, University Partners, Sponsors

**Testing:**
1. Visit: https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app/programs/uwc-human-animal
2. Find "Express Interest" or "Apply Now" buttons
3. Click → email client should open with pre-filled subject/body
4. Repeat on:
   - /programs/uwc-recruitment
   - /programs/uwc-university-partners  
   - /programs/uwc-sponsors
5. Test on MacBook, iPhone, Android

---

### 5. Web Development - Book Consultation ✅ FIXED

**Your feedback:** "The email button still does not open. Cal.com button does not open on any device. Buttons not balanced on phone."

**Fixes applied:**
- **Email button:** Converted to native `<a href="mailto:...">` element
- **Cal.com button:** Replaced fragile embed/popup with reliable direct link that opens in new tab
- **Mobile layout:** Buttons now stack full-width on mobile for balanced appearance

**Testing:**
1. Visit: https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app/web-development
2. Scroll to booking section
3. Click "Email to Book" → email client should open
4. Click "Book with Cal.com" → Cal.com page opens in new tab
5. On mobile: verify buttons are full-width and evenly stacked
6. Test on MacBook, iPhone, Android

---

### 6. Media Production - Book Session ✅ FIXED

**Your feedback:** "Neither the email nor the Cal.com buttons open on laptop. Cal.com does not open on any phones."

**Fixes applied:** (Same as Web Development)
- Email button: Native `<a>` element
- Cal.com button: Direct link (opens new tab)
- Mobile layout: Full-width stacked buttons

**Testing:**
1. Visit: https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app/media-production
2. Scroll to booking section
3. Click "Email to Book" → email client should open
4. Click "Book with Cal.com" → Cal.com page opens in new tab
5. Test on all devices

---

### 7. Travel Well Connected - Browse Global Adventures ✅ FIXED

**Your feedback:** "This button is still not working."

**Root cause:** The button tried to scroll to a tab content section that wasn't rendered (tab was on 'local' mode, so 'viator' content didn't exist in DOM).

**Fix applied:**
- Button now switches to Viator tab FIRST, then scrolls to the tours section
- Added external fallback link to Viator partner site
- Uses controlled tab state to ensure content is mounted before scrolling

**Testing:**
1. Visit: https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app/travel-well-connected-store
2. Default tab should be "Local Tours"
3. Click "Browse Global Adventures" button
4. Verify: Tab switches to "International" AND page scrolls to Viator tours section
5. Test on all devices

---

### 8. Team Photos - Warren, Stephen, Tumelo ✅ FIXED

**Previous status:** Warren and Stephen photos showing, Tumelo using placeholder initials.

**Fixes applied:**
- All team photos now use Supabase CDN URLs for reliability
- Tumelo's uploaded photo has been integrated
- About page displays all 6 team members with photos

**Team Photo Status:**
| Member | Status |
|--------|--------|
| Chad Cupido | ✅ Photo displays |
| Tumelo Thabo Ncube | ✅ Photo displays (newly added) |
| Zenith Yasin | ✅ Photo displays |
| Feroza Begg | ✅ Photo displays |
| Warren Cramer | ✅ Photo displays |
| Stephen Bosch | ✅ Photo displays |

**Testing:**
1. Visit: https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app/about
2. Scroll to "Meet the Team" section
3. Verify all 6 team members display with photos (not placeholder initials)

---

## Additional Improvements Made

### Global Enhancements
- **Scroll-to-Hash:** All internal links with `#anchor` now smoothly scroll to target section
- **Cross-Device Reliability:** All CTAs tested for MacBook Safari, iOS Safari, Android Chrome
- **Accessibility:** Added proper `aria-label` attributes to interactive elements

### Pages Updated
- Homepage
- Welcome page
- About page
- Web Development
- Media Production
- Business Consulting
- Travel Well Connected Store
- Great Mother Cave Tour
- Omni Wellness Retreat
- UWC Programme (Main, Recruitment, University Partners, Sponsors)

---

## Quick Testing Checklist

| # | Test | Page | Expected Result |
|---|------|------|-----------------|
| 1 | Welcome cards show "Explore" | /welcome | Each card has "Explore →" label |
| 2 | 2BeWell image loads | / (homepage) | Product bottle image visible |
| 3 | Chief Kingsley anchor | Click from homepage | Auto-scrolls to his section |
| 4 | UWC email buttons | /programs/uwc-human-animal | Email client opens |
| 5 | Web Dev email | /web-development | Email client opens |
| 6 | Web Dev Cal.com | /web-development | New tab opens Cal.com |
| 7 | Media email | /media-production | Email client opens |
| 8 | Media Cal.com | /media-production | New tab opens Cal.com |
| 9 | Browse Global Adventures | /travel-well-connected-store | Tab switches + scrolls |
| 10 | Team photos | /about | All 6 members have photos |

---

## Test URLs

**Preview (for testing):**
https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app

**Key pages to test:**
- Homepage: `/`
- Welcome: `/welcome`
- About: `/about`
- Web Development: `/web-development`
- Media Production: `/media-production`
- Travel Store: `/travel-well-connected-store`
- UWC Programme: `/programs/uwc-human-animal`
- Great Mother Cave: `/tours/great-mother-cave-tour`

---

## Next Steps

1. Please re-test all items above on MacBook, iPhone, and Android
2. Report any remaining issues
3. Once confirmed working, we can publish to production

Thank you for your thorough testing - it helps ensure the best experience for all users!

Best regards,
Tumelo

---

*Technical Reference: All changes logged in commit history. Key files modified: TwoBeWellCTA.tsx, ToursRetreatsPreview.tsx, GreatMotherCaveTour.tsx, WebDevelopment.tsx, MediaProduction.tsx, TravelWellConnectedStore.tsx, UWC pages, About.tsx, TeamPreviewSection.tsx*
