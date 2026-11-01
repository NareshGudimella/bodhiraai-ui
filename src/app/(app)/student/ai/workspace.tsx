import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { Card, PageHeader, secondaryButtonClass } from "@/components/ui";
import { ApiError } from "@/lib/api";
import { studentApi } from "@/lib/student-api";
import { Chat } from "./chat";
import { RetryButton } from "./retry-button";

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
async function read(sessionId: string | undefined, fresh: boolean) {
  const [sessions, tokens] = await Promise.all([studentApi.aiSessions(), studentApi.aiTokens()]);
  const currentId = fresh ? undefined : (sessionId ?? (sessions[0] ? String(sessions[0].id) : undefined));
  const current = currentId ? await studentApi.aiSession(currentId) : null;
  return { sessions, tokens, current };
}

/**
 * API failures stay on the page with a retry instead of the error page: 429
 * (rate limit) and 5xx or an unreachable API. A 402 has already redirected to
 * /paywall and a 404/403 shown not-found (lib/load.ts); unstable_rethrow lets
 * those, and Next's own signals, through. not in legacy
 */
export async function AiWorkspace({ sessionId, fresh = false }: { sessionId?: string; fresh?: boolean }) {
  let data: Awaited<ReturnType<typeof read>>;
  try {
    data = await read(sessionId, fresh);
  } catch (e) {
    unstable_rethrow(e);
    const status = e instanceof ApiError ? e.status : 0;
    return (
      <>
        <Header />
        <Card>
          <div role="alert" className="py-6 text-center">
            <p className="text-4xl" aria-hidden>🤖</p>
            <p className="mt-2 font-semibold text-brand">
              {status === 429 ? "Too many requests" : "The AI tutor is unavailable right now"}
            </p>
            <p className="mt-1 text-sm text-ink-2">
              {status === 429 ? "Please wait a moment and try again." : "Please try again in a moment."}
            </p>
            <div className="mt-4">
              <RetryButton />
            </div>
          </div>
        </Card>
      </>
    );
  }
  const { sessions, tokens, current } = data;

  return (
    <>
      <Header />
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

function Header() {
  return (
    <PageHeader
      title="AI Tutor"
      subtitle="Ask questions and get step-by-step help."
      action={
        <Link href="/student/ai/new" className={secondaryButtonClass}>
          + New chat
        </Link>
      }
    />
  );
}
