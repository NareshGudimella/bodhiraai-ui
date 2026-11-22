"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Icon } from "./icons";

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

/**
 * Back to top (legacy main.js `#scrollup`, jQuery): slides in once the page has scrolled
 * 100px, jumps to the top (smoothly where the root's `scroll-behavior` allows, as before).
 * React since the Tailwind migration (not in legacy). Out of the tab order while hidden
 * (`visibility: hidden`), maroon with a white arrow (a11y pass, not in legacy).
 */
export function BackToTop() {
  const show = useSyncExternalStore(subscribeScroll, () => window.scrollY > 100, () => false);
  return (
    <div id="scrollup" data-show={show || undefined} className="group/top fixed right-[30px] bottom-[30px] z-999 h-[45px] w-[45px] overflow-hidden">
      <button
        type="button"
        id="scroll-top"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0 })}
        className="invisible grid h-full w-full place-items-center rounded-[5px] border border-[rgba(226,184,115,.55)] bg-grad-maroon p-0 text-center text-[20px] leading-[40px] text-white no-underline outline-none [transform:translateY(150%)] transition-all duration-300 ease-in-out group-data-show/top:visible group-data-show/top:[transform:translateY(0)] hover:opacity-80 focus-visible:outline-2 focus-visible:-outline-offset-5 focus-visible:outline-white"
      >
        <Icon name="arrowUp" size={20} />
      </button>
    </div>
  );
}

/**
 * The legacy theme's cursor dot (main.js `.mt-cursor`): a 10px gold dot that trails the mouse
 * on screens from 992px. Kept for parity in React since the Tailwind migration (not in legacy).
 */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 15}px,${e.clientY - 15}px)`;
      el.style.visibility = "inherit";
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="lg:pointer-events-none lg:invisible lg:fixed lg:top-2.5 lg:left-2.5 lg:z-[10000] lg:block lg:h-2.5 lg:w-2.5 lg:rounded-full lg:select-none lg:transition-all lg:duration-300 lg:ease-[cubic-bezier(.165,.84,.44,1)] lg:before:absolute lg:before:top-0 lg:before:left-0 lg:before:h-full lg:before:w-full lg:before:rounded-full lg:before:bg-gold lg:before:opacity-100 lg:before:transition-all lg:before:duration-300 lg:before:ease-[ease] lg:before:content-['']"
    />
  );
}
