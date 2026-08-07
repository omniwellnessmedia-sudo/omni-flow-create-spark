/**
 * Voices for Women honourees — the single source of truth for who appears on
 * the public event page.
 *
 * PUBLICATION IS TRIPLE-GATED. A record renders only when ALL THREE hold:
 *   1. `publishToWeb` is explicitly true (it defaults to false — an omitted
 *      flag can never publish anyone);
 *   2. `citation` exists;
 *   3. `portrait` exists — and portrait files for uncleared honourees are
 *      NOT in the repo, so setting the flag alone still renders nothing.
 * Anything incomplete is skipped silently by VISIBLE_AWARDEES — never shown
 * as a gap, never listed by name.
 *
 * 34 honourees exist in total (per the campaign team, 6 Aug). The records
 * below are the names known so far from the tracker sheet and the produced
 * profile cards; add the rest as the team supplies them. Produced cards for
 * uncleared honourees live in the team's Drive folder ("Awardees Womens day
 * event profile") — do not copy one into public/awardees/ until that person
 * is cleared for public announcement.
 *
 * CLEARED FOR PUBLIC ANNOUNCEMENT (confirmed by Tumelo, 7 Aug):
 *   - Karen de Klerk  — renders (flag + citation + portrait all present)
 *   - Toni Brockhoven — flag set, but no portrait has been supplied yet, so
 *     the gate keeps her off the page until her card arrives. That is the
 *     system working as designed, not an oversight.
 */

export interface AwardeeRecord {
  name: string;
  /** Role + award, verbatim from the produced card or the team's wording. */
  citation?: string;
  /** Path under public/awardees/. Only cleared honourees' files exist. */
  portrait?: string;
  /** Explicit opt-in to public rendering. Defaults to false. */
  publishToWeb?: boolean;
}

export const AWARDEE_RECORDS: AwardeeRecord[] = [
  {
    name: "Karen de Klerk",
    citation:
      "Chairperson, Cape Animal Welfare Forum. Lifetime Achievement Award for Animal Welfare Leadership and Sector Collaboration.",
    portrait: "/awardees/karen-de-klerk.webp",
    publishToWeb: true,
  },
  {
    name: "Toni Brockhoven",
    citation:
      "Lifetime Achievement Award for Service to Beauty Without Cruelty South Africa.",
    // portrait: pending — her produced card has not been supplied yet.
    publishToWeb: true,
  },

  /* Cards produced, NOT cleared for publication — flags stay false and
     their portrait files are deliberately absent from the repo. */
  {
    name: "Louise Van Der Merwe",
    citation:
      "Founder & Managing Trustee, NatureBased Education. Award for Outstanding Contribution to Humane Education & Environmental Awareness.",
  },
  {
    name: "Valerie Roscoe",
    citation:
      "Development Volunteer, Hazardous Poisons Committee, UnPoison South Africa. In recognition of her creative, cultural & community advocacy.",
  },
  {
    name: "Nicola Van Wyk",
    citation:
      "Policy Advisor, FOUR PAWS South Africa. In recognition of her work in animal law & policy.",
  },
  {
    name: "Michelle Taberer",
    citation:
      "Founder and Chairperson, Stop Live Export South Africa. Award for Campaigning Against Live Animal Export by Sea.",
  },
  {
    name: "Megan Choritz",
    citation:
      "Writer, theatre director, actor, improviser, facilitator and activist. Award for Creative Courage, Theatre and Transformative Storytelling.",
  },
  {
    name: "Dr Stephanie-Emmy Klarmann",
    citation:
      "Campaign Manager, Blood Lions. Award for Captive-Wildlife Campaigning and Youth Education.",
  },

  /* Named on the tracker sheet (5 Aug), no produced card yet. */
  { name: "Alexandra Dodd" },
  { name: "Andie Rive" },
  { name: "Dr Marion Garai" },
  { name: "Makoma Lekalakala" },
  { name: "Mphatheleni Makaulule" },
  { name: "Kirsten Youens" },
  { name: "Renee Bish" },
  { name: "Dr Jennifer Olber" },
  { name: "Fiona Miles" },
  { name: "Delia OConner" },
  { name: "Dr Elisa Galgut" },
  { name: "Leslie Giles" },
  { name: "Shelley Drynan" },
  { name: "Cathrine Nyquist" },
  { name: "Kerri Wolter" },
  { name: "Stephania Seveso Falcon" },
  { name: "Promise Mabilo" },
  { name: "Sera Farista" },
  { name: "Sue Gajathar" },
  { name: "Leslie Lunn" },
];

/**
 * The only list the page may render from. The triple gate lives here, in
 * one place, rather than in JSX where a refactor could drop it.
 */
export const VISIBLE_AWARDEES: AwardeeRecord[] = AWARDEE_RECORDS.filter(
  (a) => a.publishToWeb === true && !!a.citation && !!a.portrait
);

/**
 * Personal anchor for each honouree: #awardee-firstname-lastname, so an
 * awardee can share a link that lands directly on her entry. Honorifics are
 * stripped ("awardee-stephanie-emmy-klarmann", not "awardee-dr-...").
 */
export const awardeeAnchor = (a: AwardeeRecord): string =>
  "awardee-" +
  a.name
    .toLowerCase()
    .replace(/^(dr|prof|adv|rev)\.?\s+/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
