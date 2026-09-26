import { format } from 'date-fns';
import { ALL_OFFERS, SERVICE_BANDS, SPECTRUM, getBandForOffer, getOffer } from '@/data/publicRateCard';
import type { LeadSource, PipelineLead } from '@/lib/pipeline';
import { WALK_IN_CAMPAIGN } from '@/lib/pipeline';
import { buildQuote, rand, type Quote, type QuoteLine } from '@/lib/quotes';
import { FORBIDDEN as CONTENT_FORBIDDEN } from '@/lib/serviceContent';
import { FORBIDDEN as ADS_FORBIDDEN } from '@/lib/ads';
import type { ActivityRow } from '@/lib/clients';

/**
 * Proposals: the document that turns a lead into a yes.
 *
 * A quotation is a price table. A proposal is the argument for the price:
 * what we noticed about their business, what we would do about it, how it
 * runs week by week, what it costs, and what happens next. The team needs
 * to produce one for every lead on the board in minutes, in Omni's voice
 * and colours, without a designer and without inventing a single figure.
 *
 * HOW IT STAYS HONEST. Every rand comes from the rate card through the
 * same buildQuote() the quotation uses, so a proposal can never carry a
 * price the website does not. Every free text field is checked against
 * the same forbidden list as the ad copy and the service content, so
 * nobody can promise page one, guaranteed leads or the cheapest anything.
 * Themes carry Omni's own words about a kind of business; they carry no
 * claims about results, no testimonials and no statistics.
 *
 * WHERE IT LIVES. The lead's activity log, as "proposal_issued" with the
 * whole proposal in the payload, the same way a quotation is stored. The
 * money inside it is a real Quote object, so the Money screen sees a
 * proposal with a price as a quotation awaiting its deposit, and a payment
 * matches on the proposal number without anything new in the database.
 *
 * No em dashes in this file.
 */

export const PROPOSAL_ISSUED = 'proposal_issued';

/** Both lists, because the two differ slightly and a proposal must clear both. */
export const FORBIDDEN_CLAIM = (text: string): boolean => CONTENT_FORBIDDEN.test(text) || ADS_FORBIDDEN.test(text);

export type ThemeId = 'local-business' | 'non-profit' | 'hospitality' | 'professional' | 'retail' | 'events' | 'growth';

export interface ProposalTheme {
  id: ThemeId;
  label: string;
  hue: string;
  /** The line above the title on the cover. */
  eyebrow: string;
  /** Omni's opening paragraph for this kind of business. States what we do, claims nothing. */
  opening: string;
  /** Three prompts for the "what we noticed" boxes. Questions, so nothing is asserted until a person writes it. */
  prompts: [string, string, string];
  /** Rate card slugs ticked by default. */
  suggested: string[];
  /** The last paragraph before the next step. */
  closing: string;
}

