import type { Metadata } from "next";
import { connection } from "next/server";
import { Fragment } from "react";
import { Icon } from "@/components/site/icons";
import { CtaBand } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
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
    <div className="bh-page">
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
            <span className="bp-glass">
              <span className="bp-tile bp-tile--sm bp-tile--solid"><Icon name="help" size={20} /></span>
              <span><strong>{faqs.length}</strong><span>{faqs.length === 1 ? "Answer" : "Answers"}</span></span>
            </span>
          ) : undefined
        }
      />

      <section className="bp-section bpb-faq" aria-label="Questions and answers">
        <div className={`bh-container${many ? " bpb-faq__layout" : " bpb-faq__single"}`}>
          {many && (
            <nav className="bpb-faq__nav" aria-label="FAQ categories" data-reveal>
              <p className="bpb-faq__nav-title">Categories</p>
              <ul>
                {groups.map(([category, items], g) => (
                  <li key={g}>
                    <a href={`#faq-group-${g}`}>
                      <span>{category}</span>
                      <span className="bpb-faq__count">{items.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="bpb-faq__groups">
            {groups.length ? (
              groups.map(([category, items], g) => (
                <div key={g} id={`faq-group-${g}`} className="bpb-faq__group">
                  {many ? (
                    <h2 className="bpb-faq__title" data-reveal>
                      <span className="bp-tile bp-tile--sm"><Icon name="help" size={20} /></span>
                      {category}
                    </h2>
                  ) : (
                    <h2 className="bh-sr-only">{category}</h2>
                  )}
                  <div className="bp-accordion">
                    {items.map((f, idx) => (
                      <details key={f.id} name={`faq-group-${g}`} data-reveal>
                        <summary>
                          <span className="bp-accordion__num">{String(idx + 1).padStart(2, "0")}</span>
                          <span className="bp-accordion__q">{f.question}</span>
                          <Icon name="chevronDown" className="bp-accordion__chev" />
                        </summary>
                        <div className="bp-accordion__a">
                          <p>{nl2br(f.answer)}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bpb-empty">
                <span className="bp-tile"><Icon name="help" size={24} /></span>
                <p>FAQs will be published here shortly.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bp-section bp-section--flush-top" aria-label="Contact us">
        <div className="bh-container">
          <CtaBand
            title="Still have a question?"
            text="We usually reply within one business day."
            actions={<a href="/contact" className="bh-btn bh-btn--gold bh-btn--lg">Contact Us <Icon name="arrowRight" size={18} /></a>}
          />
        </div>
      </section>

      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />}
      <RevealOnScroll />
    </div>
  );
}
