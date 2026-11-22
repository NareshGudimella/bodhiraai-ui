import { Breadcrumbs, Eyebrow, type Crumb } from "./page-kit";
import { cx } from "./ui";

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
 * Tailwind since the migration's phase 1 (was `.bp-hero*` in site-ui.css). `badge` is
 * positioned here (bottom left of the photo); `actions` stretch to full width on phones.
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
  longTitle,
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
  /** A long title (a course name): a smaller h1, 30–46px instead of 36–60px. */
  longTitle?: boolean;
}) {
  const center = !image;
  return (
    <section
      className={cx(
        "relative overflow-hidden pt-14 pb-24 max-lg:pt-10 max-lg:pb-[72px] max-sm:pt-7 max-sm:pb-14",
        "bg-[radial-gradient(48%_60%_at_88%_18%,rgba(226,184,115,.28),transparent_70%),radial-gradient(40%_50%_at_8%_90%,rgba(122,36,55,.08),transparent_70%),linear-gradient(180deg,#FFFBF5_0%,#FBF6EF_100%)]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(92,26,38,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(92,26,38,.05)_1px,transparent_1px)] before:bg-[size:56px_56px] before:opacity-50 before:content-['']",
        "before:[mask-image:radial-gradient(70%_60%_at_30%_30%,#000,transparent_75%)] before:[-webkit-mask-image:radial-gradient(70%_60%_at_30%_30%,#000,transparent_75%)]",
      )}
      aria-labelledby={id}
    >
      <div
        className={cx(
          "relative grid items-center *:min-w-0",
          center ? "mx-auto w-full max-w-[820px] grid-cols-1 px-6 text-center max-sm:px-4" : "site-container grid-cols-[1.1fr_1fr] gap-16 max-xl:gap-12 max-lg:grid-cols-1",
        )}
      >
        <div>
          <Breadcrumbs items={breadcrumbs} hero={center ? "center" : "start"} />
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1
            id={id}
            className={cx(
              "m-0 mb-5 font-sans font-extrabold text-balance text-ink transition-none [&_span]:text-grad",
              longTitle ? "text-[length:clamp(30px,1.6vw_+_18px,46px)] leading-[1.1] tracking-[-.03em]" : "text-[length:clamp(36px,3.2vw_+_14px,60px)] leading-[1.05] tracking-[-.04em]",
            )}
          >
            {title}
            {highlight && <> <span>{highlight}</span></>}
          </h1>
          {lead && (
            <p className={cx("mt-0 mb-8 max-w-[560px] font-sans text-[19px] leading-[1.65] font-normal text-body max-sm:text-[16.5px]", center && "mx-auto")}>{lead}</p>
          )}
          {actions && <div className={cx("flex flex-wrap gap-3 max-sm:*:flex-[1_1_100%]", center && "justify-center")}>{actions}</div>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {image && (
          <div
            className={cx(
              "relative pt-4 pr-4 pb-8 pl-8 max-lg:mx-auto max-lg:w-full max-lg:max-w-[560px] max-sm:pt-3 max-sm:pr-2 max-sm:pb-6 max-sm:pl-4",
              "before:absolute before:inset-[0_0_12px_12px] before:rounded-[40px] before:bg-[linear-gradient(140deg,#F2D7A8,rgba(196,149,96,.35)_50%,rgba(122,36,55,.25))] before:[transform:rotate(3deg)] before:content-[''] max-sm:before:inset-[0_0_8px_6px] max-sm:before:rounded-[28px]",
              // the badge (a `.bp-glass` chip) floats on the photo's bottom left
              "[&>:not(:first-child)]:absolute [&>:not(:first-child)]:bottom-2 [&>:not(:first-child)]:left-0 [&>:not(:first-child)]:z-2",
            )}
          >
            <div className="relative max-h-[580px] w-full overflow-hidden rounded-[32px] bg-cream-2 shadow-lg max-sm:rounded-[24px]" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
              <img src={image.src} alt={image.alt} width={image.width} height={image.height} fetchPriority="high" className="block h-full w-full max-w-full object-cover object-[50%_30%]" />
            </div>
            {badge}
          </div>
        )}
      </div>
    </section>
  );
}
