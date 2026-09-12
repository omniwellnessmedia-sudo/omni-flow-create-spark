import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The team page names real people.
 *
 * A card carried the right photograph under the wrong name for months.
 * That is worse than a typo: it publishes one person's face as another
 * person's identity, and neither of them agreed to it. This pins the
 * correction so it cannot quietly come back.
 *
 * No em dashes in this file.
 */

const about = readFileSync(resolve(__dirname, '../About.tsx'), 'utf8');
const codeOnly = about.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

describe('the accountant is named correctly', () => {
  it('the card reads Steven Bosch', () => {
    expect(about).toContain('name: "Steven Bosch"');
    expect(about).toContain('initials: "SB"');
  });

  it('the description names him too, not the previous name', () => {
    expect(about).toContain('Steven provides senior financial oversight');
  });

  it('the wrong name appears nowhere in rendered copy', () => {
    // Comments are stripped: the header explains the storage filename is
    // still warren.png, and naming it there must not fail this check.
    expect(codeOnly).not.toContain('Warren');
    expect(codeOnly).not.toContain('warrenPhoto');
  });

  it('the photograph itself is unchanged', () => {
    // The image was always correct. Only the name was wrong, so the URL
    // must not have been swapped while fixing it.
    expect(about).toContain('General%20Images/warren.png');
  });
});
