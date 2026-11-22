import { Breadcrumbs, Eyebrow, type Crumb } from "./page-kit";

export type HeroImage = { src: string; alt: string; width: number; height: number };

/**
 * Hero for redesigned marketing pages (not in legacy; replaces the theme's
 * `page-header.tsx` banner on migrated pages). Renders the page's only <h1>:
 * `title` followed by `highlight` in the gradient accent ("Plans &" +
 * "Pricing"). `breadcrumbs` lists the trail after Home; the last item is the
 * current page. With `image` the hero is two columns (copy + framed photo,
 * the photo's aspect ratio comes from its width/height); without it the copy
 * is centred. `actions` are buttons under the lead, `children` render below
 * them (chips, a stat, a toggle), `badge` floats on the photo.
 * Pass resolved URLs (asset()/img()), never raw paths.
 */
export function PageHero({
  eyebrow,
  title,
  highlight,
  lead,
  breadcrumbs,
  image,
  actions,
  badge,
  children,
  id = "bp-hero-title",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  highlight?: React.ReactNode;
  lead?: React.ReactNode;
  breadcrumbs: Crumb[];
  image?: HeroImage;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <section className={`bp-hero${image ? "" : " bp-hero--center"}`} aria-labelledby={id}>
      <div className="bh-container bp-hero__grid">
        <div className="bp-hero__copy">
          <Breadcrumbs items={breadcrumbs} />
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 id={id} className="bp-h1">
            {title}
            {highlight && <> <span>{highlight}</span></>}
          </h1>
          {lead && <p className="bp-hero__lead">{lead}</p>}
          {actions && <div className="bp-actions">{actions}</div>}
          {children && <div className="bp-hero__extra">{children}</div>}
        </div>
        {image && (
          <div className="bp-hero__visual">
            <div className="bp-hero__photo" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
              <img src={image.src} alt={image.alt} width={image.width} height={image.height} fetchPriority="high" />
            </div>
            {badge}
          </div>
        )}
      </div>
    </section>
  );
}
