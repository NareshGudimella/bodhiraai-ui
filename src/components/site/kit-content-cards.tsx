/**
 * Small server-safe pieces shared by the content-group marketing pages on the
 * page design kit (not in legacy; docs/site-design-kit.md). Tailwind since the
 * migration's phase 2 (were `bpc-*` rules in site-ui-content.css); shared classes
 * in kit-content-ui.tsx. Kept apart from post-card.tsx / site-pagination.tsx.
 */
import { mediaUrl } from "@/lib/media";
import { fmtDate, strLimit } from "@/lib/site";
import type { PostCard as Post } from "@/lib/site-api";
import { CIcon } from "./kit-content-icons";
import { FOCUS, h3, MEDIA_BODY, MEDIA_CARD, MEDIA_IMG, MEDIA_THUMB, P, PAGER_LIST, badge, pagerItem } from "./kit-content-ui";
import { cx, textLink } from "./ui";

/** Five gold stars (decorative) with an accessible label. */
export function Stars({ value = 5, label }: { value?: number; label?: string }) {
  return (
    <span className="inline-flex gap-0.5 text-gold" role="img" aria-label={label ?? `Rated ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <CIcon key={i} name="star" size={15} className={cx("stroke-[1.5]", i < Math.round(value) && "fill-current")} />
      ))}
    </span>
  );
}

/** Round initials avatar, or the image when one is given. `className` adds margins, `text` replaces the 14px initials. */
export function Avatar({ name, src, size = 44, className, text = "text-[14px]" }: { name: string; src?: string | null; size?: number; className?: string; text?: string }) {
  const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  return (
    <span
      className={cx(
        "inline-grid flex-none place-items-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#F0D29C,#C49560)] font-extrabold tracking-[.02em] text-maroon-deep shadow-[0_0_0_3px_#fff,0_1px_2px_rgba(31,11,16,.05)]",
        text,
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" className="block h-full w-full max-w-full object-cover" /> : <span aria-hidden="true">{ini}</span>}
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
    <li className={MEDIA_CARD} data-reveal>
      <a
        href={`/blog/${post.slug}`}
        className={cx("block", cover ? MEDIA_THUMB : "relative aspect-[16/10] overflow-hidden bg-cream-2", FOCUS)}
        tabIndex={-1}
        aria-hidden="true"
      >
        {cover ? (
          <img src={cover} alt="" width={1200} height={750} loading="lazy" decoding="async" className={MEDIA_IMG} />
        ) : (
          <span
            className={cx(
              "relative grid h-full w-full place-items-center text-gold-bright",
              "bg-[radial-gradient(60%_80%_at_100%_0%,rgba(226,184,115,.28),transparent_60%),radial-gradient(50%_60%_at_0%_100%,rgba(226,184,115,.14),transparent_60%),var(--grad-maroon)]",
              "before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] before:bg-[size:32px_32px] before:opacity-50 before:content-['']",
            )}
          >
            <CIcon name="award" size={40} className="relative h-[72px] w-[72px] rounded-full border border-[rgba(226,184,115,.35)] bg-[rgba(255,255,255,.08)] p-4" />
          </span>
        )}
      </a>
      <div className={cx(MEDIA_BODY, "flex flex-col items-start")}>
        <span className={badge("default", undefined, "mb-3.5")}>Success Story</span>
        <h3 className={h3({ size: "text-[20px]", mb: "mb-2.5", leading: "leading-[1.35]" })}>
          <a href={`/blog/${post.slug}`} className={cx("text-ink hover:text-wine", FOCUS)}>{post.title}</a>
        </h3>
        {post.excerpt && <p className={cx(P, "mb-4 text-[15px] text-muted")}>{strLimit(post.excerpt, 100)}</p>}
        <div className="mt-auto flex w-full items-center justify-between gap-3 border-t border-line pt-4">
          {post.published_at && (
            <span className="inline-flex items-center gap-2 text-[14px] font-medium text-muted [&_.bh-icon]:text-gold-text"><CIcon name="calendar" size={16} />{fmtDate(post.published_at, "d M Y")}</span>
          )}
          <a href={`/blog/${post.slug}`} className={cx(textLink(), FOCUS)}>
            Read story<span className="sr-only">: {post.title}</span> <CIcon name="arrowRight" size={16} />
          </a>
        </div>
      </div>
    </li>
  );
}

/**
 * `$paginator->links()` in the kit's pagination look: same hrefs
 * (`{base}?…&page=N`), previous/next and page numbers as site-pagination.tsx.
 */
export function KitPagination({ base, params, page, lastPage }: { base: string; params: Record<string, string>; page: number; lastPage: number }) {
  if (lastPage <= 1) return null;
  const href = (p: number) => `${base}?${new URLSearchParams({ ...params, page: String(p) })}`;
  const link = cx(pagerItem(), FOCUS);
  return (
    <nav className="flex justify-center" aria-label="Pagination Navigation">
      <ul className={PAGER_LIST}>
        <li>
          {page > 1 ? (
            <a href={href(page - 1)} rel="prev" aria-label="Previous page" className={link}><CIcon name="chevronLeft" size={18} /></a>
          ) : (
            <span className={pagerItem("disabled")} aria-hidden="true"><CIcon name="chevronLeft" size={18} /></span>
          )}
        </li>
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
          <li key={p}>{p === page ? <span aria-current="page" className={pagerItem("current")}>{p}</span> : <a href={href(p)} className={link}>{p}</a>}</li>
        ))}
        <li>
          {page < lastPage ? (
            <a href={href(page + 1)} rel="next" aria-label="Next page" className={link}><CIcon name="chevronRight" size={18} /></a>
          ) : (
            <span className={pagerItem("disabled")} aria-hidden="true"><CIcon name="chevronRight" size={18} /></span>
          )}
        </li>
      </ul>
    </nav>
  );
}
