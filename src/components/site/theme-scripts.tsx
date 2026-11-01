"use client";

import { useEffect } from "react";

/** The theme's jQuery stack, in the legacy layout's order. */
const SCRIPTS = [
  "jquary-3.6.0.min.js",
  "modernizr-2.8.3-respond-1.4.2.min.js",
  "bootstrap-bundle.js",
  "jquery.isotope.js",
  "waypoints.min.js",
  "moment.min.js",
  "daterangepicker.min.js",
  "venobox.min.js",
  "odometer.min.js",
  "countdown.js",
  "meanmenu.js",
  "smooth-scroll.js",
  "imagesloaded-pkgd.js",
  "wow.min.js",
  "jquery.carouselTicker.js",
  "jquery.magnific-popup.min.js",
  "nice-select.js",
  "swiper.min.js",
].map((f) => `/assets/js/vendor/${f}`).concat("/assets/js/main.js");

declare global {
  interface Window {
    jQuery?: (target: unknown) => { trigger(event: string): void };
    __bodhiraTheme?: Promise<void>;
    __bodhiraThemeReady?: boolean;
  }
}

function load(src: string) {
  return new Promise<void>((resolve) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = s.onerror = () => resolve();
    document.body.appendChild(s);
  });
}

/**
 * Loads the theme scripts after React has hydrated: they rewrite the DOM
 * (sliders, nice-select, the mobile menu), which must not happen before
 * hydration. main.js hides the preloader on window "load", which has already
 * fired by then, so it is triggered again. Page scripts that need jQuery wait
 * on window.__bodhiraTheme.
 */
export function ThemeScripts() {
  useEffect(() => {
    window.__bodhiraTheme ??= (async () => {
      for (const src of SCRIPTS) await load(src);
      window.jQuery?.(window).trigger("load");
      window.__bodhiraThemeReady = true;
    })();
  }, []);
  return null;
}
