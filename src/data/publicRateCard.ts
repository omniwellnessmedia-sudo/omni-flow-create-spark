/**
 * PUBLIC rate card for the services page: the Spectrum System catalogue.
 *
 * THIS FILE IS THE ONLY PLACE A CLIENT FACING PRICE MAY BE DEFINED.
 * Rate card v0.9 states the rule for people: "One rate card. Nobody quotes a
 * number that is not on it." The website is a standing quote to every
 * visitor, so the same rule binds the code. Any page, component or document
 * that shows a price to a client reads it from here; none holds its own.
 * A new or changed price needs Tumelo's written sign-off before it is
 * published, and a figure from an unratified draft is not publishable
 * merely because the draft exists.
 *
 * SOURCES, in order of authority:
 *   1. Chad Cupido's approved Master Services Rate Card and implementation
 *      direction, email of 23 August 2026.
 *   2. The design handoff "Omni Asset System" (services.html, 25 Aug 2026),
 *      whose offer names, prices, inclusions and commercial terms are
 *      client supplied and reproduced here without rewording, per its
 *      copy note.
 *
 * THIS REPOSITORY IS PUBLIC. Only the approved public catalogue may appear
 * here or anywhere in the repo. The full modular card, partner production
 * rates, margin rules and social media tier economics are CONFIDENTIAL and
 * stay in Chad's email. Social media management appears exactly as the
 * handoff presents it: a from-price with cadence and rates confirmed on
 * enquiry, never the tier table.
 *
 * CTA rule: only routes that exist may be linked. "Pay now" style CTAs from
 * the design are intentionally not rendered until real checkout URLs exist
 * (see src/config/offers.ts on the revenue engine branch); every offer
 * routes to the contact form with the service preselected instead.
 *
 * Category hues follow the handoff's spectrum map. Each band links back to
 * its established service page so the catalogue and the existing service
 * surfaces stay one system.
 */

export const SPECTRUM = {
  red: '#E63946',
  orange: '#F38020',
  yellow: '#F5C518',
  green: '#4FAE3F',
  teal: '#2BB9B9',
  blue: '#2C6FB5',
  violet: '#5C2A8A',
  clay: '#C9B68E',
  slate: '#8A9A96',
} as const;

export interface RateCardOffer {
  /** Stable id; also the ?service= value the contact form understands. */
  slug: string;
  name: string;
  /** Display price exactly as approved. */
  price: string;
  blurb: string;
  bullets: string[];
  /** Hex accent from SPECTRUM. */
  hue: string;
  /** Primary CTA label; routes to /contact?service=<slug>. */
  cta: string;
  /** Renders a small footnote under the card. */
  footnote?: string;
  /** Adds a WhatsApp secondary action. */
  whatsapp?: boolean;
  /** Spans the full grid width. */
  wide?: boolean;
}

export interface ServiceBand {
  id: string;
  eyebrow: string;
  heading: string;
  hue: string;
  /** Link into the established service page for this category. */
  explore?: { href: string; label: string };
  offers: RateCardOffer[];
  footnote?: string;
}

