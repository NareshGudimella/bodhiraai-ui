import type { Metadata } from "next";
import { NotFoundContent } from "@/components/site/not-found-content";
import { imageResolver } from "@/lib/site";

/**
 * Legacy errors/404.blade.php, inside the site's header and footer; also the
 * page proxy.ts serves with a 404 status for a missing blog post (via
 * `/site-404`). The content (2026 redesign) is in components/site/not-found-content.tsx,
 * shared with app/global-not-found.tsx for URLs that match no route.
 */
/** Every page needs a <title>, the 404 included (accessibility; not in legacy). */
export const metadata: Metadata = { title: "Page not found · Bodhira.ai", robots: { index: false, follow: true } };

export default async function SiteNotFound() {
  const img = await imageResolver();
  return <NotFoundContent imageSrc={img(null, "assets/img/pages/blog/not-found.jpg")} />;
}
