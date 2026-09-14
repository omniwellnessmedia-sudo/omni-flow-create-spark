import { STAGES, type PipelineLead, type Stage } from '@/lib/pipeline';

/**
 * A client is a person or business, not a row.
 *
 * The same cafe owner can be a contact submission in March, an enquiry in
 * August, a walk-in in September and an order in October, and until now
 * each of those was a separate record on a separate screen. This gathers
 * everything the site knows about one email address (or, for a walk-in
 * with no email, one business name) into a single card with one timeline.
 *
 * Nothing is written. The card is a reading of tables that already exist:
 * the three lead tables, lead_activities, orders, tour_bookings and
 * newsletter_subscribers.
 *
 * No em dashes in this file.
 */

export type TimelineKind =
  | 'lead'
  | 'walk_in'
  | 'note'
  | 'status'
  | 'email'
  | 'edit'
  | 'order'
  | 'booking'
  | 'subscribed';

export interface TimelineEvent {
  at: string;
  kind: TimelineKind;
  text: string;
  /** Rand value where the event is money. */
  amount?: number;
  /** The lead this event belongs to, when it does. */
  leadKey?: string;
}

export interface ClientOrder {
  id: string;
  createdAt: string;
  productName: string;
  amount: number;
  status: string;
}

export interface ClientBooking {
  id: string;
  createdAt: string;
  bookingDate: string;
  tourTitle: string | null;
  participants: number;
  total: number;
  status: string;
}

export interface Client {
  key: string;
  name: string;
  org: string | null;
  emails: string[];
  phones: string[];
  leads: PipelineLead[];
  orders: ClientOrder[];
  bookings: ClientBooking[];
  subscribed: boolean;
  /** The furthest along any of their leads has got. */
  stage: Stage;
  /** Orders and bookings, in rand. */
  value: number;
  firstSeen: string;
  lastTouch: string;
  timeline: TimelineEvent[];
}

export interface ActivityRow {
  id: string;
  lead_type: string;
  lead_id: string;
  action: string;
  payload: Record<string, unknown> | null;
  created_at: string;
}

type Row = Record<string, unknown>;

const STAGE_RANK: Record<Stage, number> = { archived: 0, lost: 1, new: 2, talking: 3, findings: 4, quoted: 5, won: 6 };

export const bestStage = (stages: Stage[]): Stage =>
  stages.reduce<Stage>((best, s) => (STAGE_RANK[s] > STAGE_RANK[best] ? s : best), 'archived');

export const normaliseEmail = (email: string | null | undefined): string | null => {
  const e = (email ?? '').trim().toLowerCase();
  return e.includes('@') ? e : null;
};

const normaliseOrg = (org: string | null | undefined): string | null => {
  const o = (org ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  return o ? o : null;
};

/** The key a lead groups under: its email, else its business, else itself. */
export const clientKeyForLead = (lead: PipelineLead): string => {
  const email = normaliseEmail(lead.email);
  if (email) return `email:${email}`;
  const org = normaliseOrg(lead.org);
  if (org) return `org:${org}`;
  return `lead:${lead.key}`;
};

const describeActivity = (a: ActivityRow): { kind: TimelineKind; text: string } => {
  const p = a.payload ?? {};
  switch (a.action) {
    case 'note':
      return { kind: 'note', text: String(p.text ?? 'Note') };
    case 'status_change': {
      const stage = typeof p.stage === 'string' ? STAGES.find((s) => s.id === p.stage)?.label : null;
      return { kind: 'status', text: `Moved to ${stage ?? String(p.to ?? 'a new stage')}` };
    }
    case 'email_sent':
      return { kind: 'email', text: `Email sent: ${String(p.template ?? 'template').replace(/_/g, ' ')}` };
    case 'walk_in':
      return { kind: 'walk_in', text: `Walk-in recorded${p.sector ? `, ${String(p.sector).toLowerCase()}` : ''}` };
    case 'edit':
      return { kind: 'edit', text: 'Details updated' };
    default:
      return { kind: 'edit', text: a.action.replace(/_/g, ' ') };
  }
};

const SOURCE_TEXT = { contact: 'Contact form', quote: 'Enquiry', outreach: 'Outreach' } as const;

const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0);

export interface ClientInputs {
  leads: PipelineLead[];
  activities: ActivityRow[];
  orders: Row[];
  bookings: Row[];
  subscribers: Row[];
}

