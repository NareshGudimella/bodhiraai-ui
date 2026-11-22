// Tailwind CSS 4 through PostCSS: works with both `next build --webpack` (hosts that
// can't run Turbopack's native compiler) and Turbopack in `next dev`.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
