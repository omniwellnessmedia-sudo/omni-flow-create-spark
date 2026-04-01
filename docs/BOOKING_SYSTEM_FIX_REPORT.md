# Booking & Notification System Fix Report

**Date:** 30 March 2026
**Status:** Completed
**Branch:** main
**Affected Systems:** Booking flow, Email notifications, Admin Dashboard, ROAM Sales Bot

---

## Executive Summary

Multiple critical issues were identified and resolved across the booking and lead capture system. The core problem was that booking buttons ("Email to Book Session", "Book Strategy Session") were **not saving data or sending notifications** -- user interactions were either silently failing or using simulated logic that never connected to the database.

All booking flows now properly save leads to the `contact_submissions` table, trigger the `submit-contact` edge function for email notifications (via Resend), and sync to the Admin Dashboard in real time.

---

## Issues Found & Fixed

### 1. BookingCalendar -- No Data Saved on Confirm

**File:** `src/components/booking/BookingCalendar.tsx`
**Severity:** Critical
**Impact:** All service pages using the calendar booking widget (Business Consulting, etc.)

**Problem:**
The "Confirm Booking" button called `onBookingSelect()` which only displayed a toast notification saying "Booking Confirmed!" -- but **never saved anything to the database** and **never sent any notification**. Users believed their booking was confirmed, but no record was created.

**Fix:**
- Added contact detail fields (name, email, phone) to the booking summary before confirmation
- On confirm, saves the booking as a lead in `contact_submissions` (Supabase)
- Triggers the `submit-contact` edge function to send an email notification to `omniwellnessmedia@gmail.com`
- Displays a proper confirmation state with feedback to the user
- Added "Book Another Session" reset flow

---

### 2. BookingSystem -- Simulated Booking (Never Saved)

**File:** `src/components/booking/BookingSystem.tsx`
**Severity:** Critical
**Impact:** Provider service booking modal

**Problem:**
The booking submission handler used `await new Promise(resolve => setTimeout(resolve, 2000))` -- a **fake 2-second delay** simulating an API call. The booking data was only logged to `console.log()` and never persisted anywhere. The confirmation screen told users "Confirmation email sent" but no email was ever sent.

**Fix:**
- Replaced the simulation with a real `supabase.from("contact_submissions").insert()` call
- Booking details (service, provider, date, time, duration, price, payment method, notes, phone) are all captured in the message field
- Triggers `submit-contact` edge function for admin email notification
- Proper error handling with user-facing error toast on failure

---

### 3. BookSessionCapture -- Silent Email Notification Failure

**File:** `src/components/booking/BookSessionCapture.tsx`
**Severity:** Medium
**Impact:** "Email to Book Session" buttons on Business Consulting, Media Production, Social Media Strategy, Web Development pages

**Problem:**
The edge function call for email notification was fire-and-forget with `.catch(() => {})` -- any failure was completely swallowed. If the Resend API key was missing or the function failed, there was no indication to developers.

**Fix:**
- Changed to `await` the edge function response
- Logs errors properly for debugging
- Phone number now included in the submission message
- The mailto fallback still opens as a backup after lead capture

---

### 4. CalComBooking -- No Lead Capture on Fallback or Success

**File:** `src/components/booking/CalComBooking.tsx`
**Severity:** Medium
**Impact:** "Book Strategy Session" buttons across service pages

**Problem:**
When the `calcom_integration` feature flag was disabled (which is the default unless explicitly enabled in the DB), the button fell back to a `mailto:` link -- but **no lead was saved** to the database. Additionally, when Cal.com bookings succeeded via the embed widget, the booking data was not captured in the dashboard.

**Fix:**
- Fallback mailto path now saves a lead to `contact_submissions` before opening the email client
- Cal.com `bookingSuccessful` callback now saves the booking confirmation to `contact_submissions` so it appears in the dashboard
- Both paths ensure the admin team has visibility into every booking attempt

---

### 5. Admin Dashboard -- Missing Service Bookings

**File:** `src/pages/AdminDashboard.tsx`
**Severity:** High
**Impact:** Admin team visibility into all bookings and leads

**Problem:**
The Dashboard "Bookings" tab **only showed tour bookings** from the `tour_bookings` table. All service session requests, consultation bookings, and general inquiries from `contact_submissions` were invisible in the dashboard overview. The "Recent Activity" feed also did not include service leads.

**Fix:**
- Dashboard now fetches `contact_submissions` data alongside orders and tour bookings
- Added "Service Bookings & Leads" card to the Bookings tab showing:
  - Lead name and email
  - Service type
  - Message preview
  - Status badge (pending / in_progress / responded)
  - Submission date
