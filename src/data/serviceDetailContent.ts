/**
 * Per service detail content, from the Claude Design service pack handoff.
 *
 * WHAT THIS FILE IS FOR. The service detail page previously drew its "who this
 * is for", process and FAQ from BAND_SALES, which is per CATEGORY: every offer
 * in Podcast answered the same three questions. This file carries the same
 * furniture per SERVICE, which is what the handoff supplies and what actually
 * answers a buyer's question about the offer in front of them.
 *
 * WHAT THIS FILE DELIBERATELY DOES NOT CARRY: PRICES.
 *
 * The handoff's README calls data/services.json "the single source of truth for
 * every name, price, inclusion and CTA". It is not, and adopting it as one
 * would have published wrong prices. Its figures agree with
 * src/data/publicRateCard.ts everywhere, but three of its price STRINGS are
 * less complete than the approved ones:
 *
 *   growth-desk             handoff "R6,500"            rate card "R6,500 per month"
 *   social-media-management handoff "from R1,850"       rate card "From R1,850 per month"
 *   workshops               handoff "from R7,500 half day"
 *                           rate card "From R7,500 half day, from R12,500 full day"
 *
 * Taking the handoff literally would have advertised two monthly retainers as
 * one off fees and dropped the full day workshop rate. publicRateCard.ts
 * therefore remains the only place a client facing price is defined, exactly
 * as it was, and this file holds only design and narrative content.
 *
 * Slugs: four differ between the handoff and the live routes. The live slug
 * wins, because it is the URL and the value the contact form understands.
 *
 * Generated from data/service-detail.json on 5 September 2026, then reviewed.
 * Headline accents arrive as <em> in the handoff and are split into
 * headline + accent here so no page needs to render raw HTML.
 *
 * Images: the handoff hotlinks Unsplash. This repository serves imagery from
 * its own domain (see the gallery manifest rules in the tour tests), so image
 * is left null until the real photography is in /public. The page renders
 * without it.
 *
 * ONE FAQ ANSWER IS HELD BACK, AND IT MATTERS. The handoff answers "How does
 * the block work?" with ten prepaid hours at R10,000. That price was
 * WITHDRAWN from the public page on 27 August 2026 because it implied
 * R1,000 per hour and undercut the published hourly rate by a third; rate
 * card v0.9 proposes R13,500 but is unratified, so no block price is
 * published at all. Carrying the handoff's answer would have quietly
 * reinstated a figure the team had deliberately removed nine days earlier.
 * It returns only with written sign off on a block rate.
 *
 * Everything else the handoff prices is consistent with the rate card,
 * including the Starter and Signature brand identity tiers at R2,800 and
 * R5,500, both of which the rate card publishes in the brand-identity blurb.
 * Its workshops answer also states "From R7,500 half day, from R12,500 full
 * day", which independently confirms the full day rate its own card price
 * had dropped.
 *
 * No em dashes in this file.
 */

export interface ServiceDetailContent {
  /** Hero treatment from the handoff: split, diag, disc, editorial, duo, wide. */
  variant: 'split' | 'diag' | 'disc' | 'editorial' | 'duo' | 'wide';
  /** Outcome headline, plain text. */
  headline: string;
  /** The phrase the handoff italicises in clay, rendered as an accent. */
  accent: string | null;
  /** Who this is for, in the handoff's wording. */
  audience: string[];
  /** Question and answer pairs, specific to this offer. */
  faqs: { question: string; answer: string }[];
  /** Repo hosted hero image. Null until real photography lands. */
  image: string | null;
  /** Alt text supplied by the handoff, kept for when the image lands. */
  imageAlt: string | null;
}

