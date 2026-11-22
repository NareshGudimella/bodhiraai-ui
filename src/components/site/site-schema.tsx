import { connection } from "next/server";
import { getChrome } from "@/lib/site-api";
import { absoluteUrl, publicOrigin } from "@/lib/site-url";

/**
 * Site-wide JSON-LD (SEO: not in legacy): the Organization (name, logo,
 * contact point, social profiles and address from Web Studio → Settings and
 * Social links) and the WebSite it publishes. Plain `Organization`, not
 * `EducationalOrganization`: Bodhira.ai provides a learning platform, it isn't
 * a school. Blog posts point at it as their publisher (`/#organization`).
 */
export async function SiteSchema() {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const origin = publicOrigin();
  if (!origin) return null;
  const { settings, social } = await getChrome();
  const s = (k: string, d = "") => {
    const v = settings[k];
    return v === null || v === undefined || v === "" ? d : String(v);
  };
  const name = s("general.site_name", "Bodhira.ai");
  const email = s("contact.email");
  const phone = s("contact.phone");
  const org = {
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name,
    url: absoluteUrl("/"),
    logo: { "@type": "ImageObject", url: absoluteUrl("/assets/img/favicon-512.png"), width: 512, height: 512 },
    description: s("footer.about") || undefined,
    ...(email || phone
      ? { contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", ...(email ? { email } : {}), ...(phone ? { telephone: phone } : {}) }] }
      : {}),
    ...(social.length ? { sameAs: social.map((l) => l.url).filter((u) => /^https?:\/\//i.test(u)) } : {}),
    ...postalAddress(s("contact.address")),
  };
  const site = {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name,
    inLanguage: "en-IN",
    publisher: { "@id": org["@id"] },
  };
  // Escape "<" so a value can't close the script element.
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": [org, site] }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** "Street, City, State, Country" (the `contact.address` setting) as a PostalAddress, read from the end. */
function postalAddress(text: string) {
  const parts = text.split(/\s*,\s*/).filter(Boolean);
  if (!parts.length) return {};
  const [country, region, locality, ...street] = [...parts].reverse();
  return {
    address: {
      "@type": "PostalAddress",
      ...(street.length ? { streetAddress: street.reverse().join(", ") } : {}),
      ...(locality ? { addressLocality: locality } : {}),
      ...(region ? { addressRegion: region } : {}),
      addressCountry: country,
    },
  };
}
