"use client";

import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/site/icons";
import { KF_FORM, KF_ROW, KF_SUBMIT_BTN, KfConsent, KfInput, KfSelect, KfSubmit, KfTextarea, kfFieldset, kfTile, type FieldErrors } from "@/components/site/kit-forms-fields";
import { cx, focusRing } from "@/components/site/ui";
import { demoStore } from "@/lib/site-actions";
import { L, NAME_PATTERN, NAME_TITLE, PHONE_HINT, digitsOnly, emailProps, phoneProps } from "@/lib/input-limits";

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
 * `aria-pressed`. Compliance pass (not in legacy, 2026-11-22): a required
 * consent checkbox with a notice of purpose, plus a parent/guardian statement
 * on the Student / Parent tab (`KfConsent`; demoStore checks `consent=1`).
 * Tailwind since the migration's phase 2 (was `.kf-type` / `.kf-fields`).
 */
export function DemoForm({ initialType, old, errors }: { initialType: "school" | "student"; old: Old; errors: FieldErrors }) {
  const [type, setType] = useState(initialType);
  const school = type === "school";
  const e = (k: string) => errors[k]?.[0];
  return (
    <>
      <fieldset className="m-0 mb-7 grid min-w-0 grid-cols-2 gap-3 border-0 p-0 max-sm:grid-cols-1">
        <legend className="float-left col-span-full m-0 mb-2.5 w-full p-0 font-sans text-[14px] leading-[1.625] font-semibold text-ink">I&apos;m booking for</legend>
        <TypeButton type="school" pressed={school} onClick={() => setType("school")} icon="school" title={<>I&apos;m a School</>} text="Institution / coaching centre" />
        <TypeButton type="student" pressed={!school} onClick={() => setType("student")} icon="cap" title={<>I&apos;m a Student / Parent</>} text="Individual learner" />
      </fieldset>

      <form action={demoStore} id="bookDemoForm" className={KF_FORM}>
        <input type="hidden" name="type" id="demoType" value={type} />
        <div className={KF_ROW}>
          <KfInput id="demo-name" name="name" type="text" label={school ? "Contact Person" : "Student / Parent Name"} req required maxLength={L.name} pattern={NAME_PATTERN} title={NAME_TITLE} icon="user" autoComplete="name" defaultValue={old.name} placeholder={school ? "e.g. Anita Rao" : "e.g. Rahul Verma"} error={e("name")} />
          <KfInput id="demo-email" name="email" label="Email Address" req required {...emailProps(L.email)} icon="mail" defaultValue={old.email} placeholder="you@example.com" error={e("email")} />
        </div>
        <div className={KF_ROW}>
          <KfInput id="demo-phone" name="phone" label="Phone Number" req required {...phoneProps()} onInput={digitsOnly} hint={PHONE_HINT} icon="phone" defaultValue={old.phone} placeholder="9876543210" error={e("phone")} />
          <KfInput id="demo-city" name="city" type="text" label="City" maxLength={L.city} icon="mapPin" autoComplete="address-level2" defaultValue={old.city} placeholder="e.g. Hyderabad" error={e("city")} />
        </div>

        <fieldset className={kfFieldset(school)} disabled={!school}>
          <legend className="sr-only">School details</legend>
          <KfInput id="demo-organization" name="organization" type="text" label="School / Institution Name" req required maxLength={L.organization} icon="school" autoComplete="organization" defaultValue={old.organization} placeholder="e.g. Sri Chaitanya High School" error={school ? e("organization") : undefined} />
          <div className={KF_ROW}>
            <KfInput id="demo-designation" name="designation" type="text" label="Your Designation" maxLength={L.designation} icon="award" autoComplete="organization-title" defaultValue={old.designation} placeholder="e.g. Principal" error={e("designation")} />
            <KfSelect id="demo-student-count" name="student_count" label="Number of Students" icon="users" placeholder="Number of Students" options={COUNTS} defaultValue={old.student_count ?? ""} error={e("student_count")} />
          </div>
        </fieldset>

        <fieldset className={kfFieldset(!school)} disabled={school}>
          <legend className="sr-only">Student details</legend>
          <div className={KF_ROW}>
            <KfSelect id="demo-grade" name="grade" label="Class / Grade" req required icon="cap" placeholder="Select Class / Grade" options={GRADES} defaultValue={old.grade ?? ""} error={e("grade")} />
            <KfInput id="demo-current-school" name="organization" type="text" label="Current School" maxLength={L.organization} icon="school" defaultValue={old.organization} placeholder="Optional" error={!school ? e("organization") : undefined} />
          </div>
        </fieldset>

        <KfSelect id="demo-board" name="board" label="Board / Curriculum" icon="bookOpen" placeholder="Board / Curriculum" options={BOARDS} defaultValue={old.board ?? ""} error={e("board")} />
        <KfTextarea id="demo-message" name="message" label="Anything you'd like us to know?" rows={4} maxLength={1000} defaultValue={old.message} placeholder="Optional: subjects you're interested in, a preferred time for the walkthrough…" error={e("message")} />
        <KfConsent
          id="demo-consent"
          checked={old.consent === "1"}
          error={e("consent")}
          purpose="We use these details only to contact you and schedule your demo. We don't add you to any mailing list."
          minor={school ? undefined : "If the student is under 18, a parent or guardian must fill in this form and give consent."}
        >
          {school ? undefined : <>, and I am the student&apos;s parent or guardian or am 18 or older. I agree to Bodhira.ai using these details for the purpose above.</>}
        </KfConsent>
        <KfSubmit>
          <button className={KF_SUBMIT_BTN} type="submit"><Icon name="calendar" size={18} /> Request My Demo</button>
        </KfSubmit>
      </form>
    </>
  );
}

/** One "who are you" choice (was `.kf-type button`): pressed = wine border, cream fill, maroon tile, ticked circle. */
function TypeButton({ type, pressed, onClick, icon, title, text }: {
  type: "school" | "student";
  pressed: boolean;
  onClick: () => void;
  icon: IconName;
  title: ReactNode;
  text: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-type={type}
      onClick={onClick}
      className={cx(
        "flex w-full cursor-pointer items-center gap-3.5 rounded-md border-[1.5px] px-[18px] py-4 text-left font-sans text-base leading-[1.625] font-normal text-ink",
        "transition-[border-color,background,box-shadow,color] duration-200",
        focusRing,
        pressed
          ? "border-wine bg-[linear-gradient(180deg,#FFFBF5,#FBF6EF)] shadow-[0_0_0_3px_rgba(122,36,55,.1),var(--shadow-sm)]"
          : "border-line-2 bg-white shadow-xs hover:border-[rgba(92,26,38,.35)]",
      )}
    >
      <span className={kfTile(pressed ? "solid" : "soft")}><Icon name={icon} size={22} /></span>
      <span className="grid min-w-0 gap-0.5">
        <strong className="block text-[15.5px] leading-[1.3] font-bold">{title}</strong>
        <small className="block text-[13px] leading-[1.35] text-muted">{text}</small>
      </span>
      <span
        className={cx(
          "ml-auto grid h-[22px] w-[22px] flex-none place-items-center rounded-full border-[1.5px] transition-[background,border-color,color] duration-200",
          pressed ? "border-wine bg-wine text-white" : "border-line-2 text-transparent",
        )}
        aria-hidden="true"
      >
        <Icon name="tick" size={12} />
      </span>
    </button>
  );
}
