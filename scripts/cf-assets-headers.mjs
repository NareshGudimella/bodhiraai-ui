/**
 * Writes .open-next/assets/_headers after `opennextjs-cloudflare build`.
 * Workers static assets (public/ and _next/static) are served by Cloudflare
 * before the Worker runs, so next.config.mjs's headers() never reaches them;
 * this gives them the same security headers (production values) and makes the
 * hashed _next/static files immutable. Written into the build output, not
 * public/, so `next start` doesn't serve a /_headers file.
 */
import { writeFileSync, existsSync } from "node:fs";

process.env.NODE_ENV = "production";
const { securityHeaders } = await import("../security-headers.mjs");

const dir = new URL("../.open-next/assets/", import.meta.url);
if (!existsSync(dir)) {
  console.error("No .open-next/assets: run `opennextjs-cloudflare build` first.");
  process.exit(1);
}
const all = securityHeaders.map(({ key, value }) => `  ${key}: ${value}`).join("\n");
const rules = `/*\n${all}\n\n/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n`;
writeFileSync(new URL("_headers", dir), rules);
console.log("Wrote .open-next/assets/_headers");
