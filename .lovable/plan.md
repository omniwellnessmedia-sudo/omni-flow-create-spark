
# Fix Logo Loading & Update Meet the Team Section

## Issues to Address

### 1. Logo Loading Issue on Homepage
The session replay shows the Omni logo is being loaded at URL:
`https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png`

The issue appears to be with the 2BeWell section fallback images showing SVG placeholders instead of actual products. The `TwoBeWellCTA.tsx` component uses `getTeamImage('zenith')` which maps to `'10.png'` in the 2BeWell products folder - this may be failing to load.

### 2. Meet the Team Section Update
The existing About page team section needs to be updated with the new team structure from Chad's PDF document.

---

## Technical Implementation

### File 1: `src/lib/imageHelpers.ts`
Update the `handleImageError` function to use the Omni logo as fallback instead of an SVG:

```typescript
// Change line 104 from SVG fallback to Omni logo fallback
img.src = 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png';
```

Also update the `storageMap` to point to correct team images or use Omni logo:

```typescript
// Team - using Omni logo as placeholder until real photos uploaded
'zenith': '../partner-logos%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png',
'feroza': '../partner-logos%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png',
'chad': '../partner-logos%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png',
'tumelo': '../partner-logos%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png',
'warren': '../partner-logos%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png',
'stephen': '../partner-logos%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png',
```

### File 2: `src/pages/About.tsx` (Lines 61-92)
Update the team array with new team structure from Chad's document:

```typescript
const team = [
  {
    name: "Chad Cupido",
    role: "Founding Director",
    image: IMAGES.omni.logo, // Use Omni logo as placeholder
    description: "Chad is the Founding Director responsible for overall vision, strategy, brand direction, and platform purpose. He leads Omni as a conscious media and commerce ecosystem, with extensive experience across media, wellness, education, tourism, and community development.",
    location: "Muizenberg, Cape Town"
  },
  {
    name: "Tumelo Thabo Ncube",
    role: "Technical Founder | Platform & Systems Architecture",
    image: IMAGES.omni.logo, // Use Omni logo as placeholder
    description: "Tumelo is the Technical Founder responsible for designing and building the platform's technical architecture, digital systems, and infrastructure. He ensures Omni is technically robust, secure, and scalable.",
    location: "Cape Town, South Africa"
  },
  {
    name: "Zenith Yasin",
    role: "Operations & Platform Coordination Lead",
    image: IMAGES.omni.logo, // Use Omni logo as placeholder
    description: "Zenith supports operations, coordination, and execution across Omni Wellness Media. She ensures content workflows, partnerships, and administrative processes remain organised and aligned with brand values.",
    location: "Cape Town, South Africa"
  },
  {
    name: "Feroza Begg",
    role: "Operations & Administration Support",
    image: IMAGES.omni.logo, // Use Omni logo as placeholder
    description: "Feroza supports through administration, coordination, content support, and operational follow-through. She assists with platform tasks, communications, documentation, and campaign execution.",
    location: "Western Cape, South Africa"
  },
  {
    name: "Warren Cramer",
    role: "Senior Financial Advisor & Governance Oversight",
    image: IMAGES.omni.logo, // Use Omni logo as placeholder
    description: "Warren provides senior financial oversight and governance guidance, supporting leadership in ensuring financial sustainability, compliance, and sound decision-making.",
    location: "Cape Town, South Africa"
  },
  {
    name: "Stephen Bosch",
    role: "Financial Operations & Systems Lead",
    image: IMAGES.omni.logo, // Use Omni logo as placeholder
    description: "Stephen is the operational financial lead, embedded in day-to-day financial systems, reporting, and execution. He ensures accurate bookkeeping and financial visibility.",
    location: "Cape Town, South Africa"
  }
];
```

### File 3: `src/components/sections/TwoBeWellCTA.tsx` (Lines 191-214)
Fix the image sources to use correct 2BeWell product images directly instead of the broken `getTeamImage()` function:

```typescript
{/* Right: Product showcase (bento grid) */}
<div className="grid grid-cols-2 gap-4">
  <div className="col-span-2 aspect-[16/9] bg-white rounded-3xl overflow-hidden shadow-lg">
    <img 
      src={IMAGES.twoBeWell.hero}
      alt="2BeWell Natural Products Collection"
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      onError={(e) => { e.currentTarget.src = IMAGES.omni.logo; }}
    />
  </div>
  <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-md">
    <img 
      src={IMAGES.twoBeWell.bodyButter}
      alt="2BeWell Handcrafted Products"
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      onError={(e) => { e.currentTarget.src = IMAGES.omni.logo; }}
    />
  </div>
  <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-md">
    <img 
      src={IMAGES.twoBeWell.faceSerum}
      alt="2BeGlow Face Serum"
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      onError={(e) => { e.currentTarget.src = IMAGES.omni.logo; }}
    />
  </div>
</div>
```

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/lib/imageHelpers.ts` | Update fallback to use Omni logo instead of SVG |
| `src/pages/About.tsx` | Update team array with 6 new members from Chad's PDF |
| `src/components/sections/TwoBeWellCTA.tsx` | Fix product images to use IMAGES.twoBeWell directly |

---

## New Team Structure (from Chad's PDF)

| # | Name | Role |
|---|------|------|
| 1 | Chad Cupido | Founding Director |
| 2 | Tumelo Thabo Ncube | Technical Founder |
| 3 | Zenith Yasin | Operations & Platform Coordination Lead |
| 4 | Feroza Begg | Operations & Administration Support |
| 5 | Warren Cramer | Senior Financial Advisor & Governance Oversight |
| 6 | Stephen Bosch | Financial Operations & Systems Lead |

---

## Image Strategy

Since actual team photos are not yet available in Supabase storage:
1. Use Omni logo (`IMAGES.omni.logo`) as placeholder for all team members
2. Update `handleImageError` function to fallback to Omni logo
3. Once photos are uploaded to Supabase, update the image references

This approach ensures:
- No broken images displayed
- Consistent professional appearance with Omni branding
- Easy to update once real photos are available
