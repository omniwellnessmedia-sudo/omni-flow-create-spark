

# Build Omni Affiliate Program + LeadDyno Prep

## Overview

Transform the existing Partner Portal (`/partner-portal`) into a working affiliate program with referral link generation, application submission to the database, and prepare the infrastructure for LeadDyno integration when you sign up later this week.

## What Gets Built

### 1. Working Partner Application Form
- The current form on `/partner-portal` is static (no submit handler). Wire it up to save applications to a new `partner_applications` table in Supabase.
- Send email notification to `omniwellnessmedia@gmail.com` via the existing Resend integration when someone applies.
- Show success confirmation after submission.

### 2. Affiliate Referral Link System
- After approval, partners get a unique referral code (e.g., `?ref=sarah-j`)
- Track referral visits, signups, and purchases via a `partner_referrals` table
- Display a simple dashboard for approved partners showing their link, clicks, and earnings
- Commission structure as previously defined: 15% first purchase, 10% repeat, R100 bonus per 10 referrals

### 3. LeadDyno Integration Prep
- Add LeadDyno to the affiliate config (`src/config/affiliates.ts`)
- Create a placeholder edge function (`leaddyno-webhook`) ready to receive conversion webhooks once the account is created
- When you sign up for LeadDyno, you'll just need to add the API key as a secret and configure the webhook URL

### 4. Fix Broken Link
- Update the "Start Your Journey" button on Partner Portal from `/wellness-exchange/provider-signup` to scroll to the application tab instead

## Technical Details

**New database tables:**

```text
partner_applications
- id (uuid, PK)
- full_name, email, phone, service_category
- experience_level, bio, website
- has_certifications, has_insurance, offers_online, can_travel
- status (pending/approved/rejected)
- referral_code (generated on approval)
- created_at, updated_at

partner_referrals
- id (uuid, PK)
- partner_application_id (FK)
- referral_code
- visitor_ip_hash, page_visited
- converted (boolean)
- conversion_type (signup/purchase)
- commission_amount
- created_at
```

**Files to create/modify:**
- `src/pages/PartnerPortal.tsx` -- Wire up form submission, fix broken link
- `src/config/affiliates.ts` -- Add LeadDyno program config
- `supabase/functions/submit-partner-application/index.ts` -- Handle form + email notification
- `supabase/functions/leaddyno-webhook/index.ts` -- Placeholder for future LeadDyno webhooks

**RLS Policies:**
- `partner_applications`: Insert allowed for anyone (public applications), select/update restricted to admins
- `partner_referrals`: Insert for tracking (public), select for admins and the owning partner

**No new secrets needed yet** -- LeadDyno API key will be added when you create the account later this week.

