import { Card, Empty, PageHeader, Pill, SectionTitle, secondaryButtonClass } from "@/components/ui";
import { cancelLiveClass } from "@/lib/teacher-actions";
import { teacherApi } from "@/lib/teacher-api";
import { STATUS, when } from "@/app/(app)/student/live/live-card";

export default async function TeacherLiveClassPage({ params }: PageProps<"/teacher/live/[id]">) {
  const { id } = await params;
  const c = await teacherApi.liveClass(id);
  const s = STATUS[c.live_status];
  const cancellable = c.live_status === "scheduled" || c.live_status === "live";

  return (
    <>
      <PageHeader
        back={{ href: "/teacher/live", label: "Live classes" }}
        title={c.title}
        action={
          cancellable ? (
            <form action={cancelLiveClass.bind(null, c.id)}>
              <button className={secondaryButtonClass}>Cancel class</button>
            </form>
          ) : undefined
        }
      />
      <Card className="max-w-2xl">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <Pill tone={s.tone}>{s.label}</Pill>
          <span className="text-sm text-ink-2">{when(c.scheduled_at)} · {c.duration_min} min</span>
        </div>
        {c.description && <p className="mb-3 whitespace-pre-line text-sm text-ink">{c.description}</p>}
        <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-ink-3">Host</dt>
          <dd className="text-ink">{c.host_name ?? "—"}</dd>
          <dt className="text-ink-3">Audience</dt>
          <dd className="text-ink">{c.audience.label}</dd>
          {c.subject && (
            <>
              <dt className="text-ink-3">Subject</dt>
              <dd className="text-ink">{c.subject}</dd>
            </>
          )}
          <dt className="text-ink-3">Provider</dt>
          <dd className="text-ink">{c.provider ? c.provider.charAt(0).toUpperCase() + c.provider.slice(1) : "—"}</dd>
        </dl>
        {c.meeting_url && (
          <a href={c.meeting_url} target="_blank" rel="noopener" className="text-sm font-medium text-primary-dark underline">
            Open meeting ({c.provider})
          </a>
        )}
      </Card>
      <section className="mt-8 max-w-2xl">
        <SectionTitle>Joined · {c.attendees?.length ?? 0}</SectionTitle>
        {c.attendees?.length ? (
          <ul className="space-y-1 text-sm">
            {c.attendees.map((a) => (
              <li key={a.user_id} className="flex justify-between rounded-lg bg-card px-3 py-2 ring-1 ring-line">
                <span className="text-ink">{a.name}</span>
                <span className="text-ink-3">{a.joined_at ? when(a.joined_at) : ""}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No one has joined yet.</Empty>
        )}
      </section>
    </>
  );
}
