import { accountLink } from "@/lib/session";
import { Fragment } from "react";
import { connection } from "next/server";
import { mediaUrl } from "@/lib/media";
import { assetResolver, currentYear, fmtDate, settingResolver, strLimit } from "@/lib/site";
import { getChrome } from "@/lib/site-api";
import { newsletterSubscribe } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";
import { businessDetails } from "@/lib/site-business";
import { CookieSettingsButton } from "./cookie-consent";
import { BackToTop } from "./footer-client";
import { FlashClear } from "./flash-clear";
import { BrandIcon, brandFor, Icon, type BrandName } from "./icons";
import { KfConsent } from "./kit-forms-fields";
import { KfFocusResult } from "./kit-forms-focus";
import { Tba } from "./tba";
import { btn, cx } from "./ui";
import { L, emailProps } from "@/lib/input-limits";

/** Paragraph font in the footer (was `.bh-footer p`: 15px/1.65, cream at 72%); callers add size, colour, line height. */
const P = "font-sans font-normal";
const P_TEXT = "text-[15px] leading-[1.65] text-[rgba(246,234,218,.72)]";
/** Footer links: light cream, gold on hover, gold focus ring. */
const LINK = "text-[rgba(246,234,218,.82)] transition-[color] duration-200 hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright";
const HEAD = "mt-2 mb-5 font-sans text-[13px] leading-[1.2] font-semibold tracking-[.08em] text-ivory uppercase";

/** `session('newsletter_status')`. */
async function NewsletterStatus() {
  await connection();
  const flash = await getSiteFlash();
  const msg = flash.messages?.newsletter_status;
  return msg ? (
    <>
      <p className={cx("font-sans text-[15px] leading-[1.65]", "mt-2.5 mb-0 font-medium text-gold-bright")} role="status">{msg}</p>
      <FlashClear />
    </>
  ) : null;
}

/**
 * The newsletter form, with the consent block (not in legacy, 2026-11-22):
 * its errors come back in the `newsletter` error bag, so the page's own form
 * doesn't show them, and are shown (and focused) here with the old email.
 */
async function NewsletterForm() {
  await connection();
  const flash = await getSiteFlash();
  const mine = flash.bag === "newsletter";
  const errors = mine ? flash.errors ?? {} : {};
  const old = mine ? flash.old ?? {} : {};
  const emailError = errors.email?.[0];
  return (
    <form key={JSON.stringify(old)} action={newsletterSubscribe} className="grid gap-3">
      {emailError && (
        <>
          <p id="email-2-error" className={cx("font-sans text-[15px] leading-[1.65]", "mt-2.5 mb-0 font-semibold text-[#FFD3CC] focus:outline-2 focus:outline-offset-3 focus:outline-gold-bright")} role="alert" tabIndex={-1} data-kf-focus>{emailError}</p>
          <FlashClear />
        </>
      )}
      {(emailError || errors.consent) && <KfFocusResult />}
      <div className="flex gap-2 rounded-full border border-[rgba(255,255,255,.12)] bg-[rgba(0,0,0,.2)] p-1.5 transition-[border-color,box-shadow] duration-200 focus-within:border-gold focus-within:shadow-[0_0_0_4px_rgba(226,184,115,.15)] max-xs:flex-col max-xs:rounded-[20px] motion-reduce:transition-none">
        <label htmlFor="email-2" className="sr-only">Email address</label>
        <input
          {...emailProps(L.emailLead)}
          id="email-2"
          name="email"
          required
          placeholder="Enter your e-mail"
          defaultValue={old.email}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "email-2-error" : undefined}
          className="min-w-0 flex-[1_1_auto] border-0 bg-transparent px-[18px] font-sans text-[15px] leading-[normal] font-normal text-ivory outline-0 placeholder:text-[rgba(246,234,218,.66)] max-xs:min-h-[46px]"
        />
        <button className={btn("gold")} type="submit">Sign Up <Icon name="send" size={16} /></button>
      </div>
      {errors.consent && !emailError && <FlashClear />}
      <KfConsent
        id="newsletter-consent"
        variant="footer"
        focusOnError
        checked={old.consent === "1"}
        error={errors.consent?.[0]}
        purpose="We use your email only to send the Bodhira.ai newsletter. Unsubscribe any time by emailing us."
      >
        , and I agree to receive the newsletter.
      </KfConsent>
    </form>
  );
}

const FALLBACK_MENU = [
  ["About", "/about"],
  ["Features", "/features"],
  ["Pricing", "/pricing"],
  ["Student Registration", "/student-registration"],
  ["Contact", "/contact"],
  ["Sign In", "/login"],
];
// Blogs & Articles and FAQ moved here from the header menu (not in legacy).
const USEFUL_LINKS = [
  ["Home", "/"],
  ["Blogs & Articles", "/blog"],
  ["FAQ", "/faq"],
  ["Plans & Pricing", "/pricing"],
];
/** Shown once, in the bottom bar. */
const LEGAL_LINKS = [
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms"],
  ["Refund Policy", "/refund"],
  ["Cookie Policy", "/cookies"], // not in legacy
];
/** Social links when the CMS has none (legacy placeholders). */
const FALLBACK_SOCIAL: [string, BrandName][] = [["Facebook", "facebook-f"], ["Instagram", "instagram"], ["YouTube", "youtube"]];

