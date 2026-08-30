/**
 * How the events module earns money.
 *
 * This file holds the arithmetic and the definitions. It deliberately holds no
 * prices that are published as our own service rates: those live in
 * src/data/publicRateCard.ts, which is the only place a client facing service
 * price may be defined. What is here is platform mechanics, which is a
 * different thing: what we charge an organiser to list or to sell through us.
 *
 * HOW THE COMPARABLE BUSINESSES ACTUALLY WORK
 *
 * Hyperli, and Groupon before it, is a voucher marketplace. The merchant
 * discounts steeply, the platform sells the voucher, collects the cash up
 * front and remits to the merchant later, keeping a commission that is
 * commonly a fifth to a half of the voucher price. The platform also holds
 * the float until redemption and keeps the value of vouchers never redeemed.
 * It is lucrative and it is heavy: you are holding other people's money,
 * carrying refunds, redemption disputes and consumer protection obligations.
 *
 * WikiDeals is not that. It is an aggregator. It holds no stock and processes
 * no payments. It earns an affiliate commission when someone clicks through
 * and buys at the retailer, plus paid placement and advertising. Far lower
 * revenue per transaction, close to zero operational risk.
 *
 * Quicket sits between the two for ticketing: it charges a booking fee per
 * ticket, either added to what the attendee pays or absorbed by the organiser
 * out of the ticket price.
 *
 * WHAT THIS MODULE IMPLEMENTS, AND IN WHAT ORDER
 *
 * The tiers below are ordered by how much has to be true before they can earn.
 *
 *   1. PROMOTED LISTING. An organiser pays for placement. No payment
 *      processing, no refunds, no liability for whether the event happens.
 *      This is the WikiDeals shape and it is the only line that earns on day
 *      one, because it needs an audience and nothing else.
 *
 *   2. BOOKING FEE. We already hold the hard parts: per session capacity, an
 *      oversell-safe reservation and a payment route. A fee per ticket is the
 *      Quicket shape. It needs organisers willing to sell through us, which
 *      is a harder sell than placement but a much larger number.
 *
 *   3. REFERRAL. For events ticketed elsewhere, a commission where the
 *      ticketing platform runs a programme. Near zero effort, small and
 *      unreliable, worth having because the listing exists anyway.
 *
 *   4. VOUCHER. The Hyperli shape. Deliberately NOT implemented. It requires
 *      holding client money, a redemption ledger, a refund policy and
 *      consumer protection compliance. Adding it before the first three earn
 *      anything would be taking on the heaviest obligations for the least
 *      certain return.
 *
 * The rates here are defaults, not commitments, and no rate in this file is
 * published to a visitor by any page. An organiser agreement sets the actual
 * number, and events.fee_bps overrides per event so a negotiated rate or a
 * free community event is expressed in data rather than in code.
 *
 * No em dashes in this file.
 */

/** Basis points. 250 bps is 2.5 per cent. Integer maths avoids float drift. */
export type Bps = number;

export const PLATFORM_DEFAULTS = {
  /** Default booking fee on a ticket sold through us. */
  bookingFeeBps: 500 as Bps,
  /** Flat component per ticket, in cents, alongside the percentage. */
  bookingFeeFlatCents: 250,
  /**
   * Ceiling on the fee for one ticket, in cents. A percentage with no cap
   * turns a high value retreat booking into a fee nobody will agree to.
   */
  bookingFeeCapCents: 5000,
  /** We never charge a fee on a free event, whatever the configuration says. */
  chargeFeeOnFreeEvents: false,
} as const;

export type ListingTier = 'standard' | 'featured' | 'sponsored';
export type FeePayer = 'attendee' | 'organiser' | 'none';

export interface TierDefinition {
  tier: ListingTier;
  label: string;
  /** What the organiser gets. Plain language, for the admin screen. */
  includes: string[];
}

export const LISTING_TIERS: TierDefinition[] = [
  {
    tier: 'standard',
    label: 'Standard listing',
    includes: [
      'Listed on the events calendar',
      'Its own page with your details and booking link',
      'No charge',
    ],
  },
  {
    tier: 'featured',
    label: 'Featured listing',
    includes: [
      'Everything in a standard listing',
      'Sorted above standard listings while the promotion runs',
      'Marked as featured on the calendar',
    ],
  },
  {
    tier: 'sponsored',
    label: 'Sponsored listing',
    includes: [
      'Everything in a featured listing',
      'Placement on the community landing page',
      'Included in one newsletter send',
    ],
  },
];