export const SERVICE_DETAIL_CONTENT: Record<string, ServiceDetailContent> = {
  'clarity-session': {
    variant: 'split',
    headline: 'One hour. One',
    accent: 'clear next step.',
    audience: [
      'Founders stuck between two directions',
      'Practitioners who want a plan, not a pitch',
      'Anyone about to spend money on the wrong thing',
    ],
    faqs: [
      { question: 'What happens after the hour?', answer: 'You receive a concise written action map the same week: the decision, the sequence and the tools to use.' },
      { question: 'Is it online?', answer: 'Yes. Sixty minutes on a video call, recorded on request.' },
      { question: 'What if I need more?', answer: 'The session fee is credited against any audit or sprint booked within 30 days.' },
    ],
    image: null,
    imageAlt: 'Writing an action plan by hand',
  },
  'brand-content-audit': {
    variant: 'split',
    headline: 'How your brand',
    accent: 'actually lands.',
    audience: [
      'Wellness brands posting without traction',
      'Practices about to refresh their look',
      'Teams who want an honest outside read',
    ],
    faqs: [
      { question: 'What do you review?', answer: 'Your website and social channels: message, consistency, tone and calls to action.' },
      { question: 'What do I get?', answer: 'A scored audit, ranked priorities and a 45-minute debrief.' },
    ],
    image: null,
    imageAlt: 'Meditation at sunrise',
  },
  'website-audit': {
    variant: 'split',
    headline: 'Where do visitors',
    accent: 'give up?',
    audience: [
      'Sites that get traffic but no enquiries',
      'Practices planning a redesign',
      'Owners who want fixes they can run themselves',
    ],
    faqs: [
      { question: 'Do you fix things?', answer: 'The audit is diagnosis plus a 30-day plan. Fixes can be booked as a sprint or by the hour.' },
      { question: 'How long does it take?', answer: 'Five working days from access to debrief.' },
    ],
    image: null,
    imageAlt: 'Graphics tablet and laptop in use',
  },
  'revenue-sprint': {
    variant: 'diag',
    headline: 'Selling  not quarters.',
    accent: 'in weeks,',
    audience: [
      'An offer that is ready but has no page',
      'A launch with a date attached',
      'A first paid product for an established practice',
    ],
    faqs: [
      { question: 'Why is it a launch rate?', answer: 'R7,500 is the introductory rate for the fixed scope. It rises once the first cohort of sprints is complete.' },
      { question: 'What is not included?', answer: 'Domains, hosting, ad spend, complex integrations, full brand identity and unlimited revisions.' },
      { question: 'How fast?', answer: 'Scope confirmed in writing first, then the build runs to an agreed launch date.' },
    ],
    image: null,
    imageAlt: 'Laptop workspace',
  },
  'visibility-sprint': {
    variant: 'diag',
    headline: 'Found, understood',
    accent: 'and chosen.',
    audience: [
      'Brands with a budget for a focused month',
      'Launches that need paid reach',
      'Sites that need a conversion refresh',
    ],
    faqs: [
      { question: 'Is ad spend included?', answer: 'No. Advertising spend is paid separately by you; we set up and run the campaign.' },
      { question: 'What are the 12 assets?', answer: 'Campaign graphics and copy across feed, story and email, built on one message.' },
    ],
    image: null,
    imageAlt: 'Team at a table',
  },
  'landing-page': {
    variant: 'diag',
    headline: 'One page,',
    accent: 'built properly.',
    audience: [
      'Strategy already settled',
      'A single offer or event',
      'Replacing a page that underperforms',
    ],
    faqs: [
      { question: 'Do you write the copy?', answer: 'Yes, copy and design are both included.' },
      { question: 'Hosting?', answer: 'Quoted separately or set up on your existing platform.' },
    ],
    image: null,
    imageAlt: 'Designer\'s desk with laptop and graphics tablet',
  },
  'content-starter-pack': {
    variant: 'disc',
    headline: 'A month of posting,',
    accent: 'decided in a week.',
    audience: [
      'Practitioners who stop posting by week three',
      'One campaign theme to carry',
      'Teams without a designer',
    ],
    faqs: [
      { question: 'Which platforms?', answer: 'Graphics are sized for Instagram and Facebook; captions adapt to LinkedIn.' },
      { question: 'Can I edit them?', answer: 'Yes, files are delivered as editable templates.' },
    ],
    image: null,
    imageAlt: 'Colour pencils arranged in a circle',
  },
  'brand-identity': {
    variant: 'disc',
    headline: 'A brand that looks like',
    accent: 'the work you do.',
    audience: [
      'New practices',
      'Rebrands after a change of direction',
      'Teams who need templates, not just a logo',
    ],
    faqs: [
      { question: 'Starter or Signature?', answer: 'Starter (R2,800) for a solo practice; Signature (R5,500) when you need a full suite and guideline.' },
      { question: 'Revisions?', answer: 'One consolidated round on Starter, two on Signature.' },
    ],
    image: null,
    imageAlt: 'Graphics tablet and laptop in use',
  },
  'content-pack-12': {
    variant: 'disc',
    headline: 'Original graphics,',
    accent: 'not templates.',
    audience: [
      'Established brands with a guideline',
      'Campaigns that need infographics',
      'A quarter of posting in one delivery',
    ],
    faqs: [
      { question: 'How many infographics?', answer: 'Up to four, approved at concept stage before design.' },
    ],
    image: null,
    imageAlt: 'Designer\'s desk with laptop and graphics tablet',
  },
  'growth-desk': {
    variant: 'editorial',
    headline: 'The work that never quite',
    accent: 'gets done.',
    audience: [
      'Practices with no marketing hire',
      'Owners tired of chasing freelancers',
      'Brands that need consistent output and a monthly read',
    ],
    faqs: [
      { question: 'Is there a minimum term?', answer: 'Retainers are payable monthly in advance; a three-month initial term is recommended.' },
      { question: 'What if I need more hours?', answer: 'Additional work is billed at R1,500 per hour or as a prepaid block.' },
    ],
    image: null,
    imageAlt: 'Young plant growing',
  },
  'social-media-management': {
    variant: 'editorial',
    headline: 'Consistent, on brand,',
    accent: 'every week.',
    audience: [
      'Brands with source content to adapt',
      'Multi-platform presence',
      'Owners who want reporting, not guesswork',
    ],
    faqs: [
      { question: 'Why \'from\'?', answer: 'Five tiers from Essentials to Signature; cadence and rate are confirmed on enquiry.' },
    ],
    image: null,
    imageAlt: 'Team working together',
  },
  'executive-support': {
    variant: 'editorial',
    headline: 'Senior hands,',
    accent: 'by the hour.',
    audience: [
      'Leaders who need implementation, not advice',
      'AI and systems set-up',
      'Campaign operations under deadline',
    ],
    faqs: [
    ],
    image: null,
    imageAlt: 'Designer\'s desk with laptop and graphics tablet',
  },
  'podcast-starter': {
    variant: 'duo',
    headline: 'Start the show',
    accent: 'properly.',
    audience: [
      'A first podcast',
      'Practitioners with an audience and no format',
      'Deciding before buying equipment',
    ],
    faqs: [
      { question: 'Do you produce episodes?', answer: 'Episode production is quoted separately once the format is set.' },
    ],
    image: null,
    imageAlt: 'Microphone',
  },
  'podcast-concept': {
    variant: 'duo',
    headline: 'Audience, format,',
    accent: 'launch plan.',
    audience: [
      'Shows that stalled after a pilot',
      'Organisations launching a branded podcast',
      'Formats that need a guest strategy',
    ],
    faqs: [
      { question: 'What do I receive?', answer: 'A format document: audience, purpose, episode structure, guest strategy and launch plan.' },
    ],
    image: null,
    imageAlt: 'Microphone',
  },
  'podcast-launch': {
    variant: 'duo',
    headline: 'A launch people',
    accent: 'can find.',
    audience: [
      'A finished pilot season',
      'Shows that need a page and a pathway',
      'Launches with a date',
    ],
    faqs: [
      { question: 'What is tracked?', answer: 'Page visits, follows and the pathway from listener to enquiry.' },
    ],
    image: null,
    imageAlt: 'Microphone',
  },
  'campaign-command-centre': {
    variant: 'wide',
    headline: 'One place where the',
    accent: 'campaign lives.',
    audience: [
      'Events, screenings and launches',
      'Partner-driven campaigns',
      'Teams who need one dashboard and one report',
    ],
    faqs: [
      { question: 'What is separate?', answer: 'Venue hire, catering, performers, transport, ticketing charges, technical suppliers, printing and paid advertising, unless expressly included.' },
      { question: 'How is it priced?', answer: 'From R12,500, confirmed after a short brief.' },
    ],
    image: null,
    imageAlt: 'Stage lights',
  },
  'event-marketing': {
    variant: 'wide',
    headline: 'Fill the room,',
    accent: 'report the result.',
    audience: [
      'Retreats, workshops and talks',
      'Organisers without a marketing team',
      'Events that need a listing and a pathway',
    ],
    faqs: [
      { question: 'Ticketing?', answer: 'We set up the pathway; ticketing platform charges are paid by the organiser.' },
    ],
    image: null,
    imageAlt: 'Theatre seats',
  },
  'screening-campaign': {
    variant: 'wide',
    headline: 'Put the film',
    accent: 'in front of people.',
    audience: [
      'Documentary and impact films',
      'NGOs using film for outreach',
      'Screenings with partner organisations',
    ],
    faqs: [
      { question: 'What is included?', answer: 'Film positioning, ticketing, campaign hub, partner mobilisation, social assets and reporting.' },
    ],
    image: null,
    imageAlt: 'Cinema',
  },
  'workshops': {
    variant: 'wide',
    headline: 'AI, content and conscious leadership,',
    accent: 'taught in a day.',
    audience: [
      'Teams adopting AI responsibly',
      'Organisations building content capacity',
      'Leadership groups and retreats',
    ],
    faqs: [
      { question: 'Where?', answer: 'Cape Town in person, or online.' },
      { question: 'Half or full day?', answer: 'From R7,500 half day, from R12,500 full day; content is adapted to the group.' },
    ],
    image: null,
    imageAlt: 'Team working together',
  },
};

/** Detail content for a service slug, or null when none is defined. */
export const getServiceDetailContent = (
  slug: string | undefined
): ServiceDetailContent | null => (slug ? SERVICE_DETAIL_CONTENT[slug] ?? null : null);

