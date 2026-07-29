/**
 * Post-build prerender for /events/stunning-pigs.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site is a client-rendered SPA: dist/index.html is an empty <div id="root">
 * plus a module script. For the event page that caused two concrete problems.
 *
 * 1. Crawlers and scrapers see nothing useful. facebookexternalhit, WhatsApp,
 *    LinkedIn, Twitterbot and Slack do not execute JavaScript, so every share
 *    of the event rendered the generic homepage card with a favicon thumbnail —
 *    the per-page tags that useSEO() injects at runtime were invisible to them.
 *    The same applies to a Google Ads policy reviewer fetching the landing page
 *    while assessing the event-ticket-seller certification: the organiser and
 *    face-value statements only existed after React booted.
 *
 * 2. Nothing painted until ~713KB of JS had downloaded, parsed and run across
 *    four sequential round trips. Measured LCP was 9.118s on an 85%-Android
 *    audience, and the LCP element is the hero text, not the poster.
 *
 * This emits a real dist/events/stunning-pigs/index.html carrying the correct
 * metadata, the Event JSON-LD, and a static hero. Netlify serves an existing
 * file in preference to the /* SPA fallback, so that path gets this document.
 * React still boots from the same module script and, because main.tsx uses
 * createRoot (not hydrateRoot), it replaces the shell once it is ready.
 *
 * KEEPING IT HONEST
 * -----------------
 * The facts below are duplicated from src/pages/events/StunningPigs.tsx, which
 * remains the source of truth. They are deliberately few and slow-moving. If
 * the date, price, venue or sessions change there, change them here too — a
 * mismatch between the prerendered shell and the hydrated page is worse than
 * no shell, because a policy reviewer may see one and a user the other.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const ORIGIN = 'https://omniwellnessmedia.co.za';
const ROUTE = '/events/stunning-pigs';
const PAGE_URL = `${ORIGIN}${ROUTE}`;
const POSTER_URL = `${ORIGIN}/events/wwpl-square.png`;
const QUICKET_URL =
  'https://www.quicket.co.za/events/386047-celebrating-women-who-protect-life-featuring-the-cape-town-premiere-of-stunning/';

const TITLE =
  'Celebrating Women Who Protect Life — 10 Aug at The Masque | Omni Wellness Media';
const DESCRIPTION =
  'The Cape Town premiere of the Stunning Pigs documentary, on Women\u2019s Day at The Masque Theatre, Muizenberg. Three sessions — film, food, voices and awards. R150 per session, assigned seating.';

const PLACE = {
  '@type': 'Place',
  name: 'The Masque Theatre',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '37 Main Road',
    addressLocality: 'Muizenberg',
    addressRegion: 'Western Cape',
    postalCode: '7945',
    addressCountry: 'ZA',
  },
};

const SESSIONS = [
  { name: 'What Feeds Us', start: '2026-08-10T10:00:00+02:00', end: '2026-08-10T12:00:00+02:00' },
  { name: 'Stunning Pigs — Cape Town Premiere', start: '2026-08-10T12:00:00+02:00', end: '2026-08-10T14:00:00+02:00' },
  { name: 'Voices for Women Showcase & Awards Ceremony', start: '2026-08-10T14:00:00+02:00', end: '2026-08-10T16:00:00+02:00' },
];

const offer = (url) => ({
  '@type': 'Offer',
  price: '150',
  priceCurrency: 'ZAR',
  availability: 'https://schema.org/InStock',
  url,
});

const EVENT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Celebrating Women Who Protect Life — Cape Town Premiere of Stunning Pigs',
  description: DESCRIPTION,
  startDate: '2026-08-10T10:00:00+02:00',
  endDate: '2026-08-10T16:00:00+02:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: [POSTER_URL],
  url: PAGE_URL,
  location: PLACE,
  organizer: {
    '@type': 'Organization',
    '@id': `${ORIGIN}/#organization`,
    name: 'Omni Wellness Media',
    url: ORIGIN,
  },
  offers: { ...offer(QUICKET_URL), validFrom: '2026-07-13T00:00:00+02:00', category: 'primary' },
  subEvent: SESSIONS.map((s) => ({
    '@type': 'Event',
    name: s.name,
    startDate: s.start,
    endDate: s.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: PLACE,
    url: PAGE_URL,
    image: [POSTER_URL],
    offers: offer(QUICKET_URL),
  })),
};

/**
 * Static hero. Inline styles only — the stylesheet is render-blocking, so this
 * must not depend on any class from it being meaningful, and it must not
 * reflow when React swaps in the real hero.
 */
