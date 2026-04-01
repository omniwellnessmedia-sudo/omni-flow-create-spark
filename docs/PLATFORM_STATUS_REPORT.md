# Omni Wellness Media — Platform Status Report

**Date:** 1 April 2026
**Prepared by:** Tumelo (Technical Lead)
**For:** Chad Cupido, Zenith, Feroza, Investors, Partners

---

## Executive Summary

The Omni Wellness Media platform is a two-sided marketplace connecting wellness service providers with conscious consumers. This report details what is built, what is functional, what is monetizable today, and what needs work before scaling.

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
| Tour listings | Live | Great Mother Cave, Muizenberg Cave, and more |
| Booking form | Live | Date, participants, contact info, eSIM add-ons |
| Booking to DB | Live | Saves to `tour_bookings` or `contact_submissions` (fallback for anonymous) |
| Email notification | Live | Via `submit-contact` edge function |
| Request-to-book | Live | Alternative flow with operator confirmation |
| Capacity management | Live | `tour_operator_availability` table with lease system |
| Admin bookings tab | Live | Shows both tour bookings and service leads |

**Revenue status:** Booking requests flow in. Payment is manual (email/WhatsApp confirmation with operator).

### 1.3 Service Provider System

| Component | Status | Notes |
|-----------|--------|-------|
| Provider profiles | Live | Business info, specialties, certifications, images |
| Service creation | Live | Full form with AI-generated titles/descriptions |
| Service editing | Live | Edit any field, changes sync to public profile instantly |
| Service toggle | Live | Activate/deactivate from dashboard |
| Service deletion | Live | With confirmation |
| Provider dashboard | Live | 9 tabs: Overview, Services, Bookings, Transactions, Media, Website, Reviews, AI Insights, Blog |
| Admin providers tab | Live | List all providers, verify/unverify, manage all services, add new providers |
| Provider directory | Live | Public listing with search/filter |
| Sandy Mitchell profile | Live | Branded profile page with live Supabase data + static fallback |
| Provider seed tool | Live | One-click onboarding in Admin > Tools |

**Revenue status:** Infrastructure ready. Sandy Mitchell is the first live provider. No payment processing for provider services yet (booking creates leads, not transactions).

### 1.4 Lead Capture & CRM

| Component | Status | Notes |
|-----------|--------|-------|
| Contact form | Live | Saves to `contact_submissions` + email notification |
| Booking forms | Live | All "Email to Book Session" and "Book Strategy Session" buttons save leads |
| ROAM chat leads | Live | Email capture + booking intent detection |
| Admin leads tab | Live | View all leads, update status, reply via email, mass email |
| Service quote requests | Live | Separate form for detailed service quotes |
| Lead status tracking | Live | pending → in_progress → responded → closed |

**Revenue status:** Leads are being captured. The team needs to follow up manually.

### 1.5 Blog & Content

| Component | Status | Notes |
|-----------|--------|-------|
| Blog listing | Live | `/blog/community` with search, tags, author profiles |
| Blog editor | Live | Markdown toolbar (bold, italic, headings, lists, links, images, code) |
| Draft/publish | Live | Save drafts, publish when ready |
| Comments | Live | Authenticated users can comment |
| Likes | Live | Toggle like/unlike with count |
| View tracking | Live | Auto-increments on page load |
| Social sharing | Live | Facebook, Twitter, LinkedIn share buttons |

**Revenue status:** Content marketing asset. Drives organic traffic and SEO.

### 1.6 Analytics & Tracking

| Component | Status | Notes |
|-----------|--------|-------|
| Google Analytics 4 | Live | Measurement ID: G-X9DQ4DEHNB |
| Microsoft Clarity | Live | Heatmaps, session recordings, rage click detection |
| Conversion tagging | Live | Purchase, booking, lead_captured, roam_chat events |
| UTM campaign tracking | Live | Full UTM URL system for Google Ads, social, affiliates |
| Admin analytics tab | Live | Business metrics + GA4 Live + Clarity dashboards |
| RoamBuddy sales funnel | Live | Real data: conversations → leads → purchases |

### 1.7 Admin Dashboard

| Tab | Status | What it does |
|-----|--------|-------------|
| Overview | Live | Revenue, orders, activity feed, platform metrics |
| Analytics | Live | Business charts + GA4 + Clarity links |
| Accounting | Live | Revenue, commissions, payouts, CSV export |
| Content | Live | Blog post management |
| Tasks | Live | Internal task tracking |
| Products | Live | Affiliate product management |
| Providers | Live | Provider & service management, verify/add providers |
| Leads | Live | Contact submissions, quotes, mass email |
| Newsletter | Live | Campaign builder, subscriber management |
| Social | Live | Social post scheduling, AI generation |
| Team | Live | Team member invitations |
| Orders | Live | eSIM and product orders |
| Bookings | Live | Tour bookings + service session leads |
| Viator | Live | Viator tour sync |
| UWC | Live | University recruitment pipeline |
| Tools | Live | Auto-curation, admin users, provider seeding |

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

