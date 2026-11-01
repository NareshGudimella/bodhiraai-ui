// Legacy file keys (src/legacy-key.ts). Run: `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legacyFileKey } from '../src/legacy-key.ts';

test('legacy paths map to their R2 keys', () => {
  assert.equal(legacyFileKey('/media/avatars/a%20b.png'), 'media/avatars/a b.png');
  assert.equal(legacyFileKey('/cloud/x.jpg'), 'cloud/x.jpg');
  assert.equal(legacyFileKey('/assets/video/demo.MP4'), 'assets/video/demo.MP4');
});

test('other paths are not legacy files', () => {
  assert.equal(legacyFileKey('/student'), undefined);
  assert.equal(legacyFileKey('/assets/css/site.css'), undefined);
});

test('bad legacy paths answer 404', () => {
  assert.equal(legacyFileKey('/media/a/../b'), null);
  assert.equal(legacyFileKey('/media/a/%2E%2E/b'), null);
  assert.equal(legacyFileKey('/media//b'), null);
  assert.equal(legacyFileKey('/media/bad%E0%A4'), null);
});

// security: not in legacy
test('invoices are refused in any letter case or encoding', () => {
  assert.equal(legacyFileKey('/media/invoices/12/INV-1.pdf'), null);
  assert.equal(legacyFileKey('/media/Invoices/12/INV-1.pdf'), null);
  assert.equal(legacyFileKey('/media/INVOICES/12/INV-1.pdf'), null);
  assert.equal(legacyFileKey('/media/%69nvoices/12/INV-1.pdf'), null);
  assert.equal(legacyFileKey('/media%2Finvoices/12/INV-1.pdf'), undefined);
  assert.equal(legacyFileKey('/media/invoices-archive/x.pdf'), 'media/invoices-archive/x.pdf');
});
