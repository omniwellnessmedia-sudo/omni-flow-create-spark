export const SITE_ORIGIN: string;
export const DEFAULT_OG_IMAGE: string;
export const NOINDEX_PREFIXES: string[];

export interface RouteMetaEntry {
  path: string;
  title?: string;
  description?: string;
  selfManaged?: boolean;
  priority?: number;
  changefreq?: string;
}

export const ROUTE_META: RouteMetaEntry[];

export function isNoindexPath(pathname: string): boolean;
export function findRouteMeta(pathname: string): RouteMetaEntry | null;
export function findDynamicMeta(
  pathname: string
): { title: string; description: string } | null;
