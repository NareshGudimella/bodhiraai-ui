"use client";

import { useEffect } from "react";

type Ids = { ga: string; gtm: string; pixel: string };
type Win = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
  _fbq?: unknown;
  __bhAnalytics?: boolean;
} & Record<string, unknown>;

const consent = () => /(?:^|;\s*)bh_consent=(all|necessary)(?:;|$)/.exec(document.cookie)?.[1] ?? null;

function script(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Loads GA4 (IP anonymised), GTM and the Pixel once. */
function load({ ga, gtm, pixel }: Ids) {
  const w = window as unknown as Win;
  if (ga) w[`ga-disable-${ga}`] = false;
  if (w.__bhAnalytics) {
    // Already loaded on this page view and then withdrawn: resume.
    if (pixel && w.fbq) w.fbq("consent", "grant");
    return;
  }
  w.__bhAnalytics = true;
  if (ga || gtm) w.dataLayer = w.dataLayer || [];
  if (ga) {
    w.gtag = function gtag() {
      // gtag.js reads the Arguments object, not an array.
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", ga, { anonymize_ip: true });
    script(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`);
  }
  if (gtm) {
    w.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
    script(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`);
  }
  if (pixel && !w.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue!.push(args);
    } as NonNullable<Win["fbq"]>;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    w.fbq = fbq;
    w._fbq = fbq;
    script("https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", pixel);
    fbq("track", "PageView");
  }
}

/** A visitor who withdraws consent: stop sending for the rest of this page view. */
function stop({ ga, pixel }: Ids) {
  const w = window as unknown as Win;
  if (ga) w[`ga-disable-${ga}`] = true;
  if (pixel && w.fbq) w.fbq("consent", "revoke");
}

/**
 * Consent-gated analytics (privacy: not in legacy). Loads the tags only when
 * the cookie banner's choice is `bh_consent=all`: at once if it already is,
 * else when the banner fires `bh-consent` with `all`. No choice or `necessary`
 * loads nothing. Scripts go in after hydration, so nothing runs before the
 * check.
 */
export function ConsentAnalytics(ids: Ids) {
  useEffect(() => {
    if (consent() === "all") load(ids);
    const onChoice = (e: Event) => {
      const value = (e as CustomEvent<string>).detail ?? consent();
      if (value === "all") load(ids);
      else stop(ids);
    };
    window.addEventListener("bh-consent", onChoice);
    return () => window.removeEventListener("bh-consent", onChoice);
    // The ids come from settings and don't change during a page view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
