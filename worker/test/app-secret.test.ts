// Keys derived from APP_SECRET (worker/app-secret.ts). Run: `npm run test:worker`.
// security: not in legacy
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hkdfSync } from 'node:crypto';
import { deriveKey } from '../app-secret.ts';

// The API's derivation (bodhiraai-api/src/config/app-secret.ts), node:crypto.
const api = (secret: Buffer, purpose: string) =>
  Buffer.from(hkdfSync('sha256', secret, Buffer.alloc(0), `bodhira:${purpose}`, 32)).toString('hex');

const BYTES = Buffer.alloc(32, 9);

test('matches the API for base64 and hex secrets', async () => {
  for (const purpose of ['proxy', 'file-urls'] as const) {
    assert.equal(await deriveKey(BYTES.toString('base64'), purpose), api(BYTES, purpose));
    assert.equal(await deriveKey(BYTES.toString('hex'), purpose), api(BYTES, purpose));
  }
});

test('one key per purpose, never the secret itself', async () => {
  const secret = BYTES.toString('base64');
  const proxy = await deriveKey(secret, 'proxy');
  assert.notEqual(proxy, await deriveKey(secret, 'file-urls'));
  assert.notEqual(proxy, BYTES.toString('hex'));
  assert.match(proxy, /^[0-9a-f]{64}$/);
});

test('rejects a short secret', async () => {
  await assert.rejects(() => deriveKey('c2hvcnQ=', 'proxy'), /32 bytes/);
});
