import Link from "next/link";
import { Card, Pill } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import type { TeacherLive } from "@/lib/teacher-api";
import { STATUS, when } from "@/app/(app)/student/live/live-card";

/** Live class card for teachers: audience class, subject and attendee count. */
export function TeacherLiveCard({ c, index }: { c: TeacherLive; index: number }) {
  const s = STATUS[c.live_status];
  const past = c.live_status === "ended";
  return (
    <Link href={`/teacher/live/${c.id}`} className="block h-full">
      <Card className="ccard h-full p-4 pl-5 transition hover:ring-primary" style={cardTone(index)}>
        <div className="mb-2 flex items-start justify-between gap-3">
          <p className="font-semibold text-ink">{c.title}</p>
          <Pill tone={s.tone}>{s.label}</Pill>
        </div>
        <p className="text-xs text-ink-2">
          {when(c.scheduled_at)} · {c.duration_min} min
        </p>
        <p className="mt-1 text-xs text-ink-3">
          {[c.audience.label, c.subject && `📚 ${c.subject}`].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-1 text-xs text-ink-3">
          👥 {c.attendees_count} {past ? "attended" : "joined"}
        </p>
      </Card>
    </Link>
  );
}
