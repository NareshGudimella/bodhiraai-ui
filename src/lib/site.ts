import 'server-only';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { connection } from 'next/server';
import { getChrome } from './site-api';

const LEGACY_URL = (process.env.LEGACY_URL ?? 'http://localhost:8001').replace(/\/$/, '');

/**
 * Resolves theme asset paths (`assets/img/...`) for the marketing pages:
 * a file replaced in the Site Image Manager wins, else the bundled copy in
 * public/assets. The demo video isn't bundled (374 MB): until it is replaced
 * through the manager it streams from the legacy server.
 */
export async function assetResolver() {
  await connection(); // the marketing site renders per request (see its layout)
  const { images } = await getChrome();
  return (path: string) => {
    const rel = path.replace(/^\/+/, '');
    if (images[rel]) return images[rel];
    if (rel.endsWith('.mp4')) return `${LEGACY_URL}/${rel.split('/').map(encodeURIComponent).join('/')}`;
    return `/${rel}`;
  };
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

/**
 * The marketing layout's <head> (legacy layouts/app.blade.php): the CMS page
 * record for this path (Pages → SEO) wins, else the page's own title and the
 * global settings.
 */
export async function siteMetadata(path: string, title?: string): Promise<Metadata> {
  await connection(); // request time, like the pages (see the site layout)
  const [{ seo, settings }, asset] = await Promise.all([getChrome(path.replace(/^\/+/, '')), assetResolver()]);
  const s = (k: string, d: string) => {
    const v = settings[k];
    return v === null || v === undefined || v === '' ? d : String(v);
  };
  const siteName = s('general.site_name', 'Bodhira.ai');
  const metaTitle = seo?.meta_title || title || `${siteName} — ${s('general.tagline', 'Modern Digital Learning for Schools')}`;
  const description = seo?.meta_description || s('seo.meta_description', 'Modern digital learning for schools.');
  const og = seo?.og_image || s('general.default_og', asset('assets/img/favicon.png'));
  const robots = seo?.noindex ? 'noindex, nofollow' : s('seo.robots', 'index, follow');
  return {
    title: { absolute: metaTitle },
    description,
    keywords: seo?.meta_keywords || undefined,
    robots,
    openGraph: { title: metaTitle, description, images: [og], siteName, type: 'website', url: path },
    twitter: { card: 'summary_large_image' },
    icons: { icon: asset('assets/img/favicon.png'), shortcut: asset('assets/img/favicon.png'), apple: asset('assets/img/favicon-512.png') },
  };
}

/** date('F j, Y') (cached for an hour: prerendered pages may not read the clock directly). */
export async function todayLong() {
  'use cache';
  cacheLife('hours');
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
