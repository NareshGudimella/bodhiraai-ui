import { connection } from "next/server";
import { assetResolver, settingResolver } from "@/lib/site";
import { getChrome } from "@/lib/site-api";

/** Legacy fallback when the CMS header menu is empty. */
const DEFAULT_NAV = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Courses", "/courses"],
  ["LMS Platform", "/features"],
  ["Success Stories", "/success-stories"],
  ["Blogs & Articles", "/blog"],
  ["Pricing", "/pricing"],
  ["FAQ", "/faq"],
  ["Contact Us", "/contact"],
].map(([label, url]) => ({ label, url, target: "_self" }));

/** The marketing header (legacy layouts/app.blade.php): top bar, CMS menu, mobile side menu, preloader. */
export async function SiteHeader() {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const [{ header_menu, social }, asset, setting] = await Promise.all([getChrome(), assetResolver(), settingResolver()]);
  const phone = setting("contact.phone", "+91 99852 52786");
  const address = setting("contact.address", "Pragathi Nagar, Hyderabad");
  const nav = header_menu.length ? header_menu.map((i) => ({ label: i.label, url: i.url, target: i.target || "_self" })) : DEFAULT_NAV;
  const logo = asset("assets/img/logo/bodhira-logo-light.png");
  return (
    <>
      <header className="header header-3 sticky-active">
        <div className="top-bar">
          <div className="container">
            <div className="top-bar-inner">
              <div className="top-bar-left">
                <ul className="top-bar-list">
                  <li><i className="fa-regular fa-phone"></i><a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a></li>
                  <li><i className="fa-regular fa-location-dot"></i><span>{address}</span></li>
                  <li><i className="fa-regular fa-clock"></i><span>Mon - Sat: 8:00 - 15:00</span></li>
                </ul>
              </div>
              <div className="top-bar-right">
                <div className="register-box">
                  <div className="icon"><i className="fa-regular fa-user"></i></div>
                  <a href="/login">Sign In</a>
                </div>
                {social.length > 0 && (
                  <div className="top-social-wrap">
                    <span>Follow Us</span>
                    <ul className="social-list">
                      {social.map((s) => (
                        <li key={s.id}><a href={s.url} target="_blank" rel="noopener"><i className={s.icon || `fab fa-${s.platform}`}></i></a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="primary-header">
          <div className="container">
            <div className="primary-header-inner">
              <div className="header-logo d-lg-block">
                <a href="/"><img src={logo} alt="Logo" /></a>
              </div>
              <div className="header-menu-wrap">
                <div className="mobile-menu-items">
                  <ul className="sub-menu">
                    {nav.map((it, i) => (
                      <li key={i}><a href={it.url} target={it.target}>{it.label}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="header-right-wrap">
                <div className="header-right">
                  <a href="/login" className="ed-primary-btn header-btn">Sign In</a>
                  <div className="header-logo d-none d-lg-none">
                    <a href="/"><img src={logo} alt="Logo" /></a>
                  </div>
                  <div className="header-right-item d-lg-none d-md-block">
                    {/* Legacy href="javascript:void(0)": React blocks javascript: URLs; an <a> without href does nothing either. */}
                    <a className="mobile-side-menu-toggle" role="button" tabIndex={0} aria-label="Open menu"><i className="fa-sharp fa-solid fa-bars"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div id="popup-search-box">
        <div className="box-inner-wrap d-flex align-items-center">
          <form id="form" action="#" method="get" role="search">
            <input id="popup-search" type="text" name="s" placeholder="Type keywords here..." />
          </form>
          <div className="search-close"><i className="fa-sharp fa-regular fa-xmark"></i></div>
        </div>
      </div>

      <div className="mobile-side-menu">
        <div className="side-menu-content">
          <div className="side-menu-head">
            <a href="/"><img src={logo} alt="logo" /></a>
            <button className="mobile-side-menu-close" aria-label="Close menu"><i className="fa-regular fa-xmark"></i></button>
          </div>
          <div className="side-menu-wrap"></div>
          <ul className="side-menu-list">
            <li><i className="fa-light fa-location-dot"></i>Address : <span>Pragathi Nagar, Hyderabad</span></li>
            <li><i className="fa-light fa-phone"></i>Phone : <a href="tel:+919985252786">+91 99852 52786</a></li>
            <li><i className="fa-light fa-envelope"></i>Email : <a href="mailto:bodhira.ai.pvt.ltd@gmail.com">bodhira.ai.pvt.ltd@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="mobile-side-menu-overlay"></div>

      <div id="preloader">
        <div className="spinner-logo"><img src={asset("assets/img/favicon.png")} alt="logo" /></div>
        <div className="spinner"></div>
      </div>
    </>
  );
}