export const SERVICE_BANDS: ServiceBand[] = [
  {
    id: 'clarity',
    eyebrow: '01 · Entry offers',
    heading: 'Clarity and audits',
    hue: SPECTRUM.teal,
    explore: { href: '/business-consulting', label: 'About our consulting' },
    offers: [
      {
        slug: 'clarity-session',
        name: 'AI & Business Clarity Session',
        price: 'R1,500',
        hue: SPECTRUM.teal,
        blurb:
          'A focused 60 minutes on the decision in front of you, with a written action map you can act on the same week.',
        bullets: [
          '60-minute online strategy session',
          'Concise written action map',
          'Tool and workflow recommendations',
        ],
        cta: 'Book a slot',
      },
      {
        slug: 'brand-content-audit',
        name: 'Wellness Brand & Content Audit',
        price: 'R2,500',
        hue: SPECTRUM.green,
        blurb: 'An outside read on how your brand and content actually land, scored and prioritised.',
        bullets: [
          'Website and social-media review',
          'Scorecard and ranked priorities',
          '45-minute debrief',
        ],
        cta: 'Book audit',
      },
      {
        slug: 'website-audit',
        name: 'Website & Visibility Audit',
        price: 'R2,500',
        hue: SPECTRUM.green,
        blurb: 'Where visitors lose interest, and what to fix in the next thirty days.',
        bullets: [
          'Messaging, user journey, mobile experience',
          'Calls to action, search basics, analytics readiness',
          '30-day action plan',
        ],
        cta: 'Book audit',
      },
    ],
  },
  {
    id: 'build',
    eyebrow: '02 · Fixed-scope builds',
    heading: 'Websites and sprints',
    hue: SPECTRUM.orange,
    explore: { href: '/web-development', label: 'About our web work' },
    offers: [
      {
        slug: 'revenue-sprint',
        name: 'Revenue-Ready Website & Campaign Sprint',
        price: 'R7,500 launch rate',
        hue: SPECTRUM.orange,
        blurb: 'One offer, one page, one route to payment, measured. The fastest way from idea to income.',
        bullets: [
          'One focused landing page and offer copy',
          'One lead, booking or payment route',
          'Analytics setup and one conversion test',
          'One consolidated revision round',
        ],
        cta: 'Start a sprint',
        whatsapp: true,
        footnote:
          'Excludes domains, hosting, ad spend, complex integrations, full brand identity and unlimited revisions.',
      },
      {
        slug: 'visibility-sprint',
        name: '30-Day Visibility & Conversion Sprint',
        price: 'R10,500',
        hue: SPECTRUM.red,
        blurb: 'A month of concentrated work on being found, understood and chosen.',
        bullets: [
          'Positioning and messaging',
          'Landing-page build or conversion refresh',
          '12 campaign assets and a lead form',
          'Advertising setup, tracking and review',
        ],
        cta: 'Enquire',
        whatsapp: true,
        footnote: 'Advertising spend is paid separately by the client.',
      },
      {
        slug: 'landing-page',
        name: 'One-Page Landing Page',
        price: 'R6,000',
        hue: SPECTRUM.yellow,
        blurb: 'A single well-built page when the strategy is already settled.',
        bullets: [
          'Copy and mobile-first design',
          'Contact pathways and integrations',
          'Basic SEO and click tracking',
        ],
        cta: 'Enquire',
      },
    ],
  },
  {
    id: 'content',
    eyebrow: '03 · Brand and content',
    heading: 'Content and brand identity',
    hue: SPECTRUM.violet,
    explore: { href: '/media-production', label: 'About our production' },
    offers: [
      {
        slug: 'content-starter-pack',
        name: 'Content Starter Pack',
        price: 'R3,500',
        hue: SPECTRUM.violet,
        blurb: 'One campaign theme, carried across a month of posting without guesswork.',
        bullets: [
          'Six branded graphics and six captions',
          'WhatsApp or email copy',
          '30-day posting plan',
        ],
        cta: 'Order the pack',
      },
      {
        slug: 'brand-identity',
        name: 'Brand Identity',
        price: 'From R2,800',
        hue: SPECTRUM.clay,
        blurb: 'Starter Brand Kit at R2,800, or the Signature Identity at R5,500 when you need the full suite.',
        bullets: [
          'Starter: two logo concepts, palette, two fonts, one-page guide, five Canva templates',
          'Signature: expanded logo suite, 15 templates, card, email signature, brand guideline',
        ],
        cta: 'Choose a kit',
      },
      {
        slug: 'content-pack-12',
        name: '12-Post Bespoke Content Pack',
        price: 'R6,000',
        hue: SPECTRUM.blue,
        blurb: 'Original graphics built for your brand, not adapted from a template.',
        bullets: [
          'Twelve branded posts with captions and hashtags',
          'Up to four approved infographics',
        ],
        cta: 'Enquire',
      },
    ],
  },
  {
    id: 'retainer',
    eyebrow: '04 · Monthly',
    heading: 'Ongoing support',
    hue: SPECTRUM.teal,
    explore: { href: '/social-media-strategy', label: 'About our social strategy' },
    offers: [
      {
        slug: 'growth-desk',
        name: 'Omni Growth Desk',
        price: 'R6,500 per month',
        hue: SPECTRUM.teal,
        blurb: 'A standing desk for the work that never quite gets done: strategy, content, site changes, reporting.',
        bullets: [
          'Monthly strategy and eight content pieces',
          'One WhatsApp or email campaign',
          'Up to four website-support hours',
          'Optimisation and monthly reporting',
        ],
        cta: 'Enquire',
      },
      {
        slug: 'social-media-management',
        name: 'Social-Media Management',
        price: 'From R1,850 per month',
        hue: SPECTRUM.green,
        blurb: 'Five tiers from Essentials to Signature, built on source content adapted across platforms.',
        bullets: [
          'Instagram, Facebook and TikTok, with LinkedIn from Momentum up',
          'Captions, calendar, community management and reporting',
        ],
        cta: 'Request current rates',
        footnote: 'Cadence and rates confirmed on enquiry. Advertising spend not included.',
      },
      {
        slug: 'executive-support',
        name: 'Executive, AI, Media & Systems Support',
        // The prepaid ten-hour block at R10,000 was withdrawn from the public
        // page on 27 August 2026: it implied R1,000 per hour and undercut the
        // published hourly rate by a third. Rate card v0.9 proposes R13,500
        // for the block but is unratified, so no replacement figure is
        // published. Restore a block price only with written sign-off.
        price: 'R1,500 per hour',
        hue: SPECTRUM.slate,
        blurb: 'Senior hands on strategy, implementation, campaigns, operations or systems.',
        bullets: [
          'Bought by the hour, against agreed priorities',
          'Longer engagements are quoted on scope',
        ],
        cta: 'Enquire',
      },
    ],
  },
  {
    id: 'podcast',
    eyebrow: '05 · Audio',
    heading: 'Podcast',
    hue: SPECTRUM.blue,
    explore: { href: '/podcast', label: 'Hear our podcast' },
    offers: [
      {
        slug: 'podcast-starter',
        name: 'Podcast Starter System',
        price: 'R2,500',
        hue: SPECTRUM.blue,
        blurb: 'Everything you need decided before you press record.',
        bullets: [
          '90-minute strategy session',
          'Launch checklist',
          'Curated equipment and software guide',
        ],
        cta: 'Book session',
      },
      {
        slug: 'podcast-concept',
        name: 'Concept & Format Development',
        price: 'From R3,500',
        hue: SPECTRUM.violet,
        blurb: 'Audience, purpose, format, episode structure, guest strategy and launch plan.',
        bullets: [],
        cta: 'Enquire',
      },
      {
        slug: 'podcast-launch',
        name: 'Podcast Launch Campaign',
        price: 'From R7,500',
        hue: SPECTRUM.teal,
        blurb: 'Positioning, launch page, promotional assets, audience pathway and tracking.',
        bullets: [],
        cta: 'Enquire',
      },
    ],
  },
  {
    id: 'campaign',
    eyebrow: '06 · Campaigns, events and experiences',
    heading: 'Campaigns and events',
    hue: SPECTRUM.red,
    explore: { href: '/screenings', label: 'See our screening nights' },
    offers: [
      {
        slug: 'campaign-command-centre',
        name: 'Campaign Command Centre',
        price: 'From R12,500',
        hue: SPECTRUM.red,
        blurb:
          'One place where a campaign lives: assets, copy, partners, tickets and the numbers that tell you whether it worked.',
        bullets: [
          'Campaign hub with asset bank and copy bank',
          'Partner toolkit and mobilisation',
          'Ticketing or lead pathway',
          'Tracking dashboard and final impact report',
        ],
        cta: 'Brief us',
        whatsapp: true,
        wide: true,
      },
      {
        slug: 'event-marketing',
        name: 'Event Marketing Package',
        price: 'From R7,500',
        hue: SPECTRUM.orange,
        blurb: 'Positioning, listing copy, campaign assets, audience pathway and reporting.',
        bullets: [],
        cta: 'Enquire',
      },
      {
        slug: 'screening-campaign',
        name: 'Screening Campaign',
        price: 'From R12,500',
        hue: SPECTRUM.yellow,
        blurb: 'Film positioning, ticketing, campaign hub, partner mobilisation, social assets and reporting.',
        bullets: [],
        cta: 'Enquire',
      },
      {
        slug: 'workshops',
        name: 'Workshops & Facilitation',
        price: 'From R7,500 half day · from R12,500 full day',
        hue: SPECTRUM.green,
        blurb: 'AI and responsible use, content strategy, conscious leadership and custom organisational training.',
        bullets: [],
        cta: 'Enquire',
      },
    ],
    footnote:
      'Venue hire, catering, performers, transport, accommodation, ticketing charges, technical suppliers, printing, paid advertising and production partners are quoted separately unless expressly included.',
  },
];

