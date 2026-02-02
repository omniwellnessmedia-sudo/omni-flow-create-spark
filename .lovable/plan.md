
# Add Email Notification on RoamBuddy Lead Capture

## Overview
Send an automated email notification to Chad (omniwellnessmedia@gmail.com) whenever a lead is captured through the RoamBuddy AI Sales Bot. The email will include all conversation details to help with personalized follow-up.

## Current Flow
```
User chats with Roam → Email captured → Saved to database
```

## New Flow
```
User chats with Roam → Email captured → Saved to database → Email sent to Chad
```

## Implementation

### Option A: Modify Frontend (Simpler)
Update `src/components/roambuddy/RoamBuddySalesBot.tsx` to call a new edge function after successful email capture.

### Option B: Modify Edge Function (Recommended)
Create a dedicated notification function or add to the chat function for better reliability.

## Changes Required

### 1. Create New Edge Function: `roambuddy-lead-notification`

**File:** `supabase/functions/roambuddy-lead-notification/index.ts`

**Purpose:** Send formatted email to Chad with full lead details

**Email Content:**
- Lead's email address
- Date and time captured
- Full conversation transcript
- Travel destination mentioned
- Data/usage needs identified
- Products recommended (if any)
- Device type (if mentioned)

**Sample Email Format:**
```
Subject: 🎯 New RoamBuddy Lead: john@example.com

━━━━━━━━━━━━━━━━━━━━━━━━━
NEW ESIM LEAD CAPTURED
━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email: john@example.com
📅 Captured: 2 Feb 2026, 09:45 AM
🌍 Destination: Thailand (14 days)
📱 Data Needs: Heavy usage, video calls
💡 Recommended: 10GB Asia Plan ($25)

━━━ CONVERSATION TRANSCRIPT ━━━

Roam: Hey there! 👋 I'm Roam, your travel...
User: I'm going to Thailand for 2 weeks
Roam: Thailand is amazing! 🇹🇭 For a 2-week...
User: I need data for work video calls
Roam: Got it - you'll want reliable data...
[Email captured]

━━━━━━━━━━━━━━━━━━━━━━━━━

Quick Actions:
• View in Dashboard: /admin/roambuddy-sales
• All Subscribers: /admin/newsletter
```

### 2. Update `RoamBuddySalesBot.tsx`

After successful email capture in `handleEmailSubmit()`, call the notification function:

```typescript
// After database save succeeds
await supabase.functions.invoke('roambuddy-lead-notification', {
  body: {
    email: email.trim(),
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    sessionId,
    capturedAt: new Date().toISOString()
  }
});
```

### 3. Update `supabase/config.toml`

Add the new function configuration.

## Extracted Lead Intelligence

The notification email will parse the conversation to extract:

| Field | How Detected |
|-------|--------------|
| Destination | Keywords: "going to", "traveling to", country names |
| Trip Duration | Numbers + "days", "weeks", "month" |
| Data Needs | "work", "video calls", "streaming", "light use" |
| Device | "iPhone", "Android", "Samsung", phone models |
| Budget Mentioned | Dollar/Rand amounts |
| Urgency | "leaving tomorrow", "next week", dates |

## Benefits

1. **Instant Awareness** - Chad knows immediately when someone shows buying intent
2. **Context for Follow-up** - Full conversation helps personalize outreach
3. **No Manual Checking** - No need to constantly monitor the dashboard
4. **Lead Scoring** - Future enhancement: prioritize hot leads

## Testing

1. Visit `/roambuddy-store`
2. Chat with Roam about travel plans
3. Submit email in the capture form
4. Check `omniwellnessmedia@gmail.com` for notification
5. Verify all details are included

## Future Enhancements (Optional)

- Add lead scoring (hot/warm/cold based on conversation)
- Include direct "Reply to Lead" button in email
- Slack/WhatsApp notification option
- Auto-assign to CRM if integrated
