# Omni Wellness Media — Team Testing Guide v5
## May 2026

**Date:** 4 May 2026
**For:** Zenith Yassin · Feroza Begg · Chad Cupido · Sandy Mitchell
**Status:** Ready for testing — please complete by end of week
**Site:** https://www.omniwellnessmedia.co.za
**Admin:** https://www.omniwellnessmedia.co.za/admin
**Provider Dashboard:** https://www.omniwellnessmedia.co.za/provider-dashboard

---

## What's New in v5

This is the biggest release since the platform launched. Three major areas were updated:

### 1. Provider Pro Monetization Dashboard
The provider dashboard now has **10 tabs** including three new Pro-gated sections:
- **Analytics tab** — revenue chart (last 30 days), top services, booking conversion rate
- **Clients tab** — full CRM with VIP/follow-up badges, repeat client tracking
- **Financial tab** — month-over-month comparison, revenue mix chart, CSV export
- **Upgrade page** at `/upgrade` — Free vs Pro pricing, FAQs, activation via WhatsApp/email

Free users see a blurred preview of these sections with an upgrade prompt. Pro users see live data.

### 2. Airbnb-Style Profile Redesign
All four profile types have been completely rebuilt:
- Individual provider profiles (hero cover, sticky booking card, specialty pills)
- Sandy Mitchell's branded profile (teal design, live service cards with booking)
- Partner profiles (dynamic tabs — Gallery, Reviews, Articles)
- Consumer account (WellCoin wallet, profile completeness tracker, quick links)

### 3. Site Audit — SEO, Accessibility, Performance
- Skip-to-content links on every page (WCAG 2.2 AA)
- Open Graph / Twitter Card meta tags
- JSON-LD structured data (Google search results)
- Sitemap.xml with 50+ prioritised URLs
- `aria-current` on navigation links
- Autocomplete attributes on all forms

---

## How to Test

1. Open the site on a **laptop or desktop** first, then repeat key tests on your **phone**
2. Use **Chrome** (or your usual browser) — logged in AND logged out for different tests
3. For each checkbox below: ✅ tick it if it passes, ✗ and add a note if something is wrong
4. Send your findings to Tumelo via WhatsApp or email — **include the URL and a screenshot**

**Contact for issues:**
- **Tumelo (Technical):** ttncube01@gmail.com | WhatsApp
- **Zenith (Coordination):** zenithyassin@gmail.com

---

## TEST 1: Homepage & Navigation

**URL:** https://www.omniwellnessmedia.co.za
**Logged in:** Not required

- [ ] Homepage loads — hero image visible, text readable
- [ ] Navigation bar loads correctly
- [ ] **Services** section shows cards
- [ ] **Tours & Retreats** preview section loads
- [ ] **Partners** section loads
- [ ] Footer shows — newsletter form, social icons, links, copyright 2026
- [ ] No horizontal scroll on phone

**Navigation — test each menu item:**
- [ ] **Home** → homepage
- [ ] **About** → About page loads
- [ ] **Impact Travel** dropdown → tour links all appear
- [ ] **ROAM Store** → eSIM store loads
- [ ] **Services** → Services page loads
- [ ] **Contact** → Contact page loads with form
- [ ] **Mobile:** hamburger menu (☰) opens and closes correctly

---

## TEST 2: Provider Pro Upgrade Page ⭐ NEW

**URL:** https://www.omniwellnessmedia.co.za/upgrade
**Logged in:** Not required

This is a brand new page — please test carefully.

- [ ] Page loads without errors
- [ ] "Provider Pro" heading and R499/month price display correctly
- [ ] **Free vs Pro side-by-side pricing cards** are visible
- [ ] Free column shows free features with tick marks ✓
- [ ] Free column shows locked Pro features with a strikethrough ✗
- [ ] Pro column shows gradient header (teal-to-purple)
- [ ] "Most popular" badge shows on the Pro card
- [ ] "Activate via WhatsApp" button is visible — clicking it should open WhatsApp (or prompt to install it)
- [ ] "Activate via Email" button is visible — clicking it should open your email app with a pre-filled subject line
- [ ] **Feature deep-dive section** shows 6 Pro feature cards with icons
- [ ] **FAQ section** shows 4 questions and answers
- [ ] "Back to dashboard" link at the top navigates back
- [ ] Page looks correct on **phone** (cards stack vertically)

