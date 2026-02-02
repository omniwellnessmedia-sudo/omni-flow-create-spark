
# Add Sale Confirmation Notifications (Email + WhatsApp)

## Overview
When a RoamBuddy eSIM sale is completed (payment confirmed), automatically send:
1. **Email notification** to `omniwellnessmedia@gmail.com` with full purchase details
2. **WhatsApp notification** to Chad with a quick summary

## Current Sale Flow
```
User selects eSIM → Checkout → PayPal payment → createOrder API → Order saved to DB → Success screen
```

## New Sale Flow
```
User selects eSIM → Checkout → PayPal payment → createOrder API → Order saved to DB 
                                                       ↓
                                          Send sale notification
                                                       ↓
                                          ┌─────────────────────┐
                                          │ Email to Omni       │
                                          │ WhatsApp to Chad    │
                                          └─────────────────────┘
                                                       ↓
                                               Success screen
```

## Implementation Approach

### Phase 1: Create Sale Notification Edge Function

**New File:** `supabase/functions/roambuddy-sale-notification/index.ts`

This function will be called after successful order completion and will:
1. Send a detailed email via Resend to `omniwellnessmedia@gmail.com`
2. Send a WhatsApp message to Chad

**Email Content:**
```
Subject: 💰 New RoamBuddy Sale: $25.00 USD

━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 ESIM SALE CONFIRMED
━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Product: South Africa eSIM - 5GB
🌍 Destination: South Africa
💰 Amount: $25.00 USD
📧 Customer: john@example.com
👤 Name: John Doe

━━━ ORDER DETAILS ━━━

Order ID: RB-1738489123456
Status: Completed
Payment: PayPal
Date: 2 Feb 2026, 10:30 AM

━━━━━━━━━━━━━━━━━━━━━━━━━

Commission Earned: ~$2.50 (estimated)
View in Dashboard: /admin/roambuddy-sales
```

### Phase 2: WhatsApp Integration Options

For WhatsApp, we have three options based on complexity and cost:

**Option A: WhatsApp Business API (Complex)**
- Requires Facebook Business verification
- Needs a dedicated phone number
- Template messages must be approved
- Best for high-volume, production use

**Option B: WhatsApp Click-to-Chat via Email (Recommended)**
- Include a pre-formatted WhatsApp link in the email
- Chad clicks the link → Opens WhatsApp with pre-filled message
- Zero setup, works immediately
- Format: `https://wa.me/27XXXXXXXXX?text=New%20Sale%3A%20...`

**Option C: Twilio WhatsApp Sandbox (Quick Setup)**
- Twilio provides WhatsApp messaging via their API
- Sandbox mode for testing (free)
- Production mode costs ~$0.005/message
- Requires Twilio account and API keys

**Recommended: Option B (Click-to-Chat in Email)**

This approach:
- Works immediately with no additional setup
- Costs nothing
- Chad receives email → taps WhatsApp link → sees notification in WhatsApp
- Can upgrade to proper API later if volume justifies it

### Phase 3: Integrate into Order Flow

**Modify:** `supabase/functions/roambuddy-api/index.ts`

After successful order completion (around line 815), call the notification function:

```typescript
// After order is saved to database
// Send sale notification (async, don't block order completion)
fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/roambuddy-sale-notification`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
  },
  body: JSON.stringify({
    orderId: roambuddyOrderId,
    customerEmail: orderData.customer_email,
    customerName: orderData.customer_name,
    productName: orderData.product_name,
    amount: orderData.amount,
    currency: orderData.currency,
    destination: orderData.destination,
    completedAt: new Date().toISOString()
  })
});
```

## Files to Create

1. **`supabase/functions/roambuddy-sale-notification/index.ts`**
   - Receives order details
   - Formats and sends email via Resend
   - Includes WhatsApp click-to-chat link
   - Logs sale to console for debugging

## Files to Modify

1. **`supabase/functions/roambuddy-api/index.ts`**
   - Add call to sale notification after order completion
   - Non-blocking (fire and forget) to not slow down checkout

2. **`supabase/config.toml`**
   - Add new `roambuddy-sale-notification` function

## Email Notification Structure

The email will include:

| Section | Content |
|---------|---------|
| Header | Sale confirmation banner with amount |
| Product Info | Name, destination, data amount, validity |
| Customer Info | Name, email |
| Order Info | Order ID, status, payment method, timestamp |
| Quick Actions | View in Dashboard, WhatsApp link to open chat |
| Commission | Estimated commission earned |

## WhatsApp Click-to-Chat Link

Chad's whatsapp number is +27748315961

The email will include a button/link like:
```
📱 Open in WhatsApp
https://wa.me/27XXXXXXXXX?text=🎉%20New%20Sale!%0A%0A📦%20South%20Africa%20eSIM%20-%205GB%0A💰%20$25.00%20USD%0A📧%20john@example.com
```

When Chad clicks this, WhatsApp opens with a pre-filled message he can send to himself or a team group.

## Required Information

Before implementation, I need:

1. **Chad's WhatsApp number** (with country code, e.g., +27XXXXXXXXX)
   - This will be used in the click-to-chat link

## Configuration Update

Add to `supabase/config.toml`:
```toml
[functions.roambuddy-sale-notification]
verify_jwt = false
```

## Testing Plan

1. Complete a test purchase on the RoamBuddy store
2. Verify email arrives at `omniwellnessmedia@gmail.com`
3. Click WhatsApp link in email
4. Confirm it opens WhatsApp with the sale details
5. Check edge function logs for any errors

## Future Enhancements

- **Upgrade to WhatsApp Business API** when sales volume increases
- **Add Slack integration** for team notifications
- **SMS fallback** for urgent notifications
- **Real-time dashboard alerts** with sound

## Technical Notes

- Uses existing Resend API integration (already configured)
- Non-blocking notification to ensure fast checkout experience
- Falls back gracefully if notification fails (order still completes)
- All notifications logged for debugging
