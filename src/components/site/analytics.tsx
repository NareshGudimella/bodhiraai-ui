import { connection } from "next/server";
import { settingResolver } from "@/lib/site";

const ID = /^[A-Za-z0-9_-]+$/;

/** partials/cms-analytics: GA, GTM and the Facebook Pixel from CMS → Settings → SEO & Analytics. */
export async function SiteAnalytics() {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const setting = await settingResolver();
  // IDs are interpolated into inline scripts: accept only id-shaped values.
  const ga = ID.test(setting("seo.ga_id")) ? setting("seo.ga_id") : "";
  const gtm = ID.test(setting("seo.gtm_id")) ? setting("seo.gtm_id") : "";
  const pixel = ID.test(setting("seo.fb_pixel")) ? setting("seo.fb_pixel") : "";
  return (
    <>
      {ga && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}></script>
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');` }} />
        </>
      )}
      {gtm && (
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');` }} />
      )}
      {pixel && (
        <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');` }} />
      )}
    </>
  );
}
