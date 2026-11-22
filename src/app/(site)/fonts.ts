import { Outfit, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Plus Jakarta Sans, self-hosted (was the Google Fonts stylesheet; same subsets). Variable
 * (no `weight` list): Google then serves the same full 200–800 file the stylesheet did; a
 * weight list gets a 400–800 instance that renders a few pixels differently. Tailwind's
 * `font-sans` ("Plus Jakarta Sans") uses it.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext", "vietnamese", "cyrillic-ext"],
  display: "swap",
  variable: "--font-jakarta",
  // No metric-adjusted Arial fallback: glyphs the font lacks (→, Devanagari) fall back through
  // the same system fonts as before, not Arial.
  adjustFontFallback: false,
});
/**
 * The legacy theme's Outfit (its main.css loaded it from Google Fonts), kept where the
 * theme's rules showed it: the cookie banner's text and the side menu's contact list.
 * Not preloaded: it is only needed once one of those shows.
 */
const outfit = Outfit({ subsets: ["latin"], display: "swap", preload: false, adjustFontFallback: false, variable: "--font-outfit-face" });

/** Put on <html>: defines --font-jakarta and --font-outfit-face for site.css. */
export const fontVariables = `${jakarta.variable} ${outfit.variable}`;