/** Flat list, for the contact form's service select. */
export const RATE_CARD_OFFERS: RateCardOffer[] = SERVICE_BANDS.flatMap((b) => b.offers);

/** Quotation-based work, scoped after a paid discovery or audit. */
export const QUOTED_CATEGORIES: { area: string; detail: string }[] = [
  { area: 'Web', detail: 'Custom multi-page websites, booking, payments, e-commerce' },
  { area: 'Media', detail: 'Videography, photography, documentary and interview production' },
  { area: 'Audio', detail: 'Episode production, video podcasts, social clip packs' },
  { area: 'Events', detail: 'Full event production and event content capture' },
  { area: 'Systems', detail: 'Campaign CRM, automation and AI workflows' },
  { area: 'Partners', detail: 'Marketplace listings, affiliate features, lead-generation partnerships' },
];

/** Standard commercial terms, exactly as approved for publication. */
export const RATE_CARD_TERMS: string[] = [
  'All prices are in South African rand. VAT treatment confirmed on quotation.',
  'Project work: 50% deposit, 50% before final handover.',
  'Monthly retainers are payable in advance.',
  'Recurring social-media retainers carry a recommended three-month initial term.',
  'One consolidated revision round on entry packages; two on larger projects.',
  'Additional revisions are billed at R1,500 per hour.',
  'Advertising spend is paid separately by the client.',
  'Travel, venues, printing, software, domains, hosting and production partners are additional unless expressly included.',
  'We commit to agreed deliverables, professional setup and transparent reporting, not a guaranteed number of sales or leads.',
  'Quotations are valid for 14 days.',
  'Production rights, participant consent, raw files, licensing and portfolio use are recorded in writing.',
];

