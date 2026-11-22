import type { Metadata } from "next";
import { connection } from "next/server";
import { Icon } from "@/components/site/icons";
import { postFallback } from "@/components/site/kit-blog-covers";
import { EmptyState } from "@/components/site/kit-blog-parts";
import { ARTICLE_HOVER, badge, BTN_FOCUS_DARK, FOCUS, PAGE, POST_GRID, section } from "@/components/site/kit-blog-ui";
import { CtaBand, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { PostCard, postMeta } from "@/components/site/post-card";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { SitePagination } from "@/components/site/site-pagination";
import { btn, cx } from "@/components/site/ui";
import { mediaUrl } from "@/lib/media";
import { assetResolver, fmtDate, imageResolver, settingResolver, siteMetadata, strLimit } from "@/lib/site";
import { getBlog } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/**
 * SEO (not in legacy): a category or a later page is its own URL, so it gets a
 * self-referencing canonical (`/blog?category=x&page=2`) and the category /
 * page number in front of the title and description, keeping them unique.
 */
export async function generateMetadata({ searchParams }: PageProps<"/blog">): Promise<Metadata> {
  const [setting, q] = await Promise.all([settingResolver(), searchParams]);
  const category = typeof q.category === "string" ? q.category : "";
  const page = typeof q.page === "string" && /^\d+$/.test(q.page) && Number(q.page) > 1 ? Number(q.page) : 1;
  const qs = new URLSearchParams({ ...(category ? { category } : {}), ...(page > 1 ? { page: String(page) } : {}) }).toString();
  const base = await siteMetadata("/blog", `Blog — ${setting("general.site_name", "Bodhira.ai")}`, { canonical: qs ? `/blog?${qs}` : "/blog" });
  if (!qs) return base;
  const name = category ? ((await getBlog(category, page)).categories.find((c) => c.slug === category)?.name ?? category) : "";
  const extra = [name, page > 1 ? `Page ${page}` : ""].filter(Boolean).join(" · ");
  const title = `${extra} | ${(base.title as { absolute: string }).absolute}`;
  const description = `${extra}: ${base.description ?? ""}`;
  return { ...base, title: { absolute: title }, description, openGraph: { ...base.openGraph, title, description }, twitter: { ...base.twitter, title, description } };
}

/**
 * Legacy PageController::blogIndex (cms/blog/index.blade.php), redesigned in
 * 2026 with the page design kit (not in legacy; docs/site-design-kit.md).
 * Same data (`getBlog`: ?category and ?page, featured post on the unfiltered
 * list, categories with post counts), links and copy; new layout: `PageHero`
 * with a photo, category chips, the featured post as a wide card, kit post
 * cards (`PostCard`, a fallback photo when a post has no cover),
 * kit pagination and a closing call-to-action (copy and links from /about).
 * The "Latest articles" / category-name heading over the grid is new.
 * Tailwind since the migration's phase 2 (was `.bh-page` + site-ui-blog.css).
 */
export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  await connection();
  const [img, setting] = await Promise.all([imageResolver(), settingResolver()]);
  return (
    <div className={PAGE}>
      <SeoSchema path="blog" />
      <PageHero
        eyebrow="Blog"
        title={setting("general.site_name", "Bodhira.ai")}
        highlight="Blog"
        lead="Ideas on teaching, learning and EdTech."
        breadcrumbs={[{ label: "Blog" }]}
        image={{ src: img(null, "assets/img/pages/blog/blog-hero.jpg"), alt: "A young boy smiling over his workbook under a desk lamp at home", width: 1200, height: 1000 }}
      />
      <Posts searchParams={searchParams} />
      <section className={section({ flushTop: true })} aria-label="Get started">
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

/** A category filter chip (was `bp-chip bpb-filter`, `is-active`). */
function filterChip(active: boolean) {
  return cx(
    "group/chip inline-flex items-center gap-2 rounded-full border px-[18px] py-2.5 text-[14.5px] leading-[1.2] font-semibold",
    "transition-[background,color,border-color,translate] duration-200 ease-bh hover:-translate-y-px",
    active
      ? "border-transparent bg-grad-maroon text-white shadow-[0_10px_22px_-12px_rgba(92,26,38,.7)]"
      : "border-line-2 bg-white text-maroon hover:border-maroon hover:bg-maroon hover:text-white",
    FOCUS,
  );
}
const FILTER_COUNT = "font-semibold text-muted group-hover/chip:text-[rgba(255,244,230,.8)]";

async function Posts({ searchParams }: Pick<PageProps<"/blog">, "searchParams">) {
  await connection();
  const q = await searchParams;
  const category = typeof q.category === "string" ? q.category : "";
  const page = typeof q.page === "string" && /^\d+$/.test(q.page) && Number(q.page) >= 1 ? Number(q.page) : 1;
  const [asset, { posts, featured, categories, meta }] = await Promise.all([assetResolver(), getBlog(category, page)]);
  const current = categories.find((c) => c.slug === category);
  const showFeatured = featured && !category;
  const featuredCover = featured ? mediaUrl(featured.cover_image_url) : null;
  return (
    <section className={section()} aria-labelledby="blog-posts">
      <div className="site-container">
        {categories.length > 0 && (
          <nav className="mb-12 flex justify-center max-sm:mb-8 max-sm:justify-start" aria-label="Blog categories" data-reveal>
            <ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0 max-sm:justify-start">
              <li>
                <a href="/blog" className={filterChip(!category)} aria-current={category ? undefined : "page"}>All</a>
              </li>
              {categories.map((cat) => {
                const active = category === cat.slug;
                return (
                  <li key={cat.id}>
                    <a href={`/blog?category=${encodeURIComponent(cat.slug)}`} className={filterChip(active)} aria-current={active ? "page" : undefined}>
                      {cat.name} <span className={active ? "font-semibold text-[rgba(255,244,230,.8)]" : FILTER_COUNT}>({cat.posts_count})</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {showFeatured && (
          <article
            className={cx(
              "group/feat relative mb-[88px] grid grid-cols-[1.15fr_1fr] overflow-hidden rounded-xl border border-line bg-white shadow-lg *:min-w-0",
              "transition-[transform,box-shadow] duration-300 ease-bh max-lg:mb-16 max-lg:grid-cols-1 max-sm:mb-12 max-sm:rounded-lg",
              ARTICLE_HOVER,
              "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-maroon",
            )}
            data-reveal
          >
            <div className="relative min-h-[380px] overflow-hidden bg-cream-2 max-lg:aspect-video max-lg:min-h-0">
              <img
                src={featuredCover ?? postFallback(asset, featured.id)}
                alt={featuredCover ? featured.title : ""}
                width={1200}
                height={750}
                decoding="async"
                className="absolute inset-0 block h-full w-full max-w-full object-cover transition-[scale] duration-700 ease-bh group-hover/feat:scale-[1.04]"
              />
            </div>
            <div className="flex flex-col justify-center gap-[18px] bg-white bg-[image:radial-gradient(70%_60%_at_100%_0%,rgba(226,184,115,.18),transparent_70%)] p-14 max-xl:p-11 max-lg:p-9 max-sm:gap-3.5 max-sm:px-[22px] max-sm:pt-6 max-sm:pb-[26px]">
              <div className="flex flex-wrap gap-2">
                <span className={badge("gold")}><Icon name="star" size={14} />Featured</span>
                {featured.category && <span className={badge()}>{featured.category.name}</span>}
              </div>
              <h2 className="m-0 font-sans text-[length:clamp(26px,1.4vw_+_16px,36px)] leading-[1.15] font-extrabold tracking-[-.03em] text-balance text-ink transition-none">
                <a href={`/blog/${featured.slug}`} className="text-ink group-hover/feat:text-maroon focus-visible:outline-0 after:absolute after:inset-0 after:z-2">
                  {featured.title}
                </a>
              </h2>
              {featured.excerpt && (
                <p className="m-0 font-sans text-[17px] leading-[1.65] font-normal text-body max-sm:text-[15.5px]">{strLimit(featured.excerpt, 150)}</p>
              )}
              <div className={postMeta(true)}>
                <span><Icon name="calendar" size={16} className="text-gold-2" />{fmtDate(featured.published_at, "d M Y")}</span>
                {featured.reading_minutes > 0 && <span><Icon name="clock" size={16} className="text-gold-2" />{featured.reading_minutes} min read</span>}
              </div>
              <span
                className="inline-flex items-center gap-2 text-[15px] font-bold text-maroon [&_.bh-icon]:transition-[translate] [&_.bh-icon]:duration-200 [&_.bh-icon]:ease-bh group-hover/feat:[&_.bh-icon]:translate-x-[3px]"
                aria-hidden="true"
              >
                Read article <Icon name="arrowRight" size={18} />
              </span>
            </div>
          </article>
        )}

        <SectionHead
          id="blog-posts"
          eyebrow={current ? "Category" : "Articles"}
          title={current ? current.name : "Latest"}
          highlight={current ? undefined : "articles"}
        />
        {posts.length ? (
          <div className={POST_GRID}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} fallback={postFallback(asset, post.id)} />
            ))}
          </div>
        ) : (
          <EmptyState icon="bookOpen">No articles published yet. Check back soon.</EmptyState>
        )}
        <div className="mt-14 empty:hidden max-sm:mt-10">
          <SitePagination base="/blog" params={category ? { category } : {}} page={meta.current_page} lastPage={meta.last_page} />
        </div>
      </div>
    </section>
  );
}
