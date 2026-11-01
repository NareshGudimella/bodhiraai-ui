import { Card, PageHeader, secondaryButtonClass } from "@/components/ui";
import { deleteLesson, updateLesson } from "@/lib/content-actions";
import { contentApi } from "@/lib/content-api";
import { mediaUrl } from "@/lib/media";
import { isSignedFileUrl } from "@/lib/signed-file";
import { ConfirmButton } from "@/components/confirm-button";
import { LessonForm } from "../../../lesson-form";

export default async function EditLessonPage({ params }: PageProps<"/content/lessons/[id]/edit">) {
  const { id } = await params;
  const { lesson } = await contentApi.lesson(id);
  const media = mediaUrl(lesson.content_url);
  // Editors manage uploaded lesson videos but may not play them: only enrolled students
  // and their teachers can (VdoCipher, our signed file, or a legacy upload not moved yet).
  // An external link the editor typed keeps its preview. security: not in legacy
  const uploaded =
    lesson.type === "video" &&
    (lesson.playback === "vdocipher" || isSignedFileUrl(media) || (!!lesson.content_url && !/^https?:\/\//i.test(lesson.content_url)));
  return (
    <>
      <PageHeader
        back={{ href: `/content/chapters/${lesson.chapter_id}`, label: lesson.chapter.title }}
        title={`Edit: ${lesson.title}`}
        subtitle={lesson.chapter.subject.name}
        action={
          <ConfirmButton action={deleteLesson.bind(null, lesson.id, lesson.chapter_id)} message={`Delete "${lesson.title}"?`} className={secondaryButtonClass}>
            Delete lesson
          </ConfirmButton>
        }
      />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[3fr_2fr]">
        <Card>
          <LessonForm action={updateLesson.bind(null, lesson.id, lesson.chapter_id)} initial={lesson} edit submitLabel="Save lesson" />
        </Card>
        <section className="space-y-3 text-sm">
          <h2 className="font-semibold text-ink">Current media</h2>
          {uploaded ? (
            <p className="rounded-xl bg-page p-3 text-ink-2 ring-1 ring-line">🔒 Video uploaded; playback is limited to students and their teachers.</p>
          ) : (
            <>
              {media && lesson.type === "video" && <video src={media} controls preload="metadata" className="w-full rounded-xl ring-1 ring-line" />}
              {media && lesson.type === "pdf" && <a href={media} target="_blank" rel="noreferrer" className="text-primary underline">Open the PDF</a>}
              {!media && <p className="text-ink-3">No file or URL.</p>}
              {media && !isSignedFileUrl(media) && <p className="break-all text-xs text-ink-3">{lesson.content_url}</p>}
            </>
          )}
        </section>
      </div>
    </>
  );
}
