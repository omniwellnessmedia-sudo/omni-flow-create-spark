import { QUICKET_URL } from "./event";

/**
 * Campaign attribution for the Quicket handoff.
 *
 * Quicket's checkout is cross-domain, so the only way to reconcile an order
 * back to a campaign is to carry the click identifiers across with the
 * visitor. This module captures gclid + UTM parameters from the landing URL
 * the moment the page module loads (before any CTA can be tapped), persists
 * them for the session, and appends them to every outbound Quicket link.
 *
 * Every Quicket destination also carries #/schedules so visitors land at
 * session selection instead of the event page's own TICKETS + calendar
 * detour — both of those steps are information the visitor already gave us.
 * NOTE: a per-session deep link (pre-selecting one of the three sessions)
 * could not be verified against Quicket's SPA router from the build
 * environment, so all CTAs land at the schedules step; if Quicket confirm a
 * session-id fragment format, extend quicketHref(sessionNo) here.
 */

const KEYS = ["gclid", "utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
const SS_KEY = "wwpl_attribution";

function capture(): void {
  try {
    const sp = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of KEYS) {
      const v = sp.get(k);
      if (v) found[k] = v;
    }
    // First-touch wins for the session: a later internal navigation without
    // params must not wipe the attribution captured on landing.
    if (Object.keys(found).length > 0 && !sessionStorage.getItem(SS_KEY)) {
      sessionStorage.setItem(SS_KEY, JSON.stringify(found));
    }
  } catch {
    /* Storage unavailable (private mode) — links degrade to plain Quicket. */
  }
}

// Module load runs before first render, so links are correct from first paint.
if (typeof window !== "undefined") capture();

export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(SS_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

/** True for visitors who arrived from paid media (gclid or utm_medium=cpc). */
export function isPaidTraffic(): boolean {
  const a = getAttribution();
  return Boolean(a.gclid) || a.utm_medium === "cpc";
}

/**
 * The one place outbound Quicket URLs are built: attribution query params
 * (when present) + the #/schedules deep link, in that order — query before
 * fragment, or Quicket's router never sees the fragment.
 */
export function quicketHref(): string {
  const qs = new URLSearchParams(getAttribution()).toString();
  return QUICKET_URL + (qs ? `?${qs}` : "") + "#/schedules";
}
