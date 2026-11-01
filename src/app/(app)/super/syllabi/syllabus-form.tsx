"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { saveSyllabus } from "@/lib/super-actions";
import { BOARDS, boardLabel } from "@/lib/boards";

type Values = Partial<Record<"board" | "grade" | "name" | "description" | "sort_order" | "is_active", string>>;

export function SyllabusForm({ id, initial = {} }: { id?: number; initial?: Values }) {
  const [state, action, pending] = useActionState(saveSyllabus.bind(null, id ?? null), undefined);
  const e = state?.errors ?? {};
  const v: Values = { ...initial, ...state?.values };
  return (
    <form action={action} className="space-y-3" key={JSON.stringify(v)}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Board" error={e.board}>
          <select name="board" required defaultValue={v.board ?? BOARDS[0]} className={inputClass}>
            {/* a board outside the legacy list (created via the API) stays selectable */}
            {v.board && !(BOARDS as readonly string[]).includes(v.board) && <option value={v.board}>{boardLabel(v.board)}</option>}
            {BOARDS.map((b) => <option key={b} value={b}>{boardLabel(b)}</option>)}
          </select>
        </Field>
        <Field label="Grade" error={e.grade}><input name="grade" required maxLength={10} defaultValue={v.grade} className={inputClass} /></Field>
      </div>
      <Field label="Name" error={e.name}><input name="name" required maxLength={120} defaultValue={v.name} className={inputClass} /></Field>
      <Field label="Description" error={e.description}><textarea name="description" rows={2} defaultValue={v.description} className={inputClass} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sort order" error={e.sort_order}>
          <input name="sort_order" type="number" min={0} max={9999} required defaultValue={v.sort_order ?? "0"} className={inputClass} />
        </Field>
        <Field label="Status" error={e.is_active}>
          <select name="is_active" defaultValue={v.is_active ?? "1"} className={inputClass}>
            <option value="1">Active (visible to schools &amp; students)</option>
            <option value="0">Inactive (hidden)</option>
          </select>
        </Field>
      </div>
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>{pending ? "Saving…" : id ? "Save syllabus" : "Create syllabus"}</button>
    </form>
  );
}
