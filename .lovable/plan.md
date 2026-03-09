

# Complete Build Audit & Fix Plan — Launch Phase

## Issues Found

### Critical: Broken Links (accessible from navigation/footer/hero)

| Link | Where Used | Problem |
|------|-----------|---------|
| `/wellness-community` | Footer, HeroSection (4 community items), FeaturedProjectsSection, App.tsx | Page exists but is a social community hub with auth-dependent features — not a polished public page |
| `/ai-tools` | Footer, old MegaNavigation, SiteHeader | Route does NOT exist — leads to 404 |
| `/travel-well-connected-store` | UnifiedNavigation Store dropdown, MegaNavigation Store dropdown, SiteHeader, RecruitmentJourney, useAppTour | Should redirect to `/roambuddy-store` or be consolidated |

### Navigation Inconsistencies
- **UnifiedNavigation** Store dropdown still links to `/travel-well-connected-store` (line 99)
- **MegaNavigation** Store dropdown still links to `/travel-well-connected-store` (line 47)
- **Old MegaNavigation** (`src/components/MegaNavigation.tsx`) and **SiteHeader** (`src/components/SiteHeader.tsx`) — legacy nav components with stale links
- Footer links to `/ai-tools` (line 261) and `/wellness-community` (line 278)

### HeroSection Community Items
4 items in `communityItems` array link to `/wellness-community` — these should point to real, functional pages instead (tours, about, blog, etc.)

### Travel Well Connected Store Mobile Issues
- Hero text `text-5xl md:text-7xl` is too large on small screens — needs `text-3xl sm:text-4xl md:text-5xl lg:text-7xl`
- Tab buttons overlap on small screens (partially fixed with `text-xs sm:text-base` but container needs `max-w-full`)

## Plan

### 1. Fix All Broken `/wellness-community` Links (5 files)
Redirect community items to functional pages:
- **HeroSection.tsx**: Change 4 community items from `/wellness-community` to relevant live pages (`/about`, `/tours-retreats`, `/blog`, `/contact`)
- **FeaturedProjectsSection.tsx**: Change "Community Outreach" href to `/about` or `/csr-impact`
- **Footer.tsx**: Change "Community" link to `/blog` (active, functional page)

### 2. Fix All Stale `/travel-well-connected-store` Links (4 files)
- **UnifiedNavigation.tsx** line 99: Change to `/roambuddy-store`
- **MegaNavigation.tsx** line 47: Change to `/roambuddy-store`
- **SiteHeader.tsx** line 168: Change to `/roambuddy-store`
- **RecruitmentJourney.tsx** line 105: Change to `/roambuddy-store`
- **App.tsx** line 189: Add redirect `<Navigate to="/roambuddy-store" replace />`

### 3. Remove `/ai-tools` Dead Link (2 files)
- **Footer.tsx** line 261: Remove "AI Wellness Tools" link (page commented out)
- **Old MegaNavigation.tsx** lines 61-66: Remove AI Tools section

### 4. Fix Travel Well Connected Store Mobile (1 file)
- **TravelWellConnectedStore.tsx**: Fix hero heading responsive sizing (`text-3xl sm:text-4xl md:text-5xl lg:text-7xl`)

### 5. Consolidate Store Navigation Labels
- Rename "Travel Well Connected" to "ROAM eSIM Store" everywhere to match brand identity and avoid confusion with two store entries in nav

## Files Modified (8 files)

| File | Changes |
|------|---------|
| `src/components/sections/HeroSection.tsx` | Redirect 4 `/wellness-community` links to live pages |
| `src/components/sections/FeaturedProjectsSection.tsx` | Redirect community project href |
| `src/components/Footer.tsx` | Remove `/ai-tools` link, change `/wellness-community` to `/blog` |
| `src/components/navigation/UnifiedNavigation.tsx` | Consolidate store links to `/roambuddy-store` |
| `src/components/navigation/MegaNavigation.tsx` | Consolidate store links to `/roambuddy-store` |
| `src/components/SiteHeader.tsx` | Update store link |
| `src/App.tsx` | Add redirect from `/travel-well-connected-store` to `/roambuddy-store` |
| `src/pages/TravelWellConnectedStore.tsx` | Fix mobile hero text sizing |

