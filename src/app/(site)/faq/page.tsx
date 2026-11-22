import type { Metadata } from "next";
import { connection } from "next/server";
import { Fragment } from "react";
import { Icon } from "@/components/site/icons";
import { EmptyState } from "@/components/site/kit-blog-parts";
import { BTN_FOCUS_DARK, FOCUS, HERO_GLASS, HERO_GLASS_ROW, HERO_GLASS_STRONG, heroGlassLabel, LABEL, PAGE, section, tile } from "@/components/site/kit-blog-ui";
import { CtaBand } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { btn, cx } from "@/components/site/ui";
import { imageResolver, siteMetadata } from "@/lib/site";
import { getFaqs } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/** {!! nl2br(e($text)) !!}. */
const nl2br = (text: string) => text.split(/\r\n|\n|\r/).map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>);
/** strip_tags(). */
const stripTags = (html: string) => html.replace(/<[^>]*>/g, "");

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/faq", 'FAQ · Bodhira.ai');
}

/**
 * Legacy resources/views/faq.blade.php, redesigned in 2026 with the page
 * design kit (not in legacy; docs/site-design-kit.md). Same CMS FAQs grouped
 * by category (`getFaqs`), FAQPage JSON-LD, copy, empty state and contact
 * link. New presentation: `PageHero` with a photo (the legacy "Got Questions?"
 * sub-heading is its eyebrow, the legacy section title its lead), a sticky
 * category list beside the questions (chips on phones; only with more than
 * one category, as legacy showed group titles only then), the kit accordion
 * (`<details name>`: one answer open at a time per category, as the theme's
 * `data-bs-parent` did; works without JS) and the closing "Still have a
 * question?" line as a call-to-action card.
 * Tailwind since the migration's phase 2 (was `.bh-page` + site-ui-blog.css).
 */
export default async function FaqPage() {
  await connection();
  const [img, { grouped }] = await Promise.all([imageResolver(), getFaqs()]);
  const groups = Object.entries(grouped);
  const faqs = groups.flatMap(([, items]) => items);
  const many = groups.length > 1;
  // Escape "<" so an answer can't close the script element.
  const faqLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: stripTags(f.answer) } })),
  }).replace(/</g, "\\u003c");

  return (
    <div className={PAGE}>
      <SeoSchema path="faq" />
      <PageHero
        eyebrow="Got Questions?"
        title="Frequently Asked"
        highlight="Questions"
        lead="Everything You Need to Know About Bodhira.ai"
        breadcrumbs={[{ label: "FAQ" }]}
        image={{ src: img(null, "assets/img/pages/blog/faq-hero.jpg"), alt: "A schoolgirl raising both hands among her classmates in uniform", width: 1200, height: 1000 }}
        badge={
          faqs.length > 0 ? (
            <span className={cx(HERO_GLASS, HERO_GLASS_ROW)}>
              <span className={tile("sm", true)}><Icon name="help" size={20} /></span>
              <span><strong className={HERO_GLASS_STRONG}>{faqs.length}</strong><span className={heroGlassLabel()}>{faqs.length === 1 ? "Answer" : "Answers"}</span></span>
            </span>
          ) : undefined
        }
      />

      <section className={section()} aria-label="Questions and answers">
        <div
          className={
            many
              ? "site-container grid grid-cols-[280px_minmax(0,1fr)] items-start gap-16 *:min-w-0 max-xl:grid-cols-[240px_minmax(0,1fr)] max-xl:gap-10 max-lg:grid-cols-1 max-lg:gap-8"
              : "mx-auto w-full max-w-[880px] px-6 max-sm:px-4"
          }
        >
          {many && (
            <nav
              className="sticky top-[104px] rounded-lg border border-line bg-cream px-3 pt-5 pb-3 max-lg:static max-lg:border-0 max-lg:bg-transparent max-lg:p-0"
              aria-label="FAQ categories"
              data-reveal
            >
              <p className={cx(LABEL, "mx-3 mb-2.5 max-lg:hidden")}>Categories</p>
              <ul className="m-0 grid list-none gap-1 p-0 max-lg:flex max-lg:flex-wrap max-lg:gap-2">
                {groups.map(([category, items], g) => (
                  <li key={g}>
                    <a
                      href={`#faq-group-${g}`}
                      className={cx(
                        "flex items-center justify-between gap-3 rounded-sm px-3 py-[11px] text-[15px] font-bold text-ink transition-[background,color] duration-200 hover:bg-white hover:text-maroon hover:shadow-xs",
                        "max-lg:rounded-full max-lg:border max-lg:border-line-2 max-lg:bg-white max-lg:py-2 max-lg:pr-2.5 max-lg:pl-4 max-lg:text-[14px]",
                        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon",
                      )}
                    >
                      <span>{category}</span>
                      <span className="grid h-6 min-w-7 place-items-center rounded-full border border-line-2 bg-white px-2 text-[12.5px] font-extrabold text-wine">{items.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="grid gap-14 max-sm:gap-10">
            {groups.length ? (
              groups.map(([category, items], g) => (
                <div key={g} id={`faq-group-${g}`} className="scroll-mt-[104px]">
                  {many ? (
                    <h2 className="m-0 mb-5 flex items-center gap-3.5 font-sans text-[length:clamp(22px,.8vw_+_16px,28px)] leading-[1.2] font-extrabold tracking-[-.02em] text-ink transition-none" data-reveal>
                      <span className={tile("sm")}><Icon name="help" size={20} /></span>
                      {category}
                    </h2>
                  ) : (
                    <h2 className="sr-only">{category}</h2>
                  )}
                  <div className="grid gap-3">
                    {items.map((f, idx) => (
                      <details
                        key={f.id}
                        name={`faq-group-${g}`}
                        className="group/faq rounded-md border border-line bg-white shadow-xs transition-[box-shadow,border-color] duration-250 open:border-[rgba(122,36,55,.18)] open:shadow-md"
                        data-reveal
                      >
                        <summary className={cx("flex cursor-pointer list-none items-center gap-4 rounded-md px-[22px] py-5 max-sm:gap-3 max-sm:p-4 [&::-webkit-details-marker]:hidden", FOCUS)}>
                          <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-cream text-[13px] font-extrabold text-wine group-open/faq:bg-grad-maroon group-open/faq:text-white">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 text-[17px] leading-[1.4] font-bold tracking-[-.01em] text-ink max-sm:text-[15.5px]">{f.question}</span>
                          <Icon name="chevronDown" className="text-muted transition-[rotate] duration-250 ease-bh group-open/faq:rotate-180 group-open/faq:text-wine" />
                        </summary>
                        <div className="pt-0 pr-[22px] pb-[22px] pl-[74px] max-sm:px-4 max-sm:pb-[18px]">
                          <p className="m-0 font-sans text-[15.5px] leading-[1.75] font-normal text-body">{nl2br(f.answer)}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState icon="help">FAQs will be published here shortly.</EmptyState>
            )}
          </div>
        </div>
      </section>

      <section className={section({ flushTop: true })} aria-label="Contact us">
        <div className="site-container">
          <CtaBand
            title="Still have a question?"
            text="We usually reply within one business day."
            actions={<a href="/contact" className={btn("gold", "lg", BTN_FOCUS_DARK)}>Contact Us <Icon name="arrowRight" size={18} /></a>}
          />
        </div>
      </section>

      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />}
      <RevealOnScroll />
    </div>
  );
}
