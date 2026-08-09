/**
 * Voices for Women — permanent certificate verification register.
 *
 * Serves /awards (the register hub) and /awards/vfw-2026-NNN?v=<token>
 * (one page per printed certificate). Every certificate QR resolves here.
 *
 * PERMANENCE CONTRACT
 *   - These URLs are printed on physical certificates. The route shape and
 *     the serial+token pairs in src/data/awards-2026.json must never change.
 *   - This function is deliberately independent of the event page: no
 *     imports from src/pages, no event-page assets. When the event page is
 *     archived, this keeps working.
 *   - Records may gain fields later (awardTitle, photo, citation, videoUrl,
 *     profileUrl) — the renderer treats every field beyond serial/token/name
 *     as optional, so enrichment never touches URLs or this routing.
 *
 * PRIVACY / ANTI-ENUMERATION
 *   - A page renders only when BOTH the serial exists AND the token matches,
 *     compared in constant time. Every failure mode — unknown serial, known
 *     serial with wrong token, missing token — returns the SAME neutral 404
 *     so responses never reveal whether a serial exists.
 */

import { timingSafeEqual } from "node:crypto";
// STATIC import, deliberately: Netlify bundles functions with NFT (Node File
// Trace), which only includes files it can trace from static import/require
// statements. The earlier createRequire() load was invisible to the tracer,
// so the JSON never shipped and production crashed at runtime. The `with`
// attribute is required for ESM JSON imports on the Node 18.20+/20.10+
// runtimes Netlify deploys.
import RECORDS from "../../src/data/awards-2026.json" with { type: "json" };

const BY_SERIAL = new Map(RECORDS.map((r) => [r.serial, r]));

const EVENT = {
  awardName: "Voices for Women",
  date: "Monday 10 August 2026",
  venue: "The Masque Theatre, Muizenberg, Cape Town",
  conferredBy: [
    "Omni Wellness Media",
    "Beauty Without Cruelty South Africa",
    "Gauteng Animal Rights Defenders (G.A.R.D.)",
  ],
  registerStatement: "This certificate is recorded in the Voices for Women register.",
};

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const tokenMatches = (expected, given) => {
  if (typeof given !== "string" || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(given, "utf8"));
};

/* ------------------------------------------------------------------ layout */

const page = ({ title, description, body, canonicalPath, status = 200 }) => {
  const canonical = `https://omniwellnessmedia.co.za${canonicalPath}`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Voices for Women Register">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="https://omniwellnessmedia.co.za/awards-register-og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root{--ink:#0E1513;--ink2:#1F2F27;--gold:#C9B68E;--gold-d:#8E7B52;--cream:#F7F3EA;--mute:#6E7E7A}
  *{box-sizing:border-box;margin:0}
  body{background:var(--cream);color:var(--ink);font-family:Jost,Helvetica,Arial,sans-serif;
       font-weight:300;line-height:1.55;-webkit-font-smoothing:antialiased}
  .sheet{max-width:660px;margin:0 auto;padding:64px 24px 72px}
  .frame{background:#FDFBF6;border:1px solid #E4DCC9;box-shadow:0 1px 2px rgba(14,21,19,.05),0 24px 60px rgba(14,21,19,.07);
         padding:56px 32px 48px;text-align:center}
  @media(min-width:560px){.frame{padding:72px 64px 56px}}
  .kick{font-size:12px;letter-spacing:.34em;text-transform:uppercase;font-weight:500;color:var(--gold-d)}
  .rule{height:2px;width:88px;background:var(--gold);border:0;margin:22px auto}
  .serif{font-family:'Cormorant Garamond',Georgia,serif;font-weight:300}
  h1.name{font-size:clamp(34px,7vw,46px);line-height:1.08;letter-spacing:-.5px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:600}
  .award-title{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:clamp(20px,4vw,25px);color:var(--ink2);margin-top:14px}
  .label{font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:var(--mute);margin-top:30px}
  .value{font-size:16px;color:var(--ink2);margin-top:5px}
  .bodies{list-style:none;padding:0;margin-top:5px}
  .bodies li{font-size:15.5px;color:var(--ink2);padding:2px 0}
  .verify{margin-top:40px;border-top:1px solid #E4DCC9;padding-top:26px}
  .verify p{font-size:14px;color:var(--ink2)}
  .verify .mark{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.24em;
    text-transform:uppercase;font-weight:500;color:var(--gold-d);margin-bottom:10px}
  .verify .mark svg{flex:none}
  .serial{font-size:11.5px;letter-spacing:.18em;color:var(--mute);margin-top:14px;text-transform:uppercase}
  .foot{text-align:center;margin-top:28px;font-size:12.5px;color:var(--mute)}
  .foot a{color:var(--gold-d);text-decoration:none;border-bottom:1px solid var(--gold)}
  .lede{font-size:16.5px;color:var(--ink2);max-width:44ch;margin:18px auto 0;text-align:center}
  .idx-steps{max-width:44ch;margin:26px auto 0;text-align:left;font-size:15px;color:var(--ink2)}
  .idx-steps li{margin:8px 0}
  .posthumous{font-size:14.5px;color:var(--mute);font-style:italic;margin-top:10px}
</style>
</head>
<body>
<main class="sheet">
${body}
<p class="foot">Voices for Women · <a href="/awards">About this register</a></p>
</main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Certificates are permanent; a short public cache keeps QR scans fast
      // without making future record enrichment sluggish to appear.
      "cache-control": "public, max-age=300, must-revalidate",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
    },
  });
};

