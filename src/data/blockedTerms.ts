/**
 * Blocklist for anonymous testimonial publication.
 *
 * An anonymously published quote must not contain any person name,
 * organisation name, or place name that could re-identify the speaker or
 * drag a third party onto a commercial page. The gate
 * (src/lib/testimonialGate.ts) checks quotePublished against this list,
 * case-insensitive and word-boundary matched, and refuses publication on
 * any hit, surfacing the offending term in the build audit.
 *
 * Seeded with every first name and surname present in the testimonial
 * dataset, plus the place names below. The dataset currently carries no
 * organisation names; add them here the moment one enters a record.
 * No em dashes in this file.
 */

export const BLOCKED_TERMS: string[] = [
  // First names in the dataset
  "Michelle",
  "Karen",
  "Valerie",
  "Caitlin",
  "Luana",
  "Amanda",
  "Mymoena",
  "Nicky",
  "Alex",
  "Nicola",
  "Samantha",
  // Surnames in the dataset
  "de Klerk",
  "Pasanisi",
  "Scholtz",
  "Dodd",
  "Vernon",
  "Phillips",
  // Place names
  "Mowbray",
  "Cape Town",
  "Muizenberg",
];
