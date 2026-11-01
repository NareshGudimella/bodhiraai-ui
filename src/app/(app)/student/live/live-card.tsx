import Link from "next/link";
import { Card, Pill } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import type { LiveClass } from "@/lib/student-api";

export const STATUS: Record<LiveClass["live_status"], { label: string; tone: "success" | "brand" | "neutral" }> = {
  live: { label: "● Live now", tone: "success" },
  scheduled: { label: "Upcoming", tone: "brand" },
  ended: { label: "Ended", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

/**
 * The time exactly as the teacher entered it. Legacy stores the typed wall-clock
 * value (labelled UTC) and prints it unconverted, so this formats in UTC too.
 */
export const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });

export function LiveCard({ c, href, subject, i = 0 }: { c: LiveClass; href?: string; subject?: string | null; i?: number }) {
  const s = STATUS[c.live_status];
  return (
    <Link href={href ?? `/student/live/${c.id}`} className="block h-full">
      <Card className="ccard h-full p-4 transition hover:ring-primary" style={cardTone(i)}>
        <div className="mb-2 flex items-start justify-between gap-3">
          <p className="font-semibold text-ink">{c.title}</p>
          <Pill tone={s.tone}>{s.label}</Pill>
        </div>
        {(subject ?? c.subject) && <p className="mb-0.5 text-xs font-semibold text-primary-dark">📚 {subject ?? c.subject}</p>}
        <p className="text-xs text-ink-2">
          {when(c.scheduled_at)} · {c.duration_min} min
        </p>
        {c.host_name && <p className="mt-1 text-xs text-ink-3">with {c.host_name}</p>}
      </Card>
    </Link>
  );
}
