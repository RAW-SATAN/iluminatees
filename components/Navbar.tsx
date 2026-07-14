"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Search, MapPin, Menu, X } from "lucide-react";
import { useCart } from "./CartProvider";

const PLACEHOLDERS = [
  "Search For Tees...",
  "Search For Apex Collection...",
  "Search For Limited Drops...",
  "Search For Sacred Series...",
  "Search For Cipher...",
];

const NAV_CATS = [
  { label: "ALL",          href: "/shop" },
  { label: "COLLECTIONS",  href: "/shop" },
  { label: "DROPS",        href: "/shop" },
  { label: "APEX",         href: "/shop?cat=APEX" },
  { label: "CIPHER",       href: "/shop?cat=CIPHER" },
  { label: "SACRED",       href: "/shop?cat=SACRED" },
  { label: "SALE",         href: "/shop", red: true },
];

const MARQUEE_ITEMS = [
  "NEW ARRIVALS", "EXCLUSIVE DROPS", "LIMITED EDITION",
  "SS'26 COLLECTION", "HEAVYWEIGHT COTTON", "OVERSIZED FIT",
  "FREE SHIPPING ABOVE ₹1,999", "WEAR THE UNSEEN",
];

export function Navbar() {
  const { itemCount } = useCart();
  const [phIdx,     setPhIdx]     = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          background: "#000",
        }}
      >
        {/* ── Top bar ─────────────────────────────────── */}
        <div
          style={{
            borderBottom: "1px solid #1a1a1a",
            height: 62,
            display: "flex", alignItems: "center",
            maxWidth: 1440, margin: "0 auto", padding: "0 1.5rem", gap: 14,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{
              fontFamily: "Anton, sans-serif", fontSize: "1.1rem",
              letterSpacing: "0.12em", color: "#fff",
            }}>
              ILUMINATEES<sup style={{ fontSize: "0.45em", marginLeft: 1 }}>®</sup>
            </span>
          </Link>

          {/* Delivery pin — desktop */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: 4, flexShrink: 0 }}
          >
            <MapPin size={11} color="#555" />
            <span style={{
              fontFamily: "Inter, sans-serif", fontSize: "0.58rem",
              color: "#555", letterSpacing: "0.05em",
            }}>
              DELIVERING TO&nbsp;<strong style={{ color: "#888" }}>IN</strong>
            </span>
          </div>

          {/* Search bar */}
          <div style={{
            flex: 1,
            display: "flex", alignItems: "center", gap: 10,
            background: "#0e0e0e", border: "1px solid #1e1e1e",
            height: 40, padding: "0 14px",
            minWidth: 0,
          }}>
            <Search size={13} color="#555" style={{ flexShrink: 0 }} />
            <input
              className="nav-search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={PLACEHOLDERS[phIdx]}
              style={{
                flex: 1, minWidth: 0,
                background: "none", border: "none", outline: "none",
                fontSize: "0.72rem", color: "#fff",
              }}
            />
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            {/* Wishlist */}
            <button
              style={{ background: "none", border: "none", padding: 0 }}
              className="hidden sm:block"
            >
              <Heart size={18} color="#666" />
            </button>

            {/* Cart */}
            <Link href="/cart" style={{ textDecoration: "none", position: "relative" }}>
              <ShoppingBag size={18} color="#888" />
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

            {/* CTA — desktop */}
            <Link
              href="/shop"
              className="hidden sm:flex"
              style={{
                alignItems: "center", gap: 6, textDecoration: "none",
                background: "#fff", color: "#000",
                fontFamily: "Inter, sans-serif", fontWeight: 800,
                fontSize: "0.56rem", letterSpacing: "0.1em",
                textTransform: "uppercase", padding: "0.55rem 1rem",
                whiteSpace: "nowrap",
              }}
            >
              🎁 CLAIM FREE TEE
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="sm:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              style={{ background: "none", border: "none", padding: 0, color: "#888" }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Category tabs ────────────────────────────── */}
        <div style={{ borderBottom: "1px solid #1a1a1a", background: "#000" }}>
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
                  padding: "0.6rem 1.1rem",
                  fontFamily: "Inter, sans-serif", fontSize: "0.58rem",
                  fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  textDecoration: "none",
                  color: red ? "#e8000d" : "rgba(255,255,255,0.45)",
                  whiteSpace: "nowrap", flexShrink: 0,
                  borderBottom: "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Marquee strip ────────────────────────────── */}
        <div style={{
          borderBottom: "1px solid #111",
          background: "#050505",
          overflow: "hidden",
          padding: "0.4rem 0",
        }}>
          <div className="marquee-track marquee-anim">
            {[0, 1].map((k) => (
              <div key={k} className="marquee-inner">
                {MARQUEE_ITEMS.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: "0.42rem", letterSpacing: "0.3em",
                      color: "rgba(255,255,255,0.28)",
                      display: "flex", alignItems: "center", gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#e8000d", fontSize: "0.35rem" }}>●</span>
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
          background: "rgba(0,0,0,0.98)", paddingTop: 62,
        }}>
          {NAV_CATS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block", padding: "1.1rem 1.5rem",
                borderBottom: "1px solid #161616",
                fontFamily: "Anton, sans-serif",
                fontSize: "1.8rem", letterSpacing: "0.08em",
                textTransform: "uppercase", color: "#fff", textDecoration: "none",
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