/* ------------------------------------------------------------------- views */

const certificateView = (r) => {
  const awardLine = r.awardTitle
    ? `<p class="award-title">${esc(r.awardTitle)}</p>`
    : "";
  const posthumous =
    r.attendance === "posthumous" && r.acceptedBy
      ? `<p class="posthumous">Received on behalf of ${esc(r.name)} by ${esc(r.acceptedBy)}.</p>`
      : "";
  const body = `
<div class="frame">
  <p class="kick">Voices for Women · Certificate of Award</p>
  <hr class="rule">
  <h1 class="name">${esc(r.name)}</h1>
  ${awardLine}
  ${posthumous}
  <p class="label">Award</p>
  <p class="value">${esc(EVENT.awardName)}</p>
  <p class="label">Conferred on</p>
  <p class="value">${esc(EVENT.date)}</p>
  <p class="label">At</p>
  <p class="value">${esc(EVENT.venue)}</p>
  <p class="label">Conferred by</p>
  <ul class="bodies">
    ${EVENT.conferredBy.map((b) => `<li>${esc(b)}</li>`).join("\n    ")}
  </ul>
  <div class="verify">
    <p class="mark">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="6.25" stroke="#8E7B52" stroke-width="1.5"/>
        <path d="M4.2 7.2l1.9 1.9 3.7-4.2" stroke="#8E7B52" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Verified
    </p>
    <p>${esc(EVENT.registerStatement)}</p>
    <p class="serial">Certificate ${esc(r.serial)}</p>
  </div>
</div>`;
  return page({
    title: `${r.name} — Voices for Women Award`,
    description: `${r.name}${r.awardTitle ? ` · ${r.awardTitle}` : ""} · Conferred ${EVENT.date} at ${EVENT.venue}.`,
    body,
    canonicalPath: `/awards/${r.serial}`,
  });
};

const notFoundView = () =>
  page({
    title: "Certificate not found — Voices for Women Register",
    description: "Certificate verification for the Voices for Women awards.",
    status: 404,
    canonicalPath: "/awards",
    body: `
<div class="frame">
  <p class="kick">Voices for Women · Register</p>
  <hr class="rule">
  <h1 class="serif" style="font-size:clamp(26px,5vw,34px);font-weight:600">Certificate not found</h1>
  <p class="lede">Please check the code on your certificate.</p>
</div>`,
  });

const indexView = () =>
  page({
    title: "Voices for Women — Certificate Register",
    description:
      "The official register of Voices for Women award certificates. Scan the QR code on a certificate to verify it.",
    canonicalPath: "/awards",
    body: `
<div class="frame">
  <p class="kick">Voices for Women</p>
  <hr class="rule">
  <h1 class="serif" style="font-size:clamp(28px,6vw,38px);font-weight:600">Certificate Register</h1>
  <p class="lede">The permanent record of awards conferred at the Voices for Women
  Showcase &amp; Awards Ceremony — ${esc(EVENT.date)}, ${esc(EVENT.venue)}.</p>
  <ol class="idx-steps">
    <li>Find the QR code printed on the certificate.</li>
    <li>Scan it with a phone camera — it opens this register at the certificate's own page.</li>
    <li>A genuine certificate shows the recipient's name, the award, and the statement
        “${esc(EVENT.registerStatement)}”</li>
  </ol>
  <p class="lede" style="font-size:14px;color:var(--mute);margin-top:26px">
    Each certificate link carries its own verification code, so a page that opens from a
    certificate's QR code confirms that certificate is genuine.</p>
</div>`,
  });

/* ----------------------------------------------------------------- handler */

export default async (req) => {
  const url = new URL(req.url);
  // Netlify v2 preserves the original URL for both config.path routing and
  // _redirects rewrites, but if any invocation path ever delivers the raw
  // function path instead, treat it as the index rather than a 404.
  let path = url.pathname.replace(/^\/\.netlify\/functions\/awards/, "/awards");
  path = path.replace(/\/+$/, "") || "/awards";

  if (path === "/awards") return indexView();

  const m = path.match(/^\/awards\/([a-z0-9-]+)$/);
  if (!m) return notFoundView();

  const record = BY_SERIAL.get(m[1]);
  const given = url.searchParams.get("v");
  // One combined check → one neutral answer for every failure mode.
  if (!record || !tokenMatches(record.token, given ?? "")) return notFoundView();

  return certificateView(record);
};

export const config = {
  path: ["/awards", "/awards/*"],
};
