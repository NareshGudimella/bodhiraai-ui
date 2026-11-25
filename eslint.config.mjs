import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The marketing site: plain <a> (full page loads, as legacy) and <img>
    // (Site Image Manager overrides resolve to arbitrary URLs).
    files: ["src/app/(site)/**", "src/components/site/**"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
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
    // OpenNext / wrangler build output.
    ".open-next/**",
    ".wrangler/**",
  ]),
]);

export default eslintConfig;
