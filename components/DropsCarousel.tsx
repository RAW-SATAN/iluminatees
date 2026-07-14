"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { products } from "@/lib/products";
import { ProductMockup } from "./ProductMockup";
import { useWishlist } from "./WishlistProvider";

/*
  Key insight: key each item by its product index (not slot).
  When idx changes, React transitions the SAME DOM node from
  slot +1 → slot 0, giving a real physical grow/shrink motion.
*/

/* slot index -2…+2 → visual properties */
const SLOTS = [
  { scale: 0.40, opacity: 0.28, tx: "-38vw", zIndex: 1 }, // -2
  { scale: 0.63, opacity: 0.52, tx: "-21vw", zIndex: 2 }, // -1
  { scale: 1.00, opacity: 1.00, tx:    "0",  zIndex: 4 }, //  0  ← center
  { scale: 0.63, opacity: 0.52, tx:  "21vw", zIndex: 2 }, // +1
  { scale: 0.40, opacity: 0.28, tx:  "38vw", zIndex: 1 }, // +2
];

/* off-screen "waiting" position for products outside ±2 */
const OFF = { scale: 0.28, opacity: 0, zIndex: 0 };

function slotOf(pIdx: number, center: number, total: number) {
  let d = ((pIdx - center) % total + total) % total;
  if (d > total / 2) d -= total;
  return d; // signed distance from center
}

const TAG_MAP: Record<string, string> = {
  bestseller: "BESTSELLER",
  limited:    "LIMITED EDITION",
  premium:    "APEX PREMIUM",
  classic:    "CLASSIC DROP",
};
function getTag(p: (typeof products)[0]) {
  for (const t of p.tags) if (TAG_MAP[t]) return TAG_MAP[t];
  return p.limited ? "LIMITED EDITION" : "NEW ARRIVAL";
}

