import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/* Person silhouettes for each tile */
function PersonSilhouette1() {
  // Close-up: face/head looking down, wearing tee
  return (
    <svg viewBox="0 0 200 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="p1g" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(180,0,8,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="200" height="280" fill="#0a0000" />
      <ellipse cx="100" cy="280" rx="120" ry="90" fill="rgba(180,0,8,0.12)" />
      <ellipse cx="100" cy="280" rx="70" ry="50" fill="rgba(180,0,8,0.1)" />
      {/* Head */}
      <ellipse cx="100" cy="85" rx="44" ry="52" fill="#1a1a1a" />
      <ellipse cx="100" cy="62" rx="46" ry="26" fill="#141414" />
      {/* Neck */}
      <rect x="91" y="133" width="18" height="22" rx="4" fill="#1a1a1a" />
      {/* Shirt collar area */}
      <path d="M 60,150 C 70,140 88,136 100,136 C 112,136 130,140 140,150 L 155,172 L 45,172 Z" fill="#111" stroke="rgba(232,0,13,0.15)" strokeWidth="0.5" />
      {/* Body */}
      <rect x="42" y="170" width="116" height="110" rx="2" fill="#0e0e0e" />
      {/* ILUMINATEES text on shirt */}
      <text x="100" y="230" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="Bebas Neue, sans-serif" letterSpacing="3">ILUMINATEES</text>
      {/* Eye graphic */}
      <ellipse cx="100" cy="210" rx="12" ry="7" fill="none" stroke="rgba(232,0,13,0.5)" strokeWidth="0.8"/>
      <circle cx="100" cy="210" r="3.5" fill="rgba(232,0,13,0.6)"/>
      {/* Red rim */}
      <path d="M42,170 L42,280" stroke="rgba(232,0,13,0.2)" strokeWidth="1"/>
      <path d="M158,170 L158,280" stroke="rgba(232,0,13,0.1)" strokeWidth="1"/>
      <ellipse cx="100" cy="280" rx="58" ry="12" fill="rgba(0,0,0,0.6)" />
    </svg>
  );
}

function PersonSilhouette2() {
  // Red swirl/fabric detail
  return (
    <svg viewBox="0 0 200 220" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="p2g" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(220,0,10,0.5)" />
          <stop offset="50%" stopColor="rgba(160,0,5,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="200" height="220" fill="#050000" />
      <ellipse cx="100" cy="110" rx="100" ry="110" fill="url(#p2g)" />
      {/* Swirl lines */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <path
          key={i}
          d={`M ${100 + Math.cos(i * 0.785) * 80},${110 + Math.sin(i * 0.785) * 70} Q 100,110 ${100 + Math.cos((i + 4) * 0.785) * 80},${110 + Math.sin((i + 4) * 0.785) * 70}`}
          fill="none"
          stroke="rgba(232,0,13,0.2)"
          strokeWidth="0.6"
        />
      ))}
      <circle cx="100" cy="110" r="55" fill="none" stroke="rgba(232,0,13,0.15)" strokeWidth="0.5" strokeDasharray="4 6"/>
      <circle cx="100" cy="110" r="35" fill="none" stroke="rgba(232,0,13,0.1)" strokeWidth="0.5"/>
      <circle cx="100" cy="110" r="18" fill="rgba(232,0,13,0.08)"/>
      <circle cx="100" cy="110" r="8" fill="rgba(232,0,13,0.18)"/>
      {/* Fabric texture lines */}
      {Array.from({length: 8}, (_,i) => (
        <line key={i} x1="0" y1={i*28} x2="200" y2={i*28+12} stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
      ))}
    </svg>
  );
}

function PersonSilhouette3() {
  // Person wearing tee, front facing
  return (
    <svg viewBox="0 0 200 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="p3g" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(180,0,8,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="200" height="280" fill="#080000" />
      <ellipse cx="100" cy="140" rx="110" ry="130" fill="url(#p3g)" />
      {/* Head */}
      <ellipse cx="100" cy="72" rx="38" ry="44" fill="#191919" />
      <ellipse cx="100" cy="52" rx="40" ry="22" fill="#131313" />
      {/* Neck */}
      <rect x="92" y="114" width="16" height="20" rx="4" fill="#191919" />
      {/* Tee front */}
      <path d="M 62,132 C 72,122 88,118 100,118 C 112,118 128,122 138,132 L 152,155 L 48,155 Z" fill="#111" stroke="rgba(232,0,13,0.12)" strokeWidth="0.5"/>
      <rect x="45" y="153" width="110" height="127" rx="1" fill="#0d0d0d" />
      {/* Front ILUMINATEES */}
      <text x="100" y="200" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9.5" fontFamily="Bebas Neue, sans-serif" letterSpacing="3">ILUMINATEES</text>
      {/* Wings/angel small */}
      <path d="M75,218 C65,210 48,215 42,224 C54,218 72,224 78,232Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>
      <path d="M125,218 C135,210 152,215 158,224 C146,218 128,224 122,232Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>
      <rect x="97" y="212" width="6" height="22" fill="rgba(232,0,13,0.6)" rx="1"/>
      <rect x="89" y="220" width="22" height="5" fill="rgba(232,0,13,0.6)" rx="1"/>
      {/* Arms */}
      <path d="M45,155 L30,220 L44,222 L56,175Z" fill="#0e0e0e"/>
      <path d="M155,155 L170,220 L156,222 L144,175Z" fill="#0e0e0e"/>
      {/* Red rim */}
      <path d="M45,155 L30,220" stroke="rgba(232,0,13,0.2)" strokeWidth="0.8"/>
    </svg>
  );
}

