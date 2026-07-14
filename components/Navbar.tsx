"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Search, MapPin, Menu, X, Headphones } from "lucide-react";
import { useCart } from "./CartProvider";

const PLACEHOLDERS = [
  "Search For Tees...",
  "Search For Apex Collection...",
  "Search For Limited Drops...",
  "Search For Sacred Series...",
  "Search For Cipher...",
  "Search For Oversized Fits...",
];

const NAV_CATS = [
  { label: "ALL",          href: "/shop" },
  { label: "⚡ NEW DROPS", href: "/shop" },
  { label: "BRANDS",       href: "/shop" },
  { label: "APEX",         href: "/shop?cat=APEX" },
  { label: "CIPHER",       href: "/shop?cat=CIPHER" },
  { label: "SACRED",       href: "/shop?cat=SACRED" },
  { label: "ACCESSORIES",  href: "/shop" },
  { label: "SALE",         href: "/shop", red: true },
];

const MARQUEE_ITEMS = [
  "NEW ARRIVALS", "WELCOME", "NEW ARRIVALS", "WELCOME",
  "NEW ARRIVALS", "WELCOME", "NEW ARRIVALS", "WELCOME",
];

export function Navbar() {
  const { itemCount } = useCart();
  const [phIdx,    setPhIdx]    = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [menuOpen, setMenuOpen]  = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "#fff" }}>

        {/* ── Top bar ─────────────────────────────────── */}
        <div style={{
          borderBottom: "1px solid #e8e8e8",
          height: 64,
          display: "flex", alignItems: "center",
          maxWidth: 1440, margin: "0 auto",
          padding: "0 1.5rem", gap: 14,
        }}>
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: "Anton, sans-serif",
                fontSize: "1.05rem", letterSpacing: "0.12em", color: "#111",
              }}>
                ILUMINATEES<sup style={{ fontSize: "0.42em", marginLeft: 1 }}>®</sup>
              </span>
            </Link>
            {/* Delivery line */}
            <div style={{
              display: "flex", alignItems: "center", gap: 3, marginTop: 1,
            }}>
              <MapPin size={9} color="#888" />
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.5rem",
                color: "#888", letterSpacing: "0.04em",
              }}>
                Delivering To&nbsp;<strong style={{ color: "#111" }}>INDIA</strong>&nbsp;▾
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div style={{
            flex: 1, minWidth: 0,
            display: "flex", alignItems: "center", gap: 10,
            background: "#fff", border: "1.5px solid #d8d8d8",
            height: 42, padding: "0 14px",
            borderRadius: 2,
          }}>
            <Search size={13} color="#aaa" style={{ flexShrink: 0 }} />
            <input
              className="nav-search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={PLACEHOLDERS[phIdx]}
              style={{
                flex: 1, minWidth: 0,
                background: "none", border: "none", outline: "none",
                fontSize: "0.72rem",
              }}
            />
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>

            {/* Flag + country */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 16 }}>🇮🇳</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#555", fontWeight: 600 }}>IN</span>
              <span style={{ color: "#ccc" }}>▾</span>
            </div>

            {/* Headphones */}
            <button
              className="hidden md:block"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <Headphones size={18} color="#555" />
            </button>

            {/* Wishlist */}
            <button
              className="hidden sm:block"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <Heart size={18} color="#555" />
            </button>

            {/* Cart */}
            <Link href="/cart" style={{ textDecoration: "none", position: "relative" }}>
              <ShoppingBag size={18} color="#555" />
              {itemCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -6,
                  background: "#e8000d", color: "#fff",
                  width: 15, height: 15, borderRadius: "50%",
                  fontSize: "0.42rem", fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {itemCount}
                </span>
              )}
            </Link>

            {/* CTA button */}
            <Link href="/shop" style={{ textDecoration: "none" }} className="hidden sm:block">
              <div className="btn-black">
                <span>🎁</span>
                <span>CLAIM FREE TEE</span>
                <span style={{
                  background: "#fff", color: "#111",
                  fontSize: "0.52rem", fontWeight: 800,
                  padding: "1px 5px", borderRadius: 2,
                  letterSpacing: "0.05em",
                }}>₹999</span>
              </div>
            </Link>

            {/* Hamburger */}
            <button
              className="sm:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              style={{ background: "none", border: "none", padding: 0, color: "#555", cursor: "pointer" }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Category tabs ────────────────────────────── */}
        <div style={{ borderBottom: "1px solid #e8e8e8", background: "#fff" }}>
          <div
            className="no-scrollbar"
            style={{
              maxWidth: 1440, margin: "0 auto", padding: "0 1.5rem",
              display: "flex", alignItems: "center", overflowX: "auto",
            }}
          >
            {NAV_CATS.map(({ label, href, red }) => (
              <Link
                key={label}
                href={href}
                style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "0.58rem 1.1rem",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.6rem", fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  textDecoration: "none",
                  color: red ? "#e8000d" : "#444",
                  whiteSpace: "nowrap", flexShrink: 0,
                  borderBottom: "2px solid transparent",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Marquee strip ─── dark like Culture Circle ── */}
        <div style={{ background: "#111", overflow: "hidden", padding: "0.38rem 0" }}>
          <div className="marquee-track marquee-anim">
            {[0, 1].map((k) => (
              <div key={k} className="marquee-inner">
                {MARQUEE_ITEMS.map((item, idx) => (
                  <span key={`${k}-${idx}`} style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.5rem", fontWeight: 600,
                    letterSpacing: "0.25em", color: "rgba(255,255,255,0.75)",
                    textTransform: "uppercase",
                    display: "flex", alignItems: "center", gap: "0.6rem",
                  }}>
                    <span style={{ color: "#e8000d", fontSize: "0.4rem" }}>●</span>
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "#fff", paddingTop: 64,
          overflowY: "auto",
        }}>
          {NAV_CATS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block", padding: "1rem 1.5rem",
                borderBottom: "1px solid #f0f0f0",
                fontFamily: "Anton, sans-serif",
                fontSize: "1.6rem", letterSpacing: "0.08em",
                textTransform: "uppercase", color: "#111", textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
