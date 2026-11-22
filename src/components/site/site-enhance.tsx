"use client";

import { useEffect } from "react";

/** The redesigned header's compact state once the page scrolls (not in legacy). */
export function SiteEnhance() {
  useEffect(() => {
    const header = document.querySelector(".bh-header");
    const onScroll = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}

/**
 * Fade-up for the page's `[data-reveal]` blocks as they enter the viewport
 * (not in legacy). Render it at the end of the page, so its effect runs after
 * that page has hydrated (changing classes earlier breaks hydration). Without
 * JS, or with reduced motion, everything is simply visible.
 */
export function RevealOnScroll() {
  useEffect(() => {
    let io: IntersectionObserver | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!reduce && blocks.length && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io?.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      for (const el of blocks) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) continue; // already on screen: never hide it
        el.classList.add("is-pending");
        io.observe(el);
      }
    }
    return () => io?.disconnect();
  }, []);
  return null;
}
