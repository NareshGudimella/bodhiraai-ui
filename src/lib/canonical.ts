import { permanentRedirect } from 'next/navigation';

/**
 * Old numeric links (bookmarks, mobile deep links) go to the slug / public_id URL once the API returned
 * the entity: 308 to `<base>/<ref><rest>`. Not in legacy (docs/slug-contract.md). With no ref, the id stays.
 */
export function canonical(param: string, ref: string | null | undefined, base: string, rest = ''): void {
  if (ref && /^\d+$/.test(param)) permanentRedirect(`${base}/${encodeURIComponent(ref)}${rest}`);
}
