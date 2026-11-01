import { Card, PageHeader, Pill, buttonClass, secondaryButtonClass } from "@/components/ui";
import { studentApi } from "@/lib/student-api";
import { STATUS, when } from "../live-card";

export default async function LiveClassPage({ params }: PageProps<"/student/live/[id]">) {
  const { id } = await params;
  const c = await studentApi.liveClass(id);
  const s = STATUS[c.live_status];
  // Only a live class can be joined; a scheduled one opens at its start time (legacy live/show.blade.php).
  const joinable = c.live_status === "live" && c.meeting_url;

  return (
    <>
      <PageHeader
        back={{ href: "/student/live", label: "Live classes" }}
        title={c.title}
        subtitle={c.subject ? `📚 ${c.subject}` : undefined}
      />
      <Card className="max-w-2xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Pill tone={s.tone}>{s.label}</Pill>
          <span className="text-sm text-ink-2">
            {when(c.scheduled_at)} · {c.duration_min} min
            {c.host_name && ` · ${c.host_name}`}
          </span>
        </div>
        {c.description && <p className="mb-4 whitespace-pre-line text-sm text-ink">{c.description}</p>}
        {joinable ? (
          <a href={`/student/live/${c.id}/join`} target="_blank" rel="noopener" className={buttonClass}>
            ▶ Join now
          </a>
        ) : c.live_status === "scheduled" ? (
          <button type="button" disabled className={secondaryButtonClass}>
            Opens at {new Date(c.scheduled_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "UTC" })}
          </button>
        ) : c.live_status === "live" ? (
          <p className="text-sm text-ink-3">The meeting link isn&apos;t available yet.</p>
        ) : (
          <p className="text-sm text-ink-3">
            {c.live_status === "cancelled" ? "This class was cancelled." : "This class has ended."}
          </p>
        )}
      </Card>
    </>
  );
}
