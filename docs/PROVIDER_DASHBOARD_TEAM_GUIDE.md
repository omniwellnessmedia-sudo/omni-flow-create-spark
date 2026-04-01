# Provider Dashboard — Team Testing Guide

**Date:** 1 April 2026 (v2 — updated)
**For:** Chad, Zenith, Feroza, Sandy
**Status:** Ready for testing

---

## What's New

We've built a full provider management system that allows wellness practitioners (starting with Sandy Mitchell) to manage their services, pricing, and profile — with changes syncing live to the public website in real time.

### New Features
- **Admin Providers Tab** — manage all providers and services from one place
- **Edit Service** — providers can now edit any service directly from their dashboard
- **Live Supabase sync** — Sandy's public profile page pulls live data from the database
- **Provider seed tool** — admin can onboard new providers with one click
- **Blog system** — fully functional with markdown formatting toolbar
- **GA4 + Clarity analytics** — live traffic and behavior tracking in the Analytics tab
- **Booking fixes** — tour booking error resolved, all booking forms now save to database
- **Mobile fixes** — "Need eSIM help?" no longer overlaps footer/booking bar

---

## Step-by-Step Testing

### Test 1: Admin Providers Tab (NEW)

**Who:** Chad or Tumelo (admin access required)

1. Go to **https://omniwellnessmedia.co.za/admin**
2. Log in with your admin account
3. Click the **"Providers"** tab (between Products and Leads)

**What you should see:**
- **Stats row** at the top: total providers, verified count, total services, active services
- **Search bar** to filter by name, location, or specialty
- **Two sub-tabs**: "Providers" (cards with full detail) and "All Services" (flat list)

**Test these actions:**
- [ ] Click **"Add Provider"** button — fill in a test provider name and click "Add Provider Lead"
- [ ] On any provider card, click **"Verify"** — badge should change from "Pending" to "Verified"
- [ ] On any service, click the **green circle** to toggle it inactive — dot turns grey
- [ ] On any service, click the **pencil icon** — opens the Edit Service page
- [ ] Click the **"All Services"** sub-tab — see a flat list of every service across all providers

---

### Test 2: Seed Sandy's Provider Profile (Admin Only)

**Who:** Chad or Tumelo (admin access required)

1. Go to **https://omniwellnessmedia.co.za/admin**
2. Click the **"Tools"** tab (scroll right if on mobile)
3. Scroll down to the **"Provider Onboarding"** card
4. Click **"Seed Sandy's Profile"**
5. Wait for the green success message

**Expected result:** Green confirmation showing Sandy's profile seeded with 6 services.

**Then verify:** Go to the **"Providers"** tab — Sandy should appear with her 6 services listed.

---

### Test 3: View Sandy's Public Profile

**Who:** Anyone (no login required)

1. Go to **https://omniwellnessmedia.co.za/provider/sandy-mitchell**

**Check these tabs:**

| Tab | What to verify |
|-----|---------------|
| **Services** | 6 service cards — Dru Yoga (R120), Backcare (R600), Buteyko (R350), Mental Wellness (R600), Discovery Call (Free), Workshop (R250) |
| **About Sandy** | Bio, specialties, certifications, contact info |
| **Packages** | Monthly Unlimited (R1,890) and Beginner's Journey (R2,200) |
| **Gallery** | Studio photos |

---

### Test 4: Provider Dashboard — View & Edit Services

**Who:** Any authenticated user

1. Go to **https://omniwellnessmedia.co.za/provider-dashboard**
2. Click the **"Services"** tab
3. Click the **pencil icon** on any service

**Test these changes on the Edit Service page:**
- [ ] Change the **price** (e.g., R120 to R150)
- [ ] Edit the **description**
- [ ] Toggle **"Available online"**
- [ ] Toggle **"Service Status"** (active/inactive)
- [ ] Click **"Save Changes"**

**Expected result:** Toast "Service updated successfully!" — redirects to dashboard.

**Verify live sync:** Go to `/provider/sandy-mitchell` — the updated price/description should show immediately.

