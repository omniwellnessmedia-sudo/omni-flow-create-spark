import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TRAVEL_AND_TOURS, tourEnquiryMailto } from '@/data/travelAndTours';

/**
 * Two things the team reported on 15 September: a lead added on one admin
 * screen did not show on the others, and there were two lead pipelines.
 * And one decision: tours are booked through Travel and Tours Cape Town,
 * not paid for here. No em dashes in this file.
 */

const src = (rel: string) => readFileSync(resolve(__dirname, rel), 'utf8');

describe('one pipeline, refreshed everywhere', () => {
  it('the old outreach board is gone and All leads points at the Pipeline', () => {
    const leads = src('../admin/AdminLeads.tsx');
    expect(leads).not.toMatch(/OutreachPipeline/);
    expect(leads).toContain('/admin?section=pipeline');
    expect(() => src('../../components/admin/OutreachPipeline.tsx')).toThrow();
  });

  it('every screen that writes a lead announces it, and every screen that lists leads listens', () => {
    expect(src('../admin/AdminLeads.tsx')).toMatch(/announceLeadsChanged\(\)/);
    expect(src('../../components/admin/PipelineBoard.tsx')).toMatch(/announceLeadsChanged\(\)/);
    expect(src('../../hooks/usePipelineLeads.ts')).toMatch(/onLeadsChanged\(/);
    expect(src('../../hooks/usePipelineLeads.ts')).toMatch(/announceLeadsChanged\(\)/);
    expect(src('../admin/AdminLeads.tsx')).toMatch(/onLeadsChanged\(/);
    expect(src('../AdminDashboard.tsx')).toMatch(/onLeadsChanged\(/);
  });

  it('outreach_leads joins the realtime publication', () => {
    const sql = src('../../../supabase/migrations/20260915090000_outreach_leads_realtime.sql');
    expect(sql).toContain('ALTER PUBLICATION supabase_realtime ADD TABLE public.outreach_leads');
    expect(sql).toContain("tablename = 'outreach_leads'");
  });
});

describe('tours hand off to Travel and Tours Cape Town', () => {
  it('the booking card links out and takes no payment', () => {
    const card = src('../../components/tours/TourBookingSidebar.tsx');
    expect(card).not.toMatch(/tour_bookings|payment_status|CreditCard|calculateTotal|roambuddy/i);
    expect(card).toContain('TRAVEL_AND_TOURS.website');
    expect(card).toContain('tourEnquiryMailto(');
    expect(card).toMatch(/rel="noopener noreferrer"/);
  });

  it('the enquiry goes to Travel and Tours with Omni copied in', () => {
    const href = tourEnquiryMailto('Great Mother Cave Tour', 'Sam');
    expect(href.startsWith(`mailto:${TRAVEL_AND_TOURS.email}?cc=${TRAVEL_AND_TOURS.cc}`)).toBe(true);
    expect(decodeURIComponent(href)).toContain('Great Mother Cave Tour');
    expect(TRAVEL_AND_TOURS.website).toMatch(/^https:\/\//);
  });

  it('the tours page no longer says tours are booked directly with us', () => {
    expect(src('../Tours.tsx')).not.toMatch(/booked directly with us|book them directly with us/);
    expect(src('../Tours.tsx')).toContain('Travel and Tours Cape Town');
  });

  it.each([
    ['leadEvents.ts', '../../lib/leadEvents.ts'],
    ['travelAndTours.ts', '../../data/travelAndTours.ts'],
    ['TourBookingSidebar.tsx', '../../components/tours/TourBookingSidebar.tsx'],
    ['migration', '../../../supabase/migrations/20260915090000_outreach_leads_realtime.sql'],
  ])('%s has no em dashes', (_n, rel) => {
    expect(src(rel)).not.toMatch(/\u2014/);
  });
});
