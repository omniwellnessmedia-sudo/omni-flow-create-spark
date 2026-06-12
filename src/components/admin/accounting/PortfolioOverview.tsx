import { useState } from 'react';
import { useEntityRevenue } from '@/hooks/useEntityRevenue';
import { EntityCard } from './EntityCard';
import { ExportCsvButton } from './ExportCsvButton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const ZAR = new Intl.NumberFormat('en-ZA', {
  style: 'currency', currency: 'ZAR', maximumFractionDigits: 0,
});

type Filter = 'all' | 'commercial' | 'npc' | 'tourism' | 'brand' | 'education';

// Multi-entity portfolio view — drops into the existing AdminAccounting page as a tab.
// Commercial and Foundation flows are separated at source via entity_id tagging.
export default function PortfolioOverview() {
  const { data, loading, error, totals } = useEntityRevenue();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? data : data.filter(e => e.entity_type === filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Portfolio Overview</h2>
          <p className="text-sm text-muted-foreground">
            Live, cross-entity revenue. Foundation and commercial flows are separated at source.
          </p>
        </div>
        <ExportCsvButton rows={filtered} />
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Portfolio MTD</div>
            <div className="text-3xl font-bold">{ZAR.format(totals.mtd)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Portfolio YTD</div>
            <div className="text-3xl font-bold">{ZAR.format(totals.ytd)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="npc">Non-profit</TabsTrigger>
          <TabsTrigger value="tourism">Tourism</TabsTrigger>
          <TabsTrigger value="brand">Brands</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
      </Tabs>

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-2 pt-6 text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm">{error}</span>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">No entities match this filter.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(entity => <EntityCard key={entity.entity_id} entity={entity} />)}
        </div>
      )}

      <footer className="pt-2 text-xs text-muted-foreground">
        Live from Supabase. Xero sync: <strong>Phase 1 pending</strong> — awaiting chart of accounts.
        Donations stream activates when the donations table lands.
      </footer>
    </div>
  );
}
