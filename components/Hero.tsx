"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/lib/useProducts";
import { useSiteAssets } from "@/lib/useSiteAssets";
import { ProductMockup } from "./ProductMockup";

/* ── Carousel slides ────────────────────────────────────── */
const SLIDES = [
  {
    slug:        "the-katana",
    tag:         "APEX PREMIUM",
    subtext:     "240 GSM · Drop-shoulder · Pre-shrunk Cotton",
    bg:          "linear-gradient(135deg, #0a0a0a10 0%, #6e6e6e18 100%), radial-gradient(ellipse 80% 70% at 35% 55%, rgba(100,100,100,0.18) 0%, transparent 65%), #f6f6f6",
    accentColor: "#c0c0c0",
    textColor:   "#111",
    sideLabel:   "APEX DROP",
    sideEmoji:   "⚔",
    sideBg:      "rgba(192,192,192,0.10)",
    sideActiveBg:"rgba(192,192,192,0.18)",
    sideActive:  "#888",
  },
  {
    slug:        "the-black-samurai",
    tag:         "VAULT DROP",
    subtext:     "240 GSM · Oversized · Reactive Dye Print",
    bg:          "linear-gradient(135deg, #0a0a0a14 0%, #1a1a1a18 100%), radial-gradient(ellipse 80% 70% at 35% 55%, rgba(50,50,50,0.22) 0%, transparent 65%), #f5f5f5",
    accentColor: "#e8e8e8",
    textColor:   "#111",
    sideLabel:   "NEW DROP",
    sideEmoji:   "⛩",
    sideBg:      "rgba(200,200,200,0.10)",
    sideActiveBg:"rgba(200,200,200,0.18)",
    sideActive:  "#555",
  },
  {
    slug:        "the-bankai",
    tag:         "LIMITED EDITION",
    subtext:     "240 GSM · Drop-shoulder · Only While Stock Lasts",
    bg:          "linear-gradient(135deg, #05050a14 0%, #9090ff18 100%), radial-gradient(ellipse 80% 70% at 35% 55%, rgba(80,80,220,0.18) 0%, transparent 65%), #f5f5ff",
    accentColor: "#9090ff",
    textColor:   "#111",
    sideLabel:   "BANKAI",
    sideEmoji:   "🌀",
    sideBg:      "rgba(144,144,255,0.10)",
    sideActiveBg:"rgba(144,144,255,0.16)",
    sideActive:  "#7070ee",
  },
  {
    slug:        "the-sakura",
    tag:         "NEW DROP",
    subtext:     "240 GSM · Oversized · Pre-shrunk Cotton",
    bg:          "linear-gradient(135deg, #1a0a0a10 0%, #e39bb018 100%), radial-gradient(ellipse 80% 70% at 35% 55%, rgba(227,155,176,0.20) 0%, transparent 65%), #fdf5f7",
    accentColor: "#e39bb0",
    textColor:   "#111",
    sideLabel:   "SAKURA",
    sideEmoji:   "🌸",
    sideBg:      "rgba(227,155,176,0.10)",
    sideActiveBg:"rgba(227,155,176,0.18)",
    sideActive:  "#d98aa2",
  },
];

