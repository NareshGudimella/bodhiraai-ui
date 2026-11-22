import type { Metadata } from "next";
import { HeaderBar } from "@/components/site/header-client";
import { NotFoundContent } from "@/components/site/not-found-content";
import { preferWebp } from "@/lib/webp";
import { fontVariables } from "./(site)/fonts";
import "./(site)/site.css";

/**
 * URLs that match no route (SEO: not in legacy, where Laravel's 404 page used
 * the site layout). The app has two root layouts, so Next serves this file
 * with a 404 status instead of its default page (`experimental.globalNotFound`).
 * It is static (no API data, no Site Image Manager overrides): the site's 404
 * content (components/site/not-found-content.tsx) with the logo, the site's
 * stylesheet (site.css, as in the site layout) and no header menu or footer.
 */
export const metadata: Metadata = {
  title: "Page not found · Bodhira.ai",
  description: "The link you followed may be broken, or the page may have been moved.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <link rel="icon" href="/assets/img/favicon.png" />
      </head>
      <body>
        <HeaderBar>
          <div className="site-container flex min-h-[76px] items-center max-nav:min-h-16">
            {/* The marketing site is plain <a> links (full page loads; see AGENTS.md). */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages, @next/next/no-img-element */}
            <a href="/" className="inline-flex flex-none"><img src="/assets/img/logo/bodhira-logo-light.png" alt="Bodhira.ai" width={708} height={162} className="block h-[34px] w-auto max-w-none max-2xl:h-[31px] max-sm:h-7" /></a>
          </div>
        </HeaderBar>
        <main id="main">
          <NotFoundContent imageSrc={preferWebp("/assets/img/pages/blog/not-found.jpg")} />
        </main>
      </body>
    </html>
  );
}
