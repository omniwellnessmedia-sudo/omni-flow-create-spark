
# RoamBuddy Automated Sales Funnel Campaign

## Overview

Building an AI-powered automated sales funnel for RoamBuddy eSIM products using your existing infrastructure plus a new AI Sales Bot. This creates a complete "set and forget" marketing automation system.

## Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        ROAMBUDDY SALES FUNNEL                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [AI Sales Bot]  ←→  [Visitor on /roambuddy-store]                     │
│        │                                                                 │
│        ▼                                                                 │
│   Qualify Lead → Capture Email → Add to Newsletter                       │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                        CONTENT ENGINE                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [AI Content Generator]                                                 │
│        │                                                                 │
│        ├── Social Posts (31-Day Campaign)                               │
│        │      └── Bulk import to Social Scheduler                       │
│        │                                                                 │
│        └── Newsletter Sequences                                          │
│               └── Welcome + 4-email nurture series                       │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                        AUTOMATION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [Zapier Free]                                                          │
│        │                                                                 │
│        ├── Zap 1: Social Scheduler → Facebook Page                      │
│        ├── Zap 2: Social Scheduler → Instagram Business                 │
│        └── Zap 3: Social Scheduler → TikTok (via Zapier)                │
│                                                                          │
│   [Cron Job] ─── trigger-social-post (every 5 mins)                     │
│   [Cron Job] ─── send-scheduled-newsletter (daily)                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Phase 1: AI Sales Bot for RoamBuddy Store

Create an AI-powered sales assistant that appears on the RoamBuddy store page:

**New Files:**
- `src/components/roambuddy/RoamBuddySalesBot.tsx` - Chat widget component
- `supabase/functions/roambuddy-sales-chat/index.ts` - AI backend using Lovable AI

**Features:**
- Floating chat bubble on RoamBuddy store page
- Understands RoamBuddy products, pricing, destinations
- Qualifies leads with questions: "Where are you traveling?" "How long?"
- Recommends specific eSIM packages
- Captures email for newsletter signup
- Tracks conversations for sales follow-up

**AI Persona:**
- Name: "Roam" - Your Travel Connectivity Expert
- Tone: Helpful, friendly, travel-savvy
- Knowledge: All RoamBuddy products, pricing, destinations, device compatibility

## Phase 2: AI Content Campaign Generator

Create an edge function that generates a complete 31-day social media campaign:

**New File:**
- `supabase/functions/generate-campaign-content/index.ts`

**Output:**
- 31 days × 3 posts/day = 93 social media posts
- Platform-optimized (Facebook, Instagram, TikTok)
- Content pillar rotation (Wellness, Education, Empowerment, Inspiration)
- Hashtag strategies per platform
- RoamBuddy-specific messaging and CTAs

**Sample Generated Content:**
```text
Day 1 - Inspiration
[Instagram] ✈️ Your next adventure awaits! Stay connected to what matters most while exploring the world. No more hunting for WiFi or shocking roaming bills. 🌍 #RoamBuddy #TravelWellness #DigitalNomad

Day 3 - Education  
[Facebook] Did you know? Most travelers spend R500-R2000 on international roaming PER TRIP? 😱 RoamBuddy eSIMs start from just R90 for the same coverage. Save money, stay connected. Link in bio!

Day 5 - Empowerment
[TikTok] POV: You land in Thailand and you're already connected 📱✨ No SIM cards, no hassle. This is the RoamBuddy effect. #TravelHack #eSIM
```

## Phase 3: Automated Newsletter Nurture Sequence

Create a 5-email welcome and nurture sequence for RoamBuddy leads:

**Email 1 (Immediate):** Welcome + 10% discount code
**Email 2 (Day 2):** "How eSIMs Work" educational content
**Email 3 (Day 4):** Customer testimonial + social proof
**Email 4 (Day 7):** "Planning Your Trip?" destination guides
**Email 5 (Day 10):** Limited time offer + urgency

**Database Changes:**
- Add `lead_source` column to newsletter_subscribers
- Add `nurture_sequence_step` column for automation tracking

## Phase 4: Zapier Integration Setup

**Your Setup Steps (15 minutes):**

1. Create free Zapier account at zapier.com
2. Create Zap: "Webhooks by Zapier" trigger → "Facebook Pages" action
3. Copy the webhook URL to `/admin/social-scheduler` settings
4. Test with a single scheduled post

**Technical Setup:**
- The `trigger-social-post` edge function already sends the correct payload
- Need to set up a cron job to call it (using pg_cron)

## Phase 5: Canva Pro Asset Integration

Since you have Canva Pro, we can create branded social assets:

**Workflow:**
1. AI generates post copy
2. You create matching visual in Canva (or use Canva's Magic Design)
3. Upload image URL to scheduled post
4. Zapier sends both text + image to social platforms

**Optional Enhancement:**
- Add CANVA_API_KEY secret to enable automated design generation
- Currently shows demo mode without API key

## Phase 6: Sales Dashboard

Add a RoamBuddy-specific sales tracking tab to Admin Dashboard:

**New File:**
- `src/pages/admin/RoamBuddySalesDashboard.tsx`

**Metrics:**
- Chatbot conversations started
- Leads captured (email signups)
- Product recommendations made
- Click-through to checkout
- Newsletter open/click rates
- Social post engagement (manual input or Zapier webhook back)

## Implementation Summary

**New Files to Create:**
1. `src/components/roambuddy/RoamBuddySalesBot.tsx` - AI chat widget
2. `supabase/functions/roambuddy-sales-chat/index.ts` - Chat backend
3. `supabase/functions/generate-campaign-content/index.ts` - Content generator
4. `src/pages/admin/RoamBuddySalesDashboard.tsx` - Sales metrics

**Files to Modify:**
1. `src/pages/RoamBuddyStore.tsx` - Add sales bot widget
2. `src/pages/admin/SocialScheduler.tsx` - Add campaign generator button
3. `supabase/config.toml` - Add new functions
4. Database migration for newsletter tracking columns

## Required Setup (Your Actions)

1. **Zapier Free Account** - Create and get webhook URL
2. **Facebook Business Page** - Connect to Zapier
3. **Instagram Business Account** - Connect to Zapier (requires FB Page)
4. **TikTok Business Account** - Connect to Zapier
5. **Optional: Canva API Key** - For automated design (Canva Pro includes this)

## Cost Breakdown

- Zapier Free: R0/month (100 tasks, 5 Zaps)
- Canva Pro: Already have it
- Lovable AI: Uses your existing credits
- Resend (newsletters): Free tier (100 emails/day)

**Total Additional Cost: R0/month**

## Timeline

- Phase 1 (AI Sales Bot): Day 1
- Phase 2 (Content Generator): Day 1
- Phase 3 (Newsletter Sequence): Day 1
- Phase 4 (Zapier Setup): Day 2 (your setup + testing)
- Phase 5 (Canva Integration): Optional enhancement
- Phase 6 (Dashboard): Day 2

## Success Metrics

- Week 1: 10+ chatbot conversations, 5+ email signups
- Week 2: First automated social posts live
- Month 1: 50+ newsletter subscribers, consistent posting
- Month 3: Measurable eSIM sales from funnel

## Technical Notes

- AI Sales Bot uses Lovable AI (google/gemini-3-flash-preview) for fast responses
- Content generator uses structured output (tool calling) for consistent formatting
- Newsletter automation uses existing Resend integration
- All data tracked in Supabase for analytics
