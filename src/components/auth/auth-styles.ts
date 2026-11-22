/**
 * Class names for the sign-in pages (marketing-site look: pill buttons, soft
 * rounded inputs, wine focus ring). Plain strings so server and client
 * components can share them. Colours come from `.auth-scope` in globals.css.
 * Outline colours need the `color:` hint (`outline-(color:--x)`): without it Tailwind
 * doesn't emit the colour and the ring falls back to the text colour (white on the
 * button). The button eases on hover/press (200ms, site easing). not in legacy
 */

export const authInput =
  "block min-h-12 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-[15px] text-ink shadow-[0_1px_2px_rgba(31,11,16,.04)] transition-[border-color,box-shadow] placeholder:text-[#7d6c66] hover:border-[rgba(92,26,38,.3)] focus:border-(--auth-wine) focus:outline-none focus:ring-[3px] focus:ring-[rgba(122,36,55,.18)] aria-[invalid=true]:border-danger aria-[invalid=true]:bg-[#fffbfa] aria-[invalid=true]:focus:ring-[rgba(180,35,24,.16)]";

export const authButton =
  "inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-(image:--auth-grad) px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_8px_20px_-8px_rgba(92,26,38,.6)] transition hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_14px_28px_-10px_rgba(92,26,38,.7)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(color:--auth-wine) disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70";

export const authLink =
  "rounded font-semibold text-(--auth-wine) underline-offset-4 hover:text-(--auth-maroon) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(color:--auth-wine)";
