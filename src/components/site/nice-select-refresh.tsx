"use client";

import { useEffect } from "react";

type NiceSelect = { niceSelect(): void };

/**
 * Re-applies the theme's nice-select after React re-renders a form (a Server
 * Action redirect back replaces the <select> main.js had already styled).
 * The plugin skips selects that already have one, so running it again is safe.
 */
export function NiceSelectRefresh() {
  useEffect(() => {
    void window.__bodhiraTheme?.then(() => {
      (window.jQuery as unknown as (s: string) => NiceSelect)?.("select.niceSelect").niceSelect();
    });
  });
  return null;
}
