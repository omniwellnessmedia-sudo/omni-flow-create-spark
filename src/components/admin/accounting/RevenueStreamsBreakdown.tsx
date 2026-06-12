import { useEntityRevenue } from '@/hooks/useEntityRevenue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Compass, Package, TrendingUp } from 'lucide-react';

const ZAR = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 });

// Aggregates the per-entity view into per-channel totals so the accountant
// sees which revenue streams are actively producing income this month.
export function RevenueStreamsBreakdown() {
  const { data, loading } = useEntityRevenue();

  const streams = data.reduce(
    (acc, e) => ({
      sessions: acc.sessions + Number(e.bookings_mtd || 0),
      tours: acc.tours + Number(e.tours_mtd || 0),
      orders: acc.orders + Number(e.orders_mtd || 0),
      affiliate: acc.affiliate + Number(e.affiliate_mtd || 0),
    }),
    { sessions: 0, tours: 0, orders: 0, affiliate: 0 }
  );

  const total = streams.sessions + streams.tours + streams.orders + streams.affiliate;

  const items = [
    { key: 'sessions',  label: 'Provider Sessions',     desc: 'Wellness practitioner bookings (Omni marketplace).',     icon: Sparkles,   amount: streams.sessions,  color: 'text-omni-violet', acct: 'Account 200 · OUTPUT2 (15%)' },
    { key: 'tours',     label: 'Tours & Retreats',      desc: 'Heritage and wellness tours (Travel & Tours Cape Town).',  icon: Compass,    amount: streams.tours,     color: 'text-omni-blue',   acct: 'Account 200 · OUTPUT2 (15%)' },
    { key: 'orders',    label: 'Store Orders',          desc: 'eSIM plans + 2BeWell products (ROAM by Omni).',            icon: Package,    amount: streams.orders,    color: 'text-omni-orange', acct: 'Account 200 · OUTPUT2 (15%)' },
    { key: 'affiliate', label: 'Affiliate Commissions', desc: 'CJ, Awin, Viator partner programmes (ROAM by Omni).',       icon: TrendingUp, amount: streams.affiliate, color: 'text-omni-green',  acct: 'Account 260 · NONE (commission income)' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Active Revenue Streams (MTD)</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Channel-level breakdown across all entities. Account / tax mapping is the suggested Xero default.
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px] shrink-0">{ZAR.format(total)} total</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map(item => {
            const pct = total > 0 ? Math.round((item.amount / total) * 100) : 0;
            const isActive = item.amount > 0;
            return (
              <div key={item.key} className={`p-3 rounded-lg border ${isActive ? 'bg-card' : 'bg-muted/30 opacity-70'}`}>
                <div className="flex items-start gap-3">
                  <item.icon className={`h-5 w-5 mt-0.5 shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-sm">{item.label}</span>
                      <span className="font-bold text-sm tabular-nums">{ZAR.format(item.amount)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{item.desc}</p>
                    <p className="text-[10px] text-muted-foreground italic mb-1.5">{item.acct}</p>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isActive ? 'bg-primary' : ''}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {pct}% of MTD revenue · {isActive ? 'Active' : 'No revenue this month'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {loading && <p className="text-xs text-muted-foreground text-center mt-4">Refreshing…</p>}
      </CardContent>
    </Card>
  );
}
