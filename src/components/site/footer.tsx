import { connection } from "next/server";
import { mediaUrl } from "@/lib/media";
import { assetResolver, currentYear, fmtDate, settingResolver, strLimit } from "@/lib/site";
import { getChrome } from "@/lib/site-api";
import { newsletterSubscribe } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";
import { FlashClear } from "./flash-clear";
import { Icon } from "./icons";

/** `session('newsletter_status')`. */
async function NewsletterStatus() {
  await connection();
  const flash = await getSiteFlash();
  const msg = flash.messages?.newsletter_status;
  return msg ? (
    <>
      <p className="bh-footer__status" role="status">{msg}</p>
      <FlashClear />
    </>
  ) : null;
}

const FALLBACK_MENU = [
  ["About", "/about"],
  ["Features", "/features"],
  ["Pricing", "/pricing"],
  ["Student Registration", "/student-registration"],
  ["Contact", "/contact"],
  ["Sign In", "/login"],
];
const USEFUL_LINKS = [
  ["Home", "/"],
  ["Plans & Pricing", "/pricing"],
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms"],
  ["Refund Policy", "/refund"],
];

/**
 * The marketing footer (legacy layouts/app.blade.php): newsletter, about,
 * social, CMS footer menu, contact details, recent posts. Restyled with the
 * 2026 homepage redesign (not in legacy): own `bh-*` classes in
 * public/assets/css/site-chrome.css, plus the contact column from the settings.
 */
export async function SiteFooter() {
  const [{ footer_menu, social, recent_posts }, asset, setting, year] = await Promise.all([getChrome(), assetResolver(), settingResolver(), currentYear()]);
  const siteName = setting("general.site_name", "Bodhira.ai");
  const email = setting("contact.email");
  const phone = setting("contact.phone", "+91 99852 52786");
  const address = setting("contact.address", "Pragathi Nagar, Hyderabad");
  const hours = setting("contact.hours", "Mon - Sat: 8:00 - 15:00");
  return (
    <>
      <footer className="bh-footer">
        <div className="bh-container">
          <div className="bh-footer__news">
            <div>
              <h2 className="bh-footer__news-title">Stay Updated on {siteName} News &amp; Releases</h2>
              <p className="bh-footer__news-text">Product updates, teaching ideas and new subjects. No spam.</p>
              <NewsletterStatus />
            </div>
            <form action={newsletterSubscribe} className="bh-footer__form">
              <label htmlFor="email-2" className="bh-sr-only">Email address</label>
              <input type="email" id="email-2" name="email" required placeholder="Enter your e-mail" autoComplete="email" />
              <button className="bh-btn bh-btn--gold" type="submit">Sign Up <Icon name="send" size={16} /></button>
            </form>
          </div>

          <div className="bh-footer__grid">
            <div className="bh-footer__brand">
              <a href="/" className="bh-footer__logo"><img src={asset("assets/img/logo/bodhira-logo-light.png")} alt={siteName} width={800} height={240} loading="lazy" /></a>
              <p className="bh-footer__tagline">Learn. Visualize. Understand. Excel.</p>
              <p>{setting("footer.about", "A modern learning platform built around the way your school already teaches.")}</p>
              <ul className="bh-social" aria-label="Follow us">
                {social.length ? (
                  social.map((s) => (
                    <li key={s.id}><a href={s.url} target="_blank" rel="noopener" aria-label={s.platform}><i className={s.icon || `fab fa-${s.platform}`} aria-hidden="true"></i></a></li>
                  ))
                ) : (
                  <>
                    <li><a href="#" aria-label="facebook"><i className="fab fa-facebook-f" aria-hidden="true"></i></a></li>
                    <li><a href="#" aria-label="instagram"><i className="fab fa-instagram" aria-hidden="true"></i></a></li>
                    <li><a href="#" aria-label="youtube"><i className="fab fa-youtube" aria-hidden="true"></i></a></li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h3 className="bh-footer__head">Company Info</h3>
              <ul className="bh-footer__links">
                {footer_menu.length
                  ? footer_menu.map((item) => <li key={item.id}><a href={item.url} target={item.target}>{item.label}</a></li>)
                  : FALLBACK_MENU.map(([label, url]) => <li key={url}><a href={url}>{label}</a></li>)}
              </ul>
            </div>

            <div>
              <h3 className="bh-footer__head">Useful Links</h3>
              <ul className="bh-footer__links">
                {USEFUL_LINKS.map(([label, url]) => <li key={url}><a href={url}>{label}</a></li>)}
              </ul>
            </div>

            <div>
              <h3 className="bh-footer__head">Contact Us</h3>
              <ul className="bh-footer__contact">
                <li><Icon name="phone" size={16} /><a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a></li>
                <li><Icon name="mapPin" size={16} /><span>{address}</span></li>
                {email && <li><Icon name="mail" size={16} /><a href={`mailto:${email}`}>{email}</a></li>}
                <li><Icon name="clock" size={16} /><span>{hours}</span></li>
              </ul>
            </div>

            <div>
              <h3 className="bh-footer__head">Recent Posts</h3>
              {recent_posts.length ? (
                recent_posts.map((post) => (
                  <div key={post.id} className="bh-footer__post">
                    <img src={mediaUrl(post.cover_image_url) ?? asset("assets/img/images/footer-post-1.png")} alt="" width={64} height={64} loading="lazy" />
                    <div>
                      <a href={`/blog/${post.slug}`}>{strLimit(post.title, 34)}</a>
                      <span><Icon name="calendar" size={13} />{fmtDate(post.published_at, "d M, Y")}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bh-footer__post">
                  <img src={asset("assets/img/images/footer-post-1.png")} alt="" width={64} height={64} loading="lazy" />
                  <div><a href="/blog">Read our latest articles</a></div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bh-footer__bar">
          <div className="bh-container bh-footer__bar-inner">
            <p>{setting("footer.copyright", `Copyright © ${year} ${siteName}. All Rights Reserved.`)}</p>
            <p><a href="/privacy">Privacy Policy</a><span aria-hidden="true">|</span><a href="/terms">Terms &amp; Conditions</a></p>
          </div>
        </div>
      </footer>
      <div id="scrollup">
        <button id="scroll-top" className="scroll-to-top" aria-label="Back to top"><i className="fa-regular fa-arrow-up-long"></i></button>
      </div>
    </>
  );
}
