"use client";

import { useState } from "react";
import { Icon } from "@/components/site/icons";
import { KfInput, KfRequiredNote, KfSelect, KfTextarea, type FieldErrors } from "@/components/site/kit-forms-fields";
import { demoStore } from "@/lib/site-actions";

type Old = Record<string, string>;

const COUNTS = ["1-100", "100-500", "500-1000", "1000+"];
const GRADES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const BOARDS = ["CBSE", "ICSE", "State Board", "IB / Cambridge", "Other"];

/**
 * The "Book a Demo" form (legacy book-demo.blade.php): School / Student
 * toggle; only the chosen type's fields are enabled, so per-type validation
 * stays clean. Legacy did this with an inline script; here the toggle is state.
 * Same action, field names, option values and hidden `type` input as before;
 * the 2026 redesign (not in legacy) adds labels, hints and per-field errors
 * (aria-describedby / aria-invalid), and the toggle buttons report
 * `aria-pressed`.
 */
export function DemoForm({ initialType, old, errors }: { initialType: "school" | "student"; old: Old; errors: FieldErrors }) {
  const [type, setType] = useState(initialType);
  const school = type === "school";
  const e = (k: string) => errors[k]?.[0];
  return (
    <>
      <fieldset className="kf-type">
        <legend>I&apos;m booking for</legend>
        <button type="button" aria-pressed={school} data-type="school" onClick={() => setType("school")}>
          <span className="bp-tile bp-tile--sm"><Icon name="school" size={22} /></span>
          <span className="kf-type__text"><strong>I&apos;m a School</strong><small>Institution / coaching centre</small></span>
          <span className="kf-type__check" aria-hidden="true"><Icon name="tick" size={12} /></span>
        </button>
        <button type="button" aria-pressed={!school} data-type="student" onClick={() => setType("student")}>
          <span className="bp-tile bp-tile--sm"><Icon name="cap" size={22} /></span>
          <span className="kf-type__text"><strong>I&apos;m a Student / Parent</strong><small>Individual learner</small></span>
          <span className="kf-type__check" aria-hidden="true"><Icon name="tick" size={12} /></span>
        </button>
      </fieldset>

      <form action={demoStore} id="bookDemoForm" className="bp-form kf-form">
        <input type="hidden" name="type" id="demoType" value={type} />
        <div className="bp-form__row">
          <KfInput id="demo-name" name="name" type="text" label={school ? "Contact Person" : "Student / Parent Name"} req icon="user" autoComplete="name" defaultValue={old.name} placeholder={school ? "e.g. Anita Rao" : "e.g. Rahul Verma"} error={e("name")} />
          <KfInput id="demo-email" name="email" type="email" label="Email Address" req icon="mail" autoComplete="email" inputMode="email" defaultValue={old.email} placeholder="you@example.com" error={e("email")} />
        </div>
        <div className="bp-form__row">
          <KfInput id="demo-phone" name="phone" type="text" label="Phone Number" req icon="phone" autoComplete="tel" inputMode="tel" defaultValue={old.phone} placeholder="+91 98765 43210" error={e("phone")} />
          <KfInput id="demo-city" name="city" type="text" label="City" icon="mapPin" autoComplete="address-level2" defaultValue={old.city} placeholder="e.g. Hyderabad" error={e("city")} />
        </div>

        <fieldset className={`kf-fields${school ? " is-active" : ""}`} disabled={!school}>
          <legend className="bh-sr-only">School details</legend>
          <KfInput id="demo-organization" name="organization" type="text" label="School / Institution Name" req icon="school" autoComplete="organization" defaultValue={old.organization} placeholder="e.g. Sri Chaitanya High School" error={school ? e("organization") : undefined} />
          <div className="bp-form__row">
            <KfInput id="demo-designation" name="designation" type="text" label="Your Designation" icon="award" autoComplete="organization-title" defaultValue={old.designation} placeholder="e.g. Principal" error={e("designation")} />
            <KfSelect id="demo-student-count" name="student_count" label="Number of Students" icon="users" placeholder="Number of Students" options={COUNTS} defaultValue={old.student_count ?? ""} error={e("student_count")} />
          </div>
        </fieldset>

        <fieldset className={`kf-fields${!school ? " is-active" : ""}`} disabled={school}>
          <legend className="bh-sr-only">Student details</legend>
          <div className="bp-form__row">
            <KfSelect id="demo-grade" name="grade" label="Class / Grade" req icon="cap" placeholder="Select Class / Grade" options={GRADES} defaultValue={old.grade ?? ""} error={e("grade")} />
            <KfInput id="demo-current-school" name="organization" type="text" label="Current School" icon="school" defaultValue={old.organization} placeholder="Optional" error={!school ? e("organization") : undefined} />
          </div>
        </fieldset>

        <KfSelect id="demo-board" name="board" label="Board / Curriculum" icon="bookOpen" placeholder="Board / Curriculum" options={BOARDS} defaultValue={old.board ?? ""} error={e("board")} />
        <KfTextarea id="demo-message" name="message" label="Anything you'd like us to know?" rows={4} defaultValue={old.message} placeholder="Optional: subjects you're interested in, a preferred time for the walkthrough…" error={e("message")} />
        <div className="kf-submit">
          <button className="bh-btn bh-btn--maroon bh-btn--lg" type="submit"><Icon name="calendar" size={18} /> Request My Demo</button>
          <KfRequiredNote />
        </div>
      </form>
    </>
  );
}
