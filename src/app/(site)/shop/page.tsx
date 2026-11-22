import type { Metadata } from "next";
import { connection } from "next/server";
import { CIcon } from "@/components/site/kit-content-icons";
import { FOCUS, FOCUS_BUTTON, LIST, PAGE, PAGER_LIST, badge, pagerItem, section } from "@/components/site/kit-content-ui";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { cx } from "@/components/site/ui";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { siteMetadata } from "@/lib/site";
import { getChrome } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/** The theme's demo products, as they were: [image key, author, title, old price, price]. */
const PRODUCTS: [string, string, string, string, string][] = [
  ["assets/img/shop/shop-1.png", "Andrew Collins", "The Creator Mindset", "$170.00", "$147.00"],
  ["assets/img/shop/shop-2.png", "James Parker", "The Phoenix Encounter", "$330.00", "$277.00"],
  ["assets/img/shop/shop-3.png", "Ethan Thompson", "The Untapped Force...", "$250.00", "$157.00"],
  ["assets/img/shop/shop-4.png", "William Bennett", "Own Your Authority", "$80.00", "$57.00"],
  ["assets/img/shop/shop-6.png", "James Parker", "The Phoenix Encounter", "$330.00", "$277.00"],
  ["assets/img/shop/shop-7.png", "Ethan Thompson", "The Untapped Force...", "$250.00", "$157.00"],
  ["assets/img/shop/shop-8.png", "William Bennett", "Own Your Authority", "$80.00", "$57.00"],
  ["assets/img/shop/shop-5.png", "Andrew Collins", "The Creator Mindset", "$170.00", "$147.00"],
];

/** Cover colourways for the typographic book covers: one per title, so a repeated book looks the same. */
const TONES = [
  "bg-[radial-gradient(80%_60%_at_100%_0%,rgba(226,184,115,.35),transparent_60%),var(--grad-maroon)] text-white",
  "bg-[linear-gradient(160deg,#F0D29C,#C49560_70%,#A8763F)] text-maroon-deep",
  "bg-[radial-gradient(70%_50%_at_0%_100%,rgba(226,184,115,.3),transparent_60%),linear-gradient(160deg,#3A2A2E,#1E1416)] text-white",
  "bg-[linear-gradient(160deg,#FFFBF5,#EFDDBF)] text-maroon",
] as const;

/** The kit's select (was `.bp-select`) at the toolbar's size, with its chevron. */
const SELECT = cx(
  "min-h-[46px] w-full min-w-[210px] cursor-pointer appearance-none rounded-[14px] border border-line-2 bg-white py-0 pr-11 pl-4 font-sans text-[15.5px] leading-[1.4] font-medium text-ink shadow-xs outline-0 max-sm:min-w-0",
  "kf-select-chevron", // site-forms.css
  "[transition:border-color_.2s,box-shadow_.2s] hover:border-[rgba(92,26,38,.3)] focus:border-wine focus:shadow-[0_0_0_4px_rgba(122,36,55,.12)]",
  FOCUS_BUTTON,
);

/** The quick actions on a product photo: hidden until the card is hovered or focused, on devices that can hover. */
const ACTION = cx(
  "grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-sm hover:bg-maroon hover:text-white max-sm:h-[34px] max-sm:w-[34px]",
  "[transition:background_.2s,color_.2s,translate_.2s_var(--ease-bh),scale_.2s_var(--ease-bh),opacity_.2s] [@media(hover:none)]:hover:scale-[1.06]",
  "[@media(hover:hover)]:translate-x-2 [@media(hover:hover)]:opacity-0",
  "[@media(hover:hover)]:group-hover/product:translate-x-0 [@media(hover:hover)]:group-hover/product:opacity-100",
  "[@media(hover:hover)]:group-focus-within/product:translate-x-0 [@media(hover:hover)]:group-focus-within/product:opacity-100",
  FOCUS,
);
const TITLES = [...new Set(PRODUCTS.map((p) => p[2]))];

const SORT = [["", "Default Sorting"], ["vdt", "Most Popular"], ["can", "Date"], ["uk", "Trending"], ["dk", "Featured"], ["dl", "Discounted"]];

export async function generateMetadata(): Promise<Metadata> {
  // Theme demo page: kept out of search results and the sitemap (SEO: not in legacy).
  return siteMetadata("/shop", "Product Page · Bodhira.ai", { noindex: true, description: "Products from Bodhira.ai." });
}

/**
 * Legacy resources/views/shop.blade.php (the theme's demo shop), redesigned in
 * 2026 with the page design kit (not in legacy; docs/site-design-kit.md). Same
 * eight demo products, prices, review counts and links ("#" on the cart /
 * wishlist / quick-view and pagination links; the theme never had pages
 * behind them). The theme's product images are grey
 * placeholders, so each card shows a typographic book cover unless the Site
 * Image Manager has a replacement for its key (`assets/img/shop/shop-N.png`).
 * The sort control was a non-functional nice-select <div>; it is now a native
 * <select> with the same options (still not wired to anything, as in legacy).
 * Compliance pass (not in legacy, 2026-11-22): the invented five-star
 * "(15 Reviews)" line on every product is gone.
 * Differences from legacy: "Default Shorting" / "Tranding" corrected; product
 * titles are no longer links to the theme's missing /shop-details page (a 404).
 * Tailwind since the migration's phase 2 (was `.bh-page` kit classes and
 * site-ui-content.css).
 */
