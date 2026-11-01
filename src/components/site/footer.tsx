import { connection } from "next/server";
import { mediaUrl } from "@/lib/media";
import { assetResolver, currentYear, fmtDate, settingResolver, strLimit } from "@/lib/site";
import { getChrome } from "@/lib/site-api";
import { newsletterSubscribe } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";
import { FlashClear } from "./flash-clear";

/** `session('newsletter_status')`. */
async function NewsletterStatus() {
  await connection();
  const flash = await getSiteFlash();
  const msg = flash.messages?.newsletter_status;
  return msg ? (
    <>
      <p className="mb-20" style={{ color: "#C49560" }}>{msg}</p>
      <FlashClear />
    </>
  ) : null;
}

/** The marketing footer (legacy layouts/app.blade.php): newsletter, about, social, CMS footer menu, recent posts. */
export async function SiteFooter() {
  const [{ footer_menu, social, recent_posts }, asset, setting, year] = await Promise.all([getChrome(), assetResolver(), settingResolver(), currentYear()]);
  const email = setting("contact.email");
  return (
    <>
      <footer className="footer-section pt-120" data-background={asset("assets/img/bg-img/footer-bg.png")}>
        <div className="footer-top-wrap">
          <div className="container">
            <div className="footer-top text-center">
              <h2 className="title">Stay Updated on {setting("general.site_name", "Bodhira.ai")} <br />News &amp; Releases</h2>
              <NewsletterStatus />
              <div className="footer-form-wrap">
                <form action={newsletterSubscribe} className="footer-form">
                  <div className="form-item">
                    <input type="email" id="email-2" name="email" className="form-control" required placeholder="Enter Your E-mail" />
                  </div>
                  <button className="ed-primary-btn">sign up</button>
                </form>
              </div>
            </div>
            <div className="row footer-wrap">
              <div className="col-lg-3 col-md-6">
                <div className="footer-widget">
                  <h3 className="widget-header">Get in touch!</h3>
                  <p className="mb-30">{setting("footer.about", "A modern learning platform built around the way your school already teaches.")}</p>
                  {email && <p className="mb-20"><a href={`mailto:${email}`} style={{ color: "#C49560" }}>{email}</a></p>}
                  <ul className="footer-social">
                    {social.length ? (
                      social.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noopener"><i className={s.icon || `fab fa-${s.platform}`}></i></a></li>)
                    ) : (
                      <>
                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                        <li><a href="#"><i className="fab fa-youtube"></i></a></li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-widget widget-2">
                  <h3 className="widget-header">Company Info</h3>
                  <ul className="footer-list">
                    {footer_menu.length ? (
                      footer_menu.map((item) => <li key={item.id}><a href={item.url} target={item.target}>{item.label}</a></li>)
                    ) : (
                      <>
                        <li><a href="/about">About</a></li>
                        <li><a href="/features">Features</a></li>
                        <li><a href="/pricing">Pricing</a></li>
                        <li><a href="/student-registration">Student Registration</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/login">Sign In</a></li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-widget widget-2">
                  <h3 className="widget-header">Useful Links</h3>
                  <ul className="footer-list">
                    <li><a href="/">Home</a></li>
                    <li><a href="/pricing">Plans &amp; Pricing</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms &amp; Conditions</a></li>
                    <li><a href="/refund">Refund Policy</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-widget">
                  <h3 className="widget-header">Recent Post</h3>
                  {recent_posts.length ? (
                    recent_posts.map((post) => (
                      <div key={post.id} className="sidebar-post mb-20">
                        <img src={mediaUrl(post.cover_image_url) ?? asset("assets/img/images/footer-post-1.png")} alt="post" />
                        <div className="post-content">
                          <h3 className="title"><a href={`/blog/${post.slug}`}>{strLimit(post.title, 34)}</a></h3>
                          <ul className="post-meta">
                            <li><i className="fa-light fa-calendar"></i>{fmtDate(post.published_at, "d M, Y")}</li>
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sidebar-post mb-20">
                      <img src={asset("assets/img/images/footer-post-1.png")} alt="post" />
                      <div className="post-content">
                        <h3 className="title"><a href="/blog">Read our latest articles</a></h3>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-area">
          <div className="container">
            <div className="copyright-content">
              <p>
                {setting("footer.copyright", `Copyright © ${year} Bodhira.ai. All Rights Reserved.`)}
                &nbsp;|&nbsp; <a href="/privacy">Privacy Policy</a>
                &nbsp;|&nbsp; <a href="/terms">Terms &amp; Conditions</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
      <div id="scrollup">
        <button id="scroll-top" className="scroll-to-top" aria-label="Back to top"><i className="fa-regular fa-arrow-up-long"></i></button>
      </div>
    </>
  );
}
