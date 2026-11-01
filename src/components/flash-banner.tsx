"use client";

import { useEffect, useState } from "react";

/** Shows the flash message once: the cookie is cleared as soon as it renders. */
export function FlashBanner({ message }: { message: string }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    document.cookie = "bodhira_flash=; Max-Age=0; path=/";
  }, [message]);
  if (!open) return null;
  return (
    <p role="status" className="mb-4 flex items-start justify-between gap-3 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
      <span>{message}</span>
      <button type="button" onClick={() => setOpen(false)} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
        ✕
      </button>
    </p>
  );
}
