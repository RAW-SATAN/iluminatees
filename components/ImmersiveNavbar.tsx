"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "./CartProvider";

const LINKS = [
  { href: "/shop",         label: "SHOP" },
  { href: "/shop?cat=APEX",label: "COLLECTIONS" },
  { href: "/shop",         label: "DROPS" },
  { href: "/#about",       label: "ABOUT" },
  { href: "/#community",   label: "COMMUNITY" },
];

export function ImmersiveNavbar() {
  const { itemCount } = useCart();
  const navRef   = useRef<HTMLElement>(null);
  const logoRef  = useRef<HTMLAnchorElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* Initial load — nav slides down */
    gsap.from(navRef.current, { y: -20, opacity: 0, duration: 0.8, delay: 0.15, ease: "power3.out" });

    /* Scroll detection */
    ScrollTrigger.create({
      start: "top -60",
      onToggle: (self) => setScrolled(self.isActive),
    });
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(0,0,0,0.98)" : "transparent",
          borderBottom: scrolled ? "1px solid #161616" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
        }}
      >
        <div
          style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}
        >
          {/* Logo */}
          <Link
            ref={logoRef}
            href="/"
            style={{ textDecoration: "none", flexShrink: 0 }}
            data-cursor
          >
            <span
              style={{
                fontFamily: "Anton, Bebas Neue, sans-serif",
                fontSize: "1.25rem",
                letterSpacing: "0.14em",
                color: "#fff",
              }}
            >
              ILUMINATEES<sup style={{ fontSize: "0.45em", marginLeft: 1 }}>®</sup>
            </span>
          </Link>

          {/* Desktop links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2.5rem" }} className="hidden lg:flex">
            {LINKS.map(({ href, label }) => (
              <Link key={label} href={href} className="nav-link" data-cursor>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexShrink: 0 }}>
            {/* Search */}
            <button
              className="nav-link hidden md:flex items-center gap-1.5"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <span>SEARCH</span>
            </button>

            <div style={{ width: 1, height: 16, background: "#222" }} className="hidden md:block" />

            {/* Cart */}
            <Link href="/cart" className="nav-link flex items-center gap-1.5" data-cursor>
              <ShoppingCart size={13} />
              <span>CART ({itemCount})</span>
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden nav-link"
              style={{ background: "none", border: "none", padding: 0, color: "rgba(255,255,255,0.5)" }}
              onClick={() => setMenuOpen((v) => !v)}
              data-cursor
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.98)", backdropFilter: "blur(20px)", paddingTop: 62 }}
        >
          {LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block", padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #161616",
                fontFamily: "Anton, sans-serif",
                fontSize: "2rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#fff", textDecoration: "none",
              }}
            >{label}</Link>
          ))}
        </div>
      )}
    </>
  );
}
