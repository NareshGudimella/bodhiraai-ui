/**
 * Plain JavaScript (.mjs) on purpose: hosts whose Linux is too old for Next's native compiler
 * (glibc < 2.29) fall back to its WebAssembly build, which can't load a TypeScript config.
 * Tailwind runs through PostCSS (postcss.config.mjs), which both webpack and Turbopack use.
 */
import { securityHeaders } from "./security-headers.mjs";

/** @type {import("next").NextConfig} */
const nextConfig = {
  cacheComponents: true,
  experimental: {
    // Next has one limit for every Server Action and route body; it can't be set per route.
    // It is the biggest real upload: lesson videos, 200 MB (the API's limit, as in legacy), plus
    // multipart overhead. The Worker (worker/body-limit.ts) holds every other path
    // to what its forms need (12 MB by default); see DEPLOY.md "Request body limits".
    // security: not in legacy
    serverActions: { bodySizeLimit: '205mb' },
    // proxy.ts runs on page routes and buffers request bodies; past this limit the body is truncated.
    proxyClientMaxBodySize: '205mb',
    // app/global-not-found.tsx: the site's 404 page for URLs that match no route (two root
    // layouts, so there is no single not-found.tsx for them). SEO: not in legacy.
    globalNotFound: true,
  },
  partialPrefetching: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Legacy Route::redirect()s (302). The two public pages that moved for good answer
  // 301 so search engines pass their ranking to the new URL (SEO: not in legacy).
  // The rest stay 302: entry points to sign-in areas, and dashboard URLs behind
  // login (not crawled, and a cached 301 couldn't be undone if a URL comes back).
  async redirects() {
    return [
      { source: "/web-admin", destination: "/web-admin/login", statusCode: 302 },
      { source: "/admin/cms", destination: "/web-admin/login", statusCode: 302 },
      { source: "/blog-details", destination: "/blog", statusCode: 301 },
      { source: "/signin", destination: "/login", statusCode: 301 },
      // Legacy dashboard URLs that moved in the port, so old bookmarks still land
      // (not in legacy). Role-dependent ones (/notifications, /chat,
      // /account/settings) are in proxy.ts.
      ...[
        ["/admin/users/create", "/admin/users/new"],
        ["/admin/users/:id/edit", "/admin/users/:id"],
        ["/admin/classes/create", "/admin/classes"],
        ["/super/plans/create", "/super/plans/new"],
        ["/super/plans/:id/edit", "/super/plans/:id"],
        ["/super/schools/create", "/super/schools/new"],
        ["/super/schools/:id/edit", "/super/schools/:id"],
        ["/super/syllabi/create", "/super/syllabi/new"],
        ["/super/syllabi/:id/edit", "/super/syllabi/:id"],
        ["/content/quizzes/:id/edit", "/content/quizzes/:id"],
        ["/teacher/assignments/create", "/teacher/assignments/new"],
        ["/teacher/live/create", "/teacher/live/new"],
        ["/teacher/quizzes/:id/analytics", "/teacher/quizzes/:id"],
        // Legacy keys these by submission, the port by assignment.
        ["/teacher/submissions/:id/grade", "/teacher/assignments"],
        ["/student/attempts/:id/result", "/student/attempts/:id"],
        ["/cms/:resource(services|features|faqs|testimonials|team|categories|social)/create", "/cms/:resource/new"],
        ["/cms/:resource(services|features|faqs|testimonials|team|categories|social)/:id/edit", "/cms/:resource/:id"],
        ["/cms/pages/create", "/cms/pages/new"],
        ["/cms/posts/create", "/cms/posts/new"],
        // Legacy edits pages and posts by id; the port addresses them by slug.
        ["/cms/pages/:id/edit", "/cms/pages"],
        ["/cms/posts/:id/edit", "/cms/posts"],
      ].map(([source, destination]) => ({ source, destination, statusCode: /** @type {302} */ (302) })),
    ];
  },
};

export default nextConfig;
