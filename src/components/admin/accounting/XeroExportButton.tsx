import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * XeroExportButton — exports a period's sales into Xero's Sales Invoice CSV format.
 *
 * Columns follow Xero's documented Sales Import template:
 *   ContactName, EmailAddress, InvoiceNumber, InvoiceDate, DueDate,
 *   Description, Quantity, UnitAmount, AccountCode, TaxType, Currency,
 *   TrackingName1, TrackingOption1
 *
 * Each booking / tour / order becomes one invoice line. AccountCode defaults to
 * 200 (Sales) and TaxType to OUTPUT2 (SA 15% VAT) — Steven should adjust these
 * once the chart of accounts is finalised. TrackingOption1 carries the entity
 * (Omni / TNT / ROAM…) so Xero tracking categories pick up the brand split.
 */

type Period = 'this_month' | 'last_month' | 'ytd';

const csvEscape = (v: unknown) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const fmtDate = (d: string) => new Date(d).toISOString().split('T')[0];

function periodBounds(p: Period): { start: string; end: string } {
  const now = new Date();
  let start: Date;
  let end: Date;
  if (p === 'this_month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else if (p === 'last_month') {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear() + 1, 0, 1);
  }
  return { start: start.toISOString(), end: end.toISOString() };
}

export function XeroExportButton() {
  const [period, setPeriod] = useState<Period>('this_month');
  const [loading, setLoading] = useState(false);

  async function exportXero() {
    setLoading(true);
    try {
      const { start, end } = periodBounds(period);

      const [ordersRes, toursRes, bookingsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id, order_number, customer_name, customer_email, product_name, amount, currency, created_at, status')
          .gte('created_at', start)
          .lt('created_at', end)
          .in('status', ['completed', 'processing']),
        supabase
          .from('tour_bookings')
          .select('id, contact_name, contact_email, total_price, status, created_at, tours(title)')
          .gte('created_at', start)
          .lt('created_at', end)
          .in('status', ['completed', 'confirmed']),
        supabase
          .from('bookings')
          .select('id, amount_zar, status, created_at, services(title)')
          .gte('created_at', start)
          .lt('created_at', end)
          .in('status', ['completed', 'confirmed']),
      ]);

      const header = [
        'ContactName', 'EmailAddress', 'InvoiceNumber', 'InvoiceDate', 'DueDate',
        'Description', 'Quantity', 'UnitAmount', 'AccountCode', 'TaxType',
        'Currency', 'TrackingName1', 'TrackingOption1',
      ];
      const rows: string[][] = [];

      for (const o of (ordersRes.data || [])) {
        const date = fmtDate(o.created_at);
        rows.push([
          o.customer_name || 'Customer',
          o.customer_email || '',
          o.order_number || `ORD-${o.id.slice(0, 8)}`,
          date, date,
          `Order: ${o.product_name || 'Store purchase'}`,
          '1',
          String(o.amount || 0),
          '200', 'OUTPUT2',
          (o.currency || 'ZAR').toUpperCase(),
          'Entity', 'ROAM',
        ]);
      }

      for (const t of (toursRes.data || [])) {
        const date = fmtDate(t.created_at);
        const tourTitle = (t as any).tours?.title;
        rows.push([
          t.contact_name || 'Tour Guest',
          t.contact_email || '',
          `TOUR-${t.id.slice(0, 8)}`,
          date, date,
          `Tour booking: ${tourTitle || 'Wellness tour'}`,
          '1',
          String(t.total_price || 0),
          '200', 'OUTPUT2', 'ZAR',
          'Entity', 'TNT',
        ]);
      }

      for (const b of (bookingsRes.data || [])) {
        const date = fmtDate(b.created_at);
        const svcTitle = (b as any).services?.title;
        rows.push([
          'Client',
          '',
          `BK-${b.id.slice(0, 8)}`,
          date, date,
          `Wellness session: ${svcTitle || 'Provider booking'}`,
          '1',
          String(b.amount_zar || 0),
          '200', 'OUTPUT2', 'ZAR',
          'Entity', 'Omni',
        ]);
      }

      if (rows.length === 0) {
        toast.info('No completed sales in that period to export.');
        return;
      }

      const csv = [header.join(','), ...rows.map(r => r.map(csvEscape).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `xero-sales-${period}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${rows.length} sales line${rows.length === 1 ? '' : 's'} for Xero`);
    } catch (err: any) {
      console.error(err);
      toast.error('Xero export failed: ' + (err?.message || 'unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this_month">This month</SelectItem>
          <SelectItem value="last_month">Last month</SelectItem>
          <SelectItem value="ytd">Year to date</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={exportXero} disabled={loading} className="h-8 text-xs">
        {loading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
        Export for Xero
      </Button>
    </div>
  );
}
