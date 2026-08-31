/**
 * Outbound affiliate programme status and link construction.
 *
 * WHY THIS EXISTS. Affiliate links were being hand-built at each call site with
 * whatever query parameters seemed reasonable. Two problems followed:
 *
 *   1. Viator links carried `search`, `medium_version` and `wellness_category`,
 *      none of which Viator documents, and did NOT carry `pid` or `mcid`, which
 *      are the only parameters Viator uses to attribute a booking. Viator's
 *      attribution documentation is explicit: "The PID and MCID tie bookings to
 *      your account and if they are modified or removed, we will not be able to
 *      pay you out." Every click sent through the old format was unattributed.
 *
 *   2. When a programme is deactivated there was no single place to switch it
 *      off, so dead links stayed live. The CameraStuff account was deactivated
 *      in August 2026 and its links, banner and tracking pixel remained on the
 *      site.
 *
 * Both are now decided here, once.
 */

/** Programmes we currently hold an active account with. */
export const PROGRAMME_ACTIVE = {
  /** Deactivated by the merchant, August 2026. Re-application pending. */
  camerastuff: false,
  viator: true,
  roambuddy: true,
} as const;

export type OutboundProgramme = keyof typeof PROGRAMME_ACTIVE;

/**
 * Viator account identifiers.
 *
 * These are not secrets. They are published in the query string of every
 * outbound link we emit, which is the whole mechanism by which Viator knows a
 * booking came from us. They are therefore committed as defaults rather than
 * left to the environment.
 *
 * That is a deliberate reversal. Holding them only in Netlify meant that any
 * build without those variables set, which includes every deploy preview,
 * emitted untracked links. A missing environment variable then costs real
 * commission and shows no symptom on the page. Committed defaults make
 * attribution work everywhere by default, and the environment variables still
 * override if the account identifiers ever change.
 *
 * Verified against the Viator partner dashboard on 30 August 2026: the link
 * builder under Tools, Links produces exactly this pid and mcid pair, the
 * generated link resolves without redirect loss, Link Alert reports no broken
 * links over the preceding 21 days, and the account shows Verified at an 8%
 * commission rate.
 *
 * MCID IS PER MEDIUM. 42383 is the media identifier issued for text links.
 * Viator issues separate identifiers for widgets and banners, so a different
 * number appearing inside widget embed code is correct and must not be
 * "corrected" to this one. Only pass medium: "link" with this pair.
 */
const DEFAULT_TEXT_LINK_MCID = "42383";

const VIATOR_PID = (import.meta.env.VITE_VIATOR_PID as string | undefined) || "P00273922";
const VIATOR_MCID =
  (import.meta.env.VITE_VIATOR_MCID as string | undefined) || DEFAULT_TEXT_LINK_MCID;

export const VIATOR_SHOP_URL =
  "https://www.viator.com/partner-shop/omniwellnessmedia/";

export const viatorIsAttributable = (): boolean =>
  Boolean(VIATOR_PID && VIATOR_MCID);

/**
 * Build an attributable Viator link.
 *
 * Only the four parameters Viator documents are ever sent: pid, mcid, medium
 * and (optionally) campaign. `productPath` should be a full Viator product
 * path copied from the partner shop, e.g.
 *   /tours/Cape-Town/Kelp-Forest-Snorkeling/d318-407621P1
 * Omit it to link to the partner shop landing page.
 *
 * If the account identifiers are missing the bare URL is returned and a loud
 * error is logged: a link that silently earns nothing is worse than a visible
 * misconfiguration.
 */
export const buildViatorLink = (opts?: {
  productPath?: string;
  campaign?: string;
  medium?: "link" | "widget" | "banner" | "api";
}): string => {
  const { productPath, campaign, medium = "link" } = opts ?? {};

  const base = productPath
    ? `https://www.viator.com${
        productPath.startsWith("/") ? productPath : `/${productPath}`
      }`
    : VIATOR_SHOP_URL;

  if (!viatorIsAttributable()) {
    console.error(
      "[affiliate] No Viator pid/mcid available. " +
        "Viator cannot attribute this booking and it will not be paid out.",
    );
    return base;
  }

  // The committed mcid is the one Viator issued for text links. Widgets and
  // banners carry their own, so pairing a non-link medium with this mcid
  // would report the click against the wrong media type.
  if (medium !== "link" && VIATOR_MCID === DEFAULT_TEXT_LINK_MCID) {
    console.error(
      `[affiliate] medium "${medium}" was requested with the text-link mcid ` +
        `${DEFAULT_TEXT_LINK_MCID}. Widgets and banners are issued their own ` +
        "mcid in the partner dashboard. Use the embed code Viator generates " +
        "for that placement rather than building the URL here.",
    );
  }

  const params = new URLSearchParams({
    pid: VIATOR_PID as string,
    mcid: VIATOR_MCID as string,
    medium,
  });
  if (campaign) params.set("campaign", campaign);

  return `${base}${base.includes("?") ? "&" : "?"}${params.toString()}`;
};

/**
 * Put our attribution onto a Viator URL we did not build.
 *
 * WHY THIS IS NEEDED. Tour rows carry a `booking_url` populated by the Viator
 * product sync, and the tours pages opened that value directly. Those URLs
 * come from the Viator API, not from our partner link builder, so they carry
 * no pid or mcid. Committing the account identifiers did nothing for them.
 * Every click from the main tours listing was therefore still unattributable,
 * which is the single largest leak on the site because that page is the one
 * with the most outbound intent.
 *
 * Behaviour:
 *   - Non Viator hosts are returned untouched. An operator's own booking page
 *     is not ours to tag.
 *   - Anything unparseable is returned untouched rather than thrown away. A
 *     working link that earns nothing beats a broken one.
 *   - Existing pid/mcid/medium are overwritten. A stale or foreign identifier
 *     on a link we are publishing would pay someone else.
 *   - Other query parameters Viator put there are preserved.
 */
export const withViatorAttribution = (url: string | null | undefined, campaign?: string): string => {
  if (!url) return buildViatorLink({ campaign });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (!/(^|\.)viator\.com$/i.test(parsed.hostname)) return url;
  if (!viatorIsAttributable()) return url;

  parsed.searchParams.set("pid", VIATOR_PID as string);
  parsed.searchParams.set("mcid", VIATOR_MCID as string);
  parsed.searchParams.set("medium", "link");
  if (campaign) parsed.searchParams.set("campaign", campaign);

  return parsed.toString();
};

/**
 * CameraStuff storefront link.
 *
 * While the account is inactive this returns the plain, untagged URL: an
 * affiliate-tagged link for a programme we are not in earns nothing and
 * misstates the relationship. Flip PROGRAMME_ACTIVE.camerastuff to true once
 * re-application is approved.
 */
export const camerastuffLink = (path = "/"): string => {
  const base = `https://www.camerastuff.co.za${path}`;
  if (!PROGRAMME_ACTIVE.camerastuff) return base;
  return `${base}${base.includes("?") ? "&" : "?"}a_aid=omniwellnessmedia`;
};
