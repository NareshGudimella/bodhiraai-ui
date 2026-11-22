/**
 * Shared Tailwind class strings for the marketing site (Tailwind migration, not in legacy;
 * docs/site-design-kit.md). They reproduce the redesign's `.bh-btn*` (site-chrome.css),
 * `.bh-eyebrow` / `.bh-h2` (home.css) and friends exactly, so converted markup looks the same.
 * Plain strings: usable from server and client components.
 *
 * Markup must not lean on the base layer's element defaults (site.css `p`, `h2`, `a`, …):
 * every class here sets its own font, colour, size, line height and margins.
 *
 * Never combine two utilities for the same property in one class list (`mb-8` and `mb-5`,
 * `text-ink` and `text-white`): Tailwind decides their order, not the string. Helpers take
 * parameters for the parts callers change; a shorthand plus a longhand (`m-0 mb-5`,
 * `px-4 pl-2`) is fine, the longhand wins.
 */

/** Join class names, skipping empty ones. */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const BTN_BASE = [
  "inline-flex items-center justify-center gap-2 rounded-full border",
  "font-sans leading-none font-semibold tracking-[-.005em] whitespace-nowrap no-underline cursor-pointer",
  "transition-[transform,translate,scale,box-shadow,background-color,color,border-color] duration-200 ease-bh",
  "hover:-translate-y-px active:translate-y-0 active:scale-[.98]",
  // the arrow icon nudges right on hover
  "[&_.bh-icon]:transition-[translate] [&_.bh-icon]:duration-200 [&_.bh-icon]:ease-bh hover:[&_.bh-icon]:translate-x-0.5",
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright",
  "motion-reduce:transition-none motion-reduce:[&_.bh-icon]:transition-none",
].join(" ");

const BTN_VARIANTS = {
  /** Primary on light backgrounds. */
  maroon:
    "border-transparent bg-grad-maroon text-white hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_8px_20px_-8px_rgba(92,26,38,.6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_14px_28px_-10px_rgba(92,26,38,.7)]",
  /** Secondary on light backgrounds. */
  ghost: "bg-white text-ink border-line-2 shadow-xs hover:text-maroon hover:border-[rgba(92,26,38,.3)]",
  /** Primary on dark (maroon) backgrounds. */
  gold:
    "border-transparent bg-grad-gold text-maroon-deep hover:text-maroon-deep shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_8px_20px_-10px_rgba(196,149,96,.9)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_14px_28px_-10px_rgba(196,149,96,1)]",
  /** Secondary on dark backgrounds. */
  glass: "bg-[rgba(255,255,255,.1)] text-white border-[rgba(255,255,255,.28)] backdrop-blur-[8px] hover:bg-[rgba(255,255,255,.18)] hover:text-white",
} as const;

export type BtnVariant = keyof typeof BTN_VARIANTS;

const BTN_SIZES = {
  md: "min-h-11 px-[22px] text-[15px]",
  lg: "min-h-[52px] px-7 text-base",
  /** No height, padding or font size: the caller sets its own (Tailwind can't override a class with a later one). */
  custom: "",
} as const;

/** Button / button-like link classes (was `bh-btn bh-btn--<variant> [bh-btn--lg]`). */
export function btn(variant: BtnVariant, size: keyof typeof BTN_SIZES = "md", extra?: string) {
  return cx(BTN_BASE, BTN_VARIANTS[variant], BTN_SIZES[size], extra);
}

/** Focus ring for links and buttons on light backgrounds (maroon), and on maroon (gold). */
export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon";
export const focusRingGold = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright";

/*
 * Type styles shared by the homepage and the page kit (they were `.bh-eyebrow` / `.bp-eyebrow`,
 * `.bh-h2` / `.bp-h2`, `.bh-lead` / `.bp-lead`, which had the same values).
 */

