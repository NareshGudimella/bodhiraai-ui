"use client";

import { useSyncExternalStore } from "react";
import { CARDS_KEY, THEME_KEY, type CardStyle, type Theme } from "@/lib/appearance";

const THEMES: { value: Theme; icon: string; label: string }[] = [
  { value: "classic", icon: "☀️", label: "Classic" },
  { value: "dark", icon: "🌙", label: "Dark Mode" },
  { value: "light", icon: "🌗", label: "Light Mode" },
];
const CARDS: { value: CardStyle; icon: string; label: string; hint: string }[] = [
  { value: "plain", icon: "🟤", label: "Plain", hint: "One gold tone" },
  { value: "colorful", icon: "🌈", label: "Colorful", hint: "Color per card" },
];

// The <html> attributes are the source of truth (set before paint, see APPEARANCE_SCRIPT).
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const readTheme = (): Theme => {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "dark" || t === "light" ? t : "classic";
};
const readCards = (): CardStyle =>
  document.documentElement.getAttribute("data-cards") === "colorful" ? "colorful" : "plain";

function apply(attr: "data-theme" | "data-cards", key: string, value: string, on: boolean) {
  const root = document.documentElement;
  if (on) root.setAttribute(attr, value);
  else root.removeAttribute(attr);
  try {
    localStorage.setItem(key, value);
  } catch {}
  listeners.forEach((fn) => fn());
}

const setTheme = (t: Theme) => apply("data-theme", THEME_KEY, t, t !== "classic");
const setCards = (c: CardStyle) => apply("data-cards", CARDS_KEY, c, c === "colorful");

const optionClass =
  "flex-1 rounded-xl border border-line bg-card px-3 py-3 text-center text-sm font-semibold text-ink-2 transition hover:bg-primary-light aria-pressed:border-primary aria-pressed:bg-primary-light aria-pressed:text-ink";

/** Settings → Appearance (legacy pmSetTheme / pmSetCards): switches instantly and is remembered in this browser. */
export function AppearancePicker() {
  // Server render shows the defaults; the client reads the real values after hydration.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "classic" as Theme);
  const cards = useSyncExternalStore(subscribe, readCards, () => "colorful" as CardStyle);
  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="group" aria-label="Theme">
        {THEMES.map((o) => (
          <button key={o.value} type="button" aria-pressed={theme === o.value} onClick={() => setTheme(o.value)} className={optionClass}>
            <span aria-hidden className="block text-xl">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>
      <div>
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-ink-3">Card Style</p>
        <div className="flex gap-2" role="group" aria-label="Card style">
          {CARDS.map((o) => (
            <button key={o.value} type="button" aria-pressed={cards === o.value} onClick={() => setCards(o.value)} className={optionClass}>
              <span aria-hidden className="block text-xl">{o.icon}</span>
              {o.label}
              <small className="block font-medium text-ink-3">{o.hint}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
