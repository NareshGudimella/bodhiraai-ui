// Request body limits (worker/body-limit.ts). Run: `npm run test:worker`.
// security: not in legacy
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bodyLimit, limitBody, overBodyLimit } from '../body-limit.ts';

const MB = 1024 * 1024;

test('limits per path', () => {
  assert.equal(bodyLimit('/content/lessons/5/edit'), 205 * MB);
  assert.equal(bodyLimit('/content/chapters/2'), 205 * MB);
  assert.equal(bodyLimit('/cms/images'), 155 * MB);
  assert.equal(bodyLimit('/cms/images/upload'), 155 * MB);
  assert.equal(bodyLimit('/cms/posts/new'), 60 * MB);
  assert.equal(bodyLimit('/student/assignments/3'), 60 * MB);
  assert.equal(bodyLimit('/teacher/assignments/new'), 60 * MB);
  assert.equal(bodyLimit('/contact'), 12 * MB);
  assert.equal(bodyLimit('/cms'), 12 * MB);
});

test('declared Content-Length', () => {
  assert.equal(overBodyLimit('POST', '/contact', String(12 * MB + 1)), true);
  assert.equal(overBodyLimit('POST', '/contact', String(12 * MB)), false);
  assert.equal(overBodyLimit('POST', '/contact', null), false);
  assert.equal(overBodyLimit('GET', '/contact', String(100 * MB)), false);
  assert.equal(overBodyLimit('POST', '/content/lessons/1', String(200 * MB)), false);
});

test('a body without Content-Length is cut off past the limit', async () => {
  const chunk = new Uint8Array(4 * MB);
  const source = new ReadableStream<Uint8Array>({
    start(c) {
      for (let i = 0; i < 4; i++) c.enqueue(chunk);
      c.close();
    },
  });
  await assert.rejects(new Response(limitBody(source, '/contact')).arrayBuffer(), /Payload Too Large/);
  const small = new ReadableStream<Uint8Array>({
    start(c) {
      c.enqueue(chunk);
      c.close();
    },
  });
  assert.equal((await new Response(limitBody(small, '/contact')).arrayBuffer()).byteLength, 4 * MB);
});
