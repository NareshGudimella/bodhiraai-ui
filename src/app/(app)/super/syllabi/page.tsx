import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, Pill, buttonClass } from "@/components/ui";
import { superApi } from "@/lib/super-api";

export const metadata: Metadata = { title: "Syllabi" };

export default async function SyllabiPage() {
  const syllabi = await superApi.syllabi();
  return (
    <>
      <PageHeader
        title="Syllabi"
        subtitle="Platform boards and grades. Schools subscribe to these."
        action={<Link href="/super/syllabi/new" className={buttonClass}>+ Add syllabus</Link>}
      />
      {syllabi.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {syllabi.map((s) => (
            <li key={s.id}>
              <Link href={`/super/syllabi/${s.id}`} className="block h-full">
                <Card className="h-full p-4 transition hover:ring-primary">
                  <p className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-brand">{s.name}</span>
                    <Pill tone={s.is_active ? "success" : "neutral"}>{s.is_active ? "Active" : "Inactive"}</Pill>
                  </p>
                  <p className="text-xs text-ink-2">{s.board.replace(/_/g, " ")} · Grade {s.grade}</p>
                  <p className="mt-2 text-xs text-ink-3">{s.subjects_count} subjects · {s.schools_count} schools</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : <Empty>No syllabi yet.</Empty>}
    </>
  );
}
