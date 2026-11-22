import { Suspense } from "react";
import { connection } from "next/server";
import { assetResolver, settingResolver } from "@/lib/site";
import { getChrome } from "@/lib/site-api";
import { Icon } from "./icons";
import { NavItems, NavList } from "./nav-items";

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

/**
 * The marketing header (legacy layouts/app.blade.php): top bar, CMS menu,
 * mobile side menu. Restyled with the 2026 homepage redesign (not in legacy):
 * own `bh-*` classes (public/assets/css/site-chrome.css) instead of the theme's
 * `.header`, a CSS-sticky nav bar and an active menu item. The theme's
 * meanmenu still copies `.mobile-menu-items` into the side menu.
 */
export async function SiteHeader() {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const [{ header_menu, social }, asset, setting] = await Promise.all([getChrome(), assetResolver(), settingResolver()]);
  const phone = setting("contact.phone", "+91 99852 52786");
  const address = setting("contact.address", "Pragathi Nagar, Hyderabad");
  const email = setting("contact.email", "bodhira.ai.pvt.ltd@gmail.com");
  const hours = setting("contact.hours", "Mon - Sat: 8:00 - 15:00");
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const nav = header_menu.length ? header_menu.map((i) => ({ label: i.label, url: i.url, target: i.target || "_self" })) : DEFAULT_NAV;
  const logo = asset("assets/img/logo/bodhira-logo-light.png");
  return (
    <>
      <a href="#main" className="bh-skip">Skip to content</a>
      <div className="bh-topbar">
        <div className="bh-container bh-topbar__inner">
          <ul className="bh-topbar__info">
            <li><Icon name="phone" size={14} /><a href={tel}>{phone}</a></li>
            <li className="bh-hide-sm"><Icon name="mapPin" size={14} /><span>{address}</span></li>
            <li className="bh-hide-md"><Icon name="clock" size={14} /><span>{hours}</span></li>
          </ul>
          <div className="bh-topbar__right">
            <a href="/login" className="bh-topbar__signin"><Icon name="user" size={14} />Sign In</a>
            {social.length > 0 && (
              <div className="bh-topbar__social">
                <span className="bh-hide-sm">Follow Us</span>
                <ul>
                  {social.map((s) => (
                    <li key={s.id}>
                      <a href={s.url} target="_blank" rel="noopener" aria-label={s.platform}><i className={s.icon || `fab fa-${s.platform}`} aria-hidden="true"></i></a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <header className="bh-header">
        <div className="bh-container bh-header__inner">
          <a href="/" className="bh-header__logo"><img src={logo} alt={setting("general.site_name", "Bodhira.ai")} width={800} height={240} /></a>
          <nav className="bh-header__nav mobile-menu-items" aria-label="Main">
            <ul className="sub-menu">
              <Suspense fallback={<NavList items={nav} />}>
                <NavItems items={nav} />
              </Suspense>
            </ul>
          </nav>
          <div className="bh-header__actions">
            <a href="/login" className="bh-btn bh-btn--gold bh-header__signin">Sign In <Icon name="arrowRight" size={16} /></a>
            {/* Legacy href="javascript:void(0)": React blocks javascript: URLs; the theme's jQuery opens the side menu. */}
            <button type="button" className="mobile-side-menu-toggle bh-header__burger" aria-label="Open menu"><Icon name="menu" size={22} /></button>
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
          <a href="/login" className="bh-btn bh-btn--maroon bh-side-signin">Sign In</a>
          <ul className="side-menu-list">
            <li><i className="fa-light fa-location-dot"></i>Address : <span>{address}</span></li>
            <li><i className="fa-light fa-phone"></i>Phone : <a href={tel}>{phone}</a></li>
            <li><i className="fa-light fa-envelope"></i>Email : <a href={`mailto:${email}`}>{email}</a></li>
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
