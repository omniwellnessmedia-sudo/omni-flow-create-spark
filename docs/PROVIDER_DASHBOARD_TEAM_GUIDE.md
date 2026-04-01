# Provider Dashboard — Team Testing Guide

**Date:** 1 April 2026
**For:** Chad, Zenith, Feroza, Sandy
**Status:** Ready for testing

---

## What's New

We've built a full provider management system that allows wellness practitioners (starting with Sandy Mitchell) to manage their services, pricing, and profile — with changes syncing live to the public website in real time.

### New Features
- **Edit Service** — providers can now edit any service directly from their dashboard
- **Live Supabase sync** — Sandy's public profile page pulls live data from the database
- **Provider seed tool** — admin can onboard new providers with one click
- **Blog system** — fully functional with markdown formatting toolbar

---

## Step-by-Step Testing

### Test 1: Seed Sandy's Provider Profile (Admin Only)

**Who:** Chad or Tumelo (admin access required)

1. Go to **https://omniwellnessmedia.co.za/admin**
2. Log in with your admin account
3. Click the **"Tools"** tab (far right in the tab bar — scroll if on mobile)
4. Scroll down to the **"Provider Onboarding"** card
5. You'll see Sandy Mitchell's details listed
6. Click **"Seed Sandy's Profile"**
7. Wait for the green success message

**Expected result:** Green confirmation showing "Provider 'Sandy Mitchell - Dru Yoga Cape Town' seeded with 6 services"

**What this does:** Writes Sandy's profile and all 6 services (Dru Yoga, Backcare, Buteyko, Mental Wellness, Discovery Call, Workshop) into the live database. This only needs to be done once.

---

### Test 2: View Sandy's Public Profile

**Who:** Anyone (no login required)

1. Go to **https://omniwellnessmedia.co.za/provider/sandy-mitchell**
2. You should see Sandy's full profile with her brand colours (teal/terra cotta)

**Check these tabs:**

| Tab | What to verify |
|-----|---------------|
| **Services** | 6 service cards showing — Dru Yoga Class (R120), Backcare Course (R600), Buteyko Session (R350), Mental Wellness (R600), Discovery Call (Free), Workshop (R250) |
| **About Sandy** | Bio, specialties (Dru Yoga, Buteyko Breathing, etc.), certifications, contact info |
| **Packages** | 2 packages — Monthly Unlimited (R1,890) and Beginner's Journey (R2,200) |
| **Gallery** | 10 photos from Sandy's studio shoots |

**Expected result:** All data loads. If the seed hasn't been run yet, static data appears as fallback — the page never breaks.

---

### Test 3: Provider Dashboard — View Services

**Who:** Any authenticated user

1. Go to **https://omniwellnessmedia.co.za/provider-dashboard**
2. Log in if prompted
3. Click the **"Services"** tab

**Expected result:** You see a list of services with three action buttons per service:
- **Toggle** (circle icon) — turns service on/off on the marketplace
- **Pencil** (edit icon) — opens the edit form
- **Trash** (delete icon) — removes the service

---

### Test 4: Edit a Service

**Who:** Any authenticated user with provider access

1. From the Provider Dashboard > Services tab
2. Click the **pencil icon** on any service
3. You'll be taken to the **Edit Service** page

**Test these changes:**
- [ ] Change the **price** (e.g., change R120 to R150)
- [ ] Edit the **description** text
- [ ] Toggle **"Available online"** switch
- [ ] Toggle **"Service Status"** (active/inactive)
- [ ] Click **"Save Changes"**

**Expected result:** Toast notification "Service updated successfully!" — you're redirected back to the dashboard. The updated price/description should show immediately.

**Then verify the public profile:**
4. Go to **https://omniwellnessmedia.co.za/provider/sandy-mitchell**
5. Check that the service you edited now shows the new price/description

**Expected result:** Changes are live immediately — no deploy needed. This is real-time sync.

---

### Test 5: Add a New Service

**Who:** Any authenticated user

1. Go to **https://omniwellnessmedia.co.za/wellness-exchange/add-service**
2. Fill in the form:
   - Title: "Test Yoga Session"
   - Description: "A test service for QA"
   - Category: Search and select "Yoga"
   - Price ZAR: 100
   - Price WellCoins: 15
   - Duration: 60
   - Location: "Cape Town"
   - Toggle "Available online" on
3. Click **"Publish Service"**

**Expected result:** Toast "Service created successfully!" — redirects to marketplace. The service should appear in the provider dashboard.

4. **Clean up:** Go back to Provider Dashboard > Services > click the trash icon on "Test Yoga Session" to delete it.

