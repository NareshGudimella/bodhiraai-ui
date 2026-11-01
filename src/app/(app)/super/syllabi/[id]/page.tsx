import Link from "next/link";
import { Card, Empty, PageHeader, Pill, SectionTitle, secondaryButtonClass } from "@/components/ui";
import { deleteSyllabus, deleteSyllabusSubject } from "@/lib/super-actions";
import { superApi } from "@/lib/super-api";
import { ConfirmButton } from "@/components/confirm-button";
import { SyllabusForm } from "../syllabus-form";
import { SubjectForm } from "./subject-form";

export default async function SyllabusPage({ params }: PageProps<"/super/syllabi/[id]">) {
  const { id } = await params;
  const { syllabus: s, subjects } = await superApi.syllabus(id);
  return (
    <>
      <PageHeader
        back={{ href: "/super/syllabi", label: "Syllabi" }}
        title={s.name}
        subtitle={<>{s.board.replace(/_/g, " ")} · Grade {s.grade} · <Pill tone={s.is_active ? "success" : "neutral"}>{s.is_active ? "Active" : "Inactive"}</Pill></>}
        action={
          <ConfirmButton action={deleteSyllabus.bind(null, s.id)} message={`Delete ${s.name}? Its subjects lose their syllabus.`} className={secondaryButtonClass}>
            Delete syllabus
          </ConfirmButton>
        }
      />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[3fr_2fr]">
        <section className="space-y-6">
          <div>
            <SectionTitle>Subjects · {subjects.length}</SectionTitle>
            {subjects.length ? (
              <ul className="space-y-2">
                {subjects.map((x) => (
                  <li key={x.id}>
                    <Card className="flex items-center justify-between gap-3 p-3 text-sm">
                      <Link href={`/super/syllabi/${s.id}/subjects/${x.id}`} className="min-w-0 hover:underline">
                        <span className="block font-medium text-ink">{x.icon} {x.name}</span>
                        <span className="block text-xs text-ink-3">{x.chapters_count} chapters</span>
                      </Link>
                      <ConfirmButton
                        action={deleteSyllabusSubject.bind(null, s.id, x.id)}
                        message={`Remove ${x.name} and all its chapters and lessons?`}
                        className="rounded-md border border-danger/40 px-2 py-1 text-xs text-danger hover:bg-danger-light"
                      >
                        Remove
                      </ConfirmButton>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : <Empty>No subjects yet.</Empty>}
          </div>
          <Card>
            <SectionTitle>Add subject</SectionTitle>
            <SubjectForm syllabusId={s.id} />
          </Card>
        </section>
        <Card className="h-fit">
          <SectionTitle>Details</SectionTitle>
          <SyllabusForm
            id={s.id}
            initial={{
              board: s.board,
              grade: s.grade,
              name: s.name,
              description: s.description ?? "",
              sort_order: String(s.sort_order),
              is_active: s.is_active ? "1" : "0",
            }}
          />
        </Card>
      </div>
    </>
  );
}
