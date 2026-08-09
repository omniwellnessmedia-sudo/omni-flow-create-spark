/**
 * ONE-TIME generator for src/data/awards-2026.json.
 *
 * Tokens are printed on physical certificates — they are PERMANENT the moment
 * the print run happens. This script therefore refuses to run if the data
 * file already exists: regenerating tokens would orphan every printed QR
 * code. To add fields (award titles, photos, citations) edit the JSON by
 * hand; never re-run this.
 */
import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";

const OUT = new URL("../src/data/awards-2026.json", import.meta.url);
if (existsSync(OUT)) {
  console.error("awards-2026.json already exists — tokens are permanent, refusing to overwrite.");
  process.exit(1);
}

/* Names locked per the print brief (9 Aug). Do not alter spellings. */
const NAMES = [
  "Mrs Mymoena Scholtz",
  "Joline Oliver",
  "Kai Bi'a /am Jeanette Abrahams",
  "Palesa Mokubung",
  "Promise Mabilo",
  "Aisha Elliott",
  "Megan Choritz",
  "Valerie Roscoe",
  "Dr Alexandra Dodd",
  "Professor Elisa Galgut",
  "Fiona Miles",
  "Nikki Botha",
  "Nicola van Wyk",
  "Louise van der Merwe",
  "Michelle Taberer",
  "Karen de Klerk",
  "Kirsten Youens",
  "Dr Jennifer Olbers",
  "Andi Rive",
  "Dr Lucy Kemp",
  "Makoma Lekalakala",
  "Leitah Mkhabela",
  "Dr Stephanie-Emmy Klarmann",
  "Sera Farista",
  "Stefania Seveso Falcon",
  "Kerri Wolter",
  "Cathrine 'Lionheart' Nyquist",
  "Dulcie September",
  "Leslie Giles",
  "Heather Silove Howe",
  "Sue Gajathar",
  "Shelley Drynan",
  "Lesley Lunn",
  "Dr Marion E. Garaï",
  "Delia O'Connor",
  "Merle Grace O'Brien",
  "Toni Brockhoven",
];
if (NAMES.length !== 37) throw new Error(`expected 37 names, got ${NAMES.length}`);

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const token = () => {
  const bytes = randomBytes(16);
  let t = "";
  for (let i = 0; t.length < 8; i++) {
    // Rejection sampling: 36 doesn't divide 256, plain modulo would bias a-t.
    const b = bytes[i % 16] ^ randomBytes(1)[0];
    if (b < 252) t += ALPHABET[b % 36];
  }
  return t;
};

const seen = new Set();
const records = NAMES.map((name, i) => {
  let t;
  do { t = token(); } while (seen.has(t));
  seen.add(t);
  const position = i + 1;
  const record = {
    serial: `vfw-2026-${String(position).padStart(3, "0")}`,
    token: t,
    name,
    awardTitle: null, // titles to follow — edit here, routes untouched
    position,
    attendance: "in-person",
  };
  if (position === 28) {
    record.attendance = "posthumous";
    record.acceptedBy = "Nicola Arendse";
  }
  if (position === 37) {
    record.awardTitle = "Lifetime Achievement Award";
  }
  return record;
});

writeFileSync(OUT, JSON.stringify(records, null, 2) + "\n");
console.log(`wrote ${records.length} records`);
