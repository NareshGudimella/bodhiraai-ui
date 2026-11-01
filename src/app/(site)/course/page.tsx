import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { assetResolver, siteMetadata } from "@/lib/site";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/course", 'Bodhira.ai - Modern Digital Learning Infrastructure');
}

/** Legacy resources/views/course.blade.php. */
export default async function CoursePage() {
  await connection();
  const asset = await assetResolver();
  return (
    <>
      <SeoSchema path="course" />
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
                <h1 className="title">Course Page</h1>
                <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="/course"> Course Page</a></h4>
            </div>
        </div>
    </section>
    

    <section className="feature-course bg-white pt-120 pb-120">
        <div className="container">
            <div className="section-heading text-center">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Top Class Courses</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Explore Featured Courses</h2>
            </div>
            <div className="row gy-4 justify-content-center">
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="course-item wow fade-in-bottom" data-wow-delay="200ms">
                        <div className="course-thumb-wrap">
                            <div className="course-thumb">
                                <img src={asset("assets/img/images/course-img-1.png")} alt="course" />
                            </div>
                        </div>
                        <div className="course-content">
                            <span className="offer">Skill</span>
                            <h3 className="title"><a href="/course-details">React Tutorial Beginners For Skills Building
                                    Carrera</a></h3>
                            <ul className="course-list">
                                <li><i className="fa-light fa-file"></i>Lesson 8</li>
                                <li><i className="fa-light fa-user"></i>Students 50</li>
                                <li><i className="fa-light fa-eye"></i>View: 12K</li>
                            </ul>
                            <div className="course-author-box">
                                <div className="course-author">
                                    <div className="author-img">
                                        <img src={asset("assets/img/images/course-author-1.png")} alt="course" />
                                    </div>
                                    <div className="author-info">
                                        <h4 className="name">Kevin Perry</h4>
                                        <span>Instructor</span>
                                    </div>
                                </div>
                                <ul className="course-review">
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li className="point">(4.7)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bottom-content">
                            <span className="price">$59.00</span>
                            <a href="/course-details" className="course-btn">View Details</a>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="course-item wow fade-in-bottom" data-wow-delay="400ms">
                        <div className="course-thumb-wrap">
                            <div className="course-thumb">
                                <img src={asset("assets/img/images/course-img-2.png")} alt="course" />
                            </div>
                        </div>
                        <div className="course-content">
                            <span className="offer">Free</span>
                            <h3 className="title"><a href="/course-details">Cultural Perspectives in Teaching <br />and
                                    Learning Environments</a></h3>
                            <ul className="course-list">
                                <li><i className="fa-light fa-file"></i>Lesson 8</li>
                                <li><i className="fa-light fa-user"></i>Students 50</li>
                                <li><i className="fa-light fa-eye"></i>View: 12K</li>
                            </ul>
                            <div className="course-author-box">
                                <div className="course-author">
                                    <div className="author-img">
                                        <img src={asset("assets/img/images/course-author-2.png")} alt="course" />
                                    </div>
                                    <div className="author-info">
                                        <h4 className="name">Kevin Perry</h4>
                                        <span>Instructor</span>
                                    </div>
                                </div>
                                <ul className="course-review">
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li className="point">(4.7)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bottom-content">
                            <span className="price">$59.00</span>
                            <a href="/course-details" className="course-btn">View Details</a>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="course-item wow fade-in-bottom" data-wow-delay="500ms">
                        <div className="course-thumb-wrap">
                            <div className="course-thumb">
                                <img src={asset("assets/img/images/course-img-3.png")} alt="course" />
                            </div>
                        </div>
                        <div className="course-content">
                            <span className="offer">Language</span>
                            <h3 className="title"><a href="/course-details">Innovative Instructional Strategies <br />for
                                    Enhancing Student</a></h3>
                            <ul className="course-list">
                                <li><i className="fa-light fa-file"></i>Lesson 8</li>
                                <li><i className="fa-light fa-user"></i>Students 50</li>
                                <li><i className="fa-light fa-eye"></i>View: 12K</li>
                            </ul>
                            <div className="course-author-box">
                                <div className="course-author">
                                    <div className="author-img">
                                        <img src={asset("assets/img/images/course-author-3.png")} alt="course" />
                                    </div>
                                    <div className="author-info">
                                        <h4 className="name">Kevin Perry</h4>
                                        <span>Instructor</span>
                                    </div>
                                </div>
                                <ul className="course-review">
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li className="point">(4.7)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bottom-content">
                            <span className="price">$59.00</span>
                            <a href="/course-details" className="course-btn">View Details</a>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="course-item wow fade-in-bottom" data-wow-delay="200ms">
                        <div className="course-thumb-wrap">
                            <div className="course-thumb">
                                <img src={asset("assets/img/images/course-img-4.png")} alt="course" />
                            </div>
                        </div>
                        <div className="course-content">
                            <span className="offer">Develop</span>
                            <h3 className="title"><a href="/course-details">React Tutorial Beginners For Skills Building
                                    Carrera</a></h3>
                            <ul className="course-list">
                                <li><i className="fa-light fa-file"></i>Lesson 8</li>
                                <li><i className="fa-light fa-user"></i>Students 50</li>
                                <li><i className="fa-light fa-eye"></i>View: 12K</li>
                            </ul>
                            <div className="course-author-box">
                                <div className="course-author">
                                    <div className="author-img">
                                        <img src={asset("assets/img/images/course-author-4.png")} alt="course" />
                                    </div>
                                    <div className="author-info">
                                        <h4 className="name">Kevin Perry</h4>
                                        <span>Instructor</span>
                                    </div>
                                </div>
                                <ul className="course-review">
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li className="point">(4.7)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bottom-content">
                            <span className="price">$59.00</span>
                            <a href="/course-details" className="course-btn">View Details</a>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="course-item wow fade-in-bottom" data-wow-delay="400ms">
                        <div className="course-thumb-wrap">
                            <div className="course-thumb">
                                <img src={asset("assets/img/images/course-img-5.png")} alt="course" />
                            </div>
                        </div>
                        <div className="course-content">
                            <span className="offer">Management</span>
                            <h3 className="title"><a href="/course-details">Cultural Perspectives in Teaching <br />and
                                    Learning Environments</a></h3>
                            <ul className="course-list">
                                <li><i className="fa-light fa-file"></i>Lesson 8</li>
                                <li><i className="fa-light fa-user"></i>Students 50</li>
                                <li><i className="fa-light fa-eye"></i>View: 12K</li>
                            </ul>
                            <div className="course-author-box">
                                <div className="course-author">
                                    <div className="author-img">
                                        <img src={asset("assets/img/images/course-author-5.png")} alt="course" />
                                    </div>
                                    <div className="author-info">
                                        <h4 className="name">Kevin Perry</h4>
                                        <span>Instructor</span>
                                    </div>
                                </div>
                                <ul className="course-review">
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li className="point">(4.7)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bottom-content">
                            <span className="price">$59.00</span>
                            <a href="/course-details" className="course-btn">View Details</a>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="course-item wow fade-in-bottom" data-wow-delay="500ms">
                        <div className="course-thumb-wrap">
                            <div className="course-thumb">
                                <img src={asset("assets/img/images/course-img-2.png")} alt="course" />
                            </div>
                        </div>
                        <div className="course-content">
                            <span className="offer">Educational</span>
                            <h3 className="title"><a href="/course-details">Innovative Instructional Strategies <br />for
                                    Enhancing Student</a></h3>
                            <ul className="course-list">
                                <li><i className="fa-light fa-file"></i>Lesson 8</li>
                                <li><i className="fa-light fa-user"></i>Students 50</li>
                                <li><i className="fa-light fa-eye"></i>View: 12K</li>
                            </ul>
                            <div className="course-author-box">
                                <div className="course-author">
                                    <div className="author-img">
                                        <img src={asset("assets/img/images/course-author-6.png")} alt="course" />
                                    </div>
                                    <div className="author-info">
                                        <h4 className="name">Kevin Perry</h4>
                                        <span>Instructor</span>
                                    </div>
                                </div>
                                <ul className="course-review">
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li><i className="fa-sharp fa-solid fa-star"></i></li>
                                    <li className="point">(4.7)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bottom-content">
                            <span className="price">$59.00</span>
                            <a href="/course-details" className="course-btn">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
