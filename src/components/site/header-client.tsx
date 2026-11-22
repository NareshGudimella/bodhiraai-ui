"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Icon } from "./icons";

/** The sticky header's compact state once the page scrolls past 24px (not in legacy). */
function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

/** The sticky, blurred header bar; `data-scrolled` compacts it (`group-data-scrolled/header:`). */
export function HeaderBar({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
  return (
    <header
      data-scrolled={scrolled || undefined}
      className="group/header sticky top-0 z-90 border-b border-[rgba(226,184,115,.12)] bg-[rgba(70,18,30,.86)] bg-[linear-gradient(100deg,rgba(42,14,19,.92),rgba(92,26,38,.88)_60%,rgba(122,36,55,.86))] [-webkit-backdrop-filter:saturate(160%)_blur(14px)] [backdrop-filter:saturate(160%)_blur(14px)] transition-shadow duration-250 ease-bh data-scrolled:shadow-[0_10px_30px_-14px_rgba(0,0,0,.55)] motion-reduce:transition-none"
    >
      {children}
    </header>
  );
}

type Menu = { open: boolean; setOpen: (open: boolean) => void; burger: React.RefObject<HTMLButtonElement | null> };
const MenuContext = createContext<Menu | null>(null);

function useMenu() {
  const m = useContext(MenuContext);
  if (!m) throw new Error("Mobile menu parts must sit inside <MobileMenuProvider>");
  return m;
}

/** Shares the side menu's open state between the burger (in the header) and the panel. */
export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  return <MenuContext.Provider value={{ open, setOpen, burger }}>{children}</MenuContext.Provider>;
}

/** The burger (≤992px). Toggles the side menu, like the theme's `.mobile-side-menu-toggle`. */
export function MenuButton() {
  const { open, setOpen, burger } = useMenu();
  return (
    <button
      ref={burger}
      type="button"
      className="hidden h-11 w-11 place-items-center rounded-sm border border-[rgba(255,255,255,.16)] bg-[rgba(255,255,255,.08)] p-0 text-white hover:bg-[rgba(255,255,255,.16)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright max-nav:grid"
      aria-label="Open menu"
      aria-expanded={open}
      aria-controls="bh-mobile-menu"
      onClick={() => setOpen(!open)}
    >
      <Icon name="menu" size={22} />
    </button>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The off-canvas side menu (≤992px): logo + close, the header's menu, Sign In and the
 * contact list. The legacy theme built it with jQuery meanmenu (main.js); this is the same
 * look in React (Tailwind migration, not in legacy). Keyboard (not in legacy, was
 * mobile-menu-a11y.tsx): a modal dialog that is `inert` while closed, takes focus on open,
 * keeps Tab inside, closes on Escape, the overlay or a resize past 992px, and gives focus
 * back to the burger. While it is open the cookie banner hides (`data-open` on #bh-mobile-menu).
 */
export function MobileMenu({ head, nav, signIn, contact }: { head: ReactNode; nav: ReactNode; signIn: ReactNode; contact: ReactNode }) {
  const { open, setOpen, burger } = useMenu();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const close = useCallback(() => setOpen(false), [setOpen]);

  // Focus in on open (after the slide-in starts, so the browser doesn't scroll the off-screen panel into view), back to the burger on close.
  useEffect(() => {
    if (open && !wasOpen.current) {
      const id = window.setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), 50);
      wasOpen.current = true;
      return () => window.clearTimeout(id);
    }
    if (!open && wasOpen.current) {
      wasOpen.current = false;
      const active = document.activeElement;
      if (!active || active === document.body || panel.current?.contains(active)) burger.current?.focus({ preventScroll: true });
    }
  }, [open, burger]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !panel.current.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Above 992px the panel is display:none; a resize while open closes it.
    const wide = window.matchMedia("(min-width: 993px)");
    const onWide = () => {
      if (wide.matches) close();
    };
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open, close]);

  return (
    <>
      <div
        ref={panel}
        id="bh-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-open={open || undefined}
        inert={!open}
        className="fixed top-0 right-0 z-100 hidden h-full w-[min(86vw,340px)] max-w-[86vw] overflow-y-auto bg-white p-10 font-sans text-base leading-[1.625] font-normal text-legacy-text [backface-visibility:hidden] [transform:translateX(100%)] transition-transform duration-500 ease-[ease] data-open:[transform:translateX(0)] max-nav:block max-md:px-5"
      >
        <div>
          <div className="mb-[60px] flex items-center justify-between border-b border-[rgba(226,184,115,.2)] bg-maroon-deep px-5 py-[18px]">
            {head}
            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="fixed top-[45px] right-10 z-2 grid h-10 w-10 place-items-center rounded-full border border-line-2 bg-white text-[17px] text-maroon shadow-sm hover:bg-maroon hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon max-md:right-4"
            >
              <Icon name="close" size={22} />
            </button>
          </div>
          <div className="mb-[50px] overflow-hidden">
            <nav className="pt-5">
              <ul className="m-0 block list-none p-0">{nav}</ul>
            </nav>
          </div>
          {signIn}
          {contact}
        </div>
      </div>
      <div
        aria-hidden="true"
        data-open={open || undefined}
        onClick={close}
        className="invisible fixed top-0 right-0 z-10 hidden h-full w-0 bg-[rgba(0,0,0,.7)] opacity-0 transition-all duration-600 ease-[ease] data-open:visible data-open:w-full data-open:cursor-[url(/assets/img/cancel.png),auto] data-open:opacity-50 max-nav:block"
      />
    </>
  );
}
