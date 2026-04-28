"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, ArrowRight } from "lucide-react";

const PRODUCTS = [
  { slug: "eye-of-providence", name: "LIQUID METAL TEE",  price: "₹ 1,899", img: "/hero-model.jpg",        pos: "center top",    label: "APEX", num: "001" },
  { slug: "the-architect",     name: "VOID HOODIE",       price: "₹ 2,999", img: "/tee-floating.jpg",      pos: "center center", label: "CIPHER", num: "002" },
  { slug: "cipher-33",         name: "SHADOW CARGO",      price: "₹ 2,499", img: "/editorial-back.jpg",    pos: "center top",    label: "SACRED", num: "003" },
  { slug: "sacred-geometry",   name: "ABSTRACT TEE",      price: "₹ 1,799", img: "/editorial-portrait.jpg",pos: "center 20%",   label: "APEX", num: "004" },
  { slug: "quantum-eye",       name: "DISTORT CAP",       price: "₹ 999",   img: "/editorial-swirl.jpg",   pos: "center center", label: "CIPHER", num: "005" },
];

/* Tilt effect on card */
function useTilt(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 18;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
      gsap.to(el, { rotateY: x, rotateX: -y, transformPerspective: 800, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);
}

function ProductCard({ p }: { p: typeof PRODUCTS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef as React.RefObject<HTMLElement>);

  return (
    <Link
      href={`/product/${p.slug}`}
      data-cursor
      className="product-card flex-shrink-0"
      style={{ width: "280px", height: "400px", background: "#0a0a0a", border: "1px solid #161616" }}
    >
      <div ref={cardRef} style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}>
        <img src={p.img} alt={p.name} className="card-img" style={{ objectPosition: p.pos }} />
        <div className="card-overlay" />

        {/* Header row */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 z-10">
          <span className="tag">{p.label}</span>
          <span className="section-label">{p.num}</span>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex items-end justify-between">
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", letterSpacing: "0.06em", lineHeight: 1.2 }}>
              {p.name}
            </p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", marginTop: "0.3rem" }}>{p.price}</p>
          </div>

          {/* ADD hover morph */}
          <button
            className="add-btn"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#e8000d", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.2, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
          >
            <Plus size={15} color="white" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedDrop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track   = trackRef.current!;
      const section = sectionRef.current!;

      /* Horizontal scroll pin */
      const trackW = track.scrollWidth - section.offsetWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.2,
          start: "top top",
          end: () => `+=${trackW + 200}`,
          anticipatePin: 1,
        },
      });

      tl.to(track, { x: -trackW, ease: "none" });

      /* Header reveal */
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 85%" },
      });

      /* Card stagger reveal */
      gsap.from(".featured-card", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="h-scroll-outer"
      style={{ background: "#000", borderTop: "1px solid #161616" }}
    >
      {/* Section header */}
      <div
        ref={headerRef}
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid #161616", maxWidth: 1400, margin: "0 auto" }}
      >
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5">
            <div style={{ width: 6, height: 6, background: "#e8000d", borderRadius: "50%" }} />
            <span className="section-label">FEATURED DROP</span>
          </div>
          <div style={{ width: 1, height: 14, background: "#222" }} />
          <h2 className="section-title" style={{ fontSize: "1.1rem" }}>SS&apos;24 COLLECTION</h2>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-2 section-label"
          style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "0.25em", transition: "color 0.2s" }}
        >
          VIEW ALL <ArrowRight size={10} />
        </Link>
      </div>

      {/* Scroll track */}
      <div
        ref={trackRef}
        className="h-scroll-track"
        style={{ padding: "40px 40px 40px 40px", gap: "20px", alignItems: "center" }}
      >
        {/* Left label */}
        <div
          className="flex-shrink-0 flex flex-col gap-3 pr-10"
          style={{ width: 140, borderRight: "1px solid #161616", paddingRight: "2.5rem" }}
        >
          <div>
            <p className="section-label mb-1">TOTAL PIECES</p>
            <p style={{ fontFamily: "Anton, sans-serif", fontSize: "3rem", color: "#fff", lineHeight: 1 }}>05</p>
          </div>
          <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>
            Each piece is a limited<br />statement. No restock.
          </p>
          <button
            className="flex items-center justify-center"
            style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #222", background: "transparent" }}
          >
            <ArrowRight size={14} color="rgba(255,255,255,0.5)" />
          </button>
        </div>

        {/* Cards */}
        {PRODUCTS.map((p) => (
          <div key={p.slug} className="featured-card flex-shrink-0">
            <ProductCard p={p} />
          </div>
        ))}

        {/* End CTA */}
        <Link
          href="/shop"
          className="flex-shrink-0 flex flex-col items-center justify-center gap-4"
          style={{ width: 160, height: 400, border: "1px solid #161616", background: "#080808", textDecoration: "none" }}
          data-cursor
        >
          <ArrowRight size={20} color="#e8000d" />
          <span style={{ fontFamily: "Anton, sans-serif", fontSize: "1.3rem", color: "#fff", letterSpacing: "0.08em", textAlign: "center", lineHeight: 1.1 }}>
            VIEW<br />ALL
          </span>
          <span className="section-label">12 PRODUCTS</span>
        </Link>
      </div>

      {/* Progress bar */}
      <div style={{ height: 1, background: "#0d0d0d", position: "relative" }}>
        <div id="hscroll-bar" style={{ height: "100%", background: "#e8000d", width: "0%", transition: "width 0.1s" }} />
      </div>
    </div>
  );
}
