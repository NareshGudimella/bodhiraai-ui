import Link from "next/link";
import { PageHeader, secondaryButtonClass } from "@/components/ui";
import { studentApi } from "@/lib/student-api";
import { Chat } from "./chat";

/** Carbon diffForHumans, short: "5 minutes ago". */
function ago(iso: string): string {
  const sec = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  const units: [number, string][] = [[31_536_000, "year"], [2_592_000, "month"], [604_800, "week"], [86_400, "day"], [3600, "hour"], [60, "minute"]];
  for (const [size, name] of units) {
    if (sec >= size) {
      const n = Math.floor(sec / size);
      return `${n} ${name}${n === 1 ? "" : "s"} ago`;
    }
  }
  return "just now";
}

/**
 * AI tutor page: conversation list + the selected conversation (the most recent
 * one when none is chosen, like the legacy /student/ai page).
 */
export async function AiWorkspace({ sessionId, fresh = false }: { sessionId?: string; fresh?: boolean }) {
  const [sessions, tokens] = await Promise.all([studentApi.aiSessions(), studentApi.aiTokens()]);
  const currentId = fresh ? undefined : (sessionId ?? (sessions[0] ? String(sessions[0].id) : undefined));
  const current = currentId ? await studentApi.aiSession(currentId) : null;

  return (
    <>
      <PageHeader
        title="AI Tutor"
        subtitle="Ask questions and get step-by-step help."
        action={
          <Link href="/student/ai/new" className={secondaryButtonClass}>
            + New chat
          </Link>
        }
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <nav aria-label="Conversations" className="lg:w-64 lg:shrink-0">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {sessions.map((s) => (
              <li key={s.id} className="shrink-0">
                <Link
                  href={`/student/ai/${s.id}`}
                  aria-current={current?.session.id === s.id ? "page" : undefined}
                  className="block max-w-56 truncate rounded-lg px-3 py-2 text-sm text-ink-2 hover:bg-card aria-[current=page]:bg-card aria-[current=page]:font-semibold aria-[current=page]:text-brand aria-[current=page]:ring-1 aria-[current=page]:ring-line lg:max-w-none"
                >
                  <span className="block truncate">{s.title || "New conversation"}</span>
                  <span className="block text-xs font-normal text-ink-3">
                    {s.messages_count} {s.messages_count === 1 ? "message" : "messages"}
                    {(s.last_message_at ?? s.updated_at) && ` · ${ago(s.last_message_at ?? s.updated_at!)}`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Chat
          key={current?.session.id ?? "new"}
          sessionId={current?.session.id ?? null}
          initialMessages={current?.messages ?? []}
          initialTokens={tokens}
        />
      </div>
    </>
  );
}
