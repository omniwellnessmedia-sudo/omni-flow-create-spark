
# Comprehensive Site Audit & Implementation Plan

## Issues to Address

### 1. 2BeWell Section Still Showing Omni Logos
**Root Cause:** Despite correct folder path encoding (`product-images%2A%2A%20(2BeWell)`), the image files being referenced may not exist in the storage with those exact names, or there's a component-specific issue.

**Solution:**
- Update `TwoBeWellCTA.tsx` to use the specific product image URL you provided:
  `https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/product-images**%20(2BeWell)/10.png`
- Simplify to a **single beautiful portrait column** layout as requested
- Remove the multi-image bento grid in favor of one impactful product image

**Files to modify:**
- `src/components/sections/TwoBeWellCTA.tsx`

---

### 2. Team Section Not Visible on Homepage
**Current State:** The About page (`/about`) has the team section, but it's NOT on the homepage (`Index.tsx`).

**Solution:** Either:
- Add a "Meet the Team" section to the homepage
- OR ensure navigation clearly directs users to the About page

**Recommended:** Add a compact team preview section to the homepage that links to full About page.

**Files to modify:**
- `src/pages/Index.tsx` - Add team section
- Create new component: `src/components/sections/TeamPreviewSection.tsx`

---

### 3. Cal.com Integration Mapping

Based on your screenshot, here are the event types that need to be mapped:

| Cal.com Event | Slug | Duration | Target Page(s) |
|---------------|------|----------|----------------|
| UWC Human-Animal Programme Call | `uwc-human-animal-programme` | 30m | `/programs/uwc-human-animal` |
| Wellness Exchange Session | `wellness-exchange-session` | 60m | `/wellness-exchange` |
| Business Strategy Session | `business-strategy` | 60m | `/business-consulting` |
| Media Production Consultation | `media-production` | 60m | `/media-production` |
| Web Development Consultation | `web-consultation` | 45m | `/web-development` |
| Social Media Strategy Session | `social-media-strategy` | 60m | `/social-media-strategy` |
| Discovery Call | `discovery-call` | 30m | Homepage, Contact, Footer CTAs |

**Implementation:**
- Add `CalComBooking` component to each service page with correct `eventTypeSlug`
- Enable feature flag `calcom_integration` in database
- Update Cal.com username in settings to match screenshot: `omni-wellness-media-gqj9mj`

**Files to modify:**
- `src/pages/BusinessConsulting.tsx`
- `src/pages/MediaProduction.tsx`
- `src/pages/WebDevelopment.tsx`
- `src/pages/SocialMediaStrategy.tsx`
- `src/pages/programs/UWCHumanAnimalProgram.tsx`
- `src/pages/WellnessExchange.tsx`
- `src/pages/Contact.tsx`

---

## 4. Comprehensive Site Audit - Critical Items

### Navigation Gaps
| Missing Item | Recommendation |
|--------------|----------------|
| About Us | Add to main nav (currently only in footer) |
| Contact | Add prominent link in header |
| Blog/Insights | Add to nav (exists at `/blog`) |
| Great Mother Cave Tour | Add to Travel menu (popular experience) |
| Tours page | Add `/tours` to Travel menu |

### Homepage Sales Funnel Concerns
| Issue | Impact | Fix |
|-------|--------|-----|
| No sticky CTA | Users scroll away from conversion | Add sticky "Book Discovery Call" bar |
| No exit intent | Lost leads | Add exit-intent popup with free resource |
| 2BeWell images broken | Low trust, high bounce | Fix image paths (Priority 1) |
| No team visibility | Less personal connection | Add team preview section |
| Missing clear value prop | Unclear offering | Strengthen hero messaging |

### Bounce Rate Concerns
1. **Broken images** - Creates unprofessional impression
2. **Missing navigation items** - Users can't find content
3. **No visible booking CTAs** - No clear next step
4. **Long page with no engagement points** - Users scroll and leave

### Pages Needing Attention
| Page | Status | Issue |
|------|--------|-------|
| `/about` | ⚠️ | Team images all showing Omni logo (no real photos) |
| `/contact` | ⚠️ | No Cal.com booking integration |
| `/tours` | ✅ | Exists but not in main nav |
| `/blog` | ✅ | Exists but not prominent in nav |
| `/social-media-strategy` | ⚠️ | Needs Cal.com integration |

---

## Implementation Priority

### Phase 1: Critical Fixes (Immediate)
1. Fix 2BeWell section - single portrait image as requested
2. Map Cal.com events to service pages
3. Add About/Contact to main navigation

### Phase 2: Conversion Optimization
4. Add team preview section to homepage
5. Add sticky CTA bar for Discovery Call
6. Add exit-intent popup component

### Phase 3: Navigation & UX
7. Add Tours and Blog to main navigation
8. Add Great Mother Cave Tour to Travel menu
9. Review and fix all page navigation paths

---

## Files to Create/Modify

### New Files:
- `src/components/sections/TeamPreviewSection.tsx`
- `src/components/conversion/StickyBookingBar.tsx`

### Modified Files:
- `src/components/sections/TwoBeWellCTA.tsx` - Single portrait image
- `src/pages/Index.tsx` - Add team preview, sticky CTA
- `src/components/navigation/MegaNavigation.tsx` - Add missing nav items
- `src/components/navigation/UnifiedNavigation.tsx` - Add About/Contact
- `src/pages/BusinessConsulting.tsx` - Cal.com integration
- `src/pages/MediaProduction.tsx` - Cal.com integration
- `src/pages/WebDevelopment.tsx` - Cal.com integration
- `src/pages/SocialMediaStrategy.tsx` - Cal.com integration
- `src/pages/programs/UWCHumanAnimalProgram.tsx` - Cal.com integration
- `src/pages/Contact.tsx` - Cal.com integration

---

## Cal.com Configuration Note

Your Cal.com username from the screenshot is `omni-wellness-media-gqj9mj`. This needs to be updated in:
- `calcom_global_settings` database table
- Or passed directly to `CalComBooking` component via `calUsername` prop

---

## Summary of Immediate Actions

1. **Fix 2BeWell image** - Use single verified URL in portrait layout
2. **Add Cal.com booking buttons** to all service pages with correct slugs
3. **Add navigation items** for About, Contact, Blog, Tours
4. **Add team section** to homepage
5. **Enable `calcom_integration`** feature flag in database

This comprehensive update will reduce bounce rate, improve conversion, and create a complete user journey through the site.
