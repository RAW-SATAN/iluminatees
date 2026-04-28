"use client";

import { useEffect, useRef, useState } from "react";

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [storyVisible, setStoryVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);
  const [manifestoVisible, setManifestoVisible] = useState(false);

  /* Hero entrance animation */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const children = el.querySelectorAll<HTMLElement>("[data-hero]");
    children.forEach((child, i) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(36px)";
      child.style.transition = `opacity 0.9s ease ${i * 0.18}s, transform 0.9s ease ${i * 0.18}s`;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          child.style.opacity = "1";
          child.style.transform = "translateY(0)";
        })
      );
    });
  }, []);

  /* Scroll-reveal for other sections */
  useEffect(() => {
    const map: [string, () => void][] = [
      ["[data-story]", () => setStoryVisible(true)],
      ["[data-values]", () => setValuesVisible(true)],
      ["[data-manifesto]", () => setManifestoVisible(true)],
    ];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const found = map.find(([sel]) => e.target.matches(sel));
          if (found) {
            found[1]();
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    map.forEach(([sel]) => {
      const el = document.querySelector(sel);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollDown = () =>
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });

  const reveal = (visible: boolean): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(44px)",
    transition: "opacity 0.85s ease, transform 0.85s ease",
  });

  return (
    <main style={{ background: "var(--blk)", color: "var(--w)", overflowX: "hidden" }}>

      {/* ── 1. MANIFESTO HERO ──────────────────────────────────── */}
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
        <div
          ref={heroRef}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}
        >
          {/* Eyebrow */}
          <span
            data-hero
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "var(--r)",
            }}
          >
            ABOUT THE BRAND
          </span>

          {/* Headline */}
          <div data-hero style={{ lineHeight: 0.92 }}>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(60px, 9vw, 140px)",
                color: "var(--w)",
                letterSpacing: "0.02em",
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
                letterSpacing: "0.02em",
                display: "block",
              }}
            >
              TO FIT IN.
            </div>
          </div>

          {/* Accent */}
          <div
            data-hero
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
        <button
          onClick={scrollDown}
          aria-label="Scroll down"
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            cursor: "none",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.4em",
              color: "rgba(240,236,232,0.3)",
            }}
          >
            SCROLL
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            style={{ animation: "float 2.2s ease-in-out infinite" }}
          >
            <line x1="8" y1="0" x2="8" y2="18" stroke="rgba(240,236,232,0.35)" strokeWidth="1" />
            <polyline
              points="3,13 8,19 13,13"
              stroke="rgba(240,236,232,0.35)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </button>
      </section>

      {/* ── 2. BRAND STORY ─────────────────────────────────────── */}
      <section
        data-story
        style={{
          padding: "120px 52px",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "60fr 40fr",
          gap: "64px",
          alignItems: "start",
          ...reveal(storyVisible),
        }}
      >
        {/* Left */}
        <div style={{ position: "relative" }}>
          {/* Ghost number */}
          <span
            aria-hidden
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
              ILUMINATEES was born from a simple idea: clothing should be a statement, not a uniform. We
              build for the ones who refuse to disappear into the crowd.
            </p>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "14px",
                lineHeight: 1.9,
                color: "rgba(240,236,232,0.65)",
              }}
            >
              Every piece is designed to last — 220–280 GSM heavyweight cotton, pre-washed, oversized
              architecture. No fast fashion. No compromises.
            </p>
          </div>
        </div>

        {/* Right: Stats card */}
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
                  letterSpacing: "0.01em",
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

      {/* ── 3. VALUES ──────────────────────────────────────────── */}
      <section
        data-values
        style={{
          background: "#0d0d0d",
          padding: "100px 52px",
          ...reveal(valuesVisible),
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
                desc: "We don't follow trends. We ignore them entirely.",
              },
              {
                num: "03",
                title: "IDENTITY OVER TREND",
                desc: "Wear who you are, not what you're told to wear.",
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
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "12px",
                    color: "rgba(240,236,232,0.45)",
                    lineHeight: 1.7,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. MANIFESTO QUOTE ─────────────────────────────────── */}
      <section
        data-manifesto
        style={{
          padding: "120px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          ...reveal(manifestoVisible),
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
            "We are not for everyone. We are for the ones who know exactly who they are — and refuse to
            apologize for it."
          </p>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--r)",
            }}
          >
            — ILUMINATEES, SS26
          </span>
        </div>
      </section>
    </main>
  );
}
