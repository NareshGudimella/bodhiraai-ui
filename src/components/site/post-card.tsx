import { mediaUrl } from "@/lib/media";
import { fmtDate, strLimit } from "@/lib/site";
import type { PostCard as Post } from "@/lib/site-api";

/** The blog / success-story card (legacy cms/blog/index and success-stories). */
export function PostCard({ post, label }: { post: Post; label?: "category" | "story" }) {
  const cover = mediaUrl(post.cover_image_url);
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
