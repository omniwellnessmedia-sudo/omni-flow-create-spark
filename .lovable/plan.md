
# RoamBuddy → Omni Wellness Connectivity Rebrand & Multi-Vertical Architecture

## The Brand Challenge

**Current Problem**: "RoamBuddy" is the name of our **affiliate partner** (the API provider). We're currently using their brand name throughout our stores, which:
1. Confuses our brand identity with theirs
2. Doesn't differentiate our wellness-first value proposition
3. Misses the opportunity to create unique verticals we own

## Proposed Brand Architecture

### The Omni Connectivity Ecosystem 🧭

Create **3 unique verticals** that all leverage the same RoamBuddy API but serve different audience segments with distinct branding:

```text
                    ┌─────────────────────────────────────────┐
                    │        ROAMBUDDY PARTNER API            │
                    │   (Behind the scenes - not customer-    │
                    │    facing except in partnership         │
                    │    disclosure)                          │
                    └─────────────┬───────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│                   │   │                   │   │                   │
│   🧭 ROAM         │   │   🌿 WELLCONNECT  │   │   ✈️ OMNI GLOBAL  │
│   by Omni         │   │   by Omni         │   │   DATA            │
│                   │   │                   │   │                   │
│ AI Wellness Guide │   │ Retreat & Retreat │   │ Business &        │
│ Conscious Travel  │   │ Connectivity      │   │ Production Travel │
│ Activity-Based    │   │ Spa & Healing     │   │ High-Data Needs   │
│                   │   │                   │   │                   │
│ Target: Individual│   │ Target: Retreats  │   │ Target: Teams &   │
│ Wellness Seekers  │   │ & Wellness Orgs   │   │ Content Creators  │
│                   │   │                   │   │                   │
│ /roam-store       │   │ /wellconnect      │   │ /global-data      │
└───────────────────┘   └───────────────────┘   └───────────────────┘
```

---

## Vertical 1: 🧭 ROAM by Omni

**Tagline**: "Stay Connected to Your Wellness Journey"

**Target Audience**: Individual conscious travelers, retreat attendees, digital nomads seeking wellness experiences

**AI Sales Agent**: Roam 🧭 - The Mindful Travel Guide

**Unique Positioning**:
- Activity-based eSIM selection (30 wellness categories)
- Curator recommendations from Zenith, Chad, Feroza
- Wellness Intent Badges on all products
- Preference-aware chatbot (emoji/text choice)

**URL**: `/roam-store` (primary) + `/esim-store` (redirect)

**Visual Identity**:
- Compass icon 🧭 as hero element
- Gradient: Teal → Cyan → Blue
- Messaging: "Your wellness journey deserves mindful connectivity"

---

## Vertical 2: 🌿 WELLCONNECT by Omni

**Tagline**: "Seamless Connectivity for Healing Journeys"

**Target Audience**: Retreat centers, yoga studios booking group travel, wellness practitioners

**Unique Positioning**:
- Bulk/group eSIM ordering
- Retreat coordinator packages
- Emergency-only vs. full-data options for digital detox programs
- Pre-configured for spa/wellness apps

**URL**: `/wellconnect` (new) + `/travel-well-connected-esim` (redirect)

**Visual Identity**:
- Leaf icon 🌿 as hero element
- Gradient: Green → Emerald → Teal
- Messaging: "Keep your retreat connected, not distracted"

---

## Vertical 3: ✈️ OMNI GLOBAL DATA

**Tagline**: "Production-Ready Connectivity Worldwide"

**Target Audience**: Media production teams, business travelers, content creators needing high data

**Curator Lead**: Chad (Media & Strategy)

**Unique Positioning**:
- High-data plans prioritized (10GB+)
- Multi-device hotspot emphasis
- Team/production coordination features
- Invoice-ready for business expense

**URL**: `/global-data` (new) + `/data-products` (redirect)

**Visual Identity**:
- Plane icon ✈️ as hero element
- Gradient: Orange → Gold → Amber
- Messaging: "Never miss the shot. Never drop the call."

---

## Technical Implementation Plan

### Phase 1: Brand Architecture Setup

**New Data Layer**: `src/data/omniConnectivityBrands.ts`

