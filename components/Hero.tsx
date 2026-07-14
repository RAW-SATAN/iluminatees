"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/lib/products";
import { ProductMockup } from "./ProductMockup";

/* ── Slide data ─────────────────────────────────────────── */
const SLIDES = [
  {
    slug:        "eye-of-providence",
    tag:         "BESTSELLER",
    bg:          "radial-gradient(ellipse 75% 90% at 22% 55%, rgba(232,0,13,0.30) 0%, transparent 60%), #050505",
    accentColor: "#e8000d",
    sideLabel:   "NEW DROP",
    sideEmoji:   "👁",
    sideBg:      "rgba(232,0,13,0.14)",
    sideBorder:  "rgba(232,0,13,0.40)",
  },
  {
    slug:        "the-architect",
    tag:         "APEX PREMIUM",
    bg:          "radial-gradient(ellipse 75% 90% at 22% 55%, rgba(130,0,220,0.24) 0%, transparent 60%), #04040b",
    accentColor: "#9c27b0",
    sideLabel:   "APEX TIER",
    sideEmoji:   "⬡",
    sideBg:      "rgba(156,39,176,0.14)",
    sideBorder:  "rgba(156,39,176,0.40)",
  },
  {
    slug:        "cipher-33",
    tag:         "LIMITED EDITION",
    bg:          "radial-gradient(ellipse 75% 90% at 22% 55%, rgba(0,190,100,0.20) 0%, transparent 60%), #04090505",
    accentColor: "#00c853",
    sideLabel:   "LIMITED",
    sideEmoji:   "△",
    sideBg:      "rgba(0,200,83,0.12)",
    sideBorder:  "rgba(0,200,83,0.35)",
  },
  {
    slug:        "sacred-geometry",
    tag:         "SACRED SERIES",
    bg:          "radial-gradient(ellipse 75% 90% at 22% 55%, rgba(201,168,76,0.24) 0%, transparent 60%), #080600",
    accentColor: "#c9a84c",
    sideLabel:   "SACRED",
    sideEmoji:   "✦",
    sideBg:      "rgba(201,168,76,0.12)",
    sideBorder:  "rgba(201,168,76,0.40)",
  },
];

const EXTRA_CATS = [
  { label: "CIPHER",      emoji: "◈", href: "/shop?cat=CIPHER", bg: "rgba(0,188,212,0.10)", border: "rgba(0,188,212,0.28)" },
  { label: "OVERSIZED",   emoji: "□", href: "/shop",             bg: "rgba(96,125,139,0.10)", border: "rgba(96,125,139,0.28)" },
  { label: "HEAVYWEIGHT", emoji: "▣", href: "/shop",             bg: "rgba(121,85,72,0.10)",  border: "rgba(121,85,72,0.28)"  },
  { label: "MENS",        emoji: "▲", href: "/shop",             bg: "rgba(55,71,79,0.10)",   border: "rgba(55,71,79,0.28)"   },
  { label: "SALE",        emoji: "%", href: "/shop",             bg: "rgba(232,0,13,0.10)",   border: "rgba(232,0,13,0.28)"   },
];

