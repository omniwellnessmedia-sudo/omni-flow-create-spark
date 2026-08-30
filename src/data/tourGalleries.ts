/**
 * Photo manifests for the tour landing pages.
 *
 * WHY THIS FILE IS GENERATED. The full tour photography lives in the team's
 * Google Drive: roughly forty frames each for the Great Mother Cave, the
 * Muizenberg walk and the Kalk Bay walk, at 5 to 25MB per original. This
 * build environment's network policy blocks Google's file hosts, so the
 * photographs cannot be fetched from here. Instead of hotlinking (which the
 * image retry incident showed to be fragile) or shipping 20MB originals, the
 * pipeline is: a team member downloads a Drive folder to their machine and
 * runs
 *
 *   node scripts/import-tour-images.mjs <downloaded-folder> <tour-slug>
 *
 * which resizes everything to web weight, writes the files into
 * public/tours/<tour-slug>/, and REWRITES THE ENTRIES BELOW. The pages merge
 * these entries into their existing galleries, so they render correctly with
 * zero manifest images today and light up the moment the script runs.
 *
 * REVIEW BEFORE PUBLISH. Tour photographs contain guests. The script only
 * stages files; the person running it is confirming, by committing, that the
 * frames chosen either show no identifiable private individual or are covered
 * by the operator's media consent. Prefer scenery, guides and backs of
 * groups. This is the same likeness rule the rest of the site follows.
 *
 * Alt text: the script writes a placeholder derived from the filename, and it
 * must be rewritten by a person to describe what is in the frame before the
 * commit. An alt of "photo 12" does not ship.
 *
 * No em dashes in this file.
 */

export interface TourPhoto {
  src: string;
  alt: string;
  caption?: string;
}

export type TourSlug = 'great-mother-cave-tour' | 'muizenberg-cave-tours' | 'kalk-bay-tour';

/** GENERATED SECTION. scripts/import-tour-images.mjs rewrites these arrays. */
export const TOUR_GALLERY_MANIFEST: Record<TourSlug, TourPhoto[]> = {
  'great-mother-cave-tour': [],
  'muizenberg-cave-tours': [],
  'kalk-bay-tour': [],
};
/** END GENERATED SECTION. */

/**
 * Merge manifest photos after a page's existing, hand captioned images.
 * The hand picked set leads because its captions are editorial; imported
 * frames extend the gallery rather than replace it. Duplicate srcs are
 * dropped so re-running the importer never doubles the gallery.
 */
export const withManifestImages = (slug: TourSlug, base: TourPhoto[]): TourPhoto[] => {
  const extra = TOUR_GALLERY_MANIFEST[slug] ?? [];
  const seen = new Set(base.map((p) => p.src));
  return [...base, ...extra.filter((p) => (seen.has(p.src) ? false : (seen.add(p.src), true)))];
};
