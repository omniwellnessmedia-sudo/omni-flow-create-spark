
# Fix PayPal Card Payment for South African Users

## Problem Summary

When clicking the "Credit/Debit Card" tab in RoamBuddy checkout, PayPal opens its own popup form that:
- Defaults to US address format (US flag, State dropdown)
- Requires US phone format (+1 prefix)
- Won't accept South African addresses or +27 phone numbers

This is visible in the screenshot where the form shows a US flag country selector and "+1" phone field with validation errors.

## Root Cause

The current code uses `PayPalButtons` with `fundingSource="card"` which opens PayPal's hosted card form. This form has strict regional validation based on the `locale: "en_US"` setting and lacks configuration to skip billing address collection for digital goods.

## Solution: Skip Billing Address for Digital Goods

Since eSIMs are **digital products** that don't require shipping, we can configure PayPal to skip the billing address entirely. This eliminates the South African address/phone validation issue completely.

### Technical Changes

#### 1. Update PayPal Order Creation

Modify the `createOrder` callback in `RoamBuddyCheckoutModal.tsx` to include `application_context`:

```typescript
createOrder={(data, actions) => {
  return actions.order.create({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        value: finalPriceUSD.toFixed(2),
        currency_code: 'USD',
      },
      description: `${product.name} - ${product.destination}`,
    }],
    application_context: {
      shipping_preference: 'NO_SHIPPING', // Skip shipping/billing address
      user_action: 'PAY_NOW', // Show "Pay Now" instead of "Continue"
      brand_name: 'Omni Wellness - RoamBuddy', // Show our brand
    },
  });
}}
```

#### 2. Update PayPal Options Locale

Change locale from `en_US` to a more neutral setting or allow auto-detection:

**File: `src/config/paypal.ts`**
```typescript
export const PAYPAL_OPTIONS = {
  clientId: PAYPAL_CONFIG.clientId,
  currency: PAYPAL_CONFIG.currency,
  intent: PAYPAL_CONFIG.intent,
  // Remove hardcoded locale to let PayPal auto-detect user's region
  // Or set to 'en_ZA' for South African context
  components: "buttons,card-fields",
};
```

#### 3. Alternative: Use PayPal CardFields Component (Recommended for Full Control)

For complete control over the card payment experience, implement PayPal's CardFields API which embeds card inputs directly on your page:

**New Component: `src/components/roambuddy/PayPalCardPayment.tsx`**

This component would:
- Render card number, expiry, CVV fields directly on the page
- Handle validation client-side
- Not require any billing address for digital goods
- Use PayPal's secure tokenization

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/roambuddy/RoamBuddyCheckoutModal.tsx` | Add `application_context` with `shipping_preference: 'NO_SHIPPING'` to both PayPal button configs |
| `src/config/paypal.ts` | Remove `locale: "en_US"` to allow PayPal auto-detection |

---

## Implementation Details

### Phase 1: Quick Fix (Immediate)

Add `application_context` to both `createOrder` functions in the checkout modal:

For **PayPal tab** (lines 639-652):
```typescript
return actions.order.create({
  intent: 'CAPTURE',
  purchase_units: [{
    amount: { value: priceValue, currency_code: 'USD' },
    description: `${product.name} - ${product.destination}`,
  }],
  application_context: {
    shipping_preference: 'NO_SHIPPING',
    user_action: 'PAY_NOW',
    brand_name: 'Omni Wellness - RoamBuddy',
  },
});
```

For **Card tab** (lines 671-684) - same changes.

### Phase 2: Remove US Locale (Immediate)

Update `src/config/paypal.ts`:
```typescript
export const PAYPAL_OPTIONS = {
  clientId: PAYPAL_CONFIG.clientId,
  currency: PAYPAL_CONFIG.currency,
  intent: PAYPAL_CONFIG.intent,
  // Remove locale to let PayPal auto-detect user's region
  components: "buttons,card-fields",
};
```

---

## Expected Outcome

After implementation:
1. PayPal will not show billing address form for card payments
2. Users only need to enter card details (number, expiry, CVV)
3. South African users can complete checkout without address/phone validation issues
4. The checkout will feel faster and simpler

---

## Testing Checklist

1. **PayPal Button Payment**
   - [ ] Click PayPal tab
   - [ ] Complete payment with PayPal account
   - [ ] Verify no billing address required

2. **Card Payment**
   - [ ] Click Credit/Debit Card tab
   - [ ] Enter card details
   - [ ] Verify NO billing address or phone field appears
   - [ ] Complete payment successfully

3. **South African User Test**
   - [ ] Attempt checkout with SA card
   - [ ] Verify no +27 phone validation issues
   - [ ] Verify order completes successfully

---

## Alternative Solution (If Above Doesn't Work)

If PayPal still requires billing address despite `NO_SHIPPING`, we can implement **PayPal CardFields** which gives us full control:

```tsx
import { PayPalCardFieldsProvider, PayPalCardFieldsForm, usePayPalCardFields } from "@paypal/react-paypal-js";

// Renders card fields directly on page - no popup
<PayPalCardFieldsProvider
  createOrder={createOrderCallback}
  onApprove={onApproveCallback}
>
  <PayPalCardFieldsForm />
  <SubmitPayment />
</PayPalCardFieldsProvider>
```

This approach embeds the card form directly in your page without any PayPal popup, giving you complete control over the user experience.
