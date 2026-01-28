
# Fix Team Images & Update Email Responses - Comprehensive Plan

## Current Issues Identified

### 1. Team Images Showing Omni Logo
Both `src/pages/About.tsx` and `src/components/sections/TeamPreviewSection.tsx` use `IMAGES.omni.logo` for all team members instead of actual portrait photos.

**Available team photos in Supabase (`General%20Images` folder):**
| Team Member | Photo URL |
|-------------|-----------|
| Chad Cupido | `General%20Images/Chad%20Amazing%20portrait.jpg` |
| Feroza Begg | `General%20Images/feroza%20begg%20-%20portrait.jpg` |
| Zenith Yasin | `General%20Images/Zenith_TNT_OMNI-9.jpg` |

**Missing photos (need upload or placeholder):**
| Team Member | Status |
|-------------|--------|
| Tumelo Thabo Ncube | No photo - use professional placeholder or Omni logo |
| Warren Cramer | No photo - use professional placeholder or Omni logo |
| Stephen Bosch | No photo - use professional placeholder or Omni logo |

### 2. About Page UI Needs Premium Redesign
The current About page design is functional but doesn't match the premium aesthetic of other pages (like UWC Programme). Needs:
- Better hero section with immersive imagery
- Improved team card design with gradient accents
- Better spacing and visual hierarchy
- Professional placeholder styling for missing photos

### 3. Email Responses Need Updating
Current email drafts in `docs/EMAIL_RESPONSE_QA_JAN28.md` need:
- Links to specific pages
- Updated status with team images fix
- Cal.com integration confirmation
- Preview and live URLs

---

## Implementation Plan

### Phase 1: Add Team Photos to Image System

**File: `src/lib/images.ts`**

Add new `team` section to CORE and IMAGES objects:
```typescript
team: {
  chad: `${SUPABASE_URL}/${FOLDERS.generalImages}/Chad%20Amazing%20portrait.jpg`,
  feroza: `${SUPABASE_URL}/${FOLDERS.generalImages}/feroza%20begg%20-%20portrait.jpg`,
  zenith: `${SUPABASE_URL}/${FOLDERS.generalImages}/Zenith_TNT_OMNI-9.jpg`,
  tumelo: null, // Placeholder - use professional avatar or request upload
  warren: null, // Placeholder
  stephen: null, // Placeholder
}
```

### Phase 2: Fix Team Section on About Page

**File: `src/pages/About.tsx`**

Update team array to use actual photos with fallbacks:
```typescript
const team = [
  {
    name: "Chad Cupido",
    role: "Founding Director",
    image: IMAGES.team.chad || IMAGES.omni.logo,
    // ...
  },
  {
    name: "Tumelo Thabo Ncube", 
    role: "Technical Founder | Platform & Systems Architecture",
    image: null, // Will use initials avatar component
    initials: "TN",
    // ...
  },
  // etc.
];
```

Redesign team cards with:
- Portrait-style aspect ratio (3:4)
- Gradient border on hover
- Initials avatar for missing photos with gradient background
- Better typography hierarchy

### Phase 3: Fix Team Preview Section on Homepage

**File: `src/components/sections/TeamPreviewSection.tsx`**

Update to use actual photos with same fallback pattern.

### Phase 4: Premium About Page UI Redesign

Improvements to implement:
1. **Hero Section**: Use immersive split layout with community imagery
2. **Story Section**: Larger image carousel with better captions
3. **Team Section**: 
   - Premium card design with subtle shadows
   - Initials avatar for missing photos (gradient background with white text)
   - Hover effects with gradient accent
4. **Values Section**: Add icons and better visual hierarchy
5. **Impact Section**: Enhanced statistics with animated counters
6. **CTA Section**: Full-width gradient background with prominent booking

### Phase 5: Update Email Response Documents

**File: `docs/EMAIL_RESPONSE_FINAL_JAN28.md`** (Create new consolidated file)

Contains separate emails for:
- **Feroza**: Non-technical summary with QA status, links to pages, re-testing checklist
- **Zenith**: Cal.com confirmation, booking page links, testing instructions  
- **Chad**: Technical summary, team structure confirmation, Cal.com integration status

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/images.ts` | Add `team` section with portrait URLs |
| `src/pages/About.tsx` | Use actual team photos, premium UI redesign |
| `src/components/sections/TeamPreviewSection.tsx` | Use actual photos with fallbacks |
| `docs/EMAIL_RESPONSE_FINAL_JAN28.md` | New consolidated email drafts |

### Team Photos Mapping

| Person | Supabase Path | Status |
|--------|---------------|--------|
| Chad Cupido | `General%20Images/Chad%20Amazing%20portrait.jpg` | ✅ Available |
| Feroza Begg | `General%20Images/feroza%20begg%20-%20portrait.jpg` | ✅ Available |
| Zenith Yasin | `General%20Images/Zenith_TNT_OMNI-9.jpg` | ✅ Available |
| Tumelo Thabo Ncube | - | ⚠️ Missing - Use gradient initials avatar |
| Warren Cramer | - | ⚠️ Missing - Use gradient initials avatar |
| Stephen Bosch | - | ⚠️ Missing - Use gradient initials avatar |

### Initials Avatar Component

For team members without photos, implement beautiful gradient initials:
```typescript
// Gradient background with white text initials
<div className="w-full aspect-square bg-gradient-rainbow flex items-center justify-center">
  <span className="text-white text-4xl font-bold">TN</span>
</div>
```

### Email Content Structure

**Email for Feroza:**
- Summary: All 13 QA items addressed
- Links: Homepage, About, UWC Programme, Services pages
- Checklist: Device-specific re-testing steps
- Preview URL: `https://id-preview--61859699-a11d-4fa8-a215-f664fadaaf98.lovable.app`
- Production URL: `https://omni-flow-create-spark.lovable.app`

**Email for Zenith:**
- Cal.com confirmation: All 7 events mapped to website pages
- Links to each service page with booking integration
- Testing instructions for booking flow
- Username confirmed: `omni-wellness-media-gqj9mj`

**Email for Chad:**
- Technical summary of all fixes
- Team structure confirmation
- Cal.com integration complete
- Image system fully operational
- Files modified list

---

## Expected Outcome

After implementation:
1. **Team images display correctly** - Chad, Feroza, Zenith show actual photos
2. **Professional placeholders** - Tumelo, Warren, Stephen show gradient initials avatars
3. **Premium About page** - Modern, immersive design matching site aesthetics
4. **Updated emails** - Complete drafts with links for Feroza, Zenith, and Chad
5. **Consistent team display** - Homepage preview and About page match