/** Projects behind the practice, linked into their live pages. */
export const PRACTICE_PROJECTS = [
  {
    name: 'Valley of Plenty',
    detail:
      'Sustainable development implemented across the Hanover Park community: food systems, skills and local enterprise.',
    href: '/csr-impact',
    hue: SPECTRUM.green,
  },
  {
    name: 'Human Animal Project',
    detail:
      'Advocacy for animal rights and compassionate living, carried through film, campaign and screening work.',
    href: '/programs/uwc-human-animal',
    hue: SPECTRUM.violet,
  },
  {
    name: 'Retreats and experiences',
    detail:
      'Programme architecture, facilitation and content capture for wellness retreats and cultural experiences.',
    href: '/tours-retreats',
    hue: SPECTRUM.teal,
  },
];

/**
 * Lookups for the per offer pages at /services/:slug.
 *
 * Every offer already carries a stable slug, because that slug is the
 * ?service= value the contact form understands. Reusing it as the URL keeps
 * one identifier for an offer across the catalogue, its own page and the
 * enquiry that follows, so an enquiry can always be traced to the page that
 * produced it.
 *
 * No em dashes in this block.
 */
export const ALL_OFFERS: RateCardOffer[] = SERVICE_BANDS.flatMap((b) => b.offers);

export const getOffer = (slug: string | undefined): RateCardOffer | undefined =>
  slug ? ALL_OFFERS.find((o) => o.slug === slug) : undefined;

export const getBandForOffer = (slug: string | undefined): ServiceBand | undefined =>
  slug ? SERVICE_BANDS.find((b) => b.offers.some((o) => o.slug === slug)) : undefined;

