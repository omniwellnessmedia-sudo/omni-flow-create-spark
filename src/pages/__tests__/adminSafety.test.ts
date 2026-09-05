import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The admin surface, held to the controls it claims to have.
 *
 * These pin the findings of the admin audit on 5 September 2026. Each one
 * failed before that audit, so each is a regression test rather than a
 * statement of intent.
 *
 * No em dashes in this file.
 */

const adminDir = resolve(__dirname, '../admin');
const read = (p: string) => readFileSync(resolve(__dirname, p), 'utf8');
const adminPages = readdirSync(adminDir).filter((f) => f.endsWith('.tsx'));
const migrations = readdirSync(resolve(__dirname, '../../../supabase/migrations'))
  .filter((f) => f.endsWith('.sql'))
  .map((f) => readFileSync(resolve(__dirname, '../../../supabase/migrations', f), 'utf8'))
  .join('\n');

describe('nothing can bulk publish to the storefront', () => {
  it('no admin screen calls the auto curation function', () => {
    // One click on this used to feature every active product with commission
    // above 15 per cent, which is how unvetted catalogue photography reached
    // a live collection page. The button was removed from Product Curation in
    // August and a second copy survived in Admin Tools until 5 September.
    for (const f of adminPages) {
      const src = readFileSync(resolve(adminDir, f), 'utf8');
      expect(src, f).not.toMatch(/rpc\(\s*['"]auto_curate_featured_products/);
    }
  });

  it('the function is revoked and dropped in a migration', () => {
    expect(migrations).toContain('REVOKE EXECUTE ON FUNCTION public.auto_curate_featured_products() FROM authenticated');
    expect(migrations).toContain('DROP FUNCTION IF EXISTS public.auto_curate_featured_products()');
  });

  it('the storefront gate still reads is_featured', () => {
    const gate = read('../../config/catalogueGate.ts');
    expect(gate).toContain("eq('is_featured', true)");
  });
});

describe('access is granted honestly', () => {
  const tools = readFileSync(resolve(adminDir, 'AdminTools.tsx'), 'utf8');

  it('grants the roles the application actually gates on', () => {
    // Before the audit only "admin" could be granted, so every request for
    // catalogue or accounting access needed a developer and a SQL statement.
    for (const role of ['catalogue_manager', 'accountant', 'admin']) {
      expect(tools).toContain(`'${role}'`);
    }
  });

  it('carries no hardcoded address that receives standing access', () => {
    // The removed button was labelled Chad, Zenith and Feroza while granting
    // admin to a transposed company address and an external provider.
    expect(tools).not.toMatch(/omnimediawellness@/);
    expect(tools).not.toMatch(/sandy@druyogacapetown/);
    expect(tools).not.toMatch(/addPredefinedAdmins/);
  });

  it('says who may grant, before the form is filled in', () => {
    // Writing user_roles needs super_admin. A plain admin used to get a
    // generic failure that reads like a mistyped address.
    expect(tools).toContain('super_admin');
    expect(tools).toContain('You can see who has access, but not change it');
  });

  it('shows the database refusal rather than a generic message', () => {
    expect(tools).toContain('description: error.message');
  });

  it('the team directory says it grants nothing', () => {
    const dir = readFileSync(resolve(adminDir, 'AdminTeamManagement.tsx'), 'utf8');
    expect(dir).toContain('IT GRANTS NO ACCESS TO ANYTHING');
  });
});

describe('money screens never pass a failed read off as zero', () => {
  const accounting = readFileSync(resolve(adminDir, 'AdminAccounting.tsx'), 'utf8');
  const analytics = readFileSync(resolve(adminDir, 'AdminAnalytics.tsx'), 'utf8');

  it('the accounting screen inspects every query error', () => {
    // The Supabase client reports errors in `error` and does not throw, so a
    // try/catch alone let an RLS denial render as R0.00 for the period.
    expect(accounting).toContain('setReadFailures');
    expect(accounting).toContain('collect("Orders", ordersRes)');
    expect(accounting).toContain('These totals are incomplete. Do not report from them.');
  });

  it('the accounting screen refuses to export an incomplete period', () => {
    expect(accounting).toContain('Not exporting an incomplete period');
    // The guard must sit before any CSV is assembled.
    const guardAt = accounting.indexOf('Not exporting an incomplete period');
    const buildAt = accounting.indexOf('csvContent = "Date,Order Number');
    expect(guardAt).toBeGreaterThan(-1);
    expect(guardAt).toBeLessThan(buildAt);
  });

  it('the analytics screen reports failed reads', () => {
    expect(analytics).toContain('setReadFailures');
    expect(analytics).toContain('These numbers are incomplete');
  });
});
