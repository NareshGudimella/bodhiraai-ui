# bodhiraai-ui: production deployment

How the Next.js web app runs in production. It's a **Cloudflare Container** behind an edge Worker on `bodhiraai.com`, and the Worker also routes the API and serves the legacy files from R2. The steps for switching from legacy are in [../docs/cutover-runbook.md](../docs/cutover-runbook.md).

> **Status: draft for review.** None of this has been deployed to Cloudflare yet.

## 1. Pieces

| Piece | Where | What it does |
|---|---|---|
| `Dockerfile` | this folder | Builds the standalone Next.js server (`node server.js`, port 3000). The build doesn't call the API |
| `edge/` | Worker plus container config (`wrangler.jsonc`; `wrangler.staging.jsonc` for the rehearsal) | The Worker on `bodhiraai.com/*` (the route only in `wrangler.jsonc`'s `production` env, from cut-over step 7) |
| R2 `bodhira-legacy` | bound as `LEGACY_FILES` | Legacy uploads (`media/…`, `cloud/…`) and the site's `.mp4` videos (`assets/…`), copied before cut-over |
| R2 uploads bucket | the API's `R2_BUCKET` / `R2_PUBLIC_URL` | Public uploads (marketing site / CMS files only), as absolute URLs. Not used by the Worker |
| R2 `bodhira-private` | bound as `PRIVATE_FILES`; the API's `R2_PRIVATE_BUCKET` | Every non-public upload (avatars, school logos, lesson files and thumbnails, assignment attachments, submissions, recordings). **Never public**: no `r2.dev` URL, no custom domain. Reached only through signed `/files/*` links (security: not in legacy) |

What the Worker does with each request ([edge/src/index.ts](edge/src/index.ts)):
- **`/api/v1/*`, `/webhooks/*`:** passed to `API_ORIGIN` (Elastic Beanstalk). The mobile app and the gateway webhook URLs stay the same.
- **`/media/*`, `/cloud/*`, `/assets/**.mp4`:** served from `LEGACY_FILES`, with byte ranges so videos can be seeked. `/media/invoices/…` (any letter case, also percent-encoded) answers 404: invoices live only in the private bucket, behind the authenticated invoice endpoints (security: not in legacy; `edge/src/legacy-key.ts`, tested in `edge/test/legacy-key.test.ts`).
- **`/files/<key>?exp&sig`:** private files from `PRIVATE_FILES`, only with a link the API signed ([edge/src/file-sig.ts](edge/src/file-sig.ts)): `sig` is base64url HMAC-SHA256 with `FILE_URL_SECRET` over `"<decoded key>\n<exp>"`. A missing or wrong signature, an expired link, `exp` more than 24 h ahead, or a forbidden key (`invoices/…`, `..`, `\`, empty segments) answers 403 `{"message":"Link expired or invalid."}`; a missing object 404. Byte ranges as for `/media`. Headers: `Content-Disposition: inline`, `nosniff`, `Referrer-Policy: no-referrer`, `Cache-Control: private, max-age=<seconds until exp, ≤ 3600>`. Locally the API serves `/files/*` itself on :4000. (security: not in legacy)
- **Everything else:** the web container.
- **Visitor IP:** every request carries the visitor's IP as `X-Client-IP`, set by the Worker so a visitor can't supply their own. Requests to the API also carry `X-Proxy-Secret`. The web server forwards both when it calls the API.

## 2. Settings

The container gets its env vars from the Worker (`Web.envVars`), so the image holds no settings and no secrets.

| Setting | Where | Value |
|---|---|---|
| `API_ORIGIN` | `wrangler.jsonc` vars | `https://api-origin.bodhiraai.com` |
| `SITE_URL` | `wrangler.jsonc` vars | `https://bodhiraai.com`. It also becomes `LEGACY_URL`, because the Worker serves the legacy files on the site's own domain |
| `WEB_INSTANCES` | `wrangler.jsonc` vars | How many containers requests are spread across (`getRandom`, ≤ `max_instances` = 5) |
| `PROXY_SECRET` | `npx wrangler secret put PROXY_SECRET` | The same value as the API's |
| `FILE_URL_SECRET` | `npx wrangler secret put FILE_URL_SECRET` | **Exactly the API's `FILE_URL_SECRET`**, or every signed link answers 403. At least 32 random bytes. Rotating it breaks links already handed out (they last 30 minutes, `FILE_URL_TTL`), so change both sides together |

Both secrets are listed under `secrets.required` in `wrangler.jsonc` (names only, no values).

## 3. Deploy

Deploys run in GitHub Actions, never from a workstation, so **nobody needs Docker or Colima locally**. GitHub's runners have Docker; wrangler builds `Dockerfile` there and pushes the image to Cloudflare's registry.

- **CI** (`.github/workflows/ci.yml`, every push): lint, type-check, the standalone build, the **image build plus a start check**, and the Worker's dry run.
- **Deploy** (`.github/workflows/deploy.yml`, manual): Actions → Deploy → Run workflow, on a commit CI passed. It runs `wrangler deploy` in `edge/`, which deploys the Worker and rolls out the containers. Choose the target:

  | Target | Config | Route | When |
  |---|---|---|---|
  | `no-route` (default) | `wrangler.jsonc`, top level (`--env=`) | **none**: no production traffic; `*.workers.dev` only | Before cut-over |
  | `production` | `wrangler.jsonc --env production` | `bodhiraai.com/*` | Cut-over step 7 ([runbook](../docs/cutover-runbook.md) §6), then every deploy |
  | `staging` | `wrangler.staging.jsonc` | the staging host | The rehearsal (runbook §4) |

  Both `wrangler.jsonc` targets deploy the same Worker (`bodhiraai-web`) and container application, so secrets and warm containers carry over to cut-over. A `no-route` deploy never removes a route (wrangler only replaces routes when the config lists some), so after cut-over it would still update production code: use `production` from then on. Wrangler doesn't inherit bindings, vars or containers into an env, so change the top level and `env.production` together.

Once, before the first deploy:
1. In the repository settings, create the `production` environment with a required reviewer (used by `no-route` and `production`), and `staging` for the rehearsal.
2. Add its secrets `CLOUDFLARE_API_TOKEN` (permissions: Workers Scripts, Containers and R2, edit) and `CLOUDFLARE_ACCOUNT_ID`.
3. From any machine with Node (no Docker needed):
   ```bash
   cd bodhiraai-ui/edge && npm ci
   npx wrangler login
   npx wrangler r2 bucket create bodhira-legacy
   npx wrangler r2 bucket create bodhira-private   # leave public access off
   npx wrangler secret put PROXY_SECRET   # also on rotation
   npx wrangler secret put FILE_URL_SECRET   # the API's value; also on rotation
   ```

Deploy the API first whenever a release changes both apps.

**Before the first deploy:**
- `bodhiraai.com` must be proxied in Cloudflare DNS (orange cloud) before the `production` target is run. The Worker route is `bodhiraai.com/*` in `env.production` only; add `www` the same way if it's used.
- **Staging:** replace the `<placeholders>` in `wrangler.staging.jsonc` (host, zone, API origin), create `bodhira-legacy-staging` and `bodhira-private-staging` (public access off), and set the staging secrets with `-c wrangler.staging.jsonc`. Never point it at production buckets or the production API.
- Check `wrangler.jsonc` against the current Containers docs (`instance_type`, `max_instances`). Containers is a newer product, and wrangler already renamed `standard` to `standard-1`.

**Local check (no Docker):**
- **Standalone server:** `NEXT_OUTPUT=standalone npx next build`, copy `.next/static` and `public` into `.next/standalone/`, then `node .next/standalone/server.js`. This is what the image runs.
- **Worker routing:** `wrangler.local.jsonc` turns containers off. Start the API on :4000 with `PROXY_SECRET=local-test-secret-42`, put test files into the local R2 (`npx wrangler r2 object put bodhira-legacy/media/<path> --file <f> --local -c wrangler.local.jsonc`), then run `npx wrangler dev -c wrangler.local.jsonc`. This was checked:
  - `/api/v1` and signed webhooks pass through unchanged;
  - rate limits count per visitor IP;
  - `/media` and `/cloud` files are served, with correct byte ranges (normal, suffix and open-ended; a range past the end answers 416), `304` on `If-None-Match`, `405` on POST and `404` on bad paths;
  - the origin answers 403 without the secret.
- **Private files through the Worker:** put a file with `npx wrangler r2 object put "bodhira-private/<key>" --file <f> --content-type <type> --local -c wrangler.local.jsonc`, sign a link with `FILE_URL_SECRET=local-file-secret-42` (the API's signer, or `signFileKey` in `edge/src/file-sig.ts`), then run `npx wrangler dev -c wrangler.local.jsonc`. Checked: 200 with the contract headers, 206 ranges (normal, suffix, open-ended), 416 for a range past the end (now also on `/media`), 304 on `If-None-Match`, 405 on POST, 403 JSON for a changed `sig`, an `exp` past the 24 h horizon, no query, an `invoices/` key and an encoded `..`, and 404 for a valid link to a missing key.
- **Signed links:** `cd edge && npm test` checks the signature rules, including a fixed vector the API must match: key `submissions/7/a b.pdf`, exp `2000000000`, secret `test-secret` → `AfIQbpO7Ovsv3aJJc4JbnUv2jkiWW8DtIC4XTA8fWG8`.
- **The image itself** is built and started only in CI. It hasn't run yet, because nothing has been pushed.

## 4. Behaviour behind the proxy

- **Security headers:** legacy's `SecurityHeaders` values are applied to every response: `nosniff`, `X-Frame-Options: SAMEORIGIN`, Referrer-Policy and Permissions-Policy. Production builds also get HSTS and legacy's CSP. Pages that add a new third-party script, style or frame must add it to `LEGACY_CSP` in `next.config.ts`. The one addition so far is `https://player.vdocipher.com` in `script-src` (the player API, `v2/api.js`) and `frame-src` (the DRM player iframe) for lesson videos (security: not in legacy); the player itself runs on VdoCipher's origin, so no `connect-src`/`media-src` change is needed.
- **Lesson video:** lessons with `playback: "vdocipher"` get a one-time OTP from the API's `GET /lessons/{id}/playback` through a Server Action (`lib/playback-actions.ts`; the token stays on the server) and play in VdoCipher's iframe with a moving watermark (`components/lesson-video.tsx`). Content editors see a note instead of a player. Other videos keep `<video>` with downloads, picture-in-picture and the context menu off.
- **Private files in pages:** avatars, logos, thumbnails and attachments arrive as signed links that change with every response; pages render them with plain `<img>`/`<a>`/`<iframe>` (no `next/image`, so nothing is cached under one URL), and forms never send one back as a typed URL (`lib/signed-file.ts`).
- **Redirects:** they are built from `SITE_URL` (`lib/site-url.ts`), because the container sees `http://` and an internal host. The Worker also sets `X-Forwarded-Proto` and `X-Forwarded-Host`.
- **The secret on API calls:** every call from this server to the API sends `X-Proxy-Secret` (`lib/proxy-secret.ts`), and the API refuses calls without it. Any new `fetch` to the API must spread `proxySecretHeader()` (or `visitorHeaders()`).
- **Root files:** `robots.txt` and `favicon.png` were copied from legacy `public_html`.

## 5. Known limits

- **Upload size and Cloudflare plans:** Cloudflare caps request bodies at 100 MB on the Free and Pro plans, 200 MB on Business and 500 MB on Enterprise. Lesson videos up to 200 MB (the legacy limit) need the Enterprise plan, or a later change to upload directly to R2 with presigned URLs. **Decision needed.**
- **Request body limits:** Next.js 16 has a single body limit for all Server Actions and route handlers (`serverActions.bodySizeLimit`, and `proxyClientMaxBodySize` because `proxy.ts` buffers bodies); it cannot be set per route. `next.config.ts` therefore uses the largest real upload (205 MB: lesson video 200 MB plus multipart overhead). Without more, any visitor could post 205 MB to any form. The edge Worker (`bodyLimit()` in `edge/src/index.ts`) answers 413 past a per-path limit: 205 MB for `/content/chapters/*` and `/content/lessons/*`, 155 MB for `/cms/images`, 60 MB for `/cms/*` and assignment pages, 12 MB elsewhere. It checks `Content-Length` and also cuts off bodies that have none. If the Worker is bypassed (direct container access), the limit is 205 MB everywhere; keep the container reachable only through the Worker. A Cloudflare WAF rule on request body size can back this up. Change these limits together with the API's upload rules (`bodhiraai-api/src/storage/upload-rules.ts`).
- **Site cache across containers:** a Web Studio save refreshes the site cache only in the container that handled it. The others pick up the change within about a minute (`cacheLife('minutes')`).
- **Scaling:** `getRandom` spreads requests over a fixed `WEB_INSTANCES` containers. Each one sleeps after 15 idle minutes, and the next request starts it again (a cold start).
- **Dashboard 404 status:** a missing dashboard page shows the 404 page but answers status 200. Blog posts answer a real 404.
- **Web sessions:** users signed in to the legacy website have to sign in again after cut-over. Mobile app tokens keep working.
