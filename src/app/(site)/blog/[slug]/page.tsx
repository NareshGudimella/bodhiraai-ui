import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Icon } from "@/components/site/icons";
import { postFallback } from "@/components/site/kit-blog-covers";
import { Breadcrumbs, CtaBand, SectionHead } from "@/components/site/page-kit";
import { PostCard } from "@/components/site/post-card";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { mediaUrl } from "@/lib/media";
import { assetResolver, fmtDate, settingResolver, siteMetadata, strLimit } from "@/lib/site";
import { getChrome, getPost, SiteApiError } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/** One fetch per request: metadata and the page share it, so the view counts once. */
const loadPost = cache(async (slug: string) => {
  try {
    return await getPost(slug);
  } catch (e) {
    if (e instanceof SiteApiError && e.status === 404) notFound();
    throw e;
  }
});

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [{ post }, setting] = await Promise.all([loadPost(slug), settingResolver()]);
  const base = await siteMetadata(`/blog/${slug}`, `${post.meta_title || post.title} — ${setting("general.site_name", "Bodhira.ai")}`);
  const image = post.og_image || mediaUrl(post.cover_image_url);
  return {
    ...base,
    description: post.meta_description || post.excerpt || base.description,
    openGraph: { ...base.openGraph, ...(image ? { images: [image] } : {}) },
  };
}

/**
 * Legacy PageController::blogShow (cms/blog/show.blade.php), redesigned in
 * 2026 with the page design kit (not in legacy; docs/site-design-kit.md).
 * Same post data, JSON-LD, category link, meta (author, date, reading time),
 * CMS body (raw HTML, now styled by `bp-prose`), tags and related articles.
 * New presentation: an article header with breadcrumbs, the cover in a frame
 * (a fallback photo when the post has none), a sticky side column with the
 * article details and "Recent articles" (the layout's `recent_posts`, already
 * loaded for the footer; the current post is left out), related articles as
 * kit cards, and a closing call-to-action (copy and links from /about). A
 * missing post still gets a real 404 from proxy.ts (`/site-404`).
 */
export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  await connection();
  const { slug } = await params;
  const [{ post, related }, setting, asset, { recent_posts }] = await Promise.all([loadPost(slug), settingResolver(), assetResolver(), getChrome()]);
  const cover = mediaUrl(post.cover_image_url);
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at ? post.published_at.replace(/\.\d+Z$/, "+00:00") : null,
    author: { "@type": "Person", name: post.author?.name ?? setting("general.site_name", "Bodhira.ai") },
    image: post.cover_image_url,
  }).replace(/</g, "\\u003c");
  const recent = recent_posts.filter((r) => r.slug !== post.slug && !related.some((x) => x.id === r.id)).slice(0, 3);
  const date = fmtDate(post.published_at, "d M Y");

  return (
    <div className="bh-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />

      <section className="bp-hero bp-hero--center bpb-post-hero" aria-labelledby="post-title">
        <div className="bh-container bp-hero__grid">
          <div className="bp-hero__copy">
            <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: strLimit(post.title, 40) }]} />
            {post.category && (
              <a href={`/blog?category=${encodeURIComponent(post.category.slug)}`} className="bp-chip bpb-post-hero__cat">{post.category.name}</a>
            )}
            <h1 id="post-title" className="bp-h1 bpb-post-hero__title">{post.title}</h1>
            <ul className="bpb-post-hero__meta" aria-label="Article details">
              {post.author && (
                <li>
                  <span className="bp-avatar bpb-post-hero__avatar" aria-hidden="true">{post.author.name.trim().charAt(0).toUpperCase()}</span>
                  {post.author.name}
                </li>
              )}
              <li><Icon name="calendar" size={18} />{date}</li>
              {post.reading_minutes > 0 && <li><Icon name="clock" size={18} />{post.reading_minutes} min read</li>}
            </ul>
          </div>
        </div>
      </section>

      <section className="bp-section bpb-article-section" aria-label="Article">
        <div className="bh-container">
          <figure className="bpb-article__cover">
            <img src={cover ?? postFallback(asset, post.id)} alt={cover ? post.title : ""} width={1200} height={750} fetchPriority="high" />
          </figure>
          <div className="bpb-article">
            <article className="bpb-article__main">
              {/* CMS-authored HTML, rendered raw as in legacy ({!! $post->body !!}). */}
              <div className="bp-prose bpb-article__body" dangerouslySetInnerHTML={{ __html: post.body ?? "" }} />
              {post.tags.length > 0 && (
                <ul className="bp-chips bpb-article__tags" aria-label="Tags">
                  {post.tags.map((tag) => (
                    <li key={tag.id}><span className="bp-chip">#{tag.name}</span></li>
                  ))}
                </ul>
              )}
              <a href="/blog" className="bp-link bpb-article__back"><Icon name="chevronLeft" size={18} /> All articles</a>
            </article>
            <aside className="bpb-article__aside">
              <div className="bpb-aside-card">
                <p className="bpb-aside-card__title">About this article</p>
                <dl className="bpb-aside-facts">
                  {post.author && (<><dt><Icon name="user" size={18} />Author</dt><dd>{post.author.name}</dd></>)}
                  <dt><Icon name="calendar" size={18} />Published</dt><dd>{date}</dd>
                  {post.reading_minutes > 0 && (<><dt><Icon name="clock" size={18} />Reading time</dt><dd>{post.reading_minutes} min read</dd></>)}
                  {post.category && (
                    <><dt><Icon name="layers" size={18} />Category</dt><dd><a href={`/blog?category=${encodeURIComponent(post.category.slug)}`}>{post.category.name}</a></dd></>
                  )}
                </dl>
              </div>
              {recent.length > 0 && (
                <div className="bpb-aside-card">
                  <p className="bpb-aside-card__title">Recent articles</p>
                  <ul className="bpb-mini-posts">
                    {recent.map((r) => {
                      const thumb = mediaUrl(r.cover_image_url);
                      return (
                        <li key={r.id} className="bpb-mini-post">
                          <img src={thumb ?? postFallback(asset, r.id)} alt="" width={160} height={120} loading="lazy" decoding="async" />
                          <div>
                            <a href={`/blog/${r.slug}`}>{strLimit(r.title, 60)}</a>
                            <span>{fmtDate(r.published_at, "d M Y")}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bp-section bp-section--cream" aria-labelledby="post-related">
          <div className="bh-container">
            <SectionHead id="post-related" eyebrow="Keep reading" title="Related" highlight="articles" />
            <div className={`bp-grid ${related.length === 2 ? "bp-grid--2 bpb-related--2" : "bp-grid--3"}`}>
              {related.map((r) => (
                <PostCard key={r.id} post={r} variant="kit" fallback={postFallback(asset, r.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`bp-section${related.length ? "" : " bp-section--flush-top"}`} aria-label="Get started">
        <div className="bh-container">
          <CtaBand
            title="See Bodhira.ai in Your School"
            text="Book a walkthrough for your school, or talk to our team about getting your students, teachers and parents started."
            actions={
              <>
                <a href="/book-demo" className="bh-btn bh-btn--gold bh-btn--lg">Book a Demo <Icon name="arrowRight" size={18} /></a>
                <a href="/contact" className="bh-btn bh-btn--glass bh-btn--lg">Contact Us</a>
              </>
            }
          />
        </div>
      </section>
      <RevealOnScroll />
    </div>
  );
}
