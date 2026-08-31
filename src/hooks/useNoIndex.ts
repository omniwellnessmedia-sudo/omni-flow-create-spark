import { useEffect } from "react";

/**
 * Keeps a route out of search results.
 *
 * The affiliate storefronts pull from a third party feed and are only as good
 * as what a person has approved in the admin curation screen. Until that
 * approval work is done there is nothing on those pages worth sending a
 * stranger to, so they carry a robots tag and are absent from the sitemap.
 * They stay reachable by direct link for the team to check their work.
 *
 * A robots meta tag is used rather than a robots.txt disallow on purpose: a
 * disallowed page cannot be crawled, so a crawler never learns it should be
 * dropped, and anything already indexed stays indexed. The tag has to be
 * readable, so the page must remain crawlable.
 *
 * The tag is removed on unmount. Without that it would leak onto the next
 * route the visitor navigates to, because this is a single page application
 * and the document head persists across navigation.
 *
 * No em dashes in this file.
 */
export function useNoIndex(reason = "not published") {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, follow";
    meta.setAttribute("data-reason", reason);
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, [reason]);
}

export default useNoIndex;
