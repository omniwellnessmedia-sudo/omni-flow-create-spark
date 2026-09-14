import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CHANNELS, channelForLead, channelBreakdown, parseScorecardMessage, scorecardSummary,
  newsletterSummary, socialSummary, watchSummary, SCORECARD_SERVICE,
} from '@/lib/marketing';
import { toPipelineLead } from '@/lib/pipeline';
import { NAV_GROUPS } from '@/components/dashboard/AdminSidebar';

/**
 * The marketing screen counts what the record says, over a window, with
 * won beside it. No em dashes in this file.
 */

const now = new Date('2026-09-14T12:00:00Z');
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

describe('channels', () => {
  it('reads the channel off the record, scorecard before anything else', () => {
    expect(channelForLead(toPipelineLead('contact', { id: '1', name: 'A', service: SCORECARD_SERVICE, message: 'x', created_at: daysAgo(1) }))).toBe('scorecard');
    expect(channelForLead(toPipelineLead('quote', { id: '2', name: 'B', project_details: 'Context: Muizenberg local business', service_type: 's', created_at: daysAgo(1) }))).toBe('muizenberg');
    expect(channelForLead(toPipelineLead('quote', { id: '3', name: 'C', project_details: 'plain', service_type: 's', created_at: daysAgo(1) }))).toBe('enquiry');
    expect(channelForLead(toPipelineLead('contact', { id: '4', name: 'D', message: 'hi', created_at: daysAgo(1) }))).toBe('contact');
    expect(channelForLead(toPipelineLead('outreach', { id: '5', organisation: 'E', campaign: 'zacri', created_at: daysAgo(1) }))).toBe('outreach');
    expect(channelForLead(toPipelineLead('outreach', { id: '6', organisation: 'F', campaign: 'muizenberg', created_at: daysAgo(1) }))).toBe('muizenberg');
  });

  it('counts leads in the window only, with won and quoted beside them', () => {
    const leads = [
      toPipelineLead('outreach', { id: '1', organisation: 'A', campaign: 'muizenberg', status: 'won', created_at: daysAgo(2) }),
      toPipelineLead('outreach', { id: '2', organisation: 'B', campaign: 'muizenberg', status: 'quoted', created_at: daysAgo(5) }),
      toPipelineLead('outreach', { id: '3', organisation: 'C', campaign: 'muizenberg', status: 'contacted', created_at: daysAgo(40) }),
      toPipelineLead('quote', { id: '4', name: 'D', project_details: 'p', service_type: 's', status: 'pending', created_at: daysAgo(1) }),
    ];
    const rows = channelBreakdown(leads, 30, now);
    const muiz = rows.find((r) => r.id === 'muizenberg')!;
    expect(muiz.leads).toBe(2);
    expect(muiz.won).toBe(1);
    expect(muiz.quoted).toBe(1);
    expect(rows.find((r) => r.id === 'enquiry')!.leads).toBe(1);
    expect(rows.map((r) => r.id)).toEqual(CHANNELS.map((c) => c.id));
  });
});

describe('scorecard', () => {
  it('parses the score and band the scorecard writes', () => {
    const msg = 'Revenue Readiness Scorecard result\n\nScore: 27 of 40 (68%)\nBand: Nearly there\n\nOffer: 3 of 4';
    expect(parseScorecardMessage(msg)).toEqual({ percent: 68, band: 'Nearly there' });
    expect(parseScorecardMessage(null)).toEqual({ percent: null, band: null });
  });

  it('averages the scores in the window', () => {
    const mk = (id: string, pct: number, ago: number) =>
      toPipelineLead('contact', { id, name: 'S', service: SCORECARD_SERVICE, message: `Score: 1 of 2 (${pct}%)\nBand: B${pct}`, created_at: daysAgo(ago) });
    const s = scorecardSummary([mk('1', 40, 1), mk('2', 60, 3), mk('3', 90, 50)], 30, now);
    expect(s.submissions).toBe(2);
    expect(s.last7).toBe(2);
    expect(s.averagePercent).toBe(50);
    expect(s.bands).toEqual({ B40: 1, B60: 1 });
  });
});

describe('newsletter and social', () => {
  it('summarises subscribers and the last send with an open rate', () => {
    const s = newsletterSummary(
      [
        { email: 'a', confirmed: true, unsubscribed: false, subscribed_at: daysAgo(2) },
        { email: 'b', confirmed: false, unsubscribed: false, subscribed_at: daysAgo(60) },
        { email: 'c', confirmed: true, unsubscribed: true, subscribed_at: daysAgo(3) },
      ],
      [
        { name: 'Sept', status: 'sent', sent_count: 200, open_count: 50, click_count: 5, updated_at: daysAgo(4) },
        { name: 'Aug', status: 'sent', sent_count: 100, open_count: 10, click_count: 1, updated_at: daysAgo(30) },
        { name: 'Next', status: 'scheduled', updated_at: daysAgo(0) },
      ],
      30,
      now
    );
    expect(s.subscribers).toBe(2);
    expect(s.confirmed).toBe(1);
    expect(s.unsubscribed).toBe(1);
    expect(s.newInWindow).toBe(1);
    expect(s.lastSend?.name).toBe('Sept');
    expect(s.lastSend?.openRate).toBe(25);
    expect(s.scheduled).toBe(1);
  });

  it('finds the next queued post and counts what went out', () => {
    const s = socialSummary(
      [
        { status: 'scheduled', scheduled_date: '2026-09-20', scheduled_time: '09:00:00', platforms: ['instagram'], content_text: 'later' },
        { status: 'scheduled', scheduled_date: '2026-09-15', scheduled_time: '10:30:00', platforms: ['facebook', 'instagram'], content_text: 'soon' },
        { status: 'posted', scheduled_date: '2026-09-10', scheduled_time: '09:00:00', platforms: ['instagram'], content_text: 'done', posted_at: daysAgo(4) },
        { status: 'failed', scheduled_date: '2026-09-11', scheduled_time: '09:00:00', platforms: [], content_text: 'x' },
      ],
      30,
      now
    );
    expect(s.queued).toBe(2);
    expect(s.next?.at).toBe('2026-09-15 10:30');
    expect(s.next?.platforms).toEqual(['facebook', 'instagram']);
    expect(s.postedInWindow).toBe(1);
    expect(s.failed).toBe(1);
  });

  it('reads the Watch page state from the talks list', () => {
    const w = watchSummary();
    expect(w.total).toBe(w.publicCount + w.waiting);
    expect(w.publicTitles.length).toBe(w.publicCount);
  });
});

describe('wiring', () => {
  it('is first under Marketing and has a section', () => {
    const group = NAV_GROUPS.find((g) => g.label === 'Marketing');
    expect(group?.items[0].id).toBe('marketing');
    expect(readFileSync(resolve(__dirname, '../../pages/AdminDashboard.tsx'), 'utf8')).toMatch(/case "marketing"/);
  });

  it.each([
    ['marketing.ts', '../marketing.ts'],
    ['useMarketing.ts', '../../hooks/useMarketing.ts'],
    ['MarketingScreen.tsx', '../../components/admin/MarketingScreen.tsx'],
  ])('%s has no em dashes', (_n, rel) => {
    expect(readFileSync(resolve(__dirname, rel), 'utf8')).not.toMatch(/\u2014/);
  });
});
