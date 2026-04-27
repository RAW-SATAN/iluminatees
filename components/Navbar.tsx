"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(3,3,3,0.96)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid rgba(201,168,76,0.15)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg width="28" height="28" viewBox="0 0 100 100" className="flex-shrink-0">
            <polygon
              points="50,8 92,80 8,80"
              fill="none"
              stroke="#c9a84c"
              strokeWidth="2.5"
              className="transition-all duration-500 group-hover:stroke-[#ffd700]"
              style={{ filter: "drop-shadow(0 0 4px rgba(201,168,76,0.5))" }}
            />
            <ellipse cx="50" cy="52" rx="11" ry="7" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
            <circle cx="50" cy="52" r="4" fill="#c9a84c" style={{ filter: "drop-shadow(0 0 6px #c9a84c)" }} />
            <line x1="18" y1="80" x2="82" y2="80" stroke="#c9a84c" strokeWidth="1.5" opacity="0.5" />
          </svg>
          <span
            className="font-cinzel font-black tracking-[0.25em] text-sm hidden sm:block"
            style={{
              fontFamily: "var(--font-cinzel)",
              background: "linear-gradient(90deg, #8b6914, #c9a84c, #ffd700, #c9a84c, #8b6914)",
              backgroundSize: "200% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}
          >
            ILUMINATEES
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { href: "/shop", label: "VAULT" },
            { href: "/shop?cat=APEX", label: "APEX" },
            { href: "/shop?cat=CIPHER", label: "CIPHER" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[0.65rem] tracking-[0.3em] transition-colors duration-300"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-muted)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 transition-colors duration-300 group"
          >
            <ShoppingBag
              size={20}
              className="transition-colors duration-300"
              style={{ color: itemCount > 0 ? "var(--color-gold)" : "var(--color-muted)" }}
            />
            {itemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{
                  background: "var(--color-gold)",
                  color: "var(--color-void)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            style={{ color: "var(--color-muted)" }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "rgba(3,3,3,0.98)",
            borderColor: "rgba(201,168,76,0.15)",
          }}
        >
          {[
            { href: "/shop", label: "VAULT" },
            { href: "/shop?cat=APEX", label: "APEX" },
            { href: "/shop?cat=CIPHER", label: "CIPHER" },
            { href: "/cart", label: "ORDER BAG" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-[0.65rem] tracking-[0.3em] border-b"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-muted)",
                borderColor: "rgba(201,168,76,0.08)",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
