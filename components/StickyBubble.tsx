"use client";

import { useState } from "react";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { ProductMockup } from "./ProductMockup";

export function StickyBubble() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const product = getProductBySlug("eye-of-providence");

  return (
    <div
      style={{
        position: "fixed", bottom: 16, left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9000,
        display: "flex", alignItems: "center", gap: 10,
        background: "#111",
        border: "1px solid #2a2a2a",
        borderRadius: 16,
        padding: "8px 12px 8px 8px",
        width: "calc(100vw - 2rem)",
        maxWidth: 420,
        animation: "bubble-in 0.4s ease forwards",
        boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
      }}
    >
      {/* Product thumbnail */}
      <div style={{
        width: 46, height: 52, borderRadius: 10, flexShrink: 0,
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {product
          ? <ProductMockup product={product} size={38} />
          : <span style={{ fontSize: 20 }}>👕</span>
        }
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "Inter, sans-serif", fontWeight: 700,
          fontSize: "0.6rem", color: "#fff",
          marginBottom: 1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          Unlock a FREE Eye of Providence Tee
        </div>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.5rem",
          color: "rgba(255,255,255,0.4)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          Shop ₹5,000+ from the Limited Drop collection
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/shop"
        style={{
          flexShrink: 0,
          background: "#e8000d", color: "#fff",
          fontFamily: "Inter, sans-serif", fontWeight: 800,
          fontSize: "0.48rem", letterSpacing: "0.12em",
          textTransform: "uppercase", textDecoration: "none",
          padding: "0.4rem 0.75rem", whiteSpace: "nowrap",
          borderRadius: 8,
        }}
      >
        SHOP NOW
      </Link>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "none", border: "none", padding: "2px 0 2px 4px",
          color: "rgba(255,255,255,0.25)", flexShrink: 0,
          fontSize: 14, lineHeight: 1, cursor: "pointer",
        }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
