#!/usr/bin/env node
/**
 * Post-build prerender for the public marketing routes.
 *
 * APPROACH (decision logged in REVENUE_ENGINE_REPORT.md): same mechanism as
 * scripts/prerender-event.mjs, which is proven in production for
 * /events/stunning-pigs. For every route in src/seo/routeMeta.mjs that owns a
 * title and description, this writes dist/<route>/index.html: a copy of the
 * built dist/index.html with the head rewritten (title, description, og:*,
 * twitter:*, canonical). Netlify serves an existing file in preference to the
 * /* SPA fallback, so crawlers and scrapers that do not execute JavaScript
 * see the correct head per route. React boots from the same module script and
 * createRoot replaces the shell, so nothing else changes for users.
 *
 * A few high-value marketing routes additionally get a small static body
 * (h1 + intro + crawlable links) inside #root, so text-only fetchers get
 * visible body content. The rest are head-only: a generic body shell on all
 * ~40 routes would flash briefly before React paints, and a wrong shell is
 * worse than none.
 *
 * NEVER prerendered: routes under NOINDEX_PREFIXES (mirrors robots.txt), and
 * selfManaged routes whose pages own richer heads (the event page has its own
 * dedicated prerenderer with JSON-LD; the tour pages carry fetched data).
 *
 * DYNAMIC TOURS: with TOURS_FROM_SUPABASE=1 and the anon env vars present,
 * published tour slugs are fetched read-only with the PUBLIC anon key and
 * given head-only prerenders from the slug fallback. Failure of that fetch
 * logs and continues: this script must never fail the build. No service role
 * key is used anywhere in the build, and none must ever be added.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE_ORIGIN,
  DEFAULT_OG_IMAGE,
  ROUTE_META,
  isNoindexPath,
  findDynamicMeta,
} from '../src/seo/routeMeta.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const baseHtml = readFileSync(join(dist, 'index.html'), 'utf8');

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Rewrite one head tag, adding it before </head> when absent. */
function setMeta(html, attr, key, value) {
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, 'i');
  return re.test(html)
    ? html.replace(re, tag)
    : html.replace('</head>', `    ${tag}\n  </head>`);
}

function renderHead(html, { title, description, path, image }) {
  const url = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:type', 'website');
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:image', image || DEFAULT_OG_IMAGE);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'name', 'twitter:image', image || DEFAULT_OG_IMAGE);
  const canonical = `<link rel="canonical" href="${url}" />`;
  html = /<link\s+rel="canonical"[^>]*>/.test(html)
    ? html.replace(/<link\s+rel="canonical"[^>]*>/, canonical)
    : html.replace('</head>', `    ${canonical}\n  </head>`);
  return html;
}

/**
 * Static body shells for the routes where text-only fetchers matter most.
 * Kept deliberately small and factual; React replaces them on boot. Links are
 * real crawlable internal links to the canonical tour URLs.
 */
const KNOWN_TOURS = [
  ['/tours/muizenberg-cave-tours', 'Muizenberg Cave Tours'],
  ['/tours/great-mother-cave-tour', 'Great Mother Cave Tour'],
  ['/tours/kalk-bay-tour', 'Kalk Bay Tour'],
  ['/tours/winter-wine-country-wellness', 'Winter Wine Country Wellness Retreat'],
];

const tourLinks = KNOWN_TOURS.map(
  ([href, name]) => `<li><a href="${href}">${name}</a></li>`
).join('');

const BODY_SHELLS = {
  '/tours-retreats': `
    <main style="max-width:720px;margin:0 auto;padding:48px 20px;font-family:system-ui,sans-serif;color:#15201f">
      <h1 style="font-size:2rem;margin-bottom:.5rem">Tours and Retreats</h1>
      <p>Wellness tours, day experiences and retreats around Cape Town from Omni Wellness Media. Browse each experience for dates, prices and what is included.</p>
      <ul>${tourLinks}</ul>
      <p><a href="/contact">Contact us</a> to plan a private or group experience.</p>
    </main>`,
  '/tours': `
    <main style="max-width:720px;margin:0 auto;padding:48px 20px;font-family:system-ui,sans-serif;color:#15201f">
      <h1 style="font-size:2rem;margin-bottom:.5rem">Wellness Tours</h1>
      <p>Guided wellness tours in and around Cape Town: caves, coastline, culture and mindful travel with local guides.</p>
      <ul>${tourLinks}</ul>
    </main>`,
  '/services': `
    <main style="max-width:720px;margin:0 auto;padding:48px 20px;font-family:system-ui,sans-serif;color:#15201f">
      <h1 style="font-size:2rem;margin-bottom:.5rem">Services</h1>
      <p>Media production, impact screenings, sponsorship packaging, web development and social media strategy for brands, NGOs and founders in South Africa.</p>
      <ul>
        <li><a href="/media-production">Media Production</a></li>
        <li><a href="/screenings">Impact Screenings</a></li>
        <li><a href="/business-consulting">Business Consulting</a></li>
        <li><a href="/web-development">Web Development</a></li>
        <li><a href="/social-media-strategy">Social Media Strategy</a></li>
      </ul>
    </main>`,
};

let written = 0;
const skipped = [];

for (const entry of ROUTE_META) {
  if (entry.selfManaged || !entry.title || !entry.description) {
    skipped.push(entry.path);
    continue;
  }
  if (isNoindexPath(entry.path)) {
    skipped.push(`${entry.path} (noindex)`);
    continue;
  }
  let html = renderHead(baseHtml, entry);
  const shell = BODY_SHELLS[entry.path];
  if (shell) {
    html = html.replace('<div id="root"></div>', `<div id="root">${shell}</div>`);
  }
  // "/" writes dist/index.html itself; everything else gets a directory.
  const outDir = entry.path === '/' ? dist : join(dist, entry.path.slice(1));
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, 'index.html');
  // The event prerenderer owns its file; never clobber another route's output.
  if (entry.path !== '/' && existsSync(outFile)) {
    skipped.push(`${entry.path} (already prerendered)`);
    continue;
  }
  writeFileSync(outFile, html);
  written++;
}

// Head-only prerenders for published dynamic tours, when reachable.
if (process.env.TOURS_FROM_SUPABASE === '1') {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    try {
      const res = await fetch(
        `${url}/rest/v1/tours?select=slug,title,subtitle&status=eq.published&limit=200`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = await res.json();
      for (const row of rows) {
        if (!row.slug || !/^[a-z0-9-]+$/.test(row.slug)) continue;
        const path = `/tours/${row.slug}`;
        const outFile = join(dist, path.slice(1), 'index.html');
        if (existsSync(outFile)) continue; // static page already handled it
        const fallback = findDynamicMeta(path);
        const meta = {
          path,
          title: row.title
            ? `${row.title} | Wellness Tours | Omni Wellness Media`
            : fallback.title,
          description: (row.subtitle || fallback.description).slice(0, 158),
        };
        mkdirSync(dirname(outFile), { recursive: true });
        writeFileSync(outFile, renderHead(baseHtml, meta));
        written++;
      }
    } catch (err) {
      console.warn(`prerender: dynamic tours skipped (${err.message})`);
    }
  }
}

console.log(
  `prerender-marketing: wrote ${written} routes, skipped ${skipped.length} (selfManaged/noindex/no-copy)`
);
