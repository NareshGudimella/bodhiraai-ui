import type { Metadata } from "next";
import { connection } from "next/server";
import { FlashClear } from "@/components/site/flash-clear";
import { NiceSelectRefresh } from "@/components/site/nice-select-refresh";
import { SeoSchema } from "@/components/site/seo-schema";
import { assetResolver, siteMetadata } from "@/lib/site";
import { contactSubmit } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/contact", 'Contact Bodhira.ai · Bring It to Your School');
}

/** Legacy resources/views/contact.blade.php. */
export default async function ContactPage() {
  await connection();
  const asset = await assetResolver();
  return (
    <>
      <SeoSchema path="contact" />
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
                <h1 className="title">Contact Us</h1>
                <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="/contact"> Contact Us</a></h4>
            </div>
        </div>
    </section>
    

    <section className="contact-section pt-120 pb-120">
        <div className="container">
            <div className="row gy-lg-0 gy-5">
                <div className="col-lg-7">
                    <div className="blog-contact-form contact-form">
                        <h2 className="title mb-0">Bring Bodhira.ai to Your School</h2>
                        <p className="mb-30 mt-10">Tell us about your school. We'll set up a walkthrough and help your students get started in a week.</p>
                        <div className="request-form">
                            <ContactForm />
                        </div>
                    </div>
                </div>
                <div className="col-lg-5 col-md-12">
                    <div className="contact-content">
                        <div className="contact-top">
                            <h3 className="title">Reach Bodhira.ai</h3>
                            <p>We respond within one business day. Reach our team to set up a school demo, discuss subject plans, or onboard students.</p>
                        </div>
                        <div className="contact-list">
                            <div className="list-item">
                                <div className="icon">
                                    <i className="fa-sharp fa-solid fa-phone"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Phone Number & Email</h4>
                                    <span><a href="tel:+919985252786">+91 99852 52786</a></span>
                                    <span><a href="mailto:bodhira.ai.pvt.ltd@gmail.com">bodhira.ai.pvt.ltd@gmail.com</a></span>
                                </div>
                            </div>
                            <div className="list-item">
                                <div className="icon">
                                    <i className="fa-sharp fa-solid fa-location-dot"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Our Office Address</h4>
                                    <p>Plot No. 1438, 3rd Floor, Apuroopa Township,<br />Pragathi Nagar, Bachupally PO, Rangareddi,<br />Andhra Pradesh – 500090</p>
                                </div>
                            </div>
                            <div className="list-item">
                                <div className="icon">
                                    <i className="fa-sharp fa-solid fa-clock"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Official Work Time</h4>
                                    <span>Monday – Friday: 09:30 – 18:30</span>
                                    <span>Saturday: 10:00 – 14:00 · Sunday: Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}

const SUBJECTS = ["CBSE / ICSE School", "State Board School", "Tuition / Coaching Centre"];

/**
 * Fixed legacy bug: this form posted to /contact-submit without a CSRF token
 * (always 419) and named its first field `fullname`. It now posts through the
 * contactSubmit action like the home page's form, and the subject is saved as
 * its label (legacy's option values were 2, 3, 4).
 */
async function ContactForm() {
  const flash = await getSiteFlash();
  const status = flash.messages?.status;
  const errors = Object.values(flash.errors ?? {}).flat();
  const old = flash.old ?? {};
  return (
    <>
      {(status || errors.length > 0) && <FlashClear />}
      {status && (
        <div className="alert alert-success" style={{ background: "#e8f8ef", border: "1px solid #b6e6c9", color: "#1a7a48", padding: "14px 18px", borderRadius: "10px", marginBottom: "24px" }}>
          {status}
        </div>
      )}
      {errors.length > 0 && (
        <div className="alert alert-danger" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#c42020", padding: "14px 18px", borderRadius: "10px", marginBottom: "24px" }}>
          <ul style={{ margin: 0, paddingLeft: "18px" }}>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}
      <form action={contactSubmit} className="form-horizontal">
        <div className="form-group row">
          <div className="col-md-6">
            <div className="form-item">
              <input type="text" id="name" name="name" className="form-control" defaultValue={old.name} placeholder="Your Name" />
              <div className="icon"><i className="fa-regular fa-user"></i></div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-item">
              <input type="email" id="email" name="email" className="form-control" defaultValue={old.email} placeholder="Your Email" />
              <div className="icon"><i className="fa-sharp fa-regular fa-envelope"></i></div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-12">
            <div className="form-item">
              <select name="subject" id="subject" className="niceSelect select-control form-control" defaultValue={old.subject ?? ""}>
                <option value="">Select Subject</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-12">
            <div className="form-item message-item">
              <textarea id="message" name="message" cols={30} rows={5} className="form-control address" defaultValue={old.message} placeholder="Message"></textarea>
              <div className="icon"><i className="fa-solid fa-comment-dots"></i></div>
            </div>
          </div>
        </div>
        <div className="submit-btn">
          <button id="submit" className="ed-primary-btn" type="submit">Submit Message</button>
        </div>
      </form>
      <NiceSelectRefresh />
    </>
  );
}
