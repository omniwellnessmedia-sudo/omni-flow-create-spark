/**
 * The Indigenous Walks: canonical shared content, mirrored from the operator.
 *
 * PROVENANCE. Every word of walk content in this file is taken from the
 * Ubuntu Journeys repository (Tumi4/ubuntu-journeys, supplied as a zip by
 * Tumelo on 30 August 2026), which is the operator's own platform for these
 * walks. That repository keeps this content in shared components
 * (PricingTiers.tsx, WhatsIncluded.tsx) precisely so its pages cannot drift
 * apart; this file twins that architecture on the Omni side. When the
 * operator's wording changes, it changes here, once.
 *
 * WHAT THE MIRRORING CORRECTED. Before this file existed, the three Omni
 * tour pages presented the R2,330 / R2,050 / R1,850 tiers as the price of
 * each individual walk. The operator's own copy is explicit that these
 * rates are "all-inclusive for all three cultural walks" with individual
 * walk pricing on request, so the Omni pages were materially misquoting the
 * offer. They also promised a printed participation document that appears
 * nowhere in the operator's inclusions. Both corrected by mirroring.
 *
 * Cape Point: the operator's repository itself states the Cape Point
 * Peninsula experience "is currently available as a private custom booking"
 * and deliberately gives it no public tour page. Omni therefore lists it as
 * an enquiry line, not a page.
 *
 * No em dashes in this file.
 */

export interface WalkSummary {
  number: 1 | 2 | 3;
  slug: string;
  href: string;
  title: string;
  duration: string;
  location: string;
  difficulty: 'Moderate' | 'Challenging';
  startPoint: string;
  startPointNote: string;
  timingNote: string;
  /** The operator's About This Walk paragraphs, verbatim. */
  about: string[];
}

export const INDIGENOUS_WALKS: WalkSummary[] = [
  {
    number: 1,
    slug: 'great-mother-cave-tour',
    href: '/tours/great-mother-cave-tour',
    title: 'The Great Mother Cave Journey',
    duration: '4-5 hours',
    location: 'Fish Hoek',
    difficulty: 'Moderate',
    startPoint: 'Fish Hoek Athletics Club Parking Lot',
    startPointNote: 'Famous for: 12,000-year-old archaeological caves with ancient rock art',
    timingNote: 'Early morning or afternoon. Discuss preferred time at booking.',
    about: [
      "This journey takes you to South Africa's most sacred archaeological sites: the legendary Ascension – Tunnel and Peer's Cave. These sites embody 12,000 years of unbroken Indigenous heritage, holding immense archaeological and cultural importance to the Khoi and San people. The path traces ancient routes, offering insights into the daily lives and deep connection to the land of generations past.",
      'Within these caves, you will discover compelling evidence of early human occupation — most notably ancient rock art that offers a direct connection to the spiritual beliefs and storytelling traditions of the Khoi and San people.',
      'For the Khoi and San, these caves were vital shelters, communal gathering places, and sites of profound spiritual ceremony — connecting them to their ancestors and the Great Mother. Chief Kingsley shares the living, breathing stories that no academic interpretation can: knowledge passed directly through the bloodline of the Gorachouqua.',
    ],
  },
  {
    number: 2,
    slug: 'muizenberg-cave-tours',
    href: '/tours/muizenberg-cave-tours',
    title: "Muizenberg's Living Heritage",
    duration: '5-6 hours',
    location: 'Muizenberg',
    difficulty: 'Challenging',
    startPoint: 'Surfers Corner Circle (Walk of Fame)',
    startPointNote: 'Famous for iconic colourful beach huts and ancient Khoi-San coastal settlements',
    timingNote: 'Early morning (concluding before lunch) or afternoon (concluding before sunset). Discuss preferred timing at booking.',
    about: [
      "This walk takes you on a scenic route from Surfers Corner, ascending parts of Boyes Drive for panoramic views of a strategically important coastline, continuing on captivating trails towards Kalk Bay. Along the way, you'll discover ancient foraging and trade paths alongside breathtaking vistas of False Bay.",
      'Muizenberg was a vital Khoi-San settlement for thousands of years, where early Indigenous people flourished by expertly utilizing abundant marine resources and sheltered bays for sustenance and spiritual life. The coastal area holds immense cultural significance, rich with archaeological evidence such as specific rock formations and ancient shell middens.',
      'This unique experience connects you with an enduring ancient heritage, highlighting how Indigenous knowledge, traditions, and wisdom continue to shape South Africa today.',
    ],
  },
  {
    number: 3,
    slug: 'kalk-bay-tour',
    href: '/tours/kalk-bay-tour',
    title: "Kalk Bay's Rich Tapestry",
    duration: '5-6 hours',
    location: 'Kalk Bay',
    difficulty: 'Challenging',
    startPoint: 'Next to the Brass Bell Restaurant Entrance',
    startPointNote: 'Famous for: Historic working harbour and traditional herb trading',
    timingNote: 'Early morning or afternoon. Discuss preferred time at booking.',
    about: [
      "Explore Kalk Bay's vibrant coast — a site of profound historical and cultural significance — tracing ancient trade routes and the deep Indigenous wisdom of the Khoi people. For millennia, the Khoi forged a profound connection with the sea, developing sophisticated marine knowledge, sustainable fishing rhythms, and powerful healing plant medicine.",
      "This immersive journey guides you through the bustling, historic working harbour where traditional fishing methods reflect the enduring legacy of the Khoi's extensive trading networks. The walk continues to ancient coastal caves — sites of immense historical and spiritual significance that once served as sacred spaces and essential shelters.",
      'A key stop is the herb stands, where local experts share the rich history and profound significance of ancestral plant knowledge, demonstrating how traditional plant medicine continues to support community well-being and healing. Along challenging coastal trails, you traverse integral parts of these ancient trading routes, with breathtaking panoramic views of False Bay at key vantage points.',
    ],
  },
];

