import Link from "next/link";
import { Card, Empty, PageHeader, Pill, SectionTitle, Stat, TableCard } from "@/components/ui";
import { superApi } from "@/lib/super-api";
import { inr, tone } from "./format";

export default async function SuperAdminHome() {
  const { platform: p, growth, top_schools } = await superApi.home();
  const max = Math.max(1, ...growth.map((d) => Math.max(d.users, d.attempts)));
  const bar = (n: number) => `${(n / max) * 96 + 2}px`;
  return (
    <>
      <PageHeader title="Platform" subtitle={`${p.schools_active} of ${p.schools_total} schools active`} />
      <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Users" value={p.users_total} hint={`${p.signups_7d} new this week`} />
        <Stat label="MRR" value={inr(p.mrr)} hint={`ARR ${inr(p.arr_projection)} · active schools`} />
        <Stat label="AI sessions" value={p.ai_sessions} hint={`${p.ai_messages} messages`} />
        <Stat label="Lesson views" value={p.lesson_views} />
      </section>
      <section aria-label="People and classes" className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Students" value={p.students} />
        <Stat label="Teachers" value={p.teachers} />
        <Stat label="Parents" value={p.parents} />
        <Stat label="Classes" value={p.classes} />
      </section>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <section>
          <SectionTitle>Platform growth, last 7 days</SectionTitle>
          <Card>
            <ol className="flex h-36 items-end gap-2 border-b border-line" aria-label="New users and quiz attempts by day">
              {growth.map((d) => (
                <li key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${d.users} new users, ${d.attempts} quiz attempts`}>
                  <span className="flex h-28 w-full items-end gap-0.5">
                    <span className="w-1/2 rounded-t bg-primary" style={{ height: bar(d.users) }} aria-hidden />
                    <span className="w-1/2 rounded-t bg-brand" style={{ height: bar(d.attempts) }} aria-hidden />
                  </span>
                  <span className="text-[10px] tabular-nums text-ink-3">{d.date}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 flex gap-4 text-xs text-ink-2">
              <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-primary" aria-hidden /> New users</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-brand" aria-hidden /> Quiz attempts</span>
            </p>
          </Card>
        </section>
        <section>
          <SectionTitle>Largest schools</SectionTitle>
          {top_schools.length ? (
            <TableCard>
              <table className="data-table">
                <thead>
                  <tr><th>School</th><th className="num">Users</th><th className="num">Classes</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {top_schools.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <Link href={`/super/schools/${s.id}`} className="font-medium text-ink hover:underline">{s.name}</Link>
                        <span className="block text-xs capitalize text-ink-3">{s.code} · {s.plan}</span>
                      </td>
                      <td className="num">{s.users_count}</td>
                      <td className="num">{s.classes_count}</td>
                      <td><Pill tone={tone(s.status)}>{s.status}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          ) : <Empty>No schools yet.</Empty>}
        </section>
      </div>
    </>
  );
}
