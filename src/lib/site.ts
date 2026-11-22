import 'server-only';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { connection } from 'next/server';
import { mediaUrl } from './media';
import { getChrome } from './site-api';
import { absoluteUrl, publicOrigin } from './site-url';
import { preferWebp } from './webp';

const LEGACY_URL = (process.env.LEGACY_URL ?? 'http://localhost:8001').replace(/\/$/, '');

/**
 * Resolves theme asset paths (`assets/img/...`) for the marketing pages:
 * a file replaced in the Site Image Manager wins, else the bundled copy in
 * public/assets. The demo video isn't bundled (374 MB): until it is replaced
 * through the manager it streams from the legacy server. A bundled redesign
 * photo with a WebP copy (scripts/webp-images.mjs, src/lib/webp-manifest.json)
 * is served as .webp (performance: not in legacy).
 */
export async function assetResolver() {
  await connection(); // the marketing site renders per request (see its layout)
  const { images } = await getChrome();
  return (path: string) => {
    const rel = path.replace(/^\/+/, '');
    if (images[rel]) return images[rel];
    if (rel.endsWith('.mp4')) return `${LEGACY_URL}/${rel.split('/').map(encodeURIComponent).join('/')}`;
    return preferWebp(`/${rel}`);
  };
}

/**
 * For redesigned pages that swapped a legacy theme image for a new photo
 * (not in legacy): `img(legacyKey, newPath)` returns a Site Image Manager
 * replacement saved under the legacy key (same role) first, else
 * `asset(newPath)`, which is itself replaceable under its own key.
 */
export async function imageResolver() {
  const [asset, { images }] = await Promise.all([assetResolver(), getChrome()]);
  return (legacyKey: string | null, path: string) => (legacyKey ? images[legacyKey.replace(/^\/+/, '')] : undefined) ?? asset(path);
}

/** cms_setting('group.key', default). */
export async function settingResolver() {
  await connection();
  const { settings } = await getChrome();
  return (key: string, fallback = '') => {
    const v = settings[key];
    return v === null || v === undefined || v === '' ? fallback : String(v);
  };
}

/** Str::limit($s, $n): cut and add "..." (display width ≈ length for the Latin titles used here). */
export const strLimit = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n).trimEnd()}...`);

const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
/** Carbon format('d M, Y') etc. on an ISO date. */
export function fmtDate(iso: string | null, format: 'd M, Y' | 'd M Y' | 'M d, Y' | 'M j, Y'): string {
  if (!iso) return '';
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const m = MONTHS[d.getUTCMonth()];
  const y = d.getUTCFullYear();
  if (format === 'd M, Y') return `${dd} ${m}, ${y}`;
  if (format === 'd M Y') return `${dd} ${m} ${y}`;
  if (format === 'M d, Y') return `${m} ${dd}, ${y}`;
  return `${m} ${d.getUTCDate()}, ${y}`;
}

/** date('Y') for the footer (cached: prerendered pages may not read the clock directly). */
export async function currentYear() {
  'use cache';
  cacheLife('days');
  return new Date().getUTCFullYear();
}

/** The branded 1200×630 share image (public/assets/img/og/, made from the homepage photo + logo). not in legacy */
export const DEFAULT_OG = { path: 'assets/img/og/bodhira-og.jpg', width: 1200, height: 630 };
/** The seeded `general.default_og` points at a file that was never shipped; treat it as unset. */
const MISSING_OG = new Set(['/assets/img/og-default.png', 'assets/img/og-default.png']);

export type SiteMetaOptions = {
  /** Used when the CMS page record has no meta description (else the global one). */
  description?: string;
  /** Keep the page out of search results (theme demo pages). */
  noindex?: boolean;
  /** Canonical path when it isn't `path` (e.g. a blog category: `/blog?category=x`). */
  canonical?: string;
  /** og:type, `website` by default. */
  type?: 'website' | 'article';
  /** A page's own share image (a blog cover), used when the CMS record has none. */
  image?: string | null;
};

/**
 * The marketing layout's <head> (legacy layouts/app.blade.php): the CMS page
 * record for this path (Pages → SEO) wins, else the page's own title and
 * description, else the global settings. SEO additions (not in legacy): an
 * absolute canonical and og:url from SITE_URL, a per-page default description,
 * the branded 1200×630 share image when no other is set, and full Twitter tags.
 */
export async function siteMetadata(path: string, title?: string, opts: SiteMetaOptions = {}): Promise<Metadata> {
  await connection(); // request time, like the pages (see the site layout)
  const [{ seo, settings, images }, asset] = await Promise.all([getChrome(path.replace(/^\/+/, '')), assetResolver()]);
  const s = (k: string, d: string) => {
    const v = settings[k];
    return v === null || v === undefined || v === '' ? d : String(v);
  };
  // Share images stay JPEG/PNG (not the WebP copies): some crawlers don't read WebP.
  const original = (p: string) => {
    const rel = p.replace(/^\/+/, '');
    return images[rel] ?? `/${rel}`;
  };
  const siteName = s('general.site_name', 'Bodhira.ai');
  const metaTitle = seo?.meta_title || title || `${siteName} — ${s('general.tagline', 'Modern Digital Learning for Schools')}`;
  const description = seo?.meta_description || opts.description || s('seo.meta_description', 'Modern digital learning for schools.');
  const chosen = seo?.og_image || opts.image || (MISSING_OG.has(s('general.default_og', '')) ? '' : s('general.default_og', ''));
  const image = chosen
    ? { url: absoluteUrl(shareImageUrl(chosen, original)), alt: metaTitle }
    : { url: absoluteUrl(original(DEFAULT_OG.path)), width: DEFAULT_OG.width, height: DEFAULT_OG.height, alt: `${siteName} — ${s('general.tagline', 'Modern Digital Learning for Schools')}` };
  const robots = seo?.noindex || opts.noindex ? 'noindex, nofollow' : s('seo.robots', 'index, follow');
  const url = absoluteUrl(opts.canonical ?? path);
  return {
    title: { absolute: metaTitle },
    description,
    keywords: seo?.meta_keywords || undefined,
    robots,
    alternates: publicOrigin() ? { canonical: url } : undefined,
    openGraph: { title: metaTitle, description, images: [image], siteName, type: opts.type ?? 'website', url, locale: 'en_IN' },
    twitter: { card: 'summary_large_image', title: metaTitle, description, images: [image.url] },
    icons: { icon: asset('assets/img/favicon.png'), shortcut: asset('assets/img/favicon.png'), apple: asset('assets/img/favicon-512.png') },
  };
}

/** A CMS image value (`/assets/…` bundled or replaced, `/media/…` upload, or a full URL) as a URL. */
function shareImageUrl(v: string, original: (p: string) => string): string {
  if (/^https?:\/\//i.test(v)) return v;
  if (/^\/?assets\//.test(v)) return original(v);
  return mediaUrl(v) ?? v;
}

/** `seo.sitemap_enabled` (Web Studio → Settings → SEO): on unless switched off, and on when the API can't be reached. */
export async function sitemapEnabled(): Promise<boolean> {
  try {
    const v = (await getChrome()).settings['seo.sitemap_enabled'];
    return !(v === false || v === 0 || v === '0' || v === 'false');
  } catch {
    return true;
  }
}

/** date('F j, Y') (cached for an hour: prerendered pages may not read the clock directly). */
export async function todayLong() {
  'use cache';
  cacheLife('hours');
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
