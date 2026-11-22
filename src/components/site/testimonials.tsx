"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { initials } from "./initials";

export type Testimonial = { id: number; name: string; role: string | null; company: string | null; quote: string; avatar: string | null; rating: number };

function Avatar({ t, size }: { t: Testimonial; size: number }) {
  return t.avatar ? (
    <img src={t.avatar} alt="" width={size} height={size} loading="lazy" />
  ) : (
    <span aria-hidden="true">{initials(t.name)}</span>
  );
}

/** One testimonial card (also used by the "In Their Words" grid). */
export function QuoteCard({ t }: { t: Testimonial }) {
  const by = [t.role, t.company].filter(Boolean).join(", ");
  return (
    <figure className="bh-qcard">
      <div className="bh-stars" aria-label={`${t.rating} out of 5`}>{"★".repeat(t.rating)}<span>{"★".repeat(5 - t.rating)}</span></div>
      <blockquote><p>{t.quote}</p></blockquote>
      <figcaption>
        <span className="bh-qcard__avatar"><Avatar t={t} size={44} /></span>
        <span><strong>{t.name}</strong>{by && <span>{by}</span>}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Homepage testimonials (CMS → Testimonials): one at a time, previous / next,
 * dots, auto-advance that pauses on hover/focus and under reduced motion. not in legacy
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;
  useEffect(() => {
    if (n < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => window.clearInterval(id);
  }, [n, paused]);
  const t = items[i];
  if (!t) return null;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const by = [t.role, t.company].filter(Boolean).join(", ");
  return (
    <div
      className="bh-quote"
      role="region"
      aria-roledescription="carousel"
      aria-label="What our users say"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon name="quote" size={34} className="bh-quote__mark" />
      <div key={t.id} className="bh-quote__slide" aria-live="polite">
        <div className="bh-stars" aria-label={`${t.rating} out of 5`}>{"★".repeat(t.rating)}<span>{"★".repeat(5 - t.rating)}</span></div>
        <blockquote><p>{t.quote}</p></blockquote>
        <div className="bh-quote__who">
          <span className="bh-quote__avatar"><Avatar t={t} size={56} /></span>
          <span>
            <strong>{t.name}</strong>
            {by && <span>{by}</span>}
          </span>
        </div>
      </div>
      {n > 1 && (
        <div className="bh-quote__nav">
          <div className="bh-quote__dots">
            {items.map((x, k) => (
              <button key={x.id} type="button" className={k === i ? "is-active" : undefined} onClick={() => setI(k)} aria-label={`Show testimonial ${k + 1} of ${n}`} aria-current={k === i ? "true" : undefined} />
            ))}
          </div>
          <div className="bh-quote__arrows">
            <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial"><Icon name="chevronLeft" size={18} /></button>
            <button type="button" onClick={() => go(1)} aria-label="Next testimonial"><Icon name="chevronRight" size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
