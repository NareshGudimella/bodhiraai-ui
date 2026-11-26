/**
 * Legacy SecurityHeaders middleware, on every response. The CSP is legacy's
 * (lesson video is our own encrypted HLS from this origin: no extra hosts). It applies to production
 * builds only, because `next dev` needs eval, which it blocks. HSTS likewise
 * (legacy: secure or non-local requests). Legacy's cdnjs entries (Font Awesome) are gone:
 * the marketing site draws its icons as inline SVG since the Tailwind migration (not in legacy).
 *
 * Used by next.config.mjs (every response of the Next server) and by
 * scripts/cf-assets-headers.mjs (static files on Cloudflare, which Workers
 * static assets serve without the Next server). Plain .mjs, like next.config.mjs.
 */
export const LEGACY_CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com",
  `script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net`,
  // GA4 also reports to regional *.analytics.google.com hosts; the Pixel posts to facebook.com
  // (both load only after cookie consent, components/site/consent-analytics.tsx; not in legacy).
  // api.bodhiraai.com: the browser PUTs lesson videos straight to the API's own host (DNS-only, no Cloudflare
  // body cap). Hard-coded: this plain .mjs has no config for the API origin (not in legacy).
  "connect-src 'self' https://api.razorpay.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://api.bodhiraai.com",
  `frame-src 'self' https: https://api.razorpay.com`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://api.razorpay.com https://checkout.stripe.com",
].join("; ");

export const securityHeaders = [
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
