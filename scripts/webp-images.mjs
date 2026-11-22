/**
 * WebP copies of the redesign photos (SEO/performance: not in legacy).
 *
 *   node scripts/webp-images.mjs
 *
 * For every public/assets/img/{home,pages,auth}/**\/*.jpg it writes a .webp
 * sibling (sharp, quality 78) when the .webp is missing or older, and lists
 * the converted paths in src/lib/webp-manifest.json. `assetResolver()` and the
 * auth shell serve the .webp for a listed path (unless the Site Image Manager
 * has a replacement). The .jpg files stay: Open Graph images and fallbacks.
 * Run it again after adding or replacing a photo, and commit both files.
 */
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const pub = join(root, 'public');
const dirs = ['home', 'pages', 'auth'].map((d) => join(pub, 'assets/img', d));

async function* jpgs(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* jpgs(p);
    else if (/\.jpe?g$/i.test(e.name)) yield p;
  }
}

const manifest = [];
let before = 0;
let after = 0;
for (const dir of dirs) {
  for await (const jpg of jpgs(dir)) {
    const webp = jpg.replace(/\.jpe?g$/i, '.webp');
    const src = await stat(jpg);
    const out = await stat(webp).catch(() => null);
    if (!out || out.mtimeMs < src.mtimeMs) await sharp(jpg).webp({ quality: 78, effort: 6 }).toFile(webp);
    const size = (await stat(webp)).size;
    const rel = relative(pub, jpg).split('\\').join('/');
    // Keep a WebP only when it is actually smaller.
    if (size < src.size) manifest.push(rel);
    before += src.size;
    after += Math.min(size, src.size);
  }
}
manifest.sort();
await writeFile(join(root, 'src/lib/webp-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(`${manifest.length} photos: ${kb(before)} as JPEG, ${kb(after)} served (${Math.round((1 - after / before) * 100)}% smaller)`);
