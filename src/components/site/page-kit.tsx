/**
 * Small building blocks of the marketing page design kit (not in legacy).
 * Styles: public/assets/css/site-ui.css (scoped to `.bh-page`). Usage and the
 * page skeleton: docs/site-design-kit.md. Server-safe (no hooks).
 */
import { Icon } from "./icons";

export type Crumb = { label: string; href?: string };

/** Short uppercase label above a heading. */
export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`bp-eyebrow${light ? " bp-eyebrow--light" : ""}`}>{children}</p>;
}

/** Home › … › current page. The last item is the current page (no link). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav className="bp-crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((c, i) =>
          i === trail.length - 1 ? (
            <li key={i}><span aria-current="page">{c.label}</span></li>
          ) : (
            <li key={i}><a href={c.href ?? "#"}>{c.label}</a></li>
          ),
        )}
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
  const heading = (
    <>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2 id={id} className={`bp-h2${light ? " bp-h2--light" : ""}`}>
        {title}
        {highlight && <> <span>{highlight}</span></>}
      </h2>
    </>
  );
  if (align === "split") {
    return (
      <div className="bp-head bp-head--split" data-reveal>
        <div>{heading}</div>
        <div>
          {lead && <p className="bp-lead">{lead}</p>}
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={`bp-head${align === "center" ? " bp-head--center" : ""}`} data-reveal>
      {heading}
      {lead && <p className="bp-lead">{lead}</p>}
      {children}
    </div>
  );
}

/** List with round check marks (plan features, benefits). */
export function CheckList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="bp-checks">
      {items.map((it, i) => (
        <li key={i}><Icon name="tick" size={14} />{<span>{it}</span>}</li>
      ))}
    </ul>
  );
}

/**
 * Closing call-to-action card. With `image` (a resolved URL) the photo sits
 * behind a maroon gradient; without it, a plain maroon card.
 */
export function CtaBand({ title, text, image, actions }: { title: React.ReactNode; text?: React.ReactNode; image?: string; actions: React.ReactNode }) {
  return (
    <div className={`bp-cta${image ? " bp-cta--photo" : ""} bp-on-dark`} data-reveal>
      {image && <img className="bp-cta__bg" src={image} alt="" width={1400} height={800} loading="lazy" decoding="async" />}
      <div className="bp-cta__body">
        <h2 className="bp-cta__title">{title}</h2>
        {text && <p>{text}</p>}
        <div className="bp-actions">{actions}</div>
      </div>
    </div>
  );
}
