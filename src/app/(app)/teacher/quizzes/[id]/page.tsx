import { Card, Empty, PageHeader, Pill, SectionTitle, Stat } from "@/components/ui";
import { teacherApi } from "@/lib/teacher-api";

export default async function QuizAnalyticsPage({ params }: PageProps<"/teacher/quizzes/[id]">) {
  const { id } = await params;
  const { quiz, stats, attempts } = await teacherApi.quizAnalytics(id);
  return (
    <>
      <PageHeader
        back={{ href: "/teacher/quizzes", label: "Quizzes" }}
        title={quiz.title}
        subtitle={[quiz.subject?.name, quiz.chapter?.title, `pass mark ${quiz.pass_marks}/${quiz.total_marks}`].filter(Boolean).join(" · ")}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Attempts" value={stats.attempts} />
        <Stat label="Average" value={`${stats.avg_percent}%`} />
        <Stat label="Pass rate" value={`${stats.pass_rate}%`} />
        <Stat label="Highest" value={stats.highest} />
        <Stat label="Lowest" value={stats.lowest} />
      </div>
      <section className="mt-8">
        <SectionTitle>Attempts</SectionTitle>
        {attempts.length ? (
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink-3">
                <tr><th className="px-4 py-2">Student</th><th className="px-4 py-2">Score</th><th className="px-4 py-2">Result</th><th className="px-4 py-2">When</th></tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id} className="border-t border-line">
                    <td className="px-4 py-2 font-medium text-ink">{a.student}</td>
                    <td className="px-4 py-2 text-ink-2">{a.score}/{a.total} ({a.percent}%)</td>
                    <td className="px-4 py-2">
                      {a.score >= quiz.pass_marks ? <Pill tone="success">Pass</Pill> : <Pill>Fail</Pill>}
                    </td>
                    <td className="px-4 py-2 text-ink-3">{a.submitted_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Empty>No submitted attempts yet.</Empty>
        )}
      </section>
    </>
  );
}
