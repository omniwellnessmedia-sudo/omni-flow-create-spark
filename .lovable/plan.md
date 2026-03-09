

# Build Plan: Two New Experience Product Pages

## Overview
Create two new product pages following existing tour page patterns (GreatMotherCaveTour.tsx as template): same imports, component library, layout structure, and booking sidebar.

## Files to Create

### 1. `src/pages/experiences/CartHorseUrbanWellness.tsx` (~450 lines)
Route: `/experiences/cart-horse-urban-wellness`

Sections (following existing tour page pattern):
- **Hero**: Full-width banner, "Hoofbeats & Healing" headline, two CTAs, 3 badges (CPD Accredited, Evidence-Based, UWC Research Partner)
- **Story block**: Narrative text + pull quote in a styled blockquote card
- **Experience Highlights**: 4-column icon grid (Pegasus Programme, Equine Interaction, Handler Session, CPD Certificate)
- **Itinerary Timeline**: Vertical stepper using Card components with colored left borders (same pattern as GreatMotherCaveTour)
- **Who Is This For**: 3-column target audience cards (Healthcare, Corporate, Wellness Seekers)
- **What's Included**: Checklist with Check/X icons (13 items)
- **Pricing Table**: 2 side-by-side cards (Individual R1,800pp | Corporate R14,500)
- **Impact Banner**: Styled card with partner logos text
- **Upcoming Dates**: 4-slot grid (Apr 19, May 10, May 31, Jun 21 2026) with book buttons
- **Booking Modal**: Dialog with form fields (name, email, phone, org, date, ticket type, attendees, dietary, discipline dropdown). Submit sends toast confirmation.
- **Testimonials**: 3 placeholder quote cards
- **FAQ Accordion**: 5 items using existing Accordion component

### 2. `src/pages/experiences/CorporateWellnessRetreat.tsx` (~600 lines)
Route: `/experiences/corporate-wellness-retreat`

Sections:
- **Hero**: Dark atmospheric banner, "Rewild Your Team" headline, 2 CTAs, 4 trust badges
- **Problem Section**: Split layout (text left, visual right) — burnout narrative
- **3 Retreat Format Cards**: Horizontal pricing cards (The Reset R80k, The Reconnect R130k, The Transformation R200k) with badges and tiered inclusions
- **Differentiators**: 4-column grid (Research-Backed, Animal-Assisted, Impact-Generating, CPD Eligible)
- **Programme Architecture**: Tabs component (1-Day / 2-Day / 3-Day) with itinerary timelines inside each tab
- **Outcomes & Measurement**: 2-column layout (experience vs measurables)
- **CSI/ESG Callout**: Highlighted panel with Section 18A info and CTA
- **Who Books This**: 3 client profile cards
- **Enquiry Form**: Premium B2B form with 12 fields (company, role, size dropdown, retreat format multiselect, group size, date window, primary goal dropdown, source, context textarea)
- **Testimonials + Logo Strip**: 3 quotes + placeholder partner row
- FAQ Accordion

### 3. `src/App.tsx` — Add 2 routes
```
const CartHorseUrbanWellness = React.lazy(() => import('@/pages/experiences/CartHorseUrbanWellness'));
const CorporateWellnessRetreat = React.lazy(() => import('@/pages/experiences/CorporateWellnessRetreat'));
```
Routes in the Travel & Tours section:
```
<Route path="/experiences/cart-horse-urban-wellness" element={<CartHorseUrbanWellness />} />
<Route path="/experiences/corporate-wellness-retreat" element={<CorporateWellnessRetreat />} />
```

## Technical Approach
- Reuse: `UnifiedNavigation`, `Footer`, `Card`, `Badge`, `Button`, `Tabs`, `Accordion`, `Dialog` (for booking modal), `Select`, `Input`, `Label`, `Textarea`
- SEO: Use `useTourSEO` hook
- Forms: Toast confirmation on submit (no backend wiring needed now)
- Images: Use existing Supabase storage images from `provider-images/General Images/`
- No new dependencies or global style changes

## Files Modified
| File | Change |
|------|--------|
| `src/pages/experiences/CartHorseUrbanWellness.tsx` | New file |
| `src/pages/experiences/CorporateWellnessRetreat.tsx` | New file |
| `src/App.tsx` | Add 2 lazy imports + 2 routes |

