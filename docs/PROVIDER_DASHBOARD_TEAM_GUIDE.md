# Omni Wellness Media — Team Testing Guide v4

**Date:** 3 April 2026
**For:** Chad, Zenith, Feroza, Sandy
**Status:** Ready for testing
**Site:** https://omniwellnessmedia.co.za

---

## What's New (v4 — Dashboard Redesign + Bug Fixes)

This update is a significant step forward. The admin dashboard has been completely redesigned with a modern sidebar layout, and all three dashboards (admin, provider, consumer) now feature smart, time-aware greetings with contextual alerts.

### Dashboard Redesign
- **Sidebar navigation** — 16 horizontal tabs replaced with a grouped sidebar (Core, Manage, System) with icons
- **Smart greeting** — "Good morning, Chad" with live time, date, and role badge
- **Contextual alerts** — colored pills showing pending bookings, unanswered leads, unverified providers
- **Home screen** — quick actions, at-a-glance stats, recent activity, platform health
- **Mobile** — hamburger menu opens sidebar in a slide-out drawer
- **"+ Create Content"** dropdown — Blog Post (live), Podcast & Video (coming soon)

### Bug Fixes (from Feroza's feedback)
- **Blog drafts now save** — fixed slug uniqueness issue that was preventing draft saves
- **Tour booking now works** — anonymous bookings fall back to contact form instead of failing
- **About page** — removed Mother Cave tour people photos, replaced with community images

---

## Step-by-Step Testing

### Test 1: Admin Dashboard — New Sidebar Layout

**Who:** Chad, Zenith, or Feroza (admin access required)
**URL:** https://omniwellnessmedia.co.za/admin

1. Log in and go to `/admin`
2. You should see:

**Desktop (laptop/monitor):**
- [ ] **Smart greeting** at the top — "Good [morning/afternoon/evening], [Name]" with current time and date
- [ ] **Sidebar on the left** with three groups: Core, Manage, System
- [ ] **Home screen** in the main area with Quick Actions, At a Glance stats, Recent Activity, and Platform Health
- [ ] **Alert pills** below the greeting (amber for warnings, blue for info) — e.g. "3 pending bookings", "5 unanswered leads"

**Mobile (phone):**
- [ ] **Hamburger menu** (☰) in the top-left
- [ ] Tapping it opens a **slide-out sidebar** with all navigation sections
- [ ] Tapping a section closes the drawer and loads the content

**Test the sidebar navigation:**
- [ ] Click **"Leads"** in the sidebar → leads list loads
- [ ] Click **"Providers"** → provider management loads
- [ ] Click **"Home"** → returns to the welcome/home screen
- [ ] Click **"Analytics"** → GA4 + Clarity dashboards load
- [ ] Badge counts appear next to sections with pending items (e.g. Leads, Bookings)

---

### Test 2: "Create Content" Button

**Who:** Any admin
**URL:** https://omniwellnessmedia.co.za/admin

1. Click the **"+ Create"** button in the top-right header
2. A dropdown should appear with:
   - [ ] **Blog Post** — clickable, opens `/blog/editor/new`
   - [ ] **Podcast** — greyed out with "Soon" badge
   - [ ] **Video** — greyed out with "Soon" badge

---

### Test 3: Blog — Save Draft (Bug Fix)

**Who:** Any authenticated user
**URL:** https://omniwellnessmedia.co.za/blog/editor/new

1. Write a **title** (e.g. "Test Draft Post")
2. Write some **content** (at least a sentence)
3. Click **"Save Draft"**

**Expected result:**
- [ ] Green toast: **"Draft saved successfully"** — NOT the error Feroza reported
- [ ] URL changes from `/blog/editor/new` to `/blog/editor/{id}`
- [ ] You can continue editing and save again

4. Try saving a **second** draft with the **same title**
- [ ] Should also save without errors (no duplicate slug conflict)

---

### Test 4: Tour Booking (Bug Fix)

**Who:** Anyone (logged in OR logged out)
**URL:** https://omniwellnessmedia.co.za/tours/great-mother-cave-tour

1. Select a date (7+ days out)
2. Enter name and email
3. Click **"Book Now"**

**Expected result:**
- [ ] Green toast: **"Booking Submitted!"** — NOT the red "Booking Error" Feroza reported
- [ ] Works **without** being logged in (saves as a lead)
- [ ] Works **with** being logged in (saves to tour_bookings)

---

### Test 5: About Page (Photo Fix)

**Who:** Anyone
**URL:** https://omniwellnessmedia.co.za/about

1. Scroll to the **"Our Story"** image carousel section

**Expected result:**
- [ ] No photos of **tour group participants** from the Mother Cave walk
- [ ] Should show community/heritage images instead (Khoe cultural celebration, community outreach)

---

### Test 6: Provider Dashboard — Smart Greeting

**Who:** Any authenticated user
**URL:** https://omniwellnessmedia.co.za/provider-dashboard

1. Navigate to the provider dashboard

**Expected result:**
- [ ] **Smart greeting** at the top: "Good [morning/afternoon/evening], [Business Name]"
- [ ] **Time and date** displayed
- [ ] **Role badge** showing "Provider"
- [ ] **Alert pills** showing profile completion % and any pending bookings
- [ ] Stats grid below with WellCoins, Earnings, Services, Bookings, Rating, Profile %
- [ ] Profile completion bar (if < 100%) with field checklist

