import Link from "next/link";

interface Props {
  title: string;
  updated: string;
  children: [string, string][];
}

export function PolicyPage({ title, updated, children }: Props) {
  return (
    <div style={{ minHeight: "80vh", background: "#fff" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)", letterSpacing: "0.04em", textTransform: "uppercase", color: "#111", marginBottom: 6 }}>
          {title}
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#aaa", marginBottom: 32 }}>
          Last updated: {updated}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {children.map(([heading, body]) => (
            <section key={heading}>
              <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#111", marginBottom: 8 }}>{heading}</h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#555", lineHeight: 1.9 }}>{body}</p>
            </section>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <Link href="/shop" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#888", textDecoration: "underline" }}>
            ← Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}