export const THEMES: ProposalTheme[] = [
  {
    id: 'local-business',
    label: 'Local business',
    hue: SPECTRUM.teal,
    eyebrow: 'For a business on the doorstep',
    opening:
      'Omni Wellness Media is a media house in Muizenberg. We help local businesses get found online and turn the people who look into people who walk in, at prices a small business can say yes to. This proposal starts with what we noticed about yours.',
    prompts: [
      'What happens when someone searches for you on Google? Profile, hours, photographs, reviews.',
      'What does your website do on a phone? Does it load, does it say what you sell, can someone call you in one tap?',
      'Where are your customers actually finding you today, and where are they not?',
    ],
    suggested: ['clarity-session', 'website-audit'],
    closing:
      'None of this needs to happen at once. The first step is small and cheap on purpose, and everything after it is priced on the same card the website shows every visitor.',
  },
  {
    id: 'non-profit',
    label: 'Non-profit',
    hue: SPECTRUM.green,
    eyebrow: 'For an organisation with a cause',
    opening:
      'Omni Wellness Media works with organisations whose work matters more than their marketing budget. We have run campaigns, screenings and social channels for causes, and we know the difference between telling a story and asking for money. This proposal is about doing the first so the second gets easier.',
    prompts: [
      'What does a supporter see in the first ten seconds on your site and your social pages? Is the cause clear before the ask?',
      'How often do you post, who does it, and what happens to the enquiries it brings in?',
      'What do you already have that nobody sees: photographs, film, stories, results?',
    ],
    suggested: ['social-media-management', 'content-starter-pack'],
    closing:
      'We price this work the same way for a cause as for a company, because a discount that is not on the rate card is a promise we cannot keep to the next organisation. What we can do is start small, prove it, and grow it with you.',
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    hue: SPECTRUM.orange,
    eyebrow: 'For a place people come to',
    opening:
      'A guesthouse, a cafe or a restaurant sells an experience, and most of the decision is made before anyone arrives. Omni Wellness Media makes the photographs, the pages and the posts that decision is made from. This proposal starts with what a guest sees today.',
    prompts: [
      'Search your name and your street. What comes up first, and is it you?',
      'Can a guest book or reserve without phoning? What does your booking page look like on a phone?',
      'When did your photographs last change? Do they show the place as it is now?',
    ],
    suggested: ['website-audit', 'social-media-management'],
    closing:
      'Hospitality is seasonal and so is this plan. We propose the fixed pieces first, so they pay back over a whole season, and the monthly work only once the fixed pieces are live.',
  },
  {
    id: 'professional',
    label: 'Professional practice',
    hue: SPECTRUM.blue,
    eyebrow: 'For a practice built on trust',
    opening:
      'An architect, a lawyer, a consultant or a clinic is chosen on reputation, and reputation online is a set of specific things: a clear site, a consistent identity, and work that can be seen. Omni Wellness Media builds those. This proposal starts with how your practice reads to someone who has just been referred to you.',
    prompts: [
      'A referral looks you up before they call. What do they find, and does it match how you present in person?',
      'Is your work visible? Projects, case studies, a portfolio that is current.',
      'Does your identity hold together across the site, the documents you send and the social pages?',
    ],
    suggested: ['brand-content-audit', 'brand-identity'],
    closing:
      'We start with an audit rather than a build, because a practice that already has a reputation needs the online version to match it, not to replace it.',
  },
  {
    id: 'retail',
    label: 'Retail and makers',
    hue: SPECTRUM.yellow,
    eyebrow: 'For a shop or a maker',
    opening:
      'A shop lives on being seen: the right photograph of the right product in front of the right person, often enough to be remembered. Omni Wellness Media produces that content and runs the channels it goes out on. This proposal starts with what your products look like online today.',
    prompts: [
      'What does your Instagram grid look like to someone who has never visited? Is it clear what you sell and where you are?',
      'Do your product photographs show the product well, and are they yours?',
      'How does someone buy or reserve something without coming in first?',
    ],
    suggested: ['social-media-management', 'content-pack-12'],
    closing:
      'Content first, then the channel to run it on. A shop with good photographs and no posting schedule is common; a schedule with nothing to post is worse.',
  },
  {
    id: 'events',
    label: 'Events and screenings',
    hue: SPECTRUM.violet,
    eyebrow: 'For something that happens on a date',
    opening:
      'An event has one deadline and no second chance to fill the room. Omni Wellness Media runs event marketing and film screenings, from the campaign to the door, and produces the content that comes out of the day so it keeps working afterwards. This proposal starts with the date and works backwards.',
    prompts: [
      'What is the date, the venue, the capacity, and how many people are committed today?',
      'Where will tickets or registrations be taken, and does that page exist yet?',
      'Who is the audience, and which channels do they actually use?',
    ],
    suggested: ['event-marketing'],
    closing:
      'Everything here is built backwards from the date. If the date moves, the plan moves with it; if it is close, we say so plainly rather than take money for a campaign that cannot run.',
  },
  {
    id: 'growth',
    label: 'Ongoing growth',
    hue: SPECTRUM.red,
    eyebrow: 'For a business ready to run at it',
    opening:
      'Some businesses are past the audit stage. They know what needs doing every month and need a team to do it. Omni Wellness Media runs a monthly growth desk: content, channels, campaigns and reporting, one point of contact. This proposal sets out what a month looks like.',
    prompts: [
      'What has to happen every month that currently does not, or happens late?',
      'Who signs off content, and how fast?',
      'What does a good month look like in numbers you already track?',
    ],
    suggested: ['growth-desk'],
    closing:
      'A retainer is a relationship, so it carries a three month initial term, monthly in advance, and a report every month that says what was done. If it is not working, the report is where we find out first.',
  },
];

export const themeById = (id: string | null | undefined): ProposalTheme =>
  THEMES.find((t) => t.id === id) ?? THEMES[0];

/**
 * A best guess from what the lead already tells us. The person building the
 * proposal can change it in one click; the point is that the right theme is
 * usually already selected when the dialog opens.
 */
