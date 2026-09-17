import { describe, it, expect } from 'vitest';
import {
  splitLine, detectDelimiter, readHeader, parseRows, planImport,
  looksLikeEmail, orgKey, toOutreachRow, plusDays,
} from '@/lib/leadImport';
import { stageForStatus } from '@/lib/pipeline';
import type { PipelineLead } from '@/lib/pipeline';

/**
 * A list of businesses pasted from a spreadsheet has to become leads
 * without inventing anybody and without putting one cafe on the board
 * twice. No em dashes in this file.
 */

const lead = (over: Partial<PipelineLead>): PipelineLead => ({
  key: 'outreach:1', id: '1', source: 'outreach', name: 'x', org: null, email: null, phone: null,
  service: null, brief: null, status: 'new', stage: 'new', createdAt: '2026-09-17T00:00:00Z',
  lastContacted: null, followUpDue: null, campaign: null, assignedTo: null, raw: {},
  ...over,
});

describe('reading the paste', () => {
  it('keeps a comma that is inside a quoted business name', () => {
    expect(splitLine('"Smith, Jones and Co",bob@x.co.za', ',')).toEqual(['Smith, Jones and Co', 'bob@x.co.za']);
  });

  it('unescapes a doubled quote', () => {
    expect(splitLine('"The ""Blue"" Room",x', ',')).toEqual(['The "Blue" Room', 'x']);
  });

  it('picks tabs for a spreadsheet paste and commas for a CSV', () => {
    expect(detectDelimiter('a\tb\tc\n1\t2\t3')).toBe('\t');
    expect(detectDelimiter('a,b,c\n1,2,3')).toBe(',');
    // Commas inside names must not make a tabbed paste look like a CSV.
    expect(detectDelimiter('Business\tNotes\nSmith, Jones\tgood, keen')).toBe('\t');
  });

  it('spots a heading row, and does not mistake one business for one', () => {
    expect(readHeader(['Business', 'Email', 'Phone'])).toEqual({ organisation: 0, email: 1, phone: 2 });
    expect(readHeader(['Olympia Cafe', 'info@olympiacafe.co.za'])).toBeNull();
  });

  it('reads a single column headed Business, but not one headed Contact', () => {
    // A one column list is a normal way to start. Without the business
    // column named, a header is no use for importing, so it reads as data.
    expect(readHeader(['Business'])).toEqual({ organisation: 0 });
    expect(readHeader(['Contact'])).toBeNull();
  });

  it('reads headed columns in any order', () => {
    const { rows } = parseRows('Email,Business\nhi@a.co.za,Alpha');
    expect(rows).toEqual([
      { organisation: 'Alpha', contactPerson: null, email: 'hi@a.co.za', phone: null, sector: null, notes: null },
    ]);
  });

  it('falls back to a fixed order when there is no heading row', () => {
    const { rows } = parseRows('Alpha,Sam,hi@a.co.za,021 555 0000,Cafe,Keen');
    expect(rows[0].organisation).toBe('Alpha');
    expect(rows[0].contactPerson).toBe('Sam');
    expect(rows[0].phone).toBe('021 555 0000');
  });

  it('skips blank lines without counting them as rows', () => {
    const { rows } = parseRows('Business\nAlpha\n\n\nBeta\n');
    expect(rows.map((r) => r.organisation)).toEqual(['Alpha', 'Beta']);
  });
});

describe('checking the rows', () => {
  it('refuses a row with no business name, and says so', () => {
    const plan = planImport('Business,Email\n,orphan@x.co.za', []);
    expect(plan.ok).toHaveLength(0);
    expect(plan.problems[0].reason).toBe('No business name');
  });

  it('keeps a row whose email is not an address, minus the email', () => {
    const plan = planImport('Business,Email\nAlpha,not an email', []);
    expect(plan.ok).toHaveLength(1);
    expect(plan.ok[0].email).toBeNull();
    expect(plan.ok[0].notes).toContain('not an email');
  });

  it('knows an address from something that is not one', () => {
    expect(looksLikeEmail('info@olympiacafe.co.za')).toBe(true);
    expect(looksLikeEmail('info at olympiacafe')).toBe(false);
    expect(looksLikeEmail('a@b')).toBe(false);
  });

  it('skips a business already on the board, by email', () => {
    const plan = planImport('Business,Email\nAlpha,HI@a.co.za', [lead({ email: 'hi@a.co.za' })]);
    expect(plan.duplicates).toHaveLength(1);
    expect(plan.duplicates[0].reason).toContain('email');
  });

  it('skips one already on the board by name, ignoring case and the legal tail', () => {
    const plan = planImport('Business\nThe Olympia Cafe (Pty) Ltd', [lead({ org: 'Olympia Cafe' })]);
    expect(plan.duplicates).toHaveLength(1);
  });

  it('matches a walk-in that carries the business in its name', () => {
    const plan = planImport('Business\nTigers Milk', [lead({ org: null, name: 'Tigers Milk' })]);
    expect(plan.duplicates).toHaveLength(1);
  });

  it('catches a list that repeats itself', () => {
    const plan = planImport('Business,Email\nAlpha,hi@a.co.za\nAlpha,hi@a.co.za', []);
    expect(plan.ok).toHaveLength(1);
    expect(plan.duplicates).toHaveLength(1);
  });

  it('normalises business names for matching', () => {
    expect(orgKey('Romeo & Vero')).toBe(orgKey('romeo and vero'));
    expect(orgKey('The Olympia Cafe Pty Ltd')).toBe('olympia cafe');
  });

  it('reports the line number a person can see', () => {
    const plan = planImport('Business,Email\nAlpha,hi@a.co.za\n,x@y.co.za', []);
    expect(plan.problems[0].line).toBe(3);
  });
});

describe('what gets written', () => {
  const plan = planImport('Business,Contact,Email,Phone,Sector,Notes\nAlpha,Sam,hi@a.co.za,021 555 0000,Cafe,Keen', []);
  const row = toOutreachRow(plan.ok[0], { campaign: 'muizenberg-cafes', followUpDue: '2026-09-20', ownerId: 'u1' });

  it('lands in New, because nobody has contacted them yet', () => {
    expect(row.status).toBe('new');
    expect(stageForStatus(String(row.status))).toBe('new');
  });

  it('never claims a contact that has not happened', () => {
    // no_response would say we tried and heard nothing, and stamping
    // last_contacted would say when. Neither is true of an imported name.
    expect(row.status).not.toBe('no_response');
    expect(Object.keys(row)).not.toContain('last_contacted');
  });

  it('carries the list name, the follow-up and the owner', () => {
    expect(row.campaign).toBe('muizenberg-cafes');
    expect(row.follow_up_due).toBe('2026-09-20');
    expect(row.owner_id).toBe('u1');
  });

  it('keeps the phone, which outreach_leads has no column for', () => {
    expect(row.contact_method).toBe('imported list, 021 555 0000');
  });

  it('plusDays gives a plain date', () => {
    expect(plusDays(3, new Date('2026-09-17T10:00:00Z'))).toBe('2026-09-20');
  });
});
