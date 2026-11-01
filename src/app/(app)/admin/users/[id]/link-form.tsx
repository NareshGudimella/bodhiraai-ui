"use client";

import { useActionState } from "react";
import { FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { linkUser } from "@/lib/admin-actions";

const sel = `${inputClass} py-1.5 text-sm`;

export function LinkForm({
  userId,
  otherKey,
  options,
}: {
  userId: number;
  otherKey: "student_id" | "parent_id";
  options: { id: number; name: string; grade?: string | null; phone?: string | null }[];
}) {
  const [state, action, pending] = useActionState(linkUser.bind(null, userId, otherKey), undefined);
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className="min-w-48 flex-1 text-xs text-ink-3">
        <span className="mb-1 block">{otherKey === "student_id" ? "Student" : "Parent"}</span>
        <select name={otherKey} className={sel}>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}{o.grade ? ` (Grade ${o.grade})` : ""}{o.phone ? ` · ${o.phone}` : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="w-36 text-xs text-ink-3">
        <span className="mb-1 block">Relation</span>
        <input name="relation" maxLength={20} placeholder="mother, father…" className={sel} />
      </label>
      <button disabled={pending} className={buttonClass}>Link</button>
      <div className="w-full empty:hidden"><FormMessage state={state} /></div>
    </form>
  );
}
