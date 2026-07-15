"use client";

import Link from "next/link";

const COL1 = [
  { href: "/shop",               label: "Limited Drops"     },
  { href: "/shop",               label: "New Arrivals"      },
  { href: "/shop?filter=bestseller", label: "Bestsellers"   },
  { href: "/shop?cat=APEX",     label: "APEX Collection"    },
  { href: "/shop?cat=SACRED",   label: "Sacred Series"      },
  { href: "/shop?cat=CIPHER",   label: "Cipher Series"      },
  { href: "/shop?filter=sale",  label: "On Sale"            },
];

const COL2 = [
  { href: "/product/eye-of-providence",   label: "Eye of Providence"    },
  { href: "/product/novus-ordo-seclorum", label: "Novus Ordo Seclorum"  },
  { href: "/product/sacred-geometry",     label: "Sacred Geometry"      },
  { href: "/product/the-architect",       label: "The Architect"        },
  { href: "/product/third-eye-open",      label: "Third Eye Open"       },
  { href: "/product/cipher-33",           label: "Cipher 33"            },
  { href: "/shop",                        label: "View All →"           },
];

const COL3 = [
  { href: "#", label: "About Us"                 },
  { href: "#", label: "Cancellations & Returns"  },
  { href: "#", label: "Cash on Delivery"         },
  { href: "#", label: "Shipping"                 },
  { href: "#", label: "Terms & Conditions"       },
  { href: "#", label: "Privacy Policy"           },
  { href: "#", label: "Our Reviews"              },
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
          <a href="https://wa.me/919999999999" style={{ ...LINK_STYLE, color: "rgba(255,255,255,0.55)" }}>
            📱 WhatsApp Support
          </a>
          <a href="mailto:support@iluminatees.in" style={{ ...LINK_STYLE, color: "rgba(255,255,255,0.55)" }}>
            ✉ support@iluminatees.in
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

        {/* Social */}
        <div>
          <div style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700,
            fontSize: "0.5rem", letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
            marginBottom: 10,
          }}>
            FOLLOW US ON
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {[
              { href: "#", label: "Instagram", icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              )},
              { href: "#", label: "X / Twitter", icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              )},
              { href: "#", label: "YouTube", icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              )},
            ].map(({ href, label, icon }) => (
              <a key={label} href={href} aria-label={label}
                style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
                className="footer-social">
                {icon}
              </a>
            ))}
          </div>
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
          <form
            onSubmit={(e) => e.preventDefault()}
            className="footer-newsletter-form"
            style={{ display: "flex", gap: 0 }}
          >
            <input
              type="email"
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
