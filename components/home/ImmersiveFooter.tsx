"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

function splitToChars(el: HTMLElement) {
  const text = el.textContent || "";
  el.innerHTML = [...text].map(c =>
    c === " "
      ? `<span style="display:inline-block;width:0.28em"> </span>`
      : `<span class="char-wrap"><span class="char-inner">${c}</span></span>`
  ).join("");
  return [...el.querySelectorAll<HTMLElement>(".char-inner")];
}

const FOOTER_NAV = [
  { label: "SHOP", links: ["All Products", "Apex Collection", "Cipher Series", "Sacred Geometry"] },
  { label: "INFO",  links: ["Size Guide", "Shipping", "Returns", "Contact"] },
  { label: "SOCIAL", links: ["Instagram", "TikTok", "YouTube", "Twitter / X"] },
];

export function ImmersiveFooter() {
  const footerRef  = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      /* Big text character reveal */
      if (bigTextRef.current) {
        const chars = splitToChars(bigTextRef.current);
        gsap.from(chars, {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          stagger: 0.018,
          ease: "power4.out",
          scrollTrigger: { trigger: bigTextRef.current, start: "top 88%" },
        });
      }

      /* Nav columns stagger */
      gsap.from(".footer-col", {
        y: 30, opacity: 0,
        duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".footer-nav", start: "top 90%" },
      });

      /* Ambient blob pulse — just CSS animation via class */

    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} style={{ background: "#000", borderTop: "1px solid #161616", position: "relative", overflow: "hidden" }}>

      {/* Ambient blobs */}
      <div className="ambient-blob" style={{ width: 500, height: 500, background: "rgba(232,0,13,0.06)", bottom: -200, left: "10%", animationDelay: "0s" }} />
      <div className="ambient-blob" style={{ width: 400, height: 400, background: "rgba(232,0,13,0.04)", bottom: -150, right: "5%", animationDelay: "3s" }} />

      {/* Big kinetic text */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "80px 24px 0", borderBottom: "1px solid #161616" }}>
        <h2
          ref={bigTextRef}
          style={{
            fontFamily: "Anton, Bebas Neue, Impact, sans-serif",
            fontSize: "clamp(4rem, 12vw, 11rem)",
            lineHeight: 0.87,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "#fff",
            paddingBottom: "2.5rem",
          }}
          aria-label="NOT MADE TO FIT IN."
        >
          NOT MADE<br />TO FIT IN.
        </h2>
      </div>

      {/* Newsletter + Nav */}
      <div
        style={{
          maxWidth: 1400, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
          gap: 0, borderBottom: "1px solid #161616",
        }}
      >
        {/* Newsletter */}
        <div style={{ padding: "48px 40px 48px 24px", borderRight: "1px solid #161616" }}>
          <p className="section-label mb-4">INNER CIRCLE</p>
          <p style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem", letterSpacing: "0.04em", color: "#fff", lineHeight: 0.95, marginBottom: "1.2rem" }}>
            GET EARLY ACCESS<br />TO EVERY DROP.
          </p>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.65, marginBottom: "1.5rem", fontFamily: "Inter, sans-serif" }}>
            Join thousands who never miss a limited release. No spam.
          </p>
          <form action="#" style={{ display: "flex", gap: 0 }}>
            <input
              type="email"
              placeholder="YOUR EMAIL"
              style={{
                flex: 1, background: "transparent",
                border: "1px solid #222", borderRight: "none",
                padding: "0.75rem 1rem",
                fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.15em",
                color: "#fff", fontFamily: "Inter, sans-serif",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#e8000d", border: "none",
                padding: "0 1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ArrowRight size={15} color="#fff" />
            </button>
          </form>
        </div>

        {/* Nav columns */}
        <div className="footer-nav" style={{ display: "contents" }}>
          {FOOTER_NAV.map((col) => (
            <div
              key={col.label}
              className="footer-col"
              style={{ padding: "48px 24px", borderRight: "1px solid #161616" }}
            >
              <p className="section-label mb-5">{col.label}</p>
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="nav-link"
                    style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.12em" }}
                  >{l}</a>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker bottom bar */}
      <div style={{ borderBottom: "1px solid #161616", overflow: "hidden" }}>
        <div className="marquee-wrap">
          <div className="marquee-track marquee-anim" style={{ padding: "10px 0" }}>
            <div className="marquee-inner">
              {[0, 1].map((k) => (
                <span key={k} style={{ fontFamily: "Space Mono, monospace", fontSize: "0.45rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}>
                  © ILUMINATEES 2024  ·  ALL RIGHTS RESERVED  ·  NOT MADE TO FIT IN  ·  WORN BY REBELS  ·  LIMITED DROPS ONLY  ·  EST. MMXXIV  ·  INDIA  ·
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <span style={{ fontFamily: "Anton, sans-serif", fontSize: "1rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)" }}>
          ILUMINATEES<sup style={{ fontSize: "0.4em", marginLeft: 2 }}>®</sup>
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {["SHIPPING","RETURNS","TERMS","PRIVACY"].map((t) => (
            <a key={t} href="#" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >{t}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {["IG","TK","YT","X"].map((s) => (
            <a key={s} href="#"
              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #1c1c1c", fontFamily: "Inter, sans-serif", fontSize: "0.5rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8000d"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1c1c1c"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
