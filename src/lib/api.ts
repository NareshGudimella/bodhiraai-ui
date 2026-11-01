import 'server-only';
import { headers } from 'next/headers';
import { getToken } from './session';
import { proxySecretHeader } from './proxy-secret';
import { assertSafeApiPath } from './api-path';

/** Envelope returned by bodhiraai-api (same as the legacy Laravel ApiResponse). */
export type ApiEnvelope<T> =
  | { success: true; message: string | null; data: T; meta?: Record<string, unknown> }
  | { success: false; message: string; code?: string; errors?: Record<string, string[]> };

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly errors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';

/**
 * The visitor as the API should see them. This server makes the call, so the
 * browser's address, user agent and page go along. Rate limits and lead
 * records then use the visitor's IP, not this server's. Behind Cloudflare the
 * edge Worker sets X-Client-IP and the API believes it with PROXY_SECRET;
 * locally the API trusts X-Forwarded-For from this server (TRUST_PROXY).
 */
export async function visitorHeaders(): Promise<Record<string, string>> {
  const h = await headers();
  const out: Record<string, string> = proxySecretHeader();
  const client = h.get('x-client-ip');
  if (out['X-Proxy-Secret'] && client) {
    out['X-Client-IP'] = client;
  } else {
    const forwarded = h.get('x-forwarded-for') ?? h.get('x-real-ip');
    if (forwarded) out['X-Forwarded-For'] = forwarded;
  }
  for (const name of ['user-agent', 'referer']) {
    const v = h.get(name);
    if (v) out[name] = v;
  }
  return out;
}

/**
 * Server-side call to the API returning the whole success envelope (`data` and
 * `meta`). Sends the session token when present; throws ApiError otherwise.
 */
export async function apiEnvelope<T>(
  path: string,
  init: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<{ data: T; meta: Record<string, unknown>; message: string | null }> {
  assertSafeApiPath(path); // security: not in legacy
  const token = init.token === undefined ? await getToken() : init.token;
  // FormData goes as multipart (fetch sets the boundary); anything else as JSON.
  const multipart = init.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    method: init.method ?? (init.body ? 'POST' : 'GET'),
    headers: {
      ...(await visitorHeaders()),
      Accept: 'application/json',
      ...(init.body && !multipart ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: multipart ? (init.body as FormData) : init.body ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  });

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!json) throw new ApiError('Unexpected response from server.', res.status);
  if (!json.success) throw new ApiError(json.message, res.status, json.code, json.errors);
  return { data: json.data, meta: json.meta ?? {}, message: json.message };
}

/** Like apiEnvelope, returning only `data`. */
export async function api<T>(
  path: string,
  init: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  return (await apiEnvelope<T>(path, init)).data;
}
