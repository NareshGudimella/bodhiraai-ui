import Link from "next/link";
import { Card, Empty, PageHeader, ProgressBar, SectionTitle, Stat, buttonClass } from "@/components/ui";
import { parentApi } from "@/lib/parent-api";
import { ChildTabs } from "../child-tabs";

const RATING = { strong: "text-success", fair: "text-primary-dark", weak: "text-danger" } as const;

export default async function ChildPerformancePage({ params }: PageProps<"/parent/children/[id]/performance">) {
  const { id } = await params;
  const p = await parentApi.performance(id);
  // Legacy "Needs attention": weak subjects first, then fair ones.
  const weak = p.by_subject.filter((s) => s.rating === "weak");
  const fair = p.by_subject.filter((s) => s.rating === "fair");
  return (
    <>
      <PageHeader back={{ href: "/parent", label: "Dashboard" }} title={p.student.name} />
      <ChildTabs id={id} current="/performance" />
      <div className="max-w-xs">
        <Stat label="Overall quiz average" value={`${p.overall_avg}%`} />
      </div>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <section>
          <SectionTitle>Quiz scores by subject</SectionTitle>
          {p.by_subject.length ? (
            <ul className="space-y-2">
              {p.by_subject.map((s) => (
                <li key={s.subject_id}>
                  <Card className="p-4">
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <span className="font-medium text-ink">{s.icon} {s.subject}</span>
                      <span className={`text-sm font-semibold capitalize ${RATING[s.rating]}`}>{s.avg_percent}% · {s.rating}</span>
                    </div>
                    <ProgressBar value={s.avg_percent} />
                    <p className="mt-1 text-xs text-ink-3">{s.attempts} {s.attempts === 1 ? "attempt" : "attempts"}</p>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No quizzes taken yet.</Empty>
          )}
        </section>
        <section>
          <SectionTitle>Lesson progress</SectionTitle>
          {p.progress.length ? (
            <ul className="space-y-2">
              {p.progress.map((s) => (
                <li key={s.subject}>
                  <Card className="p-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-ink">{s.subject}</span>
                      <span className="text-ink-2">{s.completed}/{s.started} done</span>
                    </div>
                    <ProgressBar value={s.started ? (s.completed / s.started) * 100 : 0} done={s.completed === s.started} />
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No lessons started yet.</Empty>
          )}
        </section>
        <section>
          <SectionTitle>⚠️ Needs attention</SectionTitle>
          {weak.length || fair.length ? (
            <ul className="space-y-2">
              {[...weak, ...fair].map((s) => (
                <li key={s.subject_id}>
                  <Card className={`p-3 ${s.rating === "weak" ? "bg-danger-light" : ""}`}>
                    <p className="font-medium text-ink">{s.icon} {s.subject}</p>
                    <p className="text-xs text-ink-2">
                      {s.rating === "weak" ? "Below class average" : "Room to improve"} · {s.avg_percent}%
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>{p.overall_avg > 0 ? "Great job! No weak areas detected." : "No quiz data available yet."}</Empty>
          )}
          <Link href="/parent/chat" className={`${buttonClass} mt-3 w-full`}>💬 Message Teacher</Link>
        </section>
      </div>
    </>
  );
}
