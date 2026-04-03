# Omni Wellness Media — Platform Status Report

**Date:** 3 April 2026
**Prepared by:** Tumelo (Technical Lead)
**For:** Chad Cupido, Zenith, Feroza, Investors, Partners
**Platform:** https://omniwellnessmedia.co.za

---

## Executive Summary

The Omni Wellness Media platform is a two-sided marketplace connecting wellness service providers with conscious consumers. Since the last report (1 April), we've completed a full dashboard redesign, fixed critical bugs reported by Feroza, and modernized the admin, provider, and consumer experiences.

**Key wins this sprint:**
- Modern sidebar-based admin dashboard with smart greetings and contextual alerts
- Fixed blog draft saving and tour booking errors
- Removed all hardcoded demo data — platform is 100% live data
- First international booking confirmed at new rates (2 pax @ R2,330pp)

---

## 1. WHAT IS BUILT AND FUNCTIONAL

### 1.1 RoamBuddy eSIM Store (Revenue-Generating)

| Component | Status | Notes |
|-----------|--------|-------|
| Product catalog | Live | Pulls from RoamBuddy API (2,882 eSIM plans) |
| Search & filter | Live | By country, data size, price |
| Guest checkout | Live | No account required |
| PayPal payments | Live | USD with ZAR conversion display |
| Discount codes | Live | ROAM10, WELCOME, WELLNESS, OMNI25, FIRSTTRIP, AIRPORT20 |
| WellCoins rewards | Live | 1 WellCoin per $1 spent |
| Order confirmation email | Live | eSIM QR code + activation instructions via Resend |
| Admin notification | Live | Email to omniwellnessmedia@gmail.com + WhatsApp link |
| ROAM sales bot | Live | AI-powered chat, lead capture, booking intent detection |
| Sales dashboard | Live | Conversations, leads, funnel, real order data |

**Revenue status:** Generating sales. PayPal captures payment, eSIM delivered via email.

### 1.2 Tour Bookings

| Component | Status | Notes |
|-----------|--------|-------|
| Tour listings | Live | Great Mother Cave, Muizenberg Heritage, Kalk Bay, and more |
| Booking form | Live | Date, participants, contact info, eSIM add-ons |
| Booking to DB | Live | Authenticated → `tour_bookings`; Anonymous → `contact_submissions` fallback |
| Email notification | Live | Via `submit-contact` edge function (fire-and-forget) |
| Request-to-book | Live | Alternative flow with operator confirmation |
| Capacity management | Live | `tour_operator_availability` table with lease system |
| Admin bookings section | Live | Shows both tour bookings and service leads |

**Revenue status:** First international booking confirmed. Payment is manual (email/WhatsApp confirmation with operator).

### 1.3 Service Provider System

| Component | Status | Notes |
|-----------|--------|-------|
| Provider profiles | Live | Business info, specialties, certifications, images |
| Service creation | Live | Full form with AI-generated titles/descriptions |
| Service editing | Live | Edit any field, changes sync to public profile instantly |
| Service toggle | Live | Activate/deactivate from dashboard |
| Service deletion | Live | With confirmation |
| Provider dashboard | Live | 7 tabs with smart greeting, stats grid, and memoized components |
| Admin providers section | Live | Sidebar nav → "Providers" — verify/add/manage all providers and services |
| Provider directory | Live | Public listing with search/filter |
| Sandy Mitchell profile | Live | Branded profile page with live Supabase data |
| Provider seed tool | Live | One-click onboarding in Admin → Tools |

### 1.4 Lead Capture & CRM

| Component | Status | Notes |
|-----------|--------|-------|
| Contact form | Live | Saves to `contact_submissions` + email notification |
| Booking forms | Live | All booking buttons save leads |
| Tour booking fallback | **Fixed** | Anonymous users now save to `contact_submissions` instead of failing |
| ROAM chat leads | Live | Email capture + booking intent detection |
| Admin leads section | Live | Sidebar nav → "Leads" — view all, update status, reply, mass email |
| Lead status tracking | Live | pending → in_progress → responded → closed |

### 1.5 Blog & Content

| Component | Status | Notes |
|-----------|--------|-------|
| Blog listing | Live | `/blog/community` with search, tags, author profiles |
| Blog editor | Live | Markdown toolbar (bold, italic, headings, lists, links, images, code) |
| Draft/publish | **Fixed** | Save drafts now works reliably (slug uniqueness issue resolved) |
| Comments | Live | Authenticated users can comment |
| Likes | Live | Toggle like/unlike with count |
| View tracking | Live | Auto-increments on page load |
| Social sharing | Live | Facebook, Twitter, LinkedIn share buttons |

### 1.6 Analytics & Tracking

| Component | Status | Notes |
|-----------|--------|-------|
| Google Analytics 4 | Live | Measurement ID: G-X9DQ4DEHNB |
| Microsoft Clarity | Live | Heatmaps, session recordings, rage click detection |
| Conversion tagging | Live | Purchase, booking, lead_captured, roam_chat events |
| UTM campaign tracking | Live | Full UTM URL system for Google Ads, social, affiliates |
| Admin analytics section | Live | Sidebar nav → "Analytics" — Business metrics + GA4 + Clarity |

### 1.7 Admin Dashboard (Redesigned — v4)

The admin dashboard has been completely redesigned with a modern sidebar layout:

