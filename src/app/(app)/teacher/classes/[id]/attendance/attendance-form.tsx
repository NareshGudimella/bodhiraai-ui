"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { FormMessage, inputClass } from "@/components/form";
import { Card, buttonClass, secondaryButtonClass } from "@/components/ui";
import { saveAttendance } from "@/lib/teacher-actions";
import type { AttendanceSheet } from "@/lib/teacher-api";

const STATUSES = [
  { value: "present", label: "Present", short: "P" },
  { value: "absent", label: "Absent", short: "A" },
  { value: "late", label: "Late", short: "L" },
  { value: "excused", label: "Excused", short: "E" },
];

export function AttendanceForm({ classId, sheet }: { classId: number; sheet: AttendanceSheet }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveAttendance.bind(null, classId), undefined);
  const [marks, setMarks] = useState<Record<number, string>>(
    Object.fromEntries(sheet.records.map((r) => [r.student_id, r.status ?? ""])),
  );
  const markAll = (value: string) => setMarks(Object.fromEntries(sheet.records.map((r) => [r.student_id, value])));

  return (
    <form action={action} className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-ink-2">Date</span>
          <input
            type="date"
            name="date"
            defaultValue={sheet.date}
            onChange={(e) => e.target.value && router.push(`?date=${e.target.value}`)}
            className={inputClass}
          />
        </label>
        <button type="button" onClick={() => markAll("present")} className={secondaryButtonClass}>
          Mark all present
        </button>
        <button type="button" onClick={() => markAll("absent")} className={secondaryButtonClass}>
          Mark all absent
        </button>
      </div>
      <Card className="divide-y divide-line p-0">
        {sheet.records.map((r) => (
          // Each student is a labelled radio group ("Attendance for <name>"), and the
          // P/A/L/E chips show a focus ring for keyboard users. not in legacy
          <fieldset key={r.student_id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
            <legend className="sr-only">Attendance for {r.name}{r.roll_no ? `, roll ${r.roll_no}` : ""}</legend>
            <span className="min-w-0 text-sm" aria-hidden>
              <span className="mr-2 text-ink-3">{r.roll_no ?? "—"}</span>
              <span className="font-medium text-ink">{r.name}</span>
            </span>
            <span role="radiogroup" aria-label={`Attendance for ${r.name}`} className="flex gap-1">
              {STATUSES.map((s) => (
                <label
                  key={s.value}
                  title={s.label}
                  className="cursor-pointer rounded-md border border-line px-2.5 py-1 text-xs font-semibold text-ink-2 has-checked:border-brand has-checked:bg-brand has-checked:text-primary-light has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={`status[${r.student_id}]`}
                    value={s.value}
                    checked={marks[r.student_id] === s.value}
                    onChange={() => setMarks((m) => ({ ...m, [r.student_id]: s.value }))}
                  />
                  <span aria-hidden>{s.short}</span>
                  <span className="sr-only">{s.label}</span>
                </label>
              ))}
            </span>
          </fieldset>
        ))}
      </Card>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Saving…" : "Save attendance"}
      </button>
    </form>
  );
}
