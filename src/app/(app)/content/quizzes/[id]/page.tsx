import { ConfirmButton } from "@/components/confirm-button";
import { Card, Empty, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { deleteQuestion } from "@/lib/content-actions";
import { contentApi } from "@/lib/content-api";
import { QuestionForm } from "./question-form";
import { QuizForm } from "../quiz-form";

const TYPE = { mcq: "Multiple choice", tf: "True / false", short: "Short answer" } as const;

export default async function QuizEditPage({ params }: PageProps<"/content/quizzes/[id]">) {
  const { id } = await params;
  const { quiz, subjects, chapters } = await contentApi.quiz(id);
  const s = (n: number | null) => (n == null ? "" : String(n));
  return (
    <>
      <PageHeader
        back={{ href: "/content/quizzes", label: "Quiz builder" }}
        title={quiz.title}
        subtitle={`${quiz.questions.length} questions · ${quiz.total_marks} total marks · ${quiz.is_published ? "Published" : "Draft"}`}
      />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[3fr_2fr]">
        <section className="space-y-6">
          <div>
            <SectionTitle>Questions</SectionTitle>
            {quiz.questions.length ? (
              <ol className="space-y-2">
                {quiz.questions.map((q, i) => (
                  <li key={q.id}>
                    <Card className="space-y-2 p-4 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-ink">{i + 1}. {q.body}</p>
                        <ConfirmButton
                          action={deleteQuestion.bind(null, q.id)}
                          message={`Remove question ${i + 1}? This can't be undone.`}
                          className="rounded-md border border-line px-2 py-1 text-xs hover:bg-danger-light hover:text-danger"
                        >
                          Remove
                        </ConfirmButton>
                      </div>
                      {!!q.options?.length && (
                        <ul className="grid gap-1 sm:grid-cols-2">
                          {q.options.map((o) => (
                            <li key={o.key} className={q.correct_answer?.includes(o.key) ? "font-medium text-success" : "text-ink-2"}>
                              {o.key}. {o.text}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="flex flex-wrap gap-2 text-xs text-ink-3">
                        <Pill>{TYPE[q.type]}</Pill>
                        <span>{q.marks} mark{q.marks === 1 ? "" : "s"}</span>
                        <span>Answer: {q.correct_answer?.join(", ") || "—"}</span>
                      </p>
                      {q.explanation && <p className="text-xs text-ink-2">{q.explanation}</p>}
                    </Card>
                  </li>
                ))}
              </ol>
            ) : <Empty>No questions yet. Add the first one.</Empty>}
          </div>
          <Card>
            <SectionTitle>Add question</SectionTitle>
            <QuestionForm quizId={quiz.id} />
          </Card>
        </section>
        <Card className="h-fit">
          <SectionTitle>Quiz settings</SectionTitle>
          <QuizForm
            quizId={quiz.id}
            subjects={subjects}
            chapters={chapters}
            initial={{
              title: quiz.title,
              description: quiz.description ?? "",
              subject_id: s(quiz.subject_id),
              chapter_id: s(quiz.chapter_id),
              duration_min: s(quiz.duration_min),
              pass_marks: s(quiz.pass_marks),
              is_published: quiz.is_published ? "1" : "0",
            }}
          />
        </Card>
      </div>
    </>
  );
}
