// Signed /files/* links (src/file-sig.ts). Run: `npm test` (node --test, no Worker runtime needed).
// security: not in legacy
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { keyFromPath, signFileKey, verifyFileLink } from '../src/file-sig.ts';

// Fixed vector shared with the API (contract section 1): key `submissions/7/a b.pdf`,
// exp 2000000000, secret `test-secret`.
const KEY = 'submissions/7/a b.pdf';
const EXP = 2000000000;
const SIG = 'AfIQbpO7Ovsv3aJJc4JbnUv2jkiWW8DtIC4XTA8fWG8';
const NOW = EXP - 600;

test('fixed vector', async () => {
  assert.equal(await signFileKey('test-secret', KEY, EXP), SIG);
  // Cross-check against node:crypto, the way the API signs.
  assert.equal(createHmac('sha256', 'test-secret').update(`${KEY}\n${EXP}`).digest('base64url'), SIG);
});

test('path segments decode to the signed key', () => {
  assert.equal(keyFromPath('submissions/7/a%20b.pdf'), KEY);
  assert.equal(keyFromPath('bad%E0%A4'), null);
});

test('valid link', async () => {
  assert.deepEqual(await verifyFileLink('test-secret', KEY, String(EXP), SIG, NOW), { ok: true, exp: EXP });
});

test('wrong, missing or tampered signature', async () => {
  assert.equal((await verifyFileLink('test-secret', KEY, String(EXP), SIG.slice(0, -1) + 'A', NOW)).ok, false);
  assert.equal((await verifyFileLink('test-secret', KEY, String(EXP), SIG.slice(0, -2), NOW)).ok, false);
  assert.equal((await verifyFileLink('test-secret', KEY, String(EXP), null, NOW)).ok, false);
  assert.equal((await verifyFileLink('test-secret', KEY, String(EXP), '', NOW)).ok, false);
  assert.equal((await verifyFileLink('other-secret', KEY, String(EXP), SIG, NOW)).ok, false);
  assert.equal((await verifyFileLink('', KEY, String(EXP), SIG, NOW)).ok, false);
  assert.equal((await verifyFileLink(undefined, KEY, String(EXP), SIG, NOW)).ok, false);
  assert.equal((await verifyFileLink('test-secret', 'submissions/7/b.pdf', String(EXP), SIG, NOW)).ok, false);
  assert.equal((await verifyFileLink('test-secret', KEY, String(EXP + 1), SIG, NOW)).ok, false);
});

test('expiry: past, malformed and beyond the 24 h horizon', async () => {
  assert.equal((await verifyFileLink('test-secret', KEY, String(EXP), SIG, EXP + 1)).ok, false);
  assert.equal((await verifyFileLink('test-secret', KEY, String(EXP), SIG, EXP)).ok, true);
  assert.equal((await verifyFileLink('test-secret', KEY, String(EXP), SIG, EXP - 86400)).ok, true);
  assert.equal((await verifyFileLink('test-secret', KEY, String(EXP), SIG, EXP - 86401)).ok, false);
  assert.equal((await verifyFileLink('test-secret', KEY, null, SIG, NOW)).ok, false);
  assert.equal((await verifyFileLink('test-secret', KEY, '2e9', SIG, NOW)).ok, false);
  assert.equal((await verifyFileLink('test-secret', KEY, '-1', SIG, NOW)).ok, false);
});

test('forbidden keys are refused even with a valid signature', async () => {
  for (const key of ['invoices/1.pdf', 'a/../b.pdf', 'a\\b.pdf', 'a//b.pdf', '/a.pdf', 'a/', '']) {
    const sig = await signFileKey('test-secret', key, EXP);
    assert.equal((await verifyFileLink('test-secret', key, String(EXP), sig, NOW)).ok, false, key);
  }
});
