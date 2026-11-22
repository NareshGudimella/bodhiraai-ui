import { connection } from "next/server";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { todayLong } from "@/lib/site";
import { Icon } from "./icons";
import { ARTICLE_HOVER, FOCUS, LABEL, PAGE, section } from "./kit-blog-ui";
import { TocEnhance } from "./kit-blog-toc";
import { PageHero } from "./page-hero";
import { RevealOnScroll } from "./site-enhance";
import { cx } from "./ui";

/** The legal pages, for the "Other policies" links (the footer links the same URLs). Cookie Policy: not in legacy. */
const POLICIES = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund & Cancellation Policy" },
  { href: "/cookies", label: "Cookie Policy" },
];

/** Plain text of a heading's children ("1. Data We Collect"). */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** "1. Data We Collect" → "data-we-collect". */
const slugOf = (text: string) =>
  text
    .toLowerCase()
    .replace(/^\s*\d+\.\s*/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Legacy legal/layout.blade.php (page header plus the document column),
 * redesigned in 2026 with the page design kit (not in legacy;
 * docs/site-design-kit.md): `PageHero` with the same heading, breadcrumb and
 * "Last updated" date, the document in `site-prose` (app/(site)/site-blog.css), and a table of contents
 * built from the document's `<h2>`s (each gets an `id` anchor; sticky beside
 * the text on desktop, a collapsible box above it on phones; `TocEnhance`
 * highlights the section being read). Also new: links to the other two
 * policies under the contents. The document itself (`children`) is unchanged.
 *
 * `updated` (not in legacy, 2026-11-22): the date the text last changed.
 * Legacy printed today's date as "Last updated", so the date moved every day
 * without the text changing; that is only the fallback now.
 *
 * Tailwind since the migration's phase 2 (was `.bh-page` + `.bpb-legal*` / `.bpb-toc*` in
 * site-ui-blog.css). A page without `<h2>`s is one 760px column at every width (the old CSS
 * gave it the two-column grid again under 1200px; no page has none).
 */
export async function LegalPage({ heading, path, updated, children }: { heading: string; path: string; updated?: string; children: ReactNode }) {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const today = updated ?? (await todayLong());

  const toc: { id: string; num: string | null; label: string }[] = [];
  const used = new Set<string>();
  const body = Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== "h2") return child;
    const h2 = child as ReactElement<{ id?: string; children?: ReactNode }>;
    const text = textOf(h2.props.children).trim();
    let id = h2.props.id ?? (slugOf(text) || `section-${toc.length + 1}`);
    while (used.has(id)) id = `${id}-${toc.length + 1}`;
    used.add(id);
    const m = /^(\d+)\.\s*(.*)$/.exec(text);
    toc.push({ id, num: m ? m[1] : null, label: m ? m[2] : text });
    return cloneElement(h2, { id });
  });
  const others = POLICIES.filter((p) => p.href !== path);

  return (
    <div className={PAGE}>
      <PageHero
        eyebrow="Legal"
        title={heading}
        lead={<>Last updated: {today}</>}
        breadcrumbs={[{ label: heading }]}
      />
      <section className={section()} aria-label={`${heading}: full text`}>
        <div
          className={cx(
            "mx-auto grid w-full items-start px-6 *:min-w-0 max-sm:px-4",
            toc.length
              ? "max-w-[1120px] grid-cols-[280px_minmax(0,1fr)] gap-[72px] max-xl:grid-cols-[250px_minmax(0,1fr)] max-xl:gap-12 max-lg:grid-cols-1 max-lg:gap-6"
              : "max-w-[760px] grid-cols-1",
          )}
        >
          {toc.length > 0 && (
            <aside className="sticky top-[104px] grid gap-5 max-lg:static">
              <nav id="bpb-legal-toc" aria-label="On this page">
                <details className="group/toc rounded-lg border border-line bg-white shadow-sm lg:details-content:[content-visibility:visible]">
                  <summary className={cx("flex cursor-pointer list-none items-center gap-2.5 rounded-lg px-5 py-4 text-[15px] font-bold text-ink lg:hidden [&::-webkit-details-marker]:hidden", FOCUS)}>
                    <Icon name="listChecks" size={18} className="text-wine" />
                    <span>On this page</span>
                    <Icon name="chevronDown" size={18} className="ml-auto text-muted transition-[rotate] duration-250 ease-bh group-open/toc:rotate-180" />
                  </summary>
                  <p className={cx(LABEL, "hidden px-[22px] pt-[22px] pb-2.5 lg:block")} aria-hidden="true">On this page</p>
                  <ol className="m-0 grid list-none gap-0.5 px-2.5 pt-0 pb-3">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className={TOC_LINK}>
                          {t.num && <span className="flex-none text-[12px] font-extrabold text-gold-text tabular-nums">{t.num.padStart(2, "0")}</span>}
                          <span>{t.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              </nav>
              <TocEnhance id="bpb-legal-toc" />
              <div className="rounded-lg border border-line bg-cream px-[22px] py-5 max-lg:hidden">
                <p className={cx(LABEL, "mb-2.5")}>Other policies</p>
                <ul className="m-0 grid list-none gap-2 p-0">
                  {others.map((p) => (
                    <li key={p.href}>
                      <a className={OTHER_LINK} href={p.href}>{p.label} <Icon name="arrowRight" size={16} /></a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
          <article
            className={cx(
              "rounded-xl border border-line bg-white px-14 py-12 shadow-sm max-xl:p-10 max-md:rounded-lg max-md:px-[22px] max-md:py-7",
              "transition-[transform,box-shadow] duration-300 ease-bh",
              ARTICLE_HOVER,
            )}
          >
            <div className="site-prose site-prose-legal">{body}</div>
          </article>
        </div>
      </section>
      <RevealOnScroll />
    </div>
  );
}

/** A contents link; `aria-current` (set by TocEnhance) marks the section being read with a bar. */
const TOC_LINK = cx(
  "relative flex items-baseline gap-2.5 rounded-[10px] px-3 py-2 text-[14.5px] leading-[1.4] font-semibold text-body transition-[background,color] duration-200",
  "hover:bg-cream hover:text-maroon [&[aria-current]]:bg-cream [&[aria-current]]:text-maroon",
  "[&[aria-current]]:before:absolute [&[aria-current]]:before:top-2 [&[aria-current]]:before:bottom-2 [&[aria-current]]:before:left-0 [&[aria-current]]:before:w-[3px] [&[aria-current]]:before:rounded-[3px] [&[aria-current]]:before:bg-grad-maroon",
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon",
);
/** "Other policies" link (was `.bp-link` at 14.5px). */
const OTHER_LINK = cx(
  "inline-flex items-center gap-2 text-[14.5px] font-bold text-maroon hover:text-wine",
  "[&_.bh-icon]:transition-[translate] [&_.bh-icon]:duration-200 [&_.bh-icon]:ease-bh hover:[&_.bh-icon]:translate-x-[3px]",
  FOCUS,
);
