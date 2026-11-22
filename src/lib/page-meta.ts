import type { Metadata } from 'next';
import { connection } from 'next/server';
import { absoluteUrl, publicOrigin } from './site-url';

/**
 * <head> for the indexable public pages outside the marketing layout (sign-in,
 * sign-up), which don't read Web Studio settings (SEO: not in legacy): a
 * description, an absolute canonical, Open Graph and Twitter tags with the
 * site's branded 1200×630 image. `title` goes through the dashboards' template
 * ("Log in · Bodhira"). Request time: SITE_URL is a runtime setting (the image
 * is built without it), so call it from `generateMetadata`, not a static
 * `metadata` export, or the URLs would be baked in as localhost.
 */
export async function publicPageMetadata(path: string, title: string, description: string): Promise<Metadata> {
  await connection();
  const origin = publicOrigin();
  const url = absoluteUrl(path);
  const full = `${title} · Bodhira`;
  const image = { url: absoluteUrl('/assets/img/og/bodhira-og.jpg'), width: 1200, height: 630, alt: 'Bodhira.ai — Modern Digital Learning for Schools' };
  return {
    ...(origin ? { metadataBase: new URL(origin) } : {}),
    title,
    description,
    alternates: origin ? { canonical: url } : undefined,
    openGraph: { title: full, description, url, siteName: 'Bodhira.ai', type: 'website', images: [image] },
    twitter: { card: 'summary_large_image', title: full, description, images: [image.url] },
  };
}
