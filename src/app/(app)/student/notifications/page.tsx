import type { Metadata } from "next";
import { NotificationsView } from "@/components/inbox/notifications-view";

export const metadata: Metadata = { title: "Notifications" };

export default async function StudentNotificationsPage({ searchParams }: PageProps<"/student/notifications">) {
  const page = Number((await searchParams).page) || 1;
  return <NotificationsView basePath="/student/notifications" page={page} />;
}
