import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { sitemapEnabled } from '@/lib/site';
import { absoluteUrl, publicOrigin } from '@/lib/site-url';

/**
 * robots.txt (SEO: not in legacy, which served `Disallow:` for everything from
 * public_html/robots.txt). The marketing site and the sign-in / sign-up pages
 * are open; dashboards, the Web Studio, checkout and billing, API and file
 * routes and one-time links are not. The sitemap is listed unless Web Studio →
 * Settings → SEO turns it off (`seo.sitemap_enabled`). Built per request: the
 * build must not need the API.
 */
const PRIVATE_PATHS = [
  '/student', '/teacher', '/parent', '/admin', '/super', '/cms', '/content', '/web-admin',
  '/auth', '/api', '/files', '/checkout', '/billing', '/paywall', '/invoices',
  '/reset-password', '/account', '/notifications', '/chat', '/locale', '/video', '/site-404', '/health', '/up$',
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  const origin = publicOrigin();
  const sitemap = origin && (await sitemapEnabled()) ? absoluteUrl('/sitemap.xml') : undefined;
  return {
    rules: { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
    ...(sitemap ? { sitemap } : {}),
    ...(origin ? { host: origin } : {}),
  };
}
