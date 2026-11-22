import { Icon, type IconName } from "./icons";
import { BTN_FOCUS, HERO_GLASS, heroGlassLabel, LABEL, PAGE, tile } from "./kit-blog-ui";
import { PageHero } from "./page-hero";
import { btn, cx } from "./ui";

/** Pages to try instead (all in the site's header and footer menus). not in legacy */
const LINKS: [string, IconName, string, string][] = [
  ["/courses", "bookOpen", "Courses", "Browse subjects and lessons"],
  ["/pricing", "layers", "Pricing", "Plans for students and schools"],
  ["/blog", "pen", "Blog", "Ideas on teaching, learning and EdTech"],
  ["/faq", "help", "FAQ", "Answers to common questions"],
  ["/contact", "mail", "Contact Us", "Talk to our team"],
];

/**
 * Legacy errors/404.blade.php, inside the site's header and footer; also the
 * page proxy.ts serves with a 404 status for a missing blog post (via
 * `/site-404`). Redesigned in 2026 with the page design kit (not in legacy;
 * docs/site-design-kit.md): same heading, text and "Back to home" link in a
 * `PageHero` with a photo; new: a "404" badge, a link to the blog and a short
 * list of pages to try instead (existing menu links).
 * Shared by the site's not-found.tsx and app/global-not-found.tsx (unknown
 * URLs; SEO: not in legacy). `imageSrc` is a resolved URL.
 * Tailwind since the migration's phase 2 (was `.bh-page` + `.bpb-nf*` in site-ui-blog.css).
 */
export function NotFoundContent({ imageSrc }: { imageSrc: string }) {
  return (
    <div className={PAGE}>
      <PageHero
        id="nf-title"
        eyebrow="Error 404"
        title="We couldn't find"
        highlight="that page"
        lead="The link you followed may be broken, or the page may have been moved."
        breadcrumbs={[{ label: "Page not found" }]}
        image={{ src: imageSrc, alt: "A young boy glancing sideways, looking for something", width: 960, height: 1200 }}
        actions={
          <>
            <a className={btn("maroon", "lg", BTN_FOCUS)} href="/"><Icon name="chevronLeft" size={18} /> Back to home</a>
            <a className={btn("ghost", "lg", BTN_FOCUS)} href="/blog">Read the blog</a>
          </>
        }
        badge={
          <span className={cx(HERO_GLASS, "flex-col items-start px-[22px] py-3.5")}>
            <strong className="block text-[38px] leading-none font-extrabold tracking-[-.04em] text-grad max-sm:text-[30px]">404</strong>
            <span className={heroGlassLabel("mt-1")}>Page not found</span>
          </span>
        }
      >
        <nav aria-label="Popular pages">
          <p className={cx(LABEL, "mb-3")}>Or try one of these</p>
          <ul className="m-0 grid max-w-[600px] list-none grid-cols-2 gap-2.5 p-0 max-md:grid-cols-1 [&>li:last-child:nth-child(odd)]:col-span-full">
            {LINKS.map(([href, icon, label, text]) => (
              <li key={href}>
                <a
                  href={href}
                  className={cx(
                    "group/nf flex h-full items-center gap-3 rounded-md border border-line bg-[rgba(255,255,255,.8)] px-3.5 py-3 text-maroon shadow-xs hover:text-wine",
                    "transition-[translate,box-shadow,border-color] duration-250 ease-bh hover:-translate-y-0.5 hover:border-[rgba(122,36,55,.16)] hover:shadow-md",
                    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon",
                  )}
                >
                  <span className={tile("sm", false, "group-hover/nf:bg-grad-maroon group-hover/nf:text-white")}><Icon name={icon} size={20} /></span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-[15px] font-bold text-ink">{label}</strong>
                    <span className="block text-[13px] leading-[1.4] text-muted">{text}</span>
                  </span>
                  <Icon name="arrowRight" size={18} className="text-muted transition-[translate,color] duration-200 ease-bh group-hover/nf:translate-x-[3px] group-hover/nf:text-maroon" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
    </div>
  );
}
