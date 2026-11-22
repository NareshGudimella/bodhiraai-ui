"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Icon } from "./icons";
import { cx } from "./ui";

/** One rendition of a banner: the full-size file plus an optional smaller copy for `srcset`. */
export type BannerArt = { src: string; width: number; height: number; small?: { src: string; width: number } };

export type BannerSlide = {
  id: string;
  /** Finished artwork (headline and copy baked in): landscape for ≥768px, portrait for phones. */
  desktop: BannerArt;
  mobile: BannerArt;
  /** Describes the scene and repeats the artwork's headline and sub-text. */
  alt: string;
  /** Visually hidden heading + text that repeat the artwork's words (slide 1: the page's <h1>). */
  text: ReactNode;
  /** Buttons shown in the bar under the card while this slide is active. */
  actions: ReactNode;
};

const INTERVAL = 6000;
const PHONE = "(max-width: 767px)";
const DESKTOP_SIZES = "(max-width: 1279px) calc(100vw - 32px), 1248px";
const MOBILE_SIZES = "calc(100vw - 32px)";
const REDUCE = "(prefers-reduced-motion: reduce)";
function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}
const srcSet = (a: BannerArt) => (a.small ? `${a.small.src} ${a.small.width}w, ${a.src} ${a.width}w` : undefined);

/**
 * Homepage hero card (2026, not in legacy): Bodhira's own banner artwork in a
 * rounded card, crossfading every 6s, with a bar under it holding the active
 * slide's buttons, the trust line and the controls. WAI-ARIA carousel pattern:
 * autoplay pauses on hover, while focus is inside and while the tab is hidden,
 * never starts under prefers-reduced-motion, and the pause button stops it
 * (WCAG 2.2.2). Each slide is a <picture>: the portrait artwork on phones
 * (≤767px), the landscape one otherwise, so only the matching set downloads.
 * Slide 1 is server-rendered and visible without JS; hidden slides are
 * aria-hidden + inert. Tailwind since the migration (was `.bh-hero-card*` in home.css).
 */
