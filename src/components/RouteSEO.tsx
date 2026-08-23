import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updateMetaTags, setRobotsNoindex } from '@/lib/seo';
import {
  SITE_ORIGIN,
  findRouteMeta,
  findDynamicMeta,
  isNoindexPath,
} from '@/seo/routeMeta.mjs';

/**
 * Applies the head for every route from the central registry in
 * src/seo/routeMeta.mjs: unique title, description, og and twitter tags,
 * canonical link, and robots noindex on admin and utility surfaces.
 *
 * Pages that manage their own richer head (useSEO/useTourSEO with fetched
 * data) are flagged selfManaged in the registry and skipped here entirely.
 * For dynamic routes the registry supplies a URL-derived fallback which the
 * page's own effect then overwrites once its data arrives; this component is
 * rendered BEFORE <Routes> so React runs its effect first and the page wins.
 */
const RouteSEO = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    setRobotsNoindex(isNoindexPath(pathname));

    const entry = findRouteMeta(pathname);
    if (entry?.selfManaged) return;

    const clean = pathname.replace(/\/+$/, '') || '/';
    const canonical = `${SITE_ORIGIN}${clean === '/' ? '/' : clean}`;

    if (entry?.title && entry?.description) {
      updateMetaTags({
        title: entry.title,
        description: entry.description,
        canonical,
      });
      return;
    }

    const dynamic = findDynamicMeta(pathname);
    if (dynamic) {
      updateMetaTags({ ...dynamic, canonical });
    }
    // Routes in neither table (admin, checkout, 404) keep the index.html
    // defaults plus the robots tag set above. Deliberate: inventing heads
    // for noindex surfaces is wasted work and risks leaking internal names.
  }, [pathname]);

  return null;
};

export default RouteSEO;
