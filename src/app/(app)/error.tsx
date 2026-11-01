"use client";

import { useEffect } from "react";
import { ErrorView } from "@/components/error-view";
import { buttonClass } from "@/components/ui";

/**
 * Error boundary for every dashboard page (anything under the app's root
 * layout). An unpaid student never gets here: lib/load.ts and the student
 * actions redirect a 402 to /paywall on the server. not in legacy
 */
export default function AppError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const digest = error instanceof Error && "digest" in error ? String((error as { digest?: unknown }).digest ?? "") : "";
  return (
    <ErrorView
      code="500"
      title="Something went wrong"
      action={
        <button type="button" onClick={() => retry()} className={buttonClass}>
          Try again
        </button>
      }
    >
      <p>We couldn&apos;t load this page. Please try again in a moment.</p>
      {digest && <p className="mt-2 font-mono text-xs text-ink-3">Reference: {digest}</p>}
    </ErrorView>
  );
}
