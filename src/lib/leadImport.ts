import type { PipelineLead } from '@/lib/pipeline';

/**
 * Turning a list of businesses into leads on the board.
 *
 * WHY THIS EXISTS. Leads could reach the pipeline three ways: somebody
 * fills in a form, somebody asks for a quote, or somebody types a walk-in
 * one at a time. A team that has spent an afternoon writing down forty
 * cafes on a road had no way in at all, short of forty dialogs. This takes
 * the list in one paste.
 *
 * PASTE FROM A SPREADSHEET OR A CSV. Both are the same problem once the
 * delimiter is known, and a spreadsheet paste is tab separated, so the
 * delimiter is detected rather than asked about.
 *
 * NOTHING IS INVENTED. A row with no business name is not a lead and is
 * reported rather than filled in with a placeholder. An address that is
 * not an address is flagged and the row still imports without it, because
 * a business you can only phone is still a lead.
 *
 * DUPLICATES ARE THE POINT. Importing the same list twice is the normal
 * mistake, and two cards for one cafe means two people phoning it. Rows
 * are matched against what is already on the board by email first and
 * business name second, and matches are skipped rather than merged.
 *
 * No em dashes in this file.
 */

export interface ImportRow {
  organisation: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  sector: string | null;
  notes: string | null;
}

export type RowVerdict = 'ok' | 'duplicate' | 'problem';

export interface CheckedRow extends ImportRow {
  /** 1 based, counting the header, so it matches what the person sees. */
  line: number;
  verdict: RowVerdict;
  /** Why it is a duplicate or a problem. Empty when ok. */
  reason: string;
}

export interface ImportPlan {
  rows: CheckedRow[];
  ok: CheckedRow[];
  duplicates: CheckedRow[];
  problems: CheckedRow[];
}

/** Split one delimited line, honouring "quoted, fields" and "" escapes. */
export const splitLine = (line: string, delimiter: string): string[] => {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (c === delimiter && !quoted) {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur.trim());
  return out;
};

/**
 * Tab if the text has more tabs than commas, comma otherwise. A paste from
 * a spreadsheet is tab separated; a saved file is usually commas. Business
 * names contain commas far more often than tabs, so counting decides it
 * better than asking would.
 */
export const detectDelimiter = (text: string): string => {
  const head = text.split(/\r?\n/).slice(0, 5).join('\n');
  const tabs = (head.match(/\t/g) ?? []).length;
  const commas = (head.match(/,/g) ?? []).length;
  if (tabs === 0 && commas === 0) return ';';
  return tabs >= commas ? '\t' : ',';
};

