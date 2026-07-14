"use client";

import Link from "next/link";

/* ── Symbol SVGs ────────────────────────────────────────── */
function SymbolApex() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden style={{ width: "100%", height: "100%" }}>
      <polygon points="50,8 92,82 8,82" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="50" cy="54" rx="12" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="54" r="5" fill="currentColor" />
      <line x1="50" y1="8" x2="50" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="66" x2="50" y2="82" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
function SymbolDrops() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden style={{ width: "100%", height: "100%" }}>
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="50" cy="50" rx="20" ry="13" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
      <line x1="12" y1="50" x2="30" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="70" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
function SymbolSacred() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden style={{ width: "100%", height: "100%" }}>
      {[0,45,90,135].map((a) => (
        <line
          key={a}
          x1={50 + 42 * Math.cos((a * Math.PI) / 180)}
          y1={50 + 42 * Math.sin((a * Math.PI) / 180)}
          x2={50 - 42 * Math.cos((a * Math.PI) / 180)}
          y2={50 - 42 * Math.sin((a * Math.PI) / 180)}
          stroke="currentColor" strokeWidth="1.5"
        />
      ))}
      <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  );
}
function SymbolCipher() {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * (Math.PI / 180);
    return `${50 + 40 * Math.cos(a)},${50 + 40 * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" aria-hidden style={{ width: "100%", height: "100%" }}>
      <polygon points={pts} fill="none" stroke="currentColor" strokeWidth="2" />
      <polygon
        points={Array.from({ length: 6 }, (_, i) => {
          const a = (i * 60 - 30) * (Math.PI / 180);
          return `${50 + 22 * Math.cos(a)},${50 + 22 * Math.sin(a)}`;
        }).join(" ")}
        fill="none" stroke="currentColor" strokeWidth="1.2"
      />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  );
}
function SymbolLimited() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden style={{ width: "100%", height: "100%" }}>
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2"
        transform="rotate(45 50 50)" />
      <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2"
        transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </svg>
  );
}
function SymbolBest() {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45) * (Math.PI / 180);
    const r = i % 2 === 0 ? 40 : 18;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" aria-hidden style={{ width: "100%", height: "100%" }}>
      <polygon points={pts} fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </svg>
  );
}

/* ── Tile data ──────────────────────────────────────────── */
const TILES = [
  {
    key: "APEX",
    label: "APEX",
    sub: "LEVEL 33 · PREMIUM",
    href: "/shop?cat=APEX",
    accent: "#b47fff",
    bg: "linear-gradient(145deg, #1a0038 0%, #09001c 100%)",
    Symbol: SymbolApex,
    col: "1 / 4",
    row: "1 / 3",
    featured: true,
  },
  {
    key: "NEW DROPS",
    label: "NEW DROPS",
    sub: "JUST DROPPED",
    href: "/shop",
    accent: "#ff4d55",
    bg: "linear-gradient(145deg, #1f0002 0%, #0d0000 100%)",
    Symbol: SymbolDrops,
    col: "4 / 6",
    row: "1 / 2",
    featured: false,
  },
  {
    key: "SACRED",
    label: "SACRED",
    sub: "OPEN ENTRY",
    href: "/shop?cat=SACRED",
    accent: "#e8c060",
    bg: "linear-gradient(145deg, #1a1200 0%, #0d0900 100%)",
    Symbol: SymbolSacred,
    col: "6 / 7",
    row: "1 / 2",
    featured: false,
  },
  {
    key: "CIPHER",
    label: "CIPHER",
    sub: "LEVEL 17",
    href: "/shop?cat=CIPHER",
    accent: "#00b8e6",
    bg: "linear-gradient(145deg, #001422 0%, #000a14 100%)",
    Symbol: SymbolCipher,
    col: "4 / 5",
    row: "2 / 3",
    featured: false,
  },
  {
    key: "LIMITED",
    label: "LIMITED DROPS",
    sub: "NEVER RESTOCKED",
    href: "/shop?filter=limited",
    accent: "#fff",
    bg: "linear-gradient(145deg, #111 0%, #080808 100%)",
    Symbol: SymbolLimited,
    col: "5 / 7",
    row: "2 / 3",
    featured: false,
  },
  {
    key: "BESTSELLERS",
    label: "BESTSELLERS",
    sub: "5,000+ INITIATES",
    href: "/shop?filter=bestseller",
    accent: "#ffd700",
    bg: "linear-gradient(145deg, #120e00 0%, #080600 100%)",
    Symbol: SymbolBest,
    col: "1 / 4",
    row: "3 / 4",
    featured: false,
    wide: true,
  },
];

/* ── Component ──────────────────────────────────────────── */
export function CategoryGrid() {
  return (
    <section style={{ background: "#fff", padding: "3.5rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.8rem" }}>
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.56rem", fontWeight: 600,
            color: "#e8000d", letterSpacing: "0.18em",
            textTransform: "uppercase", marginBottom: 4,
          }}>
            CLEARANCE LEVELS
          </div>
          <h2 style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            letterSpacing: "0.04em", color: "#111",
            textTransform: "uppercase", marginBottom: 4,
          }}>
            Shop By Order
          </h2>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.65rem", color: "#999",
          }}>
            Select Your Clearance Level And Enter The Vault
          </p>
        </div>

        {/* Bento grid — desktop: 6 col, mobile: 2 col */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "200px 200px 120px",
          gap: "10px",
        }}
          className="category-bento"
        >
          {TILES.map(({ key, label, sub, href, accent, bg, Symbol, col, row }) => (
            <Link
              key={key}
              href={href}
              style={{
                gridColumn: col,
                gridRow: row,
                position: "relative",
                background: bg,
                borderRadius: 20,
                overflow: "hidden",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "1.2rem 1.4rem",
                minHeight: 120,
              }}
              className="cat-tile"
            >
              {/* Symbol watermark */}
              <div aria-hidden style={{
                position: "absolute",
                right: "-10%",
                bottom: "-10%",
                width: "55%",
                aspectRatio: "1",
                color: accent,
                opacity: 0.1,
                pointerEvents: "none",
              }}>
                <Symbol />
              </div>

              {/* Accent glow */}
              <div aria-hidden style={{
                position: "absolute",
                top: "20%",
                left: "10%",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: accent,
                opacity: 0.06,
                filter: "blur(50px)",
                pointerEvents: "none",
              }} />

              {/* Text */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.42rem",
                  letterSpacing: "0.28em",
                  color: accent,
                  textTransform: "uppercase",
                  marginBottom: 4,
                  opacity: 0.85,
                }}>
                  {sub}
                </div>
                <div style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}>
                  {label}
                </div>
                <div style={{
                  marginTop: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  borderTop: `1px solid ${accent}25`,
                  paddingTop: 8,
                }}>
                  <span style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.5rem",
                    letterSpacing: "0.18em",
                    color: accent,
                    opacity: 0.9,
                    textTransform: "uppercase",
                  }}>
                    ENTER →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        /* Mobile: 2-col stack */
        @media (max-width: 640px) {
          .category-bento {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: auto !important;
          }
          .category-bento a {
            grid-column: auto !important;
            grid-row: auto !important;
            min-height: 140px !important;
          }
        }
        .cat-tile {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .cat-tile:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.15);
        }
      `}</style>
    </section>
  );
}