const SHELL = `
      <div style="max-width:1180px;margin:0 auto;padding:96px 16px 64px;font-family:Inter,system-ui,sans-serif;color:#1c1917">
        <p style="margin:0 0 20px;font-size:13px;letter-spacing:.02em;color:#be123c">Cape Town Premiere · Women's Day, 10 August</p>
        <h1 style="margin:0 0 16px;font-size:40px;line-height:1.05;letter-spacing:-.02em">Celebrating Women<br />Who Protect Life</h1>
        <p style="margin:0 0 24px;font-size:18px;line-height:1.6;max-width:36rem;color:#57534e">
          One day at The Masque Theatre, Muizenberg — the Cape Town premiere of the
          <em>Stunning Pigs</em> documentary, plus a live Q&amp;A, and the <em>Voices for Women</em> awards.
        </p>
        <p style="margin:0 0 8px;font-size:14px;color:#57534e">Monday 10 August 2026 · Women's Day public holiday</p>
        <p style="margin:0 0 8px;font-size:14px;color:#57534e">The Masque Theatre, 37 Main Road, Muizenberg</p>
        <p style="margin:0 0 24px;font-size:14px;color:#57534e">Three sessions · 10:00, 12:00 &amp; 14:00 · assigned seating</p>
        <p style="margin:0 0 12px">
          <a href="${QUICKET_URL}" rel="noopener" target="_blank"
             style="display:inline-block;background:#e11d48;color:#fff;text-decoration:none;padding:16px 32px;border-radius:8px;font-weight:700;font-size:18px">
            Get tickets — R150 a session
          </a>
        </p>
        <p style="margin:0;font-size:14px;color:#57534e">
          R150 per session. Book one, two or all three. Assigned seating, sold by Quicket —
          The Masque Theatre's official ticketing partner. Omni Wellness Media organises and
          promotes this event and is not a ticket reseller; it adds no booking fee or markup.
        </p>
      </div>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

let html = readFileSync(join(dist, 'index.html'), 'utf8');
const before = html;

// --- metadata -------------------------------------------------------------
html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(TITLE)}</title>`);

const setMeta = (attr, key, value) => {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  html = re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
};

setMeta('name', 'description', DESCRIPTION);
setMeta('property', 'og:title', TITLE);
setMeta('property', 'og:description', DESCRIPTION);
setMeta('property', 'og:type', 'article');
setMeta('property', 'og:url', PAGE_URL);
setMeta('property', 'og:image', POSTER_URL);
setMeta('name', 'twitter:title', TITLE);
setMeta('name', 'twitter:description', DESCRIPTION);
setMeta('name', 'twitter:image', POSTER_URL);

html = html.replace(
  /<link rel="canonical" href="[^"]*"\s*\/?>/,
  `<link rel="canonical" href="${PAGE_URL}" />`
);

// --- structured data ------------------------------------------------------
html = html.replace(
  '</head>',
  `    <script type="application/ld+json">${JSON.stringify(EVENT_JSONLD)}</script>\n  </head>`
);

// --- static hero ----------------------------------------------------------
html = html.replace('<div id="root"></div>', `<div id="root">${SHELL}</div>`);

// Fail the build rather than deploy a shell that silently did nothing.
const checks = [
  [html !== before, 'no substitutions were made'],
  [html.includes(PAGE_URL), 'canonical/og:url missing'],
  [html.includes('"@type":"Event"'), 'Event JSON-LD missing'],
  [html.includes('Celebrating Women<br />Who Protect Life'), 'hero shell missing'],
  [html.includes('id="root">'), 'root container missing'],
];
for (const [ok, why] of checks) {
  if (!ok) throw new Error(`prerender-event: ${why}`);
}

const outDir = join(dist, 'events', 'stunning-pigs');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), html);

console.log(`prerendered ${ROUTE} -> dist/events/stunning-pigs/index.html (${(html.length / 1024).toFixed(1)}KB)`);
