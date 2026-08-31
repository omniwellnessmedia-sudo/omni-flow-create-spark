#!/usr/bin/env node
/**
 * Import tour photography from a locally downloaded Drive folder.
 *
 *   node scripts/import-tour-images.mjs <folder-of-images> <tour-slug>
 *
 * tour-slug is one of:
 *   great-mother-cave-tour | muizenberg-cave-tours | kalk-bay-tour
 *
 * WHAT IT DOES
 *   1. Reads every .jpg/.jpeg/.png in the folder.
 *   2. Resizes to at most 1600px on the long edge, JPEG quality 80. A 20MB
 *      camera original becomes roughly 300KB, which is what a web page can
 *      afford. Originals are never modified.
 *   3. Writes the results to public/tours/<tour-slug>/ with stable names
 *      derived from the source filenames.
 *   4. Rewrites the generated section of src/data/tourGalleries.ts so the
 *      page galleries pick the new frames up on the next build.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *   - It does not choose which frames are publishable. Tour photos contain
 *     guests; a person confirms, by committing, that each frame shows no
 *     identifiable private individual without consent. Cull the folder
 *     BEFORE running the script, or delete from public/tours/ and re-run.
 *   - It does not write final alt text. It writes a placeholder from the
 *     filename and the page will fail its tests until a person replaces
 *     placeholders with descriptions of what is actually in the frame.
 *
 * Requires sharp (npm i -D sharp) for the resize. The rest is stdlib.
 *
 * No em dashes in this file.
 */
import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename, resolve } from 'node:path';

const SLUGS = ['great-mother-cave-tour', 'muizenberg-cave-tours', 'kalk-bay-tour'];

const [, , srcDir, slug] = process.argv;
if (!srcDir || !SLUGS.includes(slug)) {
  console.error(`Usage: node scripts/import-tour-images.mjs <folder-of-images> <tour-slug>`);
  console.error(`  tour-slug: ${SLUGS.join(' | ')}`);
  process.exit(1);
}

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('This script needs sharp for the resize step. Run: npm i -D sharp');
  process.exit(1);
}

const repoRoot = resolve(new URL('..', import.meta.url).pathname);
const outDir = join(repoRoot, 'public', 'tours', slug);
const manifestPath = join(repoRoot, 'src', 'data', 'tourGalleries.ts');

await mkdir(outDir, { recursive: true });

const files = (await readdir(srcDir))
  .filter((f) => ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()))
  .sort();

if (files.length === 0) {
  console.error(`No .jpg/.jpeg/.png files found in ${srcDir}`);
  process.exit(1);
}

const entries = [];
for (const f of files) {
  const stem = basename(f, extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const outName = `${stem}.jpg`;
  const outPath = join(outDir, outName);

  const img = sharp(join(srcDir, f)).rotate(); // honour EXIF orientation
  const meta = await img.metadata();
  const landscape = (meta.width ?? 0) >= (meta.height ?? 0);
  await img
    .resize(landscape ? { width: 1600, withoutEnlargement: true } : { height: 1600, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(outPath);

  entries.push({
    src: `/tours/${slug}/${outName}`,
    // Placeholder on purpose. The page tests refuse to ship this string, so
    // it cannot slip out unreviewed.
    alt: `REPLACE ME: describe what is in ${outName}`,
  });
  console.log(`  ${f} -> public/tours/${slug}/${outName}`);
}

// Rewrite only this slug's array inside the generated section.
const manifest = await readFile(manifestPath, 'utf8');
const arrayLiteral = JSON.stringify(entries, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : `  ${l}`))
  .join('\n');
const pattern = new RegExp(`('${slug}':\\s*)\\[[\\s\\S]*?\\]`);
if (!pattern.test(manifest)) {
  console.error(`Could not find the '${slug}' entry in src/data/tourGalleries.ts`);
  process.exit(1);
}
await writeFile(manifestPath, manifest.replace(pattern, `$1${arrayLiteral}`));

console.log(`\n${entries.length} images staged for ${slug}.`);
console.log('Now: 1) cull any frame showing an identifiable guest without consent,');
console.log('     2) replace every REPLACE ME alt with a real description,');
console.log('     3) run the tests, then commit.');
