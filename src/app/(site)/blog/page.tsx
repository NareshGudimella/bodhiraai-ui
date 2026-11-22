import type { Metadata } from "next";
import { connection } from "next/server";
import { Icon } from "@/components/site/icons";
import { postFallback } from "@/components/site/kit-blog-covers";
import { CtaBand, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { SitePagination } from "@/components/site/site-pagination";
import { mediaUrl } from "@/lib/media";
import { assetResolver, fmtDate, imageResolver, settingResolver, siteMetadata, strLimit } from "@/lib/site";
import { getBlog } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const setting = await settingResolver();
  return siteMetadata("/blog", `Blog — ${setting("general.site_name", "Bodhira.ai")}`);
}

/**
 * Legacy PageController::blogIndex (cms/blog/index.blade.php), redesigned in
 * 2026 with the page design kit (not in legacy; docs/site-design-kit.md).
 * Same data (`getBlog`: ?category and ?page, featured post on the unfiltered
 * list, categories with post counts), links and copy; new layout: `PageHero`
 * with a photo, category chips, the featured post as a wide card, kit post
 * cards (`PostCard variant="kit"`, a fallback photo when a post has no cover),
 * kit pagination and a closing call-to-action (copy and links from /about).
 * The "Latest articles" / category-name heading over the grid is new.
 */
export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  await connection();
  const [img, setting] = await Promise.all([imageResolver(), settingResolver()]);
  return (
    <div className="bh-page">
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
      <section className="bp-section bp-section--flush-top" aria-label="Get started">
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
    <section className="bp-section bpb-blog" aria-labelledby="blog-posts">
      <div className="bh-container">
        {categories.length > 0 && (
          <nav className="bpb-blog__filters" aria-label="Blog categories" data-reveal>
            <ul className="bp-chips">
              <li>
                <a href="/blog" className={`bp-chip bpb-filter${category ? "" : " is-active"}`} aria-current={category ? undefined : "page"}>All</a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/blog?category=${encodeURIComponent(cat.slug)}`}
                    className={`bp-chip bpb-filter${category === cat.slug ? " is-active" : ""}`}
                    aria-current={category === cat.slug ? "page" : undefined}
                  >
                    {cat.name} <span className="bpb-filter__count">({cat.posts_count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {showFeatured && (
          <article className="bpb-featured" data-reveal>
            <div className="bpb-featured__media">
              <img
                src={featuredCover ?? postFallback(asset, featured.id)}
                alt={featuredCover ? featured.title : ""}
                width={1200}
                height={750}
                fetchPriority="high"
              />
            </div>
            <div className="bpb-featured__body">
              <div className="bpb-featured__tags">
                <span className="bp-badge bp-badge--gold"><Icon name="star" size={14} />Featured</span>
                {featured.category && <span className="bp-badge">{featured.category.name}</span>}
              </div>
              <h2 className="bpb-featured__title"><a href={`/blog/${featured.slug}`}>{featured.title}</a></h2>
              {featured.excerpt && <p className="bpb-featured__excerpt">{strLimit(featured.excerpt, 150)}</p>}
              <div className="bpb-post__meta bpb-featured__meta">
                <span><Icon name="calendar" size={16} />{fmtDate(featured.published_at, "d M Y")}</span>
                {featured.reading_minutes > 0 && <span><Icon name="clock" size={16} />{featured.reading_minutes} min read</span>}
              </div>
              <span className="bp-link bpb-featured__more" aria-hidden="true">Read article <Icon name="arrowRight" size={18} /></span>
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
          <div className="bp-grid bp-grid--3 bpb-blog__grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="kit" fallback={postFallback(asset, post.id)} />
            ))}
          </div>
        ) : (
          <div className="bpb-empty" data-reveal>
            <span className="bp-tile"><Icon name="bookOpen" size={24} /></span>
            <p>No articles published yet. Check back soon.</p>
          </div>
        )}
        <div className="bpb-blog__pages">
          <SitePagination base="/blog" params={category ? { category } : {}} page={meta.current_page} lastPage={meta.last_page} variant="kit" />
        </div>
      </div>
    </section>
  );
}
