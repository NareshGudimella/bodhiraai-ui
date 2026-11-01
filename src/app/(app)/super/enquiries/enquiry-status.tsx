"use client";

import { useActionState } from "react";
import { setEnquiryStatus } from "@/lib/super-actions";

const STATUSES = ["new", "contacted", "enrolled", "closed"];

/** Status select that saves on change. */
export function EnquiryStatus({ id, status }: { id: number; status: string }) {
  const [state, action, pending] = useActionState(setEnquiryStatus.bind(null, id), undefined);
  return (
    <form action={action} className="flex items-center gap-2">
      <label className="sr-only" htmlFor={`enq-${id}`}>Status</label>
      <select
        id={`enq-${id}`}
        name="status"
        defaultValue={status}
        disabled={pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-line bg-card px-2 py-1 text-sm capitalize"
      >
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {state?.ok === false && <span className="text-xs text-danger">{state.message}</span>}
    </form>
  );
}
