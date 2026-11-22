import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Icon } from "@/components/site/icons";
import { postFallback } from "@/components/site/kit-blog-covers";
import { ARTICLE_HOVER, BTN_FOCUS_DARK, FOCUS, LABEL, PAGE, POST_GRID, section } from "@/components/site/kit-blog-ui";
import { Breadcrumbs, CtaBand, SectionHead } from "@/components/site/page-kit";
import { PostCard } from "@/components/site/post-card";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { btn, cx } from "@/components/site/ui";
import { mediaUrl } from "@/lib/media";
import { assetResolver, DEFAULT_OG, fmtDate, settingResolver, siteMetadata, strLimit } from "@/lib/site";
import { getChrome, getPost, SiteApiError } from "@/lib/site-api";
import { absoluteUrl } from "@/lib/site-url";

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
  // SEO (not in legacy): the post's description and cover also go to og:/twitter: tags, og:type is
  // `article`, and a post without a cover shares the site's branded image.
  const description = post.meta_description || post.excerpt || undefined;
  const base = await siteMetadata(`/blog/${slug}`, `${post.meta_title || post.title} — ${setting("general.site_name", "Bodhira.ai")}`, {
    description,
    type: "article",
    image: post.og_image || mediaUrl(post.cover_image_url),
  });
  return {
    ...base,
    description: description || base.description,
    openGraph: {
      ...base.openGraph,
      description: description || base.description || undefined,
      ...(post.published_at ? { publishedTime: post.published_at } : {}),
      ...(post.author ? { authors: [post.author.name] } : {}),
    },
    twitter: { ...base.twitter, description: description || base.description || undefined },
  };
}

