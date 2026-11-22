/**
 * Fallback photos for blog posts without a cover image (not in legacy, which
 * showed an empty box). Credits: public/assets/img/pages/blog/CREDITS.md.
 */
export const POST_FALLBACKS = [
  "assets/img/pages/blog/post-cover-1.jpg",
  "assets/img/pages/blog/post-cover-2.jpg",
  "assets/img/pages/blog/post-cover-3.jpg",
] as const;

/**
 * The fallback for one post, resolved through `asset()` so the Site Image
 * Manager can replace it. Chosen by post id, so a post keeps the same photo on
 * every page (list, featured, post page, related).
 */
export function postFallback(asset: (path: string) => string, id: number): string {
  return asset(POST_FALLBACKS[Math.abs(id) % POST_FALLBACKS.length]);
}
