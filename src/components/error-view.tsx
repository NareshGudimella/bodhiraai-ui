import Link from "next/link";
import type { ReactNode } from "react";
import { secondaryButtonClass } from "@/components/ui";

/**
 * Full-page message for the dashboards' error and not-found pages, in the
 * app's card style. `/login` sends a signed-in user to their own dashboard
 * (proxy.ts), and everyone else to the sign-in page. not in legacy (legacy
 * shows Laravel's plain error pages).
 */
export function ErrorView({
  code,
  title,
  children,
  action,
}: {
  code: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <main className="grid min-h-[70vh] flex-1 place-items-center bg-page px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-line">
        <p className="text-5xl font-black tracking-tight text-primary" aria-hidden>
          {code}
        </p>
        <h1 className="mt-3 text-xl font-bold text-brand">{title}</h1>
        <div className="mt-2 text-sm leading-6 text-ink-2">{children}</div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {action}
          <Link href="/login" className={secondaryButtonClass}>
            Go to my dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
