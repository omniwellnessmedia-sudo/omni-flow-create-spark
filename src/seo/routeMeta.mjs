/**
 * Single source of truth for the public route surface.
 *
 * Plain .mjs on purpose: this module is imported by three consumers with
 * incompatible toolchains, and data in a TS file would be unreachable from
 * two of them without a transpile step the build does not have.
 *
 *   1. src/components/RouteSEO.tsx     (Vite bundle, per-navigation head tags)
 *   2. scripts/generate-sitemap.mjs    (Node, writes public/sitemap.xml)
 *   3. scripts/prerender-marketing.mjs (Node post-build, static head per route)
 *
 * No imports here and no browser globals: Node 18 must be able to load this
 * file directly during the Netlify build.
 *
 * RULES FOR ENTRIES
 * - `title` unique across the site, under ~65 characters, brand suffix on all
 *   but the homepage.
 * - `description` unique, honest, no unverified figures, no em or en dashes.
 *   Event figures are governed (see src/pages/Screenings.tsx header): do not
 *   add numbers about the 10 August event here.
 * - `selfManaged: true` marks routes whose page component already calls
 *   useSEO/useTourSEO with richer data. RouteSEO must not touch those.
 * - `sitemap: false` keeps a route out of sitemap.xml without making it
 *   noindex (utility surfaces). Robots-disallowed routes live in NOINDEX
 *   below and never enter the sitemap at all.
 */

export const SITE_ORIGIN = 'https://omniwellnessmedia.co.za';

export const DEFAULT_OG_IMAGE =
  'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/omni-favicons/android-chrome-512x512.png';

/**
 * Route prefixes that must carry <meta name="robots" content="noindex">.
 * Mirrors public/robots.txt plus auth and tooling surfaces that robots.txt
 * does not list but that have no business in an index.
 */
export const NOINDEX_PREFIXES = [
  '/admin',
  '/accountant',
  '/auth',
  '/update-password',
  '/upgrade',
  '/checkout',
  '/order-confirmation',
  '/payment-success',
  '/payment-cancelled',
  '/guest-order-lookup',
  '/test',
  '/test-simple',
  '/bwc-team-staging',
  '/team/bwc',
  '/provider-dashboard',
  '/provider-portal',
  '/partner-portal',
  '/wellness-exchange/account',
  '/wellness-exchange/provider-dashboard',
  '/wellness-exchange/add-service',
  '/wellness-exchange/edit-service',
  '/wellness-exchange/add-want',
  '/blog-editor',
  '/blog/editor',
  '/transaction',
  '/wishlist',
  '/integration-test',
  '/api-test',
  '/technical-overview',
  '/add-service',
  '/edit-service',
  '/add-want',
];

