import { hkdfSync } from 'node:crypto';

/**
 * `X-Proxy-Secret` for calls to the API. Behind Cloudflare the API refuses
 * requests without it. The value is derived from APP_SECRET, the one secret
 * shared with the API (HKDF-SHA256, `bodhira:proxy`; worker/app-secret.ts).
 * On Cloudflare the edge Worker passes the derived PROXY_SECRET in (never
 * APP_SECRET); on a Node host it's derived here from APP_SECRET. Locally both
 * are unset and nothing is sent.
 */
let derived: string | undefined;

function fromAppSecret(appSecret: string): string {
  const raw = appSecret.trim();
  const bytes = /^[0-9a-fA-F]+$/.test(raw) && raw.length % 2 === 0 ? Buffer.from(raw, 'hex') : Buffer.from(raw, 'base64');
  if (bytes.length < 32) throw new Error('APP_SECRET must be at least 32 bytes');
  return Buffer.from(hkdfSync('sha256', bytes, Buffer.alloc(0), 'bodhira:proxy', 32)).toString('hex');
}

export function proxySecretHeader(): Record<string, string> {
  const appSecret = process.env.APP_SECRET;
  const secret = process.env.PROXY_SECRET || (appSecret ? (derived ??= fromAppSecret(appSecret)) : '');
  return secret ? { 'X-Proxy-Secret': secret } : {};
}
