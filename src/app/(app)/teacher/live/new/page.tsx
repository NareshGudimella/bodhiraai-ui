import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { teacherApi } from "@/lib/teacher-api";
import { LiveForm } from "./live-form";

export const metadata: Metadata = { title: "Schedule a live class" };

export default async function NewLivePage() {
  const scopes = await teacherApi.liveScopes();
  return (
    <>
      <PageHeader back={{ href: "/teacher/live", label: "Live classes" }} title="Schedule a live class" />
      <LiveForm {...scopes} />
    </>
  );
}
