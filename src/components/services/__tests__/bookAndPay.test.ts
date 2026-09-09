import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The book and pay button, which charges real people real money.
 *
 * No em dashes in this file.
 */

const btn = readFileSync(resolve(__dirname, '../BookAndPayButton.tsx'), 'utf8');
const detail = readFileSync(resolve(__dirname, '../../../pages/ServiceOfferDetail.tsx'), 'utf8');
const migrations = readFileSync(
  resolve(__dirname, '../../../../supabase/migrations/20260909120000_booking_links.sql'), 'utf8'
);

describe('nothing can charge anybody until somebody switches it on', () => {
  it('renders nothing while the link is empty', () => {
    // This is the whole safety mechanism. The button must not be able to
    // go live before the money can actually reach the account.
    expect(btn).toContain("const url = useSiteSetting(settingKey, '').trim();");
    expect(btn).toContain('if (!url) return null;');
  });

  it('the setting ships empty', () => {
    expect(migrations).toContain("'booking_url_clarity_session',\n    '',");
  });

  it('says in the setting itself why it is empty', () => {
    // Whoever fills this in months from now needs to know the button
    // charges people the moment it is live.
    expect(migrations).toContain('the button charges people the moment it is live');
  });

  it('accepts only an https cal.com link', () => {
    // A mistyped or internal value must not become a button that takes
    // somebody off to nowhere with their card out.
    expect(btn).toContain("parsed.protocol === 'https:'");
    expect(btn).toContain('cal\\.com$');
    expect(btn).toContain('if (!safe) return null;');
  });
});

describe('it does not restate anything that lives elsewhere', () => {
  it('prints no price', () => {
    // The rate card price is already on the page. A second copy is a place
    // for it to drift.
    expect(btn).not.toMatch(/R\s?\d[\d,]*/);
    expect(btn).not.toContain('1500');
  });

  it('reads its link per offer rather than hardcoding one', () => {
    expect(detail).toContain('booking_url_${offer.slug.replace');
  });

  it('records the conversion, since a paid booking is the strongest one we get', () => {
    expect(btn).toContain("trackAdsConversion('booking_inquiry')");
  });
});

describe('switching it on is a deliberate act', () => {
  const settingUi = readFileSync(
    resolve(__dirname, '../../admin/BookingLinkSetting.tsx'), 'utf8'
  );
  const adminSettings = readFileSync(
    resolve(__dirname, '../../../pages/admin/AdminSettings.tsx'), 'utf8'
  );

  it('there is a screen for it, not just a database row', () => {
    expect(adminSettings).toContain('<BookingLinkSetting />');
  });

  it('warns that saving makes it possible to charge a stranger', () => {
    expect(settingUi).toContain('Anyone can be charged from the moment you save');
    expect(settingUi).toContain('window.confirm');
  });

  it('tells you to confirm payouts work before filling it in', () => {
    expect(settingUi).toContain('can actually pay out to a South African');
  });

  it('applies the same link rule as the button', () => {
    expect(settingUi).toContain("u.protocol === 'https:'");
    expect(settingUi).toContain('cal\\.com$');
  });

  it('is held to super admin', () => {
    expect(settingUi).toContain("roles.includes('super_admin')");
  });

  it('can be switched off again', () => {
    expect(settingUi).toContain('Clear, and remove the button');
  });
});
