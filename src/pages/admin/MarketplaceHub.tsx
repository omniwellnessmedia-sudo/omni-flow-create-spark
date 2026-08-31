import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Store, Package, TrendingUp, HandCoins, Wrench, ArrowRight } from 'lucide-react';

/**
 * One front door for everything the team sells.
 *
 * The marketplace was spread across four screens that overlapped, used
 * different words for the same thing, and in one case were not reachable from
 * the navigation at all. Someone opening the dashboard had no way to tell
 * which one to use, so nothing got maintained and the public shop filled with
 * whatever the affiliate feed happened to contain.
 *
 * This page does no editing of its own. It answers two questions and then
 * sends the person to the right screen: what is live right now, and what is
 * waiting for someone to look at it.
 *
 * No em dashes in this file.
 */

/**
 * A count is either a number or the reason we could not read it. A failed
 * read must never render as "0", because "nothing is waiting for you" and
 * "we could not ask" look identical to the reader and only one of them is
 * safe to act on.
 */
type Count = { ok: true; value: number } | { ok: false; reason: string };

interface Counts {
  shopLive: Count;
  shopWaiting: Count;
  businessesLive: Count;
  businessesDraft: Count;
  localProductsLive: Count;
  localProductsDraft: Count;
}

const UNREAD: Count = { ok: false, reason: 'not loaded' };

const EMPTY: Counts = {
  shopLive: UNREAD,
  shopWaiting: UNREAD,
  businessesLive: UNREAD,
  businessesDraft: UNREAD,
  localProductsLive: UNREAD,
  localProductsDraft: UNREAD,
};

const HUE = '#4FAE3F';

/** Sums counts, but only if every one of them was actually read. */
const sum = (...parts: Count[]): Count => {
  const bad = parts.find((p) => !p.ok);
  if (bad && !bad.ok) return bad;
  return { ok: true, value: parts.reduce((n, p) => n + (p.ok ? p.value : 0), 0) };
};

