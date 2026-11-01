import Link from "next/link";
import { Card, Empty, PageHeader, Pill, SectionTitle, secondaryButtonClass } from "@/components/ui";
import { createLesson, deleteChapter } from "@/lib/content-actions";
import { contentApi } from "@/lib/content-api";
import { mediaUrl } from "@/lib/media";
import { LessonForm } from "../../lesson-form";
import { ConfirmButton } from "@/components/confirm-button";

const ICON = { video: "🎬", pdf: "📄", text: "📝" } as const;

export default async function ContentChapterPage({ params }: PageProps<"/content/chapters/[id]">) {
  const { id } = await params;
  const { chapter } = await contentApi.chapter(id);
  return (
    <>
      <PageHeader
        back={{ href: `/content/subjects/${chapter.subject_id}`, label: chapter.subject.name }}
        title={chapter.title}
        subtitle={`${chapter.lessons.length} lesson${chapter.lessons.length === 1 ? "" : "s"} · ${chapter.is_published ? "Published" : "Draft"}`}
        action={
          <ConfirmButton
            action={deleteChapter.bind(null, chapter.id, chapter.subject_id)}
            message={`Delete "${chapter.title}" and all its lessons?`}
            className={secondaryButtonClass}
          >
            Delete chapter
          </ConfirmButton>
        }
      />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[3fr_2fr]">
        <section>
          <SectionTitle>Lessons</SectionTitle>
          {chapter.lessons.length ? (
            <ol className="space-y-2">
              {chapter.lessons.map((l) => {
                const thumb = mediaUrl(l.thumbnail);
                return (
                  <li key={l.id}>
                    <Card className="flex items-center gap-3 p-3">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element -- stored media on another origin
                        <img src={thumb} alt="" className="h-12 w-20 shrink-0 rounded-md object-cover ring-1 ring-line" />
                      ) : (
                        <span className="grid h-12 w-20 shrink-0 place-items-center rounded-md bg-page text-xl ring-1 ring-line" aria-hidden>{ICON[l.type]}</span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-ink">{l.sort_order}. {l.title}</span>
                        <span className="flex flex-wrap gap-1 text-xs text-ink-3">
                          <span className="capitalize">{l.type}</span>
                          {l.duration_sec > 0 && <span>· {Math.floor(l.duration_sec / 60)}:{String(l.duration_sec % 60).padStart(2, "0")}</span>}
                          {l.is_free && <Pill tone="success">Free</Pill>}
                          {!l.is_published && <Pill>Draft</Pill>}
                        </span>
                      </span>
                      <Link href={`/content/lessons/${l.id}/edit`} className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light">Edit</Link>
                    </Card>
                  </li>
                );
              })}
            </ol>
          ) : <Empty>No lessons yet.</Empty>}
        </section>
        <Card>
          <SectionTitle>Add lesson</SectionTitle>
          <LessonForm action={createLesson.bind(null, chapter.id)} submitLabel="Add lesson" />
        </Card>
      </div>
    </>
  );
}
