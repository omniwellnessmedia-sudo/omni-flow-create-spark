#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml from the route registry
 * (src/seo/routeMeta.mjs), which mirrors the router in src/App.tsx.
 *
 * Only canonical, indexable, non-redirecting routes are emitted:
 *   - redirect routes (Navigate elements, _redirects 301s) never appear;
 *   - noindex surfaces (NOINDEX_PREFIXES) never appear;
 *   - the /tour-detail/ fork and the collapsed commerce routes are gone.
 *
 * DYNAMIC TOURS: when TOURS_FROM_SUPABASE=1 and the anon key env vars are
 * present, published tours are appended from the tours table using the
 * PUBLIC anon key, read-only. Any failure logs and falls back to the static
 * list: sitemap generation must never fail a build. (No service role key is
 * used anywhere in the build, and none must ever be added.)
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs            # writes public/sitemap.xml
 *   node scripts/generate-sitemap.mjs <outfile>  # writes elsewhere (dist copy)
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { SITE_ORIGIN, ROUTE_META, isNoindexPath } from '../src/seo/routeMeta.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', process.argv[2] || 'public/sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

async function fetchDynamicTourPaths() {
  if (process.env.TOURS_FROM_SUPABASE !== '1') return [];
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/tours?select=slug&status=eq.published&limit=200`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    return rows
      .map((r) => r.slug)
      .filter((s) => typeof s === 'string' && /^[a-z0-9-]+$/.test(s))
      .map((s) => `/tours/${s}`);
  } catch (err) {
    console.warn(`sitemap: dynamic tours skipped (${err.message}), using static list`);
    return [];
  }
}

const staticPaths = new Set(ROUTE_META.map((r) => r.path));
const dynamicPaths = (await fetchDynamicTourPaths()).filter(
  (p) => !staticPaths.has(p)
);

const entries = [
  ...ROUTE_META.filter((r) => !isNoindexPath(r.path)),
  ...dynamicPaths.map((path) => ({ path, priority: 0.7, changefreq: 'monthly' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (r) => `  <url>
    <loc>${SITE_ORIGIN}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq || 'monthly'}</changefreq>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(OUT, xml);
console.log(`sitemap: wrote ${entries.length} URLs to ${OUT}`);
