import Link from "next/link";
import { Card, Empty, PageHeader, SectionTitle } from "@/components/ui";
import { startChat } from "@/lib/inbox-actions";
import { inboxApi } from "@/lib/inbox-api";

/** Shared /<role>/chat page: conversations plus people you can start a chat with. */
export async function ChatIndex({ basePath }: { basePath: string }) {
  const [conversations, contacts] = await Promise.all([inboxApi.conversations(), inboxApi.contacts()]);
  const existing = new Set(conversations.map((c) => c.partner?.id));
  const fresh = contacts.filter((c) => !existing.has(c.partner.id));

  return (
    <>
      <PageHeader title="Messages" subtitle="Chat between parents and class teachers." />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
        <section>
          <SectionTitle>Conversations</SectionTitle>
          {conversations.length ? (
            <ul className="space-y-2">
              {conversations.map((c) => (
                <li key={c.id}>
                  <Link href={`${basePath}/${c.id}`} className="block">
                    <Card className="flex items-center gap-3 p-4 transition hover:ring-primary">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-brand">
                        {c.partner?.name.charAt(0) ?? "?"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="truncate font-medium text-ink">{c.partner?.name ?? "Unknown"}</span>
                          <span className="shrink-0 text-xs text-ink-3">{c.preview?.time}</span>
                        </span>
                        <span className="block truncate text-sm text-ink-2">
                          {c.preview ? `${c.preview.mine ? "You: " : ""}${c.preview.body}` : c.partner?.role_label}
                        </span>
                      </span>
                      {c.unread_count > 0 && (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-primary-light">
                          {c.unread_count}
                        </span>
                      )}
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No conversations yet.</Empty>
          )}
        </section>
        <section>
          <SectionTitle>Start a chat</SectionTitle>
          {fresh.length ? (
            <ul className="space-y-2">
              {fresh.map((c) => (
                <li key={`${c.start}-${c.student.id}`}>
                  <form action={startChat.bind(null, c.start, c.student.id)}>
                    <button className="w-full text-left">
                      <Card className="p-3 transition hover:ring-primary">
                        <span className="block font-medium text-ink">{c.partner.name}</span>
                        <span className="block text-xs text-ink-3">
                          {c.partner.role_label} · about {c.student.name}
                        </span>
                      </Card>
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No new contacts.</Empty>
          )}
        </section>
      </div>
    </>
  );
}
