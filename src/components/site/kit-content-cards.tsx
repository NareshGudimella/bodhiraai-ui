/**
 * Small server-safe pieces shared by the content-group marketing pages on the
 * page design kit (not in legacy; docs/site-design-kit.md). Styles:
 * public/assets/css/site-ui-content.css (`bpc-*`, scoped to `.bh-page`).
 * Kept apart from post-card.tsx / site-pagination.tsx, which still render the
 * theme markup for pages not migrated yet.
 */
import { mediaUrl } from "@/lib/media";
import { fmtDate, strLimit } from "@/lib/site";
import type { PostCard as Post } from "@/lib/site-api";
import { CIcon } from "./kit-content-icons";

/** Five gold stars (decorative) with an accessible label. */
export function Stars({ value = 5, label }: { value?: number; label?: string }) {
  return (
    <span className="bpc-stars" role="img" aria-label={label ?? `Rated ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <CIcon key={i} name="star" size={15} className={i < Math.round(value) ? "bh-icon--fill" : undefined} />
      ))}
    </span>
  );
}

/** Round initials avatar, or the image when one is given. */
export function Avatar({ name, src, size = 44 }: { name: string; src?: string | null; size?: number }) {
  const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  return (
    <span className="bpc-avatar" style={{ width: size, height: size }}>
      {src ? <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" /> : <span aria-hidden="true">{ini}</span>}
    </span>
  );
}

/**
 * A success story (CMS post) as a kit media card: same link (`/blog/{slug}`),
 * cover, label, title, 100-character excerpt and date as the legacy card.
 */
export function StoryCard({ post }: { post: Post }) {
  const cover = mediaUrl(post.cover_image_url);
  return (
    <li className="bp-media-card bpc-story" data-reveal>
      <a href={`/blog/${post.slug}`} className="bp-media-card__thumb bpc-story__thumb" tabIndex={-1} aria-hidden="true">
        {cover ? (
          <img src={cover} alt="" width={1200} height={750} loading="lazy" decoding="async" />
        ) : (
          <span className="bpc-story__placeholder"><CIcon name="award" size={40} /></span>
        )}
      </a>
      <div className="bp-media-card__body bpc-story__body">
        <span className="bp-badge">Success Story</span>
        <h3 className="bp-h3"><a href={`/blog/${post.slug}`}>{post.title}</a></h3>
        {post.excerpt && <p>{strLimit(post.excerpt, 100)}</p>}
        <div className="bpc-story__foot">
          {post.published_at && (
            <span className="bpc-meta"><CIcon name="calendar" size={16} />{fmtDate(post.published_at, "d M Y")}</span>
          )}
          <a href={`/blog/${post.slug}`} className="bp-link" aria-label={`Read the story: ${post.title}`}>
            Read story <CIcon name="arrowRight" size={16} />
          </a>
        </div>
      </div>
    </li>
  );
}

/**
 * `$paginator->links()` in the kit's `bp-pagination` look: same hrefs
 * (`{base}?…&page=N`), previous/next and page numbers as site-pagination.tsx.
 */
export function KitPagination({ base, params, page, lastPage }: { base: string; params: Record<string, string>; page: number; lastPage: number }) {
  if (lastPage <= 1) return null;
  const href = (p: number) => `${base}?${new URLSearchParams({ ...params, page: String(p) })}`;
  return (
    <nav className="bp-pagination" aria-label="Pagination Navigation">
      <ul>
        <li>
          {page > 1 ? (
            <a href={href(page - 1)} rel="prev" aria-label="Previous page"><CIcon name="chevronLeft" size={18} /></a>
          ) : (
            <span className="is-disabled" aria-hidden="true"><CIcon name="chevronLeft" size={18} /></span>
          )}
        </li>
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
          <li key={p}>{p === page ? <span aria-current="page">{p}</span> : <a href={href(p)}>{p}</a>}</li>
        ))}
        <li>
          {page < lastPage ? (
            <a href={href(page + 1)} rel="next" aria-label="Next page"><CIcon name="chevronRight" size={18} /></a>
          ) : (
            <span className="is-disabled" aria-hidden="true"><CIcon name="chevronRight" size={18} /></span>
          )}
        </li>
      </ul>
    </nav>
  );
}
