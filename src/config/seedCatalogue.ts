import curatedSeedRaw from '@/data/curated_wellness_seed.json';
import cjSeedRaw from '@/data/cjSeedProducts.json';

/**
 * Seed catalogue gate.
 *
 * Two seed files shipped placeholder products to real shoppers:
 * curated_wellness_seed.json carries 12 products whose links point at
 * example.com, and cjSeedProducts.json carries 10 whose affiliate_url is
 * "#". Neither can earn a commission, and both render on live commerce
 * surfaces (store collections, product detail, search autocomplete), so a
 * visitor can click a product that goes nowhere.
 *
 * They are gated rather than deleted. Gating is the smaller reversible
 * change: it removes them from production immediately, keeps them usable as
 * local fixtures while the real catalogue is wired, and reverts with one
 * environment variable rather than a restoration commit. The files also
 * document the intended product shape, which is worth keeping until a real
 * feed replaces them.
 *
 * DEFAULT IS OFF. The flag must be explicitly set to the string "true" to
 * enable them, so no deploy shows placeholder products by accident, and
 * production must never set it. Delete both files and this module once a
 * real product source is live.
 */
export const SEED_CATALOGUE_ENABLED =
  import.meta.env.VITE_ENABLE_SEED_CATALOGUE === 'true';

export const curatedSeed: unknown[] = SEED_CATALOGUE_ENABLED
  ? (curatedSeedRaw as unknown[])
  : [];

export const cjSeed: unknown[] = SEED_CATALOGUE_ENABLED
  ? (cjSeedRaw as unknown[])
  : [];
