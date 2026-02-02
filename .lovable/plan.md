

# Fix Chatbot Text Formatting and PayPal Card Payment Regional Issues

## Issues Identified

### Issue 1: Chatbot Not Formatting Text Properly
The RoamBuddy sales bot displays raw markdown/asterisks instead of properly formatted text. This is because the AI responses contain markdown formatting (like `**bold**`, `*italic*`) but the chat UI renders `{message.content}` as plain text without parsing markdown.

**Current code (line 303):**
```tsx
{message.content}
```

This just outputs the raw string with asterisks visible.

### Issue 2: PayPal CardFields Still Requires UK/US Phone Number
The PayPal CardFields implementation attempts to call the PayPal REST API directly from the browser (line 688-707), which:
1. Won't work without authentication headers
2. Doesn't have proper configuration for digital goods
3. May still trigger PayPal's hosted vault form which requires billing details

**Current problematic code:**
```tsx
createOrder={async () => {
  const response = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ... })
  });
  const order = await response.json();
  return order.id;
}}
```

This approach is incorrect - you can't call PayPal's REST API directly from the browser without OAuth credentials.

---

## Solution

### Fix 1: Add Markdown Rendering to Chatbot

Install a lightweight markdown parser and render bot messages with proper formatting:

**Option A: Simple regex-based formatter (recommended for chat)**
- Convert `**text**` to bold
- Convert `*text*` to italic  
- Convert emoji codes naturally
- No additional dependencies needed

**Option B: Use a markdown library like `react-markdown`**
- Full markdown support
- Requires adding dependency

I recommend **Option A** for simplicity since we only need basic formatting in a chat context.

**Changes to `RoamBuddySalesBot.tsx`:**

Add a formatting function:
```tsx
const formatMessage = (content: string) => {
  // Convert **bold** to <strong>
  // Convert *italic* to <em>
  // Convert line breaks
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
};
```

Update message rendering to use `dangerouslySetInnerHTML` with sanitization or create React elements.

### Fix 2: Fix PayPal CardFields Order Creation

The CardFields component needs to use the **PayPal SDK's internal order creation**, not a direct API call. The correct approach is to return an order ID from a server-side edge function or use the SDK's built-in mechanism.

**Solution: Create order via Edge Function**

Create a new edge function `roambuddy-paypal-order` that:
1. Creates the PayPal order server-side using proper OAuth
2. Returns the order ID to the client
3. Handles capture after approval

This ensures:
- No billing address required (digital goods)
- No phone number required
- Works for all countries
- Proper OAuth authentication

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/roambuddy-paypal-order/index.ts` | Server-side PayPal order creation and capture |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/roambuddy/RoamBuddySalesBot.tsx` | Add markdown formatting for bot messages |
| `src/components/roambuddy/RoamBuddyCheckoutModal.tsx` | Update CardFields to use edge function for order creation |
| `supabase/functions/roambuddy-sales-chat/index.ts` | Update system prompt to avoid markdown formatting |

---

## Technical Implementation Details

### 1. Chatbot Markdown Formatting

**Update `RoamBuddySalesBot.tsx` message rendering:**

Add a helper function to convert basic markdown to React elements:

```tsx
import DOMPurify from 'dompurify';

const formatBotMessage = (content: string): string => {
  let formatted = content
    // Bold text: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text: *text* -> <em>text</em>
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Line breaks
    .replace(/\n/g, '<br />');
  
  // Sanitize to prevent XSS
  return DOMPurify.sanitize(formatted);
};
```

Update the message display:
```tsx
{message.role === 'assistant' ? (
  <div 
    dangerouslySetInnerHTML={{ __html: formatBotMessage(message.content) }}
  />
) : (
  message.content
)}
```

Note: `dompurify` is already in dependencies.

### 2. PayPal Edge Function for Order Creation

**New file: `supabase/functions/roambuddy-paypal-order/index.ts`**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, ...",
};

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  
  const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  
  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { action, amount, description, orderId } = await req.json();

  if (action === "create") {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: { currency_code: "USD", value: amount },
          description: description,
        }],
        payment_source: {
          card: {
            // No billing address required for digital goods
          }
        }
      }),
    });
    
    const order = await response.json();
    return new Response(JSON.stringify({ orderId: order.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (action === "capture") {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### 3. Update Checkout Modal CardFields

Replace the broken direct API call with edge function:

```tsx
<PayPalCardFieldsProvider
  createOrder={async () => {
    const { data, error } = await supabase.functions.invoke('roambuddy-paypal-order', {
      body: {
        action: 'create',
        amount: finalPriceUSD.toFixed(2),
        description: `${product.name} - ${product.destination}`,
      }
    });
    if (error) throw error;
    return data.orderId;
  }}
  onApprove={async (data) => {
    // Capture via edge function
    const { data: captureResult, error } = await supabase.functions.invoke('roambuddy-paypal-order', {
      body: {
        action: 'capture',
        orderId: data.orderID,
      }
    });
    if (error) throw error;
    
    // Continue with existing order flow
    await handlePayPalApprove(data, { 
      order: { capture: async () => captureResult }
    });
  }}
  // ... rest of props
>
```

### 4. Alternative: Update AI Prompt to Avoid Markdown

A simpler approach for the chatbot is to instruct the AI not to use markdown:

**Update SYSTEM_PROMPT in `roambuddy-sales-chat/index.ts`:**

Add to the RESPONSE FORMAT section:
```
RESPONSE FORMAT:
Keep responses concise (2-3 sentences max). Be conversational, not robotic.
DO NOT use markdown formatting like asterisks (*) for emphasis. Just write naturally.
Emojis are fine and encouraged for warmth.
```

---

## Recommended Approach

For maximum reliability and speed:

1. **Chatbot**: Update the AI prompt to not use markdown (simplest fix)
2. **Chatbot (backup)**: Also add basic markdown parsing in case some formatting slips through
3. **PayPal**: Create the edge function for proper server-side order creation

---

## Required Secrets

For the PayPal edge function, you'll need to add:
- `PAYPAL_CLIENT_ID` - Your PayPal client ID (you may already have this)
- `PAYPAL_CLIENT_SECRET` - Your PayPal client secret for OAuth

---

## Testing Checklist

After implementation:

**Chatbot:**
- [ ] Bot messages display without raw asterisks
- [ ] Bold/italic text renders properly (if used)
- [ ] Emojis display correctly
- [ ] Line breaks work as expected

**PayPal CardFields:**
- [ ] Card form shows only number/expiry/CVV fields
- [ ] No phone number field appears
- [ ] No billing address required
- [ ] Payment completes successfully with SA card
- [ ] Order is created in database after payment