const MarketplaceHub = () => {
  const [counts, setCounts] = useState<Counts>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Head requests: we want the numbers, not the rows.
      const db = supabase as any;
      const failures: string[] = [];
      const countOf = async (
        label: string,
        table: string,
        build: (q: any) => any
      ): Promise<Count> => {
        try {
          const { count, error } = await build(
            db.from(table).select('id', { count: 'exact', head: true })
          );
          if (error) {
            failures.push(`${label}: ${error.message}`);
            return { ok: false, reason: error.message };
          }
          return { ok: true, value: count ?? 0 };
        } catch (e: any) {
          const message = e?.message || 'request failed';
          failures.push(`${label}: ${message}`);
          return { ok: false, reason: message };
        }
      };

      const [
        shopLive,
        shopWaiting,
        businessesLive,
        businessesDraft,
        localProductsLive,
        localProductsDraft,
      ] = await Promise.all([
        countOf('Shop products showing', 'affiliate_products', (q) =>
          q.eq('is_active', true).eq('is_featured', true)
        ),
        countOf('Shop products waiting', 'affiliate_products', (q) =>
          q.eq('is_active', true).eq('is_featured', false)
        ),
        countOf('Businesses published', 'local_businesses', (q) => q.eq('status', 'published')),
        countOf('Businesses in draft', 'local_businesses', (q) => q.eq('status', 'draft')),
        countOf('Local listings live', 'products', (q) =>
          q.not('business_id', 'is', null).eq('status', 'published')
        ),
        countOf('Local listings in draft', 'products', (q) =>
          q.not('business_id', 'is', null).eq('status', 'draft')
        ),
      ]);

      if (cancelled) return;
      setCounts({
        shopLive,
        shopWaiting,
        businessesLive,
        businessesDraft,
        localProductsLive,
        localProductsDraft,
      });
      setProblems(failures);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const jobs = [
    {
      to: '/admin/products',
      icon: Package,
      title: 'Approve products for the shop',
      body:
        'Products from our affiliate partners stay hidden until someone here approves them. Look at the picture, then decide.',
      live: counts.shopLive.ok
        ? `${counts.shopLive.value} showing on the site`
        : 'Could not read how many are showing',
      waiting: counts.shopWaiting,
      waitingLabel: 'waiting to be reviewed',
    },
    {
      to: '/admin/catalogue',
      icon: Store,
      title: 'Add a local wellness business',
      body:
        'Onboard a South African practitioner, studio or shop, and list what they offer. Saved as a draft first, published when you are happy with it.',
      live:
        counts.businessesLive.ok && counts.localProductsLive.ok
          ? `${counts.businessesLive.value} businesses published, ${counts.localProductsLive.value} of their listings live`
          : 'Could not read how many are published',
      waiting: sum(counts.businessesDraft, counts.localProductsDraft),
      waitingLabel: 'drafts not yet published',
    },
  ];

  const reference = [
    {
      to: '/admin/affiliate-performance',
      icon: TrendingUp,
      title: 'Affiliate performance',
      body: 'What is being clicked and what it earned.',
    },
    {
      to: '/admin/affiliate-payouts',
      icon: HandCoins,
      title: 'Affiliate payouts',
      body: 'Money owed and money paid.',
    },
    {
      to: '/admin-dashboard?section=products',
      icon: Wrench,
      title: 'Import tools',
      body:
        'Bulk import and partner feed sync. Rarely needed. Nothing imported here reaches the public shop until it is approved.',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl p-6">
      <p
        className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
        style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
      >
        <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: HUE }} />
        Marketplace
      </p>
      <h1 className="mt-1 font-wwpl-display text-3xl font-medium">What we sell</h1>
      <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">
        Two things need a person: approving affiliate products before shoppers see them, and
        onboarding local wellness businesses. Everything else on this page is there to look at,
        not to maintain.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {problems.length > 0 && (
            <Card className="mt-6 border-amber-200 bg-amber-50/60">
              <CardContent className="py-4">
                <p className="text-sm font-medium text-amber-900">
                  Some numbers on this page could not be read
                </p>
                <p className="mt-1 text-sm text-amber-900">
                  The screens below still work. This usually means the database refused the
                  request for the account you are signed in with. Send this to Tumelo as it is
                  written:
                </p>
                <ul className="mt-2 space-y-1">
                  {problems.map((p) => (
                    <li
                      key={p}
                      className="text-xs text-amber-900"
                      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {jobs.map((job) => (
              <Link key={job.to} to={job.to} className="group">
                <Card className="h-full transition-colors hover:border-foreground/20">
                  <CardContent className="flex h-full flex-col gap-3 py-6">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 items-center justify-center rounded-full"
                        style={{ background: `${HUE}1A`, color: HUE }}
                      >
                        <job.icon className="h-4 w-4" />
                      </span>
                      <h2 className="text-[17px] font-medium">{job.title}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.body}</p>
                    <div className="mt-auto pt-3">
                      {!job.waiting.ok ? (
                        <p className="text-sm font-medium text-amber-700">
                          Could not check what is waiting
                        </p>
                      ) : job.waiting.value > 0 ? (
                        <p className="text-sm font-medium">
                          {job.waiting.value} {job.waitingLabel}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nothing waiting</p>
                      )}
                      <p className="text-xs text-muted-foreground">{job.live}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                        Open
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <h2 className="mt-10 text-sm font-medium">Reference</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {reference.map((item) => (
              <Link key={item.to} to={item.to}>
                <Card className="h-full transition-colors hover:border-foreground/20">
                  <CardContent className="flex h-full flex-col gap-2 py-5">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <p className="mt-8 max-w-[70ch] text-xs text-muted-foreground">
            The public shop pages are currently kept out of search results. They come back into
            search once there is a curated set of products worth sending someone to.
          </p>
        </>
      )}
    </div>
  );
};

export { MarketplaceHub };
export default MarketplaceHub;