function PersonSilhouette4() {
  // Group / community — multiple silhouettes
  return (
    <svg viewBox="0 0 200 220" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="p4g" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="rgba(140,0,5,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="200" height="220" fill="#050505" />
      <ellipse cx="100" cy="220" rx="140" ry="80" fill="url(#p4g)" />
      {/* Person 1 — center */}
      <ellipse cx="100" cy="72" rx="28" ry="34" fill="#161616" />
      <rect x="72" y="104" width="56" height="116" rx="2" fill="#111" />
      {/* Person 2 — left */}
      <ellipse cx="46" cy="88" rx="22" ry="28" fill="#131313" />
      <rect x="24" y="114" width="44" height="106" rx="2" fill="#0e0e0e" />
      {/* Person 3 — right */}
      <ellipse cx="154" cy="88" rx="22" ry="28" fill="#131313" />
      <rect x="132" y="114" width="44" height="106" rx="2" fill="#0e0e0e" />
      {/* Star badge */}
      <text x="100" y="145" textAnchor="middle" fill="rgba(232,0,13,0.7)" fontSize="18">✦</text>
      {/* Red light from above */}
      <ellipse cx="100" cy="10" rx="60" ry="20" fill="rgba(232,0,13,0.15)" />
      <line x1="100" y1="10" x2="60" y2="115" stroke="rgba(232,0,13,0.06)" strokeWidth="40"/>
    </svg>
  );
}

export function EditorialGrid() {
  return (
    <section style={{ background: "#000", borderTop: "1px solid #111" }}>
      <div className="max-w-[1400px] mx-auto">
        {/* 4-column grid exactly matching reference */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ minHeight: "380px" }}>

          {/* Tile 1 — OVERSIZED FIT */}
          <Link
            href="/shop"
            className="editorial-tile group relative flex flex-col justify-end overflow-hidden"
            style={{ background: "#080000", borderRight: "1px solid #111", minHeight: "380px" }}
          >
            <div className="absolute inset-0">
              <PersonSilhouette1 />
            </div>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 75%)" }}
            />
            <div className="relative z-10 p-5 space-y-2">
              <h3
                className="text-white leading-none"
                style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.55rem", letterSpacing: "0.04em" }}
              >
                OVERSIZED FIT.<br />MAXIMUM IMPACT.
              </h3>
              <a
                href="/shop"
                className="flex items-center gap-2 text-[0.6rem] font-bold tracking-[0.2em] group-hover:text-red-500 transition-colors"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                EXPLORE FITS <span>——→</span>
              </a>
            </div>
          </Link>

          {/* Tile 2 — PREMIUM HEAVYWEIGHT */}
          <Link
            href="/shop"
            className="editorial-tile group relative flex flex-col justify-end overflow-hidden"
            style={{ background: "#050000", borderRight: "1px solid #111", minHeight: "380px" }}
          >
            <div className="absolute inset-0">
              <PersonSilhouette2 />
            </div>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, transparent 80%)" }}
            />
            <div className="relative z-10 p-5 space-y-2">
              <p className="text-[0.5rem] font-bold tracking-[0.3em]" style={{ color: "var(--color-red)" }}>QUALITY</p>
              <h3
                className="text-white leading-none"
                style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.55rem", letterSpacing: "0.04em" }}
              >
                PREMIUM<br />HEAVYWEIGHT<br />240 GSM
              </h3>
              <a
                href="/shop"
                className="flex items-center gap-2 text-[0.6rem] font-bold tracking-[0.2em] group-hover:text-red-500 transition-colors"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                FEEL THE QUALITY <span>——→</span>
              </a>
            </div>
          </Link>

          {/* Tile 3 — DESIGNED TO BREAK RULES */}
          <Link
            href="/#about"
            className="editorial-tile group relative flex flex-col justify-end overflow-hidden"
            style={{ background: "#060000", borderRight: "1px solid #111", minHeight: "380px" }}
          >
            <div className="absolute inset-0">
              <PersonSilhouette3 />
            </div>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, transparent 80%)" }}
            />
            <div className="relative z-10 p-5 space-y-2">
              <h3
                className="text-white leading-none"
                style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.55rem", letterSpacing: "0.04em" }}
              >
                DESIGNED<br />TO BREAK<br />RULES.
              </h3>
              <a
                href="/#about"
                className="flex items-center gap-2 text-[0.6rem] font-bold tracking-[0.2em] group-hover:text-red-500 transition-colors"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                OUR STORY <span>——→</span>
              </a>
            </div>
            {/* Red side strip */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "var(--color-red)" }}
            />
          </Link>

          {/* Tile 4 — COMMUNITY */}
          <Link
            href="/#community"
            className="editorial-tile group relative flex flex-col justify-end overflow-hidden"
            style={{ background: "#050505", minHeight: "380px" }}
          >
            <div className="absolute inset-0">
              <PersonSilhouette4 />
            </div>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, transparent 80%)" }}
            />
            {/* ILUMINATEES sideways text */}
            <div
              className="absolute right-0 top-0 bottom-0 flex items-center justify-center"
              style={{ width: "28px", background: "var(--color-red)" }}
            >
              <span
                className="text-white text-[0.55rem] font-bold tracking-[0.3em]"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  letterSpacing: "0.3em",
                }}
              >
                ILUMINATEES
              </span>
            </div>
            <div className="relative z-10 p-5 pr-10 space-y-2">
              <h3
                className="text-white leading-none"
                style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.55rem", letterSpacing: "0.04em" }}
              >
                A COMMUNITY<br />THAT CREATES.
              </h3>
              <a
                href="/#community"
                className="flex items-center gap-2 text-[0.6rem] font-bold tracking-[0.2em] group-hover:text-red-500 transition-colors"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                JOIN US <span>——→</span>
              </a>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
