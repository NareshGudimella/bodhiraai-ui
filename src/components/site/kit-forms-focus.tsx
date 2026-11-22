"use client";

import { useEffect } from "react";

/**
 * After a lead form redirects back with a flashed status or errors, moves
 * focus to that message (`[data-kf-focus]`, tabIndex -1) and scrolls it into
 * view, so keyboard and screen-reader users land on the result. not in legacy.
 * Render it next to the message, only when there is one.
 */
export function KfFocusResult() {
  useEffect(() => {
    const el = [...document.querySelectorAll<HTMLElement>("[data-kf-focus]")].find((e) => e.offsetParent !== null);
    if (el) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, []);
  return null;
}
