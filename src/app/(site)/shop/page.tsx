import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { assetResolver, siteMetadata } from "@/lib/site";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/shop", 'Bodhira.ai - Modern Digital Learning Infrastructure');
}

/** Legacy resources/views/shop.blade.php. */
export default async function ShopPage() {
  await connection();
  const asset = await assetResolver();
  return (
    <>
      <SeoSchema path="shop" />
      <section className="page-header">
        <div className="bg-item">
            <div className="bg-img" data-background={asset("assets/img/bg-img/page-header-bg.png")}></div>
            <div className="overlay"></div>
            <div className="shapes">
                <div className="shape shape-1"><img src={asset("assets/img/shapes/page-header-shape-1.png")} alt="shape" /></div>
                <div className="shape shape-2"><img src={asset("assets/img/shapes/page-header-shape-2.png")} alt="shape" /></div>
                <div className="shape shape-3"><img src={asset("assets/img/shapes/page-header-shape-3.png")} alt="shape" /></div>
            </div>
        </div>
        <div className="container">
            <div className="page-header-content">
                <h1 className="title">Product Page</h1>
                <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="/shop"> Product Page</a></h4>
            </div>
        </div>
    </section>
    

    <section className="shop-section pt-120 pb-120">
        <div className="container">
            <div className="top-grid-content heading-space">
                <div className="shop-tab-nav">
                    <span>Showing 1–12 of 88 results</span>
                </div>
                <div className="nice-select shop-select country" tabIndex={0}>
                    <span className="current">Default Shorting</span>
                    <ul className="list">
                        <li data-value="" className="option selected">Default Shorting</li>
                        <li data-value="vdt" className="option">Most Popular</li>
                        <li data-value="can" className="option">Date</li>
                        <li data-value="uk" className="option focus">Tranding</li>
                        <li data-value="dk" className="option">Featured</li>
                        <li data-value="dl" className="option">Discounted</li>
                    </ul>
                </div>
            </div>
            <div className="row gy-4">
                <div className="col-lg-3 col-md-6">
                    <div className="shop-item">
                        <div className="shop-thumb">
                            <div className="overlay"></div>
                            <div className="shop-thumb-inner">
                                <img src={asset("assets/img/shop/shop-1.png")} alt="shop" />
                            </div>
                            <span className="sale">Andrew Collins</span>
                            <ul className="shop-list">
                                <li><a href="#"><i className="fa-light fa-cart-shopping"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-eye"></i></a></li>
                            </ul>
                        </div>
                        <div className="shop-content">
                            <h3 className="title"><a href="/shop-details">The Creator Mindset</a></h3>
                            <div className="review-wrap">
                                <ul className="review">
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                </ul>
                                <span>(15 Reviews)</span>
                            </div>
                            <span className="price"> <span className="offer">$170.00</span>$147.00</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="shop-item">
                        <div className="shop-thumb">
                            <div className="overlay"></div>
                            <div className="shop-thumb-inner">
                                <img src={asset("assets/img/shop/shop-2.png")} alt="shop" />
                            </div>
                            <span className="sale">James Parker</span>
                            <ul className="shop-list">
                                <li><a href="#"><i className="fa-light fa-cart-shopping"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-eye"></i></a></li>
                            </ul>
                        </div>
                        <div className="shop-content">
                            <h3 className="title"><a href="/shop-details">The Phoenix Encounter</a></h3>
                            <div className="review-wrap">
                                <ul className="review">
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                </ul>
                                <span>(15 Reviews)</span>
                            </div>
                            <span className="price"> <span className="offer">$330.00</span>$277.00</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="shop-item">
                        <div className="shop-thumb">
                            <div className="overlay"></div>
                            <div className="shop-thumb-inner">
                                <img src={asset("assets/img/shop/shop-3.png")} alt="shop" />
                            </div>
                            <span className="sale">Ethan Thompson</span>
                            <ul className="shop-list">
                                <li><a href="#"><i className="fa-light fa-cart-shopping"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-eye"></i></a></li>
                            </ul>
                        </div>
                        <div className="shop-content">
                            <h3 className="title"><a href="/shop-details">The Untapped Force...</a></h3>
                            <div className="review-wrap">
                                <ul className="review">
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                </ul>
                                <span>(15 Reviews)</span>
                            </div>
                            <span className="price"> <span className="offer">$250.00</span>$157.00</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="shop-item">
                        <div className="shop-thumb">
                            <div className="overlay"></div>
                            <div className="shop-thumb-inner">
                                <img src={asset("assets/img/shop/shop-4.png")} alt="shop" />
                            </div>
                            <span className="sale">William Bennett</span>
                            <ul className="shop-list">
                                <li><a href="#"><i className="fa-light fa-cart-shopping"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-eye"></i></a></li>
                            </ul>
                        </div>
                        <div className="shop-content">
                            <h3 className="title"><a href="/shop-details">Own Your Authority</a></h3>
                            <div className="review-wrap">
                                <ul className="review">
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                </ul>
                                <span>(15 Reviews)</span>
                            </div>
                            <span className="price"> <span className="offer">$80.00</span>$57.00</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="shop-item">
                        <div className="shop-thumb">
                            <div className="overlay"></div>
                            <div className="shop-thumb-inner">
                                <img src={asset("assets/img/shop/shop-6.png")} alt="shop" />
                            </div>
                            <span className="sale">James Parker</span>
                            <ul className="shop-list">
                                <li><a href="#"><i className="fa-light fa-cart-shopping"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-eye"></i></a></li>
                            </ul>
                        </div>
                        <div className="shop-content">
                            <h3 className="title"><a href="/shop-details">The Phoenix Encounter</a></h3>
                            <div className="review-wrap">
                                <ul className="review">
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                </ul>
                                <span>(15 Reviews)</span>
                            </div>
                            <span className="price"> <span className="offer">$330.00</span>$277.00</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="shop-item">
                        <div className="shop-thumb">
                            <div className="overlay"></div>
                            <div className="shop-thumb-inner">
                                <img src={asset("assets/img/shop/shop-7.png")} alt="shop" />
                            </div>
                            <span className="sale">Ethan Thompson</span>
                            <ul className="shop-list">
                                <li><a href="#"><i className="fa-light fa-cart-shopping"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-eye"></i></a></li>
                            </ul>
                        </div>
                        <div className="shop-content">
                            <h3 className="title"><a href="/shop-details">The Untapped Force...</a></h3>
                            <div className="review-wrap">
                                <ul className="review">
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                </ul>
                                <span>(15 Reviews)</span>
                            </div>
                            <span className="price"> <span className="offer">$250.00</span>$157.00</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="shop-item">
                        <div className="shop-thumb">
                            <div className="overlay"></div>
                            <div className="shop-thumb-inner">
                                <img src={asset("assets/img/shop/shop-8.png")} alt="shop" />
                            </div>
                            <span className="sale">William Bennett</span>
                            <ul className="shop-list">
                                <li><a href="#"><i className="fa-light fa-cart-shopping"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-eye"></i></a></li>
                            </ul>
                        </div>
                        <div className="shop-content">
                            <h3 className="title"><a href="/shop-details">Own Your Authority</a></h3>
                            <div className="review-wrap">
                                <ul className="review">
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                </ul>
                                <span>(15 Reviews)</span>
                            </div>
                            <span className="price"> <span className="offer">$80.00</span>$57.00</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="shop-item">
                        <div className="shop-thumb">
                            <div className="overlay"></div>
                            <div className="shop-thumb-inner">
                                <img src={asset("assets/img/shop/shop-5.png")} alt="shop" />
                            </div>
                            <span className="sale">Andrew Collins</span>
                            <ul className="shop-list">
                                <li><a href="#"><i className="fa-light fa-cart-shopping"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa-light fa-eye"></i></a></li>
                            </ul>
                        </div>
                        <div className="shop-content">
                            <h3 className="title"><a href="/shop-details">The Creator Mindset</a></h3>
                            <div className="review-wrap">
                                <ul className="review">
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                    <li><i className="fa-solid fa-star"></i></li>
                                </ul>
                                <span>(15 Reviews)</span>
                            </div>
                            <span className="price"> <span className="offer">$170.00</span>$147.00</span>
                        </div>
                    </div>
                </div>
            </div>
            <ul className="pagination-wrap text-center">
                <li><a href="#">01</a></li>
                <li><a href="#" className="active">02</a></li>
                <li><a href="#">03</a></li>
                <li><a href="#"><i className="fa-regular fa-arrow-right"></i></a></li>
            </ul>
        </div>
    </section>
    </>
  );
}
