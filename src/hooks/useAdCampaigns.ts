import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toSaved, type AdPlan, type SavedCampaign, type SavedStatus } from '@/lib/ads';

/**
 * The team's saved Google Ads copy, one row per offer.
 *
 * The table may not exist yet (the migration has to be run on the
 * project), and in that case the screen still works from drafts; it just
 * cannot save. `missingTable` lets the screen say so in one line instead
 * of failing every save with a Postgres error nobody can read.
 *
 * No em dashes in this file.
 */

const isMissingTable = (error: { code?: string; message?: string } | null): boolean =>
  !!error && (error.code === '42P01' || error.code === 'PGRST205' || /ad_campaigns.*(does not exist|not found|schema cache)/i.test(error.message ?? ''));

export const useAdCampaigns = () => {
  const [saved, setSaved] = useState<Record<string, SavedCampaign | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [missingTable, setMissingTable] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('ad_campaigns' as any)
      .select('offer_slug, campaign, ad_group, final_url, daily_budget, location, copy, status, updated_at') as any);
    if (error) {
      if (isMissingTable(error)) setMissingTable(true);
      setLoading(false);
      return;
    }
    const next: Record<string, SavedCampaign> = {};
    for (const row of (data ?? []) as SavedCampaign[]) next[row.offer_slug] = { ...row, daily_budget: Number(row.daily_budget) };
    setSaved(next);
    setMissingTable(false);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = useCallback(async (plan: AdPlan, status: SavedStatus): Promise<{ error?: string }> => {
    const row = toSaved(plan, status);
    const { error } = await (supabase.from('ad_campaigns' as any).upsert(row, { onConflict: 'offer_slug' }) as any);
    if (error) {
      if (isMissingTable(error)) setMissingTable(true);
      return { error: isMissingTable(error) ? 'The ad_campaigns table is not on the project yet. Run the migration, then save again.' : error.message };
    }
    setSaved((s) => ({ ...s, [plan.offer.slug]: { ...row, updated_at: new Date().toISOString() } }));
    return {};
  }, []);

  return { saved, loading, missingTable, save, reload: load };
};
