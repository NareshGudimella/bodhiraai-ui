import { PageHeader } from "@/components/ui";
import { studentApi } from "@/lib/student-api";
import { QuizRunner } from "./quiz-runner";

export default async function QuizPage({ params }: PageProps<"/student/quizzes/[id]">) {
  const quiz = await studentApi.quiz((await params).id);
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
