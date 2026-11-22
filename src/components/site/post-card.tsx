import { mediaUrl } from "@/lib/media";
import { fmtDate, strLimit } from "@/lib/site";
import type { PostCard as Post } from "@/lib/site-api";
import { Icon } from "./icons";

/**
 * The blog / success-story card (legacy cms/blog/index and success-stories).
 *
 * `variant="theme"` (default) is the legacy theme card in a Bootstrap column,
 * for pages not migrated yet. `variant="kit"` is the design kit's article card
 * (`bp-media-card bpb-post`, styles in site-ui-blog.css; not in legacy) for a
 * `bp-grid` inside `.bh-page`: same links, label, title, excerpt and date. The
 * whole card is clickable (the title link is stretched). `fallback` (a resolved
 * URL, see `postFallback()` in kit-blog-covers.tsx) fills the photo when the
 * post has no cover; the theme variant ignores it, as legacy did.
 */
export function PostCard({
  post,
  label,
  variant = "theme",
  fallback,
  headingLevel = 3,
}: {
  post: Post;
  label?: "category" | "story";
  variant?: "theme" | "kit";
  fallback?: string;
  headingLevel?: 2 | 3;
}) {
  const cover = mediaUrl(post.cover_image_url);
  if (variant === "kit") {
    const tag = label === "story" ? "Success Story" : post.category?.name;
    const H = `h${headingLevel}` as const;
    const src = cover ?? fallback;
    return (
      <article className="bp-media-card bpb-post" data-reveal>
        <div className="bp-media-card__thumb bpb-post__thumb">
          {src && <img src={src} alt={cover ? post.title : ""} width={1200} height={750} loading="lazy" decoding="async" />}
          {tag && <span className="bp-badge bpb-post__tag">{tag}</span>}
        </div>
        <div className="bp-media-card__body bpb-post__body">
          <H className="bpb-post__title"><a href={`/blog/${post.slug}`}>{post.title}</a></H>
          {post.excerpt && <p className="bpb-post__excerpt">{strLimit(post.excerpt, 100)}</p>}
          <div className="bpb-post__meta">
            <span><Icon name="calendar" size={16} />{fmtDate(post.published_at, "d M Y")}</span>
            {label !== "story" && post.reading_minutes > 0 && <span><Icon name="clock" size={16} />{post.reading_minutes} min read</span>}
            <span className="bpb-post__more" aria-hidden="true"><Icon name="arrowRight" size={18} /></span>
          </div>
        </div>
      </article>
    );
  }
  return (
    <div className="col-lg-4 col-md-6">
      <article className="h-100" style={{ background: "#fff", border: "1px solid #f0e9e0", borderRadius: "18px", overflow: "hidden", boxShadow: "0 10px 30px -20px rgba(42,14,19,.25)" }}>
        <a href={`/blog/${post.slug}`} style={{ display: "block", aspectRatio: "16/10", background: "#FDF4E8", overflow: "hidden" }}>
          {cover && <img src={cover} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </a>
        <div style={{ padding: "24px" }}>
          {label === "story" ? (
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#A87840", textTransform: "uppercase", letterSpacing: ".05em" }}>Success Story</span>
          ) : (
            post.category && <span style={{ fontSize: "12px", fontWeight: 600, color: "#A87840", textTransform: "uppercase", letterSpacing: ".05em" }}>{post.category.name}</span>
          )}
          <h3 style={{ fontSize: "19px", margin: "8px 0 10px" }}><a href={`/blog/${post.slug}`} style={{ color: "#2A0E13" }}>{post.title}</a></h3>
          <p style={{ color: "#6b5847", fontSize: "14.5px" }}>{strLimit(post.excerpt ?? "", 100)}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#9b8674", fontSize: "13px", marginTop: "14px" }}>
            <i className="fa-light fa-calendar"></i>{fmtDate(post.published_at, "d M Y")}
            {label !== "story" && post.reading_minutes > 0 && <span>· {post.reading_minutes} min read</span>}
          </div>
        </div>
      </article>
    </div>
  );
}
