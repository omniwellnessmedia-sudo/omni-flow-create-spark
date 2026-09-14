import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePipelineLeads } from '@/hooks/usePipelineLeads';
import { channelBreakdown, newsletterSummary, scorecardSummary, socialSummary, watchSummary } from '@/lib/marketing';

/**
 * The marketing screen's data: the live lead list plus the newsletter,
 * campaign and social tables, read once and on demand.
 *
 * No em dashes in this file.
 */

type Row = Record<string, unknown>;

export const useMarketing = (days: number) => {
  const pipeline = usePipelineLeads();
  const [rows, setRows] = useState<{ subscribers: Row[]; campaigns: Row[]; posts: Row[]; loading: boolean; error: string | null }>({
    subscribers: [], campaigns: [], posts: [], loading: true, error: null,
  });

  const load = useCallback(async () => {
    const [subscribers, campaigns, posts] = await Promise.all([
      supabase.from('newsletter_subscribers').select('email, confirmed, unsubscribed, subscribed_at, created_at, source').limit(5000),
      supabase.from('newsletter_campaigns').select('id, name, subject, status, sent_count, open_count, click_count, scheduled_send_time, created_at, updated_at').order('created_at', { ascending: false }).limit(200),
      supabase.from('scheduled_social_posts').select('id, scheduled_date, scheduled_time, status, platforms, campaign_name, content_text, posted_at').order('scheduled_date', { ascending: false }).limit(500),
    ]);
    const failed = [subscribers.error, campaigns.error, posts.error].find(Boolean);
    setRows({
      subscribers: (subscribers.data ?? []) as Row[],
      campaigns: (campaigns.data ?? []) as Row[],
      posts: (posts.data ?? []) as Row[],
      loading: false,
      error: failed ? failed.message : null,
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const summary = useMemo(() => ({
    channels: channelBreakdown(pipeline.leads, days),
    scorecard: scorecardSummary(pipeline.leads, days),
    newsletter: newsletterSummary(rows.subscribers, rows.campaigns, days),
    social: socialSummary(rows.posts, days),
    watch: watchSummary(),
  }), [pipeline.leads, rows, days]);

  return {
    ...summary,
    loading: pipeline.loading || rows.loading,
    error: pipeline.error ?? rows.error,
    reload: async () => { await Promise.all([pipeline.reload(true), load()]); },
  };
};
