"use client";

import { useActionState } from "react";
import { Card, Pill, buttonClass, secondaryButtonClass } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { toggleSyllabus } from "@/lib/admin-actions";

export function SyllabusToggle({
  syllabus: s,
  subscribed,
  index,
}: {
  syllabus: { id: number; board: string; grade: string; name: string; description: string | null; subjects_count: number };
  subscribed: boolean;
  index: number;
}) {
  const [state, action, pending] = useActionState(toggleSyllabus.bind(null, s.id), undefined);
  return (
    <Card className="ccard flex h-full flex-col gap-2 p-4" style={cardTone(index)}>
      <p className="flex items-start justify-between gap-2">
        <span className="font-semibold text-brand">{s.name}</span>
        <Pill tone={subscribed ? "success" : "neutral"}>{subscribed ? "Subscribed" : "Not subscribed"}</Pill>
      </p>
      <p className="text-xs text-ink-2">{s.board.replace(/_/g, " ")} · Grade {s.grade}</p>
      <p className="text-xs text-ink-2">📚 {s.subjects_count} {s.subjects_count === 1 ? "subject" : "subjects"}</p>
      {s.description && <p className="text-xs text-ink-3">{s.description}</p>}
      <form action={action} className="mt-auto pt-2">
        <button disabled={pending} className={subscribed ? secondaryButtonClass : buttonClass}>
          {subscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      </form>
      {state?.message && <p role="status" className={`text-xs ${state.ok ? "text-ink-2" : "text-danger"}`}>{state.message}</p>}
    </Card>
  );
}