export interface FeeInput {
  /** Ticket price in cents. */
  ticketCents: number;
  quantity: number;
  isFree: boolean;
  feePayer: FeePayer;
  /** Per event override. Null or undefined uses the platform default. */
  feeBps?: number | null;
}

export interface FeeBreakdown {
  /** What the attendee is asked to pay, in cents. */
  attendeePaysCents: number;
  /** What the organiser is owed, in cents. */
  organiserReceivesCents: number;
  /** What we keep, in cents. */
  platformFeeCents: number;
  /** True when no fee applied and why, for display and for support queries. */
  feeWaivedReason?: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/**
 * Work out who pays what for one booking.
 *
 * The two payer modes are genuinely different transactions, not a display
 * choice. With 'attendee' the fee sits on top of the ticket price and the
 * organiser receives the full face value. With 'organiser' the attendee pays
 * the advertised price and the fee comes out of the organiser's proceeds.
 * Getting this backwards means either overcharging an attendee or underpaying
 * an organiser, so it is computed in one place and tested.
 *
 * All amounts are integer cents. Rounding is applied once, to the fee, so the
 * three returned figures always reconcile exactly.
 */
export const calculateFees = (input: FeeInput): FeeBreakdown => {
  const { ticketCents, quantity, isFree, feePayer } = input;

  const face = Math.max(0, Math.round(ticketCents)) * Math.max(0, Math.round(quantity));

  if (isFree && !PLATFORM_DEFAULTS.chargeFeeOnFreeEvents) {
    return {
      attendeePaysCents: 0,
      organiserReceivesCents: 0,
      platformFeeCents: 0,
      feeWaivedReason: 'Free event',
    };
  }

  if (feePayer === 'none') {
    return {
      attendeePaysCents: face,
      organiserReceivesCents: face,
      platformFeeCents: 0,
      feeWaivedReason: 'Fee waived for this event',
    };
  }

  if (face === 0) {
    return {
      attendeePaysCents: 0,
      organiserReceivesCents: 0,
      platformFeeCents: 0,
      feeWaivedReason: 'No ticket value',
    };
  }

  const bps =
    input.feeBps === null || input.feeBps === undefined
      ? PLATFORM_DEFAULTS.bookingFeeBps
      : clamp(Math.round(input.feeBps), 0, 3000);

  const perTicketPercent = Math.round((Math.max(0, Math.round(ticketCents)) * bps) / 10_000);
  const perTicketFee = clamp(
    perTicketPercent + PLATFORM_DEFAULTS.bookingFeeFlatCents,
    0,
    PLATFORM_DEFAULTS.bookingFeeCapCents
  );
  const fee = perTicketFee * Math.max(0, Math.round(quantity));

  if (feePayer === 'attendee') {
    return {
      attendeePaysCents: face + fee,
      organiserReceivesCents: face,
      platformFeeCents: fee,
    };
  }

  // 'organiser': the attendee pays the advertised price and the fee comes out
  // of the organiser's proceeds. Never let that push a payout below zero.
  const takeable = Math.min(fee, face);
  return {
    attendeePaysCents: face,
    organiserReceivesCents: face - takeable,
    platformFeeCents: takeable,
  };
};

/** Cents to a display string. Never used to compute anything. */
export const formatZar = (cents: number): string =>
  `R${(cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Is a promotion currently running?
 *
 * A tier alone is not enough. A promotion that has lapsed must stop being
 * promoted without anyone remembering to switch it off, so the date decides.
 * The database reader applies the same rule; this mirrors it for the client
 * so the two cannot disagree about what a visitor sees.
 */
export const isPromotionActive = (
  tier: string | null | undefined,
  featuredUntil: string | Date | null | undefined,
  now: Date = new Date()
): boolean => {
  if (!tier || tier === 'standard' || !featuredUntil) return false;
  const until = featuredUntil instanceof Date ? featuredUntil : new Date(featuredUntil);
  if (Number.isNaN(until.getTime())) return false;
  return until.getTime() > now.getTime();
};
