import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, Pill, Stat, buttonClass } from "@/components/ui";
import { contentApi } from "@/lib/content-api";

export const metadata: Metadata = { title: "Content library" };

export default async function ContentLibraryPage() {
  const { subjects, totals } = await contentApi.library();
  return (
    <>
      <PageHeader
        title="Content library"
        subtitle="Chapters, lessons and quizzes for every board and grade"
        action={<Link href="/content/quizzes" className={buttonClass}>Quiz builder</Link>}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Subjects" value={totals.subjects} />
        <Stat label="Chapters" value={totals.chapters} />
        <Stat label="Lessons" value={totals.lessons} />
        <Stat label="Quizzes" value={totals.quizzes} />
      </div>
      <section className="mt-8">
        {subjects.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((s) => (
              <li key={s.id}>
                <Link href={`/content/subjects/${s.id}`} className="block h-full">
                  <Card className="h-full p-4 transition hover:ring-primary">
                    <p className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-brand">{s.icon} {s.name}</span>
                      {!s.is_active && <Pill>Hidden</Pill>}
                    </p>
                    <p className="text-xs text-ink-2">
                      {s.grade ? `Grade ${s.grade}` : "All grades"} · {s.school_id ? "School subject" : "Platform"}
                    </p>
                    <p className="mt-2 text-xs text-ink-3">{s.chapters_count} chapters · {s.quizzes_count} quizzes</p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        ) : <Empty>No subjects yet. Add them to a syllabus first.</Empty>}
      </section>
    </>
  );
}
