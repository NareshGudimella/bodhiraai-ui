import type { Metadata } from "next";
import { NotificationsView } from "@/components/inbox/notifications-view";

export const metadata: Metadata = { title: "Notifications" };

export default async function ParentNotificationsPage({ searchParams }: PageProps<"/parent/notifications">) {
  const page = Number((await searchParams).page) || 1;
  return <NotificationsView basePath="/parent/notifications" page={page} />;
}
