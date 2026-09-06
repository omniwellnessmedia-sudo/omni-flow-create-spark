import { supabase } from '@/integrations/supabase/client';
import { adPathFrom, type AdSlot } from '@/lib/adSlotSelection';

export { pickSlot, type AdSlot } from '@/lib/adSlotSelection';

/**
 * Reading house promo slots, and counting what happened to them.
 *
 * WHAT AN IMPRESSION MEANS HERE. It means a person could see the tile:
 * it entered the viewport, and it stayed long enough to register. See
 * AdTile. "Rendered into the DOM" is a different and much larger number,
 * and reporting that as an impression would overstate every campaign and
 * flatter every click through rate computed from it.
 *
 * WHAT IS NOT RECORDED. No IP address, no user agent, no cookie, no
 * visitor id, nothing that identifies a person. The table has no column
 * to put one in. That keeps this a count of events rather than a record
 * of people, and keeps it outside the consent machinery entirely.
 *
 * A failed write is swallowed. A visitor must never see an error, or a
 * slower page, because a promo counter did not save.
 *
 * No em dashes in this file.
 */

/**
 * The live slots for a key.
 *
 * RLS already restricts this to rows that are active and inside their
 * window, so a draft or expired tile cannot arrive here even though the
 * query does not ask about either.
 */
export const fetchAdSlots = async (slotKey: string): Promise<AdSlot[]> => {
  const { data, error } = await (supabase
    .from('ad_slots' as any)
    .select('id, slot_key, title, body, cta_label, cta_href, image_url, hue, weight')
    .eq('slot_key', slotKey) as any);

  // No tile is a perfectly ordinary outcome for a promo slot, and so is a
  // failed read. Neither is worth showing anybody.
  if (error || !data) return [];
  return data as AdSlot[];
};

/** The current path with no query string, matching the column's constraint. */
export const currentAdPath = (): string => {
  if (typeof window === 'undefined') return '';
  return adPathFrom(window.location.pathname);
};

export const recordAdEvent = async (
  slotId: string,
  kind: 'impression' | 'click'
): Promise<void> => {
  try {
    await (supabase
      .from('ad_events' as any)
      .insert({ slot_id: slotId, kind, path: currentAdPath() }) as any);
  } catch {
    // Deliberately silent. See the header: a counter must never be the
    // reason a visitor sees something go wrong.
  }
};
