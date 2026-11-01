import type { Metadata } from "next";
import { PageHeader, ProgressBar } from "@/components/ui";
import { studentApi } from "@/lib/student-api";
import { BadgeGrid } from "./badge-grid";

export const metadata: Metadata = { title: "Badges" };

export default async function BadgesPage() {
  const b = await studentApi.badges();

  return (
    <>
      <PageHeader title="My badges" subtitle={`${b.earned_count} of ${b.total} earned · ${b.total_xp} XP from badges`} />
      <div className="mb-6 max-w-md">
        <ProgressBar value={b.completion_percent} />
      </div>
      <BadgeGrid badges={b.badges} />
    </>
  );
}
