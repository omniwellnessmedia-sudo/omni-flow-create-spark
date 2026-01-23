
# Comprehensive Fix Plan: Feroza's Feedback Resolution

## Overview
This plan addresses all outstanding issues identified in Feroza's feedback email, covering 8 pages across the Omni Wellness Media platform. The fixes are organized by page with clear technical solutions.

---

## Page 1: 2BeWell Wellness Shop
**Status:** Partially Complete
**Outstanding Issue:** Hero image not displaying

### Technical Fix
The hero image URL in `src/pages/TwoBeWellShop.tsx` (line 14) points to:
```
https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/product-images%20(2BeWell%20Products)/3.png
```

**Action Required:**
- Verify this image exists in Supabase storage
- Add fallback handling with the `ImageWithFallback` component pattern
- Test image loading across browsers

---

## Page 2: Social Media Strategy
**Status:** Partially Complete
**Outstanding Issue:** "Book My Strategy Session" button has no actionable link

### Technical Fix
In `src/pages/SocialMediaStrategy.tsx` (lines 518-521), the button currently has no `onClick` handler:
```tsx
<Button size="lg" className="bg-gradient-rainbow...">
  <Calendar className="mr-2 w-5 h-5" />
  Book My Strategy Session
</Button>
```

**Solution:**
- Add Calendly link integration: `onClick={() => window.open('https://calendly.com/omniwellnessmedia/social-media-strategy', '_blank')}`
- Alternatively, scroll to the audit form if no Calendly link exists

---

## Page 3: Conscious Media Partnership
**Status:** Partially Complete
**Outstanding Issue:** Hero section appears visually bland with no strong branding

### Technical Fix
In `src/pages/ConsciousMediaPartnershipPage.tsx` (lines 63-66), the current hero uses a low-opacity background:
```tsx
<div className="absolute inset-0 bg-[url('...')] bg-cover bg-center opacity-20" />
```

