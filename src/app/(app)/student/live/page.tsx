import type { Metadata } from "next";
import { Empty, PageHeader, SectionTitle } from "@/components/ui";
import { studentApi } from "@/lib/student-api";
import { LiveCard } from "./live-card";

export const metadata: Metadata = { title: "Live classes" };

export default async function LivePage() {
  const [{ live_now, upcoming, past }, subjects] = await Promise.all([studentApi.liveClasses(), studentApi.subjects()]);
  // The list only carries subject_id; resolve the name from the student's subjects.
  const subjectName = new Map(subjects.map((s) => [s.id, s.name]));
  const sections = [
    { title: "Live now", items: live_now, empty: null },
    { title: "Upcoming", items: upcoming, empty: "No upcoming classes scheduled yet." },
    { title: "Past", items: past, empty: null },
  ];

  return (
    <>
      <PageHeader title="Live classes" subtitle="Join your teachers' live sessions." />
      {sections.map(({ title, items, empty }) =>
        items.length || empty ? (
          <section key={title} className="mb-8">
            <SectionTitle>{title}</SectionTitle>
            {items.length ? (
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((c, i) => (
                  <li key={c.id}>
                    <LiveCard c={c} i={i} subject={c.subject_id ? subjectName.get(c.subject_id) : undefined} />
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>{empty}</Empty>
            )}
          </section>
        ) : null,
      )}
    </>
  );
}