/**
 * Legacy PageController::blogShow (cms/blog/show.blade.php), redesigned in
 * 2026 with the page design kit (not in legacy; docs/site-design-kit.md).
 * Same post data, JSON-LD, category link, meta (author, date, reading time),
 * CMS body (raw HTML, now styled by `site-prose`), tags and related articles.
 * New presentation: an article header with breadcrumbs, the cover in a frame
 * (a fallback photo when the post has none), a sticky side column with the
 * article details and "Recent articles" (the layout's `recent_posts`, already
 * loaded for the footer; the current post is left out), related articles as
 * kit cards, and a closing call-to-action (copy and links from /about). A
 * missing post still gets a real 404 from proxy.ts (`/site-404`).
 * Tailwind since the migration's phase 2 (was `.bh-page` + site-ui-blog.css; the
 * body's prose is `site-prose` in app/(site)/site-blog.css).
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
    // SEO (not in legacy): an absolute image URL (the site's share image without a cover), the post's URL, description and publisher (the site-wide Organization).
    image: mediaUrl(post.cover_image_url) ?? absoluteUrl(`/${DEFAULT_OG.path}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    description: post.meta_description || post.excerpt || undefined,
    publisher: { "@id": absoluteUrl("/#organization") },
  }).replace(/</g, "\\u003c");
  const recent = recent_posts.filter((r) => r.slug !== post.slug && !related.some((x) => x.id === r.id)).slice(0, 3);
  const date = fmtDate(post.published_at, "d M Y");

  return (
    <div className={PAGE}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />

      <section
        className={cx(
          "relative overflow-hidden pt-14 pb-[168px] max-lg:pt-10 max-lg:pb-[120px] max-sm:pt-7 max-sm:pb-24",
          "bg-[radial-gradient(48%_60%_at_88%_18%,rgba(226,184,115,.28),transparent_70%),radial-gradient(40%_50%_at_8%_90%,rgba(122,36,55,.08),transparent_70%),linear-gradient(180deg,#FFFBF5_0%,#FBF6EF_100%)]",
          "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(92,26,38,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(92,26,38,.05)_1px,transparent_1px)] before:bg-[size:56px_56px] before:opacity-50 before:content-['']",
          "before:[mask-image:radial-gradient(70%_60%_at_30%_30%,#000,transparent_75%)] before:[-webkit-mask-image:radial-gradient(70%_60%_at_30%_30%,#000,transparent_75%)]",
        )}
        aria-labelledby="post-title"
      >
        <div className="relative mx-auto grid w-full max-w-[900px] grid-cols-1 items-center px-6 text-center *:min-w-0 max-sm:px-4">
          <div>
            <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: strLimit(post.title, 40) }]} hero="center" />
            {post.category && (
              <a
                href={`/blog?category=${encodeURIComponent(post.category.slug)}`}
                className={cx(
                  "mb-5 inline-flex items-center gap-2 rounded-full border border-line-2 bg-white px-3.5 py-[9px] text-[13px] leading-[1.2] font-semibold tracking-[.04em] text-wine uppercase",
                  "transition-[background,color,border-color,translate] duration-200 ease-bh hover:-translate-y-px hover:border-maroon hover:bg-maroon hover:text-white",
                  FOCUS,
                )}
              >
                {post.category.name}
              </a>
            )}
            <h1 id="post-title" className="m-0 mb-6 font-sans text-[length:clamp(32px,2.4vw_+_16px,52px)] leading-[1.12] font-extrabold tracking-[-.04em] text-balance text-ink transition-none">
              {post.title}
            </h1>
            <ul
              className="m-0 flex list-none flex-wrap items-center justify-center gap-x-7 gap-y-2.5 p-0 text-[15px] font-semibold text-body *:inline-flex *:items-center *:gap-2 max-sm:gap-x-[18px] max-sm:gap-y-2 max-sm:text-[14px]"
              aria-label="Article details"
            >
              {post.author && (
                <li>
                  <span className="grid h-8 w-8 flex-none place-items-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#F0D29C,#C49560)] text-[13px] font-extrabold text-maroon-deep" aria-hidden="true">
                    {post.author.name.trim().charAt(0).toUpperCase()}
                  </span>
                  {post.author.name}
                </li>
              )}
              <li><Icon name="calendar" size={18} className="text-gold-2" />{date}</li>
              {post.reading_minutes > 0 && <li><Icon name="clock" size={18} className="text-gold-2" />{post.reading_minutes} min read</li>}
            </ul>
          </div>
        </div>
      </section>

      <section className={section({ flushTop: true })} aria-label="Article">
        <div className="site-container">
          <figure className="relative z-1 mx-auto mt-[-120px] mb-16 aspect-video max-w-[1080px] overflow-hidden rounded-xl border-[6px] border-white bg-cream-2 shadow-lg max-lg:mt-[-88px] max-lg:mb-12 max-sm:mt-[-72px] max-sm:mb-9 max-sm:rounded-lg max-sm:border-4">
            <img src={cover ?? postFallback(asset, post.id)} alt={cover ? post.title : ""} width={1200} height={750} fetchPriority="high" className="block h-full w-full max-w-full object-cover" />
          </figure>
          <div className="mx-auto grid max-w-[1080px] grid-cols-[minmax(0,1fr)_320px] items-start gap-[72px] *:min-w-0 max-xl:grid-cols-[minmax(0,1fr)_280px] max-xl:gap-12 max-lg:grid-cols-1">
            <article className={cx("transition-[transform,box-shadow] duration-300 ease-bh", ARTICLE_HOVER)}>
              {/* CMS-authored HTML, rendered raw as in legacy ({!! $post->body !!}). */}
              <div className="site-prose site-prose-article" dangerouslySetInnerHTML={{ __html: post.body ?? "" }} />
              {post.tags.length > 0 && (
                <ul className="m-0 mt-10 flex list-none flex-wrap gap-2 border-t border-line p-0 pt-7" aria-label="Tags">
                  {post.tags.map((tag) => (
                    <li key={tag.id}>
                      <span className="inline-flex items-center gap-2 rounded-full border border-transparent bg-cream px-3.5 py-[7px] text-[13.5px] leading-[1.2] font-semibold text-gold-text">#{tag.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              <a
                href="/blog"
                className={cx(
                  "mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-maroon hover:text-wine",
                  "[&_.bh-icon]:transition-[translate] [&_.bh-icon]:duration-200 [&_.bh-icon]:ease-bh hover:[&_.bh-icon]:-translate-x-[3px]",
                  FOCUS,
                )}
              >
                <Icon name="chevronLeft" size={18} /> All articles
              </a>
            </article>
            <aside className="sticky top-[104px] grid gap-5 max-lg:static max-lg:grid-cols-2 max-lg:items-start max-md:grid-cols-1">
              <div className={ASIDE_CARD}>
                <p className={cx(LABEL, "mb-4")}>About this article</p>
                <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-[14.5px]">
                  {post.author && (<><dt className={FACT_DT}><Icon name="user" size={18} className="text-gold-2" />Author</dt><dd className={FACT_DD}>{post.author.name}</dd></>)}
                  <dt className={FACT_DT}><Icon name="calendar" size={18} className="text-gold-2" />Published</dt><dd className={FACT_DD}>{date}</dd>
                  {post.reading_minutes > 0 && (<><dt className={FACT_DT}><Icon name="clock" size={18} className="text-gold-2" />Reading time</dt><dd className={FACT_DD}>{post.reading_minutes} min read</dd></>)}
                  {post.category && (
                    <>
                      <dt className={FACT_DT}><Icon name="layers" size={18} className="text-gold-2" />Category</dt>
                      <dd className={FACT_DD}>
                        <a href={`/blog?category=${encodeURIComponent(post.category.slug)}`} className={cx("text-maroon hover:text-maroon", FOCUS)}>{post.category.name}</a>
                      </dd>
                    </>
                  )}
                </dl>
              </div>
              {recent.length > 0 && (
                <div className={ASIDE_CARD}>
                  <p className={cx(LABEL, "mb-4")}>Recent articles</p>
                  <ul className="m-0 grid list-none gap-4 p-0">
                    {recent.map((r) => {
                      const thumb = mediaUrl(r.cover_image_url);
                      return (
                        <li key={r.id} className="group/mini relative grid grid-cols-[76px_1fr] items-center gap-3.5">
                          <img src={thumb ?? postFallback(asset, r.id)} alt="" width={160} height={120} loading="lazy" decoding="async" className="block h-[60px] w-[76px] max-w-full rounded-sm bg-cream-2 object-cover" />
                          <div>
                            <a href={`/blog/${r.slug}`} className={cx("block text-[14.5px] leading-[1.35] font-bold text-ink group-hover/mini:text-maroon after:absolute after:inset-0", FOCUS)}>
                              {strLimit(r.title, 60)}
                            </a>
                            <span className="mt-1 block text-[12.5px] font-semibold text-muted">{fmtDate(r.published_at, "d M Y")}</span>
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
        <section className={section({ cream: true })} aria-labelledby="post-related">
          <div className="site-container">
            <SectionHead id="post-related" eyebrow="Keep reading" title="Related" highlight="articles" />
            <div className={related.length === 2 ? "grid max-w-[840px] grid-cols-2 gap-6 *:min-w-0 max-md:grid-cols-1" : POST_GRID}>
              {related.map((r) => (
                <PostCard key={r.id} post={r} fallback={postFallback(asset, r.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={section({ flushTop: !related.length })} aria-label="Get started">
        <div className="site-container">
          <CtaBand
            title="See Bodhira.ai in Your School"
            text="Book a walkthrough for your school, or talk to our team about getting your students, teachers and parents started."
            actions={
              <>
                <a href="/book-demo" className={btn("gold", "lg", BTN_FOCUS_DARK)}>Book a Demo <Icon name="arrowRight" size={18} /></a>
                <a href="/contact" className={btn("glass", "lg", BTN_FOCUS_DARK)}>Contact Us</a>
              </>
            }
          />
        </div>
      </section>
      <RevealOnScroll />
    </div>
  );
}

/** Side column card (was `.bpb-aside-card`) and its facts list (`.bpb-aside-facts dt / dd`). */
const ASIDE_CARD = "rounded-lg border border-line bg-white p-6 shadow-sm";
const FACT_DT = "inline-flex items-center gap-2 font-medium whitespace-nowrap text-muted";
const FACT_DD = "m-0 text-right font-bold text-ink";
