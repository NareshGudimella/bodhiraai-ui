import Link from "next/link";
import { Card, Empty, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { contentApi } from "@/lib/content-api";
import { ChapterForm } from "./chapter-form";

export default async function ContentSubjectPage({ params }: PageProps<"/content/subjects/[id]">) {
  const { id } = await params;
  const { subject, chapters } = await contentApi.subject(id);
  return (
    <>
      <PageHeader
        back={{ href: "/content", label: "Content library" }}
        title={`${subject.icon ?? ""} ${subject.name}`.trim()}
        subtitle={subject.grade ? `Grade ${subject.grade}` : undefined}
      />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
        <section>
          <SectionTitle>Chapters · {chapters.length}</SectionTitle>
          {chapters.length ? (
            <ol className="space-y-2">
              {chapters.map((c) => (
                <li key={c.id}>
                  <Link href={`/content/chapters/${c.id}`} className="block">
                    <Card className="flex items-center justify-between gap-3 p-4 transition hover:ring-primary">
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{c.sort_order}. {c.title}</span>
                        <span className="block text-xs text-ink-3">
                          {c.lessons_count} lesson{c.lessons_count === 1 ? "" : "s"}
                        </span>
                      </span>
                      <Pill tone={c.is_published ? "success" : "neutral"}>{c.is_published ? "Published" : "Draft"}</Pill>
                    </Card>
                  </Link>
                </li>
              ))}
            </ol>
          ) : <Empty>No chapters yet.</Empty>}
        </section>
        <ChapterForm subjectId={subject.id} />
      </div>
    </>
  );
}
