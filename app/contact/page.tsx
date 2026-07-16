import Link from "next/link";

export const metadata = { title: "Contact Us — ILUMINATEES" };

export default function ContactPage() {
  return (
    <div style={{ minHeight: "80vh", background: "#fff" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.4em", color: "#aaa", textTransform: "uppercase", marginBottom: 10 }}>
          REACH THE VAULT
        </div>
        <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "0.04em", textTransform: "uppercase", color: "#111", marginBottom: 8 }}>
          Contact <span style={{ color: "#e8000d" }}>Us</span>
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#888", marginBottom: 36 }}>
          Order help, size exchange, ya kuch bhi — we reply fast.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "💬", title: "WhatsApp", desc: "Fastest — order status, exchange, anything", href: "https://wa.me/917055470321", cta: "Chat on WhatsApp" },
            { icon: "✉️", title: "Email", desc: "support@iluminatees.in — replies within 24 hrs", href: "mailto:support@iluminatees.in", cta: "Send Email" },
            { icon: "📞", title: "Call / SMS", desc: "+91 70554 70321 (11 AM – 7 PM, Mon–Sat)", href: "tel:+917055470321", cta: "Call Now" },
          ].map(({ icon, title, desc, href, cta }) => (
            <div key={title} style={{ display: "flex", alignItems: "center", gap: 16, border: "1px solid #eee", borderRadius: 14, padding: "1.1rem 1.2rem" }}>
              <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.74rem", color: "#111" }}>{title}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#888", marginTop: 3 }}>{desc}</div>
              </div>
              <a href={href} style={{ flexShrink: 0, background: "#111", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.6rem 1.1rem", borderRadius: 20, textDecoration: "none" }}>
                {cta}
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, background: "#fafafa", border: "1px solid #eee", borderRadius: 14, padding: "1.2rem 1.4rem" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.64rem", color: "#111", marginBottom: 6 }}>Exchange & Returns</div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#777", lineHeight: 1.8 }}>
            Size exchange available on every drop — WhatsApp us within 7 days of delivery with your order ID.
            Shipping Pan-India in 3–5 business days.
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          <Link href="/shop" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#888", textDecoration: "underline" }}>
            ← Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}
