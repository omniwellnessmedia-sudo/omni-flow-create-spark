import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EntityRevenue } from '@/hooks/useEntityRevenue';

const ZAR = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
});

const typeLabel: Record<EntityRevenue['entity_type'], string> = {
  commercial: 'Commercial',
  npc: 'Non-Profit',
  tourism: 'Tourism',
  brand: 'Brand',
  education: 'Education',
};

export function EntityCard({ entity }: { entity: EntityRevenue }) {
  return (
    <Card
      className="border-l-4 transition-shadow hover:shadow-md"
      style={{ borderLeftColor: entity.brand_color }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">{entity.name}</CardTitle>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider shrink-0">
            {typeLabel[entity.entity_type]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">MTD revenue</div>
          <div className="text-2xl font-bold" style={{ color: entity.brand_color }}>
            {ZAR.format(Number(entity.total_mtd || 0))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Stat label="Sessions"  value={entity.bookings_mtd} />
          <Stat label="Tours"     value={entity.tours_mtd} />
          <Stat label="Orders"    value={entity.orders_mtd} />
          <Stat label="Affiliate" value={entity.affiliate_mtd} />
        </div>

        <div className="pt-2 border-t flex items-center justify-between text-xs">
          <span className="text-muted-foreground">YTD</span>
          <span className="font-medium">{ZAR.format(Number(entity.total_ytd || 0))}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{ZAR.format(Number(value || 0))}</span>
    </div>
  );
}
