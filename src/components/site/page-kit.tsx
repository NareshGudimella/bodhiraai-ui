/**
 * Small building blocks of the marketing page design kit (not in legacy).
 * Tailwind since the migration's phase 1 (were `.bp-*` rules in site-ui.css); usage and the
 * page skeleton: docs/site-design-kit.md. Server-safe (no hooks).
 * Pass `light` on maroon sections.
 */
import { absoluteUrl } from "@/lib/site-url";
import { Icon } from "./icons";
import { cx, eyebrowClass, h2Class, lead } from "./ui";

export type Crumb = { label: string; href?: string };

/** Short uppercase label above a heading. */
export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={eyebrowClass(light)}>
      {children}
    </p>
  );
}

/**
 * Home › … › current page. The last item is the current page (no link).
 * Also emits the same trail as BreadcrumbList JSON-LD (SEO: not in legacy);
 * the current page has no `item` URL, which schema.org and Google allow.
 */
export function Breadcrumbs({ items, hero }: { items: Crumb[]; /** In a page hero: a pill (`center`: centred). */ hero?: "start" | "center" }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(i < trail.length - 1 && c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  }).replace(/</g, "\\u003c");
  // In a hero: 28px below (20px on phones) and a white pill.
  const pill = "inline-flex rounded-full border border-line bg-[rgba(255,255,255,.7)] px-4 py-2 shadow-xs";
  return (
    <nav
      className={cx("font-sans", hero && "mb-7 max-sm:mb-5")}
      aria-label="Breadcrumb"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
      <ol
        className={cx(
          "m-0 list-none flex-wrap items-center gap-1.5 p-0 text-[14px] font-semibold",
          hero ? pill : "flex",
          hero === "center" && "justify-center",
        )}
      >
        {trail.map((c, i) => (
          <li
            key={i}
            className="inline-flex items-center gap-1.5 text-muted not-first:before:mr-1 not-first:before:h-1.5 not-first:before:w-1.5 not-first:before:border-t-[1.5px] not-first:before:border-r-[1.5px] not-first:before:border-current not-first:before:opacity-55 not-first:before:[transform:rotate(45deg)] not-first:before:content-['']"
          >
            {i === trail.length - 1 ? (
              <span aria-current="page" className="text-wine">{c.label}</span>
            ) : (
              <a href={c.href ?? "#"} className="text-muted hover:text-maroon focus-visible:rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon">{c.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Eyebrow + h2 (+ lead) for a section. `highlight` is appended in the
 * gradient accent. `align="split"` puts the lead beside the heading on desktop.
 */
export function SectionHead({
  id,
  eyebrow,
  title,
  highlight,
  lead,
  align = "start",
  light,
  children,
}: {
  id?: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  highlight?: React.ReactNode;
  lead?: React.ReactNode;
  align?: "start" | "center" | "split";
  light?: boolean;
  children?: React.ReactNode;
}) {
  // `light`: on a dark (maroon) section.
  const heading = (
    <>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2 id={id} className={h2Class(light)}>
        {title}
        {highlight && <> <span>{highlight}</span></>}
      </h2>
    </>
  );
  const leadP = lead && (
    <p className={cx(LEAD, light ? "text-[rgba(255,244,230,.82)]" : "text-body")}>{lead}</p>
  );
  const head = "mb-12 max-sm:mb-8 [&>:last-child]:mb-0";
  if (align === "split") {
    return (
      <div className={cx(head, "grid grid-cols-[1.2fr_1fr] items-end gap-12 *:min-w-0 max-lg:grid-cols-1 max-lg:gap-2")} data-reveal>
        <div>{heading}</div>
        <div>
          {leadP}
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={cx(head, align === "center" && "mx-auto max-w-[760px] text-center")} data-reveal>
      {heading}
      {leadP}
      {children}
    </div>
  );
}

/** Lead paragraph without its colour (SectionHead adds it). */
const LEAD = lead().replace(" text-body", "");

/**
 * List with round check marks (plan features, benefits). `className` adds to the list (margins,
 * flex); `dark`: on a maroon card (the featured pricing plan): light text, gold marks.
 */
export function CheckList({
  items,
  gap = "gap-3",
  className,
  dark,
}: {
  items: React.ReactNode[];
  /** Row gap (the form pages' side cards: `gap-3.5`). */
  gap?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <ul className={cx("m-0 grid list-none p-0", gap, className)}>
      {items.map((it, i) => (
        <li key={i} className={cx("flex items-start gap-3 text-[15px] leading-[1.5]", dark ? "text-[rgba(255,244,230,.92)]" : "text-body")}>
          <Icon
            name="tick"
            size={14}
            className={cx("mt-px h-[22px] w-[22px] rounded-full p-1", dark ? "bg-[linear-gradient(135deg,#F0D29C,#C49560)] text-maroon-deep" : "bg-grad-maroon text-white")}
          />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Closing call-to-action card. With `image` (a resolved URL) the photo sits
 * behind a maroon gradient; without it, a plain maroon card with a gold glow.
 */
export function CtaBand({ title, text, image, actions }: { title: React.ReactNode; text?: React.ReactNode; image?: string; actions: React.ReactNode }) {
  return (
    <div
      className={cx(
        "relative flex min-h-[340px] items-center overflow-hidden rounded-xl bg-grad-maroon shadow-lg max-sm:min-h-0",
        image
          ? "before:absolute before:inset-0 before:z-1 before:bg-[linear-gradient(90deg,rgba(42,14,19,.96)_0%,rgba(70,18,30,.88)_42%,rgba(92,26,38,.35)_78%,rgba(92,26,38,.12)_100%)] before:content-[''] max-md:before:bg-[linear-gradient(180deg,rgba(42,14,19,.92)_0%,rgba(70,18,30,.86)_60%,rgba(92,26,38,.62))]"
          : "after:absolute after:-top-20 after:-right-20 after:h-80 after:w-80 after:rounded-full after:bg-[radial-gradient(circle,rgba(226,184,115,.28),transparent_70%)] after:content-['']",
      )}
      data-reveal
    >
      {image && <img className="absolute inset-0 block h-full w-full max-w-full object-cover object-[70%_50%]" src={image} alt="" width={1400} height={800} loading="lazy" decoding="async" />}
      <div className="relative z-2 max-w-[640px] p-14 max-md:px-7 max-md:py-10">
        <h2 className="m-0 mb-4 font-sans text-[length:clamp(28px,1.8vw_+_16px,40px)] leading-[1.12] font-extrabold tracking-[-.03em] text-balance text-white transition-none">{title}</h2>
        {text && <p className="mt-0 mb-7 font-sans text-[17px] leading-[1.65] font-normal text-[rgba(255,244,230,.84)]">{text}</p>}
        <div className="flex flex-wrap gap-3 max-sm:*:flex-[1_1_100%]">{actions}</div>
      </div>
    </div>
  );
}
