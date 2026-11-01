import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { Fragment } from "react";
import { assetResolver, siteMetadata } from "@/lib/site";
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

/** Legacy resources/views/faq.blade.php. */
export default async function FaqPage() {
  await connection();
  const [asset, { grouped }] = await Promise.all([assetResolver(), getFaqs()]);
  const groups = Object.entries(grouped);
  const faqs = groups.flatMap(([, items]) => items);
  // Escape "<" so an answer can't close the script element.
  const faqLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: stripTags(f.answer) } })),
  }).replace(/</g, "\\u003c");
  return (
    <>
      <SeoSchema path="faq" />
      <section className="page-header">
        <div className="bg-item">
            <div className="bg-img" data-background={asset("assets/img/bg-img/page-header-bg.png")}></div>
            <div className="overlay"></div>
            <div className="shapes">
                <div className="shape shape-1"><img src={asset("assets/img/shapes/page-header-shape-1.png")} alt="shape" /></div>
                <div className="shape shape-2"><img src={asset("assets/img/shapes/page-header-shape-2.png")} alt="shape" /></div>
                <div className="shape shape-3"><img src={asset("assets/img/shapes/page-header-shape-3.png")} alt="shape" /></div>
            </div>
        </div>
        <div className="container">
            <div className="page-header-content">
                <h1 className="title">Frequently Asked Questions</h1>
                <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="/faq"> FAQ</a></h4>
            </div>
        </div>
    </section>
    

    <section className="faq-section pt-120 pb-120">
        <div className="container">
            <div className="section-heading text-center">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Got Questions?</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Everything You Need to Know About Bodhira.ai</h2>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {groups.length ? groups.map(([category, items], g) => (
                        <div key={g} className="faq-group mt-50">
                            {groups.length > 1 && (<>
                                <h3 className="faq-group-title">{category}</h3>
                            </>)}
                            <div className="accordion" id={`faqGroup${g}`}>
                                {items.map((f, idx) => (
                                    <div key={idx} className="accordion-item wow fade-in-bottom" data-wow-delay="200ms">
                                        <h2 className="accordion-header" id={`faqHead${f.id}`}>
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#faqBody${f.id}`} aria-expanded="false" aria-controls={`faqBody${f.id}`}>{f.question}</button>
                                        </h2>
                                        <div id={`faqBody${f.id}`} className="accordion-collapse collapse" aria-labelledby={`faqHead${f.id}`} data-bs-parent={`#faqGroup${g}`}>
                                            <div className="accordion-body">{nl2br(f.answer)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : (<>
                        <p className="text-center">FAQs will be published here shortly.</p>
                    </>)}

                    <div className="text-center mt-50">
                        <p className="mb-20">Still have a question? We usually reply within one business day.</p>
                        <a href="/contact" className="ed-primary-btn">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <style dangerouslySetInnerHTML={{ __html: `
        .faq-group-title { font-family:'Poppins',sans-serif; font-size:20px; font-weight:700; color:var(--brand-maroon-dark,#3E0F16); margin-bottom:18px; padding-left:4px; }
        .faq-section .accordion-body { color:#5b4a3d; line-height:1.75; }
    ` }} />

    {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />}
    </>
  );
}
