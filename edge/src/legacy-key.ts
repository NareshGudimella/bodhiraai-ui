/**
 * R2 key of a legacy file (LEGACY_FILES). Keys keep the legacy URL paths:
 * media/<public disk path>, cloud/<path>, assets/<path>.mp4 (site videos).
 * Undefined for other paths; null for a legacy path that can't be served
 * (bad encoding, `..`, empty segments, invoices). No Worker APIs, so it runs
 * under `node --test` (test/legacy-key.test.ts).
 */
export function legacyFileKey(path: string): string | null | undefined {
  if (
    !path.startsWith('/media/') &&
    !path.startsWith('/cloud/') &&
    !(path.startsWith('/assets/') && path.toLowerCase().endsWith('.mp4'))
  ) {
    return undefined;
  }
  let key: string;
  try {
    key = decodeURIComponent(path.slice(1));
  } catch {
    return null;
  }
  if (key.split('/').some((s) => s === '..' || s === '')) return null;
  // Invoices are never served from the public legacy files, in any letter case
  // (they go to the private bucket, behind the authenticated invoice endpoints).
  // Legacy served /media/invoices/... to anyone with the URL.
  // security: not in legacy
  if (key.toLowerCase().startsWith('media/invoices/')) return null;
  return key;
}
