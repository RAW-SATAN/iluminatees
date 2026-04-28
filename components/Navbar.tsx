"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/shop", label: "SHOP" },
  { href: "/shop?cat=APEX", label: "COLLECTIONS" },
  { href: "/shop", label: "DROPS" },
  { href: "/#about", label: "ABOUT" },
  { href: "/#community", label: "COMMUNITY" },
];

export function Navbar() {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(0,0,0,0.97)" : "rgba(0,0,0,0.6)",
        borderBottom: scrolled ? "1px solid #1f1f1f" : "1px solid transparent",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-[60px] flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span
            className="font-display text-xl tracking-widest text-white"
            style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "0.15em" }}
          >
            ILUMINATEES<sup className="text-[0.5em] ml-0.5">®</sup>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-[0.7rem] font-semibold tracking-[0.18em] text-gray-400 hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-5">
          <button className="hidden md:flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.2em] text-gray-400 hover:text-white transition-colors">
            <Search size={14} />
            <span>SEARCH</span>
          </button>

          <div
            className="hidden md:block w-px h-4"
            style={{ background: "#2a2a2a" }}
          />

          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
          >
            <ShoppingCart size={14} />
            <span>CART ({itemCount})</span>
          </Link>

          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t" style={{ background: "#000", borderColor: "#1f1f1f" }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-[0.7rem] font-semibold tracking-[0.2em] text-gray-400 hover:text-white border-b transition-colors"
              style={{ borderColor: "#111" }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