/** Other offers in the same band, for onward navigation. */
export const getSiblingOffers = (slug: string): RateCardOffer[] =>
  (getBandForOffer(slug)?.offers ?? []).filter((o) => o.slug !== slug);

/**
 * Sales structure per offer: who it suits, what happens after they enquire,
 * and the questions people actually ask before buying.
 *
 * WHY THIS IS SEPARATE FROM THE OFFER ITSELF. Everything in RateCardOffer is
 * client supplied and approved, and must not be reworded. What follows is
 * page furniture: qualification, process and objection handling. It carries
 * no prices, no inclusions and no promises about outcomes, so it can be
 * written and revised without touching approved commercial content.
 *
 * "Not for you if" is deliberate. Telling someone an offer does not suit them
 * loses a small number of enquiries that were never going to close and saves
 * the time of answering them, and it is the single thing that most raises
 * trust on a page that is otherwise selling.
 *
 * Bands, not offers, because the process is the same across a band and
 * nineteen near identical blocks would drift out of sync within a month.
 *
 * No em dashes in this block.
 */
export interface BandSalesContent {
  /** Short answer to "is this me?" */
  forYouIf: string[];
  notForYouIf: string[];
  /** What actually happens after the enquiry. Numbered on the page. */
  process: { title: string; detail: string }[];
  faqs: { q: string; a: string }[];
}

