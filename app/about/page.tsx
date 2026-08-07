import Link from "next/link";

export const metadata = { title: "About Us — ILUMINATEES" };

export default function AboutPage() {
  return (
    <div style={{ minHeight: "80vh", background: "#fff" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.4em", color: "#aaa", textTransform: "uppercase", marginBottom: 10 }}>
          THE STORY
        </div>
        <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "0.04em", textTransform: "uppercase", color: "#111", marginBottom: 8 }}>
          About <span style={{ color: "#e8000d" }}>ILUMINATEES</span>
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#888", marginBottom: 36 }}>
          Not Made To Fit In. Built To Be Remembered.
        </p>

        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#333", lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 18 }}>
          <p>
            ILUMINATEES is an Indian streetwear label built around one idea — every tee is a document.
            Sacred geometry, cipher script, samurai lore and ancient symbols, hand-etched onto 240 GSM
            heavyweight cotton that outlasts trends.
          </p>
          <p>
            We drop in limited runs. The vault doesn&apos;t restock — once a drop sells out, it&apos;s classified.
            No overseas white-labelling: every piece is designed, quality-checked and shipped from India.
          </p>
          <p>
            Oversized drop-shoulder cuts, pre-shrunk fabric, reactive dye prints that don&apos;t fade.
            What you buy is what stays.
          </p>
        </div>

        {/* Founder */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, border: "1px solid #eee", borderRadius: 16, padding: "1.3rem 1.4rem", marginTop: 36 }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Anton, sans-serif", fontSize: "1.1rem", flexShrink: 0 }}>
            AM
          </div>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.3em", color: "#aaa", textTransform: "uppercase", marginBottom: 4 }}>
              FOUNDER
            </div>
            <div style={{ fontFamily: "Anton, sans-serif", fontSize: "1.15rem", letterSpacing: "0.04em", color: "#111" }}>
              Aman Mudgal
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#888", marginTop: 3 }}>
              Building ILUMINATEES from India — one limited drop at a time.
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, margin: "40px 0" }}>
          {[
            { n: "5,000+", l: "Initiates" },
            { n: "240 GSM", l: "Heavyweight Cotton" },
            { n: "100%", l: "Made In India" },
            { n: "0", l: "Restocks. Ever." },
          ].map(({ n, l }) => (
            <div key={l} style={{ border: "1px solid #eee", borderRadius: 14, padding: "1.2rem 1rem", textAlign: "center" }}>
              <div style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem", color: "#111" }}>{n}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.56rem", color: "#999", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
            </div>
          ))}
        </div>

        <Link href="/shop" style={{ display: "inline-block", background: "#111", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "0.85rem 2rem", borderRadius: 24, textDecoration: "none" }}>
          Enter The Vault →
        </Link>
      </div>
    </div>
  );
}
