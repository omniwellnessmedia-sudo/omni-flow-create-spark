/**
 * Google Ads conversion tracking for the Performance Max campaign
 * (Customer ID 396-986-7500).
 *
 * The base gtag.js loader already ships in index.html for GA4 (G-X9DQ4DEHNB) —
 * this module only adds Ads conversion firing on top of that shared dataLayer.
 * Nothing fires until every ADS_CONVERSION_LABELS entry is filled in below, so
 * this stays safe to deploy ahead of an action's label being confirmed.
 *
 * SETUP (after creating each conversion action in Google Ads → Goals):
 *   1. GOOGLE_ADS_ID is set (below) — confirmed from the live Ads UI.
 *   2. Paste each conversion action's LABEL into ADS_CONVERSION_LABELS. This
 *      is NOT the same as GOOGLE_ADS_ID or the site's other tag IDs
 *      (G-XXXXXXXXXX, GT-XXXXXXXX) — it's a per-action string the Ads UI
 *      shows only on that action's own setup/tag page, as the part after the
 *      slash in its event snippet: send_to: "AW-11266714886/AbCdEfGhIj".
 *      Google Ads → Goals → Summary → click the action → "Tag setup".
 *   3. Uncomment the matching gtag('config', ...) line in index.html.
 */

// Confirmed 21 Jul from the live Google Ads "Omni website" tag details page.
export const GOOGLE_ADS_ID = "AW-11266714886";

export const ADS_CONVERSION_LABELS: Record<AdsConversionAction, string> = {
  // Service booking inquiry submitted (BookingSystem → contact_submissions)
  booking_inquiry: "", // [TODO: confirm conversion label from Ads UI]
  // Contact form submitted (Contact page → submit-contact edge function)
  contact_submit: "", // [TODO: confirm conversion label from Ads UI]
  // Wellness provider signup STARTED (Auth signup with role=provider — the
  // account-creation moment, not the profile-completion step below)
  provider_signup_start: "", // [TODO: confirm conversion label from Ads UI]
  // Marketplace listing view → click-through. Fires from BOTH live listing
  // surfaces: Tours.tsx (outbound to Viator) and UnifiedMarketplace.tsx
  // (on-site navigation to a listing's detail page) — same conversion goal,
  // two entry points.
  marketplace_clickthrough: "", // [TODO: confirm conversion label from Ads UI]
  // STUNNING PIGS ticket purchase completed (PayPal capture + order saved)
  // NOTE: dormant for the Masque event — tickets sell on Quicket, not our cart.
  ticket_purchase: "", // [TODO: confirm conversion label from Ads UI]
  // Click-through to the Quicket booking page (Campaign B's trackable
  // conversion — Quicket's checkout is cross-domain, so purchases are
  // reconciled from Quicket Sales Reports, not a pixel)
  quicket_ticket_click: "", // [TODO: confirm conversion label from Ads UI]
  // Provider onboarding profile COMPLETED (WellnessExchangeSignup.tsx —
  // deeper funnel stage than provider_signup_start above; deliberately a
  // separate action so the two funnel stages aren't conflated under one
  // label). Optional: only create this conversion action in Ads if you want
  // to track profile completion distinctly from signup start.
  provider_profile_completed: "", // [TODO: confirm conversion label from Ads UI, optional]
};

export type AdsConversionAction =
  | "booking_inquiry"
  | "contact_submit"
  | "provider_signup_start"
  | "marketplace_clickthrough"
  | "ticket_purchase"
  | "provider_profile_completed"
  | "quicket_ticket_click";

interface ConversionParams {
  value?: number;
  currency?: string; // "ZAR" for booking values
  transaction_id?: string;
}

/**
 * Fire a Google Ads conversion. No-ops (with a debug breadcrumb) until the
 * account ID + label are configured, so call sites can ship now and light up
 * the moment the IDs are pasted — no second code change needed.
 */
export function trackAdsConversion(action: AdsConversionAction, params: ConversionParams = {}) {
  const label = ADS_CONVERSION_LABELS[action];
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;

  if (!GOOGLE_ADS_ID || !label) {
    if (import.meta.env.DEV) {
      console.debug(`[googleAds] conversion "${action}" fired but Ads IDs not configured yet`, params);
    }
    // Still record it as a GA4 event so the funnel is visible pre-configuration.
    gtag?.("event", `ads_${action}`, params);
    return;
  }

  gtag?.("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    ...params,
  });
}