const HEADER_WORDS: Record<keyof ImportRow, string[]> = {
  // "shop", "store", "brand" and "venue" are here because that is what the
  // lists people actually paste call the business. A spreadsheet from a
  // market organiser says Shop, not Organisation.
  organisation: [
    'business', 'organisation', 'organization', 'company', 'name', 'trading name',
    'shop', 'store', 'brand', 'venue', 'client', 'customer', 'firm', 'practice', 'outlet',
  ],
  contactPerson: ['contact', 'contact person', 'person', 'owner', 'manager', 'who'],
  email: ['email', 'e mail', 'email address', 'mail'],
  phone: ['phone', 'telephone', 'mobile', 'cell', 'whatsapp', 'number'],
  sector: ['sector', 'type', 'category', 'industry'],
  notes: ['notes', 'note', 'comment', 'comments', 'detail', 'details', 'what we saw'],
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Words that carry no meaning in a column heading. "Company Name" and
 * "Company" are the same column, and matching the whole cell against the
 * vocabulary missed that: a list headed "Company Name, Email" had its heading
 * row imported as a lead called "Company Name", and one headed "Shop Name,
 * Owner, Mail" rejected every row for having no business name. Reported from
 * a real paste on 25 September 2026.
 */
const FILLER = new Set(['name', 'names', 'the', 'full', 'primary', 'main', 'of']);

/** Every spelling of a heading worth testing against the vocabulary. */
const headingForms = (cell: string): string[] => {
  const n = norm(cell);
  if (!n) return [];
  const stripped = n.split(' ').filter((w) => !FILLER.has(w)).join(' ');
  return stripped && stripped !== n ? [n, stripped] : [n];
};

const headingKey = (cell: string): keyof ImportRow | null => {
  const forms = headingForms(cell);
  if (!forms.length) return null;
  for (const key of Object.keys(HEADER_WORDS) as (keyof ImportRow)[]) {
    if (HEADER_WORDS[key].some((w) => forms.includes(w))) return key;
  }
  return null;
};

/** Which column holds what, or null when the first row is data, not headings. */
export const readHeader = (cells: string[]): Partial<Record<keyof ImportRow, number>> | null => {
  const map: Partial<Record<keyof ImportRow, number>> = {};
  cells.forEach((cell, i) => {
    const key = headingKey(cell);
    if (key && map[key] === undefined) map[key] = i;
  });
  // One recognised heading could be a business genuinely called "Contact",
  // so two is the usual test for a header row. The exception is a list with
  // a single column headed "Business": every cell is a heading word and one
  // of them names the business column, which no row of data does. Requiring
  // the business column is what keeps "Contact" on its own reading as data,
  // since a header that cannot say which column holds the business is no
  // use for importing anyway.
  const recognised = Object.keys(map).length;
  if (recognised >= 2) return map;
  const allAreHeadings = cells.filter((c) => c.trim()).every((c) => headingKey(c) !== null);
  return allAreHeadings && map.organisation !== undefined ? map : null;
};

/** The order assumed when there is no header row. */
const POSITIONAL: (keyof ImportRow)[] = ['organisation', 'contactPerson', 'email', 'phone', 'sector', 'notes'];

const clean = (v: string | undefined): string | null => {
  const t = (v ?? '').trim();
  return t ? t : null;
};

/** Deliberately loose: it rejects what is plainly not an address, nothing more. */
export const looksLikeEmail = (v: string): boolean => /^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i.test(v.trim());

/** For matching one business against another: drop case, punctuation and the legal tail. */
export const orgKey = (v: string): string =>
  v
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\b(pty|ltd|limited|inc|cc|npc|the)\b/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const emailKey = (v: string): string => v.trim().toLowerCase();

/** Parse pasted text into rows. Blank lines are skipped, not counted as problems. */
export const parseRows = (text: string): { rows: ImportRow[]; lines: number[] } => {
  const delimiter = detectDelimiter(text);
  const lines = text.split(/\r?\n/);
  const rows: ImportRow[] = [];
  const lineNumbers: number[] = [];

  let header: Partial<Record<keyof ImportRow, number>> | null = null;
  let started = false;

  lines.forEach((raw, index) => {
    if (!raw.trim()) return;
    const cells = splitLine(raw, delimiter);
    if (!started) {
      started = true;
      header = readHeader(cells);
      if (header) return; // the heading row itself is not a lead
    }
    const at = (key: keyof ImportRow): string | null => {
      const i = header ? header[key] : POSITIONAL.indexOf(key);
      return i === undefined || i < 0 ? null : clean(cells[i]);
    };
    rows.push({
      organisation: at('organisation') ?? '',
      contactPerson: at('contactPerson'),
      email: at('email'),
      phone: at('phone'),
      sector: at('sector'),
      notes: at('notes'),
    });
    lineNumbers.push(index + 1);
  });

  return { rows, lines: lineNumbers };
};

/**
 * Check parsed rows against each other and against the board.
 * `existing` is the pipeline as loaded, so a business already on it as a
 * walk-in or an enquiry is not imported a second time.
 */
export const planImport = (text: string, existing: PipelineLead[]): ImportPlan => {
  const { rows, lines } = parseRows(text);

  const seenEmail = new Set<string>();
  const seenOrg = new Set<string>();
  for (const lead of existing) {
    if (lead.email) seenEmail.add(emailKey(lead.email));
    if (lead.org) seenOrg.add(orgKey(lead.org));
    // A walk-in with no organisation carries the business in `name`.
    if (!lead.org && lead.name) seenOrg.add(orgKey(lead.name));
  }

  const checked: CheckedRow[] = rows.map((row, i) => {
    const line = lines[i];
    const base = { ...row, line };

    if (!row.organisation) {
      return { ...base, verdict: 'problem' as const, reason: 'No business name' };
    }
    if (row.email && !looksLikeEmail(row.email)) {
      // Keep the row, lose the bad address: a business you can phone is a lead.
      base.email = null;
      base.notes = [row.notes, `Email as given did not look like an address: ${row.email}`]
        .filter(Boolean)
        .join('\n');
    }

    const ek = base.email ? emailKey(base.email) : null;
    const ok2 = orgKey(row.organisation);

    if (ek && seenEmail.has(ek)) {
      return { ...base, verdict: 'duplicate' as const, reason: 'That email is already on the board' };
    }
    if (seenOrg.has(ok2)) {
      return { ...base, verdict: 'duplicate' as const, reason: 'That business is already on the board' };
    }

    if (ek) seenEmail.add(ek);
    seenOrg.add(ok2);
    return { ...base, verdict: 'ok' as const, reason: '' };
  });

  return {
    rows: checked,
    ok: checked.filter((r) => r.verdict === 'ok'),
    duplicates: checked.filter((r) => r.verdict === 'duplicate'),
    problems: checked.filter((r) => r.verdict === 'problem'),
  };
};

/** A date that many days from today, as the date column wants it. */
export const plusDays = (n: number, now = new Date()): string =>
  new Date(now.getTime() + n * 86400000).toISOString().slice(0, 10);

/** The columns of outreach_leads this writes. Matches the walk-in dialog. */
export interface OutreachInsert {
  organisation: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_method: string;
  sector: string | null;
  campaign: string;
  status: string;
  follow_up_due: string | null;
  notes: string | null;
  owner_id: string | null;
}

/**
 * The outreach_leads row for an imported lead.
 *
 * status 'new' rather than 'no_response': nobody has contacted these yet,
 * and no_response would claim we did and heard nothing.
 */
export const toOutreachRow = (
  row: CheckedRow,
  opts: { campaign: string; followUpDue: string; ownerId: string | null }
): OutreachInsert => ({
  organisation: row.organisation,
  contact_person: row.contactPerson,
  contact_email: row.email,
  contact_method: row.phone ? `imported list, ${row.phone}` : 'imported list',
  sector: row.sector,
  campaign: opts.campaign,
  status: 'new',
  follow_up_due: opts.followUpDue || null,
  notes: row.notes,
  owner_id: opts.ownerId,
});
