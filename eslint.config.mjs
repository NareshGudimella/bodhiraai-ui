import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The marketing site ports a static Bootstrap theme: plain <a> (full page
    // loads, so the theme's jQuery re-initialises), <img>, and its own
    // stylesheets.
    files: ["src/app/(site)/**", "src/components/site/**"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-css-tags": "off",
      "@next/next/no-sync-scripts": "off",
      "@next/next/no-page-custom-font": "off",
      // Ported prose keeps its quotes; legacy's GA/GTM tags stay inline.
      "react/no-unescaped-entities": "off",
      "@next/next/next-script-for-ga": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored marketing theme scripts.
    "public/**",
    // Cloudflare edge Worker: its own package and tsconfig.
    "edge/**",
  ]),
]);

export default eslintConfig;
