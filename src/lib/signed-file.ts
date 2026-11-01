/**
 * Private uploads (avatars, logos, lesson files and thumbnails, assignment
 * attachments and submissions) arrive from the API as short-lived signed links
 * on the site origin: `<site>/files/<key>?exp=<unix seconds>&sig=<sig>`. Render
 * them as they come (plain <img>/<a>/<iframe>; the URL changes with every
 * response, so nothing caches it for long) and never send one back as a typed
 * URL. Safe for client components. security: not in legacy
 */

/** True for one of our signed `/files/...` links. */
export function isSignedFileUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url, 'http://local');
    return u.pathname.startsWith('/files/') && u.searchParams.has('exp') && u.searchParams.has('sig');
  } catch {
    return false;
  }
}

/** When one of our signed links expires (ms since the epoch), or null for any other URL. */
export function signedFileExpiry(url: string | null | undefined): number | null {
  if (!isSignedFileUrl(url)) return null;
  const exp = Number(new URL(url!, 'http://local').searchParams.get('exp'));
  return Number.isFinite(exp) && exp > 0 ? exp * 1000 : null;
}

/** The file name at the end of a link, without the query string. */
export function fileNameOf(url: string, fallback = 'file'): string {
  try {
    const last = new URL(url, 'http://local').pathname.split('/').pop();
    return last ? decodeURIComponent(last) : fallback;
  } catch {
    return fallback;
  }
}
