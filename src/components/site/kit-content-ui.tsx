/**
 * Tailwind building blocks for the content-group marketing pages (about, pricing, features,
 * courses, course, course-details, teachers, success-stories, shop). Tailwind migration
 * phase 2, not in legacy; docs/site-design-kit.md "Tailwind". They reproduce the page-kit rules
 * these pages used from site-ui.css (`.bh-page` element defaults, `bp-section`, `bp-grid`,
 * `bp-card`, `bp-tile`, `bp-badge`, `bp-counters`, `bp-person`, `bp-media-card`, `bp-play`,
 * `bp-pagination`, …) with the same values and breakpoints. Server-safe (no hooks).
 *
 * Markup sets its own font, colour, size, line height and margins: only the base layer's
 * element defaults (site.css `p`, `h3`, `a`, `ul`) sit underneath.
 * Lists need `m-0 list-none p-0` (LIST), images `block` (`.bh-page img`).
 */
import { cx, FOCUS, focusRing, HERO_GLASS, HERO_GLASS_ROW, HERO_GLASS_STRONG, heroGlassLabel } from "./ui";

export { BTN_FOCUS, BTN_FOCUS_DARK, FOCUS, PAGE } from "./ui";

/** `.bh-page ul, ol`. */
export const LIST = "m-0 list-none p-0";

/** `.bh-page button:focus-visible`: maroon ring. */
export const FOCUS_BUTTON = focusRing;

/** `.bh-page p` without size, colour and bottom margin (callers add them). */
export const P = "mt-0 font-sans font-normal leading-[1.65]";
/** `.bh-page p` as is: 16px, body colour, 16px below. */
export const P_BODY = cx(P, "mb-4 text-base text-body");

const PY = "py-28 max-xl:py-[88px] max-lg:py-[72px] max-sm:py-16";
const PB = "pb-28 max-xl:pb-[88px] max-lg:pb-[72px] max-sm:pb-16";
const PY_TIGHT = "py-[67.2px] max-xl:py-[52.8px] max-lg:py-[43.2px] max-sm:py-[38.4px]";
const PB_TIGHT = "pb-[67.2px] max-xl:pb-[52.8px] max-lg:pb-[43.2px] max-sm:pb-[38.4px]";
/** Maroon section background (was `.bp-section--dark`). */
const DARK = "bg-[radial-gradient(60%_80%_at_100%_0%,rgba(226,184,115,.16),transparent_60%),var(--grad-maroon)] text-[rgba(255,244,230,.82)]";

/**
 * Section padding and background (was `bp-section` + `--cream` / `--dark` / `--tight` / `--flush-top`):
 * 112 → 88 → 72 → 64px (tight: 60% of that); `flushTop` drops the top padding.
 */
export function section(bg: "white" | "cream" | "dark" = "white", opts: { tight?: boolean; flushTop?: boolean } = {}) {
  const pad = opts.tight ? (opts.flushTop ? PB_TIGHT : PY_TIGHT) : opts.flushTop ? PB : PY;
  return cx("relative", pad, bg === "cream" ? "bg-cream" : bg === "dark" ? DARK : "bg-white");
}

/** `bp-grid`: 24px gaps; add one of COLS. */
export const GRID = "grid gap-6 *:min-w-0";
/** `bp-grid--2/3/4` column counts and their breakpoints (3 → 2 → 1, 4 → 2 → 1). */
export const COLS = {
  2: "grid-cols-2 max-md:grid-cols-1",
  3: "grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1",
  4: "grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1",
} as const;
/** `bp-grid--people`: fixed-width centred columns; two per row on phones, an odd last card centred. */
export const PEOPLE = cx(
  "grid-cols-[repeat(auto-fit,minmax(220px,280px))] justify-center max-sm:grid-cols-2 max-sm:gap-3",
  "max-sm:[&>:last-child:nth-child(odd)]:col-span-full max-sm:[&>:last-child:nth-child(odd)]:w-[calc(50%-6px)] max-sm:[&>:last-child:nth-child(odd)]:justify-self-center",
);

/** `bp-h3`: 22px (20px under 992px) unless `size` says otherwise; `color`, `mb`, `leading` replace ink / 8px / 1.3. */
export function h3({
  size = "text-[22px] max-lg:text-[20px]",
  color = "text-ink",
  mb = "mb-2",
  leading = "leading-[1.3]",
  extra,
}: { size?: string; color?: string; mb?: string; leading?: string; extra?: string } = {}) {
  return cx("mt-0 font-sans font-bold tracking-[-.02em] transition-none", size, color, mb, leading, extra);
}

