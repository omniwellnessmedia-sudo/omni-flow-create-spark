import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * React.lazy that survives a deploy.
 *
 * THE CRASH THIS FIXES. Every build gives each page chunk a new hashed
 * filename and deletes the old ones. A visitor who opened the site before
 * a deploy and clicks to another page after it asks for a chunk that no
 * longer exists, the dynamic import fails, and the error boundary shows
 * "Something went wrong" on a site that is perfectly healthy. With ten
 * deploys in a day, the team saw it often.
 *
 * WHAT THIS DOES. If a chunk fails to load, reload the page once. The
 * reload fetches the new index.html with the new chunk names and the
 * navigation the visitor wanted completes. A flag in sessionStorage stops
 * a genuinely broken deploy from reloading forever: the second failure is
 * thrown to the boundary as before.
 *
 * No em dashes in this file.
 */

const RETRY_KEY = 'omni:chunk-reload';

/** True for the errors a stale chunk produces across Chrome, Safari and Firefox. */
export const isChunkLoadError = (err: unknown): boolean => {
  const message = err instanceof Error ? `${err.name} ${err.message}` : String(err);
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk|Loading CSS chunk|error loading dynamically imported module|ChunkLoadError/i.test(message);
};

/** Reload once for a stale chunk. Returns true if a reload was started. */
export const reloadOnceForChunkError = (err: unknown): boolean => {
  if (!isChunkLoadError(err)) return false;
  try {
    if (sessionStorage.getItem(RETRY_KEY)) return false;
    sessionStorage.setItem(RETRY_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
};

/** Clear the guard once a chunk loads, so the next deploy gets its own single retry. */
const clearGuard = () => {
  try { sessionStorage.removeItem(RETRY_KEY); } catch { /* storage unavailable */ }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyWithRetry = <T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): LazyExoticComponent<T> =>
  lazy(async () => {
    try {
      const mod = await factory();
      clearGuard();
      return mod;
    } catch (err) {
      if (reloadOnceForChunkError(err)) {
        // The page is reloading; keep React suspended rather than erroring
        // for the few hundred milliseconds until it does.
        return new Promise<{ default: T }>(() => {});
      }
      throw err;
    }
  });
