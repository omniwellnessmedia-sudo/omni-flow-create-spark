/**
 * GA4 measurement for the revenue engine.
 *
 * TWO SOURCES OF TRUTH, RECONCILED HERE:
 *   - index.html ships gtag.js hardcoded to G-X9DQ4DEHNB and fires the
 *     initial page_view. That installation is LIVE in production and predates
 *     this module. Removing it in favour of an env var would silently kill
 *     analytics on any deploy where the var is not configured, so it stays.
 *   - VITE_GA4_ID (optional) lets an environment configure a DIFFERENT or
 *     ADDITIONAL measurement ID without touching code. When set and distinct
 *     from the hardcoded ID it is config'd as a second destination; when the
 *     hardcoded snippet is ever removed, this module still works alone off
 *     the env var.
 *
 * Everything here is a silent no-op when no gtag function exists and no env
 * ID is set: analytics must never break the page or the build.
 *
 * SPA page views: the index.html config fires page_view once for the landing
 * URL only. trackSpaPageView() covers subsequent client-side navigations and
 * is called from RouteAnalytics, which skips the first render so the landing
 * view is not double counted.
 */

const ENV_GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined) || '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let envIdConfigured = false;

/** The gtag function, creating a queueing stub if only the env ID exists. */
function gtag(...args: unknown[]): void {
  try {
    if (typeof window === 'undefined') return;
    if (!window.gtag) {
      // No index.html snippet (e.g. it was removed). With an env ID we build
      // the standard queue so events buffer until the library loads; without
      // one there is nothing to send to: stay silent.
      if (!ENV_GA4_ID) return;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtagQueue() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag('js', new Date());
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ENV_GA4_ID)}`;
      document.head.appendChild(s);
    }
    if (ENV_GA4_ID && !envIdConfigured) {
      envIdConfigured = true;
      // Harmless if this ID is already configured by index.html.
      window.gtag('config', ENV_GA4_ID, { send_page_view: false });
    }
    window.gtag(...args);
  } catch {
    // Analytics must never throw into the app.
  }
}

/** page_view for client-side navigations (the initial load is index.html's). */
export function trackSpaPageView(path: string): void {
  gtag('event', 'page_view', {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : path,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
  });
}

/** A deposit CTA was clicked. slug identifies the offer. */
export function trackDepositClick(slug: string, method: 'eft' | 'card'): void {
  gtag('event', 'deposit_click', { offer_slug: slug, payment_method: method });
}

/** An outbound WhatsApp link was clicked. */
export function trackWhatsappClick(context?: string): void {
  gtag('event', 'whatsapp_click', { context: context || 'unknown' });
}

/** A booking or enquiry form was submitted. */
export function trackBookingSubmit(slug?: string): void {
  gtag('event', 'booking_submit', { offer_slug: slug || 'general' });
}

/** An outbound eSIM purchase link was clicked. */
export function trackEsimClick(product?: string): void {
  gtag('event', 'esim_click', { product: product || 'roambuddy' });
}
