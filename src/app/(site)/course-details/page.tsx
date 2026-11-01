import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { assetResolver, siteMetadata } from "@/lib/site";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/course-details", 'Bodhira.ai - Modern Digital Learning Infrastructure');
}

/** Legacy resources/views/course-details.blade.php. */
export default async function CourseDetailsPage() {
  await connection();
  const asset = await assetResolver();
  return (
    <>
      <SeoSchema path="course-details" />
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
                <h1 className="title">Course Details</h1>
                <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="/course-details"> Course Details</a></h4>
            </div>
        </div>
    </section>
    

    <section className="course-details pt-120 pb-120">
        <div className="container">
            <div className="row">
                <div className="col-xl-9 col-lg-12">
                    <div className="course-details-content">
                        <div className="course-details-img">
                            <img src={asset("assets/img/service/course-details-img.png")} alt="course" />
                        </div>
                        <div className="details-inner">
                            <ul className="details-meta">
                                <li>Best Seller</li>
                                <li>Latest</li>
                            </ul>
                            <h2 className="title">User Experience Design Essentials - Adobe XD UI UX De1sign <br /> Course For
                                Limted Time</h2>
                            <ul className="course-details-list">
                                <li><img src={asset("assets/img/service/course-details-author.png")} alt="author" /><span>Instructor:</span> Kevin Perry</li>
                                <li><i className="fa-solid fa-tags"></i>Web Development</li>
                                <li><i className="fa-light fa-calendar"></i>04 April, 2022</li>
                                <li className="review-wrap">
                                    <ul>
                                        <li><i className="fa-sharp fa-regular fa-star"></i></li>
                                        <li><i className="fa-sharp fa-regular fa-star"></i></li>
                                        <li><i className="fa-sharp fa-regular fa-star"></i></li>
                                        <li><i className="fa-sharp fa-regular fa-star"></i></li>
                                        <li><i className="fa-sharp fa-regular fa-star"></i></li>
                                    </ul>
                                    (4.88)
                                </li>
                            </ul>
                        </div>
                        <div className="course-details-tab">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true"><i className="fa-sharp fa-regular fa-bookmark"></i>Overview</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false"><i className="fa-regular fa-book"></i>Curriculam</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false"><i className="fa-regular fa-user"></i>Instructor</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="contact-tab-2" data-bs-toggle="tab" data-bs-target="#contact-2" type="button" role="tab" aria-controls="contact-2" aria-selected="false"><i className="fa-regular fa-star"></i>Reviews</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    <div className="tab-overview">
                                        <h3 className="title">Description</h3>
                                        <p className="mb-30">Rapidiously develop parallel e-markets via worldwide paradigms.
                                            Quickly synergize cutting-edge scenarios and professional results.
                                            Assertively deliver cross-media results before client-centric results.
                                            Uniquely initiate intuitive communities through process-centric internal or
                                            "organic" sources. Energistically reinvent distinctive value via parallel
                                            services.
                                            Phosfluorescently deploy extensive paradigms vis-a-vis cross-unit
                                            manufactured products. Uniquely coordinate impactful services whereas team
                                            building e-services. Globally grow multimedia based benefits vis-a-vis
                                            client-based niches.
                                        </p>
                                        <p className="mb-40">Professionally expedite synergistic technology without
                                            out-of-the-box human capital. Enthusiastically coordinate state of the art
                                            leadership after professional manufactured products. Distinctively enhance
                                            future-proof e-services whereas functionalized partnerships. Quickly
                                            streamline focused paradigms via orthogonal "outside the box" thinking.
                                            Rapidiously administrate 2.0 total linkage for cross-platform channels.</p>
                                        <h3 className="title">What Will You Learn?</h3>
                                        <p className="mb-0">Quickly synergize cutting-edge scenarios and professional
                                            results. Assertively deliver cross-media results before client-centric
                                            results. Uniquely initiate intuitive communities through process-centric
                                            internal or "organic" sources. Energistically reinvent distinctive value via
                                            parallel services extensive paradigms cross-unit manufactured products.</p>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                    <div className="curriculam-area">
                                        <div className="accordion" id="accordionExample">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                        Foundations of Fluent English Speaking
                                                    </button>
                                                </h2>
                                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <ul className="curri-list">
                                                            <li><span><i className="fa-regular fa-video"></i> Mastering
                                                                    Pronunciation and Intonation</span> <span>54.23 <i className="fa-regular fa-unlock"></i></span></li>
                                                            <li><span><i className="fa-regular fa-video"></i> Building a
                                                                    Strong Vocabulary for Everyday Communication</span>
                                                                <span>45.05 <i className="fa-regular fa-unlock"></i></span>
                                                            </li>
                                                            <li><span><i className="fa-regular fa-file-contract"></i>
                                                                    Understanding Basic Sentence Structure and
                                                                    Grammar</span> <span>1.6hr <i className="fa-regular fa-lock"></i></span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingTwo">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                        User Research Techniques
                                                    </button>
                                                </h2>
                                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <ul className="curri-list">
                                                            <li><span><i className="fa-regular fa-video"></i> Mastering
                                                                    Pronunciation and Intonation</span> <span>54.23 <i className="fa-regular fa-unlock"></i></span></li>
                                                            <li><span><i className="fa-regular fa-video"></i> Building a
                                                                    Strong Vocabulary for Everyday Communication</span>
                                                                <span>45.05 <i className="fa-regular fa-unlock"></i></span>
                                                            </li>
                                                            <li><span><i className="fa-regular fa-file-contract"></i>
                                                                    Understanding Basic Sentence Structure and
                                                                    Grammar</span> <span>1.6hr <i className="fa-regular fa-lock"></i></span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingThree">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                        Coursed Key Features
                                                    </button>
                                                </h2>
                                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <ul className="curri-list">
                                                            <li><span><i className="fa-regular fa-video"></i> Mastering
                                                                    Pronunciation and Intonation</span> <span>54.23 <i className="fa-regular fa-unlock"></i></span></li>
                                                            <li><span><i className="fa-regular fa-video"></i> Building a
                                                                    Strong Vocabulary for Everyday Communication</span>
                                                                <span>45.05 <i className="fa-regular fa-unlock"></i></span>
                                                            </li>
                                                            <li><span><i className="fa-regular fa-file-contract"></i>
                                                                    Understanding Basic Sentence Structure and
                                                                    Grammar</span> <span>1.6hr <i className="fa-regular fa-lock"></i></span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                    <div className="row team-wrap-2 gy-lg-0 gy-4 justify-content-center">
                                        <div className="col-lg-4 col-md-6">
                                            <div className="team-item-3 team-item-5">
                                                <div className="team-thumb">
                                                    <div className="shape"><img src={asset("assets/img/shapes/team-shape-3.png")} alt="team" /></div>
                                                    <div className="team-men">
                                                        <img src={asset("assets/img/team/team-men-1.png")} alt="team" />
                                                    </div>
                                                </div>
                                                <div className="team-content">
                                                    <h3 className="title"><a href="team-details.html">Mason D. Logan</a>
                                                    </h3>
                                                    <span>IT Trainier</span>
                                                    <ul className="social-list">
                                                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-behance"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-pinterest-p"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="team-item-3 team-item-5">
                                                <div className="team-thumb">
                                                    <div className="shape"><img src={asset("assets/img/shapes/team-shape-3.png")} alt="team" /></div>
                                                    <div className="team-men">
                                                        <img src={asset("assets/img/team/team-men-2.png")} alt="team" />
                                                    </div>
                                                </div>
                                                <div className="team-content">
                                                    <h3 className="title"><a href="team-details.html">Scarlett Hannah</a>
                                                    </h3>
                                                    <span>IT Trainier</span>
                                                    <ul className="social-list">
                                                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-behance"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-pinterest-p"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="team-item-3 team-item-5">
                                                <div className="team-thumb">
                                                    <div className="shape"><img src={asset("assets/img/shapes/team-shape-3.png")} alt="team" /></div>
                                                    <div className="team-men">
                                                        <img src={asset("assets/img/team/team-men-3.png")} alt="team" />
                                                    </div>
                                                </div>
                                                <div className="team-content">
                                                    <h3 className="title"><a href="team-details.html">Chloe Smith</a></h3>
                                                    <span>IT Trainier</span>
                                                    <ul className="social-list">
                                                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-behance"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-pinterest-p"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="contact-2" role="tabpanel" aria-labelledby="contact-tab-2">
                                    <div className="reviewr-wrap">
                                        <div className="review-list">
                                            <div className="review-item">
                                                <div className="review-thumb">
                                                    <img src={asset("assets/img/shop/review-list-1.jpg")} alt="img" />
                                                </div>
                                                <div className="content">
                                                    <div className="content-top">
                                                        <h4 className="name">Eleanor Fant <span>06 March, 2023</span></h4>
                                                        <ul className="review">
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                        </ul>
                                                    </div>
                                                    <p>Mauris non dignissim purus, ac commodo diam. Donec sit amet
                                                        lacinia nulla. Aliquam quis purus in justo pulvinar tempor.</p>
                                                </div>
                                            </div>
                                            <div className="review-item">
                                                <div className="review-thumb">
                                                    <img src={asset("assets/img/shop/review-list-2.jpg")} alt="img" />
                                                </div>
                                                <div className="content">
                                                    <div className="content-top">
                                                        <h4 className="name">Haliey White <span>06 March, 2023</span></h4>
                                                        <ul className="review">
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                            <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                                        </ul>
                                                    </div>
                                                    <p>Designed very similarly to the nearly double priced Galaxy tab
                                                        S6, with the only removal being.Mauris non dignissim purus, ac
                                                        commodo diam. Donec sit amet lacinia nulla. Aliquam quis purus
                                                        in justo pulvinar tempor.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-12">
                    <div className="course-sidebar price-box">
                        <h4 className="price">$90.00 <span>25% off</span></h4>
                        <a href="/cart" className="ed-primary-btn">Add to Cart</a>
                        <a href="/cart" className="ed-primary-btn buy-btn">Buy Now</a>
                    </div>
                    <div className="course-sidebar sticky-widget">
                        <h4 className="sidebar-title">Course Information</h4>
                        <ul className="course-sidebar-list">
                            <li><i className="fa-regular fa-house-chimney"></i>Instructor: <span>Kevin Perry</span></li>
                            <li><i className="fa-regular fa-book"></i>Lessons: <span>8</span></li>
                            <li><i className="fa-regular fa-clock"></i>Duration: <span>15h 30m 36s</span></li>
                            <li><i className="fa-regular fa-tag"></i>Course level: <span>Beginners</span></li>
                            <li><i className="fa-regular fa-globe"></i>Language: <span>English</span></li>
                            <li><i className="fa-regular fa-puzzle-piece"></i>Quizzes: <span>04</span></li>
                        </ul>
                        <div className="share-btn">
                            <button className="ed-primary-btn"><i className="fa-regular fa-share-nodes"></i>Share This
                                Course</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