/** Every client the site knows about, most recently touched first. */
export const buildClients = ({ leads, activities, orders, bookings, subscribers }: ClientInputs): Client[] => {
  const byKey = new Map<string, Client>();

  const ensure = (key: string, name: string, org: string | null, at: string): Client => {
    let c = byKey.get(key);
    if (!c) {
      c = {
        key, name, org, emails: [], phones: [], leads: [], orders: [], bookings: [],
        subscribed: false, stage: 'archived', value: 0, firstSeen: at, lastTouch: at, timeline: [],
      };
      byKey.set(key, c);
    }
    if (at < c.firstSeen) c.firstSeen = at;
    if (at > c.lastTouch) c.lastTouch = at;
    if (!c.org && org) c.org = org;
    return c;
  };

  const addEmail = (c: Client, email: string | null | undefined) => {
    const e = normaliseEmail(email);
    if (e && !c.emails.includes(e)) c.emails.push(e);
  };
  const addPhone = (c: Client, phone: string | null | undefined) => {
    const p = (phone ?? '').trim();
    if (p && !c.phones.includes(p)) c.phones.push(p);
  };

  const activityByLead = new Map<string, ActivityRow[]>();
  for (const a of activities) {
    const k = `${a.lead_type}:${a.lead_id}`;
    activityByLead.set(k, [...(activityByLead.get(k) ?? []), a]);
  }

  for (const lead of leads) {
    const c = ensure(clientKeyForLead(lead), lead.name, lead.org, lead.createdAt);
    addEmail(c, lead.email);
    addPhone(c, lead.phone);
    c.leads.push(lead);
    const isWalkIn = lead.source === 'outreach' && lead.campaign === 'muizenberg';
    c.timeline.push({
      at: lead.createdAt,
      kind: isWalkIn ? 'walk_in' : 'lead',
      text: isWalkIn
        ? `Walk-in${lead.service ? `: ${lead.service}` : ''}`
        : `${SOURCE_TEXT[lead.source]}${lead.service ? `: ${lead.service}` : ''}`,
      leadKey: lead.key,
    });
    for (const a of activityByLead.get(lead.key) ?? []) {
      const d = describeActivity(a);
      c.timeline.push({ at: a.created_at, kind: d.kind, text: d.text, leadKey: lead.key });
      if (a.created_at > c.lastTouch) c.lastTouch = a.created_at;
    }
  }

  for (const o of orders) {
    const email = normaliseEmail(o.customer_email as string);
    if (!email) continue;
    const at = String(o.created_at);
    const c = ensure(`email:${email}`, String(o.customer_name ?? email), null, at);
    addEmail(c, email);
    const amount = num(o.total_zar) || num(o.amount);
    c.orders.push({ id: String(o.id), createdAt: at, productName: String(o.product_name ?? 'Order'), amount, status: String(o.status ?? '') });
    c.value += amount;
    c.timeline.push({ at, kind: 'order', text: `Order: ${String(o.product_name ?? 'Order')}`, amount });
  }

  for (const b of bookings) {
    const email = normaliseEmail(b.contact_email as string);
    if (!email) continue;
    const at = String(b.created_at);
    const c = ensure(`email:${email}`, String(b.contact_name ?? email), null, at);
    addEmail(c, email);
    addPhone(c, b.contact_phone as string);
    const tours = b.tours as Row | null;
    const title = tours && typeof tours.title === 'string' ? tours.title : null;
    const total = num(b.total_price);
    c.bookings.push({
      id: String(b.id), createdAt: at, bookingDate: String(b.booking_date ?? ''), tourTitle: title,
      participants: num(b.participants), total, status: String(b.status ?? ''),
    });
    c.value += total;
    c.timeline.push({ at, kind: 'booking', text: `Tour booking${title ? `: ${title}` : ''}`, amount: total });
  }

  for (const s of subscribers) {
    const email = normaliseEmail(s.email as string);
    if (!email) continue;
    const c = byKey.get(`email:${email}`);
    if (!c) continue;
    c.subscribed = !(s.unsubscribed === true);
    const at = String(s.subscribed_at ?? s.created_at ?? '');
    if (at) c.timeline.push({ at, kind: 'subscribed', text: c.subscribed ? 'Subscribed to the newsletter' : 'Unsubscribed from the newsletter' });
  }

  const clients = Array.from(byKey.values());
  for (const c of clients) {
    c.stage = c.leads.length ? bestStage(c.leads.map((l) => l.stage)) : c.value > 0 ? 'won' : 'archived';
    c.timeline.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
    c.leads.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    if (c.timeline[0] && c.timeline[0].at > c.lastTouch) c.lastTouch = c.timeline[0].at;
  }
  clients.sort((a, b) => (a.lastTouch < b.lastTouch ? 1 : a.lastTouch > b.lastTouch ? -1 : 0));
  return clients;
};

export const searchClients = (clients: Client[], query: string): Client[] => {
  const q = query.trim().toLowerCase();
  if (!q) return clients;
  return clients.filter((c) =>
    [c.name, c.org ?? '', ...c.emails, ...c.phones, ...c.leads.map((l) => l.service ?? '')]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );
};
