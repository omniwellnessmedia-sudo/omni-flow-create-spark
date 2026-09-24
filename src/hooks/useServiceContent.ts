import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ContentStatus, ServiceContentRow } from '@/lib/serviceContent';

/**
 * Published offer content for the public pages, and every row for the
 * admin.
 *
 * Failing quietly is the point. The rate card in code renders the site
 * today and keeps rendering it if this table does not exist, the read is
 * refused, or the network is down. A visitor must never see a page get
 * worse because an optional table was unavailable, so there is no error
 * state on the public path: it just returns what it has.
 *
 * No em dashes in this file.
 */

const isMissingTable = (error: { code?: string; message?: string } | null): boolean =>
  !!error &&
  (error.code === '42P01' ||
    error.code === 'PGRST205' ||
    /service_content.*(does not exist|not found|schema cache)/i.test(error.message ?? ''));

type Rows = Record<string, ServiceContentRow | undefined>;

const toMap = (data: unknown): Rows => {
  const next: Rows = {};
  for (const row of (data ?? []) as ServiceContentRow[]) {
    if (row && typeof row.offer_slug === 'string') next[row.offer_slug] = row;
  }
  return next;
};

/**
 * Published content only. For any page a visitor can reach.
 * `ready` says the read has finished, so a page can hold a paint rather
 * than flash the code copy and swap it a moment later.
 */
export const usePublishedServiceContent = () => {
  const [rows, setRows] = useState<Rows>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data, error } = await (supabase
        .from('service_content' as any)
        .select('offer_slug, blurb, bullets, status')
        .eq('status', 'published') as any);
      if (cancelled) return;
      if (!error) setRows(toMap(data));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { rows, ready };
};

/** Every row, draft included. Admin only. */
export const useServiceContentAdmin = () => {
  const [rows, setRows] = useState<Rows>({});
  const [loading, setLoading] = useState(true);
  const [missingTable, setMissingTable] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('service_content' as any)
      .select('offer_slug, blurb, bullets, status, updated_at') as any);
    if (error) {
      if (isMissingTable(error)) setMissingTable(true);
      setLoading(false);
      return;
    }
    setRows(toMap(data));
    setMissingTable(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(
    async (
      slug: string,
      draft: { blurb: string; bullets: string[] },
      status: ContentStatus
    ): Promise<{ error?: string }> => {
      const row = {
        offer_slug: slug,
        blurb: draft.blurb.trim() || null,
        bullets: draft.bullets.map((b) => b.trim()).filter(Boolean),
        status,
      };
      const { error } = await (supabase
        .from('service_content' as any)
        .upsert(row, { onConflict: 'offer_slug' }) as any);
      if (error) {
        if (isMissingTable(error)) setMissingTable(true);
        return {
          error: isMissingTable(error)
            ? 'The service_content table is not on the project yet. Run the migration, then save again.'
            : error.message,
        };
      }
      setRows((r) => ({ ...r, [slug]: { ...row, bullets: row.bullets } as ServiceContentRow }));
      return {};
    },
    []
  );

  return { rows, loading, missingTable, save, reload: load };
};
