"use client";

import { useActionState, useState, useTransition } from "react";
import { Field, FormMessage, FormSection, inputClass } from "@/components/form";
import { Pill, buttonClass, secondaryButtonClass } from "@/components/ui";
import type { IntegrationField, INTEGRATIONS } from "@/lib/integrations-spec";
import type { IntegrationItem } from "@/lib/super-api";
import { clearIntegrationSecret, saveIntegration, testIntegration } from "@/lib/super-actions";
import type { FormState } from "@/lib/action-result";
import { digitsOnly, phoneProps } from "@/lib/input-limits";

type Spec = (typeof INTEGRATIONS)[keyof typeof INTEGRATIONS];

function SecretInput({ provider, f, isSet, error }: { provider: string; f: IntegrationField; isSet: boolean; error?: string[] }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<FormState>();
  return (
    <div>
      <Field label={f.label} error={error} hint="Leave blank to keep the saved value">
        <input name={f.name} type="password" maxLength={f.maxLength ?? 500} autoComplete="new-password" className={inputClass} />
      </Field>
      <span className="mt-1 flex items-center gap-3 text-xs">
        <span className={`font-medium ${isSet ? "text-success" : "text-ink-3"}`}>{isSet ? "Saved" : "Not set"}</span>
        {isSet && (
          <button
            type="button"
            disabled={pending}
            className="text-danger hover:underline"
            onClick={() => {
              if (!confirm(`Clear ${f.label}?`)) return;
              start(async () => setResult(await clearIntegrationSecret(provider, f.name)));
            }}
          >
            {pending ? "Clearing…" : "Clear"}
          </button>
        )}
        {result && !result.ok && <span className="text-danger">{result.message}</span>}
      </span>
    </div>
  );
}

export function IntegrationCard({ provider, spec, item }: { provider: string; spec: Spec; item: IntegrationItem }) {
  const [state, action, pending] = useActionState(saveIntegration.bind(null, provider), undefined);
  const [test, testAction, testing] = useActionState(testIntegration.bind(null, provider), undefined);
  const e = state?.errors ?? {};
  const str = (n: string) => String(state?.values?.[n] ?? item.values[n] ?? "");
  const [gateway, setGateway] = useState(str("gateway") || "none");
  const fields = spec.fields.filter((f) => !f.gateway || f.gateway === gateway);
  const key = JSON.stringify([item.updated_at, state?.values]);

  return (
    <FormSection
      title={spec.title}
      description={spec.blurb}
      aside={
        <div className="sm:text-right">
          <Pill tone={item.configured ? "success" : "neutral"}>{item.configured ? "Configured" : "Not configured"}</Pill>
          <p className="mt-1 text-xs text-ink-3">
            {item.updated_at ? `Updated ${new Date(item.updated_at).toLocaleString("en-IN")}` : "Never updated"}
          </p>
        </div>
      }
    >
      <form action={action} className="space-y-4" key={key}>
        <div className="grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
          {fields.map((f) => {
            if (f.kind === "secret")
              return <SecretInput key={f.name} provider={provider} f={f} isSet={!!item.secrets[f.name]} error={e[f.name]} />;
            if (f.kind === "bool")
              return (
                <Field key={f.name} label={f.label} error={e[f.name]}>
                  <input type="hidden" name={f.name} value="0" />
                  <input
                    type="checkbox"
                    name={f.name}
                    value="1"
                    defaultChecked={state?.values ? state.values[f.name] === "1" : item.values[f.name] === true}
                    className="size-4 accent-primary"
                  />
                </Field>
              );
            if (f.kind === "select")
              return (
                <Field key={f.name} label={f.label} error={e[f.name]}>
                  <select name={f.name} value={gateway} onChange={(ev) => setGateway(ev.target.value)} className={inputClass}>
                    {f.options?.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </Field>
              );
            return (
              <Field key={f.name} label={f.label} error={e[f.name]} hint={f.hint}>
                <input
                  name={f.name}
                  type={f.kind === "int" ? "number" : f.kind === "url" ? "url" : "text"}
                  inputMode={f.kind === "int" ? "numeric" : f.kind === "url" ? "url" : undefined}
                  min={f.min}
                  max={f.max}
                  step={f.kind === "int" ? 1 : undefined}
                  maxLength={f.maxLength}
                  pattern={f.pattern}
                  title={f.pattern ? "Letters, digits and the characters the provider allows only" : undefined}
                  placeholder={f.placeholder}
                  autoComplete="off"
                  defaultValue={str(f.name)}
                  className={inputClass}
                />
              </Field>
            );
          })}
        </div>
        <FormMessage state={state} />
        <div className="flex justify-end border-t border-line pt-4">
          <button disabled={pending} className={buttonClass}>
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
      {spec.test && (
        <form action={testAction} className="mt-5 space-y-3 rounded-lg bg-page/60 p-4 ring-1 ring-line">
          {provider === "sms" && (
            <Field label="Phone number" error={test?.errors?.phone} hint="10-digit mobile number. Uses the saved settings (save first)">
              <input name="phone" {...phoneProps()} onInput={digitsOnly} required defaultValue={test?.values?.phone} className={inputClass} />
            </Field>
          )}
          <FormMessage state={test} />
          <button disabled={testing} className={secondaryButtonClass}>
            {testing ? "Testing…" : spec.test}
          </button>
        </form>
      )}
    </FormSection>
  );
}
