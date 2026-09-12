/**
 * Ask Supabase for an image at the size we are actually going to draw it.
 *
 * THE PROBLEM THIS SOLVES, measured on the home page: forty photographs,
 * every one a camera original served straight out of storage, drawn into
 * boxes between 387 and 550 pixels wide. A four megapixel photograph
 * rendered at 387px throws away more than ninety nine percent of the pixels
 * it made somebody download. Forty times over, on the page most visitors
 * see first, much of it on South African mobile data.
 *
 * Supabase Storage can resize on its side. The object endpoint
 *
 *   /storage/v1/object/public/<bucket>/<path>
 *
 * has a sibling that transforms
 *
 *   /storage/v1/render/image/public/<bucket>/<path>?width=1200&quality=75
 *
 * so this rewrites one into the other.
 *
 * WHY THIS IS SAFE EVEN IF THE FEATURE IS OFF. Image transformation is not
 * available on every Supabase plan, and this environment cannot reach the
 * storage host to find out which one applies here. So the transformed URL is
 * never used alone: SmartImage puts it first and keeps the untransformed
 * original as the very next candidate in its fallback chain. If the render
 * endpoint is unavailable the image errors once and the original loads, which
 * is exactly today's behaviour. Nothing can end up broken that is not broken
 * now.
 *
 * WHAT IT WILL NOT DO. It never upscales: asking for 1200 from an 800 pixel
 * source returns 800. So a photograph that looks soft because the file itself
 * is small stays soft, and the fix for that one is a better file.
 *
 * No em dashes in this file.
 */

const OBJECT_PATH = '/storage/v1/object/public/';
const RENDER_PATH = '/storage/v1/render/image/public/';

/**
 * A sensible default for cards and thumbnails. The widest image slot measured
 * on the home page is 550 CSS pixels, which wants 1100 device pixels on a 2x
 * screen, so 1200 covers every card with a little room. Full bleed images
 * (heroes, banners) should pass their own larger width.
 */
export const DEFAULT_RENDER_WIDTH = 1200;

/** True for a Supabase public object URL that the render endpoint can serve. */
export const isTransformableStorageUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.includes(OBJECT_PATH);

/**
 * The same image, asked for at `width` and re-encoded.
 *
 * Returns null when the URL is not a Supabase object URL, so callers can tell
 * "no transform available" from "here is a transform".
 */
export const transformedStorageUrl = (
  url: string | null | undefined,
  width: number = DEFAULT_RENDER_WIDTH,
  quality = 75
): string | null => {
  if (!isTransformableStorageUrl(url)) return null;

  // A URL that already carries a query string is left alone rather than
  // guessed at: appending to something we did not build risks a request that
  // means something other than intended.
  if (url!.includes('?')) return null;

  const rendered = url!.replace(OBJECT_PATH, RENDER_PATH);
  return `${rendered}?width=${Math.round(width)}&quality=${quality}`;
};
