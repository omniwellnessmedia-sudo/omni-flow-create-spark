/**
 * Google Ads conversion tracking for the Performance Max campaign
 * (Customer ID 396-986-7500).
 *
 * The base gtag.js loader already ships in index.html for GA4 (G-X9DQ4DEHNB) —
 * this module only adds Ads conversion firing on top of that shared dataLayer.
 * Nothing fires until the real IDs from the Ads UI are pasted below, so this is
 * safe to deploy ahead of the conversion actions being created.
 *
 * SETUP (after creating the conversion actions in Google Ads → Goals):
 *   1. Set GOOGLE_ADS_ID to the account tag, e.g. "AW-1234567890".
 *      [TODO: confirm AW-XXXXXXX conversion ID]
 *   2. Paste each conversion action's label into ADS_CONVERSION_LABELS.
 *      (Ads UI shows it as the part after the slash in send_to:
 *       "AW-1234567890/AbCdEfGhIj".)
 *   3. Uncomment the matching gtag('config', ...) line in index.html.
 */

export const GOOGLE_ADS_ID = ""; // [TODO: confirm AW-XXXXXXX conversion ID]

export const ADS_CONVERSION_LABELS: Record<AdsConversionAction, string> = {
  // Service booking inquiry submitted (BookingSystem → contact_submissions)
  booking_inquiry: "", // [TODO: confirm conversion label from Ads UI]
  // Contact form submitted (Contact page → submit-contact edge function)
  contact_submit: "", // [TODO: confirm conversion label from Ads UI]
  // Wellness provider signup started (Auth signup with role=provider)
  provider_signup_start: "", // [TODO: confirm conversion label from Ads UI]
  // Marketplace listing view → click-through (tour tile → Viator outbound)
  marketplace_clickthrough: "", // [TODO: confirm conversion label from Ads UI]
};

export type AdsConversionAction =
  | "booking_inquiry"
  | "contact_submit"
  | "provider_signup_start"
  | "marketplace_clickthrough";

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