type TileVariant = "default" | "solid" | "gold" | "white" | "light";
const TILE: Record<TileVariant, string> = {
  default: "bg-[linear-gradient(135deg,#FBEFDD,#F5E1C2)] text-wine",
  solid: "bg-grad-maroon text-white",
  gold: "bg-[linear-gradient(135deg,#F0D29C,#C49560)] text-maroon-deep",
  white: "bg-white text-wine shadow-sm",
  light: "border border-[rgba(255,255,255,.2)] bg-[rgba(255,255,255,.1)] text-gold-bright",
};
/**
 * Icon tile (was `bp-tile` + `--sm` / `--solid` / `--gold` / `--white` / `--light`).
 * `hover`: turns maroon when the surrounding `group/card` is hovered (`.bp-card--hover:hover .bp-tile`).
 */
export function tile(variant: TileVariant = "default", opts: { sm?: boolean; hover?: boolean; extra?: string } = {}) {
  return cx(
    "inline-grid flex-none place-items-center [transition:background_.25s,color_.25s]",
    opts.sm ? "h-11 w-11 rounded-sm" : "h-[52px] w-[52px] rounded-[14px]",
    TILE[variant],
    opts.hover && "group-hover/card:bg-grad-maroon group-hover/card:text-white",
    opts.extra,
  );
}

/**
 * White card (was `bp-card`, `cream`: inside a cream section, `hover`: `bp-card--hover`, which also
 * makes it a `group/card` for its tile). Its tile wants `mb-5`, its last paragraph `mb-0`.
 */
export function card({ cream, hover, extra }: { cream?: boolean; hover?: boolean; extra?: string } = {}) {
  return cx(
    "relative h-full rounded-lg border border-line bg-white p-8 max-sm:p-6",
    "[transition:transform_.3s_var(--ease-bh),box-shadow_.3s_var(--ease-bh),border-color_.3s]",
    cream ? "shadow-sm" : "shadow-xs",
    hover && "group/card hover:[transform:translateY(-4px)] hover:border-[rgba(122,36,55,.16)] hover:shadow-lg",
    extra,
  );
}

type BadgeVariant = "default" | "gold" | "maroon" | "success" | "successDark";
const BADGE: Record<BadgeVariant, string> = {
  default: "bg-cream-2 text-wine",
  gold: "bg-[linear-gradient(135deg,#F0D29C,#E2B873)] text-maroon-deep",
  maroon: "bg-maroon text-white",
  success: "bg-[#E8F6EF] text-[#0F7A4F]",
  /** `success` on a maroon card (the featured pricing plan, was `.bp-plan--featured .bp-badge--success`). */
  successDark: "bg-[rgba(255,255,255,.14)] text-[#F6EEDD]",
};
/** Small pill label (was `bp-badge` + variant). `size` replaces the 5px 12px padding and 12px text. */
export function badge(variant: BadgeVariant = "default", size = "px-3 py-[5px] text-xs", extra?: string) {
  return cx("inline-flex items-center gap-1.5 rounded-full leading-[1.3] font-bold tracking-[.02em] whitespace-nowrap", size, BADGE[variant], extra);
}

/** Text chip in a row (was `bp-chips` > `bp-chip`). */
export const CHIPS = cx(LIST, "flex flex-wrap gap-2");
export const CHIP = "inline-flex items-center gap-2 rounded-full border border-line-2 bg-white px-3.5 py-[9px] text-[14px] leading-[1.2] font-semibold text-ink [&_.bh-icon]:text-wine";

/** Frosted badge on a hero photo (was `bp-glass` with a solid tile, a figure and a label). */
export function HeroBadge({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: React.ReactNode }) {
  return (
    <span className={cx(HERO_GLASS, HERO_GLASS_ROW)}>
      <span className={tile("solid", { sm: true })}>{icon}</span>
      <span>
        <strong className={HERO_GLASS_STRONG}>{value}</strong>
        <span className={heroGlassLabel()}>{label}</span>
      </span>
    </span>
  );
}

/**
 * Maroon counter band (was `bp-counters`): icon tile, figure and label per item, dividers between,
 * 4 → 2 columns under 992px. `strong` / `label` replace the figure size and add to the label.
 */