/* ── Component ──────────────────────────────────────────── */
export function Hero() {
  const products = useProducts();
  const { heroBanners, loaded } = useSiteAssets();
  const [slide,      setSlide]      = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const touchX = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (dx > 45) prev();
    else if (dx < -45) next();
  }

  useEffect(() => {
    if (isHovering) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [isHovering]);

  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % SLIDES.length);

  return (
    <div style={{
      display: "flex",
      height: "clamp(360px, 44vw, 460px)",
      borderBottom: "1px solid #e8e8e8",
      background: "#fff",
    }}>

      {/* ── Left Sidebar ──────────────────────────────── */}
      <div
        className="hidden md:flex no-scrollbar"
        style={{
          width: 200, flexShrink: 0,
          background: "#121212",
          borderRight: "1px solid #1e1e1e",
          overflowY: "auto",
          flexDirection: "column",
        }}
      >
        {/* Slide-linked categories */}
        {SLIDES.map((s, i) => {
          const prod = products.find((p) => p.slug === s.slug)!;
          const active = slide === i;
          return (
            <button
              key={s.slug}
              onMouseEnter={() => { setSlide(i); setIsHovering(true); }}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 13px",
                background: active ? s.sideActiveBg : "transparent",
                borderLeft: `3px solid ${active ? s.sideActive : "transparent"}`,
                borderBottom: "1px solid #1e1e1e",
                width: "100%", textAlign: "left",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 3, flexShrink: 0,
                background: active ? s.sideActiveBg : s.sideBg,
                border: `1px solid ${active ? s.sideActive : "rgba(255,255,255,0.08)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, transition: "border-color 0.2s",
              }}>
                {s.sideEmoji}
              </div>
              <div>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.56rem",
                  fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  lineHeight: 1.2, transition: "color 0.2s",
                }}>
                  {s.sideLabel}
                </div>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.46rem",
                  color: "rgba(255,255,255,0.25)", letterSpacing: "0.02em",
                  marginTop: 1,
                }}>
                  {prod.name}
                </div>
              </div>
            </button>
          );
        })}

      </div>

      {/* ── Center Carousel ───────────────────────────── */}
      <div
        style={{ flex: 1, position: "relative", overflow: "hidden", minWidth: 0, touchAction: "pan-y" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {loaded && SLIDES.map((s, i) => {
          const prod = products.find((p) => p.slug === s.slug)!;
          const active = slide === i;
          const banner = heroBanners[String(i)];

          /* Custom uploaded banner replaces the whole slide design */
          if (banner) {
            return (
              <Link
                key={s.slug}
                href={`/product/${prod.slug}`}
                style={{
                  position: "absolute", inset: 0,
                  opacity: active ? 1 : 0,
                  transition: "opacity 0.55s ease",
                  pointerEvents: active ? "auto" : "none",
                  display: "block",
                }}
              >
                <img
                  src={banner}
                  alt={prod.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </Link>
            );
          }

          return (
            <div
              key={s.slug}
              style={{
                position: "absolute", inset: 0,
                background: s.bg,
                opacity: active ? 1 : 0,
                transition: "opacity 0.55s ease",
                pointerEvents: active ? "auto" : "none",
                display: "flex", alignItems: "center",
                padding: "0 clamp(1.5rem, 4vw, 3.5rem)",
                gap: "1.5rem",
              }}
            >
              {/* Left: text */}
              <div style={{ flex: 1 }}>
                {/* Tag */}
                <div style={{
                  display: "inline-flex",
                  background: s.accentColor, color: "#fff",
                  fontFamily: "Inter, sans-serif", fontWeight: 800,
                  fontSize: "0.44rem", letterSpacing: "0.28em",
                  padding: "0.2rem 0.6rem", marginBottom: 12,
                  borderRadius: 6,
                }}>
                  {s.tag}
                </div>

                {/* Headline */}
                <h2 style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: "clamp(2.2rem, 4.5vw, 4.6rem)",
                  lineHeight: 0.9, letterSpacing: "0.01em",
                  textTransform: "uppercase", color: s.textColor,
                  marginBottom: 14,
                }}>
                  {prod.name}
                </h2>

                {/* Subtext */}
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.65rem",
                  color: "#888", letterSpacing: "0.04em", marginBottom: 18,
                }}>
                  {s.subtext}
                </p>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 24 }}>
                  <span style={{
                    fontFamily: "Space Mono, monospace", fontWeight: 700,
                    fontSize: "1.35rem", color: "#111",
                  }}>
                    ₹{prod.price.toLocaleString("en-IN")}
                  </span>
                  {prod.originalPrice && (
                    <>
                      <span style={{
                        fontFamily: "Space Mono, monospace", fontSize: "0.85rem",
                        textDecoration: "line-through", color: "#bbb",
                      }}>
                        ₹{prod.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="tag">
                        {Math.round((1 - prod.price / prod.originalPrice!) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/product/${prod.slug}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#111", color: "#fff",
                    fontFamily: "Inter, sans-serif", fontWeight: 800,
                    fontSize: "0.62rem", letterSpacing: "0.14em",
                    textTransform: "uppercase", textDecoration: "none",
                    padding: "0.75rem 1.6rem", borderRadius: 24,
                  }}
                >
                  SHOP NOW →
                </Link>
              </div>

              {/* Right: product visual */}
              <div
                className="hidden sm:block"
                style={{
                  flexShrink: 0,
                  opacity: active ? 1 : 0,
                  transform: active ? "scale(1) translateY(0)" : "scale(0.94) translateY(8px)",
                  transition: "opacity 0.5s 0.2s, transform 0.5s 0.2s",
                  filter: `drop-shadow(0 8px 40px ${s.accentColor}28)`,
                }}
              >
                <ProductMockup product={prod} size={190} />
              </div>
            </div>
          );
        })}

        {/* Arrows */}
        {[
          { dir: "prev", fn: prev, left: 10 },
          { dir: "next", fn: next, right: 10 },
        ].map(({ dir, fn, left, right }: { dir: string; fn: () => void; left?: number; right?: number }) => (
          <button
            key={dir}
            onClick={fn}
            style={{
              position: "absolute", top: "50%", transform: "translateY(-50%)",
              left, right,
              background: "rgba(255,255,255,0.9)", border: "1px solid #e0e0e0",
              color: "#333", width: 34, height: 34, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 10, cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
              transition: "background 0.2s",
            }}
          >
            {dir === "prev" ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>
        ))}

        {/* Dots */}
        <div style={{
          position: "absolute", bottom: 14, left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: 6, zIndex: 10,
        }}>
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: slide === i ? 20 : 6, height: 6,
                borderRadius: 3,
                background: slide === i ? SLIDES[slide].accentColor : "#ccc",
                border: "none", cursor: "pointer",
                transition: "width 0.3s, background 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Right Banner ──────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: 280, flexShrink: 0,
          borderLeft: "1px solid #e8e8e8",
          background: "linear-gradient(160deg, #fff5f5 0%, #fff0f0 100%)",
          flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "2rem 1.4rem",
          gap: 12, textAlign: "center",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.42rem", fontWeight: 700,
          letterSpacing: "0.45em", color: "#e8000d", textTransform: "uppercase",
        }}>
          EXCLUSIVE OFFER
        </div>

        <h3 style={{
          fontFamily: "Anton, sans-serif",
          fontSize: "2.4rem", lineHeight: 0.9,
          letterSpacing: "0.01em", textTransform: "uppercase", color: "#111",
        }}>
          BIGGEST SALE OF THE YEAR
        </h3>

        <div style={{
          fontFamily: "Anton, sans-serif",
          fontSize: "1.4rem", color: "#e8000d",
          letterSpacing: "0.04em",
        }}>
          GET UP TO 40% OFF
        </div>

        <div style={{ height: 1, background: "#eee", width: "70%" }} />

        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.58rem",
          color: "#999", lineHeight: 1.6,
        }}>
          Limited drops. Heavyweight cotton.<br />No compromises.
        </p>

        <Link
          href="/shop"
          style={{
            display: "block", width: "100%",
            background: "#e8000d", color: "#fff",
            fontFamily: "Inter, sans-serif", fontWeight: 800,
            fontSize: "0.6rem", letterSpacing: "0.18em",
            textTransform: "uppercase", textDecoration: "none",
            padding: "0.85rem", textAlign: "center",
          }}
        >
          SHOP SALE →
        </Link>

        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: "0.36rem",
          letterSpacing: "0.25em", color: "#ccc",
        }}>
          15 JUL — 31 AUG &apos;26
        </div>

        {/* Decorative circles */}
        <div aria-hidden style={{
          position: "absolute", top: -50, right: -50,
          width: 160, height: 160, borderRadius: "50%",
          border: "1px solid rgba(232,0,13,0.12)",
          pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute", bottom: -30, left: -30,
          width: 100, height: 100, borderRadius: "50%",
          border: "1px solid rgba(232,0,13,0.10)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}
