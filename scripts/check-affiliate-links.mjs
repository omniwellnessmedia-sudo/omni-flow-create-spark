#!/usr/bin/env node
/**
 * Weekly outbound affiliate link check.
 *
 * WHY. The CameraStuff programme was deactivated by the merchant in August
 * 2026 and nobody noticed for weeks: the site kept emitting tagged links,
 * rendering a partner banner and firing an impression pixel for a programme
 * we were not in. A dead affiliate destination fails silently, because
 * nothing in the application ever asks whether the other end still answers.
 * This asks, once a week.
 *
 * WHAT IT CHECKS. The link FORMAT for each outbound programme, meaning the
 * destination we actually send visitors to. It does not verify that we are
 * approved on a programme or that a click would be paid: no public endpoint
 * exposes that. It fails on a 404, which is the specific failure that
 * killed CameraStuff quietly.
 *
 * Run locally with: node scripts/check-affiliate-links.mjs
 * Exit code 1 means at least one destination returned 404 or was
 * unreachable, and the GitHub Action fails.
 */

const TIMEOUT_MS = 20000;

/**
 * Destinations to probe. These mirror what src/config/programmes.ts builds.
 * Attribution parameters are deliberately omitted: the account identifiers
 * live in the Netlify environment and are not needed to prove the
 * destination resolves, and sending real ones from CI would pollute
 * reporting with clicks nobody made.
 */
const TARGETS = [
  {
    programme: 'viator',
    label: 'Viator partner shop landing page',
    url: 'https://www.viator.com/partner-shop/omniwellnessmedia/',
  },
  {
    programme: 'viator',
    label: 'Viator product path format',
    url: 'https://www.viator.com/tours/Cape-Town/',
  },
  {
    programme: 'roambuddy',
    label: 'RoamBuddy storefront',
    url: 'https://www.worldroambuddy.com',
  },
  {
    programme: 'camerastuff',
    label: 'CameraStuff storefront (programme currently inactive)',
    url: 'https://www.camerastuff.co.za/',
    // The account is deactivated, so this is informational: the storefront
    // being reachable says nothing about our affiliate status. Kept in the
    // run so a 404 on the merchant itself is still visible.
    informationalOnly: true,
  },
];

const probe = async (url) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // HEAD first: cheapest request that still proves the destination answers.
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'omni-affiliate-link-check/1.0' },
    });
    // Some storefronts reject HEAD with 405 while serving GET normally.
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'omni-affiliate-link-check/1.0' },
      });
    }
    return { ok: true, status: res.status, finalUrl: res.url };
  } catch (err) {
    return { ok: false, error: err?.name === 'AbortError' ? `timeout after ${TIMEOUT_MS}ms` : String(err?.message || err) };
  } finally {
    clearTimeout(timer);
  }
};

const results = [];
for (const target of TARGETS) {
  const r = await probe(target.url);
  results.push({ ...target, ...r });
}

let failed = 0;
console.log('\nOutbound affiliate link check');
console.log('='.repeat(72));
for (const r of results) {
  const detail = r.ok ? `HTTP ${r.status}` : `UNREACHABLE (${r.error})`;
  // A 404 is the failure this exists to catch. Anything unreachable is also
  // reported, because a destination we cannot verify is not a destination we
  // should be sending paying visitors to.
  const isFailure = r.ok ? r.status === 404 : true;
  const counts = isFailure && !r.informationalOnly;
  if (counts) failed++;
  const mark = isFailure ? (r.informationalOnly ? 'WARN' : 'FAIL') : 'OK  ';
  console.log(`${mark}  ${r.programme.padEnd(12)} ${detail.padEnd(28)} ${r.label}`);
  if (isFailure) console.log(`      ${r.url}`);
}
console.log('='.repeat(72));

if (failed > 0) {
  console.error(
    `\n${failed} outbound affiliate destination(s) failed. A 404 here means we are ` +
      'sending visitors to a page that no longer exists. Check the programme ' +
      'status with the merchant before assuming it is a transient error.\n',
  );
  process.exit(1);
}
console.log('\nAll outbound affiliate destinations resolved.\n');
