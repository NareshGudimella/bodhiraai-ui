/**
 * OpenNext adapter settings for the Cloudflare Worker (see DEPLOY.md, "Caching").
 *
 * - Incremental cache (ISR pages, fetch cache and the 'use cache' entries of
 *   cacheComponents, e.g. lib/site-api.ts under tag `site`): R2 bucket
 *   NEXT_INC_CACHE_R2_BUCKET, shared by every isolate, with the colo's Cache
 *   API in front (short-lived: reused for at most a minute, the same window as
 *   cacheLife('minutes'), and the tag cache is still consulted on every hit).
 * - Tag cache: the sharded Durable Object tag cache (NEXT_TAG_CACHE_DO_SHARDED),
 *   which is strongly consistent, so updateTag('site') / revalidateTag after a
 *   Web Studio save is seen by every isolate on the next read. It needs no D1
 *   database to create. A "next mode" tag cache, as 'use cache' requires.
 * - Queue: the Durable Object queue (NEXT_CACHE_DO_QUEUE) for time-based
 *   revalidation of stale ISR entries, deduplicated across isolates.
 *
 * No cache purge: nothing is cached in Cloudflare's CDN (pages render per
 * request and send private/no-store or short s-maxage headers).
 */
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import doShardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";

const config = {
  ...defineCloudflareConfig({
    incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "short-lived" }),
    tagCache: doShardedTagCache({ baseShardSize: 4 }),
    queue: doQueue,
  }),
  // Next's own build. Not `npm run build`: on Cloudflare's builds (WORKERS_CI) that
  // script runs this whole OpenNext build and would call itself.
  buildCommand: "npm run build:next",
};

export default config;
