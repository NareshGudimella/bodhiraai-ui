"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Icon } from "./icons";
import { initials } from "./initials";
import { cx } from "./ui";

export type Testimonial = { id: number; name: string; role: string | null; company: string | null; quote: string; avatar: string | null; /** CMS rating 1–5; null = none entered (no stars shown, not in legacy: legacy assumed 5). */ rating: number | null };

function Avatar({ t, size }: { t: Testimonial; size: number }) {
  return (
    <span className="grid h-[52px] w-[52px] flex-none place-items-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#F0D29C,#C49560)] text-base font-extrabold text-maroon-deep">
      {t.avatar ? (
        <img src={t.avatar} alt="" width={size} height={size} loading="lazy" decoding="async" className="block h-full w-full max-w-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials(t.name)}</span>
      )}
    </span>
  );
}

/** Star rating: gold stars, the rest faint. */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="mb-3 text-base tracking-[2px] text-gold-2" role="img" aria-label={`Rated ${rating} out of 5`}>
      {"★".repeat(rating)}
      <span className="text-[rgba(42,14,19,.15)]">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

/** Name and role under a quote. */
function Who({ t }: { t: Testimonial }) {
  const by = [t.role, t.company].filter(Boolean).join(", ");
  return (
    <span>
      <strong className="block text-[15px] font-bold text-ink">{t.name}</strong>
      {by && <span className="block text-[13.5px] text-muted">{by}</span>}
    </span>
  );
}

/** One testimonial card (also used by the "In Their Words" grid). */
export function QuoteCard({ t }: { t: Testimonial }) {
  return (
    <figure className="m-0 flex flex-col rounded-lg border border-line bg-white p-7 shadow-xs">
      {t.rating !== null && <Stars rating={t.rating} />}
      <blockquote className="m-0"><p className="m-0 mb-4 font-sans text-base leading-[1.6] font-normal text-ink">{t.quote}</p></blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-4">
        <Avatar t={t} size={44} />
        <Who t={t} />
      </figcaption>
    </figure>
  );
}

const REDUCE = "(prefers-reduced-motion: reduce)";
function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Homepage testimonials (CMS → Testimonials): one at a time, previous / next,
 * dots, auto-advance that pauses on hover/focus and under reduced motion. not in legacy
 * A pause/play button stops the auto-advance for good (WCAG 2.2.2), and the slide is
 * announced only when it changes by user action, not on every auto-advance.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);
  const n = items.length;
  const playing = n > 1 && !stopped && !reduce;
  useEffect(() => {
    if (!playing || paused) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => window.clearInterval(id);
  }, [n, paused, playing]);
  const t = items[i];
  if (!t) return null;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  // Maroon focus ring on the white card, also inside dark sections.
  const focus = "focus-visible:rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon";
  return (
    <div
      className="relative z-1 rounded-lg bg-white p-7 shadow-md max-sm:p-5"
      role="region"
      aria-roledescription="carousel"
      aria-label="What our users say"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon name="quote" size={34} className="absolute top-6 right-6 text-[rgba(196,149,96,.35)]" />
      <div key={t.id} className="animate-fade-in motion-reduce:animate-none" aria-live={playing ? "off" : "polite"}>
        {t.rating !== null && <Stars rating={t.rating} />}
        <blockquote className="m-0">
          <p className="m-0 mb-6 min-h-[5em] font-sans text-[18px] leading-[1.6] font-medium text-ink max-sm:min-h-0 max-sm:text-base">{t.quote}</p>
        </blockquote>
        <div className="flex items-center gap-3">
          <Avatar t={t} size={56} />
          <Who t={t} />
        </div>
      </div>
      {n > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          {/* Dots: a 24px hit area around the 8px dot (WCAG 2.5.8), inactive dots at 3:1 on white. a11y pass, not in legacy */}
          <div className="flex gap-0">
            {items.map((x, k) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Show testimonial ${k + 1} of ${n}`}
                aria-current={k === i ? "true" : undefined}
                className={cx(
                  "grid h-6 w-6 place-items-center rounded-full border-0 bg-transparent p-0",
                  "before:h-2 before:w-2 before:rounded-full before:bg-[rgba(42,14,19,.5)] before:transition-[width,background] before:duration-300 before:ease-bh before:content-['']",
                  "aria-[current=true]:w-8 aria-[current=true]:before:w-6 aria-[current=true]:before:bg-wine motion-reduce:before:transition-none",
                  focus,
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {!reduce && (
              <button type="button" onClick={() => setStopped((x) => !x)} aria-label={stopped ? "Play testimonials" : "Pause testimonials"} className={cx(ARROW, focus)}>
                <Icon name={stopped ? "play" : "pause"} size={16} />
              </button>
            )}
            <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className={cx(ARROW, focus)}><Icon name="chevronLeft" size={18} /></button>
            <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className={cx(ARROW, focus)}><Icon name="chevronRight" size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

const ARROW =
  "grid h-10 w-10 place-items-center rounded-full border border-line-2 bg-white text-ink transition-[background,color,border-color] duration-200 hover:border-maroon hover:bg-maroon hover:text-white motion-reduce:transition-none";
