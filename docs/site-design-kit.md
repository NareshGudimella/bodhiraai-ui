# Marketing site design kit

The 2026 redesign of the public marketing pages (`src/app/(site)/*`), not in legacy. The homepage
(`page.tsx`, `public/assets/css/home.css`, scoped to `.bh-home`) set the look; this kit makes the
same look reusable for every other marketing page. Pilots: `/about` and `/pricing`.

## Files

| File | What |
|---|---|
| `public/assets/css/site-chrome.css` | Shared tokens (`--bh-*` colours, radii, shadows, `--bh-ease`, `--bh-font`), `.bh-container`, `.bh-btn*`, `.bh-icon`, `.bh-sr-only`, header and footer. Loaded on every page |
| `public/assets/css/site-ui.css` | The kit: every rule scoped to `.bh-page`, classes prefixed `bp-`. Loaded after `home.css` (site layout `STYLES`) |
| `src/components/site/page-hero.tsx` | `<PageHero>`: breadcrumbs, eyebrow, the page's `<h1>`, lead, actions, optional framed photo |
| `src/components/site/page-kit.tsx` | `Eyebrow`, `Breadcrumbs`, `SectionHead`, `CheckList`, `CtaBand` (server-safe) |
| `src/components/site/icons.tsx` | `<Icon name>`: line icons (Lucide paths). Add new ones there; no icon fonts in new markup |
| `src/components/site/site-enhance.tsx` | `RevealOnScroll`: fade-up for `[data-reveal]` blocks. Render once at the end of the page |
| `src/components/site/testimonials.tsx` | `Testimonials` carousel and `QuoteCard` (CMS testimonials; their `.bh-quote*`/`.bh-qcard` styles are in home.css, which loads on every page) |
| `src/components/site/pricing-plans.tsx` | Pricing plans + billing toggle (client component) |
| `src/lib/site.ts` | `assetResolver()` → `asset(path)`, `imageResolver()` → `img(legacyKey, newPath)`, `settingResolver()`, `siteMetadata()` |
| `src/lib/site-stats.ts` | `SITE_STATS`: the only source of student / parent / school / subject counts |
| `public/assets/img/pages/` + `CREDITS.md` | Photos for migrated pages (the homepage's are in `img/home/`) |

## Page skeleton

```tsx
import type { Metadata } from "next";
import { connection } from "next/server";
import { Icon } from "@/components/site/icons";
import { CtaBand, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, siteMetadata } from "@/lib/site";

export const instant = false;                       // keep: renders per request

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/faq", "…same title as before…");  // keep path + title
}

/** Legacy resources/views/faq.blade.php, redesigned in 2026 with the page design kit (not in legacy; docs/site-design-kit.md). … */
export default async function FaqPage() {
  await connection();                                // keep: before any data
  const [img, data] = await Promise.all([imageResolver(), getFaqs()]);
  return (
    <div className="bh-page">
      <SeoSchema path="faq" />                       {/* keep */}
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked"
        highlight="Questions"
        lead="…"
        breadcrumbs={[{ label: "FAQ" }]}
        image={{ src: img(null, "assets/img/pages/faq-hero.jpg"), alt: "…", width: 1200, height: 1000 }}
      />
      <section className="bp-section" aria-labelledby="faq-general">
        <div className="bh-container">
          <SectionHead id="faq-general" eyebrow="General" title="Before you" highlight="sign up" align="center" />
          …
        </div>
      </section>
      <section className="bp-section bp-section--flush-top" aria-label="Get started">
        <div className="bh-container">
          <CtaBand title="…" text="…" actions={<a href="/book-demo" className="bh-btn bh-btn--gold bh-btn--lg">Book a Demo</a>} />
        </div>
      </section>
      <RevealOnScroll />
    </div>
  );
}
```

- The outer `<div className="bh-page">` is required: every kit rule hangs off it, and it resets
  the legacy theme (fonts, `p`/`h*` sizes and colours, list styles, the gold `section i.fa-*`
  and `article:hover` rules) inside it only. Pages not migrated yet keep the theme.
- One `<h1>` per page, from `PageHero`. Sections use `<h2>` (`SectionHead`, `.bp-h2`); cards `<h3>`.
- Every `<section>` gets `aria-labelledby` (its h2's id) or `aria-label`.
- Alternate section backgrounds: white `bp-section`, `bp-section--cream`, and at most one
  `bp-section--dark` (maroon). `bp-section--flush-top` removes the top padding when two sections
  with the same background follow each other (e.g. a CTA band under a cream section).
- Add `data-reveal` to blocks that should fade in (cards, media, heads). `SectionHead` and
  `CtaBand` already have it. Without JS or with reduced motion everything is simply visible.

## Components

**`<PageHero>`** — `eyebrow`, `title`, `highlight` (appended in the gradient, same line), `lead`,
`breadcrumbs` (trail after Home; last = current page, no link), `image?` (`{src, alt, width,
height}`; the aspect ratio comes from width/height, capped at 580px tall), `actions?` (buttons),
`badge?` (a `.bp-glass` chip floating on the photo), `children?` (chips, a toggle), `id?`. With no
image the hero is centred. Replaces `SitePageHeader` / the theme's `.page-header` banner on
migrated pages (`page-header.tsx` stays for the others).

**`SectionHead`** — `eyebrow`, `title`, `highlight`, `lead`, `align` (`start` | `center` |
`split`), `light` (on dark backgrounds), `id` (pass the section's `aria-labelledby`).

**`CheckList items`** — round check list. **`CtaBand title text image? actions`** — closing card;
with `image` (a resolved URL) a photo behind a maroon gradient. **`Eyebrow`**, **`Breadcrumbs`**.

## Class reference (all inside `.bh-page`)

| Pattern | Classes |
|---|---|
| Layout | `bh-container` (1248px), `bp-section` (+ `--cream`, `--dark`, `--tight`, `--flush-top`), `bp-grid` + `--2` / `--3` / `--4` / `--people`, `bp-split` (+ `--media-wide`), `bp-actions` (button row) |
| Type | `bp-eyebrow` (+ `--light`), `bp-h1`, `bp-h2` (+ `--light`; a `<span>` inside gets the gradient), `bp-h3`, `bp-lead`, `bp-muted`, `bp-head` (+ `--center`, `--split`), `bp-link` (text link with arrow icon) |
| Buttons | `bh-btn` + `bh-btn--maroon` (primary), `--gold` (primary on dark), `--ghost` (secondary on light), `--glass` (secondary on dark), `--lg`. Max one primary per block |
| Cards | `bp-card` (+ `--hover`, `--cream`, `--dark`), `bp-tile` icon tile (+ `--sm`, `--solid`, `--gold`, `--white`, `--light`), `bp-media-card` (+ `__thumb`, `__body`), `bp-person` (+ `__photo`, `__placeholder`, `__body`, `__name`, `__role`, `__bio`), `bp-quote` (static testimonial, + `__mark`, `__title`), `bp-avatar` |
| Stats | `bp-stat` + `bp-stats` (2-up), `bp-counters` (maroon band; `<ul>` of `<li>` with `bp-tile bp-tile--light`, `<strong>`, `<span>`) |
| Bento | `bp-bento` > `bp-bento__card` (+ `--wide`, `--tall`, `--photo` with an `<img>` first child, `--dark`) |
| Badges / chips | `bp-badge` (+ `--gold`, `--maroon`, `--success`, `--outline`), `bp-chip` (span or link), `bp-chips` (row), `bp-glass` (floating chip on photos) |
| Lists | `bp-checks` (use `CheckList`) |
| FAQ | `bp-accordion` > `<details name="group">` > `<summary>` (`bp-accordion__num`, `bp-accordion__q`, `<Icon name="chevronDown" className="bp-accordion__chev" />`) + `<div className="bp-accordion__a">` |
| Forms | `bp-form`, `bp-form__row` (2-up), `bp-field` (`<label>` wrapping `bp-field__label` + control), `bp-input`, `bp-select`, `bp-textarea`, `bp-field__hint`, `bp-field__error`, `bp-field--error` (or `aria-invalid="true"` on the control), `bp-check` (checkbox/radio label), `bp-req` (required star), `bp-alert` (+ `--success`, `--error`), `bp-form-card` |
| Tables | `bp-table-wrap` (scrolls sideways on small screens) > `table.bp-table` |
| Navigation | `bp-crumbs` (use `Breadcrumbs`), `bp-pagination` > `ul` > `a` / `span[aria-current="page"]` / `.is-disabled`, `bp-toggle` (segmented buttons with `aria-pressed`) |
| Prose | `bp-prose` (+ `--wide`): legal pages, blog bodies, CMS HTML (`dangerouslySetInnerHTML`) |
| Media | `bp-photo` (+ `--framed`), `bp-play` (round play button over a photo), `bp-collage` (+ `__main`, `__second`, `__chip`, `__label`, `__num`) |
| Pricing | `bp-plans` (+ `--1`, `--2`), `bp-plan` (+ `--featured`), `bp-plan-group`, `bp-plan-toggle` |
| Dark areas | add `bp-on-dark` to a dark block so focus rings turn gold |

Responsive: 1199 / 991 / 767 / 575px; grids collapse on their own (3 → 2 → 1, 4 → 2 → 1). Check
360, 390, 768 and 1280+ widths and that `document.documentElement.scrollWidth` equals the viewport.
Section padding is `--bp-section-y` (112 → 88 → 72 → 64px).

## Rules for migrating a page

**Keep (parity):** the URL, `generateMetadata` path and title, `<SeoSchema path>`, `export const
instant = false`, `await connection()`, every data source (`getCollections`, `getFaqs`, …), every
CMS-driven list and its empty-state fallback, every form with its `action`, field `name`s, hidden
inputs, `required`, the flash/status (`SiteStatus`) and checkbox/hidden-`0` pairs, every link
target and query string, and the theme hooks a page depends on (`.video-popup` +
`data-vbtype="video"` for the VenoBox YouTube pop-up; `.vdo-play` + `<VdoPlayer />` for VdoCipher).
Keep all copy; you may fix obvious typos and copy that is duplicated by mistake, and must note
each such change in the page's doc comment ("Differences from legacy: …"). Plain `<a>` links, no
`<Link>`.

**Change (presentation only):** markup and classes, layout, icons (`<Icon>` instead of Font
Awesome), photos, heading levels (one h1, then h2/h3), counters (static text from `SITE_STATS`,
no odometer). Drop the theme's `.page-header` banner, decorative `shapes/*` images, `wow` classes
and inline `<style>` blocks. Replace inline DOM scripts with a small client component
(see `pricing-plans.tsx`). Anything new (a CTA band, a badge) is presentation, not new claims:
reuse existing copy or links, and mention it in the doc comment.

**Counts:** student, parent, school and subject numbers come only from `SITE_STATS` (`.label` for
display; `.noun` if you need the word). Never hard-code them. Other figures on legacy pages
(lessons delivered, satisfaction %) stay as written.

**Images:**
- **No readable logos or brands** (wall signage, uniforms printed with a school name, laptop
  logos, stickers, book or magazine covers in focus), **clearly Indian**, and **relevant to the
  page** (the hero photo especially must say what the page is about). High quality, modern,
  warm and bright. Inspect every photo at full size before using it; a small logo may be
  painted out (note it in CREDITS.md), otherwise pick another photo. Don't reuse a homepage photo
  (`img/home/`) or a photo used elsewhere on the same page; one photo may serve two different
  pages' CTA bands.
- Source from Pexels or Unsplash only (free licence). Download full size into a **new, empty
  directory** in the scratchpad (not a shared one), check each file with `file`, crop to the role
  (hero 1200×1000 or 960×1200, cards 600×720, media cards 1200×750, CTA 1400×800), compress
  (sharp, mozjpeg q≈78) at 2× the largest display size, save to `public/assets/img/pages/`
  with a `<page>-<role>.jpg` name, and add a row to `public/assets/img/pages/CREDITS.md`
  (file, size, use, legacy key, source URL, photographer).
- Always render through the resolver so the Site Image Manager can override it:
  `img(legacyKey, "assets/img/pages/x.jpg")` when the photo replaces a legacy theme image
  (a replacement under the legacy key keeps winning), else `img(null, …)` / `asset(…)`.
  Plain `<img>` with `width`, `height`, `alt` (describe the scene; `alt=""` for decoration),
  `loading="lazy" decoding="async"` below the fold. CMS uploads go through `mediaUrl()`.

**Accessibility:** visible focus rings are built in (maroon, gold inside `bp-on-dark`); buttons
are `<button type="button">` or links, never clickable divs; icon-only controls get `aria-label`;
toggles use `aria-pressed`; decorative icons are `aria-hidden` (the `Icon` component does that).
Keep text contrast: body copy is `--bh-body` on white/cream; on maroon use the light variants.

**Check before handing over:** screenshots at 1440 and 390 (scroll the page first so lazy images
load), `npx tsc --noEmit`, `npm run lint`, `npx next build`. Label new code `not in legacy`.

## Migrated pages (2026-11-22)

Every marketing page is on the kit: home (`home.css`), `about`, `pricing` (`site-ui.css`);
`features`, `courses`, `course`, `course-details`, `teachers`, `success-stories`, `shop`
(`site-ui-content.css`, `kit-content-*`); `blog`, `blog/[slug]`, `faq`, `privacy` / `terms` /
`refund` (`LegalPage`), `site-404` / `not-found` (`site-ui-blog.css`, `kit-blog-*`); `contact`,
`book-demo`, `student-registration` (`site-ui-forms.css`, `kit-forms-*`). `video/otp` is an
API route, not a page. The sign-in pages (`(app)/(auth)/*`, `auth/handoff`, `web-admin/login`)
use the Tailwind `src/components/auth/auth-shell.tsx` in the same style.

Shared components keep their legacy default and take a kit variant: `PostCard`
(`variant`, `fallback`, `headingLevel`) and `SitePagination` (`variant`). Photos and credits
per group: `public/assets/img/{home,pages,pages/content,pages/blog,pages/forms,auth}/CREDITS.md`.
