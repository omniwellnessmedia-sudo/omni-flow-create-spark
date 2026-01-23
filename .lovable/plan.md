
# Cal.com Integration & Enhanced Admin Dashboard

## Overview
This plan implements a comprehensive Cal.com booking integration, editable time slots for services, enhanced admin dashboard with team management, and feature flags that team members can toggle on/off.

---

## Phase 1: Database Schema Updates

### 1.1 Create Feature Flags Table
```sql
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'general',
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pre-populate feature flags
INSERT INTO public.feature_flags (feature_key, display_name, description, category) VALUES
  ('booking_system', 'Booking System', 'Enable/disable the booking functionality', 'booking'),
  ('wellcoin_payments', 'WellCoin Payments', 'Allow WellCoin as payment method', 'payments'),
  ('tour_bookings', 'Tour Bookings', 'Enable tour booking functionality', 'booking'),
  ('affiliate_products', 'Affiliate Products', 'Show affiliate products in marketplace', 'marketplace'),
  ('provider_portal', 'Provider Portal', 'Enable provider dashboard access', 'access'),
  ('social_scheduler', 'Social Scheduler', 'Enable social media scheduling', 'marketing'),
  ('newsletter', 'Newsletter System', 'Enable newsletter functionality', 'marketing'),
  ('calcom_integration', 'Cal.com Integration', 'Use Cal.com for bookings', 'booking');
```

### 1.2 Create Service Time Slots Table
```sql
CREATE TABLE public.service_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER DEFAULT 60,
  is_available BOOLEAN DEFAULT true,
  max_bookings_per_slot INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_id, day_of_week, start_time)
);

-- Create index for faster lookups
CREATE INDEX idx_service_time_slots_service ON public.service_time_slots(service_id);
CREATE INDEX idx_service_time_slots_day ON public.service_time_slots(day_of_week);
```

### 1.3 Create Cal.com Settings Table
```sql
CREATE TABLE public.calcom_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE,
  calcom_username TEXT,
  calcom_api_key TEXT, -- Encrypted
  event_type_slug TEXT,
  embed_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider_id)
);

-- Global Cal.com settings for Omni services
CREATE TABLE public.calcom_global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.4 Extend Team Member Table
```sql
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
  department TEXT,
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);
```

---

## Phase 2: Admin Dashboard Enhancements

### 2.1 New Admin Tabs Structure
Add to `AdminDashboard.tsx`:
- **Schedule Tab**: Manage time slots for all services
- **Settings Tab**: Feature flags, Cal.com configuration, system settings
- **Team Tab (Enhanced)**: Full team management with permissions

### 2.2 Create Admin Settings Component
**File**: `src/pages/admin/AdminSettings.tsx`

Features:
- Feature Flags Toggle Section
- Cal.com Configuration Panel
- Global Booking Settings
- Email/Notification Settings
- System Maintenance Options

```text
+------------------------------------------+
|  Feature Management                       |
+------------------------------------------+
| [ ] Booking System        ON/OFF Toggle  |
| [ ] WellCoin Payments     ON/OFF Toggle  |
| [ ] Tour Bookings         ON/OFF Toggle  |
| [ ] Cal.com Integration   ON/OFF Toggle  |
+------------------------------------------+
|  Cal.com Settings                         |
+------------------------------------------+
| Username: [omniwellnessmedia]            |
| Default Event: [30-min-consultation]      |
| Embed Style: [Popup / Inline / Modal]    |
+------------------------------------------+
```

### 2.3 Create Admin Schedule Component
**File**: `src/pages/admin/AdminSchedule.tsx`

Features:
- Visual week view of all time slots
- Add/Edit/Delete time slots
- Copy schedule to other days
- Bulk time slot creation
- Service-specific overrides
- Holiday/blocked date management

```text
+------------------------------------------+
| Service: [Dropdown - All Services]       |
+------------------------------------------+
|        MON   TUE   WED   THU   FRI   SAT |
| 09:00  [x]   [x]   [x]   [x]   [x]   [ ] |
| 10:00  [x]   [x]   [x]   [x]   [x]   [ ] |
| 11:00  [x]   [x]   [x]   [x]   [x]   [ ] |
| 14:00  [x]   [x]   [x]   [x]   [x]   [ ] |
| 15:00  [x]   [x]   [x]   [x]   [x]   [ ] |
+------------------------------------------+
| [+ Add Time Slot] [Copy to All Days]     |
+------------------------------------------+
```

### 2.4 Enhanced Team Management Component
**File**: `src/pages/admin/AdminTeamManagement.tsx`

Features:
- View all team members
- Add new team members (with invite)
- Edit roles and permissions
- Deactivate/reactivate accounts
- Activity log per member
- Permission matrix editor

```text
+------------------------------------------+
| Team Members                    [+ Add]   |
+------------------------------------------+
| Chad Cupido    | Admin    | Active | ... |
| Zenith         | Editor   | Active | ... |
| Feroza         | Editor   | Active | ... |
| Tumelo         | Admin    | Active | ... |
+------------------------------------------+
| Permission Groups                         |
+------------------------------------------+
| [ ] Content Management                    |
| [ ] Product Management                    |
| [ ] Booking Management                    |
| [ ] Feature Flag Access                   |
| [ ] Team Management                       |
+------------------------------------------+
```

---

## Phase 3: Cal.com Integration

### 3.1 Cal.com Booking Component
**File**: `src/components/booking/CalComBooking.tsx`

Features:
- Embed Cal.com scheduling widget
- Support for inline, popup, and modal modes
- Pass customer data to Cal.com
- Listen for booking confirmation events
- Fallback to native booking if Cal.com unavailable

```typescript
interface CalComBookingProps {
  eventTypeSlug: string;
  calUsername: string;
  prefillData?: {
    name?: string;
    email?: string;
    notes?: string;
  };
  embedMode: 'inline' | 'popup' | 'modal';
  onBookingSuccess?: (data: BookingData) => void;
}
```

### 3.2 Update Service Pages
Replace current booking buttons with Cal.com integration:

**Pattern for Service Pages**:
```tsx
// Check feature flag
const { isEnabled } = useFeatureFlag('calcom_integration');

