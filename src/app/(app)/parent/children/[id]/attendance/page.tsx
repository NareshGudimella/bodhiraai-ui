import Link from "next/link";
import { Card, Empty, PageHeader, Pill, Stat, secondaryButtonClass } from "@/components/ui";
import { parentApi } from "@/lib/parent-api";
import { ChildTabs } from "../child-tabs";

const shift = (month: string, by: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return d.toISOString().slice(0, 7);
};

const TONE: Record<string, "success" | "brand" | "neutral"> = { present: "success", late: "brand" };

export default async function ChildAttendancePage({ params, searchParams }: PageProps<"/parent/children/[id]/attendance">) {
  const { id } = await params;
  const month = (await searchParams).month;
  const a = await parentApi.attendance(id, typeof month === "string" ? month : undefined);
  return (
    <>
      <PageHeader back={{ href: "/parent", label: "Dashboard" }} title={a.student.name} />
      <ChildTabs id={id} current="/attendance" />
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link href={`?month=${shift(a.month, -1)}`} className={secondaryButtonClass}>← Previous</Link>
        <h2 className="font-semibold text-brand">{a.month_label}</h2>
        <Link href={`?month=${shift(a.month, 1)}`} className={secondaryButtonClass}>Next →</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Attendance" value={`${a.totals.percent}%`} />
        <Stat label="Present" value={a.totals.present} />
        <Stat label="Absent" value={a.totals.absent} />
        <Stat label="Late" value={a.totals.late} />
        <Stat label="Excused" value={a.totals.excused} />
      </div>
      <div className="mt-6">
        {a.records.length ? (
          <Card className="divide-y divide-line p-0">
            {a.records.map((r) => (
              <div key={r.date} className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
                <span className="text-ink">{r.date_label}</span>
                <span className="flex items-center gap-2">
                  {r.remarks && <span className="text-xs text-ink-3">{r.remarks}</span>}
                  <Pill tone={TONE[r.status] ?? "neutral"}>{r.status}</Pill>
                </span>
              </div>
            ))}
          </Card>
        ) : (
          <Empty>No attendance recorded for {a.month_label}.</Empty>
        )}
      </div>
    </>
  );
}