export const themeForLead = (lead: Pick<PipelineLead, 'campaign' | 'service' | 'org' | 'brief' | 'raw'>): ThemeId => {
  const sector = String((lead.raw as Record<string, unknown> | undefined)?.sector ?? '').toLowerCase();
  const text = `${sector} ${lead.service ?? ''} ${lead.brief ?? ''} ${lead.org ?? ''}`.toLowerCase();

  if (/non[- ]?profit|npo|npc|foundation|charity|cruelty|welfare|trust\b/.test(text)) return 'non-profit';
  if (/event|screening|festival|launch|conference|workshop/.test(text)) return 'events';
  if (/cafe|restaurant|bar\b|guesthouse|holiday let|hotel|lodge|b&b|hospitality|accommodation/.test(text)) return 'hospitality';
  if (/architect|attorney|lawyer|accountant|clinic|practice|consult|engineer|professional/.test(text)) return 'professional';
  if (/shop|store|market|maker|retail|boutique|brand\b/.test(text)) return 'retail';
  if (/growth desk|retainer|monthly|ongoing/.test(text)) return 'growth';
  if (lead.campaign === WALK_IN_CAMPAIGN) return 'local-business';
  return 'local-business';
};

export interface Phase {
  /** "Week 1", "Weeks 2 to 4", "Every month". */
  when: string;
  title: string;
  detail: string;
  hue: string;
}

/**
 * The plan writes itself from the bands the chosen offers belong to, in
 * the order the rate card lists them, which is also the order the work
 * happens: look, then build, then make, then run.
 */
const PHASE_FOR_BAND: Record<string, Omit<Phase, 'hue'>> = {
  clarity: { when: 'Week 1', title: 'Look and listen', detail: 'We go through your site, your profile and your channels before we talk, then meet for the session. You get a written list of findings, ranked, whether or not you go further.' },
  build: { when: 'Weeks 2 to 4', title: 'Build', detail: 'A fixed scope, agreed in writing before anything starts. One consolidated revision round, then handover with everything you need to run it yourself.' },
  content: { when: 'Weeks 2 to 3', title: 'Make', detail: 'Photography, film and copy produced to a shot list you have approved. Raw files, licensing and consent are recorded in writing.' },
  retainer: { when: 'Every month', title: 'Run', detail: 'Payable in advance, with a report every month that says what was done and what it produced. Three month initial term.' },
  podcast: { when: 'Weeks 2 to 6', title: 'Record and release', detail: 'Concept, recording, edit and a release schedule. Episodes are yours; we set up the channels in your name.' },
  campaign: { when: 'Backwards from the date', title: 'Campaign', detail: 'A timeline built from the event date, the channels the audience actually uses, and one place to see registrations. Advertising spend is paid separately and reported line by line.' },
};

export const planFor = (lines: QuoteLine[]): Phase[] => {
  const seen = new Set<string>();
  const phases: Phase[] = [];
  for (const band of SERVICE_BANDS) {
    const hit = lines.some((l) => l.slug && getBandForOffer(l.slug)?.id === band.id);
    if (!hit || seen.has(band.id)) continue;
    seen.add(band.id);
    const p = PHASE_FOR_BAND[band.id];
    if (p) phases.push({ ...p, hue: band.hue });
  }
  return phases;
};

export interface Proposal {
  number: string;
  leadType: LeadSource;
  leadId: string;
  client: { name: string; org: string | null; email: string | null };
  theme: ThemeId;
  title: string;
  /** Up to three. Blank ones are dropped. */
  findings: string[];
  /** The money, as a real quotation so the Money screen can track it. */
  quote: Quote;
  plan: Phase[];
  notes: string | null;
  issuedAt: string;
  validUntil: string;
}

/** P-260926-AB12: the same shape as a quote number so both sort by day. */
export const proposalNumber = (leadId: string, now = new Date()): string =>
  `P-${format(now, 'yyMMdd')}-${leadId.replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase()}`;

export const defaultTitle = (lead: Pick<PipelineLead, 'name' | 'org'>): string =>
  `A plan for ${lead.org && lead.org !== lead.name ? lead.org : lead.name}`;

