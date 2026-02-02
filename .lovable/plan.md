

# Add Customer eSIM Confirmation Email

## Problem Analysis

Currently, when a customer purchases an eSIM:
1. **Admin gets notified** - Email to omniwellnessmedia@gmail.com with sale details
2. **Customer gets nothing** - No email with their eSIM activation details

The UI promises to send details to the customer's email (line 416 and 929 in the checkout modal), but this hasn't been implemented.

## What Needs to Happen

### 1. Pass eSIM Activation Data to Notification Function

Currently, the `roambuddy-api` sends basic order info to `roambuddy-sale-notification` but **omits** the critical activation data:

**Current payload (lines 874-883):**
```typescript
body: JSON.stringify({
  orderId: `RB-${Date.now()}`,
  customerEmail: orderData.customer_email,
  customerName: orderData.customer_name,
  productName: orderData.product_name,
  amount: orderData.amount,
  currency: orderData.currency,
  destination: orderData.destination,
  completedAt: new Date().toISOString()
  // MISSING: iccid, qr_code, qrcode_url
})
```

**Required:** Add the eSIM details from `completeData`:
```typescript
iccid: completeData.iccid,
qrCode: completeData.qr_code,        // LPA activation code
qrCodeUrl: completeData.qrcode_url,  // QR image URL
apn: completeData.apn,
dataRoaming: completeData.data_roaming
```

### 2. Update Notification Function to Send Customer Email

The `roambuddy-sale-notification` function needs to:
1. Accept the new eSIM fields
2. Send a **second email** to the customer with:
   - QR code image embedded
   - LPA activation code as text backup
   - Step-by-step installation instructions
   - APN settings and data roaming reminder
   - ICCID for reference

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/roambuddy-api/index.ts` | Include eSIM details (iccid, qr_code, qrcode_url, apn) in notification payload |
| `supabase/functions/roambuddy-sale-notification/index.ts` | Add customer email with eSIM activation details |

---

## Technical Implementation

### Update 1: roambuddy-api - Pass eSIM Details

Add the activation data to the notification payload (around line 874):

```typescript
body: JSON.stringify({
  orderId: `RB-${Date.now()}`,
  customerEmail: orderData.customer_email,
  customerName: orderData.customer_name,
  productName: orderData.product_name,
  amount: orderData.amount,
  currency: orderData.currency,
  destination: orderData.destination,
  completedAt: new Date().toISOString(),
  // NEW: eSIM activation details
  iccid: completeData?.iccid,
  qrCode: completeData?.qr_code,          // LPA string
  qrCodeUrl: completeData?.qrcode_url,    // QR image URL
  apn: completeData?.apn || 'plus',
  dataRoaming: completeData?.data_roaming || 'ON'
})
```

### Update 2: roambuddy-sale-notification - Customer Email

Add new fields to the interface and send a branded customer email:

```typescript
interface SaleNotificationRequest {
  // ... existing fields ...
  // NEW
  iccid?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  apn?: string;
  dataRoaming?: string;
}
```

Create a customer-specific HTML template with:
- Branded header with RoamBuddy/Omni Wellness branding
- QR code image prominently displayed
- Manual activation code as backup
- Step-by-step installation instructions for iPhone and Android
- APN settings and data roaming reminder
- Order summary

Send to customer:
```typescript
// Send customer confirmation email
await resend.emails.send({
  from: 'RoamBuddy eSIM <onboarding@resend.dev>',
  to: [saleData.customerEmail],
  subject: `🌍 Your eSIM is Ready! - ${saleData.productName}`,
  html: customerEmailHtml,
});
```

---

## Customer Email Content Design

The customer email should include:

**Header:**
- "Your eSIM is Ready for ${destination}!"
- Warm, travel-focused messaging

**QR Code Section:**
```text
📱 SCAN TO ACTIVATE
[QR Code Image]
Or enter manually: LPA:1$smdp.io$K2-2UIKO8-12MM42P
```

**Installation Instructions:**
```text
📲 HOW TO INSTALL YOUR eSIM

iPhone (iOS 12.1+):
1. Go to Settings → Cellular → Add eSIM
2. Tap "Use QR Code" and scan the code above
3. Follow the prompts to activate

Android:
1. Go to Settings → Network & Internet → SIMs
2. Tap "Add eSIM" or "Download eSIM"
3. Scan the QR code above

⚠️ IMPORTANT:
• Install BEFORE you travel (while on WiFi)
• Enable Data Roaming when you arrive
• APN: plus (usually auto-configured)
```

**Order Summary:**
- Product name, data amount, validity
- ICCID for reference
- Support contact

---

## Testing Checklist

After implementation:

- [ ] Complete a test purchase
- [ ] Verify admin email still arrives at omniwellnessmedia@gmail.com
- [ ] Verify customer email arrives at the provided email address
- [ ] Confirm QR code image displays correctly in email
- [ ] Confirm LPA activation code is correct
- [ ] Test QR code can be scanned (or validate activation code format)
- [ ] Verify instructions are clear and accurate

---

## Summary

This enhancement adds a customer confirmation email with all the information needed to activate their eSIM - fulfilling the promise made in the checkout UI. The admin notification continues to work as before, but now the customer also receives their activation details directly to their inbox.

