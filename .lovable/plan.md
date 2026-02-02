
# Fix RoamBuddy Store Issues: Email, PayPal & Bot Behavior

## Issues Identified

### 1. Email Submission 401 Error (High Priority)

**Root Cause**: The `ExitIntentPopup.tsx` component still uses `.upsert()` which fails for anonymous users. The 401 error in console logs (`on_conflict=email`) confirms upsert is being attempted. While RLS policies were added for UPDATE, the upsert operation still fails because anonymous users cannot perform the combined insert-on-conflict-update pattern with Supabase's client.

**Evidence**: 
- Console log: `dtjmhieeywdvhjxqyxad…on_conflict=email:1 Failed to load resource: the server responded with a status of 401`
- `ExitIntentPopup.tsx` line 72 uses `.upsert({ email, source: 'exit_intent_popup', interests: ['uwc_programme'] }, { onConflict: 'email' })`
- Edge function logs show `roambuddy-lead-notification` DID successfully send (shows "Lead notification sent successfully") - so the RoamBuddySalesBot fix is working, but other upsert uses remain

**Fix**: Update `ExitIntentPopup.tsx` to use the same insert-then-update pattern as `RoamBuddySalesBot.tsx`

### 2. PayPal/Card Payment Not Working (High Priority)

**Root Cause Analysis**:

A. **Authentication Required for Order Creation**: The `roambuddy-api` edge function requires JWT authentication for the `createOrder` action (lines 221-260). When an unauthenticated user tries to purchase, they get a 401 error: "Authentication required for order creation".

B. **No Card Payment Option**: The checkout only shows PayPal buttons. User wants card payments via PayPal Hosted Fields.

C. **Currency Configuration**: PAYPAL_OPTIONS in `src/config/paypal.ts` uses `currency: "ZAR"` but the checkout sends USD prices. PayPal may reject due to currency mismatch.

**Fixes Needed**:
- Enable guest checkout by creating a separate unauthenticated order flow
- Add PayPal card payment option using Hosted Fields
- Fix currency configuration to match the order amount currency (USD)

### 3. Bot Suggesting External RoamBuddy Instead of Omni Store (Medium Priority)

**Root Cause**: The AI system prompt in `roambuddy-sales-chat` edge function doesn't instruct the bot to link to the Omni store. The prompt mentions RoamBuddy products generically without directing users to `/roambuddy-store` checkout.

**Fix**: Update the system prompt to:
- Direct users to search/browse products on the Omni store page
- Provide specific product links that open the checkout modal
- Never suggest visiting roambuddy.world directly

### 4. Notification Logging & WhatsApp Automation (User Request)

**Requirements**:
- Log all notification attempts to database for audit
- Add automatic WhatsApp message via API (requires setup)

---

## Implementation Plan

### Phase 1: Fix Email Submission (All Upsert Uses)

**File: `src/components/conversion/ExitIntentPopup.tsx`**

Replace upsert with insert-then-update pattern:
```typescript
// Replace lines 70-72
const { error: insertError } = await supabase
  .from('newsletter_subscribers')
  .insert({ 
    email, 
    source: 'exit_intent_popup', 
    interests: ['uwc_programme'],
    subscribed_at: new Date().toISOString()
  });

if (insertError && insertError.code === '23505') {
  // Email already exists, update instead
  await supabase
    .from('newsletter_subscribers')
    .update({ 
      source: 'exit_intent_popup',
      interests: ['uwc_programme'],
      updated_at: new Date().toISOString()
    })
    .eq('email', email);
}
```

---

### Phase 2: Enable Guest Checkout for RoamBuddy

**Problem**: `createOrder` requires authentication but user wants guest checkout.

**Solution**: Create a separate public order handler that:
1. Does NOT require JWT for guest orders
2. Still validates input thoroughly
3. Stores guest orders with `user_id = null`
4. Awards WellCoins only if user signs up later

**File: `supabase/functions/roambuddy-api/index.ts`**

Add new action `createGuestOrder`:
```typescript
case 'createGuestOrder':
  // No JWT required - guest checkout
  // Validate inputs strictly
  if (!data.customer_email || !data.customer_name || !data.product_id) {
    return error response;
  }
  // Rate limit by IP or email to prevent abuse
  return await handleCreateGuestOrder(data, supabase);
```

**File: `src/components/roambuddy/RoamBuddyCheckoutModal.tsx`**

Update to call `createGuestOrder` instead of `createOrder`:
```typescript
const orderData = {
  action: 'createGuestOrder', // Use guest endpoint
  ...
};
```

---

### Phase 3: Add PayPal Card Payments (Hosted Fields)

**Concept**: PayPal Hosted Fields allows card payments directly on your site, processed by PayPal.

**Required Changes**:

1. **Update PayPal Script Options** (`src/config/paypal.ts`):
```typescript
export const PAYPAL_OPTIONS = {
  clientId: "...",
  currency: "USD", // Change from ZAR to match checkout
  intent: "capture",
  components: "buttons,hosted-fields",
  enableFunding: "card",
  dataClientToken: undefined, // Will be fetched from server
};
```

2. **Create Edge Function for Client Token** (`supabase/functions/paypal-client-token/index.ts`):
```typescript
// Fetches a client token from PayPal for Hosted Fields
const response = await fetch(`${PAYPAL_API_BASE}/v1/identity/generate-token`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
});
return clientToken;
```

3. **Add Hosted Fields Component** (`src/components/roambuddy/PayPalCardFields.tsx`):
```tsx
import { PayPalHostedFieldsProvider, PayPalHostedField, usePayPalHostedFields } from "@paypal/react-paypal-js";

// Render card number, expiry, CVV fields
// On submit, hostedFields.submit() handles capture
```

