import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/** Small presentational building blocks shared by dashboard pages. */

export function PageHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: { href: string; label: string };
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-block text-sm text-ink-3 hover:text-brand">
            ← {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-brand">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section className={`rounded-2xl bg-card p-5 shadow-sm ring-1 ring-line ${className}`} style={style}>
      {children}
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-3">{children}</h2>;
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-3">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-2">{hint}</p>}
    </Card>
  );
}

export function ProgressBar({ value, done = false }: { value: number; done?: boolean }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-primary-light"
    >
      <div className={`h-full rounded-full ${done ? "bg-success" : "bg-primary"}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "brand" }) {
  const tones = {
    neutral: "bg-primary-light text-ink-2",
    success: "bg-success/10 text-success",
    brand: "bg-brand text-primary-light",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-line bg-card/60 p-6 text-center text-sm text-ink-3">{children}</p>;
}

export const buttonClass =
  "inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-light transition hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium text-ink-2 transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50";
