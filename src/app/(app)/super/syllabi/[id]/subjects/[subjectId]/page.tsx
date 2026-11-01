import Link from "next/link";
import { Card, Empty, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { superApi } from "@/lib/super-api";
import { SyllabusChapterForm } from "../../subject-form";

export default async function SyllabusSubjectPage({ params }: PageProps<"/super/syllabi/[id]/subjects/[subjectId]">) {
  const { id, subjectId } = await params;
  const { syllabus, subject, chapters } = await superApi.syllabusSubject(id, subjectId);
  return (
    <>
      <PageHeader
        back={{ href: `/super/syllabi/${syllabus.id}`, label: syllabus.name }}
        title={`${subject.icon ?? ""} ${subject.name}`.trim()}
        action={<Link href={`/content/subjects/${subject.id}`} className="text-sm text-primary underline">Open in the content library</Link>}
      />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
        <section>
          <SectionTitle>Chapters · {chapters.length}</SectionTitle>
          {chapters.length ? (
            <ol className="space-y-2">
              {chapters.map((c, i) => (
                <li key={c.id}>
                  <Link href={`/content/chapters/${c.id}`} className="block">
                    <Card className="ccard flex items-center justify-between gap-3 p-3 pl-4 transition hover:ring-primary" style={cardTone(i)}>
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{c.title}</span>
                        <span className="block text-xs text-ink-3">{c.lessons_count} lessons</span>
                      </span>
                      <Pill tone={c.is_published ? "success" : "neutral"}>{c.is_published ? "Published" : "Draft"}</Pill>
                    </Card>
                  </Link>
                </li>
              ))}
            </ol>
          ) : <Empty>No chapters yet.</Empty>}
        </section>
        <Card className="h-fit">
          <SectionTitle>Add chapter</SectionTitle>
          <SyllabusChapterForm syllabusId={syllabus.id} subjectId={subject.id} />
        </Card>
      </div>
    </>
  );
}
