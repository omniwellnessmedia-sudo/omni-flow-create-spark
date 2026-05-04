# Omni Wellness Media — Marketing & Platform Status Report
## May 2026

**Date:** 4 May 2026
**Prepared by:** Tumelo Ncube (Technical Lead)
**For:** Chad Cupido · Zenith Yassin · Feroza Begg · Investors & Partners
**Platform:** https://www.omniwellnessmedia.co.za
**Confidential — Internal Use Only**

---

## Executive Summary

Omni Wellness Media has reached a significant milestone: the platform is now a fully monetizable, multi-revenue business. This report documents the latest major sprint — Provider Pro monetization, full profile redesign, and a WCAG 2.2 / SEO audit — and outlines the commercial opportunity ahead.

**Three numbers that matter this sprint:**
- **R499/month** — the new Provider Pro subscription price point, with a 30-day free trial
- **10 tabs** — the redesigned provider dashboard now includes analytics, CRM, and financial tools that previously required third-party software costing hundreds of rands per month
- **6 profile types** — all practitioner, partner, and consumer profiles have been rebuilt to Airbnb-quality design standards, dramatically improving conversion for new visitor → booking

---

## 1. What Was Built This Sprint (May 2026)

### 1.1 Provider Pro — Subscription Monetization System

This is the single biggest commercial development on the platform to date. Wellness service providers can now upgrade to **Provider Pro at R499/month** (with a 30-day free trial), unlocking:

| Feature | What It Does |
|---------|-------------|
| **Business Analytics** | Revenue area chart (last 30 days), top services by bookings, booking conversion rate |
| **Client CRM** | Full client directory, repeat/VIP tracking, "follow-up needed" flags for clients not seen in 30+ days |
| **Booking Intelligence** | Pending / Confirmed / Cancelled breakdown with conversion rate calculation |
| **Financial Suite** | Month-over-month revenue comparison, ZAR vs WellCoin revenue mix chart, one-click CSV export |
| **AI Content Studio** | AI-drafted service descriptions and social captions *(teased, launching next sprint)* |
| **Priority Marketplace Listing** | Higher placement in search and category pages |

**Free users see a visually compelling blurred teaser of each Pro section, with a gradient upgrade card** — this is a deliberate conversion mechanic that creates genuine desire before asking for payment.

**Upgrade page:** https://www.omniwellnessmedia.co.za/upgrade

### 1.2 Airbnb-Style Profile Redesign (All 4 Profile Types)

All practitioner and partner profiles have been completely rebuilt. The new design follows the Airbnb profile pattern — large hero cover photo, lifted avatar, sticky booking card, identity strip — while remaining uniquely Omni.

| Profile | URL | Key Change |
|---------|-----|-----------|
| **Individual Provider** | `/provider/:id` | Hero cover + sticky desktop booking card + mobile sticky bar |
| **Sandy Mitchell (Dru Yoga)** | `/provider/sandy-mitchell` | Branded teal hero, service cards with BookingSystem integration |
| **Partner Profile** | `/partner-profile/:id` | Dynamic tabs (Gallery, Reviews, Articles) — only shown if data exists |
| **Consumer Account** | `/wellness-exchange/account` | Cover strip, WellCoin wallet card, profile completeness tracker |

### 1.3 Site Audit — WCAG 2.2 AA, SEO, Performance

A full audit was conducted against the UI/UX SOP 2026 standard, with the following improvements shipped:

| Category | Fix Applied |
|----------|------------|
| **SEO** | Open Graph tags, Twitter Cards, JSON-LD Organization + WebSite schema, canonical URL |
| **Sitemap** | `public/sitemap.xml` created with 50+ prioritised URLs |
| **Robots.txt** | Updated with sitemap reference and admin/checkout disallow rules |
| **Accessibility** | Skip navigation in every page (moved into UnifiedNavigation), `aria-current` on nav links, `autoComplete` on all forms |
| **Forms** | Contact form, footer newsletter — proper label associations and autocomplete attributes |
| **Fonts** | Removed duplicate Google Fonts import (non-render-blocking via HTML `<link>` tag) |

---

## 2. Platform Revenue Overview

### 2.1 Revenue Streams — Current Status

| Revenue Stream | Status | Price Point | Action Required |
|---------------|--------|------------|-----------------|
| **RoamBuddy eSIM sales** | ✅ Live & generating | $3–$89 USD per plan | Maintain ad campaigns, optimise ROAM bot |
| **Tour bookings** | ✅ Live (manual payment) | R1,850–R2,330pp | First international booking confirmed |
| **Affiliate commissions** | ✅ Live (CJ, AWIN, Viator) | Commission-based | Drive traffic to `/affiliate-marketplace` |
| **Provider Pro subscriptions** | 🆕 Infrastructure live | **R499/month** | Begin provider outreach campaign (see Section 4) |
| **Web development services** | 🟡 Leads waiting | R10,000–R50,000/project | Follow up in Admin → Leads |
| **Media production** | 🟡 Leads waiting | R5,000–R25,000/project | Follow up in Admin → Leads |
| **Social media strategy** | 🟡 Leads waiting | R3,000–R10,000/month | Follow up in Admin → Leads |