---

### Test 7: Consumer Account — Smart Greeting

**Who:** Any authenticated user
**URL:** https://omniwellnessmedia.co.za/wellness-exchange/account

1. Navigate to your account page

**Expected result:**
- [ ] **Smart greeting** at the top: "Good [morning/afternoon/evening], [Name]"
- [ ] **Role badge** showing "Member"
- [ ] **WellCoin alert** showing your balance (green pill)

---

### Test 8: Admin — Quick Actions from Home

**Who:** Any admin
**URL:** https://omniwellnessmedia.co.za/admin

1. On the Home screen, test each **Quick Action** card:

| Quick Action | Expected Behavior |
|-------------|------------------|
| **New Blog Post** | Opens `/blog/editor/new` |
| **View Leads** | Switches to Leads section in sidebar |
| **Send Newsletter** | Switches to Newsletter section |
| **View Site** | Opens the public site in a new tab |

---

### Test 9: Sandy's Public Profile

**Who:** Anyone (no login required)
**URL:** https://omniwellnessmedia.co.za/provider/sandy-mitchell

**Check these tabs:**

| Tab | What to verify |
|-----|---------------|
| **Services** | 6 service cards — Dru Yoga (R120), Backcare (R600), Buteyko (R350), Mental Wellness (R600), Discovery Call (Free), Workshop (R250) |
| **About Sandy** | Bio, specialties, certifications, contact info |
| **Packages** | Monthly Unlimited (R1,890) and Beginner's Journey (R2,200) |
| **Gallery** | Studio photos |

---

### Test 10: Edit a Service (Live Sync)

**Who:** Any authenticated user
**URL:** https://omniwellnessmedia.co.za/provider-dashboard → Services tab

1. Click the **pencil icon** on any service
2. Change the **price** (e.g. R120 → R150)
3. Click **"Save Changes"**

**Expected result:**
- [ ] Toast: **"Service updated successfully!"**
- [ ] Go to `/provider/sandy-mitchell` — the updated price shows **immediately**

---

## Quick Reference — Key URLs

| Page | URL |
|------|-----|
| **Admin Dashboard** | https://omniwellnessmedia.co.za/admin |
| **Provider Dashboard** | https://omniwellnessmedia.co.za/provider-dashboard |
| **Consumer Account** | https://omniwellnessmedia.co.za/wellness-exchange/account |
| **Add Service** | https://omniwellnessmedia.co.za/wellness-exchange/add-service |
| **Sandy's Public Profile** | https://omniwellnessmedia.co.za/provider/sandy-mitchell |
| **Blog Listing** | https://omniwellnessmedia.co.za/blog/community |
| **New Blog Post** | https://omniwellnessmedia.co.za/blog/editor/new |
| **Great Mother Cave Tour** | https://omniwellnessmedia.co.za/tours/great-mother-cave-tour |
| **Muizenberg Heritage Walk** | https://omniwellnessmedia.co.za/tours/muizenberg-cave-tours |
| **About Page** | https://omniwellnessmedia.co.za/about |

---

## Architecture Notes (v4)

### New Dashboard Components

| Component | File | Purpose |
|-----------|------|---------|
| SmartGreeting | `src/components/dashboard/SmartGreeting.tsx` | Time-aware greeting, date, role badge, alert pills (shared across all dashboards) |
| AdminSidebar | `src/components/dashboard/AdminSidebar.tsx` | Grouped sidebar nav with icons and alert badge counts |
| AdminHome | `src/components/dashboard/AdminHome.tsx` | Smart home screen with quick actions, stats, activity, health |

### Provider Dashboard Components

| Component | File | Purpose |
|-----------|------|---------|
| ProviderHeader | `src/components/provider-dashboard/ProviderHeader.tsx` | Sticky top nav with logo, preview, home, logout |
| StatsGrid | `src/components/provider-dashboard/StatsGrid.tsx` | 6 stat cards (memoized) |
| ProfileCompletionBar | `src/components/provider-dashboard/ProfileCompletionBar.tsx` | Progress bar + field checklist (memoized) |
| ServiceCard | `src/components/provider-dashboard/ServiceCard.tsx` | Individual service with toggle/edit/delete (memoized) |

---

## Known Limitations

1. **Blog editor** uses markdown (not WYSIWYG). Toolbar buttons insert markdown syntax. Content renders properly on the published post.

2. **Provider images** — Edit Service accepts image URLs but doesn't upload to Supabase storage yet.

3. **Tour bookings (anonymous)** — saved as leads in `contact_submissions`, not in `tour_bookings`. Full fix requires a DB migration to make `user_id` nullable.

4. **Newsletter emails** — currently send from `onboarding@resend.dev` (sandbox). Verify a custom domain in Resend to fix.

5. **Podcast & Video** — buttons visible in Create Content dropdown but marked "coming soon".

---

## Reporting Issues

If something doesn't work:
1. Note the **exact URL** (copy from browser)
2. Note **logged in or not**
3. **Screenshot** the error (or screen recording for interactions)
4. **Mobile or desktop**
5. Send to Tumelo via WhatsApp or email

---

*Guide updated 3 April 2026 (v4) — Omni Wellness Media Platform*
*Build: ecf69ab*
