
# Fix RoamBuddy Sales Bot Email Submission + Add Discount & WellCoins Integration

## Issues Identified

### Issue 1: Email Submission 401 Error
The email capture in the RoamBuddy chat fails with a 401 error when trying to save to `newsletter_subscribers`. 

**Root Cause**: The frontend uses `upsert` which requires both INSERT and UPDATE permissions. While INSERT policy allows anonymous access, the table requires authentication for UPDATE operations. The anonymous Supabase client cannot perform upsert without proper RLS policies.

**Solution**: Add an UPDATE policy for the `newsletter_subscribers` table that allows unauthenticated updates on conflict, or change the frontend to use a simple INSERT with conflict handling.

### Issue 2: Coupon Codes Not Functional
The checkout modal shows a coupon code input field, but clicking "Apply" does nothing - it's purely UI with no backend logic.

**Solution**: Create a `discount_codes` table and implement coupon validation logic.

### Issue 3: WellCoins Not Integrated
The WellCoins loyalty system exists but isn't connected to RoamBuddy purchases.

**Solution**: Award WellCoins on completed purchases and allow WellCoins redemption at checkout.

---

## Implementation Plan

### Phase 1: Fix Email Submission (Critical)

**Database Changes:**
Create an UPDATE policy on `newsletter_subscribers` that allows updates when email matches:

```sql
CREATE POLICY "Allow upsert on newsletter_subscribers" 
ON public.newsletter_subscribers 
FOR UPDATE 
USING (true) 
WITH CHECK (true);
```

Alternatively, also add similar policy for `chatbot_conversations`:

```sql
CREATE POLICY "Allow public update for chatbot by session" 
ON public.chatbot_conversations 
FOR UPDATE 
USING (true);
```

**Files Modified:**
- Database migration to add UPDATE policies

---

### Phase 2: Implement Discount Code System

**New Database Table: `discount_codes`**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| code | text | Unique discount code (e.g., "ROAM10") |
| discount_type | text | 'percentage' or 'fixed' |
| discount_value | numeric | Amount (10 for 10%, or 5 for $5 off) |
| min_order_amount | numeric | Minimum order to apply |
| max_uses | integer | Total allowed uses (null = unlimited) |
| current_uses | integer | How many times used |
| valid_from | timestamp | Start date |
| valid_until | timestamp | Expiry date |
| applicable_products | text[] | Product IDs or null for all |
| wellcoins_bonus | integer | Extra WellCoins when code used |
| created_at | timestamp | Creation date |

**New Edge Function: `validate-discount-code`**
- Validates code exists and is active
- Checks usage limits
- Returns discount amount and WellCoins bonus

**Frontend Changes:**
Update `RoamBuddyCheckoutModal.tsx`:
- Add state for discount code validation
- Call edge function on "Apply" button click
- Show discount applied in order summary
- Adjust PayPal order amount with discount

---

### Phase 3: WellCoins Integration

**WellCoins Earning on Purchase:**
After successful RoamBuddy order, award WellCoins based on purchase amount:
- Base rate: 1 WellCoin per $1 spent
- Bonus: 10 WellCoins for first purchase
- Code bonus: Additional WellCoins if discount code includes bonus

**Files Modified:**
- `supabase/functions/roambuddy-api/index.ts` - After order completion, create transaction in `transactions` table
- `src/components/roambuddy/RoamBuddyCheckoutModal.tsx` - Show WellCoins earned in success screen

**New Feature: WellCoins Redemption (Future)**
- Allow partial payment with WellCoins
- Display user's WellCoins balance at checkout
- Requires user authentication

---

## Files to Create

1. **`supabase/functions/validate-discount-code/index.ts`**
   - Validates discount codes
   - Returns discount details and WellCoins bonus

2. **Database migration**
   - Add UPDATE policies for `newsletter_subscribers`
   - Add UPDATE policies for `chatbot_conversations`
   - Create `discount_codes` table
   - Insert default discount codes (ROAM10, WELCOME5, etc.)

## Files to Modify

1. **`src/components/roambuddy/RoamBuddySalesBot.tsx`**
   - Change upsert to INSERT with ON CONFLICT handling via edge function
   - Better error handling

2. **`src/components/roambuddy/RoamBuddyCheckoutModal.tsx`**
   - Add discount code validation state
   - Connect "Apply" button to edge function
   - Show discount in order summary
   - Update PayPal order creation with discounted price
   - Show WellCoins earned after purchase

3. **`supabase/functions/roambuddy-api/index.ts`**
   - After successful order, insert WellCoins transaction
   - Include discount tracking in order notes

4. **`supabase/config.toml`**
   - Add new `validate-discount-code` function

---

## Discount Tracking Benefits

1. **Marketing Attribution**: Track which codes drive sales
2. **Influencer Programs**: Give unique codes to partners
3. **Campaign Effectiveness**: Measure promotion ROI
4. **Customer Retention**: Reward repeat customers
5. **WellCoins Bonus**: Incentivize code usage with extra loyalty points

---

## Default Discount Codes to Create

| Code | Type | Value | WellCoins Bonus | Description |
|------|------|-------|-----------------|-------------|
| ROAM10 | percentage | 10% | 5 | General 10% off |
| WELCOME | fixed | $5 | 10 | New customer discount |
| WELLNESS | percentage | 15% | 15 | Wellness community special |
| OMNI25 | percentage | 25% | 25 | VIP/launch discount |
| FIRSTTRIP | percentage | 20% | 20 | First-time travelers |

---

## Testing Plan

1. **Email Submission**
   - Open chat on `/roambuddy-store`
   - Complete conversation until email capture appears
   - Submit email
   - Verify no 401 error
   - Check `newsletter_subscribers` for new entry
   - Verify notification email sent

2. **Discount Codes**
   - Start checkout process
   - Enter valid code (ROAM10)
   - Verify discount applied to total
   - Complete purchase with PayPal
   - Verify discounted amount charged

3. **WellCoins**
   - Complete a purchase (with or without discount)
   - Check `transactions` table for new WellCoin entry
   - Verify balance updated in user profile

---

## Technical Notes

- Discount validation happens server-side for security
- WellCoins awarded only for authenticated users (guest purchases don't earn)
- All discount usage is logged for analytics
- Expired/invalid codes show clear error messages
