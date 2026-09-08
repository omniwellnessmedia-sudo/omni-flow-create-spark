/**
 * Slot selection and path sanitising, with nothing else attached.
 *
 * Separate from adSlots.ts so the decisions can be tested without a
 * Supabase client, a browser, or a network. These are the two pieces that
 * can be wrong in a way nobody notices: a weighting that quietly never
 * picks one of the tiles, and a path that carries something it should not.
 *
 * No em dashes in this file.
 */

export interface AdSlot {
  id: string;
  slot_key: string;
  title: string;
  body: string;
  cta_label: string;
  cta_href: string;
  image_url: string | null;
  hue: string | null;
  weight: number;
}

/**
 * Choose one slot, respecting weight.
 *
 * Takes the random number as an argument so the choice is reproducible in
 * a test and steady across a render.
 */
export const pickSlot = (slots: AdSlot[], roll: number): AdSlot | null => {
  const eligible = slots.filter((s) => s.weight > 0);
  if (eligible.length === 0) return null;

  const total = eligible.reduce((sum, s) => sum + s.weight, 0);
  // Clamped rather than trusted: a roll of exactly 1 would otherwise fall
  // off the end of the loop and return nothing.
  let target = Math.min(Math.max(roll, 0), 0.999999) * total;

  for (const slot of eligible) {
    target -= slot.weight;
    if (target < 0) return slot;
  }
  return eligible[eligible.length - 1];
};

/**
 * The path an event may record, or an empty string.
 *
 * Matches the CHECK constraint on ad_events.path exactly. Anything with a
 * query string, an address in it, or any other character is recorded as
 * nothing at all rather than trimmed into something that looks valid.
 */
export const adPathFrom = (pathname: string): string =>
  /^\/[A-Za-z0-9/_-]*$/.test(pathname) && pathname.length <= 200 ? pathname : '';
