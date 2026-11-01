import type { Metadata } from "next";
import { connection } from "next/server";
import { FlashClear } from "@/components/site/flash-clear";
import { SitePageHeader } from "@/components/site/page-header";
import { SeoSchema } from "@/components/site/seo-schema";
import { siteMetadata } from "@/lib/site";
import { getSiteFlash } from "@/lib/site-flash";
import { DemoForm } from "./demo-form";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/book-demo", "Book a Demo · Bodhira.ai");
}

/** Legacy DemoController::form (book-demo.blade.php); ?as=school|student preselects the tab. */
export default function BookDemoPage({ searchParams }: PageProps<"/book-demo">) {
  return (
    <>
      <SeoSchema path="book-demo" />
      <SitePageHeader title="Book a Demo" crumb="Book a Demo" />
      <section className="contact-section pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="blog-contact-form contact-form">
                <h2 className="title mb-0">See Bodhira.ai in Action</h2>
                <p className="mb-30 mt-10">Tell us who you are and we&apos;ll set up a personalised walkthrough.</p>
                <Form searchParams={searchParams} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <style dangerouslySetInnerHTML={{ __html: `
        .bd-alert { border-radius: 12px; padding: 12px 16px; font-size: 14px; margin-bottom: 22px; display: flex; align-items: center; gap: 10px; }
        .bd-alert--ok { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
        .bd-alert--err { background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA; }
        .bd-err { color: #DC2626; font-size: 12.5px; margin-top: 6px; }

        .bd-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 26px; }
        @media (max-width: 575px) { .bd-toggle { grid-template-columns: 1fr; } }
        .bd-toggle__btn { display: flex; align-items: center; gap: 14px; text-align: left; padding: 16px 18px; border-radius: 14px;
            border: 1.5px solid #E6DED3; background: #FBF7F1; color: #5C1A26; cursor: pointer; transition: .18s; width: 100%; }
        .bd-toggle__btn:hover { border-color: #C49560; }
        .bd-toggle__btn i { font-size: 22px; width: 30px; text-align: center; color: #A87840; transition: .18s; }
        .bd-toggle__btn span { display: flex; flex-direction: column; line-height: 1.25; }
        .bd-toggle__btn strong { font-size: 15px; }
        .bd-toggle__btn small { font-size: 12px; opacity: .7; }
        .bd-toggle__btn.is-active { background: linear-gradient(135deg, #5C1A26, #2A0E13); border-color: #2A0E13; color: #fff; box-shadow: 0 12px 26px -14px rgba(92, 26, 38, .8); }
        .bd-toggle__btn.is-active i, .bd-toggle__btn.is-active small { color: #E2B873; }

        .bd-fields { display: none; }
        .bd-fields.is-active { display: block; }
        fieldset.bd-fields { border: 0; padding: 0; margin: 0; min-width: 0; }
      ` }} />
    </>
  );
}

async function Form({ searchParams }: Pick<PageProps<"/book-demo">, "searchParams">) {
  await connection();
  const [flash, q] = await Promise.all([getSiteFlash(), searchParams]);
  const as = q.as === "student" ? "student" : "school";
  const old = flash.old ?? {};
  const errors = flash.errors ?? {};
  // old('type', $preselect)
  const type = old.type === "student" || old.type === "school" ? old.type : as;
  const success = flash.messages?.demo_success;
  return (
    <>
      {(success || flash.errors) && <FlashClear />}
      {success && <div className="bd-alert bd-alert--ok"><i className="fa-solid fa-circle-check"></i> {success}</div>}
      {Object.keys(errors).length > 0 && (
        <div className="bd-alert bd-alert--err">
          <i className="fa-solid fa-triangle-exclamation"></i> Please check the highlighted fields and try again.
        </div>
      )}
      <DemoForm key={JSON.stringify(old)} initialType={type} old={old} errors={errors} />
    </>
  );
}
