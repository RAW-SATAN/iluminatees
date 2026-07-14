"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARDS = [
  {
    id: 0,
    kicker: "220 GSM HEAVYWEIGHT",
    title: "Fabric That Actually Hits Different",
    desc:  "Pre-washed ring-spun cotton. Every thread chosen to outlast trends, timelines, and whatever comes next.",
    accent: "#e8000d",
    bg:    "linear-gradient(160deg, #1a0000 0%, #0d0d0d 100%)",
    icon:  "🧵",
    label: "MATERIAL PROMISE",
  },
  {
    id: 1,
    kicker: "HAND-ETCHED SYMBOLS",
    title: "Designs Older Than Your History Books",
    desc:  "Sacred geometry, cipher script, and ancient glyphs. Every graphic is a document. Read between the stitches.",
    accent: "#c9a84c",
    bg:    "linear-gradient(160deg, #0d0a00 0%, #1a1200 100%)",
    icon:  "👁",
    label: "DESIGN PHILOSOPHY",
  },
  {
    id: 2,
    kicker: "WE DROPPED, WE SOLD OUT AND",
    title: "We Illuminated The Culture",
    desc:  "Every limited run gone within hours. The vault doesn't restock. Once it's gone, it's classified.",
    accent: "#fff",
    bg:    "linear-gradient(160deg, #111 0%, #0a0a0a 100%)",
    icon:  "⚡",
    label: "5,000+ INITIATES",
    featured: true,
  },
  {
    id: 3,
    kicker: "LIMITED DROPS",
    title: "No Restocks. No Replicas. No Compromises.",
    desc:  "Every collection is capped. When it's done, it's history. The scarcity is the point — not the marketing.",
    accent: "#7c00cc",
    bg:    "linear-gradient(160deg, #0a001a 0%, #0d000d 100%)",
    icon:  "△",
    label: "EXCLUSIVITY FIRST",
  },
  {
    id: 4,
    kicker: "100% AUTHENTIC",
    title: "Made In India. Feared Everywhere.",
    desc:  "No overseas white-labelling. Designed, quality-checked, and shipped from India — with zero apologies.",
    accent: "#00843d",
    bg:    "linear-gradient(160deg, #001a0a 0%, #000d05 100%)",
    icon:  "✦",
    label: "INDIA MADE",
  },
];

export function BrandStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(2); // center card

  const scrollTo = (i: number) => {
    setActive(i);
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement;
    if (!card) return;
    const offset = card.offsetLeft - track.offsetWidth / 2 + card.offsetWidth / 2;
    track.scrollTo({ left: offset, behavior: "smooth" });
  };

  return (
    <section style={{
      background: "#fafafa",
      borderTop: "1px solid #ebebeb",
      borderBottom: "1px solid #ebebeb",
      padding: "3.5rem 0",
      overflow: "hidden",
    }}>
      {/* ── Header ────────────────────────────────── */}
      <div style={{ textAlign: "center", padding: "0 1.5rem", marginBottom: "2.5rem" }}>
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.5rem", fontWeight: 700,
          letterSpacing: "0.4em", color: "#aaa",
          textTransform: "uppercase", marginBottom: 10,
        }}>
          WE DESIGNED, WE DROPPED AND
        </div>
        <h2 style={{
          fontFamily: "Anton, sans-serif",
          fontSize: "clamp(2rem, 5vw, 3.2rem)",
          letterSpacing: "0.04em", lineHeight: 1.1,
          textTransform: "uppercase",
        }}>
          We Illuminated{" "}
          <span style={{ color: "#e8000d" }}>The Culture</span>
        </h2>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.7rem", color: "#888",
          marginTop: 8,
        }}>
          Not Made To Fit In. Built To Be Remembered.
        </p>
      </div>

      {/* ── Card track ────────────────────────────── */}
      <div style={{ position: "relative" }}>
        <div
          ref={trackRef}
          className="no-scrollbar"
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            padding: "1rem 12vw",
            scrollSnapType: "x mandatory",
          }}
        >
          {CARDS.map((card, i) => {
            const isFeatured = card.featured;
            const isActive   = active === i;

            return (
              <div
                key={card.id}
                onClick={() => scrollTo(i)}
                style={{
                  flexShrink: 0,
                  width: isFeatured ? "clamp(280px, 30vw, 360px)" : "clamp(220px, 22vw, 280px)",
                  minHeight: isFeatured ? 340 : 300,
                  background: card.bg,
                  borderRadius: 20,
                  padding: "1.8rem 1.5rem",
                  display: "flex", flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  scrollSnapAlign: "center",
                  transform: isActive ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isActive
                    ? `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${card.accent}30`
                    : "0 4px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.4s cubic-bezier(0.34,1.28,0.64,1), box-shadow 0.4s ease",
                  border: `1px solid ${isActive ? card.accent + "40" : "rgba(255,255,255,0.05)"}`,
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Decorative bg glow */}
                <div aria-hidden style={{
                  position: "absolute", top: -40, right: -40,
                  width: 140, height: 140, borderRadius: "50%",
                  background: card.accent,
                  opacity: 0.06, pointerEvents: "none",
                  filter: "blur(40px)",
                }} />

                <div>
                  {/* Kicker */}
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.44rem", fontWeight: 800,
                    letterSpacing: "0.3em", textTransform: "uppercase",
                    color: card.accent, marginBottom: 16,
                    opacity: 0.9,
                  }}>
                    {card.kicker}
                  </div>

                  {/* Icon */}
                  <div style={{
                    fontSize: isFeatured ? "2.8rem" : "2rem",
                    lineHeight: 1, marginBottom: 16,
                    filter: `drop-shadow(0 0 12px ${card.accent}60)`,
                  }}>
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: isFeatured ? "clamp(1.4rem, 2.5vw, 1.8rem)" : "clamp(1.1rem, 2vw, 1.4rem)",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    color: "#fff", lineHeight: 1.1,
                    marginBottom: 12,
                  }}>
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.62rem", color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.7,
                  }}>
                    {card.desc}
                  </p>
                </div>

                {/* Bottom label */}
                <div style={{
                  display: "inline-flex", alignItems: "center",
                  gap: 6, marginTop: 20,
                  borderTop: `1px solid ${card.accent}25`,
                  paddingTop: 14,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: card.accent,
                    boxShadow: `0 0 8px ${card.accent}`,
                  }} />
                  <span style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.44rem", fontWeight: 700,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: card.accent, opacity: 0.9,
                  }}>
                    {card.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        {[
          { dir: -1, side: "left",  label: "prev" },
          { dir:  1, side: "right", label: "next" },
        ].map(({ dir, side, label }) => (
          <button
            key={label}
            onClick={() => scrollTo(Math.max(0, Math.min(CARDS.length - 1, active + dir)))}
            style={{
              position: "absolute",
              [side]: "2vw",
              top: "50%", transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: "50%",
              background: "#fff", border: "1px solid #e0e0e0",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", zIndex: 5,
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            }}
          >
            {dir === -1
              ? <ChevronLeft  size={16} color="#555" />
              : <ChevronRight size={16} color="#555" />}
          </button>
        ))}
      </div>

      {/* Dot nav */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            style={{
              width: i === active ? 20 : 6, height: 6,
              borderRadius: 3,
              background: i === active ? "#111" : "#ddd",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width 0.3s, background 0.3s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
