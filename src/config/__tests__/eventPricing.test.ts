import { describe, it, expect } from 'vitest';
import { calculateFees, isPromotionActive, PLATFORM_DEFAULTS, formatZar } from '../eventPricing';

/**
 * The two fee payer modes are different transactions, not a display choice.
 * Getting them the wrong way round either overcharges an attendee or underpays
 * an organiser, and neither is visible from the code that calls this. So the
 * arithmetic is pinned here.
 *
 * No em dashes in this file.
 */

const base = { ticketCents: 15000, quantity: 1, isFree: false, feePayer: 'attendee' as const };

describe('calculateFees, attendee pays', () => {
  it('adds the fee on top and pays the organiser full face value', () => {
    const r = calculateFees(base);
    // 15000 at 500bps is 750, plus 250 flat, is 1000.
    expect(r.platformFeeCents).toBe(1000);
    expect(r.attendeePaysCents).toBe(16000);
    expect(r.organiserReceivesCents).toBe(15000);
  });

  it('reconciles exactly across the three figures', () => {
    for (const ticketCents of [100, 4999, 15000, 89999, 250000]) {
      for (const quantity of [1, 2, 7]) {
        const r = calculateFees({ ...base, ticketCents, quantity });
        expect(r.attendeePaysCents - r.organiserReceivesCents).toBe(r.platformFeeCents);
      }
    }
  });

  it('multiplies by quantity', () => {
    expect(calculateFees({ ...base, quantity: 3 }).platformFeeCents).toBe(3000);
  });
});

describe('calculateFees, organiser pays', () => {
  const organiser = { ...base, feePayer: 'organiser' as const };

  it('leaves the attendee paying the advertised price', () => {
    const r = calculateFees(organiser);
    expect(r.attendeePaysCents).toBe(15000);
    expect(r.organiserReceivesCents).toBe(14000);
    expect(r.platformFeeCents).toBe(1000);
  });

  it('never pushes an organiser payout below zero', () => {
    // A very cheap ticket where the flat component alone exceeds face value.
    const r = calculateFees({ ...organiser, ticketCents: 100, quantity: 1 });
    expect(r.organiserReceivesCents).toBeGreaterThanOrEqual(0);
    expect(r.attendeePaysCents - r.organiserReceivesCents).toBe(r.platformFeeCents);
  });
});

describe('calculateFees, when no fee is due', () => {
  it('charges nothing on a free event', () => {
    const r = calculateFees({ ...base, isFree: true });
    expect(r.platformFeeCents).toBe(0);
    expect(r.attendeePaysCents).toBe(0);
    expect(r.feeWaivedReason).toBe('Free event');
  });

  it('charges nothing when the fee is waived for the event', () => {
    const r = calculateFees({ ...base, feePayer: 'none' });
    expect(r.platformFeeCents).toBe(0);
    expect(r.organiserReceivesCents).toBe(15000);
    expect(r.feeWaivedReason).toBeTruthy();
  });

  it('handles a zero priced ticket that is not flagged free', () => {
    const r = calculateFees({ ...base, ticketCents: 0 });
    expect(r.platformFeeCents).toBe(0);
  });
});

describe('calculateFees, the cap and the override', () => {
  it('caps the fee on a high value booking', () => {
    // Without a cap, a R9,000 retreat ticket would carry a fee nobody agrees to.
    const r = calculateFees({ ...base, ticketCents: 900000 });
    expect(r.platformFeeCents).toBe(PLATFORM_DEFAULTS.bookingFeeCapCents);
  });

  it('honours a per event rate override', () => {
    const r = calculateFees({ ...base, feeBps: 0 });
    // Percentage gone, flat component remains.
    expect(r.platformFeeCents).toBe(PLATFORM_DEFAULTS.bookingFeeFlatCents);
  });

  it('clamps an out of range override rather than trusting it', () => {
    const r = calculateFees({ ...base, feeBps: 99999 });
    expect(r.platformFeeCents).toBeLessThanOrEqual(PLATFORM_DEFAULTS.bookingFeeCapCents);
  });

  it('treats a null override as the platform default', () => {
    expect(calculateFees({ ...base, feeBps: null }).platformFeeCents).toBe(
      calculateFees(base).platformFeeCents
    );
  });
});

describe('isPromotionActive', () => {
  const now = new Date('2026-08-30T00:00:00Z');

  it('is active while the promotion runs', () => {
    expect(isPromotionActive('featured', '2026-09-30T00:00:00Z', now)).toBe(true);
  });

  it('lapses on its own without anyone switching it off', () => {
    // This is the point of the date. A tier left on a row must not promote
    // forever because nobody remembered to change it.
    expect(isPromotionActive('featured', '2026-08-01T00:00:00Z', now)).toBe(false);
  });

  it('is never active for a standard listing', () => {
    expect(isPromotionActive('standard', '2026-09-30T00:00:00Z', now)).toBe(false);
  });

  it('is not active without an end date', () => {
    expect(isPromotionActive('featured', null, now)).toBe(false);
  });

  it('treats an unparseable date as not promoted', () => {
    expect(isPromotionActive('featured', 'not a date', now)).toBe(false);
  });
});

describe('formatZar', () => {
  it('renders cents as rand', () => {
    expect(formatZar(16000)).toContain('160');
    expect(formatZar(0)).toContain('0');
  });
});
