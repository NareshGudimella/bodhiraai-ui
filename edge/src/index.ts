/**
 * Edge router for https://bodhiraai.com on Cloudflare (replaces the legacy
 * Nginx server block):
 *   /api/v1/*, /webhooks/*  -> the API on Elastic Beanstalk (API_ORIGIN)
 *   /media/*, /cloud/*, /assets/**.mp4 -> legacy files copied to R2 (LEGACY_FILES)
 *   /files/*                -> private uploads (PRIVATE_FILES), signed links only
 *   everything else         -> the Next.js web app in a Cloudflare Container
 * The visitor's address goes along as X-Client-IP with PROXY_SECRET, which
 * the API believes (bodhiraai-api/src/common/http/client-ip.ts).
 */
import { Container, getRandom } from '@cloudflare/containers';
import { keyFromPath, verifyFileLink } from './file-sig';

interface Env {
  WEB: DurableObjectNamespace<Web>;
  LEGACY_FILES: R2Bucket;
  /** Private uploads (avatars, logos, lesson files, submissions); the API's R2_PRIVATE_BUCKET. */
  PRIVATE_FILES: R2Bucket;
  /** Same value as the API's FILE_URL_SECRET (a Worker secret). */
  FILE_URL_SECRET: string;
  API_ORIGIN: string;
  SITE_URL: string;
  WEB_INSTANCES: string;
  PROXY_SECRET: string;
}

/** The Next.js server (../Dockerfile). Settings reach it as env vars. */
export class Web extends Container<Env> {
  defaultPort = 3000;
  sleepAfter = '15m';

  constructor(ctx: ConstructorParameters<typeof Container>[0], env: Env) {
    super(ctx, env);
    this.envVars = {
      API_URL: `${env.API_ORIGIN}/api/v1`,
      SITE_URL: env.SITE_URL,
      // Relative legacy files resolve against the site, which serves them from R2 below.
      LEGACY_URL: env.SITE_URL,
      PROXY_SECRET: env.PROXY_SECRET,
    };
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const client = request.headers.get('cf-connecting-ip') ?? '';

    if (path.startsWith('/api/v1/') || path.startsWith('/webhooks/')) {
      const headers = new Headers(request.headers);
      headers.set('X-Client-IP', client);
      headers.set('X-Proxy-Secret', env.PROXY_SECRET);
      return fetch(
        new Request(`${env.API_ORIGIN}${path}${url.search}`, {
          method: request.method,
          headers,
          body: request.body,
          redirect: 'manual',
        }),
      );
    }

    if (path === '/files' || path.startsWith('/files/')) {
      return privateFile(request, env, url);
    }

    const tooBig = checkBodyLimit(request, path);
    if (tooBig) return tooBig;

    const legacyKey = legacyFileKey(path);
    if (legacyKey === null) return new Response('Not Found', { status: 404 });
    if (legacyKey) return serveFile(request, env.LEGACY_FILES, legacyKey);

    // Set here, so a visitor can't supply their own.
    const headers = new Headers(request.headers);
    headers.set('X-Client-IP', client);
    // The container is reached over http; Next builds redirect and request URLs
    // from these, so they stay https://bodhiraai.com.
    headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
    headers.set('X-Forwarded-Host', url.host);
    const container = await getRandom(env.WEB, Number(env.WEB_INSTANCES || 2));
    return container.fetch(new Request(request, { headers, body: limitBody(request, path) }));
  },
} satisfies ExportedHandler<Env>;

/**
 * R2 key of a legacy file. Keys keep the legacy URL paths: media/<public disk
 * path>, cloud/<path>, assets/<path>.mp4 (site videos). Undefined for other
 * paths; null for a legacy path that can't be a file (bad encoding, `..`).
 */
function legacyFileKey(path: string): string | null | undefined {
  if (
    !path.startsWith('/media/') &&
    !path.startsWith('/cloud/') &&
    !(path.startsWith('/assets/') && path.toLowerCase().endsWith('.mp4'))
  ) {
    return undefined;
  }
  let key: string;
  try {
    key = decodeURIComponent(path.slice(1));
  } catch {
    return null;
  }
  return key.split('/').some((s) => s === '..' || s === '') ? null : key;
}

