/**
 * Request body limits per path. Next.js has one limit for the whole app
 * (Server Actions and route handlers, next.config.mjs), so it is set for the
 * biggest upload; here each path gets only what its forms need (limits from the
 * API's upload rules: lesson video 200 MB, site video 150 MB, documents 50 MB,
 * images 10 MB, plus multipart overhead). Cloudflare's own plan limit on request
 * bodies applies before this (DEPLOY.md, "Known limits").
 * No Worker APIs, so it runs under `node --test` (test/body-limit.test.ts).
 * (security: not in legacy)
 */

const MB = 1024 * 1024;

export function bodyLimit(path: string): number {
  if (path.startsWith('/content/chapters/') || path.startsWith('/content/lessons/')) return 205 * MB;
  if (path === '/cms/images' || path.startsWith('/cms/images/')) return 155 * MB;
  if (path.startsWith('/cms/') || path.startsWith('/student/assignments/') || path.startsWith('/teacher/assignments/')) return 60 * MB;
  return 12 * MB;
}

/** Whether a request's declared Content-Length is over the path's limit (GET and HEAD never are). */
export function overBodyLimit(method: string, path: string, contentLength: string | null): boolean {
  if (method === 'GET' || method === 'HEAD') return false;
  return Number(contentLength) > bodyLimit(path);
}

/** Past this, a request with no session cookie is refused before any other check. */
export const ANONYMOUS_BODY_LIMIT = 12 * MB;

/** security: not in legacy. A non-GET/HEAD body over 12 MB without a `bodhira_token` cookie. */
export function refuseAnonymousBigBody(method: string, contentLength: string | null, cookie: string | null): boolean {
  if (method === 'GET' || method === 'HEAD') return false;
  if (!(Number(contentLength) > ANONYMOUS_BODY_LIMIT)) return false;
  return !/(?:^|;\s*)bodhira_token=/.test(cookie ?? '');
}

/** The body, cut off with an error once it passes the limit (no Content-Length, e.g. chunked). */
export function limitBody(body: ReadableStream<Uint8Array> | null, path: string): ReadableStream<Uint8Array> | null {
  if (!body) return null;
  const limit = bodyLimit(path);
  let seen = 0;
  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        seen += chunk.byteLength;
        if (seen > limit) controller.error(new Error('Payload Too Large'));
        else controller.enqueue(chunk);
      },
    }),
  );
}
