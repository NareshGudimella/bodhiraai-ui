import { getFlash } from "@/lib/flash";
import { FlashBanner } from "./flash-banner";

/** The status message set before a redirect (lib/flash.ts). Render inside <Suspense>. */
export async function Flash() {
  const message = await getFlash();
  return message ? <FlashBanner message={message} /> : null;
}
