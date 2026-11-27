import { PageHeader } from "@/components/ui";
import { canonical } from "@/lib/canonical";
import { studentApi } from "@/lib/student-api";
import { QuizRunner } from "./quiz-runner";

export default async function QuizPage({ params }: PageProps<"/student/quizzes/[id]">) {
  const { id } = await params;
  const quiz = await studentApi.quiz(id);
  canonical(id, quiz.slug, "/student/quizzes");
  return (
    <>
      <PageHeader
        back={{ href: "/student/quizzes", label: "Quizzes" }}
        title={quiz.title}
        subtitle={[quiz.subject?.name, quiz.chapter?.title].filter(Boolean).join(" · ") || undefined}
      />
      <QuizRunner quiz={quiz} />
    </>
  );
}
