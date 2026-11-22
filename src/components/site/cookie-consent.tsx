"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { btn } from "./ui";

/** Cookie holding the visitor's choice: `all` | `necessary`. */
export const CONSENT_COOKIE = "bh_consent";
export type ConsentValue = "all" | "necessary";
/** Fired on `window` to open the banner again (the footer's "Cookie settings"). */
const OPEN_EVENT = "bh-consent-open";

/** Re-reads the cookie whenever the choice changes (in this tab). */
function subscribe(onChange: () => void) {
  window.addEventListener("bh-consent", onChange);
  return () => window.removeEventListener("bh-consent", onChange);
}

function readConsent(): ConsentValue | null {
  const m = /(?:^|;\s*)bh_consent=(all|necessary)(?:;|$)/.exec(document.cookie);
  return m ? (m[1] as ConsentValue) : null;
}

/**
 * Stores the choice for a year and tells listeners (analytics loading is
 * gated on `bh_consent=all` elsewhere) through
 * `window.dispatchEvent(new CustomEvent('bh-consent', { detail: value }))`.
 */
function saveConsent(value: ConsentValue) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent("bh-consent", { detail: value }));
}

/**
 * Cookie banner for the marketing site (not in legacy, 2026-11-22). Shown
 * until the visitor picks "Accept all" or "Only necessary"; "Cookie settings"
 * (footer, /cookies) opens it again. A non-modal region: the page stays
 * usable, focus moves to it only when it was opened on purpose, Escape closes
 * a reopened banner without changing the choice.
 */
export function CookieConsent() {
  // The stored choice ("" = none yet; "ssr" while rendering on the server, so nothing shows there).
  const stored = useSyncExternalStore(subscribe, () => readConsent() ?? "", () => "ssr");
  const current = stored === "all" || stored === "necessary" ? stored : null;
  const [reopened, setReopened] = useState(false);
  const open = stored === "" || reopened;
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = () => {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setReopened(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (reopened) ref.current?.focus();
  }, [reopened]);

  const close = () => {
    if (reopened) opener.current?.focus();
    setReopened(false);
  };
  const choose = (value: ConsentValue) => {
    saveConsent(value);
    close();
  };

  if (!open) return null;
  return (
    <div
      ref={ref}
      // Hidden while the mobile side menu is open (not in legacy); not printed.
      className="fixed inset-x-4 bottom-4 z-1050 mx-auto max-w-[560px] rounded-[18px] border border-line bg-white px-[22px] py-5 font-sans text-base leading-[1.625] text-ink shadow-[0_18px_48px_rgba(42,14,19,.22)] focus:outline-none max-sm:inset-x-3 max-sm:bottom-3 max-sm:p-[18px] print:hidden [body:has(#bh-mobile-menu[data-open])_&]:hidden"
      role="region"
      aria-labelledby="bh-cookie-title"
      aria-describedby="bh-cookie-text"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape" && current) close();
      }}
    >
      <h2 id="bh-cookie-title" className="m-0 mb-1.5 font-sans text-[17px] leading-[1.3] font-bold text-ink">Cookies on Bodhira.ai</h2>
      {/* Outfit: the legacy theme's `p` font, which this text always showed (kept for parity). */}
      <p id="bh-cookie-text" className="m-0 mb-3.5 font-outfit text-sm leading-[1.55] font-normal text-muted">
        We use necessary cookies to keep you signed in, remember your language and keep forms secure. With your permission we
        also use analytics cookies to understand how the site is used.{" "}
        <a href="/cookies" className="font-semibold text-wine underline underline-offset-3 focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon">Read the Cookie Policy</a>
      </p>
      <div className="flex flex-wrap gap-2.5">
        <button type="button" className={btn("maroon", "md", COOKIE_BTN)} onClick={() => choose("all")}>Accept all</button>
        <button type="button" className={btn("ghost", "md", COOKIE_BTN)} onClick={() => choose("necessary")}>Only necessary</button>
      </div>
      {current && (
        <p className="m-0 mt-2.5 font-outfit text-[12.5px] leading-[28px] font-normal text-muted">
          Your current choice: {current === "all" ? "all cookies" : "only necessary cookies"}. Press Escape to keep it.
        </p>
      )}
    </div>
  );
}

/** The banner's buttons share the row; maroon focus ring on white. */
const COOKIE_BTN = "flex-[1_1_160px] focus-visible:outline-maroon!";

/** The footer's "Cookie settings": looks like the links beside it (was `.bh-linkbtn`). */
const LINK_BUTTON =
  "m-0 cursor-pointer appearance-none border-0 bg-transparent p-0 [font:inherit] text-[rgba(246,234,218,.82)] no-underline hover:text-gold-bright focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright";

/** "Cookie settings": reopens the banner. Styled like a footer link unless a className is given. */
export function CookieSettingsButton({ className = LINK_BUTTON, children = "Cookie settings" }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {children}
    </button>
  );
}
