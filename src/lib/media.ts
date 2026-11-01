import 'server-only';

/**
 * Lesson files, avatars and logos are still served by the legacy app
 * (`/media/...`, `/cloud/...`). Resolve relative paths against it until uploads
 * move to shared storage (see docs/migration-plan.md, "File storage").
 */
const LEGACY_URL = (process.env.LEGACY_URL ?? 'http://localhost:8001').replace(/\/$/, '');

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${LEGACY_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