/** A link's path for comparing menu entries: no query, hash or trailing slash, lower case. */
const pathKey = (url: string) => (url.split(/[?#]/)[0].replace(/\/+$/, "") || "/").toLowerCase();
const LEGAL_KEYS = new Set(LEGAL_LINKS.map(([, url]) => pathKey(url)));

const SOCIAL_LINK = "group/social grid h-[38px] w-[38px] place-items-center rounded-sm border border-[rgba(255,255,255,.12)] bg-[rgba(255,255,255,.04)] transition-[background-color,translate,border-color] duration-200 ease-bh hover:-translate-y-0.5 hover:border-gold-bright hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright motion-reduce:transition-none";
const SOCIAL_ICON = "text-[rgba(246,234,218,.85)] group-hover/social:text-maroon-deep";

/**
 * The marketing footer (legacy layouts/app.blade.php): newsletter, about,
 * social, CMS footer menu, contact details, recent posts. Restyled with the
 * 2026 homepage redesign (not in legacy), plus the contact column from the settings.
 * Tailwind migration (not in legacy): utilities instead of site-chrome.css /
 * site-compliance.css, social marks as inline SVG instead of Font Awesome, and
 * back to top in React (footer-client.tsx) instead of the theme's jQuery.
 */
export async function SiteFooter() {
  const account = await accountLink();
  const [{ footer_menu, social, recent_posts }, asset, setting, year, biz] = await Promise.all([getChrome(), assetResolver(), settingResolver(), currentYear(), businessDetails()]);
  const siteName = setting("general.site_name", "Bodhira.ai");
  // contact.email / contact.phone, else the legacy contact page's (lib/site-business.ts).
  const { email, phone } = biz;
  const address = setting("contact.address", "Pragathi Nagar, Hyderabad");
  const hours = setting("contact.hours", "Mon - Sat: 8:00 - 15:00");
  // Each link appears once (not in legacy): legal pages only in the bottom bar, and
  // Useful Links skips whatever the CMS Company Info menu already lists.
  const company = (footer_menu.length
    ? footer_menu.map((i) => ({ key: String(i.id), label: i.label, url: i.url, target: i.target }))
    : FALLBACK_MENU.map(([label, url]) =>
        url === "/login" ? { key: url, label: account.label, url: account.href, target: undefined } : { key: url, label, url, target: undefined },
      )
  ).filter((i) => !LEGAL_KEYS.has(pathKey(i.url)));
  const companyKeys = new Set(company.map((i) => pathKey(i.url)));
  const useful = USEFUL_LINKS.filter(([, url]) => !companyKeys.has(pathKey(url)) && !LEGAL_KEYS.has(pathKey(url)));
  return (
    <>
      <footer className="relative overflow-hidden bg-[radial-gradient(60%_80%_at_100%_0%,rgba(122,36,55,.55),transparent_60%),linear-gradient(180deg,#2E0F16_0%,#1E0A0E_100%)] font-sans text-base leading-[1.625] text-[rgba(246,234,218,.72)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(226,184,115,.45),transparent)] before:content-['']">
        <div className="site-container">
          <div className="mt-16 grid grid-cols-[1.1fr_1fr] items-center gap-8 rounded-lg border border-[rgba(226,184,115,.16)] bg-[rgba(255,255,255,.04)] px-10 py-8 max-md:mt-10 max-md:grid-cols-1 max-md:p-6">
            <div>
              <h2 className="m-0 mb-1.5 font-sans text-[26px] leading-[1.25] font-bold tracking-[-.02em] text-ivory max-md:text-[21px]">Stay Updated on {siteName} News &amp; Releases</h2>
              <p className={cx(P, P_TEXT, "m-0")}>Product updates, teaching ideas and new subjects. No spam.</p>
              <NewsletterStatus />
            </div>
            <NewsletterForm />
          </div>

          <div className="grid grid-cols-[1.5fr_1fr_1fr_1.3fr_1.4fr] gap-10 pt-14 pb-12 *:min-w-0 max-xl:grid-cols-3 max-md:grid-cols-2 max-md:gap-x-5 max-md:gap-y-8 max-md:pt-10 max-md:pb-8 max-xs:[&>:nth-child(4)]:col-span-full max-xs:[&>:nth-child(5)]:col-span-full">
            <div className="max-xl:col-span-full max-xl:max-w-[560px]">
              <a href="/" className="focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright"><img src={asset("assets/img/logo/bodhira-logo-light.png")} alt={siteName} width={708} height={162} loading="lazy" decoding="async" className="block h-[38px] w-auto" /></a>
              <p className={cx("font-sans text-[14px] leading-[1.65] font-semibold tracking-[.01em] text-gold-bright", "mt-3.5 mb-2")}>Learn. Visualize. Understand. Excel.</p>
              <p className={cx(P, P_TEXT, "mt-0 mb-[15px]")}>{setting("footer.about", "A modern learning platform built around the way your school already teaches.")}</p>
              <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0" aria-label="Follow us">
                {social.length ? (
                  social.map((s) => {
                    const brand = brandFor(s.platform, s.icon);
                    return (
                      <li key={s.id}>
                        <a href={s.url} target="_blank" rel="noopener" aria-label={`${s.platform} (opens in a new tab)`} className={SOCIAL_LINK}>
                          {brand ? <BrandIcon name={brand} size={15} className={SOCIAL_ICON} /> : <Icon name="globe" size={15} className={SOCIAL_ICON} />}
                        </a>
                      </li>
                    );
                  })
                ) : (
                  FALLBACK_SOCIAL.map(([label, brand]) => (
                    <li key={brand}><a href="#" aria-label={label} className={SOCIAL_LINK}><BrandIcon name={brand} size={15} className={SOCIAL_ICON} /></a></li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h3 className={HEAD}>Company Info</h3>
              <ul className="m-0 list-none p-0">
                {company.map((item) => (
                  <li key={item.key} className="not-first:mt-3">
                    <a href={item.url} target={item.target} className={cx(LINK, "text-[15px]")}>
                      {item.label}
                      {item.target === "_blank" && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={HEAD}>Useful Links</h3>
              <ul className="m-0 list-none p-0">
                {useful.map(([label, url]) => <li key={url} className="not-first:mt-3"><a href={url} className={cx(LINK, "text-[15px]")}>{label}</a></li>)}
              </ul>
            </div>

            <div>
              <h3 className={HEAD}>Contact Us</h3>
              <ul className="m-0 list-none p-0">
                {[
                  ["phone", <a key="v" href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className={cx(LINK, "[word-break:break-word]")}>{phone}</a>],
                  // One location: the registered office when set, else the contact address.
                  ["mapPin", <span key="v" className="[word-break:break-word]">{biz.address || address}</span>],
                  ["mail", <a key="v" href={`mailto:${email}`} className={cx(LINK, "[word-break:break-word]")}>{email}</a>],
                  ["clock", <span key="v" className="[word-break:break-word]">{hours}</span>],
                ].map(([icon, value]) => (
                  <li key={icon as string} className="flex items-start gap-3 text-[15px] leading-[1.5] not-first:mt-3.5">
                    <Icon name={icon as "phone"} size={16} className="mt-[3px] text-gold-bright" />
                    {value}
                  </li>
                ))}
              </ul>
              {/* Business details from the settings (not in legacy, 2026-11-22) */}
              <p className={cx(P, "mt-3.5 mb-[15px] text-[13.5px] leading-[1.55] text-[rgba(246,234,218,.65)]")}>
                <strong className="block font-semibold text-[rgba(246,234,218,.9)]"><Tba value={biz.legalName} dark /></strong>
                {biz.cin && <span className="block">CIN: {biz.cin}</span>}
                {biz.gstin && <span className="block">GSTIN: {biz.gstin}</span>}
              </p>
            </div>

            <div>
              <h3 className={HEAD}>Recent Posts</h3>
              {(recent_posts.length ? recent_posts : [null]).map((post) => (
                <div key={post?.id ?? "fallback"} className="flex items-center gap-3 not-first:mt-4">
                  <img
                    src={(post && mediaUrl(post.cover_image_url)) ?? asset("assets/img/images/footer-post-1.png")}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="inline h-14 w-14 flex-none rounded-sm object-cover align-middle"
                  />
                  <div>
                    <a href={post ? `/blog/${post.slug}` : "/blog"} className={cx(LINK, "block text-[14.5px] leading-[1.4] font-medium")}>
                      {post ? strLimit(post.title, 34) : "Read our latest articles"}
                    </a>
                    {post && (
                      <span className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-[rgba(246,234,218,.55)]">
                        <Icon name="calendar" size={13} className="text-gold" />
                        {fmtDate(post.published_at, "d M, Y")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[rgba(255,255,255,.08)]">
          <div className="site-container flex flex-wrap justify-between gap-x-5 gap-y-2 py-5 max-md:justify-center max-md:text-center">
            <p className={cx(P, "m-0 text-[14px] leading-[1.65] text-[rgba(246,234,218,.55)]")}>{setting("footer.copyright", `Copyright © ${year} ${siteName}. All Rights Reserved.`)}</p>
            <p className={cx(P, "m-0 text-[14px] leading-[1.65] text-[rgba(246,234,218,.55)]")}>
              {LEGAL_LINKS.map(([label, url], i) => (
                <Fragment key={url}>{i > 0 && <Sep />}<a href={url} className={LINK}>{label}</a></Fragment>
              ))}
              <Sep />
              <CookieSettingsButton />
            </p>
          </div>
        </div>
      </footer>
      <BackToTop />
    </>
  );
}

function Sep() {
  return <span aria-hidden="true" className="mx-2.5 text-[rgba(246,234,218,.3)]">|</span>;
}
