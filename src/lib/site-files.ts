import 'server-only';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

/** The marketing theme's bundled files (public/), for the Site Image Manager. */
const PUBLIC = join(process.cwd(), 'public');
const BASE = 'assets/img';
const EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

export async function fileSize(rel: string): Promise<number | null> {
  try {
    return (await stat(join(PUBLIC, rel))).size;
  } catch {
    return null;
  }
}

/** Folders under assets/img, two levels deep, sorted ('' is the base). */
export async function imageFolders(): Promise<string[]> {
  const out = [''];
  for (const a of await readdir(join(PUBLIC, BASE), { withFileTypes: true })) {
    if (!a.isDirectory()) continue;
    out.push(a.name);
    for (const b of await readdir(join(PUBLIC, BASE, a.name), { withFileTypes: true })) {
      if (b.isDirectory()) out.push(`${a.name}/${b.name}`);
    }
  }
  return out.sort();
}

/** Image files directly in one folder (web paths), sorted by name. Unknown folders list nothing. */
export async function imagesIn(folder: string): Promise<string[]> {
  const folders = await imageFolders();
  if (!folders.includes(folder)) return [];
  const dir = folder ? `${BASE}/${folder}` : BASE;
  const entries = await readdir(join(PUBLIC, dir), { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && EXTS.includes(e.name.split('.').pop()!.toLowerCase()))
    .map((e) => `${dir}/${e.name}`)
    .sort((a, b) => a.localeCompare(b));
}
