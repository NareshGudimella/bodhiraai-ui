import { connection } from "next/server";
import { getChrome } from "@/lib/site-api";

/** The CMS page's JSON-LD (`json_encode($seo->schema, JSON_UNESCAPED_SLASHES)`). */
export async function SeoSchema({ path }: { path: string }) {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const { seo } = await getChrome(path);
  if (!seo?.schema) return null;
  // Escape "<" so a value can't close the script element.
  const json = JSON.stringify(seo.schema).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
