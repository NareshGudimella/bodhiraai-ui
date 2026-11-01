import type { CSSProperties } from "react";

/** Settings → Appearance, stored in the browser under legacy's keys so a choice made there carries over. */
export const THEME_KEY = "bodhira-theme";
export const CARDS_KEY = "bodhira-cards";

export type Theme = "classic" | "dark" | "light";
export type CardStyle = "plain" | "colorful";

/**
 * Runs in <head> before paint (legacy layouts' inline script): saved dark/light
 * theme, and colorful cards unless the user picked plain.
 */
export const APPEARANCE_SCRIPT = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);if(localStorage.getItem('${CARDS_KEY}')!=='plain')document.documentElement.setAttribute('data-cards','colorful');}catch(e){}`;

// Legacy's per-card palette: [soft, mid, light].
const PALETTE = [
  ["#EDE9FE", "#7C3AED", "#A78BFA"],
  ["#DCFCE7", "#15803D", "#4ADE80"],
  ["#FEF3C7", "#B45309", "#FBBF24"],
  ["#FCE7F3", "#BE185D", "#F472B6"],
  ["#DBEAFE", "#1D4ED8", "#60A5FA"],
  ["#CCFBF1", "#0F766E", "#2DD4BF"],
] as const;

/** Style for a `.ccard` at position `i`; only shown in colorful card mode. */
export function cardTone(i: number): CSSProperties {
  const [soft, mid, light] = PALETTE[i % PALETTE.length];
  return { "--cc-soft": soft, "--cc-mid": mid, "--cc-light": light } as CSSProperties;
}

/** Legacy's fixed indigo for teacher/student "AI tutor activity" cards (not part of the rotating palette). */
export const AI_TONE = { "--cc-soft": "#EEF2FF", "--cc-mid": "#4338CA", "--cc-light": "#A5B4FC" } as CSSProperties;
