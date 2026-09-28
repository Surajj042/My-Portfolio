/**
 * Nav links are authored as bare in-page anchors ("#projects") because the home
 * page is where every one of them lives.
 *
 * The case-study routes have no such sections, so an unresolved "#projects"
 * would jump nowhere. Resolving against the pathname keeps a single source of
 * truth for the link list while producing a URL that works on every route.
 */
export function resolveNavHref(href: string, isHome: boolean): string {
  if (isHome) return href;
  return href.startsWith("#") ? `/${href}` : href;
}

/** "#projects" -> "projects", for matching observed sections to links. */
export function sectionIdFromHref(href: string): string {
  return href.startsWith("#") ? href.slice(1) : href;
}
