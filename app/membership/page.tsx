import Link from "next/link";

export const metadata = {
  title: "ILUMINATEES Inner Circle — Yearly Membership",
  description: "Join the Inner Circle. Get 15% off every drop, early access, and exclusive member-only perks.",
};

const PERKS = [
  { icon: "🎽", title: "Buy 1 Get 1 Free", desc: "Buy any tee, get another one free. Once per membership year. Mix sizes, mix designs.", highlight: true },
  { icon: "💸", title: "15% Off Every Order", desc: "Member price on every product, every drop. Stacks on top of sale prices." },
  { icon: "⚡", title: "Early Drop Access", desc: "Get notified 24 hours before public launch. Never miss a limited drop again." },
  { icon: "🚚", title: "Priority Dispatch", desc: "Your orders jump the queue. Dispatched within 12 hours, guaranteed." },
  { icon: "🔁", title: "Free Exchanges", desc: "Wrong size? We swap it free of charge, no questions asked." },
  { icon: "🎁", title: "Birthday Drop", desc: "Exclusive discount on your birthday month. Because you deserve it." },
];

export default function MembershipPage() {
  const memberPrice = 999;

  return (
    <main style={{ minHeight: "100vh", background: "#fff", paddingBottom: "4rem" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0d0d0d 0%, #1a1200 60%, #0d0d0d 100%)",
        padding: "4rem 1.5rem 3rem",
        textAlign: "center",
      }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", letterSpacing: "0.35em", color: "#d4a840", textTransform: "uppercase", marginBottom: 14 }}>
          👑 Exclusive Access
        </div>
        <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(2.2rem, 8vw, 4rem)", color: "#fff", letterSpacing: "0.06em", margin: "0 0 12px" }}>
          INNER CIRCLE
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", maxWidth: 420, margin: "0 auto 28px", lineHeight: 1.7 }}>
          One membership. Every drop. 15% off — always.
        </p>
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontFamily: "Anton, sans-serif", fontSize: "2.8rem", color: "#d4a840", letterSpacing: "0.04em" }}>
            ₹{memberPrice.toLocaleString("en-IN")}
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            per year · cancel anytime
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* CTA */}
        <div style={{ margin: "2rem 0 2.5rem", textAlign: "center" }}>
          <a
            href={`https://wa.me/919760492581?text=${encodeURIComponent("Hi! I want to join the ILUMINATEES Inner Circle membership.")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#d4a840", color: "#0d0d0d",
              fontFamily: "Inter, sans-serif", fontWeight: 700,
              fontSize: "0.82rem", letterSpacing: "0.06em",
              padding: "1rem 2.5rem", borderRadius: 12,
              textDecoration: "none",
            }}
          >
            Join Now — ₹{memberPrice}/yr
          </a>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#bbb", marginTop: 10 }}>
            Online payment coming soon · WhatsApp us to activate instantly
          </div>
        </div>

        {/* Perks grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
          {PERKS.map(({ icon, title, desc, highlight }) => (
            <div key={title} style={{
              border: highlight ? "1.5px solid #d4a840" : "1px solid #eee",
              borderRadius: 14,
              padding: "1.1rem",
              background: highlight ? "#fffbf0" : "#fafafa",
              gridColumn: highlight ? "span 2" : undefined,
            }}>
              {highlight && (
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.48rem", fontWeight: 700, letterSpacing: "0.2em", color: "#a07020", textTransform: "uppercase", marginBottom: 6 }}>
                  ⭐ STAR BENEFIT
                </div>
              )}
              <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: highlight ? "0.78rem" : "0.65rem", color: "#111", marginBottom: 4 }}>{title}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.56rem", color: "#888", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Savings calc */}
        <div style={{ background: "#0d0d0d", borderRadius: 16, overflow: "hidden", marginBottom: 24, color: "#fff" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.2em", color: "#d4a840", textTransform: "uppercase", padding: "1.2rem 1.4rem 0.8rem" }}>
            Break-Even Calculator
          </div>
          {[
            { label: "Buy 1 drop (avg ₹699)", saving: 105, highlight: false },
            { label: "Buy 2 drops", saving: 210, highlight: false },
            { label: "Buy 3 drops", saving: 315, highlight: false },
            { label: "Buy 7 drops — membership pays for itself", saving: 999, highlight: true },
          ].map(({ label, saving, highlight }) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 1.4rem",
              borderTop: "1px solid #1e1e1e",
              background: highlight ? "rgba(212,168,64,0.1)" : "transparent",
            }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: highlight ? "#d4a840" : "rgba(255,255,255,0.6)", fontWeight: highlight ? 700 : 400 }}>{label}</span>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", color: highlight ? "#d4a840" : "#fff", fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>Save ₹{saving}</span>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 24 }}>
          {[
            { q: "When does it start?", a: "Instantly — WhatsApp us to activate your membership right after payment." },
            { q: "Is it auto-renewed?", a: "No. We'll remind you 7 days before it expires. You choose to renew." },
            { q: "Can I cancel?", a: "Yes, anytime. No refunds for the remaining period but we'll never auto-charge you." },
            { q: "How do I use my member price?", a: "Your account gets flagged as a member. The discount applies automatically at checkout." },
          ].map(({ q, a }) => (
            <div key={q} style={{ borderBottom: "1px solid #f0f0f0", padding: "14px 0" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#111", marginBottom: 5 }}>{q}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#777", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/shop" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#aaa", textDecoration: "none" }}>
            ← Back to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
