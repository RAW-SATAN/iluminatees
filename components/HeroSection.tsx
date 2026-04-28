"use client";

import Link from "next/link";
import { ArrowUpRight, Play, Plus } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-black" />

      {/* Red energy — main blob right */}
      <div
        className="absolute"
        style={{
          right: "-5%",
          top: "0%",
          width: "70%",
          height: "100%",
          background: "radial-gradient(ellipse at 55% 45%, rgba(210,0,10,0.38) 0%, rgba(140,0,5,0.22) 30%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute"
        style={{
          right: "10%",
          top: "20%",
          width: "45%",
          height: "65%",
          background: "radial-gradient(ellipse, rgba(200,0,8,0.45) 0%, transparent 60%)",
          filter: "blur(70px)",
          animation: "red-pulse 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: "55%",
          height: "50%",
          background: "radial-gradient(ellipse at 80% 100%, rgba(180,0,5,0.25) 0%, transparent 55%)",
          filter: "blur(60px)",
        }}
      />

      {/* Noise grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          animation: "grain 0.4s steps(2) infinite",
        }}
      />

      {/* Vertical guide line */}
      <div
        className="absolute left-16 top-0 bottom-0 hidden xl:block"
        style={{ width: "1px", background: "linear-gradient(to bottom, transparent, #1f1f1f 20%, #1f1f1f 80%, transparent)" }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* ── Left: Content ─────────────────────────── */}
          <div className="lg:col-span-6 space-y-7">
            <div className="flex items-center gap-3" style={{ animation: "fade-up 0.6s ease both" }}>
              <span className="tag-red">NEW DROP</span>
              <span className="flex items-center gap-2 text-gray-400 text-xs font-semibold tracking-widest">
                SS&apos;24 <span style={{ color: "var(--color-red)" }}>——→</span>
              </span>
            </div>

            <div style={{ animation: "fade-up 0.7s 0.1s ease both" }}>
              <h1
                className="leading-none text-white"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "clamp(4.5rem, 11vw, 10rem)",
                  letterSpacing: "0.01em",
                  lineHeight: 0.9,
                }}
              >
                NOT MADE
                <br />TO FIT IN.
              </h1>
              <h2
                className="leading-none mt-1"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "clamp(3.2rem, 8vw, 7.5rem)",
                  letterSpacing: "0.01em",
                  lineHeight: 0.95,
                  color: "var(--color-red)",
                  fontStyle: "italic",
                }}
              >
                MADE TO STAND OUT.
              </h2>
            </div>

            <p
              className="text-gray-400 text-sm leading-relaxed max-w-sm"
              style={{ animation: "fade-up 0.7s 0.2s ease both" }}
            >
              Iluminatees is more than fabric.
              <br />It&apos;s a mindset. A rebellion. A way of life.
            </p>

            <div
              className="flex items-center gap-4 pt-2"
              style={{ animation: "fade-up 0.7s 0.3s ease both" }}
            >
              <Link href="/shop" className="btn-red">
                EXPLORE DROP <ArrowUpRight size={14} />
              </Link>
              <button className="btn-outline">
                <span className="flex items-center justify-center rounded-full w-6 h-6 border border-white/30">
                  <Play size={8} fill="white" />
                </span>
                WATCH FILM
              </button>
            </div>
          </div>

          {/* ── Right: Person silhouette wearing tee ──── */}
          <div className="lg:col-span-6 relative hidden lg:flex justify-center items-center">
            <div className="relative" style={{ width: "480px", height: "560px" }}>

              {/* Outer dashed ring */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "30px",
                  border: "1px dashed rgba(232,0,13,0.12)",
                }}
              />

              {/* Person SVG — back of person wearing oversized tee */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 320 480" width={320} height={480} aria-hidden>
                  <defs>
                    <radialGradient id="pg" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="rgba(220,0,10,0.3)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                    </radialGradient>
                    <radialGradient id="tee" cx="50%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#1c0006" />
                      <stop offset="55%" stopColor="#0e0002" />
                      <stop offset="100%" stopColor="#050000" />
                    </radialGradient>
                  </defs>

                  {/* Glow behind figure */}
                  <ellipse cx="160" cy="260" rx="140" ry="200" fill="url(#pg)" />

                  {/* HEAD */}
                  <ellipse cx="160" cy="72" rx="36" ry="42" fill="#141414" />
                  {/* Hair volume */}
                  <ellipse cx="160" cy="52" rx="40" ry="22" fill="#0e0e0e" />
                  <ellipse cx="136" cy="56" rx="16" ry="12" fill="#111" />
                  <ellipse cx="184" cy="56" rx="16" ry="12" fill="#111" />
                  <ellipse cx="160" cy="46" rx="20" ry="14" fill="#0c0c0c" />

                  {/* NECK */}
                  <rect x="151" y="110" width="18" height="20" rx="4" fill="#141414" />

                  {/* OVERSIZED TEE — back view */}
                  <path
                    d="M 88,128 C 96,118 118,114 140,114 L 144,128 L 160,122 L 176,128 L 180,114 C 202,114 224,118 232,128 L 252,150 L 276,145 L 288,170 L 268,188 L 252,178 L 252,372 C 252,380 244,386 236,386 L 84,386 C 76,386 68,380 68,372 L 68,178 L 52,188 L 32,170 L 44,145 Z"
                    fill="url(#tee)"
                    stroke="rgba(232,0,13,0.18)"
                    strokeWidth="0.8"
                  />

                  {/* Shirt fold lines */}
                  <line x1="118" y1="132" x2="112" y2="383" stroke="rgba(255,255,255,0.018)" strokeWidth="1.2" />
                  <line x1="160" y1="126" x2="160" y2="383" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                  <line x1="202" y1="132" x2="208" y2="383" stroke="rgba(255,255,255,0.018)" strokeWidth="1.2" />

                  {/* ILUMINATEES back text */}
                  <text
                    x="160" y="228"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.82)"
                    fontSize="17"
                    fontFamily="Bebas Neue, sans-serif"
                    letterSpacing="4.5"
                  >
                    ILUMINATEES
                  </text>

                  {/* Back graphic — angel/wing print */}
                  <g transform="translate(105, 244) scale(0.68)">
                    <path d="M75,48 C50,28 8,38 0,58 C22,48 56,58 66,74Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8"/>
                    <path d="M125,48 C150,28 192,38 200,58 C178,48 144,58 134,74Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8"/>
                    <path d="M100,8 L80,68 L100,58 L120,68Z" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8"/>
                    <line x1="100" y1="8" x2="100" y2="108" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
                    <rect x="96" y="18" width="8" height="30" fill="rgba(232,0,13,0.75)" rx="1"/>
                    <rect x="84" y="28" width="32" height="7" fill="rgba(232,0,13,0.75)" rx="1"/>
                    <ellipse cx="100" cy="82" rx="14" ry="9" fill="none" stroke="rgba(232,0,13,0.55)" strokeWidth="0.9"/>
                    <circle cx="100" cy="82" r="4.5" fill="rgba(232,0,13,0.65)"/>
                  </g>

                  {/* Rim light — red edge lighting */}
                  <path d="M230,130 C244,142 254,158 252,180" fill="none" stroke="rgba(232,0,13,0.4)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M90,130 C76,142 66,158 68,180" fill="none" stroke="rgba(232,0,13,0.25)" strokeWidth="1.5" strokeLinecap="round"/>

                  {/* PANTS */}
                  <path
                    d="M84,383 L76,458 L100,458 L112,410 L124,458 L148,458 L160,392 L172,458 L196,458 L208,410 L220,458 L244,458 L236,383Z"
                    fill="#0c0c0c"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>

              {/* Rotating circular badge */}
              <div className="absolute top-4 right-6">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 100 100" width={80} height={80} className="rotating-badge">
                    <path id="cth" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none"/>
                    <text fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Space Mono" letterSpacing="3">
                      <textPath href="#cth">✦ WILL DIFFERENT · WORN BY ALL · REBELS AFTER ·&nbsp;</textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ color: "var(--color-red)", fontSize: "1.2rem" }}>✦</span>
                  </div>
                </div>
              </div>

              {/* Floating product card */}
              <div
                className="absolute bottom-8 right-0"
                style={{ animation: "fade-up 0.8s 0.4s ease both" }}
              >
                <div
                  className="flex items-center gap-3 p-3 pr-4"
                  style={{
                    background: "rgba(8,8,8,0.96)",
                    border: "1px solid #1f1f1f",
                    backdropFilter: "blur(12px)",
                    width: "230px",
                  }}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: "72px", height: "80px", background: "radial-gradient(circle, #1a0005, #000)" }}
                  >
                    <svg viewBox="0 0 200 240" width={56} height={68} aria-hidden>
                      <path d="M 68,28 C 80,10 120,10 132,28 L 158,16 L 198,52 L 176,80 L 158,64 L 158,232 L 42,232 L 42,64 L 24,80 L 2,52 L 42,16 Z" fill="#1a0008" stroke="rgba(232,0,13,0.4)" strokeWidth="1"/>
                      <text x="100" y="148" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="Bebas Neue, sans-serif" letterSpacing="1.5">ILUMINATEES</text>
                      <ellipse cx="100" cy="108" rx="14" ry="9" fill="none" stroke="rgba(232,0,13,0.5)" strokeWidth="1"/>
                      <circle cx="100" cy="108" r="4" fill="rgba(232,0,13,0.55)"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.6rem] text-gray-500 tracking-[0.2em] mb-0.5">NEW ARRIVAL</p>
                    <p className="text-xs font-bold text-white leading-tight">ANGELO OVERSIZED TEE</p>
                    <p className="text-[0.65rem] text-gray-400 mt-0.5">WASHED BLACK</p>
                    <p className="text-sm font-bold mt-1.5" style={{ color: "var(--color-red)" }}>₹ 1,899</p>
                  </div>
                  <button
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "var(--color-red)" }}
                  >
                    <Plus size={14} color="white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side numbers */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3">
          {["01", "02", "03"].map((n, i) => (
            <div key={n} className="flex flex-col items-center gap-1">
              <span
                className="text-[0.6rem] font-bold"
                style={{ color: i === 0 ? "var(--color-red)" : "rgba(255,255,255,0.2)", fontFamily: "Space Mono" }}
              >
                {n}
              </span>
              {i < 2 && <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.1)" }} />}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-full border flex items-center justify-center"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>
          <span className="text-[0.6rem] font-semibold tracking-[0.3em] text-gray-500">SCROLL TO DISCOVER</span>
        </div>
      </div>
    </section>
  );
}
