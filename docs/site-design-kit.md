# Marketing site design kit

The 2026 redesign of the public marketing pages (`src/app/(site)/*`, not in legacy), built with
**Tailwind CSS 4**. The homepage set the look; the kit makes it reusable for every other page.
Until 2026-11 the site ran on the legacy Bootstrap theme (main.css, jQuery, Font Awesome) plus the
redesign's own stylesheets; the migration replaced them pixel for pixel and removed them. The site
now loads one stylesheet (`site.css`), no jQuery and no icon font.

## Files

| File | What |
|---|---|
| `src/app/(site)/site.css` | The site's stylesheet, imported by the site layout and `app/global-not-found.tsx`: `@theme` tokens, `@layer base` (element defaults), `@utility`s, the reveal-on-scroll rules. Imports the two below |
| `src/app/(site)/site-blog.css` | `site-prose` (+ `site-prose-article`, `site-prose-legal`): CMS HTML of blog posts and the legal pages' text |
| `src/app/(site)/site-forms.css` | Lead-form utilities that would be unreadable inline (`kf-select-chevron`, the alert's bullets) |
| `src/app/(site)/fonts.ts` | Plus Jakarta Sans and Outfit through `next/font/google` (self-hosted; `fontVariables` goes on `<html>`) |
| `src/components/site/ui.ts` | Shared class strings: `cx()`, `btn(variant, size, extra)`, `focusRing` / `focusRingGold`, `eyebrowClass()`, `h2Class()`, `lead()`, `textLink()`, `GLASS`, `PAGE`, `FOCUS`, `BTN_FOCUS(_DARK)`, `HERO_GLASS*` + `heroGlassLabel()` |
| `src/components/site/icons.tsx` | `<Icon name>` (line icons, Lucide paths) and `<BrandIcon name size>` (social marks + the solid xmark, Font Awesome Free paths, CC BY 4.0); `brandFor(platform, iconClass)` for CMS social links |
| `src/components/site/kit-content-icons.tsx` | More line icons (`<CIcon>` takes a name from either set) and `cmsIcon()`: CMS Font Awesome names → line icon |
| `src/components/site/page-kit.tsx`, `page-hero.tsx` | `Eyebrow`, `Breadcrumbs` (+ BreadcrumbList JSON-LD), `SectionHead`, `CheckList`, `CtaBand`; `PageHero` |
| `src/components/site/kit-content-ui.tsx`, `kit-content-cards.tsx`, `kit-content-tabs.tsx` | Content pages (about, pricing, features, courses, course, course-details, teachers, success-stories, shop): `section()`, `GRID` + `COLS`, `card()`, `tile()`, `badge()`, `CHIPS`/`CHIP`, `HeroBadge`, `Counters`, media/person cards, `PLAY`, pager; story cards, stars, avatars, tabs |
| `src/components/site/kit-blog-ui.ts`, `kit-blog-*.tsx`, `post-card.tsx`, `legal-page.tsx`, `site-pagination.tsx`, `not-found-content.tsx` | Blog, FAQ, legal pages, 404: `section()`, `tile()`, `badge()`, `LABEL`, `POST_GRID`, `ARTICLE_HOVER`, covers, the legal table of contents |
| `src/components/site/kit-forms-fields.tsx`, `kit-forms-focus.tsx` | Contact, book-demo, student-registration: layout, form card, `KfInput`/`KfSelect`/`KfTextarea`, `KfConsent`, `KfAlert`, side cards |
| `src/components/site/header.tsx`, `header-client.tsx`, `nav-items.tsx` | Top bar, sticky header (`HeaderBar`: `data-scrolled` compacts it), React side menu (`MobileMenu*`) |
| `src/components/site/footer.tsx`, `footer-client.tsx` | Footer, `BackToTop`, `CursorDot` (the theme's trailing dot, kept for parity) |
| `src/components/site/video-popup.tsx`, `vdo-player.tsx` | `VideoPopup`: `a.video-popup` YouTube links open in an accessible dialog. `VdoPlayer`: `.vdo-play` + `data-vdo-video` opens VdoCipher |
| `src/components/site/site-enhance.tsx`, `cookie-consent.tsx`, `consent-analytics.tsx` | `RevealOnScroll`; cookie banner (`bh_consent`, fires `bh-consent`); analytics only after consent |

`public/assets/` holds images only (`img/`; photos in `img/{home,pages,auth}` with `CREDITS.md` per folder).

## Tokens (`@theme` in site.css)

- Colours: `maroon` #5C1A26, `wine` #7A2437, `maroon-deep` #2A0E13, `maroon-900` #1E0A0E, `gold` #C49560,
  `gold-2` #A87840, `gold-bright` #E2B873, `gold-text`, `cream` #FBF6EF, `cream-2` #F5ECDF, `ink` #1F0B10,
  `body` #5A4A46, `muted` #7D6C66, `line` / `line-2` (8% / 12% ink), `ivory` #FFF7EA (headings on maroon),
  `error`, and `legacy-heading` / `legacy-text` / `legacy-border` (the theme colours the side menu and base
  element defaults keep). Gradients are utilities: `bg-grad-maroon`, `bg-grad-gold`, `text-grad` /
  `text-grad-light` (gradient text).
- Fonts: `font-sans` (Plus Jakarta Sans), `font-outfit` (only where the theme showed Outfit: cookie banner
  text, side-menu contact list). Sizes `text-xs/sm/base/lg/xl/2xl` = 12/14/16/18/20/24px **without** a line
  height; always set `leading-*`. Most sizes are arbitrary (`text-[15px]`, `text-[length:clamp(...)]`).
- Radii `rounded-sm/md/lg/xl/full` = 12/16/24/32/999px. Shadows `shadow-xs/sm/md/lg`. Easing `ease-bh`.
  Animations `animate-pulse-ring`, `animate-fade-in`.
- Breakpoints (desktop first, as the old CSS): `max-sm:` ≤575, `max-md:` ≤767, `max-lg:` ≤991 (`lg:` ≥992),
  `max-nav:` ≤992 / `nav:` ≥993 (header burger), `max-xl:` ≤1199, `max-2xl:` ≤1279, `max-xs:` ≤480;
  use `max-[1101px]:` for one-offs. Section padding is 112 → 88 → 72 → 64px (`section()` in the kits).
- `site-container`: the 1248px column with 24px gutters (16px ≤575).
- `hover:` is plain `:hover` (redefined, as the legacy CSS behaved), not Tailwind's hover-capable-devices default.
- `@layer base` keeps the element defaults the legacy theme gave every page (body 16px/1.625 in
  `legacy-text` on cream, `h1`–`h6` sizes, `p` 16px/28px with 15px below, gold links, form controls not
  stripped). Components set their own font, colour, size, line height and margins; don't rely on these.

## Conventions

- Never put two utilities for the same property in one class list (`mb-8 mb-5`, `flex inline-flex`):
  Tailwind orders them, not the string. Shorthand + longhand (`m-0 mb-5`, `p-0 px-4`) is fine. Helpers take
  parameters for what callers change (`btn("gold", "custom", "min-h-[42px] px-5 text-[15px]")`,
  `h2Class(light, flush)`, `lead("mb-5")`, `heroGlassLabel("mt-1")`). For responsive overrides of a state
  (`data-scrolled`), make the conditions exclusive (`sm:group-data-scrolled/header:h-[30px]!`).
- Don't use `before:`/`after:` with `**:` or on containers that shouldn't get a pseudo-element: Tailwind adds
  `content` with them (an empty `::before` became a stray grid item once); use an `@utility` instead
  (see `reduce-motion-tree`).
- Buttons: `btn("maroon" | "ghost" | "gold" | "glass", "md" | "lg" | "custom", extra)`; max one primary per
  block. Gold focus ring by default; on light backgrounds add `BTN_FOCUS` (maroon ring, 8px corners), in a
  maroon CTA band `BTN_FOCUS_DARK`. Links: `FOCUS`; buttons: `focusRing`.
- `bh-icon` (on every `Icon`/`CIcon`) is the hook for parents that style their icon:
  `[&_.bh-icon]:text-wine`, `hover:[&_.bh-icon]:translate-x-0.5`.
- Hooks read by scripts, keep them: `.video-popup` (+ `data-vbtype="video"`) on YouTube links, `.vdo-play` +
  `data-vdo-video`, `data-reveal` (fade in on scroll; `RevealOnScroll` at the end of the page).
- Responsive grids: `*:min-w-0` on the grid. Under reduced motion, transitions go (`motion-reduce:` or
  `reduce-motion-tree` on the page wrapper, which `PAGE` includes).
- Icons are inline SVG only (`Icon`, `CIcon`, `BrandIcon`); there is no icon font. A CMS icon value (a Font
  Awesome class such as `fa-solid fa-robot`) goes through `cmsIcon()` (features, services; unknown names
  fall back to `sparkles`) or `brandFor()` (social links; unknown platforms show the line `globe`). When an
  editor starts using a new name, add it to the map in `kit-content-icons.tsx`.
- CMS rich text (blog bodies, FAQ answers, legal pages) is plain HTML styled by `site-prose`; it must not
  rely on theme classes or icon-font markup (none exists in the content as of 2026-11-22).
- Plain `<a>` links, `asset()`/`img()` images, server components by default, client islands only for state.
  No page may add jQuery or a theme plugin back; DOM behaviour is a small client component.

## Page skeleton

```tsx
import type { Metadata } from "next";
import { connection } from "next/server";
import { Icon } from "@/components/site/icons";
import { PAGE, section } from "@/components/site/kit-blog-ui";   // or kit-content-ui
import { CtaBand, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { btn, BTN_FOCUS_DARK } from "@/components/site/ui";
import { imageResolver, siteMetadata } from "@/lib/site";

export const instant = false;                        // renders per request

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/faq", "FAQ · Bodhira.ai");   // same path + title as legacy
}

/** Legacy resources/views/faq.blade.php, redesigned in 2026 (not in legacy; docs/site-design-kit.md). Differences from legacy: … */
export default async function FaqPage() {
  await connection();                                 // before any data
  const [img, data] = await Promise.all([imageResolver(), getFaqs()]);
  return (
    <div className={PAGE}>
      <SeoSchema path="faq" />
      <PageHero eyebrow="FAQ" title="Frequently Asked" highlight="Questions" lead="…"
        breadcrumbs={[{ label: "FAQ" }]}
        image={{ src: img(null, "assets/img/pages/faq-hero.jpg"), alt: "…", width: 1200, height: 1000 }} />
      <section className={section()} aria-labelledby="faq-general">
        <div className="site-container">
          <SectionHead id="faq-general" eyebrow="General" title="Before you" highlight="sign up" align="center" />
          …
        </div>
      </section>
      <section className={section({ flushTop: true })} aria-label="Get started">
        <div className="site-container">
          <CtaBand title="…" text="…" actions={<a href="/book-demo" className={btn("gold", "lg", BTN_FOCUS_DARK)}>Book a Demo</a>} />
        </div>
      </section>
      <RevealOnScroll />
    </div>
  );
}
```

- One `<h1>` per page, from `PageHero`. Sections use `<h2>` (`SectionHead`); cards `<h3>`.
- Every `<section>` gets `aria-labelledby` (its h2's id) or `aria-label`.
- Alternate section backgrounds: white, cream, and at most one maroon section. `flushTop` removes the top
  padding when two sections with the same background follow each other (a CTA band under a cream section).
- Add `data-reveal` to blocks that fade in (cards, media, heads; `SectionHead` and `CtaBand` have it).
  Without JS or with reduced motion everything is simply visible. Stat figures are static text.

## Components

**`<PageHero>`**: `eyebrow`, `title`, `highlight` (appended in the gradient), `lead`, `breadcrumbs` (trail
after Home; last = current page, no link), `image?` (`{src, alt, width, height}`; aspect ratio from
width/height, capped at 580px tall), `actions?`, `badge?` (a frosted chip on the photo: `HERO_GLASS`),
`children?` (chips, a toggle), `id?`. With no image the hero is centred.

**`SectionHead`**: `eyebrow`, `title`, `highlight`, `lead`, `align` (`start` | `center` | `split`), `light`
(on maroon), `id` (the section's `aria-labelledby`).

**`CheckList items`**, **`CtaBand title text image? actions`** (with `image`, a resolved URL, a photo behind
a maroon gradient), **`Eyebrow`**, **`Breadcrumbs`**. FAQ accordions are `<details name="group">` with a
`<summary>` (one open at a time, no JS). Pagination: `SitePagination` / `KitPagination`.

## Rules for pages

**Keep (parity):** the URL, `generateMetadata` path and title, `<SeoSchema path>`, `export const instant =
false`, `await connection()`, every data source (`getCollections`, `getFaqs`, …), every CMS-driven list and
its empty-state fallback, every form with its `action`, field `name`s, hidden inputs, `required`, the flash
status (`SiteStatus`) and checkbox/hidden-`0` pairs, every link target and query string, and the script
hooks above. Keep all copy; obvious typo fixes go in the page's doc comment ("Differences from legacy: …").

**Counts:** student, parent, school and subject numbers come only from `SITE_STATS` (`.label` for display,
`.noun` for the word). Never hard-code them. Other figures on legacy pages stay as written.

**Images:**
- **No readable logos or brands** (signage, printed uniforms, laptop logos, stickers, covers in focus),
  **clearly Indian**, **relevant to the page** (the hero photo especially), high quality, warm and bright.
  Inspect every photo at full size; a small logo may be painted out (note it in CREDITS.md). Don't reuse a
  homepage photo (`img/home/`) or a photo used elsewhere on the same page; one photo may serve two pages' CTA bands.
- Source from Pexels or Unsplash only. Download into a **new, empty directory** in the scratchpad, check each
  file with `file`, crop to the role (hero 1200×1000 or 960×1200, cards 600×720, media cards 1200×750, CTA
  1400×800), compress (sharp, mozjpeg q≈78) at 2× the largest display size, save to `public/assets/img/pages/`
  as `<page>-<role>.jpg`, and add a row to that folder's `CREDITS.md` (file, size, use, legacy key, source URL,
  photographer).
- Always render through the resolver so the Site Image Manager can override it: `img(legacyKey,
  "assets/img/pages/x.jpg")` when the photo replaces a legacy theme image (a replacement under the legacy key
  keeps winning), else `img(null, …)` / `asset(…)`. Plain `<img>` with `width`, `height`, `alt` (`alt=""` for
  decoration), `loading="lazy" decoding="async"` below the fold. CMS uploads go through `mediaUrl()`.
- Before deleting a file under `public/assets/img`, check the code, the API's `MAIN_IMAGES`
  (`bodhiraai-api/src/cms/site-images.service.ts`) and the database (`site_settings` points at
  `/assets/img/logo.png`, `logo-white.png`, `favicon.png`, `og-default.png`).
- WebP: after adding or replacing a photo in `img/{home,pages,auth}`, run `node scripts/webp-images.mjs` and
  commit the `.webp` files and `src/lib/webp-manifest.json`; the resolvers then serve the WebP copy (keep the
  `.jpg`: share images and fallback). The hero photo is the only one with `fetchPriority="high"`.

**Accessibility:** visible focus rings (maroon on light, gold on maroon); buttons are `<button
type="button">` or links, never clickable divs; icon-only controls get `aria-label`; toggles use
`aria-pressed`; decorative icons are `aria-hidden` (the icon components do that). Body copy is `text-body`
on white/cream; on maroon use the light variants.

**Check before handing over:** screenshots at 1440, 768 and 390 (scroll first so lazy images load) and
`document.documentElement.scrollWidth` equal to the viewport; `npx tsc --noEmit`, `npm run lint`,
`npx next build`; keyboard check of anything interactive. Label new code `not in legacy`.

## Screenshot and compare scripts

Kept in the session scratchpad (`tailwind/`) during the migration; copy them if you need them again:

- `node shots.mjs <outdir> [--routes=/,/about] [--widths=1440,768,390] [--states=all|none|a,b] [--no-pages]`:
  full-page PNGs of every marketing route + auth pages, plus states (menu-open, faq-open, banner-2,
  cookie-banner, contact-errors, video-popup, tab2, pricing-toggle, scrolled, …). Cookie
  `bh_consent=necessary`, reduced motion, lazy images loaded, fonts ready, iframes masked.
- `node compare.mjs <baselineDir> <afterDir> [diffDir] [--threshold=0.1]`: `magick compare -metric AE -fuzz 2%`
  per file, worst first.
- `tools/dump.mjs <route> <width> <selector>` dumps computed styles; `tools/conflicts.mjs <routes>` flags
  elements with two utilities for one property; `a11y.mjs` checks the side menu, skip link, back to top,
  cookie banner, hero slider and video dialog by keyboard.

## Pages (2026-11-22)

Home, `about`, `pricing`, `features`, `courses`, `course`, `course-details`, `teachers`, `success-stories`,
`shop`, `blog`, `blog/[slug]`, `faq`, `privacy` / `terms` / `refund` / `cookies` (`LegalPage`), `site-404` /
`not-found`, `contact`, `book-demo`, `student-registration`. `video/otp` is an API route, not a page. The
sign-in pages (`(app)/(auth)/*`, `auth/handoff`, `web-admin/login`) use the Tailwind
`src/components/auth/auth-shell.tsx` in the same style, with the dashboards' stylesheet.
