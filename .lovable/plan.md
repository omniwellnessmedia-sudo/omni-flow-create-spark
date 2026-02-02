

# Fix RoamBuddy Order Creation Authentication Failure

## Problem Analysis

The checkout crashes after entering address and clicking "Pay" with the error:
```
Order request failed: {"statusCode":500,"message":"Authorization token is Invalid!"}
```

### Root Cause Identified

Looking at the `roambuddy-api` edge function, there's a **token prioritization inconsistency** between different operations:

**For fetching products (line 472)** - works correctly:
```typescript
const token = authData.data?.access_token || authData.access_token || ...
```

**For creating orders (line 767)** - FAILS:
```typescript
const token = authData.data?.auth_token || authData.auth_token || authData.data?.access_token || ...
```

The RoamBuddy API authentication returns both `access_token` and `auth_token`. According to the logs, `access_token` is the correct one to use. The order creation code mistakenly prioritizes `auth_token` first, which may be a different/invalid token type.

### Additional Issues

1. **Exchange Rate API Failing**: The `api.exchangerate-api.io` is returning `ERR_NAME_NOT_RESOLVED` - a DNS issue that causes fallback to hardcoded rates. This is a warning but doesn't block the payment.

2. **FeatureGateClients Warning**: This is a PayPal SDK internal warning about multiple versions - can be safely ignored as it comes from the PayPal JavaScript.

---

## Solution

### Fix 1: Standardize Token Priority in Order Creation

Update the order creation in `roambuddy-api` to use the same token priority as product fetching:

**File: `supabase/functions/roambuddy-api/index.ts`**

Change line 767 from:
```typescript
const token = authData.data?.auth_token || authData.auth_token || authData.data?.access_token || authData.access_token || authData.token || authData.data?.token;
```

To:
```typescript
const token = authData.data?.access_token || authData.access_token || authData.data?.auth_token || authData.auth_token || authData.token || authData.data?.token;
```

This matches the working token priority used in `handleGetAllProducts()`.

### Fix 2: Add Fallback to Environment Token

If the fresh token still fails, try using the stored `ROAMBUDDY_ACCESS_TOKEN` from environment as a fallback:

```typescript
const token = authData.data?.access_token || 
              authData.access_token || 
              authData.data?.auth_token || 
              authData.auth_token || 
              authData.token || 
              authData.data?.token ||
              Deno.env.get('ROAMBUDDY_ACCESS_TOKEN'); // Fallback to env token
```

### Fix 3: Add Better Error Logging

Add more detailed logging to help debug future token issues:

```typescript
console.log('Order auth token type:', 
  authData.data?.access_token ? 'access_token' : 
  authData.data?.auth_token ? 'auth_token' : 'other');
console.log('Order auth token (first 30 chars):', token?.substring(0, 30) + '...');
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/roambuddy-api/index.ts` | Fix token priority in order creation to match product fetching |

---

## Technical Details

### Token Priority Comparison

| Operation | Current Priority | Required Priority |
|-----------|------------------|-------------------|
| `handleGetAllProducts` (line 472) | `access_token` first | correct |
| `handleCreateOrder` (line 767) | `auth_token` first | **needs fix** |

### RoamBuddy Auth Response Structure

Based on the logs, the authentication response looks like:
```json
{
  "code": 200,
  "message": "User authenticate successfully",
  "data": {
    "username": "T&TCapeTownSA",
    "wallet_balance": "20.00",
    "access_token": "eyJhbGc...",  // This one works!
    "auth_token": "eyJhbGc..."     // This one may not work for orders
  }
}
```

Both tokens are present, but `access_token` is the correct one for API calls.

---

## Testing Checklist

After the fix:

1. **Payment Flow**
   - [ ] Select an eSIM product
   - [ ] Fill in customer details
   - [ ] Complete PayPal/Card payment
   - [ ] Verify order processes without 500 error
   - [ ] Confirm eSIM details display on success

2. **Verify Edge Function Logs**
   - [ ] Check that correct token type is being used
   - [ ] Confirm order request succeeds
   - [ ] Verify order completion succeeds

3. **Database Verification**
   - [ ] Check that order is saved to `orders` table
   - [ ] Verify RoamBuddy order ID is stored

---

## Summary

The fix is straightforward - change the token priority in `handleCreateOrder()` from prioritizing `auth_token` to prioritizing `access_token`, matching the working pattern used in `handleGetAllProducts()`. This single-line change should resolve the "Authorization token is Invalid!" error.

