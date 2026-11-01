"use client";

import { useState } from "react";
import { demoStore } from "@/lib/site-actions";

type Old = Record<string, string>;
const err = (errors: Record<string, string[]>, k: string) => errors[k]?.[0] && <div className="bd-err">{errors[k][0]}</div>;

/**
 * The "Book a Demo" form (legacy book-demo.blade.php): School / Student
 * toggle; only the chosen type's fields are enabled, so per-type validation
 * stays clean. Legacy did this with an inline script; here the toggle is state.
 */
export function DemoForm({ initialType, old, errors }: { initialType: "school" | "student"; old: Old; errors: Record<string, string[]> }) {
  const [type, setType] = useState(initialType);
  const label = type === "school" ? "Contact Person" : "Student / Parent Name";
  return (
    <>
      <div className="bd-toggle">
        <button type="button" className={`bd-toggle__btn${type === "school" ? " is-active" : ""}`} data-type="school" onClick={() => setType("school")}>
          <i className="fa-solid fa-school"></i>
          <span><strong>I&apos;m a School</strong><small>Institution / coaching centre</small></span>
        </button>
        <button type="button" className={`bd-toggle__btn${type === "student" ? " is-active" : ""}`} data-type="student" onClick={() => setType("student")}>
          <i className="fa-solid fa-user-graduate"></i>
          <span><strong>I&apos;m a Student / Parent</strong><small>Individual learner</small></span>
        </button>
      </div>

      <div className="request-form">
        <form action={demoStore} id="bookDemoForm" className="form-horizontal">
          <input type="hidden" name="type" id="demoType" value={type} />
          <div className="form-group row">
            <div className="col-md-6">
              <div className="form-item">
                <input type="text" name="name" className="form-control" defaultValue={old.name} placeholder={label} />
                <div className="icon"><i className="fa-regular fa-user"></i></div>
              </div>
              {err(errors, "name")}
            </div>
            <div className="col-md-6">
              <div className="form-item">
                <input type="email" name="email" className="form-control" defaultValue={old.email} placeholder="Email Address" />
                <div className="icon"><i className="fa-sharp fa-regular fa-envelope"></i></div>
              </div>
              {err(errors, "email")}
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-6">
              <div className="form-item">
                <input type="text" name="phone" className="form-control" defaultValue={old.phone} placeholder="Phone Number" />
                <div className="icon"><i className="fa-solid fa-phone"></i></div>
              </div>
              {err(errors, "phone")}
            </div>
            <div className="col-md-6">
              <div className="form-item">
                <input type="text" name="city" className="form-control" defaultValue={old.city} placeholder="City" />
                <div className="icon"><i className="fa-solid fa-location-dot"></i></div>
              </div>
            </div>
          </div>

          <fieldset className={`bd-fields${type === "school" ? " is-active" : ""}`} disabled={type !== "school"}>
            <div className="form-group row">
              <div className="col-md-12">
                <div className="form-item">
                  <input type="text" name="organization" className="form-control" defaultValue={old.organization} placeholder="School / Institution Name" />
                  <div className="icon"><i className="fa-solid fa-building-columns"></i></div>
                </div>
                {err(errors, "organization")}
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-6">
                <div className="form-item">
                  <input type="text" name="designation" className="form-control" defaultValue={old.designation} placeholder="Your Designation (e.g. Principal)" />
                  <div className="icon"><i className="fa-solid fa-id-badge"></i></div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-item">
                  <select name="student_count" className="form-control" defaultValue={old.student_count ?? ""}>
                    <option value="">Number of Students</option>
                    {["1-100", "100-500", "500-1000", "1000+"].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className={`bd-fields${type === "student" ? " is-active" : ""}`} disabled={type !== "student"}>
            <div className="form-group row">
              <div className="col-md-6">
                <div className="form-item">
                  <select name="grade" className="form-control" defaultValue={old.grade ?? ""}>
                    <option value="">Select Class / Grade</option>
                    {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                {err(errors, "grade")}
              </div>
              <div className="col-md-6">
                <div className="form-item">
                  <input type="text" name="organization" className="form-control" defaultValue={old.organization} placeholder="Current School (optional)" />
                  <div className="icon"><i className="fa-solid fa-school"></i></div>
                </div>
              </div>
            </div>
          </fieldset>

          <div className="form-group row">
            <div className="col-md-12">
              <div className="form-item">
                <select name="board" className="form-control" defaultValue={old.board ?? ""}>
                  <option value="">Board / Curriculum</option>
                  {["CBSE", "ICSE", "State Board", "IB / Cambridge", "Other"].map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-12">
              <div className="form-item message-item">
                <textarea name="message" cols={30} rows={4} className="form-control address" placeholder="Anything you'd like us to know? (optional)" defaultValue={old.message}></textarea>
                <div className="icon"><i className="fa-solid fa-comment-dots"></i></div>
              </div>
            </div>
          </div>
          <div className="submit-btn">
            <button className="ed-primary-btn" type="submit"><i className="fa-solid fa-calendar-check"></i> Request My Demo</button>
          </div>
        </form>
      </div>
    </>
  );
}
