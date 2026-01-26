
# Cal.com Setup Guide & Email Response for Feroza

## Overview
This plan creates two documentation files:
1. A comprehensive Cal.com setup guide for Zenith to configure all booking event types
2. A professional email response to Feroza summarizing the fixes implemented

---

## Deliverable 1: Cal.com Setup Guide (docs/CALCOM_SETUP_GUIDE.md)

### Purpose
Provides Zenith with step-by-step instructions to create Cal.com event types with:
- Exact slugs matching the website integration
- Suggested durations and descriptions
- Links to corresponding sales pages on the live site
- Copy-paste ready event descriptions

### Event Types to Create

| Event Type | Slug | Duration | Sales Page URL |
|------------|------|----------|----------------|
| Discovery Call | `discovery-call` | 30 min | https://www.omniwellnessmedia.co.za/ |
| Social Media Strategy | `social-media-strategy` | 60 min | https://www.omniwellnessmedia.co.za/social-media-strategy |
| Web Consultation | `web-consultation` | 45 min | https://www.omniwellnessmedia.co.za/web-development |
| Media Production | `media-production` | 60 min | https://www.omniwellnessmedia.co.za/media-production |
| Business Strategy | `business-strategy` | 60 min | https://www.omniwellnessmedia.co.za/business-consulting |
| Wellness Session | `wellness-session` | 60 min | https://www.omniwellnessmedia.co.za/wellness-exchange |
| UWC Programme Call | `uwc-programme` | 30 min | https://www.omniwellnessmedia.co.za/programs/uwc-human-animal |

---

## Deliverable 2: Email Response to Feroza (docs/EMAIL_RESPONSE_FEROZA.md)

### Content Summary
Professional email acknowledging feedback and confirming:
- Issues that have been resolved
- Changes requiring a publish to go live
- Next steps (testing, Cal.com setup)
- Thank you for detailed feedback

---

## File Structure

```
docs/
├── CALCOM_SETUP_GUIDE.md      (NEW - For Zenith)
├── EMAIL_RESPONSE_FEROZA.md   (NEW - Email draft)
├── EMAIL_TO_MR_BIRDIE.md      (existing)
└── ROAMBUDDY_MARKETING_PLAN.md (existing)
```

---

## Technical Note: Build Error Fix

The current build error is caused by a missing image file. In addition to creating the documentation, we need to:

1. **Option A**: Update `UWCHumanAnimalProgram.tsx` to use the Supabase URL directly instead of importing a local asset
2. **Option B**: Ensure the image is properly copied to the assets folder

We'll implement Option A as it's more reliable for images uploaded through the UI.

---

## Implementation Steps

1. **Create** `docs/CALCOM_SETUP_GUIDE.md` with complete setup instructions
2. **Create** `docs/EMAIL_RESPONSE_FEROZA.md` with email draft
3. **Fix** the build error by updating the UWC page to use a Supabase URL for Dr. Spicer's image

---

## Cal.com Setup Guide Content Preview

The guide will include:

### Account Setup Section
- Create account at cal.com with username: `omniwellnessmedia`
- Set timezone to Africa/Johannesburg (SAST)
- Configure brand color: #339999

### For Each Event Type:
- **Title** (display name)
- **Slug** (URL-friendly identifier - MUST match exactly)
- **Duration** 
- **Description** (copy-paste ready)
- **Questions to ask** (optional intake form)
- **Confirmation message**
- **Redirect URL** after booking

### Availability Settings
- Suggested hours: Monday-Friday 9:00-17:00 SAST
- Buffer between meetings: 15 minutes
- Minimum notice: 24 hours

---

## Email Response Content Preview

Subject: Re: Website Updates - Status Report

Key points:
1. ✅ 2BeWell image banner - Fixed (URL encoding corrected)
2. ✅ Social Media Strategy scroll - Fixed (improved UX)
3. ✅ Book My Strategy - Fixed (mailto compatibility)
4. ✅ Placeholder text - Confirmed in code
5. ✅ Conscious Media Partnership - Already working
6. ✅ UWC Apply buttons - Fixed for iOS Safari
7. ✅ Web Development "View our work" - Added portfolio section
8. ✅ Web Development "Book consultation" - Fixed
9. ✅ Media Production "Book my creative session" - Fixed
10. ✅ Dr. Sharyn Spicer photo - Added to team section

Note: Changes require clicking "Update" in publish dialog to go live.
