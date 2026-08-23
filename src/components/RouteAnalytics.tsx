import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackSpaPageView } from '@/lib/analytics';

/**
 * Fires a GA4 page_view on every client-side navigation. The FIRST render is
 * deliberately skipped: index.html's gtag config already reports the landing
 * page, and reporting it again here would double count every session.
 *
 * Runs after RouteSEO in the tree so document.title reflects the new route
 * by the time the event reads it.
 */
const RouteAnalytics = () => {
  const { pathname, search } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    trackSpaPageView(pathname + search);
  }, [pathname, search]);

  return null;
};

export default RouteAnalytics;