/* ── Component ──────────────────────────────────────────── */
export function Hero() {
  const [slide,      setSlide]      = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  /* Auto-advance */
  useEffect(() => {
    if (isHovering) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 4200);
    return () => clearInterval(timerRef.current);
  }, [isHovering]);

  const cur  = SLIDES[slide];
  const next = () => setSlide((s) => (s + 1) % SLIDES.length);
  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div
      style={{
        display: "flex",
        height: "clamp(380px, 46vw, 480px)",
        background: "#040404",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      {/* ── Left Sidebar ──────────────────────────────── */}
      <div
        className="hidden md:flex no-scrollbar"
        style={{
          width: 192, flexShrink: 0,
          background: "#060606",
          borderRight: "1px solid #141414",
          overflowY: "auto",
          flexDirection: "column",
        }}
      >
        {/* Slide-linked categories */}
        {SLIDES.map((s, i) => {
          const prod = products.find((p) => p.slug === s.slug)!;
          return (
            <button
              key={s.slug}
              onMouseEnter={() => { setSlide(i); setIsHovering(true); }}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px",
                background: slide === i ? s.sideBg : "transparent",
                borderLeft: `3px solid ${slide === i ? s.accentColor : "transparent"}`,
                borderBottom: "1px solid #141414",
                width: "100%", textAlign: "left",
                transition: "background 0.25s, border-color 0.25s",
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: 38, height: 38, borderRadius: 3, flexShrink: 0,
                background: s.sideBg,
                border: `1px solid ${slide === i ? s.accentColor : s.sideBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15,
                transition: "border-color 0.25s",
              }}>
                {s.sideEmoji}
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.57rem",
                fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: slide === i ? "#fff" : "rgba(255,255,255,0.38)",
                transition: "color 0.25s",
                lineHeight: 1.2,
              }}>
                {s.sideLabel}
                <br />
                <span style={{ fontWeight: 400, fontSize: "0.48rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.05em" }}>
                  {prod.name}
                </span>
              </span>
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ height: 1, background: "#1c1c1c", margin: "4px 0" }} />

        {/* Extra cats */}
        {EXTRA_CATS.map(({ label, emoji, href, bg, border }) => (
          <Link
            key={label}
            href={href}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px",
              borderLeft: "3px solid transparent",
              borderBottom: "1px solid #141414",
              textDecoration: "none",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 3, flexShrink: 0,
              background: bg, border: `1px solid ${border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}>
              {emoji}
            </div>
            <span style={{
              fontFamily: "Inter, sans-serif", fontSize: "0.56rem",
              fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)",
            }}>
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* ── Center Carousel ───────────────────────────── */}
      <div
        style={{ flex: 1, position: "relative", overflow: "hidden", minWidth: 0 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {SLIDES.map((s, i) => {
          const prod = products.find((p) => p.slug === s.slug)!;
          const isActive = slide === i;
          return (
            <div
              key={s.slug}
              style={{
                position: "absolute", inset: 0,
                background: s.bg,
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.65s ease",
                pointerEvents: isActive ? "auto" : "none",
                display: "flex", alignItems: "center",
                padding: "0 clamp(1.5rem, 4vw, 4rem)",
                gap: "2rem",
              }}
            >
              {/* Info */}
              <div style={{ flex: 1, zIndex: 1 }}>
                {/* Tag pill */}
                <div style={{
                  display: "inline-flex",
                  background: s.accentColor, color: "#fff",
                  fontFamily: "Inter, sans-serif", fontWeight: 800,
                  fontSize: "0.44rem", letterSpacing: "0.28em",
                  padding: "0.22rem 0.65rem", marginBottom: 14,
                }}>
                  {s.tag}
                </div>

                {/* Headline */}
                <h2 style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: "clamp(2.4rem, 4.5vw, 4.8rem)",
                  lineHeight: 0.88, letterSpacing: "-0.01em",
                  textTransform: "uppercase", color: "#fff",
                  marginBottom: 18, whiteSpace: "pre-line",
                }}>
                  {prod.name}
                </h2>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 26 }}>
                  <span style={{
                    fontFamily: "Space Mono, monospace", fontWeight: 700,
                    fontSize: "1.15rem", color: "#fff",
                  }}>
                    ₹{prod.price.toLocaleString("en-IN")}
                  </span>
                  {prod.originalPrice && (
                    <>
                      <span style={{
                        fontFamily: "Space Mono, monospace", fontSize: "0.78rem",
                        textDecoration: "line-through", color: "#555",
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
                    background: "#fff", color: "#000",
                    fontFamily: "Inter, sans-serif", fontWeight: 800,
                    fontSize: "0.62rem", letterSpacing: "0.14em",
                    textTransform: "uppercase", textDecoration: "none",
                    padding: "0.72rem 1.5rem",
                  }}
                >
                  SHOP NOW →
                </Link>
              </div>

              {/* Product mockup */}
              <div
                className="hidden sm:block"
                style={{
                  flexShrink: 0,
                  filter: `drop-shadow(0 0 55px ${s.accentColor}30)`,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "scale(1) translateY(0)" : "scale(0.92) translateY(10px)",
                  transition: "opacity 0.6s 0.25s, transform 0.6s 0.25s",
                }}
              >
                <ProductMockup product={prod} size={clamp(160, 200)} />
              </div>
            </div>
          );
        })}

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.55)", border: "1px solid #2a2a2a",
            color: "#fff", width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}
        >
          <ChevronLeft size={15} />
        </button>
        <button
          onClick={next}
          style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.55)", border: "1px solid #2a2a2a",
            color: "#fff", width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}
        >
          <ChevronRight size={15} />
        </button>

        {/* Slide dots */}
        <div style={{
          position: "absolute", bottom: 16, left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: 6, zIndex: 10,
        }}>
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: slide === i ? 22 : 6, height: 6, borderRadius: 3,
                background: slide === i ? SLIDES[i].accentColor : "rgba(255,255,255,0.2)",
                border: "none",
                transition: "width 0.35s, background 0.35s",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Right Banner ──────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: 290, flexShrink: 0,
          borderLeft: "1px solid #1a1a1a",
          background: "radial-gradient(ellipse 80% 55% at 50% 30%, rgba(232,0,13,0.14) 0%, transparent 65%), #060606",
          flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "2rem 1.4rem",
          gap: 14, textAlign: "center",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Top label */}
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: "0.4rem",
          letterSpacing: "0.45em", color: "#e8000d", textTransform: "uppercase",
        }}>
          EXCLUSIVE OFFER
        </div>

        {/* Headline */}
        <h3 style={{
          fontFamily: "Anton, sans-serif",
          fontSize: "2.6rem", lineHeight: 0.9,
          letterSpacing: "0.01em", textTransform: "uppercase", color: "#fff",
        }}>
          BIGGEST SALE OF THE SEASON
        </h3>

        {/* Discount */}
        <div style={{
          fontFamily: "Anton, sans-serif",
          fontSize: "1.55rem", color: "#e8000d", letterSpacing: "0.04em",
        }}>
          GET UP TO 40% OFF
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1c1c1c", width: "70%", margin: "2px 0" }} />

        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.6rem",
          color: "rgba(255,255,255,0.35)", lineHeight: 1.55,
        }}>
          Limited drops. Heavyweight cotton.<br />No compromises.
        </p>

        {/* CTA */}
        <Link
          href="/shop"
          style={{
            display: "block", width: "100%",
            background: "#e8000d", color: "#fff",
            fontFamily: "Inter, sans-serif", fontWeight: 800,
            fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
            textDecoration: "none", padding: "0.85rem", textAlign: "center",
          }}
        >
          SHOP SALE →
        </Link>

        {/* Date tag */}
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: "0.36rem",
          letterSpacing: "0.3em", color: "rgba(255,255,255,0.12)",
        }}>
          LIMITED · SS&apos;26 SEASON
        </div>

        {/* Decorative circles */}
        {[
          { size: 180, opacity: 0.04, top: -60, right: -60 },
          { size: 100, opacity: 0.06, bottom: -30, left: -30 },
        ].map((c, i) => (
          <div
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              width: c.size, height: c.size, borderRadius: "50%",
              border: "1px solid #e8000d",
              opacity: c.opacity,
              top: c.top, bottom: c.bottom, left: c.left, right: c.right,
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* tiny helper — avoids importing clamp from a lib */
function clamp(min: number, max: number) {
  return max; // returns max for desktop; CSS handles responsive
}
