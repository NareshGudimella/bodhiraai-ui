/**
 * Form building blocks for the redesigned lead-form pages (/contact,
 * /book-demo, /student-registration). not in legacy: presentation only, the
 * fields keep their legacy names, values and `required` attributes.
 * Tailwind since the migration's phase 2 (were the kit's `bp-form`/`bp-field`/
 * `bp-input`/`bp-alert`/`bp-form-card` rules in site-ui.css plus `kf-*` in
 * public/assets/css/site-ui-forms.css, which is gone); the values are what
 * those rules computed to inside `.bh-page`. `site-forms.css` holds the two
 * `@utility`s these need (select chevron, alert bullets).
 * Server-safe (no hooks), so the client DemoForm can use them too.
 *
 * Each control gets a visible label, an optional hint and the field's first
 * Laravel validation message, wired with `aria-describedby` and
 * `aria-invalid`. `req` marks a field the API requires: a star and
 * `aria-required` (the native `required` attribute is passed only where the
 * legacy form had it, so server-side validation messages still show).
 */
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Icon, type IconName } from "./icons";
import { btn, cx, eyebrowClass, FOCUS, focusRingGold, HERO_GLASS, HERO_GLASS_ROW, HERO_GLASS_STRONG, heroGlassLabel } from "./ui";

export type FieldErrors = Record<string, string[] | undefined>;

/* ---------- Page frame ---------- */

/** The page wrapper (was `.bh-page.kf-page`): Jakarta, body colour, white, maroon selection, no transitions under reduced motion. */
export const KF_PAGE = "overflow-x-clip bg-white font-sans text-body reduce-motion-tree selection:bg-maroon selection:text-white";

/** Section padding (was `.bp-section`: 112 → 88 → 72 → 64px); top and bottom apart, so `flushTop` can't be undone by a breakpoint. */
const SECTION_TOP = "pt-28 max-xl:pt-22 max-lg:pt-18 max-sm:pt-16";
const SECTION_BOTTOM = "pb-28 max-xl:pb-22 max-lg:pb-18 max-sm:pb-16";

/** A page section (`bp-section`, + `--cream`, `--flush-top`). */
export function kfSection({ cream, flushTop }: { cream?: boolean; flushTop?: boolean } = {}) {
  return cx("relative", flushTop ? "pt-0" : SECTION_TOP, SECTION_BOTTOM, cream ? "bg-cream" : "bg-white");
}

/** Paragraph defaults inside the page (was `.bh-page p` without its margin). */
export const KF_P = "font-sans text-base leading-[1.65] font-normal text-body";

/** Links on light backgrounds: the page's maroon focus ring with 8px corners (was `.bh-page a:focus-visible`). */
export const KF_FOCUS_A = FOCUS;

/** Button links on light backgrounds (`.bh-page a:focus-visible` beat the button's gold ring). */
export function kfBtnLink(variant: "maroon" | "ghost", extra?: string) {
  return btn(variant, "lg", cx("focus-visible:outline-maroon! focus-visible:rounded-[8px]", extra));
}

/** Submit buttons: maroon, large, the page's maroon ring; full width on phones. */
export const KF_SUBMIT_BTN = btn("maroon", "lg", "focus-visible:outline-maroon! max-sm:w-full");

/** Hero chips under the lead (was `ul.bp-chips.kf-hero-chips`). */
export function KfHeroChips({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0" aria-label={label}>
      {children}
    </ul>
  );
}

const CHIP = "inline-flex max-w-full items-center gap-2 rounded-full border border-line-2 bg-white px-3.5 py-[9px] text-[14px] leading-[1.2] font-semibold wrap-anywhere [&_.bh-icon]:text-wine";

