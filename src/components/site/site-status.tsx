import type { CSSProperties } from "react";
import { connection } from "next/server";
import { getSiteFlash } from "@/lib/site-flash";
import { FlashClear } from "./flash-clear";

async function Status({ name, className, style }: { name: string; className?: string; style?: CSSProperties }) {
  await connection();
  const msg = (await getSiteFlash()).messages?.[name];
  return msg ? (
    <>
      <p className={className} style={style}>{msg}</p>
      <FlashClear />
    </>
  ) : null;
}

/** `@if(session('<name>'))<p>…</p>@endif`: the status a form action flashed before redirecting back. */
export function SiteStatus(props: { name: string; className?: string; style?: CSSProperties }) {
  return <Status {...props} />;
}