```typescript
export const omniConnectivityBrands = {
  roam: {
    id: 'roam',
    name: 'ROAM',
    fullName: 'ROAM by Omni',
    tagline: 'Stay Connected to Your Wellness Journey',
    icon: '🧭',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    primaryColor: 'teal',
    targetAudience: 'Individual wellness travelers',
    aiAgent: 'Roam',
    curatorLead: 'zenith',
    urls: ['/roam-store', '/esim-store', '/roambuddy-store']
  },
  wellconnect: {
    id: 'wellconnect',
    name: 'WELLCONNECT',
    fullName: 'WellConnect by Omni',
    tagline: 'Seamless Connectivity for Healing Journeys',
    icon: '🌿',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    primaryColor: 'green',
    targetAudience: 'Retreat centers & wellness organizations',
    aiAgent: 'Flora',
    curatorLead: 'zenith',
    urls: ['/wellconnect', '/travel-well-connected-esim']
  },
  globalData: {
    id: 'globalData',
    name: 'OMNI GLOBAL DATA',
    fullName: 'Omni Global Data',
    tagline: 'Production-Ready Connectivity Worldwide',
    icon: '✈️',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    primaryColor: 'orange',
    targetAudience: 'Media teams & business travelers',
    aiAgent: 'Atlas',
    curatorLead: 'chad',
    urls: ['/global-data', '/data-products']
  }
};
```

### Phase 2: Hero Section Transformation

**File**: `src/components/roambuddy/RoamBuddyHero.tsx`

| Element | Current | New |
|---------|---------|-----|
| Headline | "Avoid Roaming Bill Shock and Save Over 75% with RoamBuddy!" | "🧭 Stay Connected to Your Wellness Journey" |
| Subheadline | "Data coverage when you want, where you want" | "Mindful connectivity curated for retreats, adventures & conscious travel" |
| CTA | "Order an eSIM" | "Find Your Perfect Plan" |
| Trust Badges | Generic (Instant Activation, No Roaming) | Wellness-focused (🧘 Retreat-Ready, 🌿 Wellness Optimized, 🧭 Curator Picks) |
| New Section | None | Quick-action wellness activity buttons (🧘 Yoga, 🥾 Hiking, 🦁 Safari, 🧭 Multi-Country) |

### Phase 3: Curator Cards Enhancement

**File**: `src/components/roambuddy/WellnessCuratorCard.tsx`

| Change | Current | New |
|--------|---------|-----|
| Avatar Size | `w-24 h-24` (96px) | `w-40 h-40` (160px) |
| Avatar Style | Simple border | Gradient ring + shadow |
| New Element | None | Wellness Specialty Badge (e.g., "🧘 Retreat Specialist") |
| Card Padding | `p-6` | `p-8` |
| Hover Effect | None | Avatar scale on hover |

### Phase 4: Product Cards with Wellness Intent

**File**: `src/components/roambuddy/RoamBuddyProductCard.tsx`

Add wellness intent badges based on data amount and destination:

| Data Amount | Intent Badge | Icon |
|-------------|--------------|------|
| 1-3GB | Meditation & Mindfulness | 🧘 |
| 5GB | Ocean & Water Wellness | 🌊 |
| 5-10GB | Active Adventure | 🥾 |
| 10GB+ | Community & Events | 🎪 |
| Unlimited | Explorer | 🧭 |

Display: "Perfect for: [activity suggestions based on intent]"

### Phase 5: Page-by-Page Rebranding

**6 Store Pages to Update**:

| File | Current Brand | New Brand | Key Changes |
|------|---------------|-----------|-------------|
| `RoamBuddyStore.tsx` | RoamBuddy | ROAM by Omni 🧭 | Full rebrand, add wellness activity navigator |
| `ESIMStore.tsx` | Generic eSIM | ROAM by Omni 🧭 | Redirect to RoamStore or rebrand |
| `TravelWellConnectedESIM.tsx` | Travel Well Connected | WELLCONNECT 🌿 | Retreat-focused messaging |
| `DataProducts.tsx` | Data Products | OMNI GLOBAL DATA ✈️ | Business/production focus |
| `WellnessRoamingPackages.tsx` | Wellness Roaming | WELLCONNECT 🌿 | Group/retreat packages |
| `TravelWellConnectedStore.tsx` | Travel Well Connected | Keep (tours focus) | Add eSIM cross-sell with ROAM branding |

