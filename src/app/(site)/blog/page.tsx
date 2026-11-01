import type { Metadata } from "next";
import { connection } from "next/server";
import { PostCard } from "@/components/site/post-card";
import { SeoSchema } from "@/components/site/seo-schema";
import { SitePagination } from "@/components/site/site-pagination";
import { mediaUrl } from "@/lib/media";
import { settingResolver, siteMetadata, strLimit } from "@/lib/site";
import { getBlog } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const setting = await settingResolver();
  return siteMetadata("/blog", `Blog — ${setting("general.site_name", "Bodhira.ai")}`);
}

/** The "All" / other-category chip: legacy restyles the inactive ones white. */
const INACTIVE = "bi-chip-off";

/** Legacy PageController::blogIndex (cms/blog/index.blade.php). */
export default function BlogPage({ searchParams }: PageProps<"/blog">) {
  return (
    <>
      <SeoSchema path="blog" />
      <style dangerouslySetInnerHTML={{ __html: `.${INACTIVE}{background:#fff !important;color:#2A0E13 !important;border:1px solid #e6ded3 !important;}` }} />
      <section className="page-hero pt-100 pb-80" style={{ background: "linear-gradient(120deg,#2A0E13,#5C1A26)" }}>
        <div className="container text-center white-content">
          <h1 className="section-title" style={{ color: "#fff" }}>Blog</h1>
          <p style={{ color: "rgba(255,255,255,.8)", maxWidth: "620px", margin: "12px auto 0" }}>Ideas on teaching, learning and EdTech.</p>
        </div>
      </section>
      <section className="blog-section pt-100 pb-120">
        <div className="container">
          <Posts searchParams={searchParams} />
        </div>
      </section>
    </>
  );
}

async function Posts({ searchParams }: Pick<PageProps<"/blog">, "searchParams">) {
  await connection();
  const q = await searchParams;
  const category = typeof q.category === "string" ? q.category : "";
  const page = typeof q.page === "string" && /^\d+$/.test(q.page) && Number(q.page) >= 1 ? Number(q.page) : 1;
  const { posts, featured, categories, meta } = await getBlog(category, page);
  const cover = featured ? mediaUrl(featured.cover_image_url) : null;
  return (
    <>
      {categories.length > 0 && (
        <div className="text-center mb-50" style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/blog" className={`ed-primary-btn${category ? ` ${INACTIVE}` : ""}`} style={{ padding: "8px 20px" }}>All</a>
          {categories.map((cat) => (
            <a key={cat.id} href={`/blog?category=${encodeURIComponent(cat.slug)}`} className={`ed-primary-btn${category === cat.slug ? "" : ` ${INACTIVE}`}`} style={{ padding: "8px 20px" }}>
              {cat.name} ({cat.posts_count})
            </a>
          ))}
        </div>
      )}
      {featured && !category && (
        <a
          href={`/blog/${featured.slug}`}
          className="d-block mb-50"
          style={{
            borderRadius: "22px", overflow: "hidden", position: "relative", minHeight: "340px", background: "#2A0E13",
            ...(cover ? { backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.7),rgba(0,0,0,.2)),url('${cover}')`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
          }}
        >
          <div style={{ position: "absolute", bottom: 0, padding: "40px", color: "#fff" }}>
            <span className="ed-primary-btn" style={{ padding: "4px 14px", fontSize: "12px" }}>Featured</span>
            <h2 style={{ color: "#fff", marginTop: "16px", maxWidth: "680px" }}>{featured.title}</h2>
            <p style={{ color: "rgba(255,255,255,.85)", maxWidth: "600px" }}>{strLimit(featured.excerpt ?? "", 150)}</p>
          </div>
        </a>
      )}
      <div className="row gy-4">
        {posts.length ? posts.map((post) => <PostCard key={post.id} post={post} />) : (
          <div className="col-12 text-center pt-50 pb-50"><p style={{ color: "#9b8674" }}>No articles published yet. Check back soon.</p></div>
        )}
      </div>
      <div className="mt-50 d-flex justify-content-center">
        <SitePagination base="/blog" params={category ? { category } : {}} page={meta.current_page} lastPage={meta.last_page} />
      </div>
    </>
  );
}
