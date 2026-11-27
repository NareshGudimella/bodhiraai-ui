"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { PasswordInput } from "@/components/auth/auth-fields";
import { PASSWORD_CHECKS, PASSWORD_RE, newPasswordProps } from "@/lib/input-limits";

/**
 * A new-password field with a live checklist (6+ characters, uppercase,
 * lowercase, digit, symbol). Submit is blocked (custom validity) until every
 * rule is met; an empty optional field passes. Not for sign-in: existing
 * passwords must still work. `auth` uses the sign-in pages' toggle input.
 * not in legacy
 */
export function NewPasswordInput({ auth, ...props }: Omit<ComponentProps<"input">, "type"> & { auth?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const met = PASSWORD_CHECKS.map(([, ok]) => ok(value));
  const valid = PASSWORD_RE.test(value);
  const blocked = (value !== "" || !!props.required) && !valid;

  useEffect(() => {
    ref.current?.setCustomValidity(blocked ? "Use 6 or more characters with an uppercase letter, a lowercase letter, a digit and a symbol." : "");
  }, [blocked]);

  // React resets the fields after a form action; follow it.
  useEffect(() => {
    const form = ref.current?.form;
    const sync = () => setTimeout(() => setValue(ref.current?.value ?? ""));
    form?.addEventListener("reset", sync);
    return () => form?.removeEventListener("reset", sync);
  }, []);

  const shared = {
    ...newPasswordProps(),
    ...props,
    ref,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    },
  };
  return (
    <>
      {auth ? (
        <PasswordInput {...shared} id={props.id ?? ""} />
      ) : (
        <input {...shared} type="password" className={props.className} />
      )}
      {(value !== "" || props.required) && (
        <ul aria-label="Password requirements" className="mt-1.5 grid gap-0.5 text-xs">
          {PASSWORD_CHECKS.map(([label], i) => (
            <li key={label} className={met[i] ? "text-success" : "text-ink-3"}>
              <span aria-hidden="true">{met[i] ? "✓ " : "○ "}</span>
              {label}
              <span className="sr-only">{met[i] ? " (met)" : " (not met)"}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
