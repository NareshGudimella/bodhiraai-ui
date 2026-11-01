import 'server-only';
import type { PageMeta } from './admin-api';
import { apiEnvelope } from './api';
import { load } from './load';
import { idSeg, seg } from '@/lib/api-path';

/** Field schema of a CMS collection (bodhiraai-api src/cms/cms.schema.ts). */
export type ResourceField = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'number' | 'boolean' | 'image' | 'color';
  rules: string[];
  col?: boolean;
  help?: string;
};
export type ResourceMeta = { fields: ResourceField[]; labels: [string, string]; toggleable: boolean };
export type Row = Record<string, unknown> & { id: number };

export const RESOURCE_SLUGS = ['services', 'features', 'faqs', 'testimonials', 'team', 'categories', 'social'] as const;

export type CmsPage = {
  id: number;
  slug: string;
  name: string;
  template: string;
  status: string;
  is_system: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
  schema: unknown;
  noindex: boolean;
  sort_order: number;
  sections_count?: number;
  sections?: Section[];
};
export type Section = {
  id: number;
  type: string;
  key: string | null;
  eyebrow: string | null;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  media_url: string | null;
  data: unknown;
  sort_order: number;
  is_active: boolean;
};
export type Category = { id: number; name: string; slug: string };
export type Tag = { id: number; name: string; slug: string };
export type Post = {
  id: number;
  title: string;
  slug: string;
  blog_category_id: number | null;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  status: string;
  published_at: string | null;
  is_featured: boolean;
  views: number;
  reading_minutes: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  created_at: string;
  category?: Category | null;
  author?: { id: number; name: string } | null;
  tags?: Tag[];
};
export type MenuItem = {
  id: number;
  parent_id: number | null;
  label: string;
  url: string;
  target: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  children?: MenuItem[];
};
export type Media = {
  id: number;
  media_folder_id: number | null;
  url: string;
  mime: string | null;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  title: string | null;
  original_name: string | null;
};
export type Folder = { id: number; name: string; slug: string; parent_id: number | null };
export type Lead = Record<string, string | number | null> & { id: number; status: string; created_at: string };
export type SettingField = { key: string; label: string; type: string };

const page = async <T>(path: string) => {
  const { data, meta } = await apiEnvelope<T>(path);
  return { data, meta: meta as PageMeta };
};

export const cmsApi = {
  dashboard: () =>
    load<{
      stats: { label: string; value: number; href: string }[];
      content: { label: string; value: number; href: string }[];
      recent_messages: Lead[];
      recent_posts: Post[];
    }>('/cms'),
  resource: (slug: string) => load<ResourceMeta & { rows: Row[] }>(`/cms/${seg(slug)}`),
  resourceRow: (slug: string, id: string) => load<ResourceMeta & { row: Row }>(`/cms/${seg(slug)}/${idSeg(id)}`),
  pages: () => load<CmsPage[]>('/cms/pages'),
  page: (slug: string) => load<{ page: CmsPage; section_types: Record<string, string> }>(`/cms/pages/${seg(slug)}`),
  posts: (params: URLSearchParams) => page<Post[]>(`/cms/posts?${params}`),
  post: (slug: string) => load<Post>(`/cms/posts/${seg(slug)}`),
  postOptions: () => load<{ categories: Category[]; tags: Tag[] }>('/cms/posts/options'),
  menus: (key: string) =>
    load<{ menus: { id: number; key: string; name: string }[]; active: { key: string; name: string } | null; items: MenuItem[] }>(
      `/cms/menus${key ? `?menu=${encodeURIComponent(key)}` : ''}`,
    ),
  media: (params: URLSearchParams) =>
    page<{ folders: Folder[]; active_folder: Folder | null; media: Media[] }>(`/cms/media?${params}`),
  settings: () =>
    load<{ schema: Record<string, { label: string; icon: string; fields: SettingField[] }>; values: Record<string, unknown> }>(
      '/cms/settings',
    ),
  demos: (params: URLSearchParams) =>
    page<{ demos: Lead[]; type: string; counts: { school: number; student: number } }>(`/cms/demos?${params}`),
  contacts: (params: URLSearchParams) => page<Lead[]>(`/cms/contacts?${params}`),
  subscribers: (params: URLSearchParams) => page<Lead[]>(`/cms/subscribers?${params}`),
};

export type SiteImagesData = {
  main: Record<string, { path: string; label: string }[]>;
  videos: { path: string; label: string; rec: string }[];
  overrides: Record<string, string>;
  can_browse_all: boolean;
};

export const siteImagesApi = {
  index: () => load<SiteImagesData>('/cms/images'),
};