- Total service booking count displayed in the card header
- Recent Activity feed now includes service leads, sorted chronologically with orders and tour bookings
- Added `totalServiceBookings` stat to dashboard data model

---

### 6. ROAM Sales Bot -- No Booking Integration

**File:** `src/components/roambuddy/RoamBuddySalesBot.tsx`
**Severity:** Medium
**Impact:** ROAM chat widget across the site

**Problem:**
ROAM (the wellness travel connectivity guide) could recommend eSIM products and capture newsletter emails, but had **no ability to handle booking/consultation requests**. Users asking to book a call or learn about services received no actionable path.

**Fix:**
- Added service-oriented quick action buttons: "Book a Call", "Media Services", "Web Development"
- Automatic booking intent detection: when users mention keywords like "book", "schedule", "consultation", "appointment", "call", "meeting", or "session", ROAM saves a lead to `contact_submissions` with the conversation context
- Leads captured via ROAM are tagged with service "RoamBuddy Consultation" for dashboard filtering

---

## Data Flow (After Fix)

```
User clicks booking button
        |
        v
Contact details collected (name, email, phone)
        |
        v
Saved to `contact_submissions` table (Supabase)
        |
        +---> `submit-contact` edge function triggered
        |           |
        |           v
        |     Resend API sends email to omniwellnessmedia@gmail.com
        |
        +---> mailto: fallback opens user's email client
        |
        v
Admin Dashboard syncs automatically
  - Overview: Recent Activity feed
  - Bookings tab: Service Bookings & Leads card
  - Leads tab: Full lead management (AdminLeads)
```

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/booking/BookingCalendar.tsx` | Added contact capture, DB save, email notification, confirmation state |
| `src/components/booking/BookingSystem.tsx` | Replaced simulation with real Supabase insert + notification |
| `src/components/booking/BookSessionCapture.tsx` | Proper error handling, awaited edge function |
| `src/components/booking/CalComBooking.tsx` | Lead capture on fallback + Cal.com success callback |
| `src/pages/AdminDashboard.tsx` | Added service bookings to data fetch, bookings tab, and activity feed |
| `src/components/roambuddy/RoamBuddySalesBot.tsx` | Booking quick actions + intent detection lead capture |

---

## Database Tables Used

- **`contact_submissions`** -- All booking requests, session inquiries, and service leads flow here
- **`chatbot_conversations`** -- ROAM chat transcripts
- **`newsletter_subscribers`** -- ROAM email captures
- **`notification_logs`** -- Edge function notification tracking

---

## Testing Checklist

- [ ] Click "Email to Book Session" on Business Consulting page -- verify dialog opens, form submits, lead appears in Dashboard > Bookings
- [ ] Click "Book Strategy Session" on Business Consulting page -- verify Cal.com opens or mailto fallback works, lead saved
- [ ] Use BookingCalendar widget -- select date/time, fill contact details, confirm -- verify lead saved and confirmation shown
- [ ] Check Admin Dashboard > Bookings tab -- verify "Service Bookings & Leads" card populates
- [ ] Check Admin Dashboard > Overview -- verify Recent Activity includes service leads
- [ ] Open ROAM chat, click "Book a Call" quick action -- verify lead captured in DB
- [ ] Open ROAM chat, type "I want to schedule a consultation" -- verify booking intent detected and lead saved
- [ ] Verify email notification arrives at omniwellnessmedia@gmail.com (requires RESEND_API_KEY in Supabase secrets)

---

## Dependencies & Prerequisites

- **Resend API Key**: Must be set as `RESEND_API_KEY` in Supabase Edge Function secrets for email notifications to send
- **Cal.com Feature Flag**: The `calcom_integration` flag in the `feature_flags` table controls whether Cal.com embed is used or falls back to mailto. Both paths now capture leads.
- **Supabase RLS**: Ensure `contact_submissions` table allows inserts from anonymous/authenticated users

---

## Next Steps

1. **Verify Resend API Key** is configured in Supabase secrets
2. **Test end-to-end** on staging using the checklist above
3. **Enable `calcom_integration` feature flag** if Cal.com account is set up at `cal.com/omni-wellness-media-gqj9mj`
4. **Consider adding** SMS notifications via the existing `send-whatsapp` edge function for high-priority leads
5. **ROAM enhancements**: Train the sales chat system prompt to proactively offer booking links when users express service interest

---

*Report generated 30 March 2026 -- Omni Wellness Media Platform*
