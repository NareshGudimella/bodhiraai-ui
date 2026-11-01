"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { createSchool, updateSchool } from "@/lib/super-actions";

type Key =
  | "name" | "code" | "email" | "phone" | "city" | "state" | "country" | "plan" | "plan_expires_at"
  | "max_teachers" | "max_students" | "ai_daily_token_limit";
type Values = Partial<Record<Key, string | number | null>>;
type SyllabusOption = { id: number; board: string; grade: string; name: string };

/** Legacy super/school-form: details, plan, limits, syllabi and the logo (its colours become the school theme). */
export function SchoolForm({
  schoolId,
  direct = false,
  initial = {},
  plans,
  prices,
  syllabi,
  selected = [],
  logo,
}: {
  schoolId?: number;
  /**
   * Bodhira Direct: no plan or seat-limit fields (left out of the post, so the
   * API keeps them unchanged). not in legacy
   */
  direct?: boolean;
  initial?: Values;
  plans: readonly string[];
  /** Monthly ₹ per plan, from the API. */
  prices: Record<string, number>;
  syllabi: SyllabusOption[];
  selected?: number[];
  logo?: string | null;
}) {
  const [state, action, pending] = useActionState(schoolId ? updateSchool.bind(null, schoolId) : createSchool, undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const e = state?.errors ?? {};
  const v: Values = { ...initial, ...state?.values };
  const syllabusError = Object.entries(e).find(([k]) => k.startsWith("syllabi"))?.[1];
  const text = (name: Key, label: string, max: number, type = "text") => (
    <Field label={label} error={e[name]}>
      <input name={name} type={type} maxLength={max} defaultValue={v[name] ?? ""} required={name === "name"} className={inputClass} />
    </Field>
  );
  const num = (name: Key, label: string, max: number, fallback: number) => (
    <Field label={label} error={e[name]}>
      <input name={name} type="number" min={0} max={max} defaultValue={v[name] ?? fallback} className={inputClass} />
    </Field>
  );
  const boards = Map.groupBy(syllabi, (s) => s.board);
  const shown = preview ?? logo ?? null;
  return (
    <form action={action} className="space-y-3" key={JSON.stringify(state ?? null)}>
      {text("name", "School name", 160)}
      <div className="grid gap-3 sm:grid-cols-2">
        {!schoolId && (
          <Field label="Code" error={e.code} hint="Leave blank to generate one">
            <input name="code" maxLength={20} defaultValue={v.code ?? ""} className={inputClass} />
          </Field>
        )}
        {text("email", "Email", 160, "email")}
        {text("phone", "Phone", 20, "tel")}
        {text("city", "City", 80)}
        {text("state", "State", 80)}
        {text("country", "Country", 80)}
        {!direct && (
          <>
            <Field label="Plan" error={e.plan}>
              <select name="plan" defaultValue={v.plan || "free"} className={inputClass}>
                {plans.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)} — {prices[p] ? `₹${prices[p].toLocaleString("en-IN")}/mo` : "Free"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Plan expires" error={e.plan_expires_at}>
              <input name="plan_expires_at" type="date" defaultValue={String(v.plan_expires_at ?? "").slice(0, 10)} className={inputClass} />
            </Field>
          </>
        )}
      </div>
      <div className="grid grid-cols-3 items-end gap-3">
        {!direct && (
          <>
            {num("max_teachers", "Max teachers", 100000, 10)}
            {num("max_students", "Max students", 1000000, 500)}
          </>
        )}
        {num("ai_daily_token_limit", "AI tokens / day", 10000000, 5000)}
      </div>
      {!!syllabi.length && (
        <fieldset>
          <legend className="mb-1 text-sm font-medium text-ink-2">Syllabi</legend>
          <div className="space-y-2 rounded-xl bg-page p-3 ring-1 ring-line">
            {[...boards].map(([board, list]) => (
              <div key={board}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-3">{board.replace(/_/g, " ")}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {list.map((s) => (
                    <label key={s.id} className="flex items-center gap-1.5 text-sm text-ink-2">
                      <input type="checkbox" name="syllabi[]" value={s.id} defaultChecked={selected.includes(s.id)} /> Grade {s.grade}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {syllabusError?.[0] && <p className="mt-1 text-xs text-danger">{syllabusError[0]}</p>}
        </fieldset>
      )}
      <Field label="Logo" error={e.logo} hint="PNG, JPG, WebP or GIF up to 5 MB. Its colours become the school's theme.">
        <span className="flex items-center gap-3">
          {shown && (
            // eslint-disable-next-line @next/next/no-img-element -- stored media or a local preview
            <img src={shown} alt="" className="size-12 rounded-lg bg-card object-contain ring-1 ring-line" />
          )}
          <input
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(ev) => {
              const f = ev.target.files?.[0];
              setPreview(f?.type.startsWith("image/") ? URL.createObjectURL(f) : null);
            }}
            className="block w-full text-sm"
          />
        </span>
      </Field>
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>{pending ? "Saving…" : schoolId ? "Save changes" : "Create school"}</button>
    </form>
  );
}
