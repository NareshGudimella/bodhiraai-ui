import Link from "next/link";
import { buttonClass, Card, Empty, PageHeader, SectionTitle, secondaryButtonClass } from "@/components/ui";
import { startChat } from "@/lib/inbox-actions";
import { parentApi } from "@/lib/parent-api";
import { ChildAvatar } from "./child-avatar";

const ALERT_ICON: Record<string, string> = { attendance: "📅", performance: "📉", assignment: "📝" };
/** Legacy home view: each alert type links to the matching child page. */
const ALERT_LINK: Record<string, { path: string; label: string }> = {
  assignment: { path: "/assignments", label: "View Assignment" },
  attendance: { path: "/attendance", label: "View Attendance" },
  performance: { path: "/performance", label: "View Performance" },
};

export default async function ParentHome() {
  const { parent, children, alerts } = await parentApi.home();
  // `child_id` is not in legacy; fall back to the child's name for older APIs.
  const childIdFor = (a: (typeof alerts)[number]) => a.child_id ?? children.find((c) => c.name === a.child)?.id;
  return (
    <>
      <PageHeader title={`Hello, ${parent.name.split(" ")[0]}`} subtitle="How your children are doing." />
      {alerts.length > 0 && (
        <section className="mb-8">
          <SectionTitle>Needs attention</SectionTitle>
          <ul className="space-y-2">
            {alerts.map((a, i) => {
              const id = childIdFor(a);
              const link = ALERT_LINK[a.type];
              return (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-danger-light px-4 py-2.5 text-sm text-danger">
                  <span aria-hidden>{ALERT_ICON[a.type] ?? "⚠️"}</span>
                  <span className="min-w-0 flex-1"><strong>{a.child}:</strong> {a.message}</span>
                  {id !== undefined && (
                    <Link
                      href={`/parent/children/${id}${link?.path ?? ""}`}
                      className="shrink-0 rounded-lg bg-danger px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
                    >
                      {link?.label ?? "View"}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
      <SectionTitle>Children</SectionTitle>
      {children.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {children.map((c) => (
            <li key={c.id}>
              <Card className="h-full">
                <Link href={`/parent/children/${c.id}`} className="flex items-center gap-3 transition hover:opacity-80">
                  <ChildAvatar name={c.name} avatar={c.avatar} />
                  <div>
                    <p className="font-semibold text-ink">{c.name}</p>
                    <p className="text-xs text-ink-3">
                      {[c.grade && `Grade ${c.grade}`, c.school, c.relation && `You: ${c.relation.charAt(0).toUpperCase()}${c.relation.slice(1)}`].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </Link>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                  {[
                    ["Attendance", `${c.stats.attendance_percent}%`],
                    ["Quiz avg", `${c.stats.avg_quiz_percent}%`],
                    ["Lessons completed", c.stats.lessons_completed],
                    ["Pending", c.stats.pending_assignments],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-primary-light p-2">
                      <dt className="text-[11px] text-ink-3">{label}</dt>
                      <dd className="font-bold text-brand">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/parent/children/${c.id}`} className={buttonClass}>Overview</Link>
                  <Link href={`/parent/children/${c.id}/performance`} className={secondaryButtonClass}>Performance</Link>
                  <form action={startChat.bind(null, "with-teacher", c.id)}>
                    <button className={secondaryButtonClass}>💬 Chat</button>
                  </form>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No children are linked to your account yet. Contact the school.</Empty>
      )}
    </>
  );
}
