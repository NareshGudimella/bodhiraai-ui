"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Sidebar drawer state for small screens. From md up the sidebar is always
 * visible and sticky; below that it slides in over the page.
 */
const Ctx = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });

export function NavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

/** Hamburger in the top bar (hidden from md up). */
export function NavToggle({ label = "Menu" }: { label?: string }) {
  const { open, setOpen } = useContext(Ctx);
  return (
    <button
      type="button"
      id="nav-toggle"
      aria-label={label}
      aria-expanded={open}
      aria-controls="app-sidebar"
      onClick={() => setOpen(!open)}
      className="-ml-1 inline-flex size-9 items-center justify-center rounded-lg border border-line text-ink-2 hover:bg-primary-light md:hidden"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

/**
 * The sidebar column: sticky and viewport-high on desktop (scrolls on its own
 * when the nav is long), an off-canvas drawer with a backdrop on mobile.
 * Escape or a tap on a link / the backdrop closes it.
 */
export function NavDrawer({ children }: { children: ReactNode }) {
  const { open, setOpen } = useContext(Ctx);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      document.getElementById("nav-toggle")?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity motion-reduce:transition-none md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        id="app-sidebar"
        aria-label="Sidebar"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto overscroll-contain bg-brand text-primary-light shadow-xl transition-[transform,visibility] duration-200 motion-reduce:transition-none md:sticky md:top-0 md:z-30 md:h-dvh md:w-64 md:max-w-none md:shrink-0 md:translate-x-0 md:self-start md:shadow-none md:visible ${open ? "visible translate-x-0" : "invisible -translate-x-full"}`}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-4 inline-flex size-8 items-center justify-center rounded-lg text-primary-light/80 hover:bg-brand-lift md:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {children}
      </aside>
    </>
  );
}
