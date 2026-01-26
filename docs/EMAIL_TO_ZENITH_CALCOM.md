# Email to Zenith - Cal.com Booking Setup

---

**To:** Zenith  
**From:** Development Team  
**Subject:** Cal.com Booking System Setup - Action Required  
**Date:** 26 January 2026

---

Hi Zenith,

I hope this finds you well! We've completed the website integration for our new professional booking system, and we need your help to set up the Cal.com side of things.

---

## 📋 What We Need

We've integrated Cal.com booking widgets across all our service pages. For these to work, we need you to create the corresponding event types in Cal.com with **specific slugs** (URL identifiers) that match our website code.

---

## 📄 Setup Guide

I've prepared a comprehensive setup guide with everything you need:

**File:** `docs/CALCOM_SETUP_GUIDE.md`

This guide includes:
- Step-by-step account setup instructions
- All 7 event types that need to be created
- **Exact slugs** (these MUST match - case-sensitive!)
- Copy-paste descriptions for each event
- Suggested booking questions
- Confirmation messages
- Redirect URLs back to our website

---

## 🎯 Quick Reference - Event Types Needed

| Event | Slug (EXACT) | Duration |
|-------|--------------|----------|
| Discovery Call | `discovery-call` | 30 min |
| Social Media Strategy | `social-media-strategy` | 60 min |
| Web Consultation | `web-consultation` | 45 min |
| Media Production | `media-production` | 60 min |
| Business Strategy | `business-strategy` | 60 min |
| Wellness Session | `wellness-session` | 60 min |
| UWC Programme Call | `uwc-programme` | 30 min |

---

## ⚠️ Important Notes

1. **Username**: Please use `omniwellnessmedia` as the Cal.com username
   - This creates URLs like: `cal.com/omniwellnessmedia/discovery-call`

2. **Slugs Must Match Exactly**: The slugs in the table above are case-sensitive and must be entered exactly as shown. If they don't match, the booking buttons on the website won't work.

3. **Brand Color**: Use `#339999` (our teal) for consistent branding

4. **Timezone**: Set to Africa/Johannesburg (SAST)

5. **Availability**: I've suggested Monday-Friday 9:00-17:00, but adjust based on actual team availability

---

## 🔄 Current Status

Right now, the "Book" buttons on the website fall back to email (`mailto:hello@omniwellnessmedia.co.za`) which works fine. Once you've set up Cal.com and we enable the integration, visitors will get a professional calendar booking experience instead.

---

## ✅ After Setup

Once you've created all event types, please:
1. Test each booking link yourself
2. Let us know so we can enable the Cal.com integration on the website
3. We'll then test the full flow together

---

## 📞 Questions?

If anything in the guide is unclear or you need help with the setup, just reach out. I'm happy to jump on a call to walk through it together.

Thank you for handling this! The professional booking system will be a great upgrade for our client experience.

Best regards,

**The Development Team**  
Omni Wellness Media

---

*P.S. - The full guide is in the project files at `docs/CALCOM_SETUP_GUIDE.md`. It has all the copy-paste text you'll need for event descriptions, booking questions, and confirmation messages.*
