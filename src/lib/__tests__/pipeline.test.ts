import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  STAGES, BOARD_STAGES, KNOWN_STATUSES, stageForStatus, statusForStage, toPipelineLead, summarise,
  followUpDue, WALK_IN_CAMPAIGN, MUIZENBERG_CONTEXT_MARK, type Stage, type LeadSource,
} from '@/lib/pipeline';
import { NAV_GROUPS } from '@/components/dashboard/AdminSidebar';
import { MUIZENBERG_CONTEXT } from '@/data/muizenberg';

/**
 * The one pipeline over three tables, held to its promises: every status
 * word any table has used reads as a stage, every stage writes back a word
 * the table understands and reads back as the same stage, a walk-in is
 * tagged so the Today board can count it, and the admin's front door is
 * the day and not the database.
 *
 * No em dashes in this file.
 */

const read = (rel: string) => readFileSync(resolve(__dirname, rel), 'utf8');
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

describe('stages', () => {
  it('sell in order: new, talking, findings, quoted, won, then lost and archived off the board', () => {
    expect(STAGES.map((s) => s.id)).toEqual(['new', 'talking', 'findings', 'quoted', 'won', 'lost', 'archived']);
    expect(BOARD_STAGES.map((s) => s.id)).toEqual(['new', 'talking', 'findings', 'quoted', 'won']);
  });

  it('every known status word maps to a stage, and unknown words are looked at as new', () => {
    for (const w of KNOWN_STATUSES) expect(STAGES.some((s) => s.id === stageForStatus(w)), w).toBe(true);
    expect(stageForStatus(null)).toBe('new');
    expect(stageForStatus('something_odd')).toBe('new');
    expect(stageForStatus('Pending')).toBe('new');
  });

  it('round-trips: the word written for a stage reads back as that stage, for every source', () => {
    for (const source of ['contact', 'quote', 'outreach'] as LeadSource[]) {
      for (const s of STAGES) {
        expect(stageForStatus(statusForStage(s.id, source)), `${source}/${s.id}`).toBe(s.id);
      }
    }
  });

  it('keeps the old words honest', () => {
    expect(stageForStatus('closed')).toBe('archived');
    expect(stageForStatus('declined')).toBe('lost');
    expect(stageForStatus('registered')).toBe('won');
  });
});

describe('one shape for three tables', () => {
  const at = '2026-09-10T08:00:00Z';

  it('reads a contact submission', () => {
    const l = toPipelineLead('contact', { id: 'c1', name: 'Ann', email: 'a@x.co', message: 'Hello', organization: 'Cafe', service: 'Web', status: 'pending', created_at: at });
    expect(l.key).toBe('contact:c1');
    expect(l.stage).toBe('new');
    expect(l.org).toBe('Cafe');
    expect(l.brief).toBe('Hello');
  });

  it('tags an enquiry that came from the Muizenberg page by its context line', () => {
    const l = toPipelineLead('quote', { id: 'q1', name: 'Ben', email: 'b@x.co', project_details: `Context: ${MUIZENBERG_CONTEXT}\n\nWe need a site`, service_type: 'Website & Visibility Audit (website-audit)', status: null, created_at: at });
    expect(MUIZENBERG_CONTEXT_MARK).toBe(MUIZENBERG_CONTEXT);
    expect(l.campaign).toBe(WALK_IN_CAMPAIGN);
    expect(l.service).toContain('website-audit');
  });

  it('reads a walk-in as an outreach lead with the person and the business', () => {
    const l = toPipelineLead('outreach', { id: 'o1', organisation: 'Surf Shack', contact_person: 'Cal', contact_email: null, status: 'contacted', campaign: 'muizenberg', follow_up_due: '2026-09-15', created_at: at });
    expect(l.name).toBe('Cal');
    expect(l.org).toBe('Surf Shack');
    expect(l.stage).toBe('talking');
    expect(followUpDue(l, new Date('2026-09-15T09:00:00Z'))).toBe(true);
    expect(followUpDue(l, new Date('2026-09-14T09:00:00Z'))).toBe(false);
  });

  it('does not chase a follow-up on a lead that is won or lost', () => {
    const l = toPipelineLead('outreach', { id: 'o2', organisation: 'Done', status: 'won', follow_up_due: '2026-09-01', created_at: at });
    expect(followUpDue(l, new Date('2026-09-14T09:00:00Z'))).toBe(false);
  });

  it('summarises what the Today board shows', () => {
    const leads = [
      toPipelineLead('contact', { id: '1', name: 'A', status: 'pending', created_at: at }),
      toPipelineLead('quote', { id: '2', name: 'B', status: 'quoted', created_at: at }),
      toPipelineLead('outreach', { id: '3', organisation: 'C', status: 'won', campaign: 'muizenberg', created_at: at, updated_at: at }),
    ];
    const s = summarise(leads, new Date('2026-09-14T09:00:00Z'));
    expect(s.needsReply).toBe(1);
    expect(s.byStage.quoted).toBe(1);
    expect(s.muizenberg).toBe(1);
    expect(s.wonThisWeek).toBe(1);
  });
});

describe('the admin is grouped by the job', () => {
  it('opens on Sales with Today and Pipeline first', () => {
    expect(NAV_GROUPS[0].label).toBe('Sales');
    expect(NAV_GROUPS[0].items.slice(0, 2).map((i) => i.id)).toEqual(['home', 'pipeline']);
    expect(NAV_GROUPS.map((g) => g.label)).toEqual(['Sales', 'Marketing', 'Clients and partners', 'Money', 'Events and tours', 'System']);
  });

  it('keeps every screen that existed before reachable', () => {
    const ids = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));
    for (const id of ['home', 'leads', 'bookings', 'orders', 'analytics', 'newsletter', 'social', 'content', 'providers', 'catalogue', 'marketplace-hub', 'shop-products', 'products', 'affiliate-performance', 'affiliate-payouts', 'accounting', 'events-admin', 'local-tours', 'tours', 'schedule', 'team', 'tasks', 'uwc', 'roambuddy-sales', 'roam-marketing', 'settings', 'tools']) {
      expect(ids, id).toContain(id);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('renders the pipeline section and counts unanswered leads against it', () => {
    const dash = read('../../pages/AdminDashboard.tsx');
    expect(dash).toMatch(/case "pipeline"/);
    expect(dash).toContain('alertCounts.pipeline');
  });

  it('the front door no longer leads with vanity numbers', () => {
    const home = strip(read('../../components/dashboard/AdminHome.tsx'));
    expect(home).not.toMatch(/WellCoins|Platform Health/);
    expect(home).toMatch(/Needs a reply/);
    expect(home).toMatch(/Add walk-in/);
  });

  it.each([
    ['pipeline.ts', '../pipeline.ts'],
    ['usePipelineLeads.ts', '../../hooks/usePipelineLeads.ts'],
    ['PipelineBoard.tsx', '../../components/admin/PipelineBoard.tsx'],
    ['AdminHome.tsx', '../../components/dashboard/AdminHome.tsx'],
  ])('%s has no em dashes', (_n, rel) => {
    expect(read(rel)).not.toMatch(/\u2014/);
  });
});
