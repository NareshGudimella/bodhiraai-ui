import type { Metadata } from "next";
import { connection } from "next/server";
import { SiteAnalytics } from "@/components/site/analytics";
import { SiteFooter } from "@/components/site/footer";
import { SiteEnhance } from "@/components/site/site-enhance";
import { SiteHeader } from "@/components/site/header";
import { ThemeScripts } from "@/components/site/theme-scripts";

/**
 * The marketing pages render per request and may block (no streaming shell),
 * so a missing post answers a real 404 like legacy, not a streamed 200.
 * `instant = false` only switches off the shell validation; the layout also
 * awaits connection() before its <html>, so even /blog/[slug] has no
 * prerendered fallback shell to stream ahead of the page.
 */
export const instant = false;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
};

/** The legacy marketing theme's stylesheets, in the legacy layout's order. */
const STYLES = [
  "bootstrap.min.css",
  "fontawesome.min.css",
  "venobox.min.css",
  "animate.min.css",
  "keyframe-animation.css",
  "odometer.min.css",
  "nice-select.css",
  "daterangepicker.css",
  "magnific-popup.css",
  "swiper.min.css",
  "main.css",
  "bodhira-theme.css",
  "site-layout.css",
  // 2026 redesign (not in legacy): header/footer for every page, the homepage (scoped to .bh-home)
  // and the design kit for migrated pages (scoped to .bh-page, see docs/site-design-kit.md).
  "site-chrome.css",
  "home.css",
  "site-ui.css",
  // Per-group additions to the kit, one file per page group so they can be edited independently.
  "site-ui-content.css",
  "site-ui-blog.css",
  "site-ui-forms.css",
];

/**
 * Root layout of the public marketing site (legacy layouts/app.blade.php).
 * It has its own <html>: the Bootstrap theme can't share the dashboards'
 * Tailwind reset, and moving between the two is a full page load.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return (
    <html lang="en" className="no-js">
      <head>
        {STYLES.slice(0, 2).map((f) => <link key={f} rel="stylesheet" href={`/assets/css/${f}`} />)}
        {/* Newer Font Awesome 6.5 so modern brand glyphs (e.g. X / fa-x-twitter) render */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        {/* Plus Jakarta Sans for the redesigned header, footer and homepage (not in legacy). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
        {STYLES.slice(2).map((f) => <link key={f} rel="stylesheet" href={`/assets/css/${f}`} />)}
      </head>
      <body>
        <SiteAnalytics />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ThemeScripts />
        <SiteEnhance />
      </body>
    </html>
  );
}

