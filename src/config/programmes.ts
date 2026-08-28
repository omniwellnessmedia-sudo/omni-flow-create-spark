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
 * Viator account identifiers. These are per-account values taken from the
 * Viator partner dashboard. They are NOT secrets, but they are also not
 * guessable, so they come from the environment rather than being hardcoded.
 * Set VITE_VIATOR_PID and VITE_VIATOR_MCID in Netlify.
 */
const VIATOR_PID = import.meta.env.VITE_VIATOR_PID as string | undefined;
const VIATOR_MCID = import.meta.env.VITE_VIATOR_MCID as string | undefined;

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
      "[affiliate] VITE_VIATOR_PID / VITE_VIATOR_MCID are not set. " +
        "Viator cannot attribute this booking and it will not be paid out. " +
        "Set both in the Netlify environment.",
    );
    return base;
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
