import { Fragment } from "react";

/**
 * Assistant text as the legacy chat rendered it: escaped text, line breaks
 * kept, and **bold** spans (within a line). No HTML is ever injected.
 */
export function RichText({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-line">
      {text.split(/(\*\*[^\n]+?\*\*)/g).map((part, i) =>
        /^\*\*[^\n]+\*\*$/.test(part) ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </div>
  );
}