export const buildProposal = (args: {
  lead: PipelineLead;
  theme: ThemeId;
  title: string;
  findings: string[];
  lines: QuoteLine[];
  notes?: string | null;
  now?: Date;
}): Proposal => {
  const now = args.now ?? new Date();
  const quote = buildQuote({ lead: args.lead, lines: args.lines, notes: null, now });
  // The quotation inside carries the proposal's number, so a deposit paid
  // against the proposal matches in the Money screen.
  quote.number = proposalNumber(args.lead.id, now);
  return {
    number: quote.number,
    leadType: args.lead.source,
    leadId: args.lead.id,
    client: quote.client,
    theme: args.theme,
    title: args.title.trim() || defaultTitle(args.lead),
    findings: args.findings.map((f) => f.trim()).filter(Boolean).slice(0, 3),
    quote,
    plan: planFor(quote.lines),
    notes: args.notes?.trim() || null,
    issuedAt: quote.issuedAt,
    validUntil: quote.validUntil,
  };
};

/** Problems that stop a proposal being issued. Empty means go. */
export const validateProposal = (p: Pick<Proposal, 'title' | 'findings' | 'notes' | 'quote'>): string[] => {
  const problems: string[] = [];
  if (p.quote.lines.length === 0) problems.push('Pick at least one offer.');
  for (const [label, text] of [['The title', p.title], ['A finding', p.findings.join(' ')], ['The notes', p.notes ?? '']] as const) {
    if (text && FORBIDDEN_CLAIM(text)) problems.push(`${label} promises a result. Say what we will do, not what will happen.`);
    if (/\u2014/.test(text)) problems.push(`${label} contains an em dash.`);
  }
  for (const l of p.quote.lines) {
    if (l.slug) {
      const offer = getOffer(l.slug);
      if (!offer) problems.push(`${l.name} is not on the rate card.`);
    }
  }
  return problems;
};

const isProposal = (v: unknown): v is Proposal =>
  !!v && typeof v === 'object' && typeof (v as Proposal).number === 'string' && !!(v as Proposal).quote && Array.isArray((v as Proposal).findings);

/** Every proposal on record, newest first. */
export const proposalsFromActivities = (activities: ActivityRow[]): Proposal[] => {
  const out = new Map<string, Proposal>();
  for (const a of activities) {
    const p = a.payload ?? {};
    if (a.action === PROPOSAL_ISSUED && isProposal(p.proposal)) out.set(p.proposal.number, p.proposal);
  }
  return Array.from(out.values()).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
};

/** The offers on a proposal, with their rate card inclusions, for the document. */
export const proposalOffers = (p: Proposal) =>
  p.quote.lines.map((l) => ({ line: l, offer: l.slug ? getOffer(l.slug) : undefined }));

/** Everything a person needs to know to send this in one message. Plain text, no markdown. */
export const coverEmail = (p: Proposal, link: string): { subject: string; body: string } => {
  const theme = themeById(p.theme);
  const first = p.client.name.split(/\s+/)[0] || p.client.name;
  const offers = p.quote.lines.map((l) => l.name).join(', ');
  const lines = [
    `Hi ${first},`,
    '',
    `Thank you for the time. As promised, here is a short proposal for ${p.client.org && p.client.org !== p.client.name ? p.client.org : 'you'}: ${p.title.replace(/^A plan for /, 'a plan for ')}.`,
    '',
    p.findings.length
      ? `It starts with ${p.findings.length === 1 ? 'one thing' : `${p.findings.length} things`} we noticed, then sets out what we would do about ${p.findings.length === 1 ? 'it' : 'them'}: ${offers}.`
      : `It sets out what we would do: ${offers}.`,
    `The investment is ${rand(p.quote.subtotal)}, with ${rand(p.quote.depositDue)} to start, and the prices are the same ones on our website.`,
    '',
    `The proposal is here: ${link}`,
    '',
    `It is valid until ${new Date(p.validUntil).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })}. If any of it reads wrong, tell me, and I would rather fix the proposal than have you say yes to the wrong thing.`,
    '',
    theme.id === 'events' ? 'If the date is close, say so and we will tell you straight whether there is enough runway.' : 'Happy to walk through it on a call or over coffee, whichever is easier.',
    '',
    'Tumelo',
    'Omni Wellness Media',
  ];
  return { subject: `${p.title}, from Omni Wellness Media`, body: lines.join('\n') };
};

/** A lead with no stage worth of proposal yet. Used by the Today board. */
export const hasProposal = (activities: ActivityRow[], leadKey: string): boolean =>
  activities.some((a) => a.action === PROPOSAL_ISSUED && `${a.lead_type}:${a.lead_id}` === leadKey);

export { ALL_OFFERS };
