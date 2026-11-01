"use client";

import type { ReactNode } from "react";

/** A one-button form that asks before running a destructive Server Action. */
export function ConfirmButton({
  action,
  message,
  className,
  children,
}: {
  action: () => Promise<void>;
  message: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <form action={action} onSubmit={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      <button className={className}>{children}</button>
    </form>
  );
}
