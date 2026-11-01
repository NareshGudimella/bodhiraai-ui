import { Card, Empty, PageHeader, Pill, ProgressBar, SectionTitle, Stat, secondaryButtonClass } from "@/components/ui";
import { AI_TONE, cardTone } from "@/lib/appearance";
import { startChat } from "@/lib/inbox-actions";
import { mediaUrl } from "@/lib/media";
import { teacherApi } from "@/lib/teacher-api";

const RATING: Record<string, { label: string; tone: "success" | "brand" | "neutral" }> = {
  strong: { label: "Strong", tone: "success" },
  fair: { label: "Fair", tone: "brand" },
  weak: { label: "Weak", tone: "neutral" },
};

const cap = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

function Avatar({ src, name, size = "size-10" }: { src: string | null; name: string; size?: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={`${size} shrink-0 rounded-full object-cover ring-2 ring-primary`} />
  ) : (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-brand`}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export default async function TeacherStudentPage({ params }: PageProps<"/teacher/students/[id]">) {
  const { id } = await params;
  const p = await teacherApi.student(id);
  const s = p.student;
  const att = p.attendance.totals;
  const lastLogin = s.last_login_at
    ? new Date(s.last_login_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })
    : "never";

  return (
    <>
      <PageHeader
        back={{ href: "/teacher/classes", label: "Classes" }}
        title={s.name}
        subtitle={[s.grade && `Grade ${s.grade}`, s.school?.name, s.gender && cap(s.gender), s.username].filter(Boolean).join(" · ")}
      />
      <Card className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar src={mediaUrl(s.avatar)} name={s.name} size="size-16" />
        <div className="min-w-0 text-sm text-ink-2">
          <p>{[s.email, s.phone].filter(Boolean).join(" · ") || "No contact details"}</p>
          <p className="text-xs text-ink-3">Status: {cap(s.status.replace(/_/g, " "))} · Last login: {lastLogin}</p>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Attendance"
          value={`${p.stats.attendance_percent}%`}
          hint={`${p.stats.attendance_percent >= 75 ? "Good standing" : "Below 75% threshold"} · ${p.stats.attendance_present}/${p.stats.attendance_total} days`}
        />
        <Stat label="Avg quiz score" value={`${p.stats.avg_quiz_percent}%`} hint={`${p.stats.quizzes_attempted} quizzes`} />
        <Stat label="Lessons completed" value={p.stats.lessons_completed} hint={`${p.stats.lessons_started} started`} />
        <Stat
          label="Pending assignments"
          value={p.stats.pending_assignments}
          hint={p.stats.pending_assignments > 0 ? "Needs attention" : "All caught up"}
        />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">Subject performance</h2>
          {p.overall_avg > 0 && <span className="text-xs font-medium text-ink-2">Overall avg: {p.overall_avg}%</span>}
        </div>
        {p.subjects.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {p.subjects.map((row) => {
              const r = RATING[row.rating] ?? RATING.weak;
              return (
                <li key={row.subject_id}>
                  <Card className="p-3">
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                      <span className="text-ink">{row.icon ?? "📘"} {row.subject}</span>
                      <Pill tone={r.tone}>{r.label}</Pill>
                    </div>
                    <p className="mb-2 text-xs text-ink-3">{row.attempts} attempts · highest {row.highest}</p>
                    <div className="mb-1 text-right text-sm font-semibold text-ink-2">{row.avg_percent}%</div>
                    <ProgressBar value={row.avg_percent} />
                  </Card>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty>No quiz attempts yet to show performance.</Empty>
        )}
      </div>

      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <div className="space-y-8">
          <section>
            <SectionTitle>Attendance · {p.attendance.month_label}</SectionTitle>
            <Card className="grid grid-cols-4 gap-2 p-3 text-center">
              {(["present", "absent", "late", "excused"] as const).map((k) => (
                <div key={k}>
                  <p className="text-xl font-bold text-brand">{att[k]}</p>
                  <p className="text-xs text-ink-3">{cap(k)}</p>
                </div>
              ))}
            </Card>
          </section>
          <section>
            <SectionTitle>Recent lessons</SectionTitle>
            {p.recent_lessons.length ? (
              <ul className="space-y-2">
                {p.recent_lessons.map((l, i) => (
                  <li key={i}>
                    <Card className="ccard p-3 pl-4" style={cardTone(i)}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-ink">{l.title}</p>
                        <Pill tone={l.status === "completed" ? "success" : "neutral"}>{l.progress}%</Pill>
                      </div>
                      <p className="mb-2 text-xs text-ink-3">{[l.subject, l.last_viewed_at].filter(Boolean).join(" · ")}</p>
                      <ProgressBar value={l.progress} done={l.status === "completed"} />
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No lessons started yet.</Empty>
            )}
          </section>
        </div>
        <div className="space-y-8">
          <section>
            <SectionTitle>Parent / guardian</SectionTitle>
            {p.parents.length ? (
              <ul className="space-y-2">
                {p.parents.map((par) => (
                  <li key={par.id}>
                    <Card className="p-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Avatar src={mediaUrl(par.avatar)} name={par.name} />
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{par.name}</p>
                          <p className="text-xs text-ink-3">{par.relation ? cap(par.relation) : "Guardian"}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <form action={startChat.bind(null, "with-parent", s.id)}>
                          <button className="inline-flex items-center rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-primary-light hover:bg-brand-mid">
                            💬 Chat
                          </button>
                        </form>
                        {par.phone && <a href={`tel:${par.phone}`} className={`${secondaryButtonClass} px-3 py-1.5 text-xs`}>📞 Call</a>}
                        {par.email && <a href={`mailto:${par.email}`} className={`${secondaryButtonClass} px-3 py-1.5 text-xs`}>✉️ Email</a>}
                      </div>
                      {(par.phone || par.email) && (
                        <p className="mt-2 text-xs text-ink-3">{[par.phone, par.email].filter(Boolean).join(" · ")}</p>
                      )}
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No parent linked to this student.</Empty>
            )}
          </section>
          <section>
            <SectionTitle>Recent quiz scores</SectionTitle>
            {p.recent_quizzes.length ? (
              <ul className="space-y-2">
                {p.recent_quizzes.map((q, i) => (
                  <li key={i}>
                    <Card className="ccard flex items-start justify-between gap-2 p-3 pl-4" style={cardTone(i)}>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink">{q.title}</span>
                        <span className="block text-xs text-ink-3">{[q.subject, q.submitted_at].filter(Boolean).join(" · ")}</span>
                      </span>
                      <Pill tone={q.percent >= 60 ? "success" : "neutral"}>{q.score}/{q.total} · {q.percent}%</Pill>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No quizzes taken yet.</Empty>
            )}
          </section>
          <section>
            <SectionTitle>AI tutor activity</SectionTitle>
            {p.ai_activity.length ? (
              <ul className="space-y-2">
                {p.ai_activity.map((a) => (
                  <li key={a.id}>
                    <Card className="ccard p-3 pl-4" style={AI_TONE}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 truncate text-sm text-ink">{a.title}</p>
                        <Pill>{cap(a.mode)}</Pill>
                      </div>
                      <p className="text-xs text-ink-3">{a.messages_count} messages · {a.last_at}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>Hasn&apos;t used the AI tutor yet.</Empty>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
