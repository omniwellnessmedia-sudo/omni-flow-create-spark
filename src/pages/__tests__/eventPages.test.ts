import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { EVENT_CONTENT, getEventContent } from '@/data/eventContent';
import { calculateFees } from '@/config/eventPricing';

/**
 * The events experience, held to the same rules as everything else here.
 *
 * The Wellness Day facts below mirror the live Quicket listing (event
 * 389529), pasted in full by Tumelo on 4 September 2026. If the listing
 * changes, the source changes, and these tests are updated WITH a fresh
 * paste, never from memory.
 *
 * No em dashes in this file.
 */

const read = (p: string) => readFileSync(resolve(__dirname, p), 'utf8');
const detailSrc = read('../EventDetail.tsx');
const adminSrc = read('../admin/EventsAdmin.tsx');
const contentSrc = read('../../data/eventContent.ts');
const migrationSrc = read('../../../supabase/migrations/20260904100000_events_manager_access.sql');

const wellness = getEventContent('wellness-day-fundraiser-2026')!;

describe('the Wellness Day content mirrors the published listing', () => {
  it('exists', () => {
    expect(wellness).toBeTruthy();
  });

  it('carries exactly the five published sessions, in published order', () => {
    expect(wellness.programme?.map((s) => [s.starts, s.ends, s.title, s.facilitator])).toEqual([
      ['10:30', '11:15', 'Pilates', 'Hayley Stoffberg'],
      ['11:30', '12:15', 'Hatha Yoga', 'Chad Cupido'],
      ['12:30', '13:15', 'Qi Cultivation, Breathwork & Imaginative Experience', 'Rome Naidoo'],
      ['13:30', '14:15', 'Move, Play & Groove', 'Kirsten Adams & Chazz Jurd'],
      ['14:30', '15:15', 'Yin Yoga & Sound Journey', 'Hayley Stoffberg'],
    ]);
  });

  it('carries exactly the published ticket tiers', () => {
    expect(wellness.tickets?.map((t) => [t.priceZar, t.covers])).toEqual([
      [125, 1],
      [200, 2],
      [270, 3],
      [375, 'all'],
    ]);
    // The published savings, not recomputed ones.
    expect(wellness.tickets?.map((t) => t.savingZar ?? null)).toEqual([null, 50, 105, 250]);
  });

  it('keeps the published logistics', () => {
    expect(wellness.timeLabel).toBe('10:30 to 15:30');
    expect(wellness.doorsNote).toContain('10:15');
    // The listing is explicit: no door sales. The older walk-in plan from the
    // venue letter must not resurface.
    expect(wellness.ticketNote).toContain('No tickets will be available at the door');
    expect(contentSrc).not.toMatch(/walk-?in/i);
    expect(wellness.address).toBe('57 Promenade Rd, Muizenberg, Cape Town, 7950');
  });

  it('names its source', () => {
    expect(wellness.source).toContain('Quicket listing 389529');
  });

  it('marks the two published family sessions and only those', () => {
    expect(wellness.programme?.map((s) => Boolean(s.familyNote))).toEqual([
      false, false, false, true, true,
    ]);
  });
});

describe('commercial entity separation on the events surface', () => {
  it.each([
    ['eventContent.ts', contentSrc],
    ['EventDetail.tsx', detailSrc],
  ])('%s carries no Foundation branding, donation asks or tax language', (_f, src) => {
    // The host is named factually through the events row (host_name), which
    // is the team's decision surface. Authored page copy stays neutral.
    expect(src).not.toMatch(/Phil-?[Aa]fel/);
    expect(src).not.toMatch(/Section 18A/i);
    expect(src).not.toMatch(/tax.deductible/i);
    expect(src).not.toMatch(/donat/i);
    // The listing's R15,000 voluntary donation goal belongs to the host's
    // own page, not this one.
    expect(src).not.toContain('15,000');
  });
});

