import type { Metadata } from "next";
import { connection } from "next/server";
import { SiteAnalytics } from "@/components/site/analytics";
import { CookieConsent } from "@/components/site/cookie-consent";
import { SiteFooter } from "@/components/site/footer";
import { CursorDot } from "@/components/site/footer-client";
import { SiteHeader } from "@/components/site/header";
import { SiteSchema } from "@/components/site/site-schema";
import { VideoPopup } from "@/components/site/video-popup";
import { fontVariables } from "./fonts";
import "./site.css";

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

/**
 * Root layout of the public marketing site (legacy layouts/app.blade.php).
 * It has its own <html> and stylesheet (site.css, Tailwind with the site's own
 * tokens; the dashboards have theirs), and moving between the two is a full page load.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SiteAnalytics />
        {/* Organization + WebSite JSON-LD (SEO: not in legacy) */}
        <SiteSchema />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {/*
          The theme's jQuery stack (jQuery, meanmenu, VenoBox, SmoothScroll, main.js) is gone since the
          Tailwind migration (not in legacy): the side menu, back to top, video pop-up and cursor dot are
          React; SmoothScroll's eased wheel scrolling is now the browser's native scrolling.
        */}
        <VideoPopup />
        {/* Cookie banner (not in legacy): stores bh_consent, fires `bh-consent` */}
        <CookieConsent />
        <CursorDot />
      </body>
    </html>
  );
}