**Layout:**
- Persistent sidebar navigation (desktop) with grouped sections and icons
- Mobile: hamburger menu opens sidebar in slide-out drawer
- Smart greeting with time-aware message, date, and contextual alert pills
- Home screen with quick actions, at-a-glance stats, recent activity, and platform health

**Sidebar Sections:**

| Group | Sections |
|-------|---------|
| **Core** | Home, Analytics, Leads, Bookings, Orders |
| **Manage** | Providers, Products, Content, Newsletter, Social |
| **System** | Accounting, Team, Tasks, Viator, UWC, Tools |

**Home Screen Features:**
- Quick actions: New Blog Post, View Leads, Send Newsletter, View Site
- At-a-glance stats: Revenue, Orders, Leads, Providers, Users, Content
- Recent activity feed (orders, bookings, leads)
- Platform health metrics (WellCoins, services, tours, providers)
- Contextual alerts: pending bookings, unanswered leads, pending orders, unverified providers

### 1.8 Other Functional Systems

| System | Status |
|--------|--------|
| Authentication (Supabase Auth) | Live |
| Provider directory & profiles | Live |
| Affiliate product marketplace | Live |
| WellCoins loyalty system | Live (earning only, redemption pending) |
| Cookie/Privacy/Terms/ESG policies | Live |
| Accessibility settings | Live |
| Mobile-responsive navigation | Live |
| CSP security headers | Live |
| Netlify deployment (CI/CD) | Live |

---

## 2. WHAT IS MONETIZABLE TODAY

### Tier 1 — Already Generating Revenue
| Revenue Stream | Status | Action Needed |
|---------------|--------|---------------|
| **RoamBuddy eSIM sales** | Active | Continue ad campaigns, optimize ROAM bot conversion |
| **Affiliate commissions** | Active | CJ, AWIN, Viator, SafariNow products in marketplace |
| **Tour bookings** | Active | First international booking confirmed at R2,330pp |

### Tier 2 — Ready to Sell (Infrastructure Built)
| Revenue Stream | Pricing Suggestion | What's Needed to Start |
|---------------|-------------------|----------------------|
| **Web development services** | R10,000–R50,000 per project | Follow up on existing leads in Admin → Leads |
| **Media production services** | R5,000–R25,000 per project | Follow up on existing leads |
| **Social media strategy** | R3,000–R10,000/month retainer | Follow up on existing leads |
| **Business consulting** | R500/session (already priced) | Booking system works, Cal.com ready |

### Tier 3 — Needs 1-3 Fixes Before Selling
| Revenue Stream | Fix Required | Effort |
|---------------|-------------|--------|
| **Newsletter service** | 1. Verify domain in Resend. 2. Build unsubscribe endpoint. 3. Set up cron. | 2-4 hours |
| **Provider subscriptions** | Build Stripe/PayPal recurring billing | 1-2 weeks |
| **Social media management** | Configure Zapier webhook + workflows | 1-2 days |

---

## 3. BUGS FIXED (This Sprint)

| Bug | Reported By | Fix |
|-----|------------|-----|
| Blog drafts not saving | Feroza | Explicit field mapping for insert/update; timestamp appended to slugs for uniqueness |
| Great Mother Cave booking error | Feroza | Authenticated users → `tour_bookings`; anonymous → `contact_submissions` fallback; no more silent failures |
| About page showing tour people | Feroza | Replaced Mother Cave group photos with community/heritage images |
| Provider dashboard using demo data | — | Removed 602 lines of hardcoded Sandy/Helen demo data; all live Supabase queries |

---

## 4. IMMEDIATE ACTION ITEMS

### This Week
1. **Follow up on existing leads** — Admin → Leads has real inquiries waiting
2. **Verify Resend domain** — Resend dashboard → Domains → add `omniwellnessmedia.co.za`
3. **Test the new admin dashboard** — use the Team Testing Guide v4
4. **Test blog draft save** — Feroza's reported bug should be fixed
5. **Test tour booking** — Great Mother Cave should now work without errors

### Next Sprint
1. Build provider self-signup form (public `/become-a-provider` page)
2. Fix newsletter blockers (domain, unsubscribe, cron)
3. Package first service offering and price it
4. Make `tour_bookings.user_id` nullable in Supabase (optional DB improvement)

---

## 5. TECHNOLOGY STACK

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS | Production |
| UI Components | shadcn/ui + Radix UI | Production |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) | Production |
| Payments | PayPal (eSIM checkout) | Production |
| Email | Resend API (notifications, newsletters) | Production (needs domain verify) |
| Analytics | Google Analytics 4 + Microsoft Clarity | Production |
| AI | Google Gemini (ROAM chat) + OpenAI (content generation) | Production |
| Deployment | Netlify (auto-deploy from GitHub) | Production |
| Domain | omniwellnessmedia.co.za | Production |

---

## 6. TEAM ACCESS

| Person | Role | Dashboard Access |
|--------|------|-----------------|
| Chad Cupido | Founder & Head of Media | Full admin |
| Zenith | Administration & Coordination | Full admin |
| Feroza | QA & Team Member | Full admin |
| Tumelo | Technical Lead | Full admin |
| Sandy Mitchell | Provider (Dru Yoga) | Provider dashboard |

---

*Report updated 3 April 2026 — Omni Wellness Media*
*Platform version: ecf69ab (main branch)*
