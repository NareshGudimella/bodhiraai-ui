/**
 * Signed links to private files (docs: protected-media contract, section 1).
 * security: not in legacy
 *
 *   <site>/files/<key>?exp=<unix seconds>&sig=<sig>
 *   sig = base64url, no padding, of HMAC-SHA256(FILE_URL_SECRET, "<decoded key>\n<exp>")
 *
 * WebCrypto only, so the same file runs in the Worker and under `node --test`
 * (test/file-sig.test.ts). The API signs with the same algorithm.
 */

/** Links may be signed at most this far ahead; anything later is refused. */
export const MAX_AHEAD_SECONDS = 24 * 60 * 60;

/** Keys that are never signed and never served: invoices, `..`, backslashes, empty segments, a leading `/`. */
export function isForbiddenKey(key: string): boolean {
  return (
    key === '' ||
    key.startsWith('invoices/') ||
    key.includes('..') ||
    key.includes('\\') ||
    key.split('/').some((s) => s === '')
  );
}

/** The object key from the path after `/files/`: each segment percent-decoded. Null when malformed. */
export function keyFromPath(rest: string): string | null {
  try {
    return rest.split('/').map(decodeURIComponent).join('/');
  } catch {
    return null;
  }
}

const encoder = new TextEncoder();

function base64url(bytes: ArrayBuffer): string {
  let s = '';
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

/** The `sig` for a decoded key and an expiry (unix seconds). */
export async function signFileKey(secret: string, key: string, exp: number | string): Promise<string> {
  const mac = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(`${key}\n${exp}`));
  return base64url(mac);
}

/** Compares in time independent of where the strings differ. */
function constantTimeEqual(a: string, b: string): boolean {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ (y[i % (y.length || 1)] ?? 0);
  return diff === 0;
}

/**
 * Whether `/files/<key>?exp&sig` may be served now. False for a missing or
 * empty secret, a forbidden key, a malformed or past `exp`, an `exp` more than
 * 24 h ahead, or a wrong `sig`.
 */
export async function verifyFileLink(
  secret: string | undefined,
  key: string,
  exp: string | null,
  sig: string | null,
  now: number = Math.floor(Date.now() / 1000),
): Promise<{ ok: true; exp: number } | { ok: false }> {
  if (!secret || !sig || !exp || !/^\d{1,12}$/.test(exp) || isForbiddenKey(key)) return { ok: false };
  const expires = Number(exp);
  if (expires < now || expires > now + MAX_AHEAD_SECONDS) return { ok: false };
  const expected = await signFileKey(secret, key, exp);
  return constantTimeEqual(expected, sig) ? { ok: true, exp: expires } : { ok: false };
}
