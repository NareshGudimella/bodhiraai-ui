import manifest from './webp-manifest.json';

/** Photos with a smaller .webp sibling (written by scripts/webp-images.mjs). not in legacy */
const WEBP = new Set<string>(manifest);

/** `assets/img/…/x.jpg` → `assets/img/…/x.webp` when a WebP copy exists, else unchanged (a leading `/` is kept). */
export function preferWebp(path: string): string {
  const rel = path.replace(/^\/+/, '');
  return WEBP.has(rel) ? path.replace(/\.jpe?g$/i, '.webp') : path;
}
