import type { Metadata } from "next";
import Link from "next/link";
import { Empty, PageHeader, Pill } from "@/components/ui";
import { adminApi, type AdminSubject } from "@/lib/admin-api";

export const metadata: Metadata = { title: "Subjects" };

/**
 * Read-only list (GET /admin/subjects). School admins no longer create,
 * edit, hide or delete subjects: they come from the Super Admin's curricula.
 * not in legacy (legacy subjects.blade.php had the editor)
 */
export default async function AdminSubjectsPage() {
  const subjects = await adminApi.subjects();
  return (
    <>
      <PageHeader
        title="Subjects"
        subtitle="Subjects available to your school."
        action={<Link href="/admin/content" className="text-sm font-semibold text-brand hover:underline">Browse content →</Link>}
      />
      <p className="-mt-3 mb-6 rounded-xl bg-primary-light px-4 py-2 text-sm text-ink-2">
        Subjects come from the Super Admin&apos;s curricula. Choose the curricula your school uses under{" "}
        <Link href="/admin/syllabi" className="font-semibold text-brand hover:underline">Syllabi</Link>.
      </p>
      {subjects.length ? (
        <ul className="rounded-2xl bg-card ring-1 ring-line">{subjects.map((s) => <SubjectRow key={s.id} subject={s} />)}</ul>
      ) : <Empty>No subjects yet.</Empty>}
    </>
  );
}

function SubjectRow({ subject: s }: { subject: AdminSubject }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 first:border-t-0">
      <span className="flex min-w-0 items-center gap-3">
        <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xl ring-1 ring-line" style={{ background: s.color ? `${s.color}33` : undefined }}>{s.icon ?? "📘"}</span>
        <span className="min-w-0">
          <span className="font-medium text-ink">{s.name}</span>
          {s.grade && <span className="ml-2 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-ink-2">Grade {s.grade}</span>}
          <span className="block text-xs text-ink-3">{s.grade ? "" : "All grades · "}{s.chapters_count} {s.chapters_count === 1 ? "chapter" : "chapters"}</span>
        </span>
      </span>
      <Pill tone={s.is_active ? "success" : "neutral"}>{s.is_active ? "Active" : "Hidden"}</Pill>
    </li>
  );
}