/** GET/HEAD of an R2 object with byte ranges (video seeking), as legacy's MediaController::stream. */
async function serveFile(
  request: Request,
  bucket: R2Bucket,
  key: string,
  /** Final say on the response headers (private files). */
  finish?: (headers: Headers) => void,
): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    });
  }
  const rangeHeader = request.headers.get('range');
  let object: R2Object | R2ObjectBody | null;
  try {
    object = await bucket.get(key, {
      range: request.headers,
      onlyIf: request.headers,
    });
  } catch (e) {
    // R2 rejects a range it can't satisfy; anything else is a real error.
    if (rangeHeader) return new Response(null, { status: 416 });
    throw e;
  }
  if (!object) return new Response('Not Found', { status: 404 });
  // A range that starts past the end is 416, not the whole file (R2 may clamp it).
  const start = /^bytes=(\d+)-/.exec(rangeHeader ?? '');
  if (start && Number(start[1]) >= object.size) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${object.size}` } });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Accept-Ranges', 'bytes');
  hardenFile(headers);
  finish?.(headers);
  if (!('body' in object)) return new Response(null, { status: 304, headers });

  let status = 200;
  const range = object.range;
  if (range && request.headers.has('range')) {
    // R2Range is {offset, length?}, {offset?, length}, or {suffix}; absent
    // fields may be present as undefined, so test values, not keys.
    const r = range as { offset?: number; length?: number; suffix?: number };
    const offset =
      r.suffix !== undefined
        ? Math.max(0, object.size - r.suffix)
        : (r.offset ?? 0);
    const length =
      r.suffix !== undefined
        ? object.size - offset
        : Math.min(r.length ?? object.size - offset, object.size - offset);
    status = 206;
    headers.set(
      'Content-Range',
      `bytes ${offset}-${offset + length - 1}/${object.size}`,
    );
    headers.set('Content-Length', String(length));
  } else {
    headers.set('Content-Length', String(object.size));
  }
  return new Response(request.method === 'HEAD' ? null : object.body, {
    status,
    headers,
  });
}

/**
 * GET/HEAD /files/<key>?exp&sig: a private upload behind a short-lived link
 * the API signed (file-sig.ts). Anything wrong with the link is the same 403,
 * so a probe can't tell a forbidden key from a bad signature; a valid link to
 * a missing object is a 404. The browser may keep the file only until the
 * link expires (at most an hour), never in a shared cache.
 * security: not in legacy
 */
async function privateFile(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const key = keyFromPath(url.pathname.slice('/files/'.length));
  const check =
    key === null
      ? { ok: false as const }
      : await verifyFileLink(env.FILE_URL_SECRET, key, url.searchParams.get('exp'), url.searchParams.get('sig'));
  if (!check.ok || key === null) {
    return Response.json(
      { message: 'Link expired or invalid.' },
      { status: 403, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } },
    );
  }
  const maxAge = Math.max(0, Math.min(check.exp - Math.floor(Date.now() / 1000), 3600));
  return serveFile(request, env.PRIVATE_FILES, key, (headers) => {
    headers.set('Content-Disposition', 'inline');
    headers.set('Cache-Control', `private, max-age=${maxAge}`);
    headers.set('Referrer-Policy', 'no-referrer');
  });
}

/**
 * Uploaded files are user content on the site's own origin. Never let a
 * browser guess a type (an HTML or SVG file renamed .jpg), and give anything
 * that is not a PDF or a video/audio file an empty, sandboxed policy: no
 * scripts, no origin, so a stray HTML/SVG upload can't act as the site.
 * Images show inline under it. PDFs and media are left to nosniff alone:
 * Chrome's PDF viewer refuses to load a PDF served with `sandbox`, and these
 * types can't run script in our origin. (security: not in legacy)
 */
function hardenFile(headers: Headers): void {
  headers.set('X-Content-Type-Options', 'nosniff');
  const type = (headers.get('Content-Type') ?? '').split(';')[0].trim().toLowerCase();
  const viewer = type === 'application/pdf' || type.startsWith('video/') || type.startsWith('audio/');
  if (!viewer) headers.set('Content-Security-Policy', "default-src 'none'; sandbox");
}

const MB = 1024 * 1024;

/**
 * Next.js has one request-body limit for the whole app (server actions and
 * route handlers), so it is set for the biggest upload. Here each path gets
 * only what its forms need (limits from the API's upload rules: lesson video
 * 200 MB, site video 150 MB, documents 50 MB, images 10 MB, plus multipart
 * overhead). (security: not in legacy)
 */
function bodyLimit(path: string): number {
  if (path.startsWith('/content/chapters/') || path.startsWith('/content/lessons/')) return 205 * MB;
  if (path === '/cms/images' || path.startsWith('/cms/images/')) return 155 * MB;
  if (path.startsWith('/cms/') || path.startsWith('/student/assignments/') || path.startsWith('/teacher/assignments/')) return 60 * MB;
  return 12 * MB;
}

/** 413 for a declared Content-Length over the path's limit. */
function checkBodyLimit(request: Request, path: string): Response | null {
  if (request.method === 'GET' || request.method === 'HEAD') return null;
  if (path.startsWith('/api/v1/') || path.startsWith('/webhooks/')) return null;
  const length = Number(request.headers.get('content-length'));
  return length > bodyLimit(path) ? new Response('Payload Too Large', { status: 413 }) : null;
}

/** The body, cut off with an error once it passes the limit (no Content-Length, e.g. chunked). */
function limitBody(request: Request, path: string): ReadableStream | null {
  if (!request.body) return null;
  const limit = bodyLimit(path);
  let seen = 0;
  return request.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        seen += chunk.byteLength;
        if (seen > limit) controller.error(new Error('Payload Too Large'));
        else controller.enqueue(chunk);
      },
    }),
  );
}
