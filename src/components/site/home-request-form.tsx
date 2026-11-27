import { connection } from "next/server";
import { contactSubmit } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";
import { FlashClear } from "./flash-clear";
import { Icon } from "./icons";
import { KfConsent } from "./kit-forms-fields";
import { KfFocusResult } from "./kit-forms-focus";
import { btn } from "./ui";
import { L, emailProps } from "@/lib/input-limits";

/** A field on the maroon card: label above a translucent input. */
const FIELD = "m-0 grid gap-2";
const LABEL = "text-[13px] font-semibold text-[rgba(255,244,230,.9)]";
const INPUT =
  "h-[52px] w-full rounded-[14px] border border-[rgba(255,255,255,.2)] bg-[rgba(255,255,255,.08)] px-[18px] font-sans text-[15.5px] leading-[normal] font-medium text-white outline-0 transition-[border-color,box-shadow,background] duration-200 placeholder:text-[rgba(255,244,230,.72)] hover:border-[rgba(255,255,255,.35)] focus:border-gold-bright focus:bg-[rgba(255,255,255,.12)] focus:shadow-[0_0_0_4px_rgba(226,184,115,.2)] motion-reduce:transition-none";

/**
 * The homepage "Set up your school" form (contactSubmit with a fixed subject),
 * moved out of page.tsx for the compliance pass (not in legacy, 2026-11-22):
 * the consent checkbox with a notice of purpose, and the errors and old input
 * flashed back by the action (legacy showed only the success status here, so
 * a failed submit looked like nothing happened). Same fields, ids and action.
 */
export async function HomeRequestForm() {
  await connection();
  const flash = await getSiteFlash();
  // Not the footer newsletter's errors (its own bag).
  const errors = flash.bag ? {} : flash.errors ?? {};
  const old = flash.bag ? {} : flash.old ?? {};
  const list = Object.values(errors).flatMap((m) => m ?? []);
  return (
    <>
      {list.length > 0 && (
        <div
          key={JSON.stringify(flash)}
          className="mb-5 flex items-start gap-2 rounded-sm border border-[#FF9C8F] bg-[rgba(180,35,24,.2)] px-4 py-3 text-[14.5px] font-semibold text-[#FFE7E3] focus:outline-2 focus:outline-offset-3 focus:outline-gold-bright"
          role="alert"
          tabIndex={-1}
          data-kf-focus
        >
          <Icon name="help" size={18} />
          <span>{list.join(" ")}</span>
          <FlashClear />
          <KfFocusResult />
        </div>
      )}
      <form key={JSON.stringify(old)} action={contactSubmit}>
        <input type="hidden" name="subject" value="School onboarding request" />
        <div className="mb-5 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <label className={FIELD}>
            <span className={LABEL}>School name</span>
            <input type="text" id="name" name="name" placeholder="e.g. Sunrise Public School" required maxLength={L.name} autoComplete="organization" defaultValue={old.name} aria-invalid={errors.name ? true : undefined} className={INPUT} />
          </label>
          <label className={FIELD}>
            <span className={LABEL}>Email address</span>
            <input {...emailProps(L.email)} id="email" name="email" placeholder="you@school.edu.in" required defaultValue={old.email} aria-invalid={errors.email ? true : undefined} className={INPUT} />
          </label>
        </div>
        <KfConsent
          id="home-consent"
          variant="dark"
          margin="mb-5"
          checked={old.consent === "1"}
          error={errors.consent?.[0]}
          purpose="We use these details only to contact you about onboarding your school. We don't add you to any mailing list."
        />
        <button className={btn("gold", "lg", "focus-visible:rounded-[8px] max-sm:w-full")} type="submit">Request a Walkthrough <Icon name="arrowRight" size={18} /></button>
      </form>
    </>
  );
}
