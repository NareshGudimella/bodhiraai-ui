/** Legacy errors/404.blade.php, inside the site's header and footer. */
export default function SiteNotFound() {
  return (
    <section style={{ background: "linear-gradient(135deg, #1A0A0C, #2A0E13 50%, #3D1520)", padding: "96px 24px", display: "grid", placeItems: "center" }}>
      <div style={{ maxWidth: 540, width: "100%", background: "#fff", borderRadius: 22, padding: "48px 36px", textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,.4)" }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🧭</div>
        <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 96, fontWeight: 900, lineHeight: 1, color: "#C49560", letterSpacing: "-0.04em", marginBottom: 8 }}>404</div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: 24, fontWeight: 800, color: "#1A0A0C", marginBottom: 12 }}>We couldn&apos;t find that page</h1>
        <p style={{ fontSize: 15, color: "#6B4A38", lineHeight: 1.6, marginBottom: 28 }}>The link you followed may be broken, or the page may have been moved.</p>
        <a className="ed-primary-btn" href="/">← Back to home</a>
      </div>
    </section>
  );
}
