"use client";

import { useState } from "react";
import Link from "next/link";

const COL1 = [
  { href: "/shop", label: "All Products"  },
  { href: "/shop", label: "New Drops"     },
  { href: "/shop", label: "Sale"          },
];

const COL2 = [
  { href: "/product/the-katana",        label: "the KATANA"         },
  { href: "/product/the-black-samurai", label: "The Black. Samurai" },
  { href: "/product/the-bankai",        label: "The Bankai"         },
  { href: "/product/the-sakura",        label: "The Sakura"         },
  { href: "/shop",                      label: "View All →"         },
];

const COL3 = [
  { href: "/about",    label: "About Us"           },
  { href: "/contact",  label: "Contact Us"         },
  { href: "/track",    label: "Track Order"        },
  { href: "/returns",  label: "Returns & Exchange" },
  { href: "/shipping", label: "Shipping Policy"    },
  { href: "/terms",    label: "Terms & Conditions" },
  { href: "/privacy",  label: "Privacy Policy"     },
];

const LINK_STYLE = {
  fontFamily: "Inter, sans-serif",
  fontSize: "0.68rem",
  color: "rgba(255,255,255,0.45)",
  textDecoration: "none",
  display: "block",
  marginBottom: 10,
  transition: "color 0.2s",
} as const;

const HEAD_STYLE = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 700,
  fontSize: "0.58rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "#fff",
  marginBottom: 18,
};

export function Footer() {
  const [nlEmail, setNlEmail] = useState("");
  const [nlDone, setNlDone] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const clean = nlEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });
      if (res.ok) setNlDone(true);
    } catch {}
  }

  return (
    <footer style={{ background: "#0d0d0d", borderTop: "1px solid #1a1a1a" }}>

      {/* ── Main columns ──────────────────────────── */}
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "3rem 1.5rem 2rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "2rem",
      }}>

        {/* Logo + tagline */}
        <div style={{ gridColumn: "span 1" }}>
          <div style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "1.1rem", letterSpacing: "0.18em",
            color: "#fff", marginBottom: 12,
          }}>
            ILUMINATEES<span style={{ color: "#e8000d", fontSize: "0.5em" }}>®</span>
          </div>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.6rem", color: "rgba(255,255,255,0.35)",
            lineHeight: 1.8, marginBottom: 16,
          }}>
            Secret society streetwear.<br />
            Limited drops. Heavyweight cotton.<br />
            Symbols older than your civilization.
          </p>
          <p style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.42rem", letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.2)",
          }}>
            EST. MMXXVI · INDIA
          </p>
        </div>

        {/* Col 1 — Collections */}
        <div>
          <div style={HEAD_STYLE}>COLLECTIONS</div>
          {COL1.map(({ href, label }) => (
            <Link key={label} href={href} style={LINK_STYLE}
              className="footer-link">{label}</Link>
          ))}
        </div>

        {/* Col 2 — Top Drops */}
        <div>
          <div style={HEAD_STYLE}>TOP DROPS</div>
          {COL2.map(({ href, label }) => (
            <Link key={label} href={href} style={LINK_STYLE}
              className="footer-link">{label}</Link>
          ))}
        </div>

        {/* Col 3 — Know More */}
        <div>
          <div style={HEAD_STYLE}>KNOW MORE</div>
          {COL3.map(({ href, label }) => (
            <Link key={label} href={href} style={LINK_STYLE}
              className="footer-link">{label}</Link>
          ))}
        </div>

        {/* Col 4 — Contact */}
        <div>
          <div style={HEAD_STYLE}>CONTACT US</div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: 14 }}>
            Monday to Saturday<br />
            10:30am to 7:00pm
          </p>
          <a href="https://wa.me/917055470321" style={{ ...LINK_STYLE, color: "rgba(255,255,255,0.55)" }}>
            📱 WhatsApp Support
          </a>
          <a href="mailto:help@iluminatees.com" style={{ ...LINK_STYLE, color: "rgba(255,255,255,0.55)" }}>
            ✉ help@iluminatees.com
          </a>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.8 }}>
            Made in India.<br />Shipped Pan-India.
          </p>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────── */}
      <div style={{ height: 1, background: "#1e1e1e", margin: "0 1.5rem" }} />

      {/* ── Bottom bar ────────────────────────────── */}
      <div className="footer-bottom" style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "1.4rem 1.5rem",
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between",
        gap: "1.2rem",
      }}>

        {/* Tagline */}
        <div style={{
          fontFamily: "Space Mono, monospace",
          fontSize: "0.48rem", letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
        }}>
          NOT MADE TO FIT IN. BUILT TO BE REMEMBERED.
        </div>

        {/* Newsletter */}
        <div>
          <div style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700,
            fontSize: "0.5rem", letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
            marginBottom: 10,
          }}>
            SUBSCRIBE TO OUR NEWSLETTER
          </div>
          {nlDone ? (
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#4ade80", fontWeight: 600 }}>
              ✓ You&apos;re in — welcome to the inner circle.
            </div>
          ) : (
            <form
              onSubmit={subscribe}
              className="footer-newsletter-form"
              style={{ display: "flex", gap: 0 }}
            >
              <input
                type="email"
                value={nlEmail}
                onChange={e => setNlEmail(e.target.value)}
                placeholder="Enter your email address"
                className="footer-newsletter-input"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.62rem", color: "#fff",
                  background: "#1a1a1a", border: "1px solid #2a2a2a",
                  borderRight: "none",
                  padding: "0.55rem 0.9rem",
                  outline: "none", width: "100%", maxWidth: 220,
                  borderRadius: "6px 0 0 6px",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#fff", color: "#111",
                  border: "none", padding: "0.55rem 0.9rem",
                  cursor: "pointer", fontWeight: 700,
                  fontSize: "0.72rem",
                  borderRadius: "0 6px 6px 0",
                }}
              >
                →
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Copyright ─────────────────────────────── */}
      <div style={{
        borderTop: "1px solid #1a1a1a",
        padding: "1rem 1.5rem",
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        fontSize: "0.52rem",
        color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.05em",
      }}>
        © 2026 ILUMINATEES — All Rights Reserved · All Truths Encrypted
      </div>

      <style>{`
        .footer-link:hover { color: rgba(255,255,255,0.85) !important; }
        .footer-social:hover { color: rgba(255,255,255,0.8) !important; }
      `}</style>
    </footer>
  );
}
