"use client";

import Link from "next/link";
import { ArrowUpRight, Play, Plus } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Atmospheric background ─────────────────────── */}
      <div className="absolute inset-0 bg-black" />

      {/* Red energy blobs */}
      <div
        className="absolute"
        style={{
          right: "5%",
          top: "10%",
          width: "55%",
          height: "80%",
          background: "radial-gradient(ellipse at 60% 40%, rgba(200,0,10,0.28) 0%, rgba(120,0,5,0.15) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute"
        style={{
          right: "15%",
          top: "30%",
          width: "30%",
          height: "50%",
          background: "radial-gradient(ellipse, rgba(180,0,8,0.35) 0%, transparent 65%)",
          filter: "blur(60px)",
          animation: "red-pulse 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: "50%",
          height: "40%",
          background: "radial-gradient(ellipse at 80% 100%, rgba(140,0,5,0.2) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
      />

      {/* Subtle noise grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          animation: "grain 0.4s steps(2) infinite",
        }}
      />

      {/* Vertical line left */}
      <div
        className="absolute left-16 top-0 bottom-0 hidden xl:block"
        style={{ width: "1px", background: "linear-gradient(to bottom, transparent, #1f1f1f 20%, #1f1f1f 80%, transparent)" }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* ── Left: Content ─────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-7">
            {/* New drop tag */}
            <div className="flex items-center gap-3" style={{ animation: "fade-up 0.6s ease both" }}>
              <span className="tag-red">NEW DROP</span>
              <span className="flex items-center gap-2 text-gray-400 text-xs font-semibold tracking-widest">
                SS&apos;24 <span style={{ color: "var(--color-red)" }}>——→</span>
              </span>
            </div>

            {/* Main headline */}
            <div style={{ animation: "fade-up 0.7s 0.1s ease both" }}>
              <h1
                className="leading-none text-white"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "clamp(4rem, 10vw, 9rem)",
                  letterSpacing: "0.01em",
                  lineHeight: 0.92,
                }}
              >
                NOT MADE
                <br />TO FIT IN.
              </h1>
              <h2
                className="leading-none mt-1"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "clamp(3rem, 7.5vw, 7rem)",
                  letterSpacing: "0.01em",
                  lineHeight: 0.95,
                  color: "var(--color-red)",
                  fontStyle: "italic",
                }}
              >
                MADE TO STAND OUT.
              </h2>
            </div>

            {/* Description */}
            <p
              className="text-gray-400 text-sm leading-relaxed max-w-sm"
              style={{ animation: "fade-up 0.7s 0.2s ease both" }}
            >
              Iluminatees is more than fabric.
              <br />It&apos;s a mindset. A rebellion. A way of life.
            </p>

            {/* CTAs */}
            <div
              className="flex items-center gap-4 pt-2"
              style={{ animation: "fade-up 0.7s 0.3s ease both" }}
            >
              <Link href="/shop" className="btn-red">
                EXPLORE DROP <ArrowUpRight size={14} />
              </Link>
              <button className="btn-outline">
                <span
                  className="flex items-center justify-center rounded-full w-6 h-6 border border-white/30"
                >
                  <Play size={8} fill="white" />
                </span>
                WATCH FILM
              </button>
            </div>
          </div>

          {/* ── Right: decorative + floating card ────── */}
          <div className="lg:col-span-5 xl:col-span-6 relative hidden lg:flex justify-end items-center">
            {/* Central atmospheric circle */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: "460px", height: "520px" }}
            >
              {/* Outer ring */}
              <div
                className="absolute rounded-full border"
                style={{
                  width: "420px",
                  height: "420px",
                  borderColor: "rgba(232,0,13,0.12)",
                  borderStyle: "dashed",
                }}
              />
              <div
                className="absolute rounded-full border"
                style={{
                  width: "340px",
                  height: "340px",
                  borderColor: "rgba(232,0,13,0.08)",
                }}
              />

              {/* Central red glow */}
              <div
                className="absolute rounded-full"
                style={{
                  width: "260px",
                  height: "260px",
                  background: "radial-gradient(circle, rgba(232,0,13,0.3) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              {/* Angel/wing icon placeholder */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <svg viewBox="0 0 120 160" width={200} height={260} aria-hidden>
                  {/* Stylised wing figure */}
                  <path d="M60,20 C60,20 20,50 10,90 C5,110 15,130 30,140 L60,160 L90,140 C105,130 115,110 110,90 C100,50 60,20 60,20Z"
                    fill="rgba(232,0,13,0.08)" stroke="rgba(232,0,13,0.3)" strokeWidth="0.5"/>
                  <path d="M60,30 L40,80 L60,70 L80,80 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                  <line x1="60" y1="30" x2="60" y2="155" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                  {/* Wings */}
                  <path d="M40,75 C30,65 10,70 5,80 C15,75 35,80 40,90Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
                  <path d="M80,75 C90,65 110,70 115,80 C105,75 85,80 80,90Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
                  {/* Cross */}
                  <rect x="56" y="38" width="8" height="30" fill="rgba(232,0,13,0.4)" rx="1"/>
                  <rect x="48" y="48" width="24" height="6" fill="rgba(232,0,13,0.4)" rx="1"/>
                </svg>

                <span
                  className="tracking-[0.5em] text-center"
                  style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.2)" }}
                >
                  ILUMINATEES
                </span>
              </div>
            </div>

            {/* Floating product card — top right */}
            <div
              className="absolute top-0 right-0"
              style={{ animation: "fade-up 0.8s 0.4s ease both" }}
            >
              <div
                className="flex items-center gap-3 p-3 pr-4"
                style={{
                  background: "rgba(10,10,10,0.92)",
                  border: "1px solid #1f1f1f",
                  backdropFilter: "blur(12px)",
                  width: "230px",
                }}
              >
                {/* Product thumb */}
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: "72px",
                    height: "80px",
                    background: "radial-gradient(circle, #1a0005, #000)",
                  }}
                >
                  <svg viewBox="0 0 200 240" width={56} height={68} aria-hidden>
                    <path d="M 68,28 C 80,10 120,10 132,28 L 158,16 L 198,52 L 176,80 L 158,64 L 158,232 L 42,232 L 42,64 L 24,80 L 2,52 L 42,16 Z"
                      fill="#1a0008" stroke="rgba(232,0,13,0.4)" strokeWidth="1"/>
                    <path d="M60,100 L100,140 L140,100" fill="none" stroke="rgba(232,0,13,0.6)" strokeWidth="2"/>
                    <circle cx="100" cy="90" r="12" fill="none" stroke="rgba(232,0,13,0.5)" strokeWidth="1.5"/>
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[0.6rem] text-gray-500 tracking-[0.2em] mb-0.5">NEW ARRIVAL</p>
                  <p className="text-xs font-bold text-white leading-tight">ANGELO OVERSIZED TEE</p>
                  <p className="text-[0.65rem] text-gray-400 mt-0.5">WASHED BLACK</p>
                  <p className="text-sm font-bold mt-1.5" style={{ color: "var(--color-red)" }}>₹ 1,899</p>
                </div>

                <button
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={{ background: "var(--color-red)" }}
                >
                  <Plus size={14} color="white" />
                </button>
              </div>
            </div>

            {/* Rotating circular badge */}
            <div className="absolute top-4 right-52">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 100 100" width={80} height={80} className="rotating-badge">
                  <path
                    id="circle-text"
                    d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                  />
                  <text fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Space Mono" letterSpacing="3">
                    <textPath href="#circle-text">
                      ✦ WILL DIFFERENT · WORN BY ALL · REBELS AFTER ·&nbsp;
                    </textPath>
                  </text>
                </svg>
                {/* Center star */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ color: "var(--color-red)", fontSize: "1.2rem" }}>✦</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom: Side numbers + scroll indicator ── */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3">
          {["01", "02", "03"].map((n, i) => (
            <div key={n} className="flex flex-col items-center gap-1">
              <span
                className="text-[0.6rem] font-bold"
                style={{
                  color: i === 0 ? "var(--color-red)" : "rgba(255,255,255,0.2)",
                  fontFamily: "Space Mono",
                }}
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