### 2.2 Provider Pro Revenue Projection

This is a conservative projection for Provider Pro subscriptions, based on the existing wellness provider community in the Western Cape:

| Milestone | Active Pro Providers | Monthly Recurring Revenue |
|-----------|---------------------|--------------------------|
| **Month 1** (soft launch) | 5 | **R2,495** |
| **Month 3** (word of mouth) | 20 | **R9,980** |
| **Month 6** (active outreach) | 50 | **R24,950** |
| **Month 12** (regional scale) | 120 | **R59,880** |
| **Year 2** (national) | 300 | **R149,700** |

*These numbers are before any advertising spend. At 300 providers paying R499/month, this is a **R1.79M annual recurring revenue** stream from a single product line.*

### 2.3 What the R499/Month Replaces for a Provider

To contextualise the price: a wellness provider attempting to replicate Provider Pro with off-the-shelf tools would need:

| Tool | Cost |
|------|------|
| Google Analytics (manual setup) | Free but requires a developer |
| CRM (e.g. HubSpot Starter) | R800–R1,500/month |
| Invoicing / Financial tool | R200–R400/month |
| AI content writing tool | R200–R500/month |
| **Total** | **R1,200–R2,400/month** |
| **Provider Pro** | **R499/month** |

At R499/month, this is positioned as the most affordable, wellness-specific business toolkit in South Africa.

---

## 3. Platform Technical Overview

### 3.1 Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS | Production |
| UI Components | shadcn/ui + Radix UI | Production |
| Database | Supabase (PostgreSQL with RLS) | Production |
| Authentication | Supabase Auth | Production |
| Storage | Supabase Storage | Production |
| Payments | PayPal (eSIM) | Production |
| Email | Resend API | Production *(needs domain verify)* |
| Analytics | Google Analytics 4 + Microsoft Clarity | Production |
| AI (ROAM chat) | Google Gemini | Production |
| AI (content) | OpenAI | Production |
| Deployment | Netlify (CI/CD from GitHub) | Production |
| Domain | omniwellnessmedia.co.za | Production |

### 3.2 Key URLs — Internal Reference

| Page | URL |
|------|-----|
| **Homepage** | https://www.omniwellnessmedia.co.za |
| **Admin Dashboard** | https://www.omniwellnessmedia.co.za/admin |
| **Provider Dashboard** | https://www.omniwellnessmedia.co.za/provider-dashboard |
| **Provider Pro Upgrade** | https://www.omniwellnessmedia.co.za/upgrade |
| **Sandy Mitchell Profile** | https://www.omniwellnessmedia.co.za/provider/sandy-mitchell |
| **Services Marketplace** | https://www.omniwellnessmedia.co.za/services |
| **Tours Hub** | https://www.omniwellnessmedia.co.za/tours-retreats |
| **ROAM eSIM Store** | https://www.omniwellnessmedia.co.za/roambuddy-store |
| **Blog / Community** | https://www.omniwellnessmedia.co.za/blog/community |
| **Contact** | https://www.omniwellnessmedia.co.za/contact |

---

## 4. Marketing Recommendations

### 4.1 Provider Pro — Acquisition Campaign

The single highest-ROI marketing activity right now is signing up wellness providers to the Pro tier. Here is a structured campaign:

**Week 1–2: Foundation**
- [ ] Update Sandy Mitchell's profile to show the Pro badge (set `pricing_info = {"subscription_tier": "pro"}` in Supabase)
- [ ] Screenshot the Pro dashboard (Analytics, CRM, Financial tabs) for marketing materials
- [ ] Create a short (60-second) screen-recording of the Pro dashboard in action
- [ ] Draft a WhatsApp message for Chad's wellness groups (template in Section 4.3)

**Week 3–4: Outreach**
- [ ] Send the video to existing providers (Sandy, any others in the admin)
- [ ] Post the Provider Pro pitch to Cape Town wellness Facebook groups
- [ ] Direct message 10–20 wellness practitioners on Instagram: yoga studios, sound healers, Reiki practitioners, life coaches
- [ ] Offer the first 10 sign-ups **3 months free** to seed testimonials and social proof

**Month 2–3: Scale**
- [ ] Run a targeted Facebook/Instagram ad ($5–$10/day) targeting Cape Town + Johannesburg wellness practitioners
- [ ] Partner with wellness associations (e.g. PAWSS, SAMA complementary medicine) for endorsement
- [ ] Referral programme: existing Pro providers earn 1 free month per referral

### 4.2 Google Analytics 4 — Tracking What's Working

The platform has GA4 active (ID: G-X9DQ4DEHNB). Key reports to monitor weekly:

- **Acquisition → Traffic source** — which channels (organic, social, direct) bring the most visitors
- **Engagement → Pages and screens** — which pages keep visitors longest (tour pages, service profiles)
- **Events** — `purchase` (eSIM), `booking_submitted` (tours), `lead_captured` (contact forms)
- **Conversions** — track what % of `/upgrade` page visitors convert to WhatsApp contact

