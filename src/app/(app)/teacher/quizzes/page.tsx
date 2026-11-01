import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, Pill } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { teacherApi } from "@/lib/teacher-api";

export const metadata: Metadata = { title: "Quizzes" };

export default async function TeacherQuizzesPage() {
  const quizzes = await teacherApi.quizzes();
  return (
    <>
      <PageHeader title="Quizzes" subtitle="Quizzes you created, with attempt analytics." />
      {quizzes.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {quizzes.map((q, i) => (
            <li key={q.id}>
              <Link href={`/teacher/quizzes/${q.id}`} className="block h-full">
                <Card className="ccard h-full p-4 pl-5 transition hover:ring-primary" style={cardTone(i)}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-ink">{q.title}</p>
                    <Pill tone={q.is_published ? "success" : "neutral"}>{q.is_published ? "Published" : "Draft"}</Pill>
                  </div>
                  <p className="mt-1 text-xs text-ink-2">{[q.subject, q.chapter].filter(Boolean).join(" · ")}</p>
                  <p className="mt-2 text-xs text-ink-3">
                    {q.questions_count} questions · {q.total_marks} marks · {q.duration_min} min · {q.attempts_count} attempts
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>You haven&apos;t created any quizzes.</Empty>
      )}
    </>
  );
}
