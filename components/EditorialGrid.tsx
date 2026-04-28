import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const TILES = [
  {
    label: "SS'24 COLLECTION",
    title: "THE VOID\nSERIES",
    sub: "12 pieces. Each one a statement.",
    href: "/shop",
    accent: "#e8000d",
    bg: "#0d0000",
    size: "large",
  },
  {
    label: "LOOKBOOK",
    title: "WORN BY\nREBELS",
    sub: "See how the underground wears it.",
    href: "/shop",
    accent: "#fff",
    bg: "#050505",
    size: "small",
  },
  {
    label: "LIMITED DROP",
    title: "LIQUID\nMETAL",
    sub: "Only 33 units. No restock.",
    href: "/product/eye-of-providence",
    accent: "#e8000d",
    bg: "#0a0a00",
    size: "small",
  },
  {
    label: "BEHIND THE BRAND",
    title: "NOT MADE\nTO FIT IN.",
    sub: "Our story. Our rules.",
    href: "/#about",
    accent: "#555",
    bg: "#050505",
    size: "small",
  },
];

function TilePattern({ seed }: { seed: number }) {
  const lines = Array.from({ length: 6 }, (_, i) => i);
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 400"
    >
      {lines.map((i) => (
        <line
          key={i}
          x1={seed % 2 === 0 ? 0 : 400}
          y1={i * 70 - 10}
          x2={seed % 2 === 0 ? 400 : 0}
          y2={i * 70 + 60}
          stroke="white"
          strokeWidth="0.8"
        />
      ))}
      <circle cx={200 + seed * 30} cy={200} r="100" fill="none" stroke="white" strokeWidth="0.5" />
      <circle cx={200 + seed * 30} cy={200} r="60" fill="none" stroke="white" strokeWidth="0.3" />
    </svg>
  );
}

export function EditorialGrid() {
  return (
    <section style={{ background: "#000", borderTop: "1px solid #111" }}>
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between px-6 py-6" style={{ borderBottom: "1px solid #111" }}>
          <div className="flex items-center gap-4">
            <span className="tag-red text-[0.5rem]">EDITORIAL</span>
            <h2
              className="text-white text-lg"
              style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "0.08em" }}
            >
              THE CULTURE
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
          >
            VIEW ALL <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ minHeight: "480px" }}>
          {/* Large tile — spans 2 rows on md */}
          <Link
            href={TILES[0].href}
            className="editorial-tile group relative col-span-2 md:col-span-2 md:row-span-2 flex flex-col justify-end p-8"
            style={{ background: TILES[0].bg, borderRight: "1px solid #111", minHeight: "400px" }}
          >
            <TilePattern seed={0} />
            {/* Red glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 70% 30%, rgba(232,0,13,0.2) 0%, transparent 65%)",
              }}
            />
            {/* Large SVG decoration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 200 200" width={280} height={280} aria-hidden className="opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-700">
                <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 6" />
                <circle cx="100" cy="100" r="65" fill="none" stroke="white" strokeWidth="0.3" />
                <polygon points="100,20 174,160 26,160" fill="none" stroke="white" strokeWidth="0.8" />
                <ellipse cx="100" cy="120" rx="18" ry="11" fill="none" stroke="white" strokeWidth="1" />
                <circle cx="100" cy="120" r="5" fill="rgba(232,0,13,0.6)" />
              </svg>
            </div>
            {/* Content */}
            <div className="relative z-10 space-y-3">
              <span className="tag-red text-[0.45rem]">{TILES[0].label}</span>
              <h3
                className="text-white leading-none"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  letterSpacing: "0.04em",
                  whiteSpace: "pre-line",
                }}
              >
                {TILES[0].title}
              </h3>
              <p className="text-gray-500 text-xs">{TILES[0].sub}</p>
              <div className="flex items-center gap-2 pt-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: "var(--color-red)" }}
                >
                  <ArrowUpRight size={12} color="white" />
                </div>
                <span className="text-[0.6rem] font-bold tracking-[0.2em] text-white">EXPLORE</span>
              </div>
            </div>
          </Link>

          {/* Small tiles */}
          {TILES.slice(1).map((tile, i) => (
            <Link
              key={i}
              href={tile.href}
              className="editorial-tile group relative flex flex-col justify-end p-6"
              style={{
                background: tile.bg,
                borderRight: i < 2 ? "1px solid #111" : "none",
                borderBottom: "1px solid #111",
                minHeight: "240px",
              }}
            >
              <TilePattern seed={i + 1} />
              <div className="relative z-10 space-y-2">
                <span
                  className="text-[0.45rem] font-bold tracking-[0.25em]"
                  style={{ color: tile.accent === "#e8000d" ? "var(--color-red)" : tile.accent }}
                >
                  {tile.label}
                </span>
                <h3
                  className="text-white leading-none"
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "1.8rem",
                    letterSpacing: "0.04em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {tile.title}
                </h3>
                <p className="text-gray-600 text-[0.7rem]">{tile.sub}</p>
              </div>
              <div
                className="absolute top-4 right-4 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowUpRight size={10} color="white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
