/**
 * Class strings for the blog group's pages (/blog, /blog/{slug}, /faq, the legal pages, the 404)
 * and their components (Tailwind migration phase 2, not in legacy; docs/site-design-kit.md).
 * They reproduce what the kit's `.bh-page` / `.bp-*` rules (site-ui.css) and the old
 * site-ui-blog.css computed to on these pages, so converted markup looks the same without them.
 * The prose styles for CMS HTML are the `site-prose*` utilities in app/(site)/site-blog.css.
 */
import { cx } from "./ui";

/** Shared with the other kits: page wrapper, focus rings (FOCUS also for `summary`), hero glass chip. */
export { BTN_FOCUS, BTN_FOCUS_DARK, FOCUS, HERO_GLASS, HERO_GLASS_ROW, HERO_GLASS_STRONG, heroGlassLabel, PAGE } from "./ui";

const PAD_T = "pt-28 max-xl:pt-[88px] max-lg:pt-[72px] max-sm:pt-16";
const PAD_B = "pb-28 max-xl:pb-[88px] max-lg:pb-[72px] max-sm:pb-16";

/**
 * A page section (was `.bp-section`: 112 → 88 → 72 → 64px top and bottom). `flushTop`
 * (was `--flush-top`) drops the top padding, `cream` the white background.
 */
export function section({ cream, flushTop }: { cream?: boolean; flushTop?: boolean } = {}) {
  return cx("relative", flushTop ? "pt-0" : PAD_T, PAD_B, cream ? "bg-cream" : "bg-white");
}

/**
 * The legacy theme gave every `<article>` an `!important` shadow on hover (site-layout.css;
 * `.bh-page` cancelled its lift but not the shadow, so articles showed it). Kept for parity.
 */
export const ARTICLE_HOVER = "hover:shadow-[0_26px_50px_-26px_rgba(42,14,19,.45)]";

/** Icon tile (was `.bp-tile`, `--sm` 44px, `--solid` maroon). */
export function tile(size: "md" | "sm" = "md", solid?: boolean, extra?: string) {
  return cx(
    "inline-grid flex-none place-items-center transition-[background,color] duration-250",
    size === "sm" ? "h-11 w-11 rounded-sm" : "h-[52px] w-[52px] rounded-[14px]",
    solid ? "bg-grad-maroon text-white" : "bg-[linear-gradient(135deg,#FBEFDD,#F5E1C2)] text-wine",
    extra,
  );
}

const BADGE = {
  plain: "bg-cream-2 text-wine",
  gold: "bg-[linear-gradient(135deg,#F0D29C,#E2B873)] text-maroon-deep",
  /** On a photo (the post card's category). */
  white: "bg-[rgba(255,255,255,.92)] text-wine shadow-xs",
} as const;

/** Small label (was `.bp-badge`, `gold` = `--gold`). */
export function badge(variant: keyof typeof BADGE = "plain", extra?: string) {
  return cx(
    "inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] font-sans text-[12px] leading-[1.3] font-bold tracking-[.02em] whitespace-nowrap",
    BADGE[variant],
    extra,
  );
}

/** Uppercase card / column label (`*__title` in site-ui-blog.css: 12.5px, 800, .1em). */
export const LABEL = "m-0 font-sans text-[12.5px] leading-[1.65] font-extrabold tracking-[.1em] text-muted uppercase";


/** Three-column card grid (was `bp-grid bp-grid--3`: 3 → 2 under 992px → 1 under 768px). */
export const POST_GRID = "grid grid-cols-3 gap-6 *:min-w-0 max-lg:grid-cols-2 max-md:grid-cols-1";
