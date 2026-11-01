import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import type { PageMeta } from './admin-api';
import { proxySecretHeader } from './proxy-secret';

/**
 * Public data for the marketing site. These calls carry no session or
 * visitor headers, so they can be cached: tag `site`, refreshed every minute
 * and at once when the Web Studio saves (updateTag('site') in cms-actions).
 * That matches legacy, which cached settings until a CMS save cleared them.
 */

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';

async function get<T>(path: string): Promise<{ data: T; meta: Record<string, unknown> }> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json', ...proxySecretHeader() },
    cache: 'no-store',
  });
  const json = (await res.json().catch(() => null)) as { success: boolean; data: T; meta?: Record<string, unknown> } | null;
  if (!json?.success) throw new SiteApiError(res.status);
  return { data: json.data, meta: json.meta ?? {} };
}

export class SiteApiError extends Error {
  constructor(readonly status: number) {
    super(`Site API ${status}`);
  }
}

export type MenuLink = { id: number; label: string; url: string; target: string };
export type SocialLink = { id: number; platform: string; url: string; icon: string | null };
export type PostCard = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  reading_minutes: number;
  views: number;
  category?: { name: string; slug: string } | null;
};
export type SeoPage = {
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
  noindex: boolean;
  schema: unknown;
};
export type Chrome = {
  settings: Record<string, unknown>;
  header_menu: MenuLink[];
  footer_menu: MenuLink[];
  social: SocialLink[];
  recent_posts: PostCard[];
  seo: SeoPage | null;
  images: Record<string, string>;
};
export type Person = { id: number; name: string; role: string | null; photo_url?: string | null; avatar_url?: string | null; bio?: string | null; quote?: string; company?: string | null; rating?: number };
export type FeatureItem = { id: number; title: string; icon: string | null; description: string | null; color: string | null };
export type ServiceItem = { id: number; title: string; slug: string; icon: string | null; excerpt: string | null; image_url: string | null };

/** Layout chrome (menus, settings, social, recent posts, image overrides) and, with a path, that page's SEO record. */
export async function getChrome(path = ''): Promise<Chrome> {
  'use cache';
  cacheTag('site');
  cacheLife('minutes');
  return (await get<Chrome>(`/site/chrome?path=${encodeURIComponent(path)}`)).data;
}

export async function getCollections() {
  'use cache';
  cacheTag('site');
  cacheLife('minutes');
  return (await get<{ team: Person[]; testimonials: Person[]; features: FeatureItem[]; services: ServiceItem[] }>('/site/collections')).data;
}

export async function getFaqs() {
  'use cache';
  cacheTag('site');
  cacheLife('minutes');
  return (await get<{ grouped: Record<string, { id: number; question: string; answer: string }[]> }>('/site/faqs')).data;
}

export async function getBlog(category: string, page: number) {
  'use cache';
  cacheTag('site');
  cacheLife('minutes');
  const q = new URLSearchParams({ page: String(page), ...(category ? { category } : {}) });
  const { data, meta } = await get<{
    posts: PostCard[];
    featured: PostCard | null;
    categories: { id: number; name: string; slug: string; posts_count: number }[];
  }>(`/site/blog?${q}`);
  return { ...data, meta: meta as PageMeta };
}

export async function getSuccessStories(page: number) {
  'use cache';
  cacheTag('site');
  cacheLife('minutes');
  const { data, meta } = await get<{ category: { name: string } | null; stories: PostCard[] }>(`/site/success-stories?page=${page}`);
  return { ...data, meta: meta as PageMeta };
}

/** One post. Not cached: every read counts a view, as legacy's increment did. */
export async function getPost(slug: string) {
  if (slug === '.' || slug === '..') throw new SiteApiError(404); // security: not in legacy
  return (
    await get<{
      post: PostCard & {
        body: string | null;
        meta_title: string | null;
        meta_description: string | null;
        og_image: string | null;
        author: { name: string } | null;
        tags: { id: number; name: string; slug: string }[];
      };
      related: PostCard[];
    }>(`/site/blog/${encodeURIComponent(slug)}`)
  ).data;
}

export type PricePlan = {
  id: number;
  key: string;
  name: string;
  tagline: string | null;
  features: string[] | null;
  monthly_price: number;
  yearly_price: number;
  trial_days: number;
  is_featured: boolean;
};

/** PricingController::show: active plans by audience. */
export async function getPricing() {
  'use cache';
  cacheTag('site');
  cacheLife('minutes');
  return (await get<{ individual: PricePlan[]; school: PricePlan[] }>('/pricing')).data;
}