/** One hero chip (was `.bp-chip`); with `href` a link (maroon text: `.bh-page a` outranked the chip's ink) that turns maroon on hover. */
export function KfChip({ icon, href, children }: { icon: IconName; href?: string; children: ReactNode }) {
  const body = <><Icon name={icon} size={16} />{children}</>;
  return (
    <li>
      {href ? (
        <a
          href={href}
          className={cx(
            CHIP,
            "text-maroon",
            KF_FOCUS_A,
            "transition-[background,color,border-color,transform] duration-200 ease-bh hover:-translate-y-px hover:border-maroon hover:bg-maroon hover:text-white hover:[&_.bh-icon]:text-gold-bright",
          )}
        >
          {body}
        </a>
      ) : (
        <span className={cx(CHIP, "text-ink")}>{body}</span>
      )}
    </li>
  );
}

/** Form card + side column, pulled up into the hero (was `.bh-container.kf-layout`). */
export function KfLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-container relative z-1 -mt-12 grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start gap-12 *:min-w-0 max-xl:gap-8 max-lg:-mt-8 max-lg:grid-cols-1 max-sm:-mt-6">
      {children}
    </div>
  );
}

/** Small uppercase label in the form card's head (was `.bp-eyebrow` under `.kf-card__head`: body colour, 12px below). */
const CARD_EYEBROW = eyebrowClass().replace("mb-4", "mb-3").replace("text-wine", "text-body");

/** The white form card with its head (eyebrow, h2, intro) (was `.bp-form-card.kf-card`). */
export function KfFormCard({ id, eyebrow, titleId, title, intro, children }: {
  id: string;
  eyebrow: ReactNode;
  titleId: string;
  title: ReactNode;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="scroll-mt-[120px] rounded-xl border border-line bg-white p-10 shadow-lg max-md:px-5 max-md:py-7" id={id} data-reveal>
      <div className="mb-7">
        <p className={CARD_EYEBROW}>{eyebrow}</p>
        <h2 id={titleId} className="m-0 mb-2.5 font-sans text-[length:clamp(24px,1vw_+_18px,32px)] leading-[1.2] font-extrabold tracking-[-.025em] text-balance text-ink transition-none">
          {title}
        </h2>
        <p className={cx("m-0", KF_P)}>{intro}</p>
      </div>
      {children}
    </div>
  );
}

/** The side column (was `.kf-aside`): sticky on desktop, two columns on tablets (the photo spans both when the count is odd). */
export function KfAside({ labelledBy, children }: { labelledBy: string; children: ReactNode }) {
  return (
    <aside
      className="grid gap-6 lg:sticky lg:top-28 max-lg:grid-cols-2 max-lg:items-start max-lg:[&>:first-child:nth-last-child(odd)]:col-span-full max-md:grid-cols-1"
      aria-labelledby={labelledBy}
    >
      {children}
    </aside>
  );
}

/** White side card (was `.bp-card.kf-reach` / `.bp-card.kf-benefits`) with its h2 and intro; `introMargin` below the intro. */
export function KfSideCard({ titleId, title, intro, introMargin, children }: {
  titleId: string;
  title: ReactNode;
  intro: ReactNode;
  introMargin: "mb-6" | "mb-5";
  children: ReactNode;
}) {
  return (
    <div className="relative h-full rounded-lg border border-line bg-white p-8 shadow-xs transition-[transform,box-shadow,border-color] duration-300 ease-bh max-md:p-6" data-reveal>
      <h2 id={titleId} className="m-0 mb-2 font-sans text-[22px] leading-[1.2] font-extrabold tracking-[-.02em] text-ink transition-none">{title}</h2>
      <p className={cx("m-0", introMargin, KF_P)}>{intro}</p>
      {children}
    </div>
  );
}

