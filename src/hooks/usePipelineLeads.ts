import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  type LeadSource,
  type PipelineLead,
  type Stage,
  statusForStage,
  toPipelineLead,
} from '@/lib/pipeline';

/**
 * The three lead tables, read as one list, kept live.
 *
 * Realtime on all three so a walk-in typed on one phone appears on the
 * board on another without a refresh, debounced so a burst of updates costs
 * one reload rather than one per row.
 *
 * `setStage` writes the status word the lead's own table understands (see
 * src/lib/pipeline.ts), stamps archived_at when a lead leaves the pipeline,
 * stamps last_contacted on outreach rows when a conversation starts, and
 * logs the change to lead_activities so the drawer's timeline shows it.
 *
 * No em dashes in this file.
 */

interface State {
  leads: PipelineLead[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const TABLES: Record<LeadSource, 'contact_submissions' | 'service_quotes' | 'outreach_leads'> = {
  contact: 'contact_submissions',
  quote: 'service_quotes',
  outreach: 'outreach_leads',
};

export const usePipelineLeads = () => {
  const [state, setState] = useState<State>({ leads: [], loading: true, error: null, lastUpdated: null });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setState((s) => ({ ...s, loading: true }));
    const [contacts, quotes, outreach] = await Promise.all([
      supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('service_quotes').select('*').order('created_at', { ascending: false }),
      supabase.from('outreach_leads').select('*').order('created_at', { ascending: false }),
    ]);
    const failed = [contacts.error, quotes.error, outreach.error].find(Boolean);
    const leads = [
      ...(contacts.data ?? []).map((r) => toPipelineLead('contact', r as Record<string, unknown>)),
      ...(quotes.data ?? []).map((r) => toPipelineLead('quote', r as Record<string, unknown>)),
      ...(outreach.data ?? []).map((r) => toPipelineLead('outreach', r as Record<string, unknown>)),
    ];
    setState({ leads, loading: false, error: failed ? failed.message : null, lastUpdated: new Date() });
  }, []);

  useEffect(() => {
    load();
    const refresh = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => load(true), 600);
    };
    const channel = supabase
      .channel('pipeline-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_quotes' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'outreach_leads' }, refresh)
      .subscribe();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      supabase.removeChannel(channel);
    };
  }, [load]);

  const setStage = useCallback(
    async (lead: PipelineLead, stage: Stage): Promise<string | null> => {
      const status = statusForStage(stage, lead.source);
      const updates: Record<string, unknown> = { status };
      if (stage === 'archived') updates.archived_at = new Date().toISOString();
      if (lead.source === 'outreach' && stage === 'talking' && !lead.lastContacted) {
        updates.last_contacted = new Date().toISOString().slice(0, 10);
      }
      // .select() so a policy that matches nothing surfaces as an empty
      // result rather than a false success.
      const { data, error } = await supabase.from(TABLES[lead.source]).update(updates).eq('id', lead.id).select();
      if (error) return error.message;
      if (!data || data.length === 0) return 'No permission to update this lead.';

      const { data: auth } = await supabase.auth.getUser();
      await supabase.from('lead_activities').insert({
        lead_type: lead.source,
        lead_id: lead.id,
        actor_id: auth.user?.id ?? null,
        action: 'status_change',
        payload: { to: status, stage },
      });

      // Optimistic: the realtime refresh will confirm it a moment later.
      setState((s) => ({
        ...s,
        leads: s.leads.map((l) => (l.key === lead.key ? { ...l, status, stage } : l)),
      }));
      return null;
    },
    []
  );

  return { ...state, reload: load, setStage };
};

export type PipelineApi = ReturnType<typeof usePipelineLeads>;
