"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement for a table of contents rendered on the server as
 * `<nav id={id}><details>… <a href="#section">` (not in legacy): opens the
 * `<details>` on desktop (on phones it stays a collapsed "On this page" box)
 * and marks the link of the section being read with `aria-current="location"`.
 * Without JS the box is simply collapsed and every link still works. Render it
 * after the nav, so its effect runs once the page has hydrated.
 */
export function TocEnhance({ id }: { id: string }) {
  useEffect(() => {
    const nav = document.getElementById(id);
    if (!nav) return;
    const details = nav.querySelector("details");
    if (details && window.matchMedia("(min-width: 992px)").matches) details.open = true;

    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const pairs = links
      .map((a) => [a, document.getElementById(decodeURIComponent(a.hash.slice(1)))] as const)
      .filter((p): p is readonly [HTMLAnchorElement, HTMLElement] => p[1] !== null);
    if (!pairs.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      let current = pairs[0][0];
      for (const [a, target] of pairs) {
        if (target.getBoundingClientRect().top < 160) current = a;
      }
      for (const [a] of pairs) {
        if (a === current) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [id]);
  return null;
}