/** Short uppercase label above a heading, with a small gradient bar before it. `light` on maroon. */
export function eyebrowClass(light?: boolean) {
  return cx(
    "m-0 mb-4 inline-flex items-center gap-2 font-sans text-[13px] leading-none font-bold tracking-[.12em] uppercase",
    "before:h-0.5 before:w-6 before:rounded-[2px] before:content-['']",
    light ? "text-gold-bright before:bg-gold-bright" : "text-wine before:bg-[linear-gradient(90deg,#C49560,#7A2437)]",
  );
}

/** Section heading (h2); a `<span>` inside gets the gradient. `light` on maroon, `flush` without the bottom margin. */
export function h2Class(light?: boolean, flush?: boolean) {
  return cx(
    flush ? "m-0" : "m-0 mb-5",
    "font-sans text-[length:clamp(30px,2.2vw_+_18px,46px)] leading-[1.1] font-extrabold tracking-[-.03em] text-balance transition-none",
    light ? "text-ivory [&_span]:text-grad-light" : "text-ink [&_span]:text-grad",
  );
}

/** Lead paragraph under a section heading; `margin` replaces the 32px bottom margin. */
export function lead(margin = "mb-8") {
  return cx("mt-0", margin, "font-sans text-[18px] leading-[1.65] font-normal text-body max-sm:text-[16.5px]");
}

/** Text link with an arrow that nudges right on hover (was `.bh-link` / `.bp-link`; `sm` 14px). */
export function textLink(size?: "sm") {
  return cx(
    "inline-flex items-center gap-2 font-bold text-maroon hover:text-wine",
    size === "sm" ? "text-[14px]" : "text-[15px]",
    "[&_.bh-icon]:transition-[translate] [&_.bh-icon]:duration-200 [&_.bh-icon]:ease-bh hover:[&_.bh-icon]:translate-x-[3px]",
  );
}

/** Frosted chip floating on photos (was `.bh-glass`): the surface only; add display, gap, padding and position. */
export const GLASS =
  "rounded-md border border-[rgba(255,255,255,.7)] bg-[rgba(255,255,255,.78)] text-ink shadow-md [-webkit-backdrop-filter:blur(14px)_saturate(160%)] [backdrop-filter:blur(14px)_saturate(160%)]";

/** Page wrapper (was `.bh-page`): Jakarta, body colour, white, no sideways scroll, no transitions under reduced motion. */
export const PAGE = "overflow-x-clip bg-white font-sans text-body antialiased reduce-motion-tree selection:bg-maroon selection:text-white";
/** `.bh-page a:focus-visible`: maroon ring with 8px corners (buttons: `focusRing`). */
export const FOCUS = "focus-visible:rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon";
/** For `btn()` links on light backgrounds (their own ring is gold; `.bh-page a:focus-visible` made it maroon with 8px corners). */
export const BTN_FOCUS = "focus-visible:rounded-[8px] focus-visible:outline-maroon!";
/** For `btn()` links on maroon: gold ring, 8px corners. */
export const BTN_FOCUS_DARK = "focus-visible:rounded-[8px]";

/**
 * Frosted chip on a hero or side photo (was `.bp-glass`; a little more opaque than GLASS):
 * add the layout (HERO_GLASS_ROW: tile + text), then HERO_GLASS_STRONG over heroGlassLabel().
 */
export const HERO_GLASS =
  "inline-flex rounded-md border border-[rgba(255,255,255,.7)] bg-[rgba(255,255,255,.82)] text-ink shadow-md [-webkit-backdrop-filter:blur(14px)_saturate(160%)] [backdrop-filter:blur(14px)_saturate(160%)]";
export const HERO_GLASS_ROW = "items-center gap-3 py-3 pr-4 pl-3";
export const HERO_GLASS_STRONG = "block text-[20px] leading-[1.1] font-extrabold tracking-[-.02em] text-ink";
export function heroGlassLabel(margin = "mt-0.5") {
  return `${margin} block text-[12.5px] font-semibold text-muted`;
}
