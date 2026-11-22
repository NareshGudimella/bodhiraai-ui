import { Suspense } from "react";
import { connection } from "next/server";
import { assetResolver, settingResolver } from "@/lib/site";
import { getChrome } from "@/lib/site-api";
import { HeaderBar, MenuButton, MobileMenu, MobileMenuProvider } from "./header-client";
import { BrandIcon, brandFor, Icon } from "./icons";
import { NavItems, NavList } from "./nav-items";
import { btn, cx } from "./ui";

/** Legacy fallback when the CMS header menu is empty. */
const DEFAULT_NAV = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Courses", "/courses"],
  ["LMS Platform", "/features"],
  ["Success Stories", "/success-stories"],
  ["Pricing", "/pricing"],
  ["Contact Us", "/contact"],
].map(([label, url]) => ({ label, url, target: "_self" }));

/** Top bar links: light cream, white on hover; gold focus ring on the dark bar. */
const TOPBAR_LINK = "text-[rgba(246,234,218,.82)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright";

/**
 * The marketing header (legacy layouts/app.blade.php): top bar, CMS menu,
 * mobile side menu. Restyled with the 2026 homepage redesign (not in legacy):
 * a CSS-sticky nav bar that compacts on scroll and an active menu item.
 * Tailwind migration (not in legacy): utility classes instead of site-chrome.css,
 * and the side menu is React (header-client.tsx) instead of the theme's jQuery
 * meanmenu copy of `.mobile-menu-items`; same markup order, look and keyboard support.
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
  const siteName = setting("general.site_name", "Bodhira.ai");
  return (
    <MobileMenuProvider>
      <a
        href="#main"
        className="absolute left-3 -top-16 z-[10000] rounded-[10px] bg-white px-4 py-2.5 font-sans text-sm leading-[normal] font-semibold text-maroon shadow-md transition-none focus:fixed focus:top-3 focus:text-maroon focus:outline-2 focus:outline-offset-2 focus:outline-maroon"
      >
        Skip to content
      </a>
      <section className="bg-maroon-900 font-sans text-[13px] leading-[1.4] font-medium text-[rgba(246,234,218,.82)]" aria-label="Contact details and sign in">
        <div className="site-container flex min-h-10 items-center justify-between gap-4">
          <ul className="m-0 flex list-none flex-wrap items-center gap-x-6 gap-y-1.5 p-0">
            <li className="inline-flex items-center gap-2 whitespace-nowrap">
              <Icon name="phone" size={14} className="text-gold-bright" />
              <a href={tel} className={TOPBAR_LINK}>{phone}</a>
            </li>
            <li className="inline-flex items-center gap-2 whitespace-nowrap max-sm:hidden">
              <Icon name="mapPin" size={14} className="text-gold-bright" />
              <span>{address}</span>
            </li>
            <li className="inline-flex items-center gap-2 whitespace-nowrap max-nav:hidden">
              <Icon name="clock" size={14} className="text-gold-bright" />
              <span>{hours}</span>
            </li>
          </ul>
          <div className="flex items-center gap-5">
            <a href="/login" className={cx("inline-flex items-center gap-2 whitespace-nowrap", TOPBAR_LINK)}>
              <Icon name="user" size={14} className="text-gold-bright" />
              Sign In
            </a>
            {social.length > 0 && (
              <div className="flex items-center gap-2.5 max-sm:hidden">
                <span>Follow Us</span>
                <ul className="m-0 flex list-none gap-0.5 p-0">
                  {social.map((s) => {
                    const brand = brandFor(s.platform, s.icon);
                    return (
                      <li key={s.id}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener"
                          aria-label={`${s.platform} (opens in a new tab)`}
                          className="group/social grid h-7 w-7 place-items-center rounded-full transition-[background-color] duration-200 hover:bg-[rgba(255,255,255,.08)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright motion-reduce:transition-none"
                        >
                          {brand ? (
                            <BrandIcon name={brand} size={13} className="text-[rgba(246,234,218,.82)] group-hover/social:text-gold-bright" />
                          ) : (
                            <Icon name="globe" size={13} className="text-[rgba(246,234,218,.82)] group-hover/social:text-gold-bright" />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <HeaderBar>
        <div className="site-container flex min-h-[76px] items-center justify-between gap-6 transition-[min-height] duration-250 ease-bh max-[1101px]:gap-3 max-nav:min-h-16 nav:group-data-scrolled/header:min-h-[62px] motion-reduce:transition-none">
          <a href="/" className="inline-flex flex-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright">
            <img
              src={logo}
              alt={siteName}
              width={708}
              height={162}
              className="block h-[34px] w-auto max-w-none transition-[height] duration-250 ease-bh max-2xl:h-[31px] max-sm:h-7 sm:group-data-scrolled/header:h-[30px]! motion-reduce:transition-none"
            />
          </a>
          <nav className="block flex-[1_1_auto] max-nav:hidden" aria-label="Main">
            <ul className="m-0 flex list-none items-center gap-0.5 p-0">
              <Suspense fallback={<NavList items={nav} variant="bar" />}>
                <NavItems items={nav} variant="bar" />
              </Suspense>
            </ul>
          </nav>
          <div className="flex flex-none items-center gap-2.5">
            <a href="/login" className={btn("gold", "custom", "min-h-[42px] px-5 text-[15px] max-[1101px]:px-4 max-sm:hidden")}>
              Sign In <Icon name="arrowRight" size={16} />
            </a>
            <MenuButton />
          </div>
        </div>
      </HeaderBar>

      <MobileMenu
        nav={
          <Suspense fallback={<NavList items={nav} variant="side" />}>
            <NavItems items={nav} variant="side" />
          </Suspense>
        }
        head={
          <a href="/" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon focus-visible:rounded-[6px]">
            <img src={logo} alt={`${siteName} home`} width={708} height={162} loading="lazy" decoding="async" className="inline h-auto max-h-[54px] w-auto max-w-[150px] object-contain align-middle" />
          </a>
        }
        signIn={
          <a href="/login" className={btn("maroon", "md", "-mt-6 mb-8 w-full nav:hidden focus-visible:outline-maroon! focus-visible:outline-offset-2! focus-visible:rounded-[6px]")}>
            Sign In
          </a>
        }
        contact={
          <ul className="mt-[25px] mb-[35px] list-none p-0 font-outfit text-base leading-[26px] font-medium text-legacy-heading">
            {[
              ["mapPin", "Address", <span key="v" className="ml-2.5">{address}</span>],
              ["phone", "Phone", <a key="v" href={tel} className={SIDE_LINK}>{phone}</a>],
              ["mail", "Email", <a key="v" href={`mailto:${email}`} className={SIDE_LINK}>{email}</a>],
            ].map(([icon, label, value]) => (
              <li key={label as string} className="flex items-center not-last:mb-5">
                {/* Legacy look: the icon is gold on its gold tile (site-layout.css forced the glyph gold), so it shows as a plain tile. */}
                <span aria-hidden="true" className="mr-2.5 block h-[30px] w-[30px] rounded-[5px] bg-gold text-center text-[12px] leading-[30px] text-gold">
                  <Icon name={icon as "mapPin"} size={12} />
                </span>
                {label} : {value}
              </li>
            ))}
          </ul>
        }
      />
    </MobileMenuProvider>
  );
}

/** A link in the side menu's contact list (legacy main.css `.side-menu-list li a`). */
const SIDE_LINK = "ml-2.5 pl-2.5 text-base text-legacy-heading hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon focus-visible:rounded-[6px]";
