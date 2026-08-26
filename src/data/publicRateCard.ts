/**
 * PUBLIC rate card for the services page: the Spectrum System catalogue.
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
        price: 'R1,500 per hour · R10,000 per 10 hours',
        hue: SPECTRUM.slate,
        blurb: 'Senior hands on strategy, implementation, campaigns, operations or systems.',
        bullets: [
          'Buy by the hour, or a prepaid ten-hour block',
          'Applied across agreed priorities',
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
