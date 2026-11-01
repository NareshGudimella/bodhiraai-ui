import Link from "next/link";
import { Card, Empty, PageHeader, secondaryButtonClass } from "@/components/ui";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/inbox-actions";
import { inboxApi } from "@/lib/inbox-api";
import { safeNextPath } from "@/lib/safe-path";

/** Keep notification links inside this app (legacy rows carry the old host). */
const localPath = (url: string | null) => {
  if (!url) return null;
  try {
    const u = new URL(url, "http://local");
    return safeNextPath(`${u.pathname}${u.search}`); // security: not in legacy (no //host)
  } catch {
    return null;
  }
};

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) : "";

/** Shared /<role>/notifications page body. */
export async function NotificationsView({ basePath, page }: { basePath: string; page: number }) {
  const { items, meta } = await inboxApi.notifications(page);
  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={meta.unread_count ? `${meta.unread_count} unread` : "You're all caught up."}
        action={
          meta.unread_count > 0 ? (
            <form action={markAllNotificationsRead}>
              <button className={secondaryButtonClass}>Mark all read</button>
            </form>
          ) : undefined
        }
      />
      {items.length ? (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id}>
              <form action={markNotificationRead.bind(null, n.id, localPath(n.url))}>
                <button className="block w-full text-left">
                  <Card className={`flex items-start gap-3 p-4 transition hover:ring-primary ${n.read_at ? "opacity-70" : ""}`}>
                    <span aria-hidden className="text-2xl">{n.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        {!n.read_at && <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                        {n.title}
                      </span>
                      {n.body && <span className="block truncate text-sm text-ink-2">{n.body}</span>}
                      <span className="block text-xs text-ink-3">{when(n.created_at)}</span>
                    </span>
                  </Card>
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No notifications yet.</Empty>
      )}
      {meta.last_page > 1 && (
        <nav aria-label="Pages" className="mt-6 flex justify-between">
          {page > 1 ? <Link className={secondaryButtonClass} href={`${basePath}?page=${page - 1}`}>← Newer</Link> : <span />}
          {page < meta.last_page && <Link className={secondaryButtonClass} href={`${basePath}?page=${page + 1}`}>Older →</Link>}
        </nav>
      )}
    </>
  );
}