describe('the ticket panels', () => {
  it('the external panel hands over honestly', () => {
    expect(detailSrc).toContain('Booking and payment are handled by the organiser on their own site.');
    expect(detailSrc).toContain('noopener noreferrer nofollow');
  });

  it('the internal panel prices through the shared fee engine, never inline maths', () => {
    expect(detailSrc).toContain('calculateFees({');
    expect(detailSrc).toContain('fee_payer');
  });

  it('the fee engine still reconciles to the cent for a typical booking', () => {
    const fees = calculateFees({
      ticketCents: 12500,
      quantity: 2,
      isFree: false,
      feePayer: 'attendee',
      feeBps: null,
    });
    expect(fees.attendeePaysCents).toBe(
      fees.organiserReceivesCents + fees.platformFeeCents
    );
  });

  it('a plan only ever resolves to a published tier', () => {
    // tierFor is internal to the page; its data contract is what matters:
    // every covers value is a positive count or the literal all.
    for (const t of wellness.tickets ?? []) {
      expect(t.covers === 'all' || (Number.isInteger(t.covers) && (t.covers as number) > 0)).toBe(true);
    }
  });
});

describe('the page structure earns the brief', () => {
  const REQUIRED = [
    ['a countdown', 'until it starts'],
    ['an add to calendar action', 'BEGIN:VCALENDAR'],
    ['the interactive programme', 'aria-pressed'],
    ['a sticky mobile booking bar', 'fixed inset-x-0 bottom-0'],
    ['a directions link', 'Get directions'],
    ['the provenance note', 'SOURCE_NOTE'],
  ] as const;
  for (const [label, marker] of REQUIRED) {
    it(`EventDetail has ${label}`, () => {
      expect(detailSrc).toContain(marker);
    });
  }

  it('an event without rich content still renders as a plain listing', () => {
    expect(getEventContent('some-unknown-slug')).toBeNull();
    expect(detailSrc).toContain('!content && event.summary');
  });
});

describe('the events admin can actually manage events', () => {
  it('has an edit path, not only create', () => {
    expect(adminSrc).toContain("update(fields).eq('id', editingId)");
    expect(adminSrc).toContain('Edit this event');
  });

  it('manages seats with the sold floor enforced', () => {
    expect(adminSrc).toContain('Allocation too low');
    expect(adminSrc).toContain("from('event_sessions')");
  });

  it('surfaces the database refusal verbatim on a failed save', () => {
    expect(adminSrc).toContain('description: error.message');
  });

  it('warns an account with no events role before it fills in a form', () => {
    expect(adminSrc).toContain('This account has no events role');
  });

  it('exposes the host naming decision as a field', () => {
    expect(adminSrc).toContain('Hosted by');
  });
});

describe('the access migration', () => {
  it('admits catalogue managers everywhere the module writes', () => {
    for (const table of ['events', 'event_sessions', 'event_submissions', 'event_sources']) {
      expect(migrationSrc).toContain(table);
    }
    expect(migrationSrc).toContain("'catalogue_manager', 'accountant', 'admin', 'super_admin'");
  });

  it('stops get_event leaking drafts to the public', () => {
    expect(migrationSrc).toMatch(
      /status = 'published' OR public\.is_events_manager\(auth\.uid\(\)\)[\s\S]*ORDER BY s\.session_no/
    );
  });

  it('returns the columns the client reads', () => {
    for (const col of ['source', 'booking_mode', 'listing_tier', 'organiser_name', 'fee_payer', 'fee_bps']) {
      expect(migrationSrc).toContain(col);
    }
  });

  it('never overwrites a human decision on replay', () => {
    expect(migrationSrc).toContain('AND external_booking_url IS NULL');
    expect(migrationSrc).toContain('AND host_name IS NULL');
  });

  it('keeps event history append only', () => {
    expect(migrationSrc).not.toMatch(/GRANT\s+(UPDATE|DELETE)\s+ON\s+public\.event_revisions/i);
  });
});

describe('no invented facts in the events surface', () => {
  it('the content file holds no session the listing does not name', () => {
    // The five titles above are exhaustive; a sixth card must fail loudly.
    expect(wellness.programme).toHaveLength(5);
  });

  it('banned figures stay out', () => {
    for (const src of [contentSrc, detailSrc, adminSrc]) {
      for (const banned of ['173', 'R6,200.14', '127 ']) {
        expect(src).not.toContain(banned);
      }
    }
  });

  it('every entry in EVENT_CONTENT names its source', () => {
    for (const [slug, entry] of Object.entries(EVENT_CONTENT)) {
      expect(entry.source, slug).toBeTruthy();
    }
  });
});