export const BAND_SALES: Record<string, BandSalesContent> = {
  clarity: {
    forYouIf: [
      'You know something is not working but not which thing',
      'You want an outside read before spending money on a build',
      'You would rather have an honest list than a proposal',
    ],
    notForYouIf: [
      'You already know exactly what you need built',
      'You are looking for someone to agree with a decision already made',
    ],
    process: [
      { title: 'You tell us the situation', detail: 'A short form, then a reply from a person, usually the same working day.' },
      { title: 'We look before we talk', detail: 'We go through your site and channels first so the session is not spent on things we could have read.' },
      { title: 'The session', detail: 'Sixty minutes, focused on the decision in front of you rather than a general review.' },
      { title: 'You get it in writing', detail: 'A written action map you can hand to someone else, including us or not.' },
    ],
    faqs: [
      { q: 'What if the answer is that I do not need you?', a: 'Then that is the answer and you have it in writing. We would rather say so than sell you a sprint you do not need.' },
      { q: 'Can I use the action map with another supplier?', a: 'Yes. It is yours. It is written to be handed to whoever does the work.' },
      { q: 'How soon can we do it?', a: 'Usually within the same week. Tell us your availability in the enquiry.' },
    ],
  },
  build: {
    forYouIf: [
      'You have an offer and no page that sells it',
      'People are interested but there is no way for them to pay or book',
      'You want a fixed scope and a fixed price rather than an open project',
    ],
    notForYouIf: [
      'You need a large multi section site with complex integrations',
      'The offer itself is still undecided, in which case start with a clarity session',
    ],
    process: [
      { title: 'Scope agreed in writing', detail: 'What is included and what is not, before anything starts.' },
      { title: 'Deposit', detail: 'Half up front, half before final handover.' },
      { title: 'Build', detail: 'Page, offer copy, a route to pay or book, and tracking that proves it.' },
      { title: 'One revision round', detail: 'Consolidated, so feedback arrives once rather than in pieces.' },
      { title: 'Handover', detail: 'It is yours, on your hosting, with access in your name.' },
    ],
    faqs: [
      { q: 'What if it needs more than the fixed scope?', a: 'We say so before starting, not after. Anything outside scope is quoted separately and you decide.' },
      { q: 'Do I own it?', a: 'Yes. Hosting and domains are in your name and the handover includes access.' },
      { q: 'Will it rank on Google?', a: 'It will be built so it can. We commit to the setup and the reporting, not to a position, because nobody can honestly promise a ranking.' },
      { q: 'What is not included?', a: 'Domains, hosting, advertising spend, complex integrations and unlimited revisions. Those are listed on the offer so there is no surprise.' },
    ],
  },
  content: {
    forYouIf: [
      'You keep starting and stopping',
      'You have the work but not the material to show it',
      'You want something consistent without hiring',
    ],
    notForYouIf: [
      'You want volume above all else',
      'You are not able to give us access to anything real to work from',
    ],
    process: [
      { title: 'A short brief', detail: 'What you sell, who to, and what you have already tried.' },
      { title: 'Direction agreed', detail: 'We show the shape before producing the whole set.' },
      { title: 'Production', detail: 'Delivered as a set you can schedule, not drip fed.' },
      { title: 'One revision round', detail: 'Consolidated.' },
    ],
    faqs: [
      { q: 'Do you use our photographs or stock?', a: 'Yours wherever they exist. We will tell you plainly when something needs a shoot rather than quietly using stock.' },
      { q: 'Who posts it?', a: 'You do, unless you take a retainer, in which case we can.' },
      { q: 'Can we approve before anything goes out?', a: 'Yes. Nothing is published in your name without your sign off.' },
    ],
  },
  retainer: {
    forYouIf: [
      'Posting stops in week three every time',
      'You need capacity rather than advice',
      'You want one predictable monthly cost',
    ],
    notForYouIf: [
      'You need a one off piece of work, which is cheaper as a project',
      'You are not able to commit to a few months, since nothing compounds in one',
    ],
    process: [
      { title: 'Month zero', detail: 'Strategy, access, and the schedule agreed.' },
      { title: 'Every month', detail: 'The agreed deliverables, on a date somebody owns.' },
      { title: 'Reporting', detail: 'What went out, what it did, and what we would change.' },
    ],
    faqs: [
      { q: 'Is there a minimum term?', a: 'Recurring social retainers carry a recommended three month initial term. That is a recommendation because less than three months does not show whether anything is working.' },
      { q: 'Can we pause?', a: 'Yes, with notice. Retainers are payable in advance so a pause takes effect the following month.' },
      { q: 'What if we need more in one month?', a: 'Additional work is quoted separately rather than quietly absorbed or quietly dropped.' },
    ],
  },
  podcast: {
    forYouIf: [
      'You have something to say and no format to say it in',
      'You want a show that can be sustained rather than three episodes',
    ],
    notForYouIf: [
      'You want us to write and present it for you',
      'There is no one on your side who can commit to recording regularly',
    ],
    process: [
      { title: 'Format', detail: 'Concept, structure, length and cadence agreed before any equipment is touched.' },
      { title: 'Setup', detail: 'Recording, editing and publishing set up so you can repeat it.' },
      { title: 'First episodes', detail: 'Produced with you, so the process is learned rather than handed over cold.' },
    ],
    faqs: [
      { q: 'Do we need a studio?', a: 'No. Most of what makes a podcast listenable is the room and the microphone, both of which we advise on.' },
      { q: 'Who owns the recordings?', a: 'You do. Production rights, raw files and licensing are recorded in writing.' },
      { q: 'How often should we publish?', a: 'Whatever you can sustain. A fortnightly show that continues beats a weekly one that stops.' },
    ],
  },
  campaign: {
    forYouIf: [
      'There is a date, a venue or a launch and a lot to coordinate',
      'You need the marketing, the assets and the running of it in one place',
    ],
    notForYouIf: [
      'You only need assets, which is a content pack',
      'The event itself is not confirmed yet',
    ],
    process: [
      { title: 'Scope and dates', detail: 'What the campaign covers and when each piece has to land.' },
      { title: 'Assets and channels', detail: 'Produced against the dates, not invented as we go.' },
      { title: 'Run', detail: 'The campaign is run and reported while it is live, not summarised afterwards.' },
      { title: 'Wrap', detail: 'What happened, with the numbers, and what we would do differently.' },
    ],
    faqs: [
      { q: 'Does this include advertising spend?', a: 'No. Ad spend is paid separately by you and goes directly to the platform, so you can see exactly what was spent.' },
      { q: 'Can you guarantee attendance?', a: 'No, and nobody honestly can. We commit to the deliverables, the setup and transparent reporting.' },
      { q: 'Do you handle ticketing?', a: 'We can, or we can work alongside whoever you already use.' },
    ],
  },
};

export const getBandSales = (bandId: string | undefined): BandSalesContent | undefined =>
  bandId ? BAND_SALES[bandId] : undefined;
