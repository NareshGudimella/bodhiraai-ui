import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { sitemapEnabled } from '@/lib/site';
import { getBlog, getChrome, type PostCard } from '@/lib/site-api';
import { absoluteUrl } from '@/lib/site-url';

/**
 * Public pages (SEO: not in legacy, which had a `seo.sitemap_enabled` setting
 * but no sitemap). The theme demo pages (/course, /course-details, /shop) are
 * noindex and left out, as is any page the Web Studio marks noindex.
 * `lastModified` for the static pages is the date their content last changed
 * (bump `PAGES_UPDATED` when you edit them); /blog takes its newest post.
 */
const PAGES_UPDATED = '2026-11-22';

const PAGES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/courses', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/teachers', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/success-stories', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/book-demo', priority: 0.8, changeFrequency: 'yearly' },
  { path: '/student-registration', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/register/student', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/login', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/refund', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
];

/** Built per request (the build must not need the API); the site data behind it is cached for a minute. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  if (!(await sitemapEnabled())) return [];
  const [posts, hidden] = await Promise.all([allPosts(), noindexPages()]);
  const newest = posts.map((p) => p.published_at).filter((d): d is string => !!d).sort().at(-1);
  const pages = PAGES.filter((p) => !hidden.has(p.path)).map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: new Date(p.path === '/blog' && newest ? newest : PAGES_UPDATED),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
  return [
    ...pages,
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${encodeURIComponent(p.slug)}`),
      ...(p.published_at ? { lastModified: new Date(p.published_at) } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}

/** Every published post, page by page (the API pages the blog list). */
async function allPosts(): Promise<PostCard[]> {
  try {
    const first = await getBlog('', 1);
    const last = Math.min(Number(first.meta.last_page) || 1, 50);
    const rest = await Promise.all(Array.from({ length: last - 1 }, (_, i) => getBlog('', i + 2)));
    const seen = new Set<string>();
    return [first, ...rest].flatMap((r) => r.posts).filter((p) => !seen.has(p.slug) && !!seen.add(p.slug));
  } catch {
    return [];
  }
}

/** Static pages whose Web Studio SEO record says noindex. */
async function noindexPages(): Promise<Set<string>> {
  const flags = await Promise.all(
    PAGES.map(async ({ path }) => {
      try {
        return (await getChrome(path.replace(/^\/+/, ''))).seo?.noindex ? path : null;
      } catch {
        return null;
      }
    }),
  );
  return new Set(flags.filter((p): p is string => !!p));
}
