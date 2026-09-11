import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The admin surface, pinned.
 *
 * Two separate complaints from the people who use these screens daily:
 * the admin looked like a different product from the public site, and
 * Leads went stale while it sat open. Both are fixed by things that are
 * easy to undo by accident, so both are checked here.
 */

const root = join(__dirname, '..', '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');

/** Relative luminance per WCAG 2.x, from an "H S% L%" token value. */
const luminanceFromHslToken = (token: string): number => {
  const [h, s, l] = token.trim().split(/\s+/).map((v) => parseFloat(v));
  const S = s / 100;
  const L = l / 100;
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = L - c / 2;
  const seg = Math.floor(h / 60) % 6;
  const rgb = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][seg].map((v) => v + m);
  const lin = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};

const contrast = (a: string, b: string) => {
  const la = luminanceFromHslToken(a);
  const lb = luminanceFromHslToken(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

const tokenValue = (css: string, name: string): string => {
  const block = css.slice(css.indexOf('.admin-surface {'));
  const match = block.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`--${name} is not defined on .admin-surface`);
  return match[1];
};

describe('admin surface theme', () => {
  const css = read('src/index.css');

  it('is applied by the shell, so every screen inherits it', () => {
    const layout = read('src/components/dashboard/AdminLayout.tsx');
    expect(layout).toMatch(/className="admin-surface min-h-screen bg-background"/);
  });

  it('paints its ground from the token, not a hardcoded hex', () => {
    // A hardcoded #FAF8F2 on the content area and a token-driven cream on
    // the cards is how the two ends of one screen drift apart.
    const layout = read('src/components/dashboard/AdminLayout.tsx');
    expect(layout).not.toMatch(/background: '#FAF8F2'/);
  });

  it.each([
    ['foreground', 'background', 4.5, 'body text on the ground'],
    ['muted-foreground', 'background', 4.5, 'secondary text on the ground'],
    ['foreground', 'card', 4.5, 'body text on a card'],
    ['primary-foreground', 'primary', 4.5, 'label on the primary button'],
    ['destructive-foreground', 'destructive', 4.5, 'label on the destructive button'],
  ])('%s on %s meets WCAG 2.2 AA', (fg, bg, min, what) => {
    const ratio = contrast(tokenValue(css, fg), tokenValue(css, bg));
    expect(ratio, `${what} is ${ratio.toFixed(2)}:1, below ${min}:1`).toBeGreaterThanOrEqual(min);
  });

  it('puts ink on the teal primary rather than white', () => {
    // White on this teal is about 2.4:1. The pairing is the whole point of
    // defining primary-foreground here, so a later edit that "tidies" it to
    // white should fail loudly.
    const white = '0 0% 100%';
    const primary = tokenValue(css, 'primary');
    expect(contrast(white, primary)).toBeLessThan(4.5);
    expect(contrast(tokenValue(css, 'primary-foreground'), primary)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('leads stays current', () => {
  const leads = read('src/pages/admin/AdminLeads.tsx');

  it('subscribes to both lead tables', () => {
    // It fetched once on mount and never again, so an enquiry that arrived
    // while the screen sat open was invisible until somebody reloaded.
    expect(leads).toMatch(/\.channel\(["']admin-leads["']\)/);
    expect(leads).toMatch(/table: "contact_submissions"/);
    expect(leads).toMatch(/table: "service_quotes"/);
  });

  it('removes the channel when the screen unmounts', () => {
    expect(leads).toMatch(/supabase\.removeChannel\(channel\)/);
  });

  it('refetches quietly in the background', () => {
    // A background refetch must not blank the list somebody is reading, and
    // must not wipe good data when one read is refused.
    expect(leads).toMatch(/\{ quiet: true \}/);
    expect(leads).toMatch(/if \(!quiet\) setLoading\(false\)/);
  });

  it('opens with a heading that names the screen', () => {
    // It opened straight into four stat cards. On a phone, where the
    // sidebar is behind a hamburger, nothing on screen said "Leads".
    expect(leads).toMatch(/<AdminScreenHeader/);
    expect(leads).toMatch(/title="Leads"/);
  });
});

describe('the screen header', () => {
  const header = read('src/components/admin/AdminScreenHeader.tsx');

  it('renders its title as the h1', () => {
    // The shell has no h1, so without one here a screen of h3 card titles
    // starts at level three with no top level landmark.
    expect(header).toMatch(/<h1[^>]*>\{title\}<\/h1>/);
  });
});

describe('every admin screen names itself', () => {
  // Thirteen of these opened with no heading at all. An operator arriving
  // from search, a bookmark or the sidebar saw cards and numbers with
  // nothing saying what they were looking at, and on a phone the sidebar is
  // behind a hamburger so there was no name on screen anywhere.
  const SCREENS = [
    'AdminAccounting',
    'AdminAnalytics',
    'AdminContent',
    'AdminInvites',
    'AdminLeads',
    'AdminProviders',
    'AdminSchedule',
    'AdminSettings',
    'AdminTasks',
    'AdminTeamManagement',
    'AdminTools',
    'AdminUWCRecruitment',
    'AdminViatorTours',
    'ProductManagement',
  ];

  it.each(SCREENS)('%s opens with a screen header', (screen) => {
    const src = read(`src/pages/admin/${screen}.tsx`);
    expect(src).toMatch(/<AdminScreenHeader/);
    expect(src, 'the header needs a title').toMatch(/title="[^"]+"/);
  });

  it.each(SCREENS)('%s has exactly one screen header', (screen) => {
    // Two would mean two h1 elements, which is the heading-order problem
    // this was added to solve, reintroduced.
    const src = read(`src/pages/admin/${screen}.tsx`);
    const count = (src.match(/<AdminScreenHeader/g) || []).length;
    expect(count).toBe(1);
  });
});

describe('admin back navigation', () => {
  const dashboard = read('src/pages/AdminDashboard.tsx');

  it('pushes a history entry when the section changes', () => {
    // It replaced unconditionally. Moving Home to Leads to Accounting to
    // Tasks left one history entry, so one Back press ejected the operator
    // from the admin entirely instead of returning them to Accounting.
    expect(dashboard).not.toMatch(/\},\s*\{ replace: true \}\);/);
    expect(dashboard).toMatch(/replace: section === current/);
  });

  it('still replaces when re-selecting the current section', () => {
    // Clicking the sidebar item you are already on should not add an entry
    // you then have to press Back through.
    expect(dashboard).toMatch(/const current = searchParams\.get\("section"\) \|\| "home";/);
  });

  it('keeps a way back to the dashboard from every standalone screen', () => {
    const layout = read('src/components/dashboard/AdminLayout.tsx');
    expect(layout).toMatch(/\{!onDashboard && \(/);
    expect(layout).toMatch(/<Link to="\/admin-dashboard">/);
  });
});