export function Counters({
  items,
  strong = "text-[length:clamp(32px,2vw_+_16px,44px)]",
  label,
}: {
  items: { icon: React.ReactNode; value: React.ReactNode; label: React.ReactNode; key?: string }[];
  strong?: string;
  label?: string;
}) {
  return (
    <ul
      className={cx(
        LIST,
        "relative grid grid-cols-4 overflow-hidden rounded-xl px-6 py-12 shadow-lg max-lg:grid-cols-2 max-lg:gap-y-8 max-sm:rounded-lg max-sm:px-2 max-sm:py-8",
        "bg-[radial-gradient(60%_120%_at_0%_0%,rgba(226,184,115,.18),transparent_60%),var(--grad-maroon)]",
      )}
      data-reveal
    >
      {items.map((it, i) => (
        <li
          key={it.key ?? i}
          className={cx(
            "relative flex flex-col items-center px-4 py-2 text-center max-sm:p-2",
            "not-first:before:absolute not-first:before:top-[15%] not-first:before:bottom-[15%] not-first:before:left-0 not-first:before:w-px not-first:before:bg-[linear-gradient(transparent,rgba(255,255,255,.25),transparent)] not-first:before:content-['']",
            "max-lg:nth-3:before:hidden",
          )}
        >
          <span className={tile("light", { extra: "mb-4" })}>{it.icon}</span>
          <strong className={cx("leading-none font-extrabold tracking-[-.03em] text-white tabular-nums", strong)}>{it.value}</strong>
          <span className={cx("mt-2 text-[14px] font-medium text-[rgba(255,244,230,.78)]", label)}>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Lift on hover for photo cards (`transform` .3s, shadow .3s). */
const LIFT = "[transition:transform_.3s_var(--ease-bh),box-shadow_.3s_var(--ease-bh)] hover:[transform:translateY(-4px)]";
/** An image filling its box that zooms a little when the `group/media` card is hovered. */
export const COVER_IMG = "block h-full w-full max-w-full object-cover [transition:transform_.6s_var(--ease-bh)]";

/** Video / article teaser card (was `bp-media-card`): a `group/media`. */
export const MEDIA_CARD = cx("group/media flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-xs hover:shadow-lg", LIFT);
/** Its 16:10 thumbnail with a dark fade at the bottom. */
export const MEDIA_THUMB = "relative aspect-[16/10] overflow-hidden bg-cream-2 after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_50%,rgba(31,11,16,.35))] after:content-['']";
export const MEDIA_IMG = cx(COVER_IMG, "group-hover/media:scale-[1.04]");
export const MEDIA_BODY = "flex-1 p-7 max-sm:p-[22px]";

/** Person card (was `bp-person`, `__photo`, `__placeholder`, `__body`, `__name`, `__role`, `__bio`). */
export const PERSON = cx("group/person h-full overflow-hidden rounded-lg border border-line bg-white shadow-xs hover:shadow-md", LIFT);
export const PERSON_PHOTO = "aspect-[5/6] overflow-hidden bg-[linear-gradient(160deg,#F8ECDA,#EED7B3)]";
export const PERSON_IMG = cx(COVER_IMG, "group-hover/person:scale-[1.04]");
export const PERSON_BODY = "px-5 pt-[18px] pb-[22px] max-sm:p-3.5";
export const PERSON_NAME = "m-0 font-sans text-[18px] leading-[1.2] font-bold tracking-[-.01em] text-ink transition-none max-sm:text-base";
export const PERSON_ROLE = "mt-1 block text-[14px] font-semibold text-gold-text";

/** A person without a photo: initials on a soft patterned background. */
export function PersonPlaceholder({ initials }: { initials: string }) {
  return (
    <span
      className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.7),transparent_50%),repeating-linear-gradient(135deg,rgba(196,149,96,.1)_0_2px,transparent_2px_14px)]"
      aria-hidden="true"
    >
      <span className="grid h-[88px] w-[88px] place-items-center rounded-full bg-white text-[28px] font-extrabold text-wine shadow-[0_0_0_8px_rgba(255,255,255,.45),0_1px_2px_rgba(31,11,16,.04),0_12px_32px_-12px_rgba(31,11,16,.18)]">
        {initials}
      </span>
    </span>
  );
}

/**
 * Round play button over a photo (was `bp-play`; keep `video-popup` on the link for VideoPopup).
 * Centred with `translate`, so hover only scales.
 */
export const PLAY = cx(
  "absolute top-1/2 left-1/2 z-2 grid h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[rgba(255,255,255,.94)] py-0 pr-0 pl-1 text-maroon max-sm:h-16 max-sm:w-16",
  "shadow-[0_0_0_10px_rgba(255,255,255,.25),0_20px_40px_-12px_rgba(0,0,0,.5)] [transition:scale_.25s_var(--ease-bh)] hover:scale-[1.07] hover:text-maroon",
  "before:absolute before:-inset-2.5 before:animate-pulse-ring before:rounded-full before:border-2 before:border-[rgba(255,255,255,.7)] before:content-[''] motion-reduce:before:animate-none",
  FOCUS,
);

/** Pagination list and its items (was `bp-pagination`). */
export const PAGER_LIST = cx(LIST, "flex flex-wrap justify-center gap-2");
/** `link`: an `<a>` (only links change colour on hover, the current page too when it is a link). */
export function pagerItem(state: "link" | "current" | "disabled" = "link", link = state === "link") {
  return cx(
    "grid h-11 min-w-11 place-items-center rounded-full border px-3 text-[15px] font-semibold [transition:background_.2s,color_.2s,border-color_.2s]",
    state === "current" ? "border-transparent bg-grad-maroon text-white" : "border-line-2 bg-white text-ink",
    state === "disabled" && "pointer-events-none opacity-45",
    link && "hover:border-maroon hover:text-maroon",
  );
}
