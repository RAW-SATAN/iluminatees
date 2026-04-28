"use client";

import Link from "next/link";
import { ArrowUpRight, Play, Plus } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-black" />

      {/* Full-bleed hero photo — right side */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero-model.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
          opacity: 0.75,
        }}
      />

      {/* Left gradient overlay so text is readable */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.1) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "30%", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}
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
              {/* Italic line — skewX instead of font-style:italic (Bebas has no true italic) */}
              <span
                className="block leading-none mt-2"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "clamp(3rem, 7.5vw, 7rem)",
                  letterSpacing: "0.02em",
                  lineHeight: 0.95,
                  color: "var(--color-red)",
                  transform: "skewX(-10deg)",
                  transformOrigin: "left center",
                }}
              >
                MADE TO STAND OUT.
              </span>
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

          {/* ── Right: Floating product card only ─────── */}
          <div className="lg:col-span-6 relative hidden lg:flex justify-end items-start pt-20">

            {/* Rotating circular badge */}
            <div className="absolute top-8 right-0">
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
              className="mt-32"
              style={{ animation: "fade-up 0.8s 0.4s ease both" }}
            >
              <div
                className="flex items-center gap-3 p-3 pr-4"
                style={{
                  background: "rgba(6,6,6,0.96)",
                  border: "1px solid #1f1f1f",
                  backdropFilter: "blur(16px)",
                  width: "240px",
                }}
              >
                {/* Product thumb — actual tee photo */}
                <div
                  className="flex-shrink-0"
                  style={{
                    width: "72px",
                    height: "80px",
                    overflow: "hidden",
                    background: "#000",
                  }}
                >
                  <img
                    src="/tee-floating.jpg"
                    alt="ANGELO OVERSIZED TEE"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  />
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
