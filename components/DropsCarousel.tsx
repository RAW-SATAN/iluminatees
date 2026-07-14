"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { products } from "@/lib/products";
import { ProductMockup } from "./ProductMockup";
import { useWishlist } from "./WishlistProvider";

/* distance → visual weight */
const SLOT = [
  { d: -2, scale: 0.42, opacity: 0.3,  tx: "-38vw", zIndex: 1 },
  { d: -1, scale: 0.65, opacity: 0.55, tx: "-21vw", zIndex: 2 },
  { d:  0, scale: 1.00, opacity: 1.0,  tx:   "0",   zIndex: 4 },
  { d:  1, scale: 0.65, opacity: 0.55, tx:  "21vw", zIndex: 2 },
  { d:  2, scale: 0.42, opacity: 0.3,  tx:  "38vw", zIndex: 1 },
];

const TAG_MAP: Record<string, string> = {
  bestseller: "BESTSELLER",
  limited:    "LIMITED EDITION",
  premium:    "APEX PREMIUM",
  classic:    "CLASSIC DROP",
  "new-drop": "NEW DROP",
};

function getTag(p: (typeof products)[0]) {
  for (const t of p.tags) if (TAG_MAP[t]) return TAG_MAP[t];
  if (p.limited) return "LIMITED EDITION";
  return "NEW ARRIVAL";
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
        "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
      backgroundSize: "52px 52px",
      borderTop: "1px solid #ebebeb",
      borderBottom: "1px solid #ebebeb",
      paddingBottom: "2.5rem",
      overflow: "hidden",
    }}>

      {/* ── Title ─────────────────────────────────── */}
      <div style={{ textAlign: "center", padding: "2.8rem 1rem 2rem" }}>
        <div style={{
          fontFamily: "Anton, sans-serif",
          fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
          letterSpacing: "0.08em",
          color: "#111",
          lineHeight: 1,
          textTransform: "uppercase",
        }}>
          DROPS
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 300, fontStyle: "italic",
            fontSize: "clamp(1.2rem, 3vw, 2.8rem)",
            letterSpacing: "0.02em",
            color: "#555",
            marginLeft: "0.3em",
          }}>
            iluminatees:
          </span>
        </div>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.72rem", color: "#999",
          letterSpacing: "0.06em", marginTop: 8,
        }}>
          Fresh Drops From The Vault. Refreshed Daily.
        </p>
      </div>

      {/* ── Fan of products ───────────────────────── */}
      <div style={{
        position: "relative",
        height: "clamp(240px, 32vw, 340px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {SLOT.map(({ d, scale, opacity, tx, zIndex }) => {
          const pIdx = (idx + d + products.length) % products.length;
          const prod = products[pIdx];
          const isCenter = d === 0;
          return (
            <div
              key={d}
              onClick={d !== 0 ? (d < 0 ? prev : next) : undefined}
              style={{
                position: "absolute",
                left: "50%",
                transform: `translateX(calc(-50% + ${tx})) scale(${scale})`,
                opacity,
                zIndex,
                transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease",
                cursor: d !== 0 ? "pointer" : "default",
                pointerEvents: d === 0 ? "none" : "auto",
              }}
            >
              <div style={{
                width: "clamp(160px, 18vw, 220px)",
                height: "clamp(160px, 18vw, 220px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isCenter ? "#fff" : "transparent",
                borderRadius: isCenter ? 4 : 0,
                boxShadow: isCenter ? "0 12px 48px rgba(0,0,0,0.10)" : "none",
                border: isCenter ? "1px solid #eee" : "none",
              }}>
                <ProductMockup
                  product={prod}
                  size={isCenter ? 180 : 140}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Info card ─────────────────────────────── */}
      <div style={{
        maxWidth: 380, margin: "1.6rem auto 0",
        background: "#fff",
        border: "1px solid #e8e8e8",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        padding: "1.2rem 1.4rem",
        position: "relative",
      }}>
        {/* Nav arrows */}
        <button
          onClick={prev}
          style={{
            position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)",
            width: 36, height: 36, borderRadius: "50%",
            background: "#fff", border: "1px solid #e0e0e0",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <ChevronLeft size={14} color="#555" />
        </button>
        <button
          onClick={next}
          style={{
            position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
            width: 36, height: 36, borderRadius: "50%",
            background: "#fff", border: "1px solid #e0e0e0",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <ChevronRight size={14} color="#555" />
        </button>

        {/* Tag row */}
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
          fontSize: "1.05rem", letterSpacing: "0.04em",
          color: "#111", marginBottom: 8,
        }}>
          {center.name}
        </div>

        {/* Price row */}
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
            padding: "0.7rem", textAlign: "center",
          }}
        >
          Explore
        </Link>
      </div>

      {/* ── Progress dots ─────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 5, marginTop: 16,
      }}>
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === idx ? 22 : 6, height: 5,
              borderRadius: 3,
              background: i === idx ? "#111" : "#ddd",
              border: "none", cursor: "pointer",
              transition: "width 0.3s, background 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
