"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

const fmt = (n: number) => n.toLocaleString("en-US");

/** "1,980 / 2,000", shown once the text is 80% of the limit. */
export function CharCount({ n, max }: { n: number; max: number }) {
  if (n < max * 0.8) return null;
  return (
    <span aria-live="polite" className={`mt-1 block text-right text-xs tabular-nums ${n >= max ? "font-semibold text-danger" : "text-ink-3"}`}>
      {fmt(n)} / {fmt(max)}
    </span>
  );
}

/**
 * A `<textarea>` with the API's `maxLength` and a small "1,980 / 2,000"
 * counter that appears once it is 80% full. Stays a plain uncontrolled (or
 * controlled, if `value` is passed) textarea, so forms keep working as they
 * did. not in legacy
 */
export function CountedTextarea({ maxLength, onChange, ...props }: ComponentProps<"textarea"> & { maxLength: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [typed, setTyped] = useState(() => String(props.value ?? props.defaultValue ?? "").length);
  const n = props.value !== undefined ? String(props.value).length : typed;

  // A form reset (React resets the fields after a successful action) restores the default value.
  useEffect(() => {
    const form = ref.current?.form;
    const sync = () => setTimeout(() => setTyped(ref.current?.value.length ?? 0));
    form?.addEventListener("reset", sync);
    return () => form?.removeEventListener("reset", sync);
  }, []);

  return (
    <>
      <textarea
        {...props}
        ref={ref}
        maxLength={maxLength}
        onChange={(e) => {
          setTyped(e.target.value.length);
          onChange?.(e);
        }}
      />
      <CharCount n={n} max={maxLength} />
    </>
  );
}