**Solution:**
- Increase opacity from 20% to 40-50%
- Add gradient overlay with Omni brand colors (teal #339999, purple #B366CC, orange #F5923A)
- Ensure the banner image uses the high-contrast Omni branded version
- Add text shadow to hero typography for better legibility

---

## Page 4: UWC Human-Animal Programme
**Status:** Visual improvements done, functional issues remain

### Outstanding Functional Issues:

**4.1 Book a Discovery Call (Calendly page not found)**
- Current link: `https://calendly.com/omniwellnessmedia/discovery-call`
- **Action:** Verify the Calendly event exists or update to correct URL
- Lines affected: 184, 574, 670

**4.2 Watch Video Button (no action)**
- Line 372-375: Button exists but has no target video
- **Solution:** Add `onClick` to open video modal or scroll to video section
- Need to embed a programme overview video (YouTube/Vimeo embed)

**4.3 Partnership Enquiries (no action)**
- **Solution:** Add mailto link or scroll to contact form

**4.4 5-Step Transformation Actions**
- Download Prospectus: Link may be broken (verify Supabase PDF path)
- Email Questions: Needs mailto implementation
- Express Interest: Needs form or mailto implementation

**4.5 Academic Qualifications Image Missing**
- Add image to the overview section or create visual academic credentials display

**4.6 Begin Your Journey, Team Introduction, Pricing Buttons**
- These scroll to sections but sections need enhanced CTAs
- "Apply Early", "Apply Now" buttons need form or mailto links

### Technical Implementation:
```typescript
// Fix Calendly link - verify URL exists
const CALENDLY_DISCOVERY = 'https://calendly.com/omniwellnessmedia/discovery-call';

// Add video modal or section with embedded video
<section id="programme-video">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" />
</section>

// Fix prospectus download
const PROSPECTUS_URL = `${STORAGE_BASE}/partner-logos%20(Brand%20Assets)/UWC-Programme-Prospectus.pdf`;

// Add Express Interest form or mailto
onClick={() => window.open('mailto:omniwellnessmedia@gmail.com?subject=UWC Programme - Express Interest', '_blank')}
```

---

## Page 5: Web Development
**Status:** Awaiting Updates

### Outstanding Issues:
1. **"View Portfolio" button** - No action (line 120-123)
2. **"Web Strategy Guide" button** - No download link (line 124-127)
3. **"Book Technical Consultation" button** - No Calendly integration (lines 370-377)

### Technical Implementation:
- Add Calendly link for booking: `https://calendly.com/omniwellnessmedia/web-consultation`
- Create or link to portfolio page: `/portfolio` or external portfolio
- Add PDF download for strategy guide or remove if not available

---

## Page 6: Media Production
**Status:** Awaiting Updates

### Outstanding Issues:
1. **"View Our Reel" button** - No video link (lines 95-98)
2. **"Production Guide" button** - No download link (lines 99-102)
3. **"Book Production Call" button** - No Calendly integration

### Technical Implementation:
- Link "View Our Reel" to YouTube showreel or portfolio page
- Add Calendly link: `https://calendly.com/omniwellnessmedia/media-production`
- Add PDF download or remove production guide button

---

## Page 7: Business Consulting
**Status:** Awaiting Updates

### Outstanding Issues:
1. **"Book Free Strategy Call" button** (line 100-103) - No Calendly link
2. **"Download Free Guide" button** (line 104-107) - No download link
3. **"Book My Free Session Now" button** (line 342-345) - No action

### Technical Implementation:
- Add Calendly link: `https://calendly.com/omniwellnessmedia/business-strategy`
- Add PDF download or remove guide button
- Connect bottom CTA to the BookingCalendar component already on page

---

## Page 8: Winter Wine Country Wellness Retreat
**Status:** Awaiting Updates
**Page:** `src/pages/tours/OmniWellnessRetreat.tsx`

### Items to Verify:
1. Booking functionality (TourBookingSidebar)
2. All CTAs working
3. Image assets loading correctly

---

## Page 9: Great Mother Cave Tour
**Status:** Awaiting Updates
**Page:** `src/pages/tours/GreatMotherCaveTour.tsx`

### Items to Verify:
1. TourBookingSidebar functionality
2. Chief Kingsley contact/booking flow
3. All images loading correctly

---

## Implementation Priority Order

### Phase 1: Critical Functional Fixes (Highest Priority)
1. **UWC Programme** - Fix all CTAs (Calendly, Download Prospectus, Express Interest)
2. **Social Media Strategy** - Fix "Book My Strategy" button
3. **2BeWell Shop** - Fix hero image

### Phase 2: Service Page CTAs
4. **Web Development** - Add all Calendly + download links
5. **Media Production** - Add all Calendly + download links  
6. **Business Consulting** - Add all Calendly + download links

### Phase 3: Visual Enhancements
7. **Conscious Media Partnership** - Enhance hero branding/contrast
8. **Tour Pages** - Verify Winter Wine + Great Mother Cave functionality

---

## Calendly URLs Needed
The following Calendly event URLs need to be verified or created:
- `https://calendly.com/omniwellnessmedia/discovery-call` (UWC Programme)
- `https://calendly.com/omniwellnessmedia/social-media-strategy` (Social Media)
- `https://calendly.com/omniwellnessmedia/web-consultation` (Web Dev)
- `https://calendly.com/omniwellnessmedia/media-production` (Media)
- `https://calendly.com/omniwellnessmedia/business-strategy` (Consulting)

---

## PDF Downloads Needed
Verify these assets exist in Supabase storage:
- UWC Programme Prospectus PDF
- Social Media Content Calendar Template
- Web Strategy Guide PDF
- Media Production Guide PDF
- Business Consulting Free Guide PDF

---

## Summary of Changes

| Page | Issue | Fix |
|------|-------|-----|
| 2BeWell Shop | Hero image missing | Verify Supabase URL, add fallback |
| Social Media | Book button no action | Add Calendly onClick |
| Conscious Media | Bland hero | Increase opacity, add brand gradients |
| UWC Programme | Multiple CTAs broken | Fix Calendly, add video, fix downloads |
| Web Development | CTAs no action | Add Calendly + portfolio links |
| Media Production | CTAs no action | Add Calendly + reel link |
| Business Consulting | CTAs no action | Add Calendly + connect to BookingCalendar |
| Tour Pages | Verify functionality | Test booking flows |

---

## Technical Notes

### Calendly Integration Pattern
```tsx
// Consistent pattern for all Calendly buttons
<Button 
  size="lg"
  onClick={() => window.open('https://calendly.com/omniwellnessmedia/EVENT_TYPE', '_blank')}
>
  <Calendar className="mr-2 w-5 h-5" />
  Book Session
</Button>
```

### PDF Download Pattern
```tsx
// For Supabase-hosted PDFs
<a 
  href="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/FOLDER/file.pdf"
  download
  target="_blank"
  rel="noopener noreferrer"
>
  <Button variant="outline">
    <Download className="mr-2 w-5 h-5" />
    Download Guide
  </Button>
</a>
```

### Fallback for Missing Calendly
If Calendly events don't exist yet, use mailto fallback:
```tsx
onClick={() => window.open('mailto:omniwellnessmedia@gmail.com?subject=Booking Request - [Service Type]', '_blank')}
```
