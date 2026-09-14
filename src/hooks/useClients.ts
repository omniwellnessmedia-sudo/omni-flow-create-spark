import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePipelineLeads } from '@/hooks/usePipelineLeads';
import { buildClients, type ActivityRow, type Client } from '@/lib/clients';

/**
 * Every client, assembled from what the site already stores.
 *
 * Leads come from usePipelineLeads (already live). Orders, bookings,
 * subscribers and the activity log are read once and again on demand;
 * they change far less often than leads, and a client card that is a few
 * minutes behind on an order is not a problem the way a missed enquiry is.
 *
 * No em dashes in this file.
 */

type Row = Record<string, unknown>;

interface Extras {
  activities: ActivityRow[];
  orders: Row[];
  bookings: Row[];
  subscribers: Row[];
  loading: boolean;
  error: string | null;
}

export const useClients = () => {
  const pipeline = usePipelineLeads();
  const [extras, setExtras] = useState<Extras>({ activities: [], orders: [], bookings: [], subscribers: [], loading: true, error: null });

  const loadExtras = useCallback(async () => {
    const [activities, orders, bookings, subscribers] = await Promise.all([
      supabase.from('lead_activities').select('*').order('created_at', { ascending: false }).limit(2000),
      supabase.from('orders').select('id, created_at, customer_email, customer_name, product_name, amount, total_zar, status').order('created_at', { ascending: false }).limit(1000),
      supabase.from('tour_bookings').select('id, created_at, booking_date, contact_email, contact_name, contact_phone, participants, total_price, status, tours(title)').order('created_at', { ascending: false }).limit(1000),
      supabase.from('newsletter_subscribers').select('email, subscribed_at, created_at, unsubscribed').limit(5000),
    ]);
    const failed = [activities.error, orders.error, bookings.error, subscribers.error].find(Boolean);
    setExtras({
      activities: (activities.data ?? []) as unknown as ActivityRow[],
      orders: (orders.data ?? []) as Row[],
      bookings: (bookings.data ?? []) as unknown as Row[],
      subscribers: (subscribers.data ?? []) as Row[],
      loading: false,
      error: failed ? failed.message : null,
    });
  }, []);

  useEffect(() => { loadExtras(); }, [loadExtras]);

  const clients: Client[] = useMemo(
    () => buildClients({ leads: pipeline.leads, activities: extras.activities, orders: extras.orders, bookings: extras.bookings, subscribers: extras.subscribers }),
    [pipeline.leads, extras]
  );

  const reload = useCallback(async () => {
    await Promise.all([pipeline.reload(true), loadExtras()]);
  }, [pipeline, loadExtras]);

  return {
    clients,
    loading: pipeline.loading || extras.loading,
    error: pipeline.error ?? extras.error,
    reload,
    setStage: pipeline.setStage,
  };
};
