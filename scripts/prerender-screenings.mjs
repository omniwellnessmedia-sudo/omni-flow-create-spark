#!/usr/bin/env node
/**
 * Post-build prerender for /screenings.
 *
 * Two jobs:
 *   1. Server-side head for the route: distinct title, description, og and
 *      twitter tags and a self-referencing canonical, so crawlers and
 *      scrapers that do not execute JavaScript see the correct head. Same
 *      mechanism as scripts/prerender-event.mjs, proven in production.
 *   2. A static testimonial block containing EXACTLY the records the
 *      consent gate publishes. The gate itself (src/lib/testimonialGate.ts)
 *      is bundled and executed here via esbuild, so this static HTML can
 *      never disagree with the runtime gate: if the gate blocks a record,
 *      it is absent here too. When zero records are publishable, no
 *      testimonial markup is emitted at all.
 *
 * React boots from the same module script and createRoot replaces the
 * shell. No person's name appears in any meta tag. No em dashes here.
 */
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { build } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const ORIGIN = "https://omniwellnessmedia.co.za";
const ROUTE = "/screenings";
const PAGE_URL = `${ORIGIN}${ROUTE}`;
const IMAGE_URL = `${ORIGIN}/screenings/night/stage-screen-wide.webp`;
const TITLE = "Impact Screenings | Film Screening as a Service | Omni Wellness Media";
const DESCRIPTION =
  "Turnkey documentary screenings for the Southern Peninsula, Cape Town. We deliver the audience, the theatre, the campaign moment and the recap, for filmmakers, NGOs and brands.";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function bundleImport(entry) {
  const tmp = mkdtempSync(join(tmpdir(), "prerender-screenings-"));
  const outfile = join(tmp, "bundle.mjs");
  await build({
    entryPoints: [join(root, entry)],
    bundle: true,
    format: "esm",
    platform: "neutral",
    outfile,
    alias: { "@": join(root, "src") },
    logLevel: "silent",
  });
  const mod = await import(pathToFileURL(outfile).href);
  rmSync(tmp, { recursive: true, force: true });
  return mod;
}

try {
  const gate = await bundleImport("src/lib/testimonialGate.ts");
  const data = await bundleImport("src/data/testimonials.ts");
  const published = data.TESTIMONIALS.filter((t) => gate.isPublishable(t));

  let html = readFileSync(join(dist, "index.html"), "utf8");

  const setMeta = (attr, key, value) => {
    const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
    const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, "i");
    html = re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
  };

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(TITLE)}</title>`);
  setMeta("name", "description", DESCRIPTION);
  setMeta("property", "og:title", TITLE);
  setMeta("property", "og:description", DESCRIPTION);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:url", PAGE_URL);
  setMeta("property", "og:image", IMAGE_URL);
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", TITLE);
  setMeta("name", "twitter:description", DESCRIPTION);
  setMeta("name", "twitter:image", IMAGE_URL);
  const canonical = `<link rel="canonical" href="${PAGE_URL}" />`;
  html = /<link\s+rel="canonical"[^>]*>/.test(html)
    ? html.replace(/<link\s+rel="canonical"[^>]*>/, canonical)
    : html.replace("</head>", `    ${canonical}\n  </head>`);

  if (published.length > 0) {
    const quoteBlocks = published
      .map(
        (t) => `      <figure style="margin:0 0 16px;border:1px solid #e2ded4;border-left:3px solid #339999;border-radius:12px;padding:20px;background:#faf8f2">
        <blockquote style="margin:0;color:#15201f;font-size:15px;line-height:1.6">"${esc(t.quotePublished)}"</blockquote>
        <figcaption style="margin-top:10px"><cite style="font-style:normal;color:#339999;font-size:13px">Attendee, August 2026</cite></figcaption>
      </figure>`
      )
      .join("\n");
    const shell = `
    <main style="max-width:720px;margin:0 auto;padding:48px 20px;font-family:system-ui,sans-serif;color:#15201f">
      <h1 style="font-size:2rem;margin-bottom:.5rem">Impact Screenings</h1>
      <p>${esc(DESCRIPTION)}</p>
      <h2 style="font-size:1.4rem;margin:2rem 0 .5rem">What attendees said</h2>
      <p style="font-size:13px;color:#5a6a68">Names withheld pending permission. Attributed versions will replace these as consent is confirmed.</p>
${quoteBlocks}
    </main>`;
    html = html.replace('<div id="root"></div>', `<div id="root">${shell}</div>`);
  }

  const outDir = join(dist, "screenings");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log(`prerendered /screenings -> dist/screenings/index.html (${published.length} consented testimonials in static shell)`);
} catch (err) {
  console.warn(`prerender-screenings: skipped (${err && err.message ? err.message : err}). The build continues.`);
}