### Phase 6: Partnership Disclosure Update

**File**: `src/data/roamBuddyProducts.ts` → Rename to `src/data/omniConnectivity.ts`

Update `partnershipStory`:

```typescript
export const partnershipStory = {
  headline: 'Powered by RoamBuddy Technology',
  description: `ROAM by Omni leverages RoamBuddy's global eSIM infrastructure 
    to deliver wellness-optimized connectivity. We've curated their offerings 
    through a wellness lens, so you get the right data for your journey type.`,
  disclosure: `When you purchase through our platform, we earn a small 
    commission that directly supports community development projects 
    like Valley of Plenty.`,
  // ... benefits with Omni branding
};
```

### Phase 7: AI Sales Agents per Vertical

| Vertical | Agent Name | Emoji | Personality |
|----------|------------|-------|-------------|
| ROAM | Roam | 🧭 | Mindful, wellness-literate, activity-focused |
| WELLCONNECT | Flora | 🌿 | Calm, retreat-focused, group coordination expert |
| OMNI GLOBAL | Atlas | ✈️ | Professional, data-focused, production-savvy |

Each agent trained on their vertical's specific use cases and audience psychology.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/data/omniConnectivityBrands.ts` | Brand architecture definitions |
| `src/components/roambuddy/WellnessActivityNavigator.tsx` | Activity-based product filtering |
| `src/pages/WellConnectStore.tsx` | New WELLCONNECT vertical page |
| `src/pages/GlobalDataStore.tsx` | New OMNI GLOBAL DATA vertical page |

## Files to Modify

| File | Key Changes |
|------|-------------|
| `src/components/roambuddy/RoamBuddyHero.tsx` | New headline, subheadline, CTAs, wellness badges, activity buttons |
| `src/components/roambuddy/WellnessCuratorCard.tsx` | Larger avatars (160px), gradient ring, specialty badges, padding |
| `src/components/roambuddy/RoamBuddyProductCard.tsx` | Add wellness intent badge logic, "Perfect for" text |
| `src/components/roambuddy/RoamBuddyPartnershipSection.tsx` | Reframe as "Powered by RoamBuddy", Omni-first branding |
| `src/components/roambuddy/RoamBuddySalesBot.tsx` | Already updated - ensure ROAM branding |
| `src/data/roamBuddyProducts.ts` | Add wellness specialties to curators, update partnership story |
| `src/pages/RoamBuddyStore.tsx` | Full ROAM rebrand, add activity navigator, update all copy |
| `src/pages/ESIMStore.tsx` | ROAM rebrand or redirect |
| `src/pages/TravelWellConnectedESIM.tsx` | WELLCONNECT rebrand |
| `src/pages/DataProducts.tsx` | OMNI GLOBAL DATA rebrand |
| `src/pages/WellnessRoamingPackages.tsx` | WELLCONNECT rebrand |
| `src/pages/TravelWellConnectedStore.tsx` | Add ROAM cross-sell section for tours |
| `supabase/functions/roambuddy-sales-chat/index.ts` | Ensure ROAM persona, add vertical-awareness |

---

## Summary: The Wellness Telecoms Empire

After this transformation:

1. **RoamBuddy** = Our technology partner (disclosed transparently)
2. **ROAM by Omni** 🧭 = Our flagship wellness connectivity brand for individuals
3. **WELLCONNECT by Omni** 🌿 = Our retreat/group connectivity brand
4. **OMNI GLOBAL DATA** ✈️ = Our business/production connectivity brand

All three verticals:
- Use the same RoamBuddy API backend
- Have unique branding, AI agents, and audience targeting
- Feature larger curator images (160px) with specialty badges
- Include wellness intent badges on products
- Maintain the 30 wellness activity taxonomy for recommendations

This positions Omni as the **Wellness Telecoms pioneer** - not just a reseller of RoamBuddy products, but a curator of connected wellness experiences.
