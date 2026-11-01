import type { Metadata } from "next";
import { NotificationsView } from "@/components/inbox/notifications-view";

export const metadata: Metadata = { title: "Notifications" };

export default async function TeacherNotificationsPage({ searchParams }: PageProps<"/teacher/notifications">) {
  const page = Number((await searchParams).page) || 1;
  return <NotificationsView basePath="/teacher/notifications" page={page} />;
}