---

### Test 6: Blog — Create and Publish a Post

**Who:** Any authenticated user

1. Go to **https://omniwellnessmedia.co.za/blog/editor/new**
2. Fill in:
   - Title: "Test Blog Post"
   - Subtitle: "Testing the blog system"
   - Use the **formatting toolbar** — try clicking Bold, Heading, Bullet List
   - Write some content with markdown: `**bold text**`, `## Heading`, `- list item`
   - Add a tag: type "wellness" and click "Add Tag"
3. Click **"Save Draft"** first
4. Then click **"Publish"**

**Expected result:** Toast confirmation. You're redirected to the published post, which renders the markdown formatting (bold, headings, lists).

5. **Verify on listing:** Go to **https://omniwellnessmedia.co.za/blog/community**
6. Your post should appear in the grid

---

### Test 7: Blog — Edit an Existing Post

**Who:** The author of the post

1. Go to **https://omniwellnessmedia.co.za/blog/community**
2. Click the **"My Stories"** tab
3. Click the **edit icon** on any draft or published post
4. Make changes
5. Click **"Save Draft"** or **"Publish"**

**Expected result:** Changes saved and visible immediately.

---

### Test 8: Tour Booking (Bug Fix Verification)

**Who:** Anyone

1. Go to **https://omniwellnessmedia.co.za/tours/great-mother-cave-tour**
2. Scroll to the booking sidebar
3. Select a date (at least 7 days from today)
4. Set participants to 2
5. Fill in name and email
6. Click **"Book Now"**

**Expected result:** Green toast "Booking Submitted!" — NOT the red "Booking Error" that Feroza reported. The booking is saved either to `tour_bookings` (if logged in) or `contact_submissions` (if anonymous) as a fallback.

7. **Also verify:** Scroll down to the image gallery — it should show cave views, rock art, and landscape photos. **No individual faces** should appear.

---

### Test 9: "Need eSIM Help" Button (Mobile Overlap Fix)

**Who:** Anyone on mobile

1. Open **https://omniwellnessmedia.co.za** on a mobile phone
2. Scroll to the bottom of any page

**Expected result:** The "Need eSIM help?" button should sit **above** the footer email input and the sticky booking bar — not overlapping them. On tour pages, it should not cover the price bar.

---

### Test 10: Admin Dashboard — Analytics Tabs

**Who:** Chad or Tumelo (admin access)

1. Go to **https://omniwellnessmedia.co.za/admin**
2. Click **"Analytics"** tab
3. You should see **3 sub-tabs**: Business, GA4 Live, Clarity

**Check each:**

| Sub-tab | What to verify |
|---------|---------------|
| **Business** | Revenue chart, orders, leads, subscribers with period selector (7/14/30/90 days) |
| **GA4 Live** | 4 clickable cards linking to Google Analytics (Realtime, Reports, Acquisition, Conversions) |
| **Clarity** | 3 clickable cards linking to Microsoft Clarity (Dashboard, Heatmaps, Recordings) |

**Expected result:** Business tab shows real Supabase data. GA4 and Clarity cards open the correct external dashboards in new tabs.

---

## Quick Reference — Key URLs

| Page | URL |
|------|-----|
| Admin Dashboard | `/admin` |
| Provider Dashboard | `/provider-dashboard` |
| Add Service | `/wellness-exchange/add-service` |
| Edit Service | `/wellness-exchange/edit-service/{id}` |
| Sandy's Public Profile | `/provider/sandy-mitchell` |
| Blog Listing | `/blog/community` |
| New Blog Post | `/blog/editor/new` |
| Great Mother Cave Tour | `/tours/great-mother-cave-tour` |

---

## Known Limitations

1. **Blog editor** uses markdown formatting (not a visual rich-text editor). The toolbar buttons insert markdown syntax. Content renders properly on the published post page.

2. **Provider profile images** — the Edit Service form accepts an image URL but doesn't upload to Supabase storage yet. For now, use existing Supabase image URLs or external image links.

3. **Sandy's profile fallback** — if the seed hasn't been run, the profile shows static hardcoded data. After seeding, it shows live DB data. Both states work correctly.

4. **Service editing** — only the service owner (by `provider_id`) can edit their services, enforced by Supabase Row Level Security.

---

## Reporting Issues

If something doesn't work as described above:
1. Note the **exact URL** you were on
2. Note whether you were **logged in or not**
3. Take a **screenshot** of the error
4. Note whether you're on **mobile or desktop**
5. Send to Tumelo with the above details

---

*Guide prepared 1 April 2026 — Omni Wellness Media Platform*
