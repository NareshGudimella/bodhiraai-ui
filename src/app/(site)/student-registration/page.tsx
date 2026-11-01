import type { Metadata } from "next";
import { connection } from "next/server";
import { FlashClear } from "@/components/site/flash-clear";
import { SitePageHeader } from "@/components/site/page-header";
import { SeoSchema } from "@/components/site/seo-schema";
import { siteMetadata } from "@/lib/site";
import { enquiryStore } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/student-registration", "Student Registration — Bodhira.ai");
}

/** Legacy PageController::enquiryForm (student-registration.blade.php). */
export default function StudentRegistrationPage() {
  return (
    <>
      <SeoSchema path="student-registration" />
      <SitePageHeader title="Student Registration" crumb="Student Registration" href="/student-registration" />
      <section className="contact-section pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="blog-contact-form contact-form">
                <h2 className="title mb-0">Interested in learning with Bodhira.ai?</h2>
                <p className="mb-30 mt-10">Fill in your details below and our team will get in touch to help you get started.</p>
                <WithFlash />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Status, errors and old input flashed by the last submit. */
async function WithFlash() {
  await connection();
  const flash = await getSiteFlash();
  const status = flash.messages?.status;
  const errors = Object.values(flash.errors ?? {}).flat();
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
      <EnquiryForm old={flash.old ?? {}} />
    </>
  );
}

function EnquiryForm({ old }: { old: Record<string, string> }) {
  return (
    <div className="request-form">
      <form action={enquiryStore} className="form-horizontal">
        <div className="form-group row">
          <div className="col-md-6">
            <div className="form-item">
              <input type="text" name="name" className="form-control" defaultValue={old.name} placeholder="Student Full Name *" required />
              <div className="icon"><i className="fa-regular fa-user"></i></div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-item">
              <input type="email" name="email" className="form-control" defaultValue={old.email} placeholder="Email Address *" required />
              <div className="icon"><i className="fa-sharp fa-regular fa-envelope"></i></div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-6">
            <div className="form-item">
              <input type="text" name="phone" className="form-control" defaultValue={old.phone} placeholder="Phone Number *" required />
              <div className="icon"><i className="fa-regular fa-phone"></i></div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-item">
              <input type="text" name="city" className="form-control" defaultValue={old.city} placeholder="City" />
              <div className="icon"><i className="fa-regular fa-location-dot"></i></div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-6">
            <div className="form-item">
              <select name="grade" className="select-control form-control" defaultValue={old.grade ?? ""}>
                <option value="">Select Grade / Class</option>
                {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((g) => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-item">
              <select name="board" className="select-control form-control" defaultValue={old.board ?? ""}>
                <option value="">Select Board</option>
                {["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-12">
            <div className="form-item">
              <input type="text" name="school_name" className="form-control" defaultValue={old.school_name} placeholder="Current School (optional)" />
              <div className="icon"><i className="fa-regular fa-school"></i></div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-12">
            <div className="form-item message-item">
              <textarea name="message" cols={30} rows={5} className="form-control address" placeholder="Anything you'd like us to know? (optional)" defaultValue={old.message}></textarea>
              <div className="icon"><i className="fa-light fa-messages"></i></div>
            </div>
          </div>
        </div>
        <div className="submit-btn">
          <button className="ed-primary-btn" type="submit">Submit Registration</button>
        </div>
      </form>
    </div>
  );
}
