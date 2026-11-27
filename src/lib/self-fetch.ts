import { getCloudflareContext } from '@opennextjs/cloudflare/cloudflare-context';

type SelfBinding = { fetch(input: string | URL, init?: RequestInit): Promise<Response> };

/**
 * A GET of one of this app's own pages, from server code (proxy.ts renders the
 * site's 404 page this way).
 *
 * - On Cloudflare Workers (OpenNext) through the WORKER_SELF_REFERENCE service
 *   binding: a Worker can't reach itself on 127.0.0.1, and a fetch to its own
 *   route (`bodhiraai.com/*`) would skip the Worker and go to the zone's origin.
 * - Under `next start` (local) on this server's own port.
 */
export function fetchSelf(path: string, requestUrl: string, init?: RequestInit): Promise<Response> {
  const self = cloudflareSelf();
  if (self) return self.fetch(new URL(path, requestUrl), init);
  return fetch(`http://127.0.0.1:${process.env.PORT ?? 3000}${path}`, init);
}

function cloudflareSelf(): SelfBinding | undefined {
  try {
    const env = getCloudflareContext().env as unknown as { WORKER_SELF_REFERENCE?: SelfBinding };
    return env.WORKER_SELF_REFERENCE;
  } catch {
    // Not running in a Worker.
    return undefined;
  }
}
