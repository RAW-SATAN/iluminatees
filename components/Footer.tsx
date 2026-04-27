import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="relative mt-24 border-t"
      style={{ borderColor: "rgba(201,168,76,0.1)", background: "var(--color-onyx)" }}
    >
      {/* Top gold line */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-gold-deep), var(--color-gold), var(--color-gold-deep), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 100 100" aria-hidden>
              <polygon points="50,8 92,80 8,80" fill="none" stroke="#c9a84c" strokeWidth="2.5" />
              <ellipse cx="50" cy="52" rx="11" ry="7" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
              <circle cx="50" cy="52" r="4" fill="#c9a84c" />
            </svg>
            <span
              className="font-black tracking-[0.25em] text-sm"
              style={{ fontFamily: "var(--font-cinzel)", color: "var(--color-gold)" }}
            >
              ILUMINATEES
            </span>
          </div>
          <p className="text-xs leading-relaxed max-w-sm" style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}>
            Secret society streetwear for those who already know. Limited drops.
            Heavyweight cotton. Symbols that predate your civilization.
          </p>
          <p className="text-[0.5rem] tracking-[0.3em]" style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}>
            EST. MMXXVI · INDIA
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h4
            className="text-[0.6rem] tracking-[0.4em]"
            style={{ color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}
          >
            THE VAULT
          </h4>
          {[
            { href: "/shop", label: "All Threads" },
            { href: "/shop?cat=APEX", label: "Apex Collection" },
            { href: "/shop?cat=CIPHER", label: "Cipher Collection" },
            { href: "/shop?cat=SACRED", label: "Sacred Collection" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-xs transition-colors duration-300 hover:text-[var(--color-gold)]"
              style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* The Order */}
        <div className="space-y-4">
          <h4
            className="text-[0.6rem] tracking-[0.4em]"
            style={{ color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}
          >
            THE ORDER
          </h4>
          {[
            { href: "#", label: "Size Guide" },
            { href: "#", label: "Shipping Info" },
            { href: "#", label: "Returns" },
            { href: "#", label: "Contact" },
          ].map(({ href, label }) => (
            <a
              key={label}
              href={href}
              className="block text-xs transition-colors duration-300 hover:text-[var(--color-gold)]"
              style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderColor: "rgba(201,168,76,0.08)" }}
      >
        <span className="text-[0.5rem] tracking-[0.3em]" style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}>
          © MMXXVI ILUMINATEES. ALL RIGHTS RESERVED. ALL TRUTHS ENCRYPTED.
        </span>
        <div className="flex items-center gap-2">
          {["INSTAGRAM", "TWITTER"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-[0.5rem] tracking-[0.25em] px-3 py-1.5 transition-all duration-300 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-dim)",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