/** Icon tile (was `.bp-tile.bp-tile--sm` + `--solid` / `--light`). */
export function kfTile(kind: "soft" | "solid" | "light" = "soft", extra?: string) {
  return cx(
    "inline-grid h-11 w-11 flex-none place-items-center rounded-[12px] transition-[background,color] duration-250",
    kind === "solid" ? "bg-grad-maroon text-white" : kind === "light" ? "border border-[rgba(255,255,255,.2)] bg-[rgba(255,255,255,.1)] text-gold-bright" : "bg-[linear-gradient(135deg,#FBEFDD,#F5E1C2)] text-wine",
    extra,
  );
}

/** Maroon "call us" strip under the side cards (was `.kf-help.bp-on-dark`). */
export function KfHelp({ label, phone }: { label: string; phone: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-grad-maroon px-6 py-5 text-white shadow-md" data-reveal>
      <span className={kfTile("light")}><Icon name="phone" size={20} /></span>
      <div className="min-w-0">
        <span className="block text-[12.5px] font-bold tracking-[.08em] text-gold-bright uppercase">{label}</span>
        <a
          href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
          className={cx("text-[19px] font-extrabold tracking-[-.01em] text-white no-underline wrap-anywhere hover:text-gold-bright", focusRingGold, "focus-visible:rounded-[8px]")}
        >
          {phone}
        </a>
      </div>
    </div>
  );
}

/* ---------- Fields ---------- */

type Common = {
  id: string;
  name: string;
  label: ReactNode;
  req?: boolean;
  hint?: ReactNode;
  error?: string;
  icon?: IconName;
  className?: string;
};

/** The form (was `.bp-form.kf-form`) and a two-up row (`.bp-form__row`, one column ≤767). */
export const KF_FORM = "grid gap-[22px]";
export const KF_ROW = "grid grid-cols-2 gap-5 *:min-w-0 max-md:grid-cols-1";
/** A group of fields inside the form (was `.kf-form fieldset`); `hidden` for the inactive Book a Demo group. */
export function kfFieldset(shown = true) {
  return cx(shown ? "grid" : "hidden", "m-0 min-w-0 gap-[22px] border-0 p-0");
}

/** The field's describedby ids (hint, error) and invalid state. */
function aria({ id, hint, error, req }: Pick<Common, "id" | "hint" | "error" | "req">) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return {
    "aria-describedby": ids || undefined,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-required": req || undefined,
  };
}

/**
 * Control classes (were `.bp-input` / `.bp-select` / `.bp-textarea` in `.kf-field`). With an error the
 * red border stays on hover and focus (the legacy `[aria-invalid]` rule came last).
 */
function control(kind: "input" | "select" | "textarea", error?: string, icon?: boolean) {
  return cx(
    "w-full rounded-[14px] border font-sans text-[15.5px] leading-[1.4] font-medium shadow-xs outline-0 transition-[border-color,box-shadow] duration-200",
    "focus-visible:outline-0 placeholder:text-[15px] placeholder:text-muted placeholder:opacity-100",
    error
      ? "border-error bg-[#FFFBFA] focus:shadow-[0_0_0_4px_rgba(180,35,24,.12)]"
      : "border-line-2 bg-white hover:border-[rgba(92,26,38,.3)] focus:border-wine focus:shadow-[0_0_0_4px_rgba(122,36,55,.12)]",
    kind === "textarea" ? "min-h-[140px] resize-y px-4 py-3.5" : cx("min-h-[52px] py-0", kind === "select" ? "pr-11" : "pr-4", icon ? "pl-[46px]" : "pl-4"),
    kind === "select"
      ? "block! cursor-pointer appearance-none kf-select-chevron text-ink invalid:text-muted has-[option[value='']:checked]:text-muted [&_option]:text-ink"
      : "text-ink",
  );
}

