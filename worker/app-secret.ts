/**
 * Keys derived from APP_SECRET, the one secret shared with the API
 * (bodhiraai-api/src/config/app-secret.ts): HKDF-SHA256, empty salt,
 * info `bodhira:<purpose>`, 32 bytes as hex. The API derives the same values.
 * WebCrypto only, so it runs in the Worker and under `node --test`.
 * security: not in legacy
 */
export type Purpose = 'proxy' | 'file-urls';

function secretBytes(appSecret: string): Uint8Array {
  const raw = appSecret.trim();
  let bytes: Uint8Array;
  if (/^[0-9a-fA-F]+$/.test(raw) && raw.length % 2 === 0) {
    bytes = new Uint8Array(raw.match(/../g)!.map((h) => parseInt(h, 16)));
  } else {
    const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
    bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  }
  if (bytes.length < 32) throw new Error('APP_SECRET must be at least 32 bytes');
  return bytes;
}

const cache = new Map<string, Promise<string>>();

/** The derived key for one purpose, as 64 hex characters (cached per isolate). */
export function deriveKey(appSecret: string, purpose: Purpose): Promise<string> {
  const id = `${purpose}:${appSecret}`;
  let key = cache.get(id);
  if (!key) {
    key = (async () => {
      const master = await crypto.subtle.importKey('raw', secretBytes(appSecret), 'HKDF', false, ['deriveBits']);
      const bits = await crypto.subtle.deriveBits(
        { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: new TextEncoder().encode(`bodhira:${purpose}`) },
        master,
        256,
      );
      return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
    })();
    cache.set(id, key);
  }
  return key;
}
