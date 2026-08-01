/**
 * Social advertising pixels — Meta, TikTok and LinkedIn.
 *
 * ONE PLACE FOR ALL THREE IDS. The point of this file is that a future campaign
 * never has to go hunting through index.html and half a dozen components to
 * find out what is configured. If you are adding a new network, add it here.
 *
 * Mirrors the shape of src/lib/googleAds.ts deliberately:
 *   - account-level loaders live in index.html (they must run before React)
 *   - per-event firing lives here, called from handlers
 *   - everything NO-OPS SAFELY until a real ID is pasted in, so this is safe to
 *     deploy ahead of the ad accounts existing
 *
 * SETUP — replace the placeholders below with real IDs, then:
 *   Meta     — also replace OMNI_FB_PIXEL_ID in index.html (the loader is
 *              gated on it and will not fetch fbevents.js until it is real)
 *   TikTok   — also replace OMNI_TIKTOK_PIXEL_ID in index.html
 *   LinkedIn — also replace OMNI_LINKEDIN_PARTNER_ID in index.html
 *
 * The IDs are duplicated in index.html rather than imported because those
 * loaders run in the document head before any module executes. Keep the two in
 * step; each one is marked with a pointer back to this file.
 *
 * CSP: connect.facebook.net, analytics.tiktok.com and snap.licdn.com are
 * allowlisted in netlify.toml AND public/_headers. Both files must agree —
 * Netlify reads _headers first, so editing only the toml silently does nothing.
 * This has broken tracking here before.
 */

/** Meta (Facebook/Instagram). Numeric, 15-16 digits. */
export const META_PIXEL_ID = "XXXXXXXXXXXXXXXX";

/** TikTok. Alphanumeric, looks like CXXXXXXXXXXXXXXXXXXX. */
export const TIKTOK_PIXEL_ID = "TIKTOK_PIXEL_ID_PLACEHOLDER";

/** LinkedIn Insight Tag partner ID. Numeric, ~7 digits. */
export const LINKEDIN_PARTNER_ID = "LINKEDIN_PARTNER_ID_PLACEHOLDER";

/** A placeholder is any value still carrying the marker text. */
const isPlaceholder = (id: string) => !id || /X{4,}|PLACEHOLDER/i.test(id);

export const isMetaConfigured = () => /^[0-9]{6,}$/.test(META_PIXEL_ID);
export const isTikTokConfigured = () => !isPlaceholder(TIKTOK_PIXEL_ID);
export const isLinkedInConfigured = () => /^[0-9]{4,}$/.test(LINKEDIN_PARTNER_ID);

type Params = Record<string, unknown>;

interface PixelWindow extends Window {
  fbq?: (...args: unknown[]) => void;
  ttq?: { track: (event: string, params?: Params) => void; page: () => void };
  lintrk?: (action: string, data?: Params) => void;
}

const w = () => (typeof window === "undefined" ? undefined : (window as PixelWindow));

/**
 * Standard events we fire. Names are each network's own vocabulary, so they map
 * to built-in optimisation goals rather than needing custom-event setup:
 *   ViewContent — a key page was viewed (the event landing page)
 *   Lead        — a form was submitted
 */
export type SocialEvent = "ViewContent" | "Lead";

const TIKTOK_EVENT: Record<SocialEvent, string> = {
  ViewContent: "ViewContent",
  Lead: "SubmitForm",
};

/**
 * Fire one event across every configured network.
 *
 * Silently does nothing for a network whose ID is still a placeholder, and
 * never throws — a tracking pixel must not be able to break a booking or a
 * contact form. Call it from a handler; do not await it.
 */
export function trackSocialEvent(event: SocialEvent, params: Params = {}) {
  const win = w();
  if (!win) return;

  try {
    if (isMetaConfigured()) win.fbq?.("track", event, params);
  } catch (err) {
    console.debug("[socialPixels] meta event failed", err);
  }

  try {
    if (isTikTokConfigured()) win.ttq?.track(TIKTOK_EVENT[event], params);
  } catch (err) {
    console.debug("[socialPixels] tiktok event failed", err);
  }

  try {
    // LinkedIn has no generic event API — it fires per-conversion IDs created
    // in Campaign Manager. Until those exist there is nothing to send, so this
    // is intentionally a no-op rather than a fabricated call.
    if (isLinkedInConfigured() && LINKEDIN_CONVERSIONS[event]) {
      win.lintrk?.("track", { conversion_id: LINKEDIN_CONVERSIONS[event] });
    }
  } catch (err) {
    console.debug("[socialPixels] linkedin event failed", err);
  }
}

/**
 * LinkedIn conversion IDs, per event. Create these in Campaign Manager →
 * Analyze → Conversion tracking, then paste the numeric IDs here. Empty means
 * "no conversion defined yet" and nothing fires.
 */
export const LINKEDIN_CONVERSIONS: Partial<Record<SocialEvent, string>> = {
  // ViewContent: "1234567",
  // Lead: "1234568",
};

/** Convenience wrapper for the event landing page. */
export const trackEventPageView = () =>
  trackSocialEvent("ViewContent", {
    content_name: "Celebrating Women Who Protect Life",
    content_category: "event",
    currency: "ZAR",
    value: 150,
  });

/** Convenience wrapper for contact-form submissions. */
export const trackLead = (source: string) =>
  trackSocialEvent("Lead", { content_name: source });
