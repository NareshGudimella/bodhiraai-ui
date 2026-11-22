/**
 * An absolute URL on the public site, for redirects. Behind Cloudflare this
 * server is reached over http on an internal address, so `request.url` isn't
 * the address visitors use; SITE_URL is. Without SITE_URL the request's own
 * origin is used.
 */
export function siteUrl(path: string, requestUrl: string): URL {
  return new URL(path, process.env.SITE_URL || requestUrl);
}

/**
 * The public site's origin for canonical, Open Graph, sitemap and JSON-LD URLs
 * (SEO: not in legacy). SITE_URL in production (the Worker sets it); locally
 * `http://localhost:3000`. A production server without SITE_URL gets null, so
 * pages leave the canonical out rather than point it at localhost.
 */
export function publicOrigin(): string | null {
  const env = process.env.SITE_URL?.trim().replace(/\/+$/, '');
  if (env) return env;
  return process.env.NODE_ENV === 'production' ? null : 'http://localhost:3000';
}

/** `path` on the public site, absolute when the origin is known (else the path itself). */
export function absoluteUrl(path: string): string {
  const origin = publicOrigin();
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return origin ? `${origin}${p}` : p;
}
