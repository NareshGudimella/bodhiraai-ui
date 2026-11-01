import type { Metadata } from "next";
import { Empty, PageHeader } from "@/components/ui";
import { studentApi } from "@/lib/student-api";
import { QuizList } from "./quiz-list";

export const metadata: Metadata = { title: "Quizzes" };

export default async function QuizzesPage() {
  const quizzes = await studentApi.quizzes();
  return (
    <>
      <PageHeader title="Quizzes" subtitle="Quizzes you haven't attempted yet." />
      {quizzes.length ? <QuizList quizzes={quizzes} /> : <Empty>You&apos;re all caught up. No pending quizzes.</Empty>}
    </>
  );
}
