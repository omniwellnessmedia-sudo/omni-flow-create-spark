import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EntityRevenue {
  entity_id: string;
  slug: string;
  name: string;
  entity_type: 'commercial' | 'npc' | 'tourism' | 'brand' | 'education';
  brand_color: string;
  display_order: number;
  total_mtd: number;
  total_ytd: number;
  bookings_mtd: number;
  tours_mtd: number;
  orders_mtd: number;
  affiliate_mtd: number;
}

// Reads the entity_revenue_summary view and keeps it live on any change to the
// underlying money tables. View/columns match 20260525120000_entity_portfolio_accounting.sql.
export function useEntityRevenue() {
  const [data, setData] = useState<EntityRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data, error } = await supabase
        .from('entity_revenue_summary')
        .select('*')
        .order('display_order', { ascending: true });

      if (!mounted) return;
      if (error) { setError(error.message); setLoading(false); return; }
      setData((data ?? []) as EntityRevenue[]);
      setError(null);
      setLoading(false);
    }

    load();

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedLoad = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(load, 400);
    };

    const channel = supabase
      .channel('accounting-portfolio-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, debouncedLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tour_bookings' }, debouncedLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, debouncedLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'affiliate_commissions' }, debouncedLoad)
      .subscribe();

    return () => {
      mounted = false;
      if (refreshTimer) clearTimeout(refreshTimer);
      supabase.removeChannel(channel);
    };
  }, []);

  const totals = data.reduce(
    (acc, e) => ({
      mtd: acc.mtd + Number(e.total_mtd || 0),
      ytd: acc.ytd + Number(e.total_ytd || 0),
    }),
    { mtd: 0, ytd: 0 }
  );

  return { data, loading, error, totals };
}
