/**
 * An absolute URL on the public site, for redirects. Behind Cloudflare this
 * server is reached over http on an internal address, so `request.url` isn't
 * the address visitors use; SITE_URL is. Without SITE_URL the request's own
 * origin is used.
 */
export function siteUrl(path: string, requestUrl: string): URL {
  return new URL(path, process.env.SITE_URL || requestUrl);
}
