import { notFound } from "next/navigation";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/**
 * The site's 404 page for a missing blog post. proxy.ts fetches it and sends
 * it with a 404 status (a page's own notFound() is served as 200 under
 * cacheComponents).
 */
export default function SiteNotFoundPage() {
  notFound();
}
