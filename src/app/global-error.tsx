"use client";

import { useEffect } from "react";

/**
 * Last-resort error page, when a root layout itself fails. It replaces the
 * whole document, so the app's stylesheet isn't loaded: brand colours inline
 * (app/(app)/globals.css). not in legacy
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4ece0", color: "#1a0a0c", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", padding: 16 }}>
        <title>Something went wrong · Bodhira</title>
        <main style={{ maxWidth: 420, width: "100%", background: "#fff", borderRadius: 16, padding: 32, textAlign: "center", boxShadow: "0 1px 2px rgba(0,0,0,.06)", border: "1px solid #e8d4b8" }}>
          <p aria-hidden style={{ margin: 0, fontSize: 48, fontWeight: 900, color: "#c49560" }}>500</p>
          <h1 style={{ margin: "12px 0 8px", fontSize: 20, color: "#2a0e13" }}>Something went wrong</h1>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#6b4a38" }}>Please try again in a moment.</p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={() => retry()} style={{ background: "#2a0e13", color: "#fdf4e8", border: 0, borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Try again
            </button>
            {/* A full page load: the router may be what failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ border: "1px solid #e8d4b8", borderRadius: 8, padding: "8px 16px", fontSize: 14, color: "#6b4a38", textDecoration: "none" }}>
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