export function DropsCarousel() {
  const [idx, setIdx] = useState(0);
  const { toggleItem, isWishlisted } = useWishlist();

  const prev = useCallback(() => setIdx((i) => (i - 1 + products.length) % products.length), []);
  const next = useCallback(() => setIdx((i) => (i + 1) % products.length), []);

  const center = products[idx];
  const emi    = Math.round(center.price / 9);

  return (
    <section style={{
      background: "#fff",
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)," +
        "linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
      backgroundSize: "52px 52px",
      borderTop: "1px solid #ebebeb",
      borderBottom: "1px solid #ebebeb",
      paddingBottom: "2.5rem",
      overflow: "hidden",
    }}>

      {/* ── Title ─────────────────────────────────── */}
      <div style={{ textAlign: "center", padding: "2.8rem 1rem 2rem" }}>
        {/*
          Inline SVG logo — outlined DROPS with circle mask + cursive overlay.
          Anton font loads from CSS so SVG text inherits it correctly.
        */}
        <svg
          viewBox="0 0 560 116"
          role="img"
          aria-label="DROPS iluminatees:"
          style={{ width: "min(92vw, 560px)", height: "auto", display: "block", margin: "0 auto", overflow: "visible" }}
        >
          {/* Outlined DROPS */}
          <text
            x="280" y="100"
            fontFamily="Anton, Impact, sans-serif"
            fontSize="106"
            textAnchor="middle"
            fill="none"
            stroke="#111"
            strokeWidth="2"
            letterSpacing="5"
          >
            DROPS
          </text>

          {/* White circle mask over the O — creates the "punch-out" for the script */}
          <circle cx="280" cy="54" r="44" fill="white" stroke="#111" strokeWidth="1.6" />

          {/* Script iluminatees: centered on the circle, extends beyond it */}
          <text
            x="280" y="67"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="28"
            fill="#111"
            textAnchor="middle"
            letterSpacing="-0.3"
          >
            iluminatees:
          </text>
        </svg>

        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.72rem",
          color: "#999", letterSpacing: "0.06em", marginTop: 14,
        }}>
          Fresh Drops From The Vault. Refreshed Daily.
        </p>
      </div>

      {/* ── Fan stage ─────────────────────────────── */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "clamp(240px, 32vw, 340px)",
      }}>
        {products.map((prod, pIdx) => {
          const d = slotOf(pIdx, idx, products.length);
          const abs = Math.abs(d);

          /* properties: use OFF for |d| > 2 (invisible but rendered for smooth entry) */
          const s = abs <= 2 ? SLOTS[d + 2] : {
            ...OFF,
            tx: d < 0 ? "-52vw" : "52vw",
          } as typeof SLOTS[0];

          const isCenter = d === 0;
          const isClickable = abs === 1 || abs === 2;

          return (
            <div
              key={pIdx}                          /* ← keyed by product, not slot */
              onClick={isClickable ? (d < 0 ? prev : next) : undefined}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                /* spring easing: second value > 1 = overshoot → grow pop */
                transition:
                  "transform 0.52s cubic-bezier(0.34, 1.38, 0.64, 1)," +
                  "opacity 0.38s ease",
                transform: `translate(calc(-50% + ${"tx" in s ? s.tx : "0px"}), -50%) scale(${s.scale})`,
                opacity: s.opacity,
                zIndex: s.zIndex,
                cursor: isClickable ? "pointer" : "default",
                pointerEvents: isClickable ? "auto" : "none",
              }}
            >
              <div style={{
                width:  "clamp(150px, 17vw, 210px)",
                height: "clamp(150px, 17vw, 210px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isCenter ? "#fff" : "transparent",
                borderRadius: 20,
                boxShadow: isCenter ? "0 16px 56px rgba(0,0,0,0.12)" : "none",
                border:     isCenter ? "1px solid #eee" : "none",
                transition: "box-shadow 0.4s ease, border-color 0.4s ease",
              }}>
                <ProductMockup product={prod} size={isCenter ? 175 : 135} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Info card ─────────────────────────────── */}
      <div style={{
        maxWidth: 390, margin: "1.8rem auto 0",
        background: "#fff",
        border: "1px solid #e4e4e4",
        borderRadius: 20,
        boxShadow: "0 4px 28px rgba(0,0,0,0.07)",
        padding: "1.2rem 1.5rem",
        position: "relative",
      }}>
        {/* Arrows */}
        {[
          { fn: prev, side: "left",  icon: <ChevronLeft  size={14} color="#555" /> },
          { fn: next, side: "right", icon: <ChevronRight size={14} color="#555" /> },
        ].map(({ fn, side, icon }) => (
          <button
            key={side}
            onClick={fn}
            style={{
              position: "absolute",
              [side]: -20,
              top: "50%", transform: "translateY(-50%)",
              width: 38, height: 38, borderRadius: "50%",
              background: "#fff", border: "1px solid #e0e0e0",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", zIndex: 5,
              boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
            }}
          >
            {icon}
          </button>
        ))}

        {/* Tag + heart */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{
            fontFamily: "Inter, sans-serif", fontWeight: 800,
            fontSize: "0.44rem", letterSpacing: "0.28em",
            color: "#e8000d", textTransform: "uppercase",
          }}>
            ● {getTag(center)}
          </span>
          <button
            onClick={() => toggleItem(center.slug)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
          >
            <Heart
              size={14}
              color={isWishlisted(center.slug) ? "#e8000d" : "#ccc"}
              fill={isWishlisted(center.slug) ? "#e8000d" : "none"}
            />
          </button>
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "Anton, sans-serif",
          fontSize: "1.1rem", letterSpacing: "0.04em",
          color: "#111", marginBottom: 8,
        }}>
          {center.name}
        </div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{
            fontFamily: "Space Mono, monospace",
            fontWeight: 700, fontSize: "1rem", color: "#111",
          }}>
            ₹{center.price.toLocaleString("en-IN")}
          </span>
          {center.originalPrice && (
            <span style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.7rem", color: "#bbb",
              textDecoration: "line-through",
            }}>
              ₹{center.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.52rem",
          color: "#aaa", letterSpacing: "0.02em", marginBottom: 14,
        }}>
          EMI @INR {emi.toLocaleString("en-IN")}/Month
        </div>

        {/* CTA */}
        <Link
          href={`/product/${center.slug}`}
          style={{
            display: "block", width: "100%",
            background: "#111", color: "#fff",
            fontFamily: "Inter, sans-serif", fontWeight: 800,
            fontSize: "0.58rem", letterSpacing: "0.18em",
            textTransform: "uppercase", textDecoration: "none",
            padding: "0.72rem", textAlign: "center",
            borderRadius: 12,
          }}
        >
          Explore
        </Link>
      </div>

      {/* ── Progress dots ─────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 18 }}>
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === idx ? 22 : 6, height: 5, borderRadius: 3,
              background: i === idx ? "#111" : "#ddd",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width 0.35s, background 0.3s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
