"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { buttonClass } from "@/components/ui";

/** Re-renders the page's server parts (the tutor's reads) without a full reload. */
export function RetryButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())} className={buttonClass}>
      {pending ? "Retrying…" : "Try again"}
    </button>
  );
}
