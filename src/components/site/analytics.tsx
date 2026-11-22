import { connection } from "next/server";
import { settingResolver } from "@/lib/site";
import { ConsentAnalytics } from "./consent-analytics";

const ID = /^[A-Za-z0-9_-]+$/;

/**
 * partials/cms-analytics: GA, GTM and the Facebook Pixel from CMS → Settings →
 * SEO & Analytics (`seo.ga_id`, `seo.gtm_id`, `seo.fb_pixel`). Rendered by the
 * marketing layout only, so dashboards and sign-in pages never load them.
 * Difference from legacy (privacy: not in legacy): the tags load only after
 * the visitor accepts all cookies (`bh_consent=all`, see consent-analytics.tsx);
 * legacy loaded them on every page view.
 */
export async function SiteAnalytics() {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const setting = await settingResolver();
  // IDs are interpolated into scripts: accept only id-shaped values.
  const ga = ID.test(setting("seo.ga_id")) ? setting("seo.ga_id") : "";
  const gtm = ID.test(setting("seo.gtm_id")) ? setting("seo.gtm_id") : "";
  const pixel = ID.test(setting("seo.fb_pixel")) ? setting("seo.fb_pixel") : "";
  if (!ga && !gtm && !pixel) return null;
  return <ConsentAnalytics ga={ga} gtm={gtm} pixel={pixel} />;
}
