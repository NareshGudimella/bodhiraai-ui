<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# bodhiraai-ui

Next.js 16 frontend replacing the legacy Laravel Blade UI. It talks only to bodhiraai-api; there's no direct DB access. Workspace rules: [../AGENTS.md](../AGENTS.md). Migration status: [../docs/migration-plan.md](../docs/migration-plan.md).

## Layout

| Path | Purpose |
|---|---|
| `src/lib/api.ts` | Server-only `api<T>(path, {method, body, token})` (returns `data`) and `apiEnvelope<T>` (`data` + `meta`). Both throw `ApiError(message, status, code, errors)` |
| `src/lib/load.ts` | `load<T>(path)` for pages: API 404/403 → `notFound()`, 402 → `/paywall`. `paywallOn402(e)` does the same in Server Actions' `catch`. Dashboards' error pages: `app/(app)/error.tsx`, `app/(app)/not-found.tsx`, `app/global-error.tsx` |
| `src/lib/teacher-api.ts`, `parent-api.ts`, `inbox-api.ts` | Typed reads per area (inbox = chat + notifications) |
| `src/lib/teacher-actions.ts`, `inbox-actions.ts`, `action-result.ts` | Server Actions; form actions return `FormState` (`message`, Laravel `errors`, submitted `values`) and call `refresh()` or `redirect()` on success |
| `src/components/inbox/` | Notifications list, chat list and thread; shared by the role routes |
| `src/components/account/` | Shared settings page (profile with avatar, password) for every role |
| `src/components/form.tsx` | `Field` (label + first error), `inputClass`, `FormMessage` |
| `src/lib/student-api.ts` | Typed reads for `/student/*`. A 404 becomes `notFound()`. Follow this pattern (`<role>-api.ts`) for other roles |
| `src/lib/student-actions.ts` | Server Actions for client components (save progress, quizzes, AI chat) |
| `src/lib/media.ts` | `mediaUrl()`: resolves `/media/...` and `/cloud/...` against `LEGACY_URL` (uploads still live in the legacy app) |
| `src/lib/signed-file.ts` | Private uploads arrive as short-lived signed links (`<site>/files/<key>?exp&sig`; `localhost:4000` in dev): `isSignedFileUrl()`, `fileNameOf()`. Client-safe |
| `src/components/lesson-video.tsx`, `src/lib/playback-actions.ts` | Lesson video for every role that may play it: `playback === 'vdocipher'` → `lessonPlayback()` (Server Action, `GET /lessons/{id}/playback`) and VdoCipher's iframe plus player API; otherwise `<video>` without download, PiP or context menu |
| `src/lib/session.ts` | httpOnly cookies `bodhira_token` (API token) and `bodhira_role` (a redirect hint only) |
| `src/lib/dal.ts` | `getCurrentUser()` (GET /auth/me, memoised per request), `requireRole(...)`, `requireStudent()` (role plus paywall → `/paywall`) |
| `src/lib/auth-actions.ts` | Server Actions `login`, `logout`, `sendResetLink`, `resetPassword` |
| `src/lib/i18n.ts`, `src/lib/lang/` | Legacy localisation: `getT()` (`__()` for the request: cookie `bodhira_locale`, then `users.locale`, then English), dictionaries copied from legacy. `/locale/[locale]` switches. Wrap only strings that exist in the legacy dictionaries; link to the switch with `<a>`, not `<Link>` (prefetch would switch) |
| `src/lib/roles.ts` | Role → home path (same as the legacy redirects) |
| `src/proxy.ts` | Optimistic cookie-only redirects: signed out → `/login`, another role's dashboard → your own (Next 16 renamed middleware to proxy). Also the one API call: a missing `/blog/{slug}` gets the site's 404 page (`/site-404`) with a real 404 status |
| `src/components/list-tools.tsx` | `FilterBar` (GET form), `FilterInput`, `FilterSelect`, `Pagination`, `toParams()` for paginated admin lists |
| `src/components/dashboard-shell.tsx` | Role dashboard frame. Session-dependent UI renders inside `<Suspense>` after `authorize` (default `requireRole()`) |
| `src/components/ui.tsx` | `PageHeader`, `Card`, `Stat`, `ProgressBar`, `Pill`, `Empty`, button classes |
| `src/app/(app)/<role>/` | `student`, `teacher`, `parent` (Phases 1–3), `admin`, `super` (Phase 4; `super/mail-settings` is a page not in legacy: SMTP settings and a test email, via `superApi.mailSettings()` and the `saveMailSettings` / `sendTestMail` actions); `cms` (the Web Studio). `src/app/(app)/content/` is the super admin's content library (legacy URL `/content`; owner set in `ROLE_AREAS`, sidebar shared via `super/nav.ts`). Chat and notifications live under each role (`/teacher/chat`, `/parent/notifications`, …) |
| `src/lib/billing-api.ts`, `src/lib/billing-actions.ts` | Phase 5 billing: pricing, sign-up, paywall, checkout, invoices, school billing, manual grants |
| `src/lib/flash.ts`, `src/components/flash.tsx` | One-shot status message across a redirect (Laravel `->with('status')`): `setFlash()` in a Server Action, `<Flash />` shows it once (every dashboard renders it) |
| `src/lib/money.ts` | `paise()`/`rupees()` (PHP `number_format`, Western grouping, as the billing views print it), `mjY()`/`mj()` dates |
| `src/app/(app)/(auth)/register/student`, `src/app/(app)/paywall`, `src/app/(app)/checkout`, `src/app/(app)/billing` | B2C sign-up (guest only; pricing is a marketing page in `(site)`), the paywall, B2C checkout and the thank-you page (outside the paywall gate), gateway return pages |
| `src/app/(app)/cms/(studio)/`, `src/lib/cms-api.ts`, `src/lib/cms-actions.ts` | Phase 6a Web Studio (super and web admins): dashboard, the seven collections (one dynamic `[resource]` route driven by the API's field schema), pages and sections, posts, menus, media, settings, leads (CSV exports are route handlers via `lib/csv-proxy.ts`). `src/app/(app)/cms/images` has its own layout because content managers may open it. `/web-admin/login` is the CMS sign-in |
| `src/app/(site)/`, `src/components/site/`, `src/lib/site*.ts`, `public/assets/` | Phase 6b: the public marketing site, its own root layout around the legacy Bootstrap theme (dashboards live in `src/app/(app)/`, with their own root layout and Tailwind). `lib/site-api.ts`: cached public data (tag `site`); `lib/site.ts`: `assetResolver()` (Site Image Manager overrides, else the bundled `/assets/...` file), `settingResolver()`, `siteMetadata()`; `lib/site-actions.ts` + `site-flash.ts`: lead forms with Laravel-style flash; `components/site/theme-scripts.tsx` loads the theme's jQuery after hydration |
| `src/app/health`, `src/app/up` | Probes on the web domain: `/health` passes the API's `/health` through, `/up` is liveness only |
| `src/app/(app)/invoices/[invoice]/download/route.ts` | Route handler: streams the invoice PDF from the API with the session token |
| `src/app/(app)/student/live/[id]/join/route.ts` | Route handler: records the join through the API, then redirects to the meeting |
| `src/app/(app)/auth/handoff/` | Mobile-app hand-off: the page peeks at the code and asks for confirmation, the `confirmHandoff` action signs in, `failed/route.ts` flashes and goes to /login |

## Conventions

- `cacheComponents` is on: anything that reads cookies, headers or searchParams must sit inside `<Suspense>`. Never await the session at the top level of a layout.
- Fetch data in Server Components or Server Actions through `api()`. Never call the API from the browser, and never expose the token to client code.
- Authorise in the page or layout with `requireRole()`. `proxy.ts` is only an optimistic redirect. Areas that belong to particular roles go in `ROLE_AREAS` (role lists; the longest prefix wins, e.g. `/cms` vs `/cms/images`); guest-only pages in `GUEST_ONLY`.
- `api()` forwards the visitor's `X-Forwarded-For`, user agent and referer, so API rate limits and lead records see the visitor, not this server. Call the API only through `api()`.
- Checkboxes: pair each with a hidden `0` input of the same name (legacy markup); the CMS actions keep the last value per name, as PHP does.
- Sidebar sections: give nav items a `group` to start a labelled section.
- Marketing pages (`(site)`): theme markup with plain `<a>` links (full page loads re-run the theme's jQuery), images through `asset("assets/...")` so overrides apply, `export const instant = false` and `await connection()` before data (they render per request; the build must not need the API). Keep anything the theme's scripts rewrite (selects, sliders) out of React state changes, and don't put scripts that touch the DOM before hydration in pages. Web Studio actions call `updateTag('site')` after a save.
- Style with Tailwind using the brand tokens in `globals.css` (`brand`, `primary`, `page`, `card`, `ink`, `line`, …), which are ported from the legacy `app-web/styles.css`.
- Match the legacy screens' behaviour; see `../bodhiraai.com/resources/views/<role>/`.
- Client hooks that read the URL (`usePathname`, `useSearchParams`) must sit inside `<Suspense>`, or the build fails under `cacheComponents`.
- Every route segment that fetches data gets a `loading.tsx` (re-export the section's placeholder). Without one, client navigation between siblings blocks, and `next dev` logs "uncached data … outside of `<Suspense>`". Check new pages with `next dev` and expect zero such warnings.
- Effects must return nothing or a cleanup function. Use a block body for effects that call browser APIs: newer Chrome returns a Promise from `scrollIntoView()`, and an arrow-expression effect that returns it crashes when Next hides the page.
- File uploads: Server Actions forward the form with `forwardForm(form, fields, fileField)` (it drops the empty File an unused input sends); `api()` sends `FormData` as multipart. JSON-only endpoints must get a plain object, not `FormData`. Next has one body limit for the whole app, set to 205 MB in `next.config.ts` (`serverActions.bodySizeLimit`, `proxyClientMaxBodySize`, since the proxy truncates bodies past its limit); the edge Worker enforces the per-path limits (`bodyLimit()` in `edge/src/index.ts`, see DEPLOY.md), so a new upload form on a new path needs an entry there.
- After editing a Server Action, restart `next dev` before browser-testing it: dev can keep serving the previous action.
- Any route param or form value in an API path goes through `idSeg()` (digits, else 404) or `seg()` (one encoded segment) from `src/lib/api-path.ts`; `api()` also refuses paths with `..` or encoded separators. Any user-supplied redirect target goes through `safeNextPath()`.
- Redirects that need the API token (for example joining a meeting) are route handlers (`route.ts`), not client code.
- A page's `notFound()` gives a 200 in production builds (the prerendered shell is already sent). Where the status matters, decide in `proxy.ts` (see the blog post check). Check statuses with `next build && next start`, not `next dev`.
- Redirects answer 302, as Laravel's `redirect()` does: pass `302` to `NextResponse.redirect()` and `statusCode: 302` in `next.config.ts` (Next defaults to 307).
- Forms: `useActionState(action)`. React resets uncontrolled inputs after an action runs, so return `failure(e, msg, form)` and give fields `defaultValue={state?.values?.x}` plus a matching `key`; otherwise a validation error wipes what the user typed. Show `state.errors.<field>[0]` under each field.
- Multi-column grids: put `[&>*]:min-w-0` on the grid, so a wide table or long title can't push the single-column mobile layout off-screen. Wide tables go in an `overflow-x-auto` container.
- Private files (avatars, logos, lesson files and thumbnails, assignment attachments, submissions) are signed links that expire (30 min): render them with plain `<img>`/`<a>`/`<iframe>` (not `next/image`), never put them in a `'use cache'` scope, show file names with `fileNameOf()`, and never prefill a URL input with one (edit forms leave URL fields blank and show "Uploaded file"). Content editors don't get a lesson video player. New third-party scripts or frames go in `LEGACY_CSP` (`next.config.ts`). security: not in legacy
- Client components never call the API directly. They call Server Actions, which use `api()` with the httpOnly token.
- Browser tests: Next keeps previously visited pages in the DOM as hidden `<Activity>` trees, so scope selectors to visible elements (for example `getByRole`, or `:visible`). After navigating, wait for the page's content, not just the URL, because the loading placeholder shows first.

## Commands

```bash
npm run dev     # :3000 (needs bodhiraai-api on API_URL)
npm run lint
npm run build
```

`.env.local`: copy `.env.example` (`API_URL` for the Nest API, `LEGACY_URL` for legacy-served media and marketing pages such as `/contact`).

Production: a Cloudflare Container (`Dockerfile`, standalone output; the image is built only in GitHub Actions, never locally) behind the edge Worker in `edge/` (own package and tsconfig; `cd edge && npm run typecheck`). See [DEPLOY.md](DEPLOY.md). Several containers run at once, so keep no per-process state beyond the `site` cache.
