import { connection } from "next/server";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { todayLong } from "@/lib/site";
import { Icon } from "./icons";
import { TocEnhance } from "./kit-blog-toc";
import { PageHero } from "./page-hero";
import { RevealOnScroll } from "./site-enhance";

/** The three legal pages, for the "Other policies" links (the footer links the same URLs). */
const POLICIES = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund & Cancellation Policy" },
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
 * "Last updated" date, the document in `bp-prose`, and a table of contents
 * built from the document's `<h2>`s (each gets an `id` anchor; sticky beside
 * the text on desktop, a collapsible box above it on phones; `TocEnhance`
 * highlights the section being read). Also new: links to the other two
 * policies under the contents. The document itself (`children`) is unchanged.
 */
export async function LegalPage({ heading, path, children }: { heading: string; path: string; children: ReactNode }) {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const today = await todayLong();

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
    <div className="bh-page">
      <PageHero
        eyebrow="Legal"
        title={heading}
        lead={<>Last updated: {today}</>}
        breadcrumbs={[{ label: heading }]}
      />
      <section className="bp-section bpb-legal-section" aria-label={heading}>
        <div className={`bh-container bpb-legal${toc.length ? "" : " bpb-legal--plain"}`}>
          {toc.length > 0 && (
            <aside className="bpb-legal__aside">
              <nav id="bpb-legal-toc" className="bpb-toc" aria-label="On this page">
                <details>
                  <summary>
                    <Icon name="listChecks" size={18} />
                    <span>On this page</span>
                    <Icon name="chevronDown" size={18} className="bpb-toc__chev" />
                  </summary>
                  <p className="bpb-toc__title" aria-hidden="true">On this page</p>
                  <ol>
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`}>
                          {t.num && <span className="bpb-toc__num">{t.num.padStart(2, "0")}</span>}
                          <span>{t.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              </nav>
              <TocEnhance id="bpb-legal-toc" />
              <div className="bpb-legal__others">
                <p className="bpb-legal__others-title">Other policies</p>
                <ul>
                  {others.map((p) => (
                    <li key={p.href}>
                      <a className="bp-link" href={p.href}>{p.label} <Icon name="arrowRight" size={16} /></a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
          <article className="bpb-legal__doc">
            <div className="bp-prose">{body}</div>
          </article>
        </div>
      </section>
      <RevealOnScroll />
    </div>
  );
}
