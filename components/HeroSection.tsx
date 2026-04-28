"use client";

import Link from "next/link";
import { ArrowUpRight, Play, Plus } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden pb-20">
      <div className="absolute inset-0 bg-black" />

      {/* Full-bleed hero photo — person centered */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero-model.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "55% center",
          backgroundRepeat: "no-repeat",
          opacity: 0.8,
        }}
      />

      {/* Gradient: strong left, fade right */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.78) 30%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.08) 100%)",
        }}
      />
      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "25%", background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}
      />
      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "20%", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
      />

      {/* Noise grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          animation: "grain 0.4s steps(2) infinite",
        }}
      />

      {/* Vertical guide line */}
      <div
        className="absolute left-16 top-0 bottom-0 hidden xl:block"
        style={{ width: "1px", background: "linear-gradient(to bottom, transparent, #222 20%, #222 80%, transparent)" }}
      />

      {/* Side numbers */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 z-10">
        {["01", "02", "03"].map((n, i) => (
          <div key={n} className="flex flex-col items-center gap-1">
            <span
              className="text-[0.65rem] font-bold"
              style={{ color: i === 0 ? "var(--color-red)" : "rgba(255,255,255,0.25)", fontFamily: "Space Mono" }}
            >
              {n}
            </span>
            {i < 2 && <div className="w-px h-10" style={{ background: "rgba(255,255,255,0.12)" }} />}
          </div>
        ))}
      </div>

      {/* Rotating circular badge — top right */}
      <div className="absolute top-24 right-8 z-10 hidden lg:block">
        <div className="relative w-[88px] h-[88px]">
          <svg viewBox="0 0 100 100" width={88} height={88} className="rotating-badge">
            <path id="cth" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"/>
            <text fontSize="9.5" fill="rgba(255,255,255,0.55)" fontFamily="Space Mono" letterSpacing="2.8">
              <textPath href="#cth">✦ WILL DIFFERENT · WORN BY ALL · REBELS AFTER ·&nbsp;</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ color: "var(--color-red)", fontSize: "1.4rem" }}>✦</span>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto px-6 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

          {/* ── Left: Content ─────────────────────────── */}
          <div className="lg:col-span-7 space-y-5">
            {/* New drop tag */}
            <div className="flex items-center gap-3">
              <span className="tag-red">NEW DROP</span>
              <span className="flex items-center gap-2 text-gray-400 text-xs font-semibold tracking-widest">
                SS&apos;24 <span style={{ color: "var(--color-red)" }}>——→</span>
              </span>
            </div>

            {/* Headlines */}
            <div>
              <h1
                className="leading-none text-white"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "clamp(4rem, 10.5vw, 9.5rem)",
                  letterSpacing: "0.01em",
                  lineHeight: 0.88,
                }}
              >
                NOT MADE
                <br />TO FIT IN.
              </h1>
              {/* Italic via skewX — Bebas Neue has no real italic, skew looks correct */}
              <span
                className="block leading-none mt-1"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "clamp(2.5rem, 5.5vw, 5.2rem)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                  color: "var(--color-red)",
                  transform: "skewX(-10deg)",
                  transformOrigin: "left center",
                  whiteSpace: "nowrap",
                }}
              >
                MADE TO STAND OUT.
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Iluminatees is more than fabric.
              <br />It&apos;s a mindset. A rebellion. A way of life.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4">
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

          {/* ── Right: Floating product card ─────────── */}
          <div className="lg:col-span-5 hidden lg:flex justify-end items-end pb-2">
            <div
              className="flex items-center gap-3 p-3 pr-4"
              style={{
                background: "rgba(5,5,5,0.97)",
                border: "1px solid #222",
                backdropFilter: "blur(20px)",
                width: "260px",
              }}
            >
              <div
                className="flex-shrink-0"
                style={{ width: "80px", height: "88px", overflow: "hidden", background: "#000" }}
              >
                <img
                  src="/tee-floating.jpg"
                  alt="ANGELO OVERSIZED TEE"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.58rem] text-gray-500 tracking-[0.22em] mb-0.5">NEW ARRIVAL</p>
                <p className="text-[0.8rem] font-bold text-white leading-tight tracking-wide">ANGELO OVERSIZED TEE</p>
                <p className="text-[0.65rem] text-gray-400 mt-0.5">WASHED BLACK</p>
                <p className="text-base font-bold mt-2" style={{ color: "var(--color-red)" }}>₹ 1,899</p>
              </div>
              <button
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--color-red)" }}
              >
                <Plus size={15} color="white" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex items-center gap-3 mt-8">
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
