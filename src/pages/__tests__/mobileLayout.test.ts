import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Three things Feroza found on a phone on 15 September: the social
 * scheduler's tab bar ran off the screen edge, the walk-in form on the
 * Pipeline could not be scrolled so its Save button was unreachable, and
 * the Muizenberg check sheet squeezed an A4 layout into 390px.
 *
 * Measured in a real browser at 390px before these were written; the
 * assertions below pin the fixes so they do not quietly come undone.
 * No em dashes in this file.
 */

const src = (rel: string) => readFileSync(resolve(__dirname, rel), 'utf8');

describe('a dialog fits the phone it opens on', () => {
  const dialog = src('../../components/ui/dialog.tsx');

  it('caps its height at the viewport and scrolls, for every dialog at once', () => {
    expect(dialog).toContain('max-h-[calc(100svh-2rem)]');
    expect(dialog).toContain('overflow-y-auto');
  });

  it('uses svh, so browser chrome appearing cannot push the buttons off', () => {
    expect(dialog).not.toMatch(/max-h-\[calc\(100dvh/);
    expect(dialog).not.toMatch(/max-h-\[calc\(100vh/);
  });

  it('the walk-in form leans on that rather than setting its own', () => {
    const board = src('../../components/admin/PipelineBoard.tsx');
    expect(board).toMatch(/<DialogContent/);
  });
});

describe('a tab bar stays on the screen', () => {
  const tabs = src('../../components/ui/tabs.tsx');

  it('never clips a tab: it is bounded and scrollable', () => {
    expect(tabs).toContain('max-w-full');
    expect(tabs).toContain('overflow-x-auto');
  });

  it('starts at the left, so an overflowing row can be scrolled back to its first tab', () => {
    expect(tabs).toContain('justify-start');
    expect(tabs).not.toMatch(/inline-flex h-14[^"]*justify-center/);
  });

  it('gives triggers phone-sized padding and stops them being squashed', () => {
    expect(tabs).toContain('px-3');
    expect(tabs).toContain('sm:px-5');
    expect(tabs).toContain('shrink-0');
  });

  it('the social scheduler spreads its three tabs evenly instead', () => {
    const social = src('../admin/SocialScheduler.tsx');
    expect(social).toContain('grid w-full grid-cols-3');
    // Icons are desktop only there: with them, three tabs did not fit 390px.
    expect(social.match(/hidden h-4 w-4 sm:mr-2 sm:inline-block/g)).toHaveLength(3);
  });
});

describe('the check sheet is a page, not a reflow', () => {
  const sheet = src('../MuizenbergAuditSheet.tsx');

  it('scales the A4 page down to fit rather than squeezing its columns', () => {
    expect(sheet).toContain('A4_WIDTH_PX');
    expect(sheet).toContain('zoom');
    // max-w-full was what let 210mm of layout collapse into 390px.
    expect(sheet).not.toContain('w-[210mm] max-w-full');
  });

  it('offers actual size, and can be panned when at it', () => {
    expect(sheet).toContain('Actual size');
    expect(sheet).toContain('Fit to screen');
    expect(sheet).toContain('sheet-scroll');
    expect(sheet).toMatch(/sheet-scroll[^"]*overflow-x-auto/);
  });

  it('prints full size whatever the screen did', () => {
    expect(sheet).toMatch(/\.sheet-page\s*\{[^}]*zoom:\s*1\s*!important/);
    expect(sheet).toMatch(/\.sheet-scroll\s*\{\s*overflow:\s*visible\s*!important/);
  });

  it('says what it has done rather than silently shrinking', () => {
    expect(sheet).toContain('percent so the whole A4 page fits');
  });

  it('has tap-sized toolbar controls', () => {
    expect(sheet.match(/min-h-\[44px\]/g)?.length).toBeGreaterThanOrEqual(3);
  });

  it('has no em dashes', () => {
    expect(sheet).not.toMatch(/\u2014/);
  });
});
