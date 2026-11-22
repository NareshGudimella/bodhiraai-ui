import { mediaUrl } from "@/lib/media";
import { fmtDate, strLimit } from "@/lib/site";
import type { PostCard as Post } from "@/lib/site-api";
import { Icon } from "./icons";
import { ARTICLE_HOVER, badge } from "./kit-blog-ui";
import { cx } from "./ui";

/** Date / reading time row under a post's excerpt (was `.bpb-post__meta`); `featured` drops the rule above it. */
export function postMeta(featured?: boolean) {
  return cx(
    "flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[13.5px] font-semibold text-muted *:inline-flex *:items-center *:gap-1.5",
    featured ? "mt-0" : "mt-auto border-t border-line pt-3.5",
  );
}

/**
 * The blog / success-story card (legacy cms/blog/index and success-stories).
 *
 * The design kit's article card (not in legacy; Tailwind since the migration's
 * phase 2, was `bp-media-card bpb-post`) for a three-column grid: same
 * links, label, title, excerpt and date as legacy. The whole card is clickable
 * (the title link is stretched). `fallback` (a resolved URL, see
 * `postFallback()` in kit-blog-covers.tsx) fills the photo when the post has
 * no cover (legacy showed none).
 */
export function PostCard({
  post,
  label,
  fallback,
  headingLevel = 3,
}: {
  post: Post;
  label?: "category" | "story";
  fallback?: string;
  headingLevel?: 2 | 3;
}) {
  const cover = mediaUrl(post.cover_image_url);
  const tag = label === "story" ? "Success Story" : post.category?.name;
  const H = `h${headingLevel}` as const;
  const src = cover ?? fallback;
  return (
    <article
      className={cx(
        "group/post relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-xs",
        "transition-[transform,box-shadow] duration-300 ease-bh",
        ARTICLE_HOVER,
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-maroon",
      )}
      data-reveal
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-2 after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_50%,rgba(31,11,16,.35))]">
        {src && (
          <img
            src={src}
            alt={cover ? post.title : ""}
            width={1200}
            height={750}
            loading="lazy"
            decoding="async"
            className="block h-full w-full max-w-full object-cover transition-[scale] duration-600 ease-bh group-hover/post:scale-[1.04]"
          />
        )}
        {tag && <span className={badge("white", "absolute top-4 left-4 z-1")}>{tag}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 pt-6 pb-[22px]">
        <H className="m-0 font-sans text-[20px] leading-[1.35] font-bold tracking-[-.015em] text-ink transition-none">
          <a
            href={`/blog/${post.slug}`}
            className="text-ink transition-[color] duration-200 group-hover/post:text-maroon focus-visible:outline-0 after:absolute after:inset-0 after:z-2 after:rounded-[inherit]"
          >
            {post.title}
          </a>
        </H>
        {post.excerpt && <p className="m-0 font-sans text-[15px] leading-[1.6] font-normal text-body">{strLimit(post.excerpt, 100)}</p>}
        <div className={postMeta()}>
          <span><Icon name="calendar" size={16} className="text-gold-2" />{fmtDate(post.published_at, "d M Y")}</span>
          {label !== "story" && post.reading_minutes > 0 && <span><Icon name="clock" size={16} className="text-gold-2" />{post.reading_minutes} min read</span>}
          <span
            className="ml-auto grid! h-[34px] w-[34px] place-items-center rounded-full bg-cream text-wine transition-[background,color,translate] duration-250 ease-bh group-hover/post:bg-grad-maroon group-hover/post:text-white motion-safe:group-hover/post:translate-x-0.5"
            aria-hidden="true"
          >
            <Icon name="arrowRight" size={18} />
          </span>
        </div>
      </div>
    </article>
  );
}
