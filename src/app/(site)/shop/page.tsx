import type { Metadata } from "next";
import { connection } from "next/server";
import { Stars } from "@/components/site/kit-content-cards";
import { CIcon } from "@/components/site/kit-content-icons";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
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
const TONES = ["wine", "gold", "ink", "cream"] as const;
const TITLES = [...new Set(PRODUCTS.map((p) => p[2]))];

const SORT = [["", "Default Sorting"], ["vdt", "Most Popular"], ["can", "Date"], ["uk", "Trending"], ["dk", "Featured"], ["dl", "Discounted"]];

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/shop", 'Bodhira.ai - Modern Digital Learning Infrastructure');
}

/**
 * Legacy resources/views/shop.blade.php (the theme's demo shop), redesigned in
 * 2026 with the page design kit (not in legacy; docs/site-design-kit.md). Same
 * eight demo products, prices, review counts and links (/shop-details on each
 * title, "#" on the cart / wishlist / quick-view and pagination links; the
 * theme never had pages behind them). The theme's product images are grey
 * placeholders, so each card shows a typographic book cover unless the Site
 * Image Manager has a replacement for its key (`assets/img/shop/shop-N.png`).
 * The sort control was a non-functional nice-select <div>; it is now a native
 * <select> with the same options (still not wired to anything, as in legacy).
 * Differences from legacy: "Default Shorting" / "Tranding" corrected.
 */
export default async function ShopPage() {
  await connection();
  const { images } = await getChrome();
  return (
    <div className="bh-page">
      <SeoSchema path="shop" />

      <PageHero eyebrow="Shop" title="Product" highlight="Page" breadcrumbs={[{ label: "Product Page" }]} />

      <section className="bp-section bp-section--cream bpc-pull" aria-labelledby="shop-products">
        <div className="bh-container">
          <h2 id="shop-products" className="bh-sr-only">Products</h2>
          <div className="bpc-toolbar" data-reveal>
            <p className="bpc-toolbar__count">Showing 1–12 of 88 results</p>
            <label className="bpc-toolbar__sort">
              <CIcon name="sort" size={18} />
              <span className="bh-sr-only">Sort products</span>
              <select className="bp-select" defaultValue="">
                {SORT.map(([v, l]) => <option key={l} value={v}>{l}</option>)}
              </select>
            </label>
          </div>

          <ul className="bp-grid bp-grid--4 bpc-products">
            {PRODUCTS.map(([key, author, title, was, price], i) => {
              const photo = images[key];
              const tone = TONES[TITLES.indexOf(title) % TONES.length];
              return (
                <li key={i} className="bpc-product" data-reveal>
                  <div className="bpc-product__thumb">
                    {photo ? (
                      <img src={photo} alt={title} width={400} height={520} loading="lazy" decoding="async" />
                    ) : (
                      <span className={`bpc-cover bpc-cover--${tone}`} aria-hidden="true">
                        <span className="bpc-cover__mark"><CIcon name="bookOpen" size={22} /></span>
                        <span className="bpc-cover__title">{title.replace(/\.+$/, "")}</span>
                        <span className="bpc-cover__author">{author}</span>
                      </span>
                    )}
                    <span className="bp-badge bp-badge--maroon bpc-product__author">{author}</span>
                    <ul className="bpc-product__actions">
                      <li><a href="#" aria-label={`Add ${title} to cart`}><CIcon name="cart" size={18} /></a></li>
                      <li><a href="#" aria-label={`Add ${title} to wishlist`}><CIcon name="heart" size={18} /></a></li>
                      <li><a href="#" aria-label={`Quick view: ${title}`}><CIcon name="eye" size={18} /></a></li>
                    </ul>
                  </div>
                  <div className="bpc-product__body">
                    <h3 className="bpc-product__title"><a href="/shop-details">{title}</a></h3>
                    <div className="bpc-rating"><Stars value={5} /><span>(15 Reviews)</span></div>
                    <p className="bpc-product__price"><s aria-label={`Was ${was}`}>{was}</s> <strong>{price}</strong></p>
                  </div>
                </li>
              );
            })}
          </ul>

          <nav className="bp-pagination bpc-pager" aria-label="Pagination Navigation">
            <ul>
              <li><a href="#">01</a></li>
              <li><a href="#" aria-current="page">02</a></li>
              <li><a href="#">03</a></li>
              <li><a href="#" aria-label="Next page"><CIcon name="arrowRight" size={18} /></a></li>
            </ul>
          </nav>
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
