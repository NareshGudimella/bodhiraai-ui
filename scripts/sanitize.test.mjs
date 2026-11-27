// Run: `npm run test:sanitize` (node strips the TypeScript types).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCms, sanitizeMap } from '../src/lib/sanitize-html.ts';

test('strips script, handlers and javascript: links', () => {
  assert.equal(sanitizeCms('<p>a</p><script>alert(1)</script>'), '<p>a</p>');
  assert.ok(!/onerror/.test(sanitizeCms('<img src="https://x.test/a.png" onerror="alert(1)">')));
  assert.ok(!/javascript/.test(sanitizeCms('<a href="javascript:alert(1)">x</a>')));
  assert.ok(!/data:/.test(sanitizeCms('<img src="data:text/html,x">')));
  assert.ok(sanitizeCms('<a href="mailto:a@b.co">x</a><table><tr><td>1</td></tr></table>').includes('mailto:a@b.co'));
});

test('iframes: only the Google Maps embed, only in the map', () => {
  const map = '<iframe src="https://www.google.com/maps/embed?pb=1" width="600"></iframe>';
  assert.ok(sanitizeMap(map).includes('<iframe'));
  assert.ok(!sanitizeMap('<iframe src="https://evil.test/x"></iframe>').includes('iframe'));
  assert.ok(!sanitizeMap('<iframe src="https://www.google.com/other"></iframe>').includes('iframe'));
  assert.ok(!sanitizeCms(map).includes('iframe'));
});