export default async function ShopPage() {
  await connection();
  const { images } = await getChrome();
  return (
    <div className={PAGE}>
      <SeoSchema path="shop" />

      <PageHero eyebrow="Shop" title="Product" highlight="Page" breadcrumbs={[{ label: "Product Page" }]} />

      {/* 24px under the centred hero (no photo), not the usual section padding */}
      <section className={cx(section("cream", { flushTop: true }), "pt-6")} aria-labelledby="shop-products">
        <div className="site-container">
          <h2 id="shop-products" className="sr-only">Products</h2>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-white py-3 pr-3 pl-6 shadow-xs max-sm:p-4" data-reveal>
            <p className="m-0 font-sans text-[15px] leading-[1.65] font-semibold text-ink">Showing 1–12 of 88 results</p>
            <label className="flex items-center gap-2.5 text-wine max-sm:w-full max-sm:min-w-0">
              <CIcon name="sort" size={18} />
              <span className="sr-only">Sort products</span>
              <select className={SELECT} defaultValue="">
                {SORT.map(([v, l]) => <option key={l} value={v}>{l}</option>)}
              </select>
            </label>
          </div>

          <ul className={cx(LIST, "grid grid-cols-4 gap-6 *:min-w-0 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:gap-3")}>
            {PRODUCTS.map(([key, author, title, was, price], i) => {
              const photo = images[key];
              const tone = TONES[TITLES.indexOf(title) % TONES.length];
              return (
                <li
                  key={i}
                  className="group/product flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-xs [transition:transform_.3s_var(--ease-bh),box-shadow_.3s_var(--ease-bh)] hover:[transform:translateY(-4px)] hover:shadow-lg"
                  data-reveal
                >
                  <div className="relative grid aspect-[4/4.4] place-items-center overflow-hidden bg-[linear-gradient(160deg,#FBF3E6,#F3E2C6)] px-7 pt-7 pb-5 max-sm:px-4 max-sm:pt-5 max-sm:pb-3.5">
                    {photo ? (
                      <img src={photo} alt={title} width={400} height={520} loading="lazy" decoding="async" className="block max-h-full w-auto max-w-full rounded-[6px] shadow-md" />
                    ) : (
                      <span
                        className={cx(
                          "relative flex aspect-[2/3] w-[68%] flex-col justify-between rounded-[4px_10px_10px_4px] pt-[18px] pr-4 pb-4 pl-[22px] text-left max-sm:w-[76%] max-sm:pt-3 max-sm:pr-2.5 max-sm:pb-2.5 max-sm:pl-4",
                          "shadow-[inset_-6px_0_0_-2px_rgba(0,0,0,.14),0_24px_40px_-20px_rgba(42,14,19,.7),0_2px_6px_rgba(42,14,19,.18)]",
                          "[transform:perspective(900px)_rotateY(-8deg)] [transition:transform_.5s_var(--ease-bh)] group-hover/product:[transform:perspective(900px)_rotateY(0)] motion-reduce:[transform:none]",
                          "before:absolute before:top-0 before:bottom-0 before:left-1.5 before:w-0.5 before:bg-[rgba(255,255,255,.25)] before:content-['']",
                          tone,
                        )}
                        aria-hidden="true"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-full border-[1.5px] border-current opacity-85 max-sm:h-7 max-sm:w-7"><CIcon name="bookOpen" size={22} /></span>
                        <span className="text-[17px] leading-[1.15] font-extrabold tracking-[-.02em] text-balance max-sm:text-[13.5px]">{title.replace(/\.+$/, "")}</span>
                        <span className="text-[11px] font-bold tracking-[.12em] uppercase opacity-80 max-sm:text-[9px]">{author}</span>
                      </span>
                    )}
                    <span className={badge("maroon", undefined, "absolute top-3.5 left-3.5 z-2 max-sm:hidden")}>{author}</span>
                    <ul className={cx(LIST, "absolute top-3.5 right-3.5 z-2 grid gap-2 max-sm:top-2 max-sm:right-2 max-sm:gap-1.5")}>
                      <li><a href="#" aria-label={`Add ${title} to cart`} className={ACTION}><CIcon name="cart" size={18} /></a></li>
                      <li><a href="#" aria-label={`Add ${title} to wishlist`} className={ACTION}><CIcon name="heart" size={18} /></a></li>
                      <li><a href="#" aria-label={`Quick view: ${title}`} className={ACTION}><CIcon name="eye" size={18} /></a></li>
                    </ul>
                  </div>
                  <div className="px-5 pt-[18px] pb-[22px] max-sm:p-3.5">
                    <h3 className="m-0 mb-2 font-sans text-[17px] leading-[1.2] font-bold tracking-[-.01em] text-ink transition-none max-sm:text-[15px]">{title}</h3>
                    <p className="mt-2.5 mb-0 flex items-baseline gap-2 font-sans text-base leading-[1.65] font-normal text-body tabular-nums">
                      <s aria-label={`Was ${was}`} className="text-[14px] text-muted">{was}</s> <strong className="text-[20px] font-extrabold tracking-[-.02em] text-maroon">{price}</strong>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <nav className="mt-14 flex justify-center" aria-label="Pagination Navigation">
            <ul className={PAGER_LIST}>
              <li><a href="#" className={cx(pagerItem(), FOCUS)}>01</a></li>
              <li><a href="#" aria-current="page" className={cx(pagerItem("current", true), FOCUS)}>02</a></li>
              <li><a href="#" className={cx(pagerItem(), FOCUS)}>03</a></li>
              <li><a href="#" aria-label="Next page" className={cx(pagerItem(), FOCUS)}><CIcon name="arrowRight" size={18} /></a></li>
            </ul>
          </nav>
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