4. **Integrate into Checkout Modal**:
- Add tabs: "PayPal" | "Credit/Debit Card"
- Fetch client token on mount
- Render PayPalHostedFields for card tab

---

### Phase 4: Fix Bot Behavior - Link to Omni Store

**File: `supabase/functions/roambuddy-sales-chat/index.ts`**

Update `SYSTEM_PROMPT` to include:
```typescript
const SYSTEM_PROMPT = `...

IMPORTANT RULES:
1. When users are ready to buy, direct them to browse plans on our store page at /roambuddy-store
2. NEVER suggest visiting roambuddy.world or any external site
3. Help users search for destinations and recommend specific plans
4. When recommending a plan, mention they can click "Get Connected" on that plan card
5. Example: "I'd recommend our Thailand 5GB plan ($12)! You can find it by searching 'Thailand' on our store page above."

PRODUCT SEARCH:
- Guide users to use the country search bar at the top of the store
- Suggest popular destinations: Thailand, Europe, USA, South Africa
- Explain regional plans cover multiple countries

PURCHASE FLOW:
- After recommendation, say "Just search for [country] above and click 'Get Connected' on the plan you like!"
- Mention guest checkout is available - no account needed
...`;
```

---

### Phase 5: Add Notification Logging Table

**Database Migration**:
```sql
CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL, -- 'lead_capture', 'sale_complete', 'email', 'whatsapp'
  recipient TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  message_id TEXT, -- Resend/WhatsApp message ID
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Admins only
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view notification logs" ON public.notification_logs
  FOR SELECT USING (is_admin(auth.uid()));
```

**Update Edge Functions** to log all notifications:
```typescript
// After sending email/whatsapp
await supabase.from('notification_logs').insert({
  notification_type: 'lead_capture',
  recipient: 'omniwellnessmedia@gmail.com',
  payload: { email, sessionId, ... },
  status: emailResult.error ? 'failed' : 'sent',
  error_message: emailResult.error?.message,
  message_id: emailResult.data?.id
});
```

---

### Phase 6: WhatsApp Automation via Twilio

**Prerequisites**: User needs Twilio account with WhatsApp sandbox or approved number.

**Add Secrets** (if not already configured):
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM` (e.g., `whatsapp:+14155238886`)
- `CHAD_WHATSAPP_TO` (e.g., `whatsapp:+27748315961`)

**Create Edge Function: `supabase/functions/send-whatsapp/index.ts`**:
```typescript
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
await client.messages.create({
  from: TWILIO_WHATSAPP_FROM,
  to: CHAD_WHATSAPP_TO,
  body: `🎯 New RoamBuddy Lead!\n\n📧 ${email}\n🌍 ${destination}\n📅 ${duration}`
});
```

**Integrate into Lead/Sale Notification Functions**:
```typescript
// After Resend email
try {
  await fetch(`${SUPABASE_URL}/functions/v1/send-whatsapp`, {
    method: 'POST',
    body: JSON.stringify({
      type: 'lead',
      email,
      destination,
      duration
    })
  });
} catch (e) {
  console.error('WhatsApp failed (non-blocking):', e);
}
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/paypal-client-token/index.ts` | Generate PayPal client token for Hosted Fields |
| `supabase/functions/send-whatsapp/index.ts` | Send WhatsApp messages via Twilio |
| `src/components/roambuddy/PayPalCardFields.tsx` | Card payment form component |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/conversion/ExitIntentPopup.tsx` | Replace upsert with insert-then-update |
| `supabase/functions/roambuddy-api/index.ts` | Add `createGuestOrder` action for guest checkout |
| `supabase/functions/roambuddy-sales-chat/index.ts` | Update prompt to direct to Omni store |
| `supabase/functions/roambuddy-lead-notification/index.ts` | Add notification logging + WhatsApp call |
| `supabase/functions/roambuddy-sale-notification/index.ts` | Add notification logging + WhatsApp call |
| `src/config/paypal.ts` | Update currency to USD, add hosted-fields component |
| `src/components/roambuddy/RoamBuddyCheckoutModal.tsx` | Use guest order endpoint, add card payment tab |
| `supabase/config.toml` | Add new functions |

## Database Migration

Create `notification_logs` table for audit trail.

---

## Technical Notes

### Guest Checkout Security
- Rate limit by email/IP to prevent abuse
- Validate all inputs server-side
- WellCoins only awarded if user creates account and links order later

### PayPal Hosted Fields Requirements
- Requires `data-client-token` from server
- Must be fetched fresh per checkout session
- Card payments go through PayPal's fraud detection

### WhatsApp Automation
- Twilio sandbox for testing (free)
- Production requires approved WhatsApp Business number (~$0.005/message)
- Messages are async/non-blocking to not slow checkout

---

## Testing Checklist

1. **Email Submission**
   - [ ] Exit intent popup subscribes without 401
   - [ ] RoamBuddy chat captures email successfully
   - [ ] Lead notification email received at `omniwellnessmedia@gmail.com`

2. **Guest Checkout**
   - [ ] Can purchase without login
   - [ ] Order saved to database with `user_id = null`
   - [ ] Sale notification sent

3. **Card Payments**
   - [ ] Card tab appears in checkout
   - [ ] Can enter card details
   - [ ] Payment processes successfully

4. **Bot Behavior**
   - [ ] Bot suggests searching on Omni store
   - [ ] Bot never mentions roambuddy.world
   - [ ] Bot provides actionable next steps

5. **Notifications**
   - [ ] All notifications logged to `notification_logs` table
   - [ ] WhatsApp message received by Chad

