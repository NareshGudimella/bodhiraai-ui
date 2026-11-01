import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { cache } from "react";
import { mediaUrl } from "@/lib/media";
import { fmtDate, settingResolver, siteMetadata, strLimit } from "@/lib/site";
import { getPost, SiteApiError } from "@/lib/site-api";

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

/** Legacy PageController::blogShow (cms/blog/show.blade.php). */
export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  await connection();
  const { slug } = await params;
  const [{ post, related }, setting] = await Promise.all([loadPost(slug), settingResolver()]);
  const cover = mediaUrl(post.cover_image_url);
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at ? post.published_at.replace(/\.\d+Z$/, "+00:00") : null,
    author: { "@type": "Person", name: post.author?.name ?? setting("general.site_name", "Bodhira.ai") },
    image: post.cover_image_url,
  }).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
      <section className="post-hero pt-100 pb-60" style={{ background: "#FBF4EA" }}>
        <div className="container">
          <div className="col-lg-8 mx-auto text-center">
            {post.category && (
              <a href={`/blog?category=${encodeURIComponent(post.category.slug)}`} className="ed-primary-btn" style={{ padding: "4px 16px", fontSize: "12px" }}>{post.category.name}</a>
            )}
            <h1 className="section-title mt-20" style={{ color: "#2A0E13" }}>{post.title}</h1>
            <div style={{ display: "flex", gap: "18px", justifyContent: "center", color: "#9b8674", fontSize: "14px", marginTop: "14px" }}>
              {post.author && <span><i className="fa-light fa-user"></i> {post.author.name}</span>}
              <span><i className="fa-light fa-calendar"></i> {fmtDate(post.published_at, "d M Y")}</span>
              {post.reading_minutes > 0 && <span><i className="fa-light fa-clock"></i> {post.reading_minutes} min read</span>}
            </div>
          </div>
        </div>
      </section>
      <article className="post-body pt-60 pb-120">
        <div className="container">
          <div className="col-lg-8 mx-auto">
            {cover && <img src={cover} alt={post.title} style={{ width: "100%", borderRadius: "18px", marginBottom: "40px" }} />}
            {/* CMS-authored HTML, rendered raw as in legacy ({!! $post->body !!}). */}
            <div className="rich-content" style={{ color: "#3a2e24", lineHeight: "1.85", fontSize: "17px" }} dangerouslySetInnerHTML={{ __html: post.body ?? "" }} />
            {post.tags.length > 0 && (
              <div className="mt-40" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <span key={tag.id} style={{ background: "#FDF4E8", color: "#A87840", padding: "6px 14px", borderRadius: "999px", fontSize: "13px" }}>#{tag.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="related-posts pb-120">
          <div className="container">
            <div className="col-lg-10 mx-auto">
              <h3 className="mb-30" style={{ color: "#2A0E13" }}>Related articles</h3>
              <div className="row gy-4">
                {related.map((r) => {
                  const img = mediaUrl(r.cover_image_url);
                  return (
                    <div key={r.id} className="col-md-4">
                      <article className="h-100" style={{ background: "#fff", border: "1px solid #f0e9e0", borderRadius: "16px", overflow: "hidden" }}>
                        <a href={`/blog/${r.slug}`} style={{ display: "block", aspectRatio: "16/10", background: "#FDF4E8", overflow: "hidden" }}>
                          {img && <img src={img} alt={r.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </a>
                        <div style={{ padding: "18px" }}>
                          <h4 style={{ fontSize: "16px" }}><a href={`/blog/${r.slug}`} style={{ color: "#2A0E13" }}>{strLimit(r.title, 50)}</a></h4>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
