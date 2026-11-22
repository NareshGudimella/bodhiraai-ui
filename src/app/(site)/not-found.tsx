import { Icon, type IconName } from "@/components/site/icons";
import { PageHero } from "@/components/site/page-hero";
import { imageResolver } from "@/lib/site";

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
 */
export default async function SiteNotFound() {
  const img = await imageResolver();
  return (
    <div className="bh-page">
      <PageHero
        id="nf-title"
        eyebrow="Error 404"
        title="We couldn't find"
        highlight="that page"
        lead="The link you followed may be broken, or the page may have been moved."
        breadcrumbs={[{ label: "Page not found" }]}
        image={{ src: img(null, "assets/img/pages/blog/not-found.jpg"), alt: "A young boy glancing sideways, looking for something", width: 960, height: 1200 }}
        actions={
          <>
            <a className="bh-btn bh-btn--maroon bh-btn--lg" href="/"><Icon name="chevronLeft" size={18} /> Back to home</a>
            <a className="bh-btn bh-btn--ghost bh-btn--lg" href="/blog">Read the blog</a>
          </>
        }
        badge={
          <span className="bp-glass bpb-nf__badge">
            <strong className="bpb-nf__code">404</strong>
            <span>Page not found</span>
          </span>
        }
      >
        <nav className="bpb-nf__links" aria-label="Popular pages">
          <p className="bpb-nf__links-title">Or try one of these</p>
          <ul>
            {LINKS.map(([href, icon, label, text]) => (
              <li key={href}>
                <a href={href}>
                  <span className="bp-tile bp-tile--sm"><Icon name={icon} size={20} /></span>
                  <span>
                    <strong>{label}</strong>
                    <span>{text}</span>
                  </span>
                  <Icon name="arrowRight" size={18} className="bpb-nf__arrow" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
    </div>
  );
}
