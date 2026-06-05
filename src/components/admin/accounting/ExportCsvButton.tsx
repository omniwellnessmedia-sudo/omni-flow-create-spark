import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { EntityRevenue } from '@/hooks/useEntityRevenue';

export function ExportCsvButton({ rows }: { rows: EntityRevenue[] }) {
  function handleExport() {
    const header = [
      'entity_slug', 'entity_name', 'entity_type', 'total_mtd', 'total_ytd',
      'bookings_mtd', 'tours_mtd', 'orders_mtd', 'affiliate_mtd',
    ];
    const lines = rows.map(r => [
      r.slug, `"${r.name}"`, r.entity_type,
      r.total_mtd, r.total_ytd,
      r.bookings_mtd, r.tours_mtd, r.orders_mtd, r.affiliate_mtd,
    ].join(','));
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni-portfolio-revenue-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
