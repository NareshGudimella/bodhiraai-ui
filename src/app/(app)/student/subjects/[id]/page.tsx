import Link from "next/link";
import { Card, Empty, PageHeader } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { studentApi } from "@/lib/student-api";

export default async function SubjectPage({ params }: PageProps<"/student/subjects/[id]">) {
  const { subject, chapters } = await studentApi.subject((await params).id);

  return (
    <>
      <PageHeader
        back={{ href: "/student/subjects", label: "Subjects" }}
        title={`${subject.icon ?? "📘"} ${subject.name}`}
        subtitle={subject.description ?? undefined}
      />
      {chapters.length ? (
        <ol className="space-y-2">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <Link href={`/student/chapters/${c.id}`} className="block">
                <Card className="ccard flex items-center gap-4 p-4 transition hover:ring-primary" style={cardTone(i)}>
                  <span className="ccard-tile flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{c.title}</p>
                    {c.description && <p className="truncate text-xs text-ink-2">{c.description}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-ink-3">{c.lessons_count ?? 0} lessons</span>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <Empty>No chapters have been published for this subject yet.</Empty>
      )}
    </>
  );
}
