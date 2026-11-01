import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, Pill } from "@/components/ui";
import { contentApi } from "@/lib/content-api";
import { QuizForm } from "./quiz-form";

export const metadata: Metadata = { title: "Quiz builder" };

export default async function QuizBuilderPage() {
  const { subjects, quizzes } = await contentApi.quizzes();
  return (
    <>
      <PageHeader back={{ href: "/content", label: "Content library" }} title="Quiz builder" subtitle="Quizzes you have created" />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
        <section>
          {quizzes.length ? (
            <ul className="space-y-2">
              {quizzes.map((q) => (
                <li key={q.id}>
                  <Link href={`/content/quizzes/${q.id}`} className="block">
                    <Card className="flex items-center justify-between gap-3 p-4 transition hover:ring-primary">
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{q.title}</span>
                        <span className="block text-xs text-ink-3">
                          {[q.subject?.name, q.chapter?.title].filter(Boolean).join(" · ") || "No subject"} · {q.questions_count} questions · {q.total_marks} marks · {q.duration_min} min
                        </span>
                      </span>
                      <Pill tone={q.is_published ? "success" : "neutral"}>{q.is_published ? "Published" : "Draft"}</Pill>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <Empty>No quizzes yet.</Empty>}
        </section>
        <Card>
          <h2 className="mb-3 font-semibold text-ink">New quiz</h2>
          <QuizForm subjects={subjects} />
        </Card>
      </div>
    </>
  );
}
