"use client";

import { useEffect } from "react";

/** Reads a site flash once: clears the cookie after the page has shown it. */
export function FlashClear() {
  useEffect(() => {
    document.cookie = "bodhira_site_flash=; Max-Age=0; path=/";
  }, []);
  return null;
}
