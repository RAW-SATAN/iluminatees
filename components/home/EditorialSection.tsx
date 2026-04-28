"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

/* Scroll-reveal helper */
function useReveal(ref: React.RefObject<HTMLElement | null>, opts?: ScrollTrigger.Vars) {
  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    gsap.fromTo(
      el,
      { y: 48, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", ...opts },
      }
    );
  }, [opts]);
}

/* Individual editorial block */
function EdBlock({
  img, imgPos = "center center", icon, label, headline, sub, href, accent = false,
  children,
}: {
  img: string; imgPos?: string; icon: string; label: string;
  headline: string; sub: string; href: string; accent?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /* depth hover */
  const onEnter = () => gsap.to(ref.current, { y: -6, duration: 0.4, ease: "power2.out" });
  const onLeave = () => gsap.to(ref.current, { y:  0, duration: 0.6, ease: "power3.out" });

  return (
    <Link
      href={href}
      style={{ display: "block", textDecoration: "none", height: "100%" }}
      data-cursor
    >
      <div
        ref={ref}
        className="ed-block"
        style={{ height: "100%", border: "1px solid #161616" }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <img src={img} alt={label} className="ed-img" style={{ objectPosition: imgPos }} />
        <div className="ed-overlay" />

        {/* Icon badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: "50%",
              background: accent ? "#e8000d" : "#fff",
              color: accent ? "#fff" : "#000",
              fontSize: "0.75rem", fontWeight: 700,
            }}
          >{icon}</span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10 space-y-2">
          <p className="section-label" style={{ color: accent ? "#e8000d" : "rgba(255,255,255,0.4)" }}>{label}</p>
          <h3
            style={{
              fontFamily: "Anton, Bebas Neue, sans-serif",
              fontSize: "clamp(1.3rem,2.2vw,1.9rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 0.95,
            }}
          >
            {headline}
          </h3>
          <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif" }}>{sub}</p>
          <div
            className="flex items-center gap-2 pt-1"
            style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif" }}
          >
            EXPLORE <ArrowUpRight size={10} />
          </div>
        </div>

        {children}
      </div>
    </Link>
  );
}

/* Marquee strip */
function MarqueeStrip({ text, reverse }: { text: string; reverse?: boolean }) {
  const inner = Array.from({ length: 4 }, () => text).join("  ·  ");
  return (
    <div className="marquee-wrap" style={{ borderTop: "1px solid #161616", borderBottom: "1px solid #161616", background: "#080808" }}>
      <div className={`marquee-track marquee-anim${reverse ? " rev" : ""}`}>
        <div className="marquee-inner">
          {[inner, inner].map((t, i) => (
            <span key={i} style={{ fontFamily: "Anton, sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.12)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EditorialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      /* Section heading reveal */
      gsap.from(headRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: headRef.current, start: "top 85%" } });

      /* Each block stagger */
      gsap.from(".ed-reveal", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ed-grid", start: "top 78%" },
      });

      /* Mini strip items */
      gsap.from(".mini-block", {
        scale: 0.94,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".mini-strip", start: "top 85%" },
      });

      /* Parallax on large block image */
      gsap.to(".ed-parallax", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "#000" }}>
      {/* Marquee top */}
      <MarqueeStrip text="OVERSIZED FIT · MAXIMUM IMPACT · PREMIUM 240GSM · LIMITED DROPS · NOT MADE TO FIT IN · MADE TO STAND OUT" />

      {/* Section header */}
      <div
        ref={headRef}
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid #161616", maxWidth: 1400, margin: "0 auto" }}
      >
        <div className="flex items-center gap-4">
          <span className="tag">EDITORIAL</span>
          <h2 className="section-title" style={{ fontSize: "1.1rem" }}>THE CULTURE</h2>
        </div>
        <Link href="/shop" style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          VIEW ALL <ArrowUpRight size={10} />
        </Link>
      </div>

      {/* Main 4-column grid */}
      <div
        className="ed-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gridTemplateRows: "440px",
          maxWidth: 1400, margin: "0 auto",
          borderBottom: "1px solid #161616",
        }}
      >
        <div className="ed-reveal" style={{ borderRight: "1px solid #161616" }}>
          <EdBlock
            img="/editorial-portrait.jpg" imgPos="center 15%"
            icon="✚" label="OVERSIZED FIT" accent
            headline={"OVERSIZED FIT.\nMAXIMUM\nIMPACT."}
            sub="Heavyweight 240gsm cotton. Cut for dominance."
            href="/shop"
          >
            {/* Extra: ILUMINATEES vert label */}
          </EdBlock>
        </div>
        <div className="ed-reveal" style={{ borderRight: "1px solid #161616" }}>
          <EdBlock
            img="/editorial-swirl.jpg" imgPos="center center"
            icon="⊕" label="QUALITY"
            headline={"PREMIUM\nHEAVYWEIGHT\n240 GSM"}
            sub="Feel the difference. Built to outlast the trend."
            href="/shop"
          />
        </div>
        <div className="ed-reveal" style={{ borderRight: "1px solid #161616" }}>
          <EdBlock
            img="/tee-floating.jpg" imgPos="center center"
            icon="✦" label="SS'24 DROP"
            headline={"DESIGNED\nTO BREAK\nRULES."}
            sub="Our story. Our rules. No compromises."
            href="/#about"
          />
        </div>
        <div className="ed-reveal" style={{ position: "relative" }}>
          <EdBlock
            img="/editorial-back.jpg" imgPos="center top"
            icon="⊞" label="COMMUNITY"
            headline={"A COMMUNITY\nTHAT CREATES."}
            sub="Join the movement. Not a brand. A rebellion."
            href="/#community"
          />
          {/* Sideways ILUMINATEES strip */}
          <div
            className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-20"
            style={{ width: 28, background: "#e8000d" }}
          >
            <span className="vert-label" style={{ color: "#fff", letterSpacing: "0.35em" }}>ILUMINATEES</span>
          </div>
        </div>
      </div>

      {/* Mini photo strip */}
      <div
        className="mini-strip"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "160px",
          maxWidth: 1400, margin: "0 auto",
          borderBottom: "1px solid #161616",
        }}
      >
        {[
          { img: "/editorial-portrait.jpg", pos: "center 30%", label: "PORTRAIT" },
          { img: "/editorial-swirl.jpg",    pos: "center center", label: "ENERGY" },
          { img: "/hero-model.jpg",         pos: "center 40%", label: "EDITORIAL" },
          { img: "/editorial-back.jpg",     pos: "center 30%", label: "CULTURE" },
        ].map((item, i) => (
          <div
            key={i}
            className="mini-block ed-block"
            style={{ borderRight: i < 3 ? "1px solid #161616" : "none", position: "relative" }}
          >
            <img src={item.img} alt={item.label} className="ed-img" style={{ objectPosition: item.pos, filter: "brightness(0.55) contrast(1.1)" }} />
            <div className="ed-overlay" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }} />
            <span
              className="absolute bottom-3 left-3 section-label z-10"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Marquee bottom */}
      <MarqueeStrip text="WORN BY REBELS · NO RESTOCKS · LIMITED ONLY · JOIN THE MOVEMENT · ILUMINATEES ®" reverse />
    </section>
  );
}
