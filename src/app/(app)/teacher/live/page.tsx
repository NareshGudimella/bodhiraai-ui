import type { Metadata } from "next";
import Link from "next/link";
import { Empty, PageHeader, SectionTitle, buttonClass } from "@/components/ui";
import { teacherApi } from "@/lib/teacher-api";
import { TeacherLiveCard } from "./teacher-live-card";

export const metadata: Metadata = { title: "Live classes" };

export default async function TeacherLivePage() {
  const classes = await teacherApi.liveClasses();
  // Upcoming: scheduled or running (soonest first). Past: ended or cancelled (newest first, as the API orders them).
  const upcoming = classes.filter((c) => c.live_status === "scheduled" || c.live_status === "live").reverse();
  const past = classes.filter((c) => c.live_status === "ended" || c.live_status === "cancelled");
  return (
    <>
      <PageHeader title="Live classes" action={<Link href="/teacher/live/new" className={buttonClass}>+ Schedule</Link>} />
      <section>
        <SectionTitle>Upcoming · {upcoming.length}</SectionTitle>
        {upcoming.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((c, i) => (
              <li key={c.id}>
                <TeacherLiveCard c={c} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No upcoming live classes. Schedule one to get started.</Empty>
        )}
      </section>
      <section className="mt-8">
        <SectionTitle>Past · {past.length}</SectionTitle>
        {past.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {past.map((c, i) => (
              <li key={c.id}>
                <TeacherLiveCard c={c} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Completed sessions will appear here.</Empty>
        )}
      </section>
    </>
  );
}