---

### Test 5: Add a New Service

**Who:** Any authenticated user

1. Go to **https://omniwellnessmedia.co.za/wellness-exchange/add-service**
2. Fill in the form (Title, Description, Category, Price, Duration, Location)
3. Click **"Publish Service"**

**Expected result:** Toast "Service created successfully!" — service appears in provider dashboard.

---

### Test 6: Blog — Create and Publish a Post

**Who:** Any authenticated user

1. Go to **https://omniwellnessmedia.co.za/blog/editor/new**
2. Write a title and content
3. Use the **formatting toolbar** — Bold, Heading, Lists, Links, Images, Code
4. Add tags, then click **"Save Draft"** then **"Publish"**

**Expected result:** Post published with markdown formatting rendered. Visible at `/blog/community`.

---

### Test 7: Tour Booking (Bug Fix Verification)

**Who:** Anyone

1. Go to **https://omniwellnessmedia.co.za/tours/great-mother-cave-tour**
2. Select a date (7+ days out), enter name and email
3. Click **"Book Now"**

**Expected result:** Green toast "Booking Submitted!" — NOT the red error Feroza reported.

**Also verify:** Image gallery shows cave views and landscapes — no individual faces.

---

### Test 8: "Need eSIM Help" (Mobile Overlap Fix)

**Who:** Anyone on mobile

1. Open any page on mobile
2. Scroll to the bottom

**Expected result:** The blue "Need eSIM help?" button sits **above** the footer and sticky bars — no overlap.

---

### Test 9: Admin Analytics — GA4 + Clarity

**Who:** Chad or Tumelo (admin access)

1. Go to **https://omniwellnessmedia.co.za/admin** > **Analytics** tab
2. You should see **3 sub-tabs**: Business, GA4 Live, Clarity

| Sub-tab | What to verify |
|---------|---------------|
| **Business** | Revenue chart, orders, leads, subscribers |
| **GA4 Live** | 4 clickable cards → Google Analytics (Realtime, Reports, Acquisition, Conversions) |
| **Clarity** | 3 clickable cards → Microsoft Clarity (Dashboard, Heatmaps, Recordings) |

---

### Test 10: Admin Bookings Tab (Enhanced)

**Who:** Chad or Tumelo (admin access)

1. Go to **https://omniwellnessmedia.co.za/admin** > **Bookings** tab

**Expected result:** Two cards:
- **Service Bookings & Leads** — session requests from booking forms, ROAM chat leads, contact submissions
- **Tour Bookings** — tour reservations with guest count and status

---

## Quick Reference — Key URLs

| Page | URL |
|------|-----|
| Admin Dashboard | `/admin` |
| Admin Providers Tab | `/admin` → Providers tab |
| Provider Dashboard | `/provider-dashboard` |
| Add Service | `/wellness-exchange/add-service` |
| Edit Service | `/wellness-exchange/edit-service/{id}` |
| Sandy's Public Profile | `/provider/sandy-mitchell` |
| Blog Listing | `/blog/community` |
| New Blog Post | `/blog/editor/new` |
| Great Mother Cave Tour | `/tours/great-mother-cave-tour` |

---

## Known Limitations

1. **Blog editor** uses markdown (not WYSIWYG). Toolbar buttons insert markdown syntax. Content renders properly on the published post.

2. **Provider images** — Edit Service accepts image URLs but doesn't upload to Supabase storage yet. Use existing Supabase image URLs.

3. **Provider seed** — creates Sandy's profile under the admin's auth ID (RLS constraint). When Sandy creates her own account, data can be transferred.

4. **Newsletter emails** — currently send from `onboarding@resend.dev` (sandbox). Verify a custom domain in Resend to fix sender name.

---

## Reporting Issues

If something doesn't work:
1. Note the **exact URL**
2. Note **logged in or not**
3. **Screenshot** the error
4. **Mobile or desktop**
5. Send to Tumelo

---

*Guide prepared 1 April 2026 — Omni Wellness Media Platform*
