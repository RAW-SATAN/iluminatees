import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

const DROP_ITEMS = [
  { slug: "eye-of-providence",   name: "LIQUID METAL TEE",  price: "₹ 1,899", color: "#0d0005", accent: "#cc0010" },
  { slug: "the-architect",       name: "VOID HOODIE",       price: "₹ 2,999", color: "#050010", accent: "#4400cc" },
  { slug: "cipher-33",           name: "SHADOW CARGO",      price: "₹ 2,499", color: "#050505", accent: "#333" },
  { slug: "sacred-geometry",     name: "ABSTRACT TEE",      price: "₹ 1,799", color: "#0a0a14", accent: "#888" },
  { slug: "quantum-eye",         name: "DISTORT CAP",       price: "₹ 999",   color: "#00100f", accent: "#00aa88" },
];

function MiniMockup({ color, accent }: { color: string; accent: string }) {
  return (
    <svg viewBox="0 0 200 240" width={110} height={132} aria-hidden>
      <defs>
        <radialGradient id={`g-${accent.replace("#","")}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>
      <path
        d="M 68,28 C 80,10 120,10 132,28 L 158,16 L 198,52 L 176,80 L 158,64 L 158,232 L 42,232 L 42,64 L 24,80 L 2,52 L 42,16 Z"
        fill={`url(#g-${accent.replace("#","")})`}
        stroke={accent}
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
      <circle cx="100" cy="128" r="28" fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="128" r="10" fill={accent} opacity="0.3" />
    </svg>
  );
}

export function DropStrip() {
  return (
    <section style={{ background: "#000", borderTop: "1px solid #111", borderBottom: "1px solid #111" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex">
          {/* ── Left label ─────────────────────────── */}
          <div
            className="flex-shrink-0 flex flex-col justify-center gap-3 px-6 py-8"
            style={{ width: "160px", borderRight: "1px solid #111" }}
          >
            <span className="tag-red text-[0.5rem]">FEATURED</span>
            <h2
              className="text-white text-lg leading-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "0.05em" }}
            >
              DROP
              <br />
              PIECES
            </h2>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 hover:border-red-600 hover:bg-red-600/10 transition-all"
            >
              <ArrowRight size={14} className="text-white" />
            </button>
          </div>

          {/* ── Horizontal scroll ──────────────────── */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex" style={{ minWidth: "max-content" }}>
              {DROP_ITEMS.map((item, i) => (
                <Link
                  key={i}
                  href={`/product/${item.slug}`}
                  className="strip-card flex-shrink-0 flex flex-col group"
                  style={{
                    width: "180px",
                    borderRight: "1px solid #111",
                    borderLeft: "none",
                    borderTop: "none",
                    borderBottom: "none",
                    background: "#0a0a0a",
                  }}
                >
                  {/* NEW badge */}
                  <div className="relative pt-3 px-3">
                    <span className="tag-red text-[0.45rem] px-1.5 py-0.5">NEW</span>
                  </div>

                  {/* Image */}
                  <div
                    className="flex items-center justify-center py-4"
                    style={{ background: `radial-gradient(circle at 50% 40%, ${item.color}dd, #000)` }}
                  >
                    <MiniMockup color={item.color} accent={item.accent} />
                  </div>

                  {/* Info */}
                  <div className="px-4 pb-5 space-y-1 mt-auto">
                    <p className="text-xs font-bold text-white tracking-wide group-hover:text-red-500 transition-colors">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Countdown ──────────────────────────── */}
          <div
            className="flex-shrink-0 flex items-center px-8 py-8"
            style={{ width: "220px", borderLeft: "1px solid #111" }}
          >
            <CountdownTimer />
          </div>
        </div>
      </div>
    </section>
  );
}
