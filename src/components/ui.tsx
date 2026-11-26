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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-b border-line pb-5">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-block text-sm text-ink-3 hover:text-ink hover:underline">
            ← {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-ink-2">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section className={`rounded-card bg-card p-5 shadow-card ring-1 ring-line ${className}`} style={style}>
      {children}
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold tracking-tight text-ink">{children}</h2>;
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-ink-2">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-3">{hint}</p>}
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

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "brand" | "warning" | "danger" }) {
  const tones = {
    neutral: "bg-primary-light text-ink-2 ring-line",
    success: "bg-success/10 text-success ring-success/25",
    warning: "bg-warning-light text-warning ring-warning/25",
    danger: "bg-danger-light text-danger ring-danger/25",
    brand: "bg-brand text-primary-light ring-brand",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}><span className="inline-block first-letter:uppercase">{children}</span></span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-card border border-dashed border-line bg-card px-6 py-10 text-center text-sm text-ink-3">{children}</p>;
}

/** Scroll container + card chrome for a `<table className="data-table">` (styles in globals.css). */
export function TableCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`overflow-x-auto rounded-card bg-card shadow-card ring-1 ring-line ${className}`}>{children}</div>;
}

export const buttonClass =
  "inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-light shadow-xs transition hover:bg-brand-mid focus-visible:outline-primary-dark disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium text-ink-2 shadow-xs transition hover:bg-primary-light hover:text-ink disabled:cursor-not-allowed disabled:opacity-50";
