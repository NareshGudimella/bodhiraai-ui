"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ProgressBar, buttonClass } from "@/components/ui";
import { aiReply, aiStart, type AiResult } from "@/lib/student-actions";
import type { AiMessage, TokenStatus } from "@/lib/student-api";
import { RichText } from "./rich-text";

const STARTERS = [
  "Explain photosynthesis simply",
  "Help me solve a quadratic equation",
  "Newton's laws with examples",
  "How do I write a strong essay intro?",
];

const time = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

export function Chat({
  sessionId,
  initialMessages,
  initialTokens,
}: {
  sessionId: number | null;
  initialMessages: AiMessage[];
  initialTokens: TokenStatus;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [tokens, setTokens] = useState(initialTokens);
  const [draft, setDraft] = useState("");
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; retry: string | null } | null>(null);
  const [pending, startTransition] = useTransition();
  const bottom = useRef<HTMLDivElement>(null);
  const exhausted = tokens.remaining <= 0;

  // Block body on purpose: newer Chrome returns a Promise from scrollIntoView(), and an
  // effect must return nothing or a cleanup function.
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pendingText]);

  function send(text: string) {
    const body = text.trim();
    if (!body || pending || exhausted) return;
    setError(null);
    setDraft("");
    setPendingText(body);
    startTransition(async () => {
      // A failed call (rate limit, 5xx, network) stays inline with the question
      // kept and a retry; a 402 has already redirected to /paywall on the server.
      // not in legacy
      let result: AiResult;
      try {
        result = sessionId ? await aiReply(sessionId, body) : await aiStart(body);
      } catch {
        result = { ok: false, status: 0, message: "The tutor is unavailable right now. Please try again in a moment." };
      }
      setPendingText(null);
      if (!result.ok) {
        const retryable = result.status === 0 || result.status === 429 || result.status >= 500;
        setError({ message: result.message, retry: retryable ? body : null });
        setDraft(body);
        if (result.tokens) setTokens(result.tokens);
        return;
      }
      setMessages((m) => [...m, ...result.messages]);
      setTokens(result.tokens);
      // A new conversation gets its own URL and appears in the list.
      if (!sessionId) router.replace(`/student/ai/${result.sessionId}`);
      else router.refresh();
    });
  }

  return (
    <div className="flex min-h-[60vh] min-w-0 flex-1 flex-col rounded-2xl bg-card shadow-sm ring-1 ring-line">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6" aria-live="polite">
        {messages.length === 0 && !pendingText && (
          <div className="py-8 text-center">
            <p className="text-4xl" aria-hidden>🤖</p>
            <p className="mt-2 font-semibold text-brand">Ask your AI tutor anything</p>
            <p className="text-sm text-ink-2">Concepts, homework steps, or exam revision.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={exhausted}
                  className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-2 hover:bg-primary-light disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} at={time(m.created_at)}>
            {m.role === "assistant" ? <RichText text={m.content} /> : <div className="whitespace-pre-line">{m.content}</div>}
          </Bubble>
        ))}
        {pendingText && (
          <>
            <Bubble role="user" at="">
              <div className="whitespace-pre-line">{pendingText}</div>
            </Bubble>
            <Bubble role="assistant" at="">
              <span className="animate-pulse text-ink-3">Thinking…</span>
            </Bubble>
          </>
        )}
        <div ref={bottom} />
      </div>

      <div className="border-t border-line p-3 sm:p-4">
        {error && (
          <div role="alert" className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">
            <span>{error.message}</span>
            {error.retry && (
              <button
                type="button"
                onClick={() => send(error.retry!)}
                disabled={pending}
                className="rounded-full border border-danger/40 px-3 py-0.5 text-xs font-semibold hover:bg-danger/10 disabled:opacity-50"
              >
                Try again
              </button>
            )}
          </div>
        )}
        {exhausted ? (
          <p className="text-center text-sm font-semibold text-danger">⚡ Daily AI token limit reached. It resets tomorrow.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-end gap-2"
          >
            <label className="sr-only" htmlFor="ai-input">Your question</label>
            <textarea
              id="ai-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              rows={1}
              maxLength={4000}
              placeholder="Type your question…"
              className="max-h-40 min-h-11 flex-1 resize-y rounded-xl border border-line bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button type="submit" disabled={pending || !draft.trim()} className={buttonClass}>
              {pending ? "…" : "Send"}
            </button>
          </form>
        )}
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-ink-3">
            <span>Today&apos;s AI allowance</span>
            <span className={exhausted ? "text-danger" : "text-success"}>
              {tokens.remaining.toLocaleString("en-IN")} left
            </span>
          </div>
          <ProgressBar value={tokens.percent} />
          <p className="mt-1 text-xs text-ink-3">
            {tokens.used.toLocaleString("en-IN")} / {tokens.limit.toLocaleString("en-IN")} used · resets tomorrow
          </p>
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, at, children }: { role: "user" | "assistant"; at: string; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
          mine ? "rounded-br-md bg-brand text-primary-light" : "rounded-bl-md bg-primary-light text-ink"
        }`}
      >
        {children}
        {at && <p className={`mt-1 text-[11px] ${mine ? "text-primary" : "text-ink-3"}`}>{at}</p>}
      </div>
    </div>
  );
}
