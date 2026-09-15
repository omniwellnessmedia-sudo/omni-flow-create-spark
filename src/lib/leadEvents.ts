/**
 * One word for "a lead changed", said across the admin.
 *
 * Every screen that lists leads reloads on Supabase realtime, and realtime
 * is the right tool for a change made on another device. It is the wrong
 * tool for a change made in this tab: the websocket can be slow, blocked
 * by an office firewall, or the table may not be in the publication yet,
 * and then a lead somebody just typed does not appear on the board they
 * are looking at. So the screen that writes a lead announces it here, and
 * every screen that shows leads reloads at once, websocket or not.
 *
 * No em dashes in this file.
 */

export const LEADS_CHANGED = 'omni:leads-changed';

export const announceLeadsChanged = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(LEADS_CHANGED));
};

/** Subscribe; returns the unsubscribe. Also fires when the tab regains focus. */
export const onLeadsChanged = (cb: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  const onVisible = () => { if (document.visibilityState === 'visible') cb(); };
  window.addEventListener(LEADS_CHANGED, cb);
  window.addEventListener('focus', cb);
  document.addEventListener('visibilitychange', onVisible);
  return () => {
    window.removeEventListener(LEADS_CHANGED, cb);
    window.removeEventListener('focus', cb);
    document.removeEventListener('visibilitychange', onVisible);
  };
};
