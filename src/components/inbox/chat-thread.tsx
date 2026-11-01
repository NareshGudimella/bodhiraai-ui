"use client";

import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { buttonClass } from "@/components/ui";
import { sendChatMessage } from "@/lib/inbox-actions";
import type { ChatMessage } from "@/lib/inbox-api";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayKey = (d: Date) => Math.floor(d.getTime() / 86_400_000);

/** Legacy chat day divider: Today, Yesterday, else "June 19, 2026" (UTC, like the API's `time`). */
function dayLabel(iso: string | null, now = new Date()): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const diff = dayKey(now) - dayKey(d);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}, ${d.getUTCFullYear()}`;
}

export function ChatThread({
  conversationId,
  initial,
  labels = { placeholder: "Type a message…", send: "Send" },
}: {
  conversationId: number;
  initial: ChatMessage[];
  /** Composer text, translated by the server page. */
  labels?: { placeholder: string; send: string };
}) {
  const [messages, setMessages] = useState(initial);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  function send() {
    const body = draft.trim();
    if (!body || pending) return;
    setError(null);
    startTransition(async () => {
      const r = await sendChatMessage(conversationId, body);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setDraft("");
      setMessages((m) => [...m, r.message]);
    });
  }

  return (
    <div className="flex min-h-[60vh] flex-col rounded-2xl bg-card shadow-sm ring-1 ring-line">
      <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6" aria-live="polite">
        {messages.length === 0 && <p className="py-8 text-center text-sm text-ink-3">Say hello 👋</p>}
        {messages.map((m, i) => {
          const day = dayLabel(m.created_at);
          const prev = messages[i - 1];
          const showDay = day !== null && (!prev || dayLabel(prev.created_at) !== day);
          return (
          <Fragment key={m.id}>
            {showDay && (
              <p className="flex justify-center">
                <span className="rounded-full bg-primary-light px-3 py-0.5 text-[11px] font-medium text-ink-3">{day}</span>
              </p>
            )}
          <div className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.mine ? "rounded-br-md bg-brand text-primary-light" : "rounded-bl-md bg-primary-light text-ink"
              }`}
            >
              <p className="whitespace-pre-line">{m.body}</p>
              <p className={`mt-1 text-[11px] ${m.mine ? "text-primary" : "text-ink-3"}`}>
                {m.time}
                {m.mine && (m.read ? " ✓✓" : " ✓")}
              </p>
            </div>
          </div>
          </Fragment>
          );
        })}
        <div ref={bottom} />
      </div>
      <form
        className="flex items-end gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <textarea
          id="chat-input"
          rows={1}
          maxLength={5000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={labels.placeholder}
          className="max-h-40 min-h-11 flex-1 resize-y rounded-xl border border-line bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <button type="submit" className={buttonClass} disabled={pending || !draft.trim()}>
          {pending ? "…" : labels.send}
        </button>
      </form>
      {error && <p role="alert" className="px-4 pb-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