export const walkBySlug = (slug: string): WalkSummary | undefined =>
  INDIGENOUS_WALKS.find((w) => w.slug === slug);

export const otherWalks = (slug: string): WalkSummary[] =>
  INDIGENOUS_WALKS.filter((w) => w.slug !== slug);

/** Operator's inclusions, common to all three walks. Verbatim facts. */
export const WALK_INCLUSIONS: { title: string; desc: string }[] = [
  {
    title: 'Expert Indigenous Guidance',
    desc: 'Journey with Chief Kingsley and the team, sharing generations of ancestral knowledge for an authentic cultural experience.',
  },
  {
    title: 'Deep Cultural Immersion',
    desc: 'Storytelling, herbal and medicinal plant wisdom, traditional music and songs, Indigenous language teachings, rock art interpretation and sacred ceremonies.',
  },
  {
    title: 'Traditional Refreshments',
    desc: 'Fresh fruits, nuts, and herbal tea during the walk to keep you energised and refreshed.',
  },
  {
    title: 'Comprehensive Safety Support',
    desc: 'Qualified adventure guides ensure your well-being throughout the walk.',
  },
  {
    title: 'Commemorative Gift',
    desc: 'A meaningful indigenous gift after your walk to remember your connection to living heritage.',
  },
];

export const WALK_NOT_INCLUDED: string[] = [
  'Transport to and from venues',
  'Lunch and dinner (available as optional add-on, see the lunch package)',
  'Personal items and hiking gear',
  'Additional drinks',
];

/** The optional lunch package, verbatim from the operator. */
export const WALK_LUNCH = {
  price: '+R200 per person',
  intro:
    'Enhance your journey with a nourishing lunch package. Includes a vegan wrap or gourmet sandwich with a freshly squeezed juice.',
  veganWraps: {
    heading: 'Vegan Wraps (Gluten-Free)',
    items: [
      'Chilli Charmer: Chickpeas, avocado, fresh chilli, seasonal vegetables',
      'Rainbow: Hummus, roasted vegetables, crisp spinach',
      'Greatness: Falafel, tahini, fresh vegetables',
    ],
  },
  sandwiches: {
    heading: 'Gourmet Sandwiches',
    note: 'Ciabatta, Wholewheat, or Sourdough',
    items: [
      'Mediterranean: Grilled vegetables, pesto, rocket',
      'Plant-Power: Hummus, cucumber, avocado, sprouts',
    ],
  },
  juices: {
    heading: 'Freshly Squeezed Juices',
    items: ['Carrot-Ginger Blend', 'Apple-Mint Revitaliser', 'Green Detox Blend'],
  },
  footnote: 'Menu items subject to change based on seasonal availability.',
} as const;

/**
 * Pricing. THE TIERS ARE FOR THE FULL SUITE OF THREE WALKS, per the
 * operator: "Per person rates below are all-inclusive for all three cultural
 * walks" and "Individual walk pricing available on request." Any page that
 * shows these tiers must show the suite framing with them.
 */
export const WALK_PRICING_TIERS = [
  {
    range: '1-4 Travellers',
    label: 'Intimate Experience',
    price: 'R2,330',
    desc: 'Standard rate for individuals and smaller, intimate groups seeking personalised attention.',
  },
  {
    range: '5-9 Travellers',
    label: 'Small Group',
    price: 'R2,050',
    desc: 'A competitive rate for medium-sized groups, offering enhanced value.',
    popular: true,
  },
  {
    range: '10-12 Travellers',
    label: 'Group Experience',
    price: 'R1,850',
    desc: 'Our most economical rate for larger groups, ensuring maximum value for your experience.',
    bestValue: true,
  },
] as const;

export const WALK_PRICING_NOTES = {
  suite:
    'Per person rates are all-inclusive for all three cultural walks. Larger groups benefit from reduced per-person pricing.',
  individual:
    'These rates cover the full suite of three Indigenous walks. Individual walk pricing is available on request.',
} as const;

/** Cape Point, in the operator's own words: enquiry only, no public page. */
export const CAPE_POINT_NOTE =
  'The Cape Point Peninsula full-day experience is available as a private custom booking. Contact us to arrange a tailored journey.';
