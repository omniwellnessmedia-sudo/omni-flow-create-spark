import { differenceInCalendarDays } from 'date-fns';
import { isMuizenberg, type PipelineLead } from '@/lib/pipeline';
import { TALKS } from '@/data/talks';

/**
 * What each marketing channel actually produced.
 *
 * The question the marketing screen answers is not "how many subscribers
 * do we have" but "which of the things we do brings people who buy". Every
 * lead already says where it came from once you read it right: the
 * scorecard writes a fixed service name, the Muizenberg page writes a
 * context line, the enquiry form and the contact form are different tables,
 * and a walk-in carries a campaign. This file reads that, counts it over a
 * window, and puts the won count beside it.
 *
 * Nothing here is a claim about attribution beyond the record: a lead that
 * came through the contact form after seeing a film is a contact-form lead,
 * because that is what we can prove.
 *
 * No em dashes in this file.
 */

export type Channel = 'muizenberg' | 'scorecard' | 'enquiry' | 'contact' | 'outreach';

export const SCORECARD_SERVICE = 'revenue-readiness-scorecard';

export interface ChannelDef {
  id: Channel;
  label: string;
  hue: string;
  what: string;
}

export const CHANNELS: ChannelDef[] = [
  { id: 'muizenberg', label: 'Muizenberg walk', hue: '#F38020', what: 'The check sheet and the local page' },
  { id: 'scorecard', label: 'Scorecard', hue: '#2BB9B9', what: 'The free Revenue Readiness Scorecard' },
  { id: 'enquiry', label: 'Enquiry form', hue: '#4FAE3F', what: 'Addressed to an offer, from the catalogue' },
  { id: 'contact', label: 'Contact form', hue: '#2C6FB5', what: 'The general contact page' },
  { id: 'outreach', label: 'Outreach', hue: '#5C2A8A', what: 'Conversations we started' },
];

export const channelForLead = (lead: PipelineLead): Channel => {
  if (lead.service === SCORECARD_SERVICE) return 'scorecard';
  if (isMuizenberg(lead)) return 'muizenberg';
  if (lead.source === 'quote') return 'enquiry';
  if (lead.source === 'contact') return 'contact';
  return 'outreach';
};

export interface ChannelRow extends ChannelDef {
  leads: number;
  won: number;
  quoted: number;
}

const within = (iso: string, days: number, now: Date): boolean => {
  const d = differenceInCalendarDays(now, new Date(iso));
  return d >= 0 && d < days;
};

/** Leads per channel in the last `days`, with how many of them were quoted or won. */
export const channelBreakdown = (leads: PipelineLead[], days: number, now = new Date()): ChannelRow[] => {
  const rows = CHANNELS.map((c) => ({ ...c, leads: 0, won: 0, quoted: 0 }));
  for (const lead of leads) {
    if (!within(lead.createdAt, days, now)) continue;
    const row = rows.find((r) => r.id === channelForLead(lead));
    if (!row) continue;
    row.leads += 1;
    if (lead.stage === 'won') row.won += 1;
    if (lead.stage === 'quoted') row.quoted += 1;
  }
  return rows;
};

export interface ScorecardSummary {
  submissions: number;
  last7: number;
  averagePercent: number | null;
  bands: Record<string, number>;
}

/** Reads the score and band the scorecard writes into its lead message. */
export const parseScorecardMessage = (message: string | null): { percent: number | null; band: string | null } => {
  if (!message) return { percent: null, band: null };
  const p = message.match(/\((\d{1,3})%\)/);
  const b = message.match(/Band:\s*([^\n]+)/);
  return { percent: p ? Number(p[1]) : null, band: b ? b[1].trim() : null };
};

