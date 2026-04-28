"use client";

import { useEffect, useRef } from "react";

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate hero elements on mount
    const el = heroRef.current;
    if (!el) return;
    const children = el.querySelectorAll<HTMLElement>("[data-animate]");
    children.forEach((child, i) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(32px)";
      child.style.transition = `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          child.style.opacity = "1";
          child.style.transform = "translateY(0)";
        });
      });
    });
  }, []);

  return (
    <main style={{ background: "var(--blk)", color: "var(--w)", overflowX: "hidden" }}>
      {/* ── 1. MANIFESTO HERO ───────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#060606",
          position: "relative",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div ref={heroRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          {/* Eyebrow */}
          <span
            data-animate
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.45em",
              color: "var(--r)",
              textTransform: "uppercase",
            }}
          >
            About the Brand
          </span>

          {/* Big headline */}
          <div data-animate style={{ lineHeight: 1 }}>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(60px, 9vw, 140px)",
                color: "var(--w)",
                lineHeight: 0.95,
                display: "block",
              }}
            >
              NOT MADE
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(60px, 9vw, 140px)",
                color: "var(--w)",
                lineHeight: 0.95,
                display: "block",
              }}
            >
              TO FIT IN.
            </div>
          </div>

          {/* Accent line */}
          <div
            data-animate
            style={{
              fontFamily: "'Rubik Dirt', cursive",
              fontSize: "clamp(36px, 4.5vw, 72px)",
              color: "var(--r)",
              transform: "skewX(-4deg)",
              lineHeight: 1,
            }}
          >
            MADE TO STAND OUT.
          </div>
        </div>

        {/* Down arrow */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            animation: "bounce 2s ease infinite",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.35em",
              color: "rgba(240,236,232,0.3)",
            }}
          >
            SCROLL
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <line x1="8" y1="0" x2="8" y2="18" stroke="rgba(240,236,232,0.3)" strokeWidth="1" />
            <polyline points="3,13 8,19 13,13" stroke="rgba(240,236,232,0.3)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
          }
        `}</style>
      </section>

      {/* ── 2. BRAND STORY ──────────────────────────────────── */}
      <section
        style={{
          padding: "120px 52px",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "60fr 40fr",
          gap: "64px",
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div style={{ position: "relative" }}>
          {/* Ghost number */}
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "120px",
              color: "rgba(240,236,232,0.04)",
              position: "absolute",
              top: "-40px",
              left: "-12px",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            01
          </span>

          <div style={{ position: "relative", zIndex: 1 }}>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "32px",
                color: "var(--w)",
                letterSpacing: "0.06em",
                marginBottom: "32px",
              }}
            >
              THE STORY
            </h2>

            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "14px",
                lineHeight: 1.9,
                color: "rgba(240,236,232,0.65)",
                marginBottom: "20px",
              }}
            >
              ILUMINATEES was born from a simple idea: clothing should be a statement, not a uniform. We build for the
              ones who refuse to disappear into the crowd.
            </p>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "14px",
                lineHeight: 1.9,
                color: "rgba(240,236,232,0.65)",
              }}
            >
              Every piece is designed to last — 220–280 GSM heavyweight cotton, pre-washed, oversized architecture. No
              fast fashion. No compromises.
            </p>
          </div>
        </div>

        {/* Right: stats card */}
        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid rgba(240,236,232,0.06)",
            padding: "40px 32px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {[
            { value: "12", label: "DROPS THIS SEASON" },
            { value: "240 GSM", label: "MINIMUM WEIGHT" },
            { value: "100%", label: "INDEPENDENT" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "64px",
                  color: "var(--r)",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: "rgba(240,236,232,0.4)",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. VALUES ───────────────────────────────────────── */}
      <section
        style={{
          background: "#0d0d0d",
          padding: "100px 52px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "52px",
              color: "var(--w)",
              letterSpacing: "0.04em",
              marginBottom: "60px",
            }}
          >
            WHAT WE STAND FOR
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {[
              {
                num: "01",
                title: "QUALITY OVER QUANTITY",
                desc: "Every drop is deliberate. Every piece earns its place.",
              },
              {
                num: "02",
                title: "REBELLION OVER CONFORMITY",
                desc: "We don't follow trends. We ignore them.",
              },
              {
                num: "03",
                title: "IDENTITY OVER TREND",
                desc: "Wear who you are, not what you're told.",
              },
            ].map(({ num, title, desc }) => (
              <div
                key={num}
                style={{
                  borderTop: "2px solid var(--r)",
                  padding: "28px 24px",
                  background: "#060606",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "48px",
                    color: "var(--r)",
                    lineHeight: 1,
                    marginBottom: "12px",
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "22px",
                    color: "var(--w)",
                    letterSpacing: "0.04em",
                    marginBottom: "10px",
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "12px",
                    color: "rgba(240,236,232,0.45)",
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. MANIFESTO QUOTE ──────────────────────────────── */}
      <section
        style={{
          padding: "120px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "18px",
              fontStyle: "italic",
              color: "rgba(240,236,232,0.7)",
              lineHeight: 1.9,
              marginBottom: "24px",
            }}
          >
            "We are not for everyone. We are for the ones who know exactly who they are — and refuse to apologize for
            it."
          </p>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.4em",
              color: "var(--r)",
              textTransform: "uppercase",
            }}
          >
            — ILUMINATEES, SS26
          </span>
        </div>
      </section>
    </main>
  );
}