function Shell({ id, label, req, hint, error, icon, className, children }: Omit<Common, "name"> & { children: ReactNode }) {
  return (
    <div className={cx("m-0 grid content-start gap-2", className)}>
      <label className="font-sans text-[14px] leading-[1.625] font-semibold text-ink" htmlFor={id}>
        {label}
        {req && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
      </label>
      <div className="group/control relative">
        {icon && (
          <Icon
            name={icon}
            size={18}
            className={cx("pointer-events-none absolute top-[17px] left-4 transition-[color] duration-200 group-focus-within/control:text-wine", error ? "text-error" : "text-muted")}
          />
        )}
        {children}
      </div>
      {hint && <p id={`${id}-hint`} className="m-0 font-sans text-[13px] leading-[1.45] font-normal text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="m-0 flex items-center gap-1.5 font-sans text-[13px] leading-[1.45] font-semibold text-error">
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
}

export function KfInput({ id, name, label, req, hint, error, icon, className, ...rest }: Common & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "className">) {
  return (
    <Shell id={id} label={label} req={req} hint={hint} error={error} icon={icon} className={className}>
      <input id={id} name={name} className={control("input", error, !!icon)} {...aria({ id, hint, error, req })} {...rest} />
    </Shell>
  );
}

export function KfSelect({ id, name, label, req, hint, error, icon, className, placeholder, options, ...rest }: Common & {
  placeholder: string;
  /** [value, label] pairs, or plain strings (value = label). */
  options: (string | [string, string])[];
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name" | "className">) {
  return (
    <Shell id={id} label={label} req={req} hint={hint} error={error} icon={icon} className={className}>
      <select id={id} name={name} className={control("select", error, !!icon)} {...aria({ id, hint, error, req })} {...rest}>
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const [v, l] = typeof o === "string" ? [o, o] : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </Shell>
  );
}

export function KfTextarea({ id, name, label, req, hint, error, icon, className, ...rest }: Common & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name" | "className">) {
  return (
    <Shell id={id} label={label} req={req} hint={hint} error={error} icon={icon} className={className}>
      <textarea id={id} name={name} className={control("textarea", error)} {...aria({ id, hint, error, req })} {...rest} />
    </Shell>
  );
}

/** The submit row (was `.kf-submit`): the button, then "Fields marked * are required." */
export function KfSubmit({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-1">
      {children}
      <p className="m-0 font-sans text-[13.5px] leading-[1.65] font-normal text-muted">
        Fields marked <span className="text-error" aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.
      </p>
    </div>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={cx("bh-icon inline-block flex-none align-middle", className)} width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  );
}

const ALERT = "mb-7 flex scroll-mt-[140px] items-start gap-3 rounded-[14px] border px-4 py-3.5 font-sans text-[15px] leading-[1.5] font-medium outline-0 focus-visible:shadow-[0_0_0_4px_rgba(122,36,55,.18)]";

/**
 * The flashed result above a form: the success status (role="status"), or
 * the validation errors (role="alert") as a list whose items jump to their
 * field. `fieldIds` maps an error key to its control's id.
 */
export function KfAlert({ status, errors, fieldIds, intro }: {
  status?: string;
  errors?: FieldErrors;
  fieldIds?: Record<string, string>;
  /** Text above the error list (default: "Please check the highlighted fields and try again."). */
  intro?: string;
}) {
  const list = Object.entries(errors ?? {}).flatMap(([k, msgs]) => (msgs ?? []).map((m, i) => ({ k: `${k}-${i}`, id: fieldIds?.[k], m })));
  if (status) {
    return (
      <div className={cx(ALERT, "border-[rgba(15,122,79,.25)] bg-[#E8F6EF] text-[#0F7A4F]")} role="status" tabIndex={-1} data-kf-focus>
        <Icon name="check" size={22} className="mt-0.5" />
        <p className="m-0 font-sans text-[15px] leading-[1.65] font-semibold text-inherit">{status}</p>
      </div>
    );
  }
  if (list.length === 0) return null;
  return (
    <div className={cx(ALERT, "border-[rgba(180,35,24,.25)] bg-[#FDECEA] text-error")} role="alert" tabIndex={-1} data-kf-focus>
      <AlertIcon className="mt-0.5" />
      <div>
        <strong className="block font-bold">{intro ?? "Please check the highlighted fields and try again."}</strong>
        <ul className="m-0 mt-1.5 grid list-none gap-0.5 p-0 text-[14.5px]">
          {list.map(({ k, id, m }) => (
            <li key={k} className="kf-bullet relative pl-3.5">
              {id ? (
                <a
                  href={`#${id}`}
                  className={cx("text-inherit underline decoration-[rgba(180,35,24,.4)] underline-offset-3 hover:text-inherit hover:decoration-current", KF_FOCUS_A)}
                >
                  {m}
                </a>
              ) : m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Links in a side card row (were `.kf-info__body a`): ink, semibold, wine on hover. */
export const KF_INFO_LINK = cx("font-semibold text-ink no-underline hover:text-wine", KF_FOCUS_A);

/** A side card row: icon tile, small label, then the details. */
export function KfInfoItem({ icon, title, children }: { icon: IconName; title: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      {/* 20px below the tile: `.bp-card .bp-tile` reached it inside the card */}
      <span className={kfTile("soft", "mb-5")}><Icon name={icon} size={20} /></span>
      <div className="min-w-0">
        <h3 className="m-0 mt-0.5 mb-1.5 font-sans text-[13px] leading-[1.2] font-bold tracking-[.06em] text-muted uppercase transition-none">{title}</h3>
        <div className="grid gap-1 text-[15.5px] leading-[1.55] text-ink wrap-anywhere">{children}</div>
      </div>
    </li>
  );
}

/** Framed photo for the form pages' side column, with an optional floating chip (was `.kf-photo` + `.bp-glass`). */
export function KfPhoto({ src, alt, chip }: { src: string; alt: string; chip?: { icon: IconName; title: ReactNode; text: ReactNode } }) {
  return (
    <figure
      className="relative m-0 aspect-[4/3] overflow-hidden rounded-xl bg-cream-2 shadow-lg after:pointer-events-none after:absolute after:inset-[55%_0_0] after:bg-[linear-gradient(180deg,transparent,rgba(31,11,16,.35))] after:content-['']"
      data-reveal
    >
      <img src={src} alt={alt} width={1200} height={900} loading="lazy" decoding="async" className="block h-full w-full max-w-full object-cover" />
      {chip && (
        <span className={cx("absolute bottom-4 left-4 z-1", HERO_GLASS, HERO_GLASS_ROW)}>
          <span className={kfTile("solid")}><Icon name={chip.icon} size={20} /></span>
          <span>
            <strong className={HERO_GLASS_STRONG}>{chip.title}</strong>
            <span className={heroGlassLabel()}>{chip.text}</span>
          </span>
        </span>
      )}
    </figure>
  );
}

/**
 * KfConsent looks per background: `light` (form pages), `dark` (homepage request card),
 * `footer` (newsletter: dark and tighter). Colours and sizes are what site-compliance.css
 * computed to, including its quirks (the light minor/error lines are muted, not ink/red: its
 * `.bh-consent p` rule outranked them; the footer error is regular weight: `.bh-footer p`).
 */
const CONSENT = {
  light: {
    box: "bg-[#FFF9F2] border-line py-4 px-[18px]", boxError: "border-error! bg-[#FFFBFA]!",
    p: "text-[13.5px] text-muted", minor: "text-[13.5px] text-muted font-semibold", error: "text-[13.5px] text-muted font-semibold",
    check: "text-[14.5px] text-ink", input: "accent-maroon focus-visible:outline-maroon", link: "text-wine focus-visible:outline-maroon",
  },
  dark: {
    box: "bg-[rgba(0,0,0,.18)] border-[rgba(255,255,255,.14)] py-4 px-[18px]", boxError: "border-[#FF9C8F]! bg-[rgba(180,35,24,.18)]!",
    p: "text-[13.5px] text-[rgba(255,244,230,.78)]", minor: "text-[13.5px] text-ivory font-semibold", error: "text-[13.5px] text-[#FFD3CC] font-semibold",
    check: "text-[14.5px] text-ivory", input: "accent-gold-bright focus-visible:outline-gold-bright", link: "text-gold-bright focus-visible:outline-gold-bright",
  },
  footer: {
    box: "bg-[rgba(0,0,0,.18)] border-[rgba(255,255,255,.14)] py-3 px-3.5", boxError: "border-[#FF9C8F]! bg-[rgba(180,35,24,.18)]!",
    p: "text-[12.5px] text-[rgba(255,244,230,.78)]", minor: "text-[12.5px] text-ivory font-normal", error: "text-[12.5px] text-[#FFD3CC] font-normal",
    check: "text-[13.5px] text-ivory", input: "accent-gold-bright focus-visible:outline-gold-bright", link: "text-gold-bright transition-[color] duration-200 focus-visible:outline-gold-bright",
  },
} as const;

/**
 * The consent block every public lead form ends with (DPDP Act 2023 s.5–6;
 * not in legacy): a short notice of purpose, an optional parent/guardian
 * statement for forms a minor may fill in, and an unticked, required checkbox
 * `consent=1` (after a hidden `0`, as the other checkboxes) linking the
 * Privacy Policy (and Terms when `terms`). The Server Action rejects the
 * submit without it (`errors.consent`). Links open in a new tab so the
 * visitor's input isn't lost. Tailwind (migration phase 1); `margin` replaces
 * the default top margin (the homepage card uses `mb-5`).
 */
export function KfConsent({ id, purpose, minor, terms, error, checked, variant = "light", margin = "mt-1", focusOnError, children }: {
  id: string;
  /** Why we collect these details ("We use these details only to …"). */
  purpose: ReactNode;
  /** Parent / guardian statement for forms a student under 18 may fill in. */
  minor?: ReactNode;
  terms?: boolean;
  error?: string;
  checked?: boolean;
  /** The background it sits on. */
  variant?: keyof typeof CONSENT;
  /** Margin classes for the block. */
  margin?: string;
  /** Mark the checkbox for KfFocusResult when it has the error (forms without an error summary). */
  focusOnError?: boolean;
  /** What the visitor agrees to, after the policy links. */
  children?: ReactNode;
}) {
  const v = CONSENT[variant];
  const describedBy = [`${id}-purpose`, minor && `${id}-minor`, error && `${id}-error`].filter(Boolean).join(" ");
  const p = "m-0 font-sans leading-[1.55]";
  const link = `font-semibold underline underline-offset-3 focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 ${v.link}`;
  return (
    <div className={`grid gap-2.5 rounded-[14px] border ${v.box} ${error ? v.boxError : ""} ${margin}`}>
      <p id={`${id}-purpose`} className={`${p} font-normal ${v.p}`}>{purpose}</p>
      {minor && <p id={`${id}-minor`} className={`${p} ${v.minor}`}>{minor}</p>}
      <input type="hidden" name="consent" value="0" />
      <label className={`m-0 flex cursor-pointer items-start gap-3 leading-[1.5] font-medium ${v.check}`} htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          name="consent"
          value="1"
          required
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          defaultChecked={checked}
          data-kf-focus={error && focusOnError ? "" : undefined}
          className={`m-0 mt-0.5 h-5 w-5 flex-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 ${v.input}`}
        />
        <span>
          I have read the <PolicyLink href="/privacy" className={link}>Privacy Policy</PolicyLink>
          {terms && <> and agree to the <PolicyLink href="/terms" className={link}>Terms of Service</PolicyLink></>}
          {children ?? <>, and I agree to Bodhira.ai using these details for the purpose above.</>}
          <span aria-hidden="true"> *</span>
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className={`${p} flex items-center gap-1.5 ${v.error}`}>
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
}

function PolicyLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
