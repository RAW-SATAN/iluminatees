"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function Hero() {
  const eyeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      const iris = eyeRef.current.querySelector(".iris") as SVGElement;
      if (iris) {
        iris.setAttribute("cx", String(100 + dx * 5));
        iris.setAttribute("cy", String(110 + dy * 4));
      }
      const pupil = eyeRef.current.querySelector(".pupil") as SVGElement;
      if (pupil) {
        pupil.setAttribute("cx", String(100 + dx * 5));
        pupil.setAttribute("cy", String(110 + dy * 4));
      }
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Deep background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, #0d0d00 0%, #030303 60%)",
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Outer rings */}
      {[280, 360, 440, 520].map((r, i) => (
        <div
          key={r}
          aria-hidden
          className="absolute rounded-full border"
          style={{
            width: `${r * 2}px`,
            height: `${r * 2}px`,
            borderColor: `rgba(201,168,76,${0.06 - i * 0.01})`,
            animation: `rays-spin ${20 + i * 8}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
          }}
        />
      ))}

      {/* Rotating dashed ring */}
      <div
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: "600px",
          height: "600px",
          border: "1px dashed rgba(201,168,76,0.08)",
          animation: "rays-counter 40s linear infinite",
        }}
      />

      {/* Main eye SVG */}
      <div
        className="relative z-10 mb-12"
        style={{ animation: "eye-pulse 3s ease-in-out infinite" }}
      >
        <svg viewBox="0 0 200 200" width={280} height={280} aria-hidden>
          <defs>
            <radialGradient id="eye-glow" cx="50%" cy="55%" r="50%">
              <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
            </radialGradient>
            <filter id="hero-glow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feComposite in="SourceGraphic" in2="b" operator="over" />
            </filter>
          </defs>

          {/* Glow fill */}
          <circle cx="100" cy="100" r="95" fill="url(#eye-glow)" />

          {/* Rotating outer ring marks */}
          <g style={{ transformOrigin: "100px 100px", animation: "rays-spin 20s linear infinite" }}>
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i * 10) * (Math.PI / 180);
              const r1 = 88, r2 = i % 3 === 0 ? 80 : 84;
              return (
                <line
                  key={i}
                  x1={100 + Math.cos(a) * r1} y1={100 + Math.sin(a) * r1}
                  x2={100 + Math.cos(a) * r2} y2={100 + Math.sin(a) * r2}
                  stroke="#c9a84c" strokeWidth={i % 3 === 0 ? 1.5 : 0.7} opacity={i % 3 === 0 ? 0.6 : 0.3}
                />
              );
            })}
          </g>

          {/* Main triangle */}
          <g filter="url(#hero-glow)">
            <polygon
              points="100,24 178,162 22,162"
              fill="none" stroke="#c9a84c" strokeWidth="1.8"
              style={{ strokeDasharray: 800, animation: "triangle-draw 2s ease-out forwards" }}
            />
            {/* Bricks */}
            <line x1="38" y1="130" x2="162" y2="130" stroke="#c9a84c" strokeWidth="0.7" opacity="0.3" />
            <line x1="52" y1="113" x2="148" y2="113" stroke="#c9a84c" strokeWidth="0.7" opacity="0.25" />
            <line x1="66" y1="96" x2="134" y2="96" stroke="#c9a84c" strokeWidth="0.7" opacity="0.2" />
          </g>

          {/* Eye */}
          <g ref={eyeRef} filter="url(#hero-glow)">
            <ellipse cx="100" cy="110" rx="30" ry="17" fill="none" stroke="#c9a84c" strokeWidth="1.8" />
            {/* Iris */}
            <circle className="iris" cx="100" cy="110" r="11"
              fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="1.4" />
            {/* Inner ring */}
            <circle className="iris" cx="100" cy="110" r="7"
              fill="none" stroke="#c9a84c" strokeWidth="0.7" opacity="0.5" />
            {/* Pupil */}
            <circle className="pupil" cx="100" cy="110" r="4.5"
              fill="#c9a84c"
              style={{ filter: "drop-shadow(0 0 8px #ffd700)" }}
            />
          </g>

          {/* Base line */}
          <line x1="22" y1="162" x2="178" y2="162" stroke="#c9a84c" strokeWidth="1.2" opacity="0.5" />
          {/* Corner marks */}
          {[[22, 162], [178, 162], [100, 24]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="#c9a84c" opacity="0.7" />
          ))}
        </svg>
      </div>

      {/* Brand name */}
      <div className="relative z-10 text-center space-y-5 px-6">
        <div className="relative inline-block">
          <h1
            data-text="ILUMINATEES"
            className="glitch text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.15em]"
            style={{
              fontFamily: "var(--font-cinzel)",
              background: "linear-gradient(180deg, #ffd700 0%, #c9a84c 40%, #8b6914 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ILUMINATEES
          </h1>
        </div>

        <p
          className="text-xs tracking-[0.45em] uppercase"
          style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
        >
          wear the unseen &nbsp;·&nbsp; speak the unspoken
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, var(--color-gold-deep))" }} />
          <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden>
            <polygon points="10,2 18,16 2,16" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
          </svg>
          <div className="h-px w-16" style={{ background: "linear-gradient(90deg, var(--color-gold-deep), transparent)" }} />
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/shop" className="btn-gold inline-block">
            ENTER THE VAULT
          </Link>
          <Link
            href="/shop?cat=APEX"
            className="text-[0.65rem] tracking-[0.3em] pb-px transition-colors duration-300"
            style={{
              color: "var(--color-muted)",
              fontFamily: "var(--font-mono)",
              borderBottom: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            VIEW APEX COLLECTION ↓
          </Link>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: "float-up 2s ease-out 1s both" }}
      >
        <span className="text-[0.5rem] tracking-[0.5em]" style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}>
          SCROLL
        </span>
        <div className="w-px h-12" style={{ background: "linear-gradient(180deg, var(--color-gold-deep), transparent)" }} />
      </div>
    </section>
  );
}
