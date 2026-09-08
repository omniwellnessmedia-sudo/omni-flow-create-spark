#!/usr/bin/env node
/**
 * Build-time testimonial consent audit. Visibility tool, not a gate: it
 * prints the consent table to stdout on every build and writes
 * TESTIMONIAL_CONSENT_AUDIT.md at the repo root, and it NEVER fails the
 * build. The actual publication decision lives in
 * src/lib/testimonialGate.ts, which this script imports so the audit and
 * the gate can never disagree.
 *
 * Named .mjs rather than .ts deliberately: the Netlify build runs plain
 * Node, which cannot execute TypeScript. The TypeScript data and gate are
 * bundled on the fly with esbuild (already present as a Vite dependency),
 * so this stays a zero-new-dependency script. Decision logged in
 * SCREENINGS_TESTIMONIALS_REPORT.md. No em dashes in this file.
 */
import { build } from "esbuild";
import { writeFileSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

try {
  const tmp = mkdtempSync(join(tmpdir(), "testimonial-audit-"));
  const outfile = join(tmp, "bundle.mjs");
  await build({
    entryPoints: [join(root, "src/lib/testimonialGate.ts")],
    bundle: true,
    format: "esm",
    platform: "neutral",
    outfile,
    alias: { "@": join(root, "src") },
    logLevel: "silent",
  });
  const gate = await import(pathToFileURL(outfile).href);
  const data = await (async () => {
    const dataOut = join(tmp, "data.mjs");
    await build({
      entryPoints: [join(root, "src/data/testimonials.ts")],
      bundle: true,
      format: "esm",
      platform: "neutral",
      outfile: dataOut,
      alias: { "@": join(root, "src") },
      logLevel: "silent",
    });
    return import(pathToFileURL(dataOut).href);
  })();

  const rows = data.TESTIMONIALS.map((t) => {
    const reason = gate.blockingReason(t);
    return {
      id: t.id,
      status: t.consent.status,
      publishable: reason === null ? "yes" : "no",
      reason: reason === null ? "publishable" : reason,
    };
  });

  const pad = (s, n) => String(s).padEnd(n);
  const header = `${pad("id", 26)} ${pad("consent", 20)} ${pad("publishable", 12)} blocking reason`;
  const lines = rows.map(
    (r) => `${pad(r.id, 26)} ${pad(r.status, 20)} ${pad(r.publishable, 12)} ${r.reason}`
  );
  console.log("\nTestimonial consent audit");
  console.log(header);
  console.log("-".repeat(header.length));
  for (const l of lines) console.log(l);
  console.log("");

  const md = [
    "# Testimonial Consent Audit",
    "",
    `Generated at build time: ${new Date().toISOString()}`,
    "",
    "This file is written by scripts/audit-testimonials.mjs on every build.",
    "It is a visibility tool, not a gate: the publication decision is made",
    "by src/lib/testimonialGate.ts, which this audit imports directly.",
    "",
    "| id | consent status | publishable | blocking reason |",
    "|---|---|---|---|",
    ...rows.map((r) => `| ${r.id} | ${r.status} | ${r.publishable} | ${r.reason} |`),
    "",
  ].join("\n");
  // Only write when the table itself changed. The timestamp alone changes on
  // every build, so writing unconditionally left the working tree dirty after
  // any build and put timestamp-only diffs in front of reviewers. Compare the
  // content with the timestamp line stripped from both sides.
  const auditPath = join(root, "TESTIMONIAL_CONSENT_AUDIT.md");
  const withoutTimestamp = (text) =>
    text.split("\n").filter((l) => !l.startsWith("Generated at build time:")).join("\n");

  let unchanged = false;
  try {
    unchanged = withoutTimestamp(readFileSync(auditPath, "utf8")) === withoutTimestamp(md);
  } catch {
    unchanged = false; // no file yet, so write it
  }

  const summary = `${rows.length} records, ${rows.filter((r) => r.publishable === "yes").length} publishable`;
  if (unchanged) {
    console.log(`audit-testimonials: TESTIMONIAL_CONSENT_AUDIT.md unchanged (${summary})`);
  } else {
    writeFileSync(auditPath, md);
    console.log(`audit-testimonials: wrote TESTIMONIAL_CONSENT_AUDIT.md (${summary})`);
  }
  rmSync(tmp, { recursive: true, force: true });
} catch (err) {
  console.warn(`audit-testimonials: audit skipped (${err && err.message ? err.message : err}). The build continues: this script never fails a build.`);
}
