import Link from "next/link";
import { Card, Empty, PageHeader, Pill, SectionTitle, Stat } from "@/components/ui";
import { superApi } from "@/lib/super-api";
import { inr, tone } from "./format";

export default async function SuperAdminHome() {
  const { platform: p, growth, top_schools } = await superApi.home();
  const max = Math.max(1, ...growth.map((d) => Math.max(d.users, d.attempts)));
  const bar = (n: number) => `${(n / max) * 96 + 2}px`;
  return (
    <>
      <PageHeader title="Platform" subtitle={`${p.schools_active} of ${p.schools_total} schools active`} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Users" value={p.users_total} hint={`${p.signups_7d} new this week`} />
        <Stat label="Students" value={p.students} />
        <Stat label="Teachers" value={p.teachers} />
        <Stat label="Parents" value={p.parents} />
        <Stat label="Classes" value={p.classes} />
        <Stat label="MRR" value={inr(p.mrr)} hint={`ARR ${inr(p.arr_projection)} · active schools`} />
        <Stat label="AI sessions" value={p.ai_sessions} hint={`${p.ai_messages} messages`} />
        <Stat label="Lesson views" value={p.lesson_views} />
      </div>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <section>
          <SectionTitle>Platform growth, last 7 days</SectionTitle>
          <Card>
            <ol className="flex h-36 items-end gap-2" aria-label="New users and quiz attempts by day">
              {growth.map((d) => (
                <li key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${d.users} new users, ${d.attempts} quiz attempts`}>
                  <span className="flex h-28 w-full items-end gap-0.5">
                    <span className="w-1/2 rounded-t bg-primary" style={{ height: bar(d.users) }} aria-hidden />
                    <span className="w-1/2 rounded-t bg-brand" style={{ height: bar(d.attempts) }} aria-hidden />
                  </span>
                  <span className="text-[10px] text-ink-3">{d.date}</span>
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
            <ul className="space-y-1 text-sm">
              {top_schools.map((s) => (
                <li key={s.id}>
                  <Link href={`/super/schools/${s.id}`} className="flex items-center justify-between gap-2 rounded-lg bg-card px-3 py-2 ring-1 ring-line hover:ring-primary">
                    <span className="min-w-0 truncate text-ink">{s.name} <span className="text-xs text-ink-3">· {s.code} · {s.plan}</span></span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-ink-3">{s.users_count} users · {s.classes_count} classes <Pill tone={tone(s.status)}>{s.status}</Pill></span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <Empty>No schools yet.</Empty>}
        </section>
      </div>
    </>
  );
}