export function HomeBanner({ slides, label, trust }: { slides: BannerSlide[]; label: string; trust?: ReactNode }) {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  /** null = the default: playing, unless the visitor prefers reduced motion. */
  const [stopped, setStopped] = useState<boolean | null>(null);
  /** Set after a user action, so screen readers announce the new slide (not on autoplay). */
  const [announce, setAnnounce] = useState(false);
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);
  const hidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const isStopped = stopped ?? reduce;
  const running = n > 1 && !isStopped && !hovered && !focused && !hidden;

  // One timer per slide: a manual change restarts the 6 seconds.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((x) => (x + 1) % n), INTERVAL);
    return () => window.clearTimeout(id);
  }, [running, active, n]);

  const go = useCallback(
    (i: number) => {
      setAnnounce(true);
      setActive(((i % n) + n) % n);
    },
    [n],
  );

  if (n === 0) return null;

  return (
    <section
      className="bg-cream p-0"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(e) => {
        if (n < 2 || e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
      }}
    >
      <div className="m-0 w-full bg-white">
          <div
            className="relative aspect-[1672/941] bg-cream-2 max-md:aspect-[941/1672]"
            aria-live={announce && !running ? "polite" : "off"}
            onTouchStart={(e) => {
              const t = e.touches[0];
              touch.current = t ? { x: t.clientX, y: t.clientY } : null;
            }}
            onTouchEnd={(e) => {
              const start = touch.current;
              const t = e.changedTouches[0];
              touch.current = null;
              if (!start || !t || n < 2) return;
              const dx = t.clientX - start.x;
              if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(t.clientY - start.y) * 1.5) go(active + (dx < 0 ? 1 : -1));
            }}
          >
            {slides.map((s, i) => {
              const on = i === active;
              return (
                <div
                  key={s.id}
                  id={`bh-hero-${s.id}`}
                  className={cx(
                    "absolute inset-0 motion-reduce:transition-none",
                    on ? "visible z-1 opacity-100 [transition:opacity_.65s_ease,visibility_0s]" : "invisible opacity-0 [transition:opacity_.65s_ease,visibility_0s_linear_.65s]",
                  )}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${n}`}
                  aria-hidden={on ? undefined : true}
                  inert={!on}
                >
                  <div className="sr-only">{s.text}</div>
                  <picture className="block h-full w-full">
                    <source media={PHONE} srcSet={srcSet(s.mobile) ?? s.mobile.src} sizes={MOBILE_SIZES} width={s.mobile.width} height={s.mobile.height} />
                    <img
                      className="block h-full w-full max-w-full object-contain"
                      src={s.desktop.src}
                      srcSet={srcSet(s.desktop)}
                      sizes={DESKTOP_SIZES}
                      alt={s.alt}
                      width={s.desktop.width}
                      height={s.desktop.height}
                      {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
                      decoding={i === 0 ? undefined : "async"}
                    />
                  </picture>
                </div>
              );
            })}
          </div>

          <div className="border-b border-line bg-white">
            <div className="site-container flex flex-wrap items-center gap-x-6 gap-y-3 py-3.5 max-md:gap-3 max-md:pb-4">
            <div className="order-1 max-md:basis-full">
              {slides.map((s, i) => (
                // On phones the two buttons share a row: tighter padding and type.
                <div key={s.id} className="flex flex-wrap gap-2.5 max-md:grid max-md:grid-cols-2 max-md:gap-2 max-md:*:px-3 max-md:*:text-[14.5px]" hidden={i !== active}>{s.actions}</div>
              ))}
            </div>
            {n > 1 && (
              <div className="order-3 flex items-center gap-3 max-xl:order-2 max-xl:ml-auto max-md:ml-0 max-md:basis-full max-md:justify-between">
                <div className="flex max-md:-ml-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      className={cx(
                        "grid h-8 w-7 cursor-pointer place-items-center border-0 bg-transparent p-0",
                        "before:h-2 before:w-2 before:rounded-full before:bg-[rgba(92,26,38,.25)] before:transition-[width,background-color] before:duration-300 before:ease-bh before:content-[''] hover:before:bg-[rgba(92,26,38,.5)]",
                        "aria-[current=true]:before:w-[22px] aria-[current=true]:before:bg-wine motion-reduce:before:transition-none",
                        FOCUS,
                      )}
                      onClick={() => go(i)}
                      aria-label={`Show slide ${i + 1} of ${n}`}
                      aria-controls={`bh-hero-${s.id}`}
                      aria-current={i === active ? "true" : undefined}
                    />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => setStopped(!isStopped)} aria-label={isStopped ? "Start automatic slide show" : "Stop automatic slide show"} className={ROUND}>
                    <Icon name={isStopped ? "play" : "pause"} size={15} />
                  </button>
                  <button type="button" onClick={() => go(active - 1)} aria-label="Previous slide" className={ROUND}>
                    <Icon name="chevronLeft" size={18} />
                  </button>
                  <button type="button" onClick={() => go(active + 1)} aria-label="Next slide" className={ROUND}>
                    <Icon name="chevronRight" size={18} />
                  </button>
                </div>
              </div>
            )}
            {trust && <div className="order-2 min-w-0 flex-[1_1_0] max-xl:order-3 max-xl:mr-0 max-xl:basis-full max-xl:border-t max-xl:border-line max-xl:pt-3">{trust}</div>}
            </div>
          </div>
      </div>
    </section>
  );
}

const FOCUS = "focus-visible:rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon";
/** Round control (pause / previous / next). */
const ROUND = cx(
  "grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line-2 bg-white p-0 text-maroon transition-[background-color,border-color] duration-200 hover:border-[rgba(92,26,38,.3)] hover:bg-cream motion-reduce:transition-none",
  FOCUS,
);