---

## TEST 3: Provider Dashboard — New Tabs ⭐ NEW

**URL:** https://www.omniwellnessmedia.co.za/provider-dashboard
**Logged in:** YES — requires a provider account

> If you don't have provider access, ask Tumelo to create a test account.

### 3a. Dashboard Header and Tab Bar

- [ ] Smart greeting shows: "Good [morning/afternoon/evening], [Name]"
- [ ] **"Upgrade to Pro"** button appears in the header (for free accounts) with a lightning bolt icon
- [ ] The **scrollable tab bar** shows all 10 tabs:
  `Overview | Services | Bookings | Earnings | Analytics | Clients | Financial | Media | Blog | Reviews`
- [ ] The word **"Pro"** appears in small text next to Analytics, Clients, and Financial tabs
- [ ] Tabs are horizontally scrollable on mobile

### 3b. Analytics Tab (Free — should show upgrade prompt)

- [ ] Click the **Analytics** tab
- [ ] A **blurred teaser** should be visible behind a gradient overlay card
- [ ] The upgrade card shows: "Unlock with Provider Pro" heading, R499/month price, list of features, and a CTA button
- [ ] Clicking the "Start Free Trial" button navigates to `/upgrade`
- [ ] The blurred preview shows a revenue chart and stat cards (even though they're blurred)

### 3c. Clients Tab (Free — should show upgrade prompt)

- [ ] Click the **Clients** tab
- [ ] Three blurred client card skeletons should be visible behind an upgrade overlay
- [ ] Upgrade card shows with "Client CRM" as the feature name

### 3d. Financial Tab (Free — should show upgrade prompt)

- [ ] Click the **Financial** tab
- [ ] Blurred teaser shows two monthly comparison cards and a pie chart preview
- [ ] Upgrade card shows with "Financial Suite" as the feature name

### 3e. Overview Tab

- [ ] Overview tab loads with 4 Quick Action cards
- [ ] If the account is Free: a **"Provider Pro" upgrade card** appears on the right side instead of the Services Summary
- [ ] Recent Activity card shows if there are transactions
- [ ] Quick action cards work: "Add Service", "Write Blog Post", "View Public Profile", "Browse Community"

---

## TEST 4: Airbnb-Style Provider Profile ⭐ NEW

**URL:** https://www.omniwellnessmedia.co.za/provider/sandy-mitchell
**Logged in:** Not required

This profile has been completely redesigned. Test each section:

**Hero Section:**
- [ ] Large **cover photo strip** at the top (teal/gradient background)
- [ ] Sandy's **avatar** is lifted up, overlapping the cover strip (not inside it)
- [ ] **Save (heart)** and **Share** buttons appear top-right on the cover
- [ ] Name "Sandy Mitchell" and subtitle "Dru Yoga & Wellness" are visible
- [ ] Location shows (e.g. "Cape Town")
- [ ] **Star rating** and **years of experience** show in the identity strip

**Specialty Pills:**
- [ ] Specialty tags (e.g. "Dru Yoga", "Buteyko Breathing", "Mental Wellness") show as pill badges below the identity strip

**Tab Navigation:**
- [ ] Four tabs are visible: **Services · About Sandy · Packages · Gallery**
- [ ] Clicking each tab switches the content below — no page reload

**Services Tab:**
- [ ] At least 6 service cards visible
- [ ] Each card shows: service title, price, duration, short description
- [ ] **"Book Session"** button on each card
- [ ] **"Enquire"** button on each card
- [ ] WellCoin badges on appropriate services

**Packages Tab:**
- [ ] Monthly Unlimited package (R1,890) visible
- [ ] Beginner's Journey package (R2,200) visible

**About Sandy Tab:**
- [ ] Bio paragraph
- [ ] Certifications section
- [ ] Connect / contact links

**Sticky Booking Card (desktop only):**
- [ ] On a desktop/laptop, a **sticky card on the right side** should stay visible as you scroll
- [ ] It shows: "From R120 / session", a "Book a Session" CTA, and "Send a Message" button
- [ ] Trust stats show below (rating, sessions, years)

**Mobile Sticky Bar:**
- [ ] On phone, a **sticky bar at the bottom** of the screen shows the price and a Book button

---

## TEST 5: Consumer Account Page ⭐ NEW DESIGN

**URL:** https://www.omniwellnessmedia.co.za/wellness-exchange/account
**Logged in:** YES — any account

- [ ] **Cover strip** with gradient colours loads at the top
- [ ] Avatar/initials display, lifted over the cover strip
- [ ] **Member since [Month Year]** shows correctly
- [ ] **Badges row** shows "Verified Member" (green badge)
- [ ] **Stats strip** shows: WellCoins, Services Saved, Tours Booked (numbers may be 0)
- [ ] **WellCoin Wallet** card shows current balance and "Spend WellCoins" button
- [ ] **Your Profile** card shows completeness checklist with green ticks for completed fields
- [ ] **Explore Omni** quick links grid (Browse Services, Read Blog, Book a Tour, Contact)
- [ ] **Account section** shows email, Privacy & Security row, and Sign Out button
- [ ] Sign Out works — logs you out and redirects to homepage

---

## TEST 6: Existing Tests — Blog Save Draft (Keep Testing)

**URL:** https://www.omniwellnessmedia.co.za/blog/editor/new
**Logged in:** YES

This was fixed in v4 — please confirm it still works.

1. Write a title (e.g. "Test Draft 4 May 2026")
2. Write a sentence of content
3. Click **"Save Draft"**

- [ ] Green toast: "Draft saved successfully" — **NOT** a red error
- [ ] URL changes from `/blog/editor/new` to `/blog/editor/{id}`
- [ ] Save again — no errors

---

## TEST 7: Existing Tests — Tour Booking (Keep Testing)

**URL:** https://www.omniwellnessmedia.co.za/tours/great-mother-cave-tour
**Logged in:** Test BOTH logged in and logged out

1. Select a date (choose a date at least 7 days away)
2. Enter: Name, Email, Number of guests
3. Click **"Book Now"** (or "Enquire Now" on mobile)

- [ ] Green toast: **"Booking Submitted!"** — NOT a red error
- [ ] Works **without** being logged in
- [ ] Works **with** being logged in
- [ ] Form clears after submission

---

## TEST 8: Admin Dashboard (Existing — Keep Testing)

**URL:** https://www.omniwellnessmedia.co.za/admin
**Logged in:** YES — admin account required

- [ ] Smart greeting shows with time and date
- [ ] Sidebar shows three groups: **Core, Manage, System**
- [ ] **Leads** section loads
- [ ] **Providers** section loads — list of providers shows
- [ ] **Analytics** section loads — GA4 and Clarity embeds visible
- [ ] **Bookings** section loads — tour bookings visible
- [ ] **Orders** section loads
- [ ] "**+ Create**" button opens dropdown with Blog Post, Podcast (Soon), Video (Soon)
- [ ] Mobile: hamburger menu opens sidebar drawer

---

## TEST 9: ROAM eSIM Store

**URL:** https://www.omniwellnessmedia.co.za/roambuddy-store
**Logged in:** Not required

- [ ] Page loads with product cards
- [ ] Country search/filter works
- [ ] Clicking a product opens product detail
- [ ] "Add to Cart" button works
- [ ] Checkout page loads
- [ ] PayPal button is visible

---

## TEST 10: Contact Form

**URL:** https://www.omniwellnessmedia.co.za/contact
**Logged in:** Not required

- [ ] All form fields accept input
- [ ] "Service interested in" dropdown opens and has options
- [ ] Submit button sends the form — success message appears
- [ ] No page errors

---

## TEST 11: Mobile Testing — Full Walkthrough

Open the site on your **phone** and check:

- [ ] Homepage hero image loads, text is readable
- [ ] Navigation hamburger opens/closes
- [ ] Sandy Mitchell profile: sticky booking bar visible at bottom
- [ ] Provider dashboard: tab bar is horizontally scrollable
- [ ] Upgrade page: pricing cards stack vertically and are readable
- [ ] Consumer account: avatar lifted over cover strip (same as desktop)
- [ ] All buttons are tap-friendly (large enough touch targets)
- [ ] No horizontal scrolling on any page

---

## Quick Reference — All Key URLs

| Page | URL |
|------|-----|
| **Homepage** | https://www.omniwellnessmedia.co.za |
| **Admin Dashboard** | https://www.omniwellnessmedia.co.za/admin |
| **Provider Dashboard** | https://www.omniwellnessmedia.co.za/provider-dashboard |
| **Provider Pro Upgrade** | https://www.omniwellnessmedia.co.za/upgrade |
| **Sandy Mitchell Profile** | https://www.omniwellnessmedia.co.za/provider/sandy-mitchell |
| **Consumer Account** | https://www.omniwellnessmedia.co.za/wellness-exchange/account |
| **Services Marketplace** | https://www.omniwellnessmedia.co.za/services |
| **Tours Hub** | https://www.omniwellnessmedia.co.za/tours-retreats |
| **Great Mother Cave Tour** | https://www.omniwellnessmedia.co.za/tours/great-mother-cave-tour |
| **Muizenberg Cave Tour** | https://www.omniwellnessmedia.co.za/tours/muizenberg-cave-tours |
| **Kalk Bay Tour** | https://www.omniwellnessmedia.co.za/tours/kalk-bay-tour |
| **ROAM eSIM Store** | https://www.omniwellnessmedia.co.za/roambuddy-store |
| **Blog / Community** | https://www.omniwellnessmedia.co.za/blog/community |
| **New Blog Post** | https://www.omniwellnessmedia.co.za/blog/editor/new |
| **About Page** | https://www.omniwellnessmedia.co.za/about |
| **Contact Page** | https://www.omniwellnessmedia.co.za/contact |
| **Partner Directory** | https://www.omniwellnessmedia.co.za/partners-directory |

---

## Known Limitations (Not Bugs — Working as Expected)

| Limitation | Detail |
|-----------|--------|
| **Blog editor is markdown** | Uses markdown formatting (not WYSIWYG like Google Docs). Toolbar buttons insert `**bold**` syntax. Content renders correctly on the published post page. |
| **Provider Pro activation is manual** | Currently activated by Tumelo via Supabase. Stripe/PayPal recurring billing integration is the next major technical sprint. |
| **Anonymous tour bookings** | If you book a tour without being logged in, it saves as a contact form lead (not in the bookings table). The tour operator is still notified. Full fix requires a small database migration. |
| **Newsletter emails send from sandbox** | Emails currently show as `onboarding@resend.dev` sender. This is fixed once Resend domain verification is done for `omniwellnessmedia.co.za`. |
| **Podcast & Video creation** | Visible in the "Create Content" dropdown as "Coming Soon" — not yet functional. |
| **AI Content Studio** | Visible in the upgrade page as a Pro feature. The interface is teased but the generation feature launches in the next sprint. |

---

## How to Report Issues

When something doesn't work as expected, please send a report with:

1. **URL** — copy and paste the exact address from your browser
2. **What you expected** to happen
3. **What actually happened** — be specific (e.g. "red error toast appeared with the text: '...'" or "blank white screen")
4. **Screenshot or screen recording** — the easiest way on phone is to hold the side + volume button
5. **Device and browser** — e.g. "iPhone 13, Safari" or "Windows laptop, Chrome"
6. **Logged in or not** — this matters for many tests

**Send to:**
- Tumelo: ttncube01@gmail.com
- Zenith: zenithyassin@gmail.com
- Or via WhatsApp

---

*Testing Guide v5 · 4 May 2026 · Omni Wellness Media*
*Build: f31cf37 (main branch)*
*Thank you — your testing makes the platform better for every wellness practitioner and client we serve.*
