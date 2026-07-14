"use client";

import { useState } from "react";
import Link from "next/link";

export function StickyBubble() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      style={{
        position: "fixed", bottom: 20, left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9000,
        display: "flex", alignItems: "center", gap: 14,
        background: "#111",
        border: "1px solid #222",
        padding: "10px 16px 10px 12px",
        maxWidth: "calc(100vw - 2rem)",
        animation: "bubble-in 0.4s ease forwards",
        boxShadow: "0 8px 40px rgba(0,0,0,0.8)",
      }}
    >
      {/* Icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 2, flexShrink: 0,
        background: "rgba(232,0,13,0.15)",
        border: "1px solid rgba(232,0,13,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
      }}>
        👕
      </div>

      {/* Text */}
      <div>
        <div style={{
          fontFamily: "Inter, sans-serif", fontWeight: 700,
          fontSize: "0.65rem", letterSpacing: "0.05em", color: "#fff",
          marginBottom: 2,
        }}>
          Unlock a FREE Eye of Providence Tee
        </div>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.55rem",
          color: "rgba(255,255,255,0.4)", letterSpacing: "0.02em",
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
          fontSize: "0.52rem", letterSpacing: "0.14em",
          textTransform: "uppercase", textDecoration: "none",
          padding: "0.45rem 0.9rem", whiteSpace: "nowrap",
        }}
      >
        SHOP NOW
      </Link>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "none", border: "none", padding: "2px",
          color: "rgba(255,255,255,0.3)", flexShrink: 0,
          fontSize: 16, lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
