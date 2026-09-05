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

/**
 * Source with comments removed.
 *
 * These files explain the defects they fixed, and those explanations quote
 * the old broken expressions verbatim. A "must not contain" assertion over
 * the raw text therefore fails on the very comment that documents the fix,
 * so the guards below read the code only.
 */
const codeOnly = (src: string): string =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
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

describe('the audit findings that corrupt data or mail the wrong people', () => {
  const read = (f: string) => readFileSync(resolve(adminDir, f), 'utf8');

  it('the social scheduler writes the column that exists', () => {
    // The live schema has `platforms`, a NOT NULL social_platform[] array.
    // Every write named a `platform` column that does not exist, so
    // scheduling, editing and bulk import all failed at the database.
    const src = read('SocialScheduler.tsx');
    expect(src).toContain('platforms: [formData.platform]');
    expect(src).toContain('platforms: [platform]');
    expect(src).toContain('post.platforms?.[0]');
    expect(codeOnly(src)).not.toMatch(/\bplatform:\s*formData\.platform\b/);
  });

  it('editing a newsletter cannot wipe its body', () => {
    // openEditDialog seeds an empty body, so regenerating html_content from
    // the form destroyed the stored campaign.
    const src = read('NewsletterEditor.tsx');
    expect(src).toContain('bodyHydrated');
    expect(src).toContain('if (!editingCampaign || bodyHydrated)');
    expect(src).toContain('The saved body is not shown here');
  });

  it('a newsletter cannot be saved or test mailed twice by a double click', () => {
    // Save had no in flight guard, so a second click inserted a second draft
    // of the same campaign, and a second test send mailed the team twice.
    const src = read('NewsletterEditor.tsx');
    expect(src).toContain('if (saving) return;');
    expect(src).toContain('if (sendingTest) return;');
    expect(src).toContain('disabled={saving || sendingTest}');
  });

  it('the newsletter editor does not stack a second header inside the dashboard', () => {
    // It rendered the public SiteHeader and Footer, which put a sticky
    // marketing header under the admin one and a footer mid dashboard.
    const src = codeOnly(read('NewsletterEditor.tsx'));
    expect(src).not.toMatch(/<SiteHeader\b/);
    expect(src).not.toMatch(/<Footer\b/);
  });

  it('the leads screen no longer mails newsletter subscribers instead of leads', () => {
    // It computed the lead list, discarded it, and queued a newsletter
    // campaign, which the sender delivers to confirmed subscribers.
    const src = read('AdminLeads.tsx');
    expect(codeOnly(src)).not.toMatch(/from\("newsletter_campaigns"\)/);
    expect(codeOnly(src)).not.toMatch(/\.insert\(\{\s*name: `Lead Email/);
    expect(src).toContain('mailto:?bcc=');
  });

  it('granting a role happens server side, not against a table nobody can read', () => {
    // profiles has one SELECT policy for signed in users, own row only, so a
    // client side email lookup found nobody and blamed the person.
    const tools = read('AdminTools.tsx');
    expect(tools).toContain("rpc('grant_role_by_email'");
    expect(tools).toContain("rpc('revoke_role'");
    expect(migrations).toContain('CREATE OR REPLACE FUNCTION public.grant_role_by_email');
    expect(migrations).toContain("has_role(auth.uid(), 'super_admin')");
  });

  it('the last super admin cannot be revoked', () => {
    expect(migrations).toContain("'last_super_admin'");
  });

  it('super_admin is not grantable from the application', () => {
    expect(migrations).toContain("'role_not_allowed'");
  });

  it('seeding a provider is confirmed and does not publish listings', () => {
    const tools = read('AdminTools.tsx');
    expect(tools).toContain('window.confirm');
    expect(tools).toContain('active: false');
  });

  it('destructive role removal asks first', () => {
    expect(read('AdminTools.tsx')).toContain('Remove the ${row.role');
  });
});

describe('the accounting screen reports money correctly', () => {
  const accounting = readFileSync(resolve(adminDir, 'AdminAccounting.tsx'), 'utf8');

  it('never sums a foreign currency into a rand total', () => {
    // The old arithmetic fell back to the order's own amount, which is
    // denominated in its own currency, and printed it with an R prefix.
    expect(codeOnly(accounting)).not.toMatch(/total_zar \|\| o\.amount/);
    expect(accounting).toContain('const zarOfOrder');
    expect(accounting).toContain('c.commission_currency === "ZAR"');
  });

  it('says how many rows were left out of the totals', () => {
    // A total that is quietly short is the same class of problem as one that
    // is quietly wrong.
    expect(accounting).toContain('excludedOrders');
    expect(accounting).toContain('Totals below count rand only');
  });

  it('filters payouts by the period the tab is labelled with', () => {
    expect(accounting).toContain('.gte("payout_period_end", from)');
    expect(accounting).toContain('.lte("payout_period_start", to)');
  });

  it('escapes every text field it exports', () => {
    // An unescaped quote, comma or newline shifts every later column, which
    // is how an export becomes wrong rather than obviously broken.
    expect(accounting).toContain("const csv = (value: unknown): string");
    expect(accounting).toContain(`replace(/"/g, '""')`);
    expect(accounting).toContain('csv(o.customer_name)');
    expect(accounting).toContain('csv(t.description)');
    // No row may interpolate a data value straight into a quoted column.
    expect(codeOnly(accounting)).not.toMatch(/"\$\{o\.customer_name\}"/);
    expect(codeOnly(accounting)).not.toMatch(/"\$\{t\.description\}"/);
  });
});

describe('marketing carries a working way off the list', () => {
  const editor = readFileSync(resolve(adminDir, 'NewsletterEditor.tsx'), 'utf8');
  const sender = readFileSync(
    resolve(__dirname, '../../../supabase/functions/send-scheduled-newsletter/index.ts'),
    'utf8'
  );
  const app = readFileSync(resolve(__dirname, '../../App.tsx'), 'utf8');

  it('the unsubscribe link points at a route that exists', () => {
    // Every campaign footer linked to /unsubscribe, which resolved to the
    // not found page, so there was no way off the list but to reply.
    expect(app).toContain('path="/unsubscribe"');
    expect(app).toContain("import('@/pages/Unsubscribe')");
  });

  it('the stored campaign keeps the per recipient placeholder', () => {
    // Substituting one fixed URL at save time flattened the link for
    // everyone, so the sender had nothing left to personalise.
    expect(codeOnly(editor)).not.toMatch(
      /replace\(\/\{\{unsubscribe_url\}\}\/g, 'https:/
    );
    expect(editor).toContain('withPlaceholdersFilled');
  });

  it('the sender addresses the link to the recipient and refuses to send without one', () => {
    expect(sender).toContain("select('id, email, full_name')");
    expect(sender).toContain('/unsubscribe?id=${subscriber.id}');
    expect(sender).toContain("has no unsubscribe link");
  });

  it('the opt out is a function the recipient can call without signing in', () => {
    expect(migrations).toContain('CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter');
    expect(migrations).toContain('GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(uuid) TO anon');
  });

  it('a subscriber sitting at NULL is not silently excluded from every send', () => {
    // The column is nullable and nothing wrote it, and every query asks for
    // unsubscribed = false, which NULL is not.
    expect(migrations).toContain('SET unsubscribed = (unsubscribed_at IS NOT NULL)');
    expect(migrations).toContain('ALTER COLUMN unsubscribed SET NOT NULL');
  });

  it('a subscriber with no name is not greeted by the placeholder', () => {
    expect(sender).toContain('subscriber.full_name || "there"');
  });
});

describe('every built admin screen is reachable', () => {
  const sidebar = readFileSync(resolve(__dirname, '../../components/dashboard/AdminSidebar.tsx'), 'utf8');
  const dashboard = readFileSync(resolve(__dirname, '../AdminDashboard.tsx'), 'utf8');

  it('the three orphaned screens have a nav entry and a section', () => {
    // All three were fully built against live tables and wired to nothing:
    // no route, no section, no import. AdminSettings holds the feature flag
    // switches gating public functionality and the Cal.com booking config,
    // AdminTours is the only editor for the local tours table, and
    // AdminSchedule owns service_time_slots.
    for (const [id, component] of [
      ['settings', 'AdminSettings'],
      ['local-tours', 'AdminTours'],
      ['schedule', 'AdminSchedule'],
    ]) {
      expect(sidebar, `${id} nav entry`).toContain(`id: "${id}"`);
      expect(dashboard, `${id} section`).toContain(`case "${id}":`);
      expect(dashboard, `${component} import`).toContain(`import("@/pages/admin/${component}")`);
    }
  });

  it('local tours does not collide with the Viator screen', () => {
    // "tours" is already bound to AdminViatorTours, which is a different
    // screen against a different table.
    expect(sidebar).toContain('id: "tours", label: "Viator"');
    expect(sidebar).toContain('id: "local-tours"');
  });

  it('the two routed but unlinked screens have nav entries', () => {
    expect(sidebar).toContain('href: "/admin/roambuddy-sales"');
    expect(sidebar).toContain('href: "/admin/roam-marketing"');
  });

  it('the marketplace hub hides links a catalogue manager cannot open', () => {
    // Every screen in that Reference row is gated requireAdmin, so showing
    // them on a catalogue_manager page sent Feroza to an Access Denied wall.
    const hub = readFileSync(resolve(adminDir, 'MarketplaceHub.tsx'), 'utf8');
    expect(hub).toContain('useSecureUserRole');
    expect(hub).toContain('{isAdmin && (');
  });

  it('the viator sync reports the number it actually synced', () => {
    // The edge function returns { success, count, tours, image_stats } and
    // never a cachedTours key, so a successful sync always said zero.
    const viator = readFileSync(resolve(adminDir, 'AdminViatorTours.tsx'), 'utf8');
    expect(codeOnly(viator)).not.toContain('cachedTours');
    expect(viator).toContain('data?.count ?? data?.tours?.length');
  });
});

describe('a failed read is never presented as having nothing', () => {
  const read = (f: string) => readFileSync(resolve(adminDir, f), 'utf8');

  it('there is one shared notice, so the wording cannot drift', () => {
    const notice = readFileSync(
      resolve(__dirname, '../../components/admin/ReadFailureNotice.tsx'), 'utf8'
    );
    expect(notice).toContain('This is not the same as having none');
  });

  it.each([
    ['ProductCuration.tsx', 'the product feed'],
    ['AffiliatePayouts.tsx', 'the commissions queue'],
    ['LocalCatalogue.tsx', 'the catalogue'],
    ['SocialScheduler.tsx', 'the scheduled posts'],
    ['ProductManagement.tsx', 'the product catalogue'],
    ['AdminLeads.tsx', 'the leads'],
    ['AdminUWCRecruitment.tsx', 'the recruitment pipeline'],
  ])('%s shows the notice instead of its empty state', (file, what) => {
    const src = read(file);
    expect(src).toContain('ReadFailureNotice');
    expect(src).toContain(what);
    expect(src).toContain('loadError');
  });

  it('the events desk does not claim an empty calendar it could not read', () => {
    const src = read('EventsAdmin.tsx');
    expect(src).toContain('The events could not be read, so this list is not the calendar.');
    expect(src).toContain("problems.length > 0 ? 'unread'");
  });

  it('saving is refused over a setting that could not be read', () => {
    // A failed read left the webhook box empty, and Save wrote that empty
    // string over the stored URL, disconnecting the automation.
    const src = read('SocialScheduler.tsx');
    expect(src).toContain('Not saving over a setting we could not read');
    expect(src).toContain('settingsError');
  });

  it('the task board is shared, not one person\'s browser', () => {
    // It kept everything in localStorage under omni_admin_tasks, so a task
    // one admin created was invisible to everyone else and to that same
    // person on another device.
    const src = read('AdminTasks.tsx');
    expect(codeOnly(src)).not.toContain('localStorage');
    expect(codeOnly(src)).not.toContain('omni_admin_tasks');
    expect(src).toContain("from('admin_tasks' as any)");
    expect(src).toContain('ReadFailureNotice');
    expect(src).toContain('the task board');
  });

  it('the task board invents no work of its own', () => {
    // First load seeded three sample tasks that read as real assignments,
    // including one telling somebody to contact tour enquiry leads.
    const src = read('AdminTasks.tsx');
    expect(src).not.toContain('Follow up with wellness retreat leads');
    expect(src).not.toContain('Benefits of Dru Yoga');
    expect(src).not.toContain('sampleTasks');
  });

  it('a task that moves on screen has moved in the database', () => {
    // An optimistic move with no rollback showed a card in Done that the
    // next person to open the board would still see in To Do.
    const src = read('AdminTasks.tsx');
    expect(src).toContain('setTasks(previous)');
    expect(src).toContain('Delete "${task?.title');
  });

  it('a session cannot be created without the name the column requires', () => {
    // event_sessions.title is NOT NULL and the form sent null when blank.
    const src = read('EventsAdmin.tsx');
    expect(src).toContain('Give the session a name');
    expect(codeOnly(src)).not.toContain('title: newSession.title.trim() || null');
  });
});