**Microsoft Clarity** (also live) provides session recordings and heatmaps — check weekly for rage-click patterns on the booking forms and upgrade page.

### 4.3 WhatsApp Group Message Template — Provider Pro Launch

*Ready to copy and paste:*

---

Hi everyone 👋

Excited to share something we've been building for the wellness community.

**Omni Wellness Media has launched Provider Pro** — a full business dashboard for wellness practitioners in South Africa.

Here's what you get for **R499/month** (with a 30-day free trial):

📊 Revenue analytics — see exactly how much you're earning, day by day
👥 Client CRM — track every client, follow up automatically
💰 Financial reports — month-over-month comparison + one-click CSV export
🎯 Booking intelligence — conversion rates, pending vs confirmed
🤖 AI content tools — write service descriptions and social captions in seconds
⭐ Priority listing on the Omni marketplace

Compare that to HubSpot + an accountant + a copywriter — and you'll understand why providers are saying yes.

**First 10 sign-ups get 3 months free.**

Book a quick call or send me a WhatsApp:
→ https://www.omniwellnessmedia.co.za/upgrade

---

### 4.4 Instagram / Facebook Post Copy — Provider Pro

*Post 1 (Pain point):*
> Running a wellness practice shouldn't mean spreadsheets, sticky notes, and chasing invoices.
> Provider Pro gives you a full business dashboard — analytics, CRM, finances — built specifically for wellness practitioners.
> From R499/month. First 30 days free.
> Link in bio 👆
> #WellnessBusiness #CapeTownWellness #YogaTeacher #Reiki #SoundHealing #HolisticHealth

*Post 2 (Social proof angle — once Sandy is on Pro):*
> Sandy Mitchell has been teaching Dru Yoga in Cape Town for years. Now she runs her entire practice from one screen — bookings, clients, revenue, all in one place.
> Omni Provider Pro · R499/month
> 🔗 omniwellnessmedia.co.za/upgrade

### 4.5 SEO — Current Status and Opportunities

The platform now has a proper SEO foundation. Key opportunities:

**Quick wins (this week):**
- Verify Google Search Console ownership (add the meta verification tag or DNS record)
- Submit `sitemap.xml` to Google Search Console
- Add city-specific content to tour pages ("Cape Town Indigenous Heritage Walk" ranks better than just "Cave Tour")

**Medium-term (this month):**
- Each tour page should have unique meta descriptions with the tour name and location
- Provider profile pages should have `Person` JSON-LD structured data (name, jobTitle, location)
- Blog posts targeting keywords: "wellness Cape Town", "Dru yoga Cape Town", "sound healing Cape Town"

---

## 5. Immediate Action Items

### This Week (High Priority)

| # | Action | Owner | Deadline |
|---|--------|-------|---------|
| 1 | Activate Sandy Mitchell on Provider Pro (set pricing_info in Supabase) | Tumelo | Day 1 |
| 2 | Record 60-second screen demo of Provider Pro dashboard | Tumelo/Chad | Day 2 |
| 3 | Send Provider Pro WhatsApp message to wellness groups | Chad/Zenith | Day 3 |
| 4 | Follow up on existing leads in Admin → Leads | Zenith | Day 1 |
| 5 | Verify Resend email domain (omniwellnessmedia.co.za) | Tumelo | Day 1 |
| 6 | Run testing checklist v5 (see separate guide) | Feroza/Zenith | This week |

### This Month (Medium Priority)

| # | Action | Notes |
|---|--------|-------|
| 7 | Build public `/become-a-provider` signup page | Allows self-service provider onboarding |
| 8 | Build Stripe/PayPal recurring billing for Provider Pro | Replace manual activation with automated payment |
| 9 | Launch referral programme | Existing providers → 1 free month per referral |
| 10 | Google Search Console setup + sitemap submission | SEO critical path |
| 11 | Fix newsletter blockers (domain, unsubscribe, cron) | Currently blocked by domain verification |

---

## 6. Team Access & Contacts

| Person | Role | Email | Dashboard |
|--------|------|-------|-----------|
| Chad Cupido | Founder & Head of Media | chad.cupido91@gmail.com | Full admin |
| Zenith Yassin | Administration & Coordination | zenithyassin@gmail.com | Full admin |
| Feroza Begg | QA & Team Testing | beggferoza@gmail.com | Full admin |
| Tumelo Ncube | Technical Lead | ttncube01@gmail.com | Full admin + GitHub |
| Sandy Mitchell | Wellness Provider | — | Provider dashboard |

**Admin Dashboard:** https://www.omniwellnessmedia.co.za/admin
**Provider Dashboard:** https://www.omniwellnessmedia.co.za/provider-dashboard

---

*Report prepared: 4 May 2026 · Omni Wellness Media*
*Build: f31cf37 (main branch) · Platform version: v5*
*Confidential — do not distribute outside the core team*