export const scorecardSummary = (leads: PipelineLead[], days: number, now = new Date()): ScorecardSummary => {
  const mine = leads.filter((l) => channelForLead(l) === 'scorecard' && within(l.createdAt, days, now));
  const percents: number[] = [];
  const bands: Record<string, number> = {};
  for (const l of mine) {
    const { percent, band } = parseScorecardMessage(l.brief);
    if (percent !== null) percents.push(percent);
    if (band) bands[band] = (bands[band] ?? 0) + 1;
  }
  return {
    submissions: mine.length,
    last7: mine.filter((l) => within(l.createdAt, 7, now)).length,
    averagePercent: percents.length ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length) : null,
    bands,
  };
};

type Row = Record<string, unknown>;
const num = (v: unknown): number => (typeof v === 'number' ? v : Number(v) || 0);
const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);

export interface NewsletterSummary {
  subscribers: number;
  confirmed: number;
  unsubscribed: number;
  newInWindow: number;
  lastSend: { name: string; at: string; sent: number; opens: number; clicks: number; openRate: number | null } | null;
  scheduled: number;
}

export const newsletterSummary = (subscribers: Row[], campaigns: Row[], days: number, now = new Date()): NewsletterSummary => {
  let confirmed = 0;
  let unsubscribed = 0;
  let newInWindow = 0;
  for (const s of subscribers) {
    if (s.unsubscribed === true) unsubscribed += 1;
    else if (s.confirmed === true) confirmed += 1;
    const at = str(s.subscribed_at) ?? str(s.created_at);
    if (at && within(at, days, now) && s.unsubscribed !== true) newInWindow += 1;
  }
  const sent = campaigns
    .filter((c) => c.status === 'sent')
    .sort((a, b) => String(b.updated_at ?? b.created_at).localeCompare(String(a.updated_at ?? a.created_at)));
  const last = sent[0];
  const lastSend = last
    ? (() => {
        const sentCount = num(last.sent_count);
        const opens = num(last.open_count);
        return {
          name: String(last.name ?? last.subject ?? 'Newsletter'),
          at: String(last.updated_at ?? last.created_at),
          sent: sentCount,
          opens,
          clicks: num(last.click_count),
          openRate: sentCount > 0 ? Math.round((opens / sentCount) * 100) : null,
        };
      })()
    : null;
  return {
    subscribers: subscribers.filter((s) => s.unsubscribed !== true).length,
    confirmed,
    unsubscribed,
    newInWindow,
    lastSend,
    scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
  };
};

export interface SocialSummary {
  queued: number;
  postedInWindow: number;
  failed: number;
  next: { at: string; platforms: string[]; text: string } | null;
}

export const socialSummary = (posts: Row[], days: number, now = new Date()): SocialSummary => {
  const today = now.toISOString().slice(0, 10);
  const upcoming = posts
    .filter((p) => p.status === 'scheduled' && String(p.scheduled_date) >= today)
    .sort((a, b) => `${a.scheduled_date} ${a.scheduled_time}`.localeCompare(`${b.scheduled_date} ${b.scheduled_time}`));
  const next = upcoming[0];
  return {
    queued: upcoming.length,
    postedInWindow: posts.filter((p) => p.status === 'posted' && str(p.posted_at) && within(String(p.posted_at), days, now)).length,
    failed: posts.filter((p) => p.status === 'failed').length,
    next: next
      ? {
          at: `${next.scheduled_date} ${String(next.scheduled_time ?? '').slice(0, 5)}`.trim(),
          platforms: Array.isArray(next.platforms) ? (next.platforms as string[]) : [],
          text: String(next.content_text ?? '').slice(0, 120),
        }
      : null,
  };
};

export interface WatchSummary {
  total: number;
  publicCount: number;
  waiting: number;
  publicTitles: string[];
}

export const watchSummary = (): WatchSummary => {
  const pub = TALKS.filter((t) => t.visibility === 'public');
  return { total: TALKS.length, publicCount: pub.length, waiting: TALKS.length - pub.length, publicTitles: pub.map((t) => t.title) };
};