{isEnabled ? (
  <CalComBooking 
    eventTypeSlug="30-min-consultation"
    calUsername="omniwellnessmedia"
    embedMode="popup"
  />
) : (
  <Button onClick={handleMailtoBooking}>
    Book Session
  </Button>
)}
```

### 3.3 Cal.com Event Types to Create
The team should create these event types in Cal.com:
- `discovery-call` (30 min) - Free initial consultation
- `social-media-strategy` (60 min) - Social media consultation
- `web-consultation` (45 min) - Web development discussion
- `media-production` (60 min) - Media production planning
- `business-strategy` (60 min) - Business consulting session
- `wellness-session` (60 min) - General wellness booking

---

## Phase 4: Feature Flag System

### 4.1 Feature Flag Hook
**File**: `src/hooks/useFeatureFlags.ts`

```typescript
interface FeatureFlag {
  key: string;
  displayName: string;
  isEnabled: boolean;
  category: string;
}

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all feature flags
  // Real-time subscription for updates
  // Helper functions: isEnabled(key), toggleFlag(key)
};

export const useFeatureFlag = (key: string) => {
  const { flags } = useFeatureFlags();
  return flags.find(f => f.key === key);
};
```

### 4.2 Feature Flag Gate Component
**File**: `src/components/FeatureGate.tsx`

```typescript
interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Usage:
<FeatureGate feature="booking_system">
  <BookingCalendar {...props} />
</FeatureGate>
```

---

## Phase 5: Files to Create/Modify

### New Files
1. `src/pages/admin/AdminSettings.tsx` - Feature flags & Cal.com config
2. `src/pages/admin/AdminSchedule.tsx` - Time slot management
3. `src/pages/admin/AdminTeamManagement.tsx` - Enhanced team management
4. `src/components/booking/CalComBooking.tsx` - Cal.com embed component
5. `src/hooks/useFeatureFlags.ts` - Feature flag hook
6. `src/components/FeatureGate.tsx` - Feature gating component
7. `supabase/migrations/XXXX_feature_flags_and_calcom.sql` - Database migration

### Files to Modify
1. `src/pages/AdminDashboard.tsx` - Add new tabs (Schedule, Settings)
2. `src/pages/SocialMediaStrategy.tsx` - Integrate Cal.com
3. `src/pages/WebDevelopment.tsx` - Integrate Cal.com
4. `src/pages/MediaProduction.tsx` - Integrate Cal.com
5. `src/pages/BusinessConsulting.tsx` - Integrate Cal.com
6. `src/pages/programs/UWCHumanAnimalProgram.tsx` - Integrate Cal.com
7. `src/components/booking/BookingCalendar.tsx` - Add time slot fetching

---

## Phase 6: Implementation Priority

### Sprint 1: Foundation (Week 1)
1. Create database migrations
2. Build feature flag system
3. Create AdminSettings component

### Sprint 2: Schedule Management (Week 1-2)
4. Build AdminSchedule component
5. Update BookingCalendar to use database slots
6. Create time slot CRUD operations

### Sprint 3: Cal.com Integration (Week 2)
7. Build CalComBooking component
8. Update all service pages
9. Test Cal.com embed functionality

### Sprint 4: Team Management (Week 2-3)
10. Build AdminTeamManagement
11. Implement permission system
12. Add activity logging

---

## Technical Notes

### Cal.com Embed Script
Add to `index.html` or load dynamically:
```html
<script type="text/javascript">
  (function (C, A, L) { 
    let p = function (a, ar) { a.q.push(ar); }; 
    let d = C.document; 
    C.Cal = C.Cal || function () { 
      let cal = C.Cal; 
      let ar = arguments; 
      if (!cal.loaded) { 
        cal.ns = {}; 
        cal.q = cal.q || []; 
        d.head.appendChild(d.createElement("script")).src = A; 
        cal.loaded = true; 
      } 
      if (ar[0] === L) { 
        const api = function () { p(api, arguments); }; 
        const namespace = ar[1]; 
        api.q = api.q || []; 
        typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); 
        return; 
      } 
      p(cal, ar); 
    }; 
  })(window, "https://app.cal.com/embed/embed.js", "init");
</script>
```

### Security Considerations
- Cal.com API keys stored encrypted in database
- Feature flags only editable by admin role
- Team permissions validated server-side via RLS
- All booking data synced back to Supabase

### Mobile Responsiveness
- Cal.com embed is fully responsive
- Admin dashboard tabs use horizontal scroll on mobile
- Time slot grid adapts to mobile with single-column view
- Touch-friendly toggle switches (min 44px)

---

## Summary

| Component | Description | Priority |
|-----------|-------------|----------|
| Feature Flags | Enable/disable platform features | High |
| Admin Settings | Centralized configuration panel | High |
| Cal.com Integration | Professional booking experience | High |
| Time Slot Management | Admin-editable availability | Medium |
| Team Management | Enhanced permissions system | Medium |
| Activity Logging | Track team member actions | Low |

This implementation will give the Omni team full control over platform features, professional Cal.com-powered booking, and a scalable team management system.
