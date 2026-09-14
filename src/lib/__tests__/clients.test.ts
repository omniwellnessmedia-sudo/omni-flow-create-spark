import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildClients, clientKeyForLead, bestStage, searchClients } from '@/lib/clients';
import { toPipelineLead } from '@/lib/pipeline';
import { NAV_GROUPS } from '@/components/dashboard/AdminSidebar';

/**
 * The client card: one person, however many rows they left behind.
 *
 * No em dashes in this file.
 */

const at = (d: string) => `${d}T09:00:00Z`;

describe('grouping', () => {
  it('groups by email, case and space insensitive, across all three lead tables', () => {
    const leads = [
      toPipelineLead('contact', { id: 'c1', name: 'Ann Cafe', email: 'Ann@Cafe.co.za ', message: 'hi', status: 'pending', created_at: at('2026-03-01') }),
      toPipelineLead('quote', { id: 'q1', name: 'Ann', email: 'ann@cafe.co.za', project_details: 'site', service_type: 'website-audit', status: 'quoted', created_at: at('2026-08-01') }),
      toPipelineLead('outreach', { id: 'o1', organisation: 'Ann Cafe', contact_email: 'ann@cafe.co.za', status: 'contacted', created_at: at('2026-09-01') }),
    ];
    const clients = buildClients({ leads, activities: [], orders: [], bookings: [], subscribers: [] });
    expect(clients).toHaveLength(1);
    expect(clients[0].leads).toHaveLength(3);
    expect(clients[0].stage).toBe('quoted');
    expect(clients[0].firstSeen).toBe(at('2026-03-01'));
  });

  it('groups a walk-in with no email by the business name, and a lead with neither by itself', () => {
    const a = toPipelineLead('outreach', { id: 'o1', organisation: 'Surf Shack', status: 'contacted', created_at: at('2026-09-01') });
    const b = toPipelineLead('outreach', { id: 'o2', organisation: 'surf  shack', status: 'quoted', created_at: at('2026-09-05') });
    const c = toPipelineLead('contact', { id: 'c9', name: 'Anon', message: 'x', status: 'pending', created_at: at('2026-09-06') });
    expect(clientKeyForLead(a)).toBe(clientKeyForLead(b));
    expect(clientKeyForLead(c)).toBe('lead:contact:c9');
    const clients = buildClients({ leads: [a, b, c], activities: [], orders: [], bookings: [], subscribers: [] });
    expect(clients).toHaveLength(2);
  });

  it('takes the furthest stage any lead reached', () => {
    expect(bestStage(['new', 'lost', 'talking'])).toBe('talking');
    expect(bestStage(['archived', 'won'])).toBe('won');
    expect(bestStage([])).toBe('archived');
  });
});

describe('the timeline', () => {
  it('merges leads, activities, orders, bookings and the newsletter, newest first, with money summed', () => {
    const lead = toPipelineLead('quote', { id: 'q1', name: 'Ben', email: 'ben@x.co', project_details: 'p', service_type: 'landing-page', status: 'won', created_at: at('2026-08-01') });
    const clients = buildClients({
      leads: [lead],
      activities: [
        { id: 'a1', lead_type: 'quote', lead_id: 'q1', action: 'note', payload: { text: 'Called, keen' }, created_at: at('2026-08-02') },
        { id: 'a2', lead_type: 'quote', lead_id: 'q1', action: 'status_change', payload: { to: 'won', stage: 'won' }, created_at: at('2026-08-03') },
        { id: 'a3', lead_type: 'contact', lead_id: 'other', action: 'note', payload: { text: 'not his' }, created_at: at('2026-08-04') },
      ],
      orders: [{ id: 'o1', created_at: at('2026-08-10'), customer_email: 'BEN@x.co', customer_name: 'Ben', product_name: 'eSIM 5GB', amount: 250, total_zar: 250, status: 'completed' }],
      bookings: [{ id: 'b1', created_at: at('2026-08-12'), booking_date: '2026-09-20', contact_email: 'ben@x.co', contact_name: 'Ben', participants: 2, total_price: 1200, status: 'confirmed', tours: { title: 'Kalk Bay' } }],
      subscribers: [{ email: 'ben@x.co', subscribed_at: at('2026-08-11'), unsubscribed: false }],
    });
    expect(clients).toHaveLength(1);
    const c = clients[0];
    expect(c.value).toBe(1450);
    expect(c.subscribed).toBe(true);
    expect(c.timeline.map((e) => e.kind)).toEqual(['booking', 'subscribed', 'order', 'status', 'note', 'lead']);
    expect(c.timeline.find((e) => e.kind === 'status')?.text).toBe('Moved to Won');
    expect(c.timeline.some((e) => e.text === 'not his')).toBe(false);
    expect(c.lastTouch).toBe(at('2026-08-12'));
  });

  it('makes a client out of an order alone, marked won by the money', () => {
    const clients = buildClients({
      leads: [], activities: [], bookings: [], subscribers: [],
      orders: [{ id: 'o1', created_at: at('2026-07-01'), customer_email: 'solo@x.co', customer_name: 'Solo', product_name: 'Data', amount: 99, status: 'completed' }],
    });
    expect(clients[0].stage).toBe('won');
    expect(clients[0].name).toBe('Solo');
  });

  it('searches across name, business, email, phone and service', () => {
    const lead = toPipelineLead('quote', { id: 'q1', name: 'Cara', email: 'cara@yoga.co', phone: '+27 82 000 0000', company: 'Sunrise Yoga', project_details: 'p', service_type: 'social-media-management', status: 'pending', created_at: at('2026-09-01') });
    const clients = buildClients({ leads: [lead], activities: [], orders: [], bookings: [], subscribers: [] });
    for (const q of ['cara', 'sunrise', 'yoga.co', '82 000', 'social']) expect(searchClients(clients, q), q).toHaveLength(1);
    expect(searchClients(clients, 'nothing')).toHaveLength(0);
  });
});

describe('wiring', () => {
  it('is the first item under Clients and partners and has a section', () => {
    const group = NAV_GROUPS.find((g) => g.label === 'Clients and partners');
    expect(group?.items[0].id).toBe('clients');
    const dash = readFileSync(resolve(__dirname, '../../pages/AdminDashboard.tsx'), 'utf8');
    expect(dash).toMatch(/case "clients"/);
  });

  it.each([
    ['clients.ts', '../clients.ts'],
    ['useClients.ts', '../../hooks/useClients.ts'],
    ['ClientsScreen.tsx', '../../components/admin/ClientsScreen.tsx'],
  ])('%s has no em dashes', (_n, rel) => {
    expect(readFileSync(resolve(__dirname, rel), 'utf8')).not.toMatch(/\u2014/);
  });
});
