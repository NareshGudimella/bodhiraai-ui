import type { Metadata } from "next";
import { Card, Empty, PageHeader, SectionTitle, Stat } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { superApi } from "@/lib/super-api";

export const metadata: Metadata = { title: "AI usage" };

export default async function SuperAiPage() {
  const { totals, top_users, engagement_14d } = await superApi.aiUsage();
  const max = Math.max(1, ...engagement_14d.map((d) => Math.max(d.sessions, d.lessons, d.attempts)));
  const bar = (n: number, cls: string) => <span className={`w-1/3 rounded-t ${cls}`} style={{ height: `${(n / max) * 96 + 1}px` }} />;
  return (
    <>
      <PageHeader title="AI usage" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Tutor sessions" value={totals.sessions} />
        <Stat label="Messages" value={totals.messages} />
        <Stat label="Tokens" value={totals.tokens.toLocaleString("en-IN")} />
        <Stat label="Messages / session" value={totals.avg_messages_per_session} />
      </div>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
        <section>
          <SectionTitle>Engagement, last 14 days</SectionTitle>
          <Card>
            <ol className="flex h-36 items-end gap-1" aria-label="AI sessions, lessons completed and quiz attempts by day">
              {engagement_14d.map((d) => (
                <li key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${d.sessions} AI sessions, ${d.lessons} lessons, ${d.attempts} attempts`}>
                  <span className="flex h-full w-full items-end gap-px" aria-hidden>{bar(d.sessions, "bg-primary")}{bar(d.lessons, "bg-brand")}{bar(d.attempts, "bg-ink-3")}</span>
                  <span className="text-[10px] text-ink-3">{d.date}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 flex flex-wrap gap-4 text-xs text-ink-2">
              <span><span className="mr-1 inline-block size-2 rounded-sm bg-primary" />AI sessions</span>
              <span><span className="mr-1 inline-block size-2 rounded-sm bg-brand" />Lessons</span>
              <span><span className="mr-1 inline-block size-2 rounded-sm bg-ink-3" />Quiz attempts</span>
            </p>
          </Card>
        </section>
        <section>
          <SectionTitle>Most active users</SectionTitle>
          {top_users.length ? (
            <ul className="space-y-1 text-sm">
              {top_users.map((u, i) => (
                <li key={i} className="ccard flex justify-between gap-2 rounded-lg bg-card py-2 pl-4 pr-3 ring-1 ring-line" style={cardTone(i)}>
                  <span className="truncate text-ink">{u.name} <span className="text-xs capitalize text-ink-3">· {u.role?.replace("_", " ")}</span></span>
                  <span className="shrink-0 text-xs text-ink-3">{u.sessions} sessions</span>
                </li>
              ))}
            </ul>
          ) : <Empty>No tutor sessions yet.</Empty>}
        </section>
      </div>
    </>
  );
}
