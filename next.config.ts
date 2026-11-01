import type { NextConfig } from "next";

/**
 * Legacy SecurityHeaders middleware, on every response. The CSP is legacy's,
 * unchanged; it applies to production builds only, because `next dev` needs
 * eval, which it blocks. HSTS likewise (legacy: secure or non-local requests).
 */
const LEGACY_CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com https://cdnjs.cloudflare.com",
  "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
  "connect-src 'self' https://api.razorpay.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  "frame-src 'self' https: https://api.razorpay.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://api.razorpay.com https://checkout.stripe.com",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-XSS-Protection", value: "0" },
  ...(process.env.NODE_ENV === "production"
    ? [
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "Content-Security-Policy", value: LEGACY_CSP },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // The container image (Dockerfile) runs the self-contained server; local runs keep `next start`.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  cacheComponents: true,
  experimental: {
    // Next has one limit for every Server Action and route body; it can't be set per route.
    // It is the biggest real upload: lesson videos, 200 MB (the API's limit, as in legacy), plus
    // multipart overhead. The edge Worker (edge/src/index.ts, bodyLimit) holds every other path
    // to what its forms need (12 MB by default); see DEPLOY.md "Request body limits".
    // security: not in legacy
    serverActions: { bodySizeLimit: '205mb' },
    // proxy.ts runs on page routes and buffers request bodies; past this limit the body is truncated.
    proxyClientMaxBodySize: '205mb',
  },
  partialPrefetching: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Legacy Route::redirect()s (302).
  async redirects() {
    return [
      { source: "/web-admin", destination: "/web-admin/login", statusCode: 302 },
      { source: "/admin/cms", destination: "/web-admin/login", statusCode: 302 },
      { source: "/blog-details", destination: "/blog", statusCode: 302 },
      { source: "/signin", destination: "/login", statusCode: 302 },
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
      ].map(([source, destination]) => ({ source, destination, statusCode: 302 as const })),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