/** True when a pathname is under a noindex prefix. */
export function isNoindexPath(pathname) {
  return NOINDEX_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

/**
 * The canonical public surface. Paths listed here are real, non-redirecting
 * routes in src/App.tsx. Keep this list in step with the router: the
 * router-vs-sitemap audit in REVENUE_ENGINE_REPORT.md was generated from it.
 */
export const ROUTE_META = [
  {
    path: '/',
    title: 'Omni Wellness Media | Conscious Media, Events and Wellness Travel in Cape Town',
    description:
      'Cape Town conscious media house: film screenings and live events, media production, wellness tours and retreats, and campaigns that fund causes.',
    priority: 1.0,
    changefreq: 'weekly',
  },
  {
    path: '/about',
    title: 'About Us | Omni Wellness Media',
    description:
      'Who we are and why we build media, events and wellness experiences that put people, animals and community outcomes first.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/contact',
    title: 'Contact | Omni Wellness Media',
    description:
      'Talk to the Omni Wellness Media team about screenings, media production, sponsorships, tours and partnerships. We reply within one working day.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/services',
    title: 'Services | Media, Events and Digital | Omni Wellness Media',
    description:
      'Media production, impact screenings, sponsorship packaging, web development and social strategy for brands, NGOs and founders in South Africa.',
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/screenings',
    selfManaged: true,
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/business-consulting',
    title: 'Business Consulting | Omni Wellness Media',
    description:
      'Practical business development for wellness and impact ventures: positioning, offers, partnerships and revenue plans that hold up in the market.',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/media-production',
    title: 'Media Production | Omni Wellness Media',
    description:
      'Purpose driven video, photography and campaign content produced in Cape Town, from concept and scripting through shoot, edit and delivery.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/web-development',
    title: 'Web Development | Omni Wellness Media',
    description:
      'Fast, search friendly websites and landing pages for wellness brands and campaigns, built to convert visitors into enquiries and bookings.',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/social-media-strategy',
    title: 'Social Media Strategy | Omni Wellness Media',
    description:
      'Content strategy, calendars and campaign management that grow engaged audiences for wellness and impact brands without empty vanity metrics.',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/conscious-media-partnership',
    title: 'Conscious Media Partnership | Omni Wellness Media',
    description:
      'Partner with a media house that ties brand campaigns to real community outcomes: screenings, events, content and measurable cause impact.',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/conscious-media-infrastructure',
    title: 'Conscious Media Infrastructure | Omni Wellness Media',
    description:
      'The systems behind our campaigns: production, distribution, community and partner network, available as infrastructure for your cause or brand.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/portfolio',
    title: 'Portfolio | Omni Wellness Media',
    description:
      'Selected media production, events and campaign work from Omni Wellness Media, with the outcomes each project delivered.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/podcast',
    title: 'Podcast | Omni Wellness Media',
    description:
      'Conversations on wellness, conscious business and community impact from the Omni Wellness Media studio in Cape Town.',
    priority: 0.6,
    changefreq: 'weekly',
  },
  {
    path: '/resources',
    title: 'Resources | Omni Wellness Media',
    description:
      'Guides, tools and templates on wellness business, media and marketing, free to use from the Omni Wellness Media team.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/community',
    title: 'Community Blog | Omni Wellness Media',
    description:
      'Stories, updates and ideas from the Omni Wellness Media community: events, campaigns, wellness practice and local business.',
    priority: 0.7,
    changefreq: 'weekly',
  },
  {
    path: '/community/events',
    title: 'Community Events | Omni Wellness Media',
    description:
      'Upcoming and past community events from Omni Wellness Media and partners: screenings, workshops and campaign evenings in Cape Town.',
    priority: 0.7,
    changefreq: 'weekly',
  },
  {
    path: '/events/stunning-pigs',
    selfManaged: true,
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/csr-impact',
    selfManaged: true,
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/partners-directory',
    title: 'Partners Directory | Omni Wellness Media',
    description:
      'The organisations and businesses we work with across wellness, media and community campaigns in South Africa.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/marketplace',
    title: 'Wellness Marketplace | Omni Wellness Media',
    description:
      'Shop wellness products and deals from local South African businesses and curated partners, in one marketplace.',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/wellness-exchange',
    title: 'Wellness Exchange | Omni Wellness Media',
    description:
      'A community exchange where wellness providers list services and members find practitioners, classes and support near them.',
    priority: 0.7,
    changefreq: 'weekly',
  },
  {
    path: '/wellness-exchange/marketplace',
    title: 'Wellness Exchange Marketplace | Omni Wellness Media',
    description:
      'Browse wellness services listed by community providers: bodywork, coaching, classes and more across South Africa.',
    priority: 0.6,
    changefreq: 'weekly',
  },
  {
    path: '/tours',
    title: 'Wellness Tours | Omni Wellness Media',
    description:
      'Guided wellness tours in and around Cape Town: caves, coastline, culture and mindful travel with local guides.',
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/tours-retreats',
    title: 'Tours and Retreats | Omni Wellness Media',
    description:
      'Wellness tours, day experiences and retreats around Cape Town: browse dates, prices and what each experience includes.',
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/tours/muizenberg-cave-tours',
    selfManaged: true,
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/tours/great-mother-cave-tour',
    selfManaged: true,
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/tours/kalk-bay-tour',
    selfManaged: true,
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/tours/winter-wine-country-wellness',
    title: 'Winter Wine Country Wellness Retreat | Omni Wellness Media',
    description:
      'A winter wellness retreat in the Cape winelands: restorative days, mindful food and wine, and space to reset. See dates and what is included.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/experiences/cart-horse-urban-wellness',
    selfManaged: true,
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/experiences/corporate-wellness-retreat',
    selfManaged: true,
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/viator-wellness-experiences',
    title: 'Wellness Experiences Worldwide | Omni Wellness Media',
    description:
      'Hand picked wellness experiences around the world, bookable through our Viator partner shop: spas, retreats, nature and mindful travel.',
    priority: 0.6,
    changefreq: 'weekly',
  },
  {
    path: '/roambuddy-store',
    title: 'RoamBuddy Travel eSIM Store | Omni Wellness Media',
    description:
      'Stay connected while you travel: RoamBuddy eSIM data packages for over 160 countries, activated in minutes, no physical SIM needed.',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/data-products',
    title: 'Travel Data Products | Omni Wellness Media',
    description:
      'Compare travel data products and connectivity options for your next trip, curated by the Omni Wellness Media team.',
    priority: 0.5,
    changefreq: 'weekly',
  },
  {
    path: '/exercise-library',
    title: 'Exercise Library | Omni Wellness Media',
    description:
      'A free library of guided exercises and movement practices for daily wellness, searchable by focus area and time available.',
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/device-compatibility',
    title: 'eSIM Device Compatibility | Omni Wellness Media',
    description:
      'Check whether your phone supports eSIM before you buy a travel data package. Full compatibility list by brand and model.',
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/programs/uwc-human-animal',
    title: 'UWC Human Animal Programme | Omni Wellness Media',
    description:
      'A university partnered programme exploring the human animal bond through research, education and community projects.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/programs/uwc-human-animal/university-partners',
    title: 'University Partners | UWC Human Animal Programme',
    description:
      'The academic partners collaborating on the UWC Human Animal Programme and what each brings to the research and teaching.',
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/programs/uwc-human-animal/sponsors',
    title: 'Sponsors | UWC Human Animal Programme',
    description:
      'Sponsorship opportunities in the UWC Human Animal Programme: fund research, education and community outreach with visible recognition.',
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/programs/uwc-human-animal/recruitment',
    title: 'Recruitment | UWC Human Animal Programme',
    description:
      'Join the UWC Human Animal Programme: open roles, student opportunities and how to apply.',
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/affiliate-marketplace',
    title: 'Affiliate Marketplace | Omni Wellness Media',
    description:
      'Wellness and travel products from our affiliate partners, curated for quality and value by the Omni team.',
    priority: 0.5,
    changefreq: 'weekly',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Omni Wellness Media',
    description:
      'How Omni Wellness Media collects, uses and protects personal information, including your POPIA rights and how to exercise them.',
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service | Omni Wellness Media',
    description:
      'The terms that govern use of the Omni Wellness Media website, services, events and marketplace.',
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    path: '/cookie-policy',
    title: 'Cookie Policy | Omni Wellness Media',
    description:
      'What cookies this site uses, what they do, and how to manage them in your browser.',
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    path: '/esg-policy',
    title: 'ESG Policy | Omni Wellness Media',
    description:
      'Our environmental, social and governance commitments and how they shape the projects and partners we take on.',
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    path: '/roambuddy/terms',
    title: 'RoamBuddy Terms | Omni Wellness Media',
    description: 'Terms of sale and use for RoamBuddy eSIM products purchased through Omni Wellness Media.',
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    path: '/roambuddy/privacy',
    title: 'RoamBuddy Privacy | Omni Wellness Media',
    description: 'Privacy terms for RoamBuddy eSIM products purchased through Omni Wellness Media.',
    priority: 0.3,
    changefreq: 'yearly',
  },
];

/**
 * Dynamic route patterns that deserve a head even before their data loads.
 * `match` is a RegExp on the pathname; `meta(params)` builds a fallback from
 * the URL alone. The page component may then overwrite with fetched data.
 */
export const DYNAMIC_META = [
  {
    // Canonical tour detail. The three named tours above match their static
    // routes first (React Router ranks static segments higher), so this only
    // sees genuinely dynamic slugs.
    match: /^\/tours\/([a-z0-9-]+)$/,
    meta: (m) => {
      const name = m[1]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return {
        title: `${name} | Wellness Tours | Omni Wellness Media`,
        description: `Details, dates and booking for ${name}, a wellness experience from Omni Wellness Media in Cape Town.`,
      };
    },
  },
  {
    match: /^\/tour-category\/([a-z0-9-]+)$/,
    meta: (m) => {
      const name = m[1]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return {
        title: `${name} Tours | Omni Wellness Media`,
        description: `Browse ${name} wellness tours and experiences from Omni Wellness Media.`,
      };
    },
  },
];

/** Exact-path lookup used by RouteSEO and the build scripts. */
export function findRouteMeta(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return ROUTE_META.find((r) => r.path === clean) || null;
}

/** Fallback lookup for dynamic paths. Returns {title, description} or null. */
export function findDynamicMeta(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  for (const d of DYNAMIC_META) {
    const m = clean.match(d.match);
    if (m) return d.meta(m);
  }
  return null;
}