### Tier 2 — Ready to Sell (Infrastructure Built)
| Revenue Stream | Pricing Suggestion | What's Needed to Start |
|---------------|-------------------|----------------------|
| **Web development services** | R10,000–R50,000 per project | Follow up on existing leads in Admin > Leads |
| **Media production services** | R5,000–R25,000 per project | Follow up on existing leads |
| **Social media strategy** | R3,000–R10,000/month retainer | Follow up on existing leads |
| **Business consulting** | R500/session (already priced) | Booking system works, Cal.com ready |
| **Tour bookings** | R1,850pp (Great Mother Cave) | Booking form works, operator confirms manually |

### Tier 3 — Needs 1-3 Fixes Before Selling
| Revenue Stream | Fix Required | Effort |
|---------------|-------------|--------|
| **Newsletter service for clients** | 1. Verify domain in Resend (sender shows `onboarding@resend.dev`). 2. Build unsubscribe endpoint. 3. Set up cron for scheduled sends. | 2-4 hours |
| **Provider subscriptions** | Build Stripe/PayPal recurring billing for provider premium tier | 1-2 weeks |
| **Social media management** | Configure Zapier webhook + platform workflows | 1-2 days |

### Tier 4 — Future Revenue (Architecture Exists)
| Revenue Stream | Status |
|---------------|--------|
| Provider website builder | Duda API expired. GrapesJS replacement architected, not built. |
| WellCoins redemption/marketplace | Earning works. Redemption logic not built. |
| Dashboard-as-a-service | No multi-tenancy. Each client would see all data. |
| Buy One Sponsor One (BOSO) | Not built. Needs architecture decision on fund routing. |

---

## 3. WHAT NEEDS WORK

### Critical (Blocking Revenue)
| Item | Impact | Effort |
|------|--------|--------|
| Resend domain verification | Newsletter emails look unprofessional | 30 min |
| Resend API key renewal | Email notifications may fail | 5 min (Supabase secrets) |
| Meta Pixel ID (placeholder) | Can't track Facebook ad conversions | 5 min once you have the ID |

### Important (Blocking Scale)
| Item | Impact | Effort |
|------|--------|--------|
| Provider self-signup flow | Providers can't onboard themselves without admin | 1-2 days |
| Payment for provider services | Bookings create leads, not transactions | 1-2 weeks (Stripe/PayPal) |
| Newsletter unsubscribe endpoint | Legal requirement (POPIA/CAN-SPAM) | 2-3 hours |
| Newsletter scheduled auto-send | Admin must manually trigger each campaign | 1 hour (Supabase cron) |
| Open/click tracking for newsletters | Can't measure campaign performance | 1 day (Resend webhooks) |

### Nice to Have
| Item | Impact | Effort |
|------|--------|--------|
| Rich text blog editor (WYSIWYG) | Better writing experience (markdown works but less intuitive) | 1-2 days |
| Provider image upload to Supabase storage | Currently URL-only | 2-3 hours |
| GrapesJS website builder | Replace expired Duda API | 2-3 weeks |
| WellCoins redemption | Complete loyalty loop | 1 week |
| Multi-tenant dashboard | Sell dashboard access to clients | 2-3 weeks |

---

## 4. IMMEDIATE ACTION ITEMS

### This Week
1. **Follow up on existing leads** — Admin > Leads tab has real inquiries waiting for response
2. **Verify Resend domain** — Resend dashboard > Domains > add `omniwellnessmedia.co.za`
3. **Set Resend API key** — Supabase dashboard > Edge Functions > Secrets
4. **Seed Sandy's profile** — Admin > Tools > "Seed Sandy's Profile"
5. **Test the full provider flow** — use the Team Testing Guide

### Next Sprint
1. Build provider self-signup form (public `/become-a-provider` page)
2. Fix newsletter blockers (domain, unsubscribe, cron)
3. Package first service offering and price it
4. Set up Zapier for social posting

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

## 6. DATABASE TABLES (Key)

| Table | Records | Purpose |
|-------|---------|---------|
| `orders` | Active | eSIM purchases, product orders |
| `tour_bookings` | Active | Tour reservations |
| `contact_submissions` | Active | All leads, booking requests, inquiries |
| `newsletter_subscribers` | Active | Email list (website + ROAM bot) |
| `newsletter_campaigns` | Active | Email campaigns |
| `chatbot_conversations` | Active | ROAM chat transcripts |
| `provider_profiles` | Active | Wellness provider businesses |
| `services` | Active | Provider service offerings |
| `blog_posts` | Active | Community blog content |
| `affiliate_products` | 665 | Curated affiliate marketplace |
| `profiles` | Active | User accounts |
| `feature_flags` | Active | Feature toggles (Cal.com, etc.) |

---

## 7. TEAM ACCESS

| Person | Role | Dashboard Access |
|--------|------|-----------------|
| Chad Cupido | Founder & Head of Media | Full admin |
| Zenith | Administration & Coordination | Full admin |
| Feroza | QA & Team Member | Full admin |
| Tumelo | Technical Lead | Full admin |
| Sandy Mitchell | Provider (Dru Yoga) | Provider dashboard |

---

*Report generated 1 April 2026 — Omni Wellness Media*
*Platform version: fc2c750 (main branch)*
