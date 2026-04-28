import Link from "next/link";

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?cat=APEX", label: "Apex Collection" },
  { href: "/shop?cat=CIPHER", label: "Cipher Series" },
  { href: "/shop?cat=SACRED", label: "Sacred Geometry" },
];

const HELP_LINKS = [
  { href: "#", label: "Size Guide" },
  { href: "#", label: "Shipping Info" },
  { href: "#", label: "Returns & Exchanges" },
  { href: "#", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer style={{ background: "#000", borderTop: "1px solid #111" }}>
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12" style={{ borderBottom: "1px solid #111" }}>

          {/* Brand */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/">
              <span
                className="text-white"
                style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.8rem", letterSpacing: "0.12em" }}
              >
                ILUMINATEES<sup style={{ fontSize: "0.45em", marginLeft: "2px" }}>®</sup>
              </span>
            </Link>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
              Not made to fit in. Worn by those who already stand out. Limited drops, heavyweight cotton, zero compromises.
            </p>
            <p className="text-[0.5rem] tracking-[0.35em] text-gray-700">EST. MMXXVI · INDIA</p>

            {/* Social */}
            <div className="flex items-center gap-3 pt-1">
              {["IG", "TW", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center border border-white/10 text-[0.55rem] font-bold tracking-widest text-gray-500 hover:border-red-600 hover:text-white transition-all"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-3 space-y-4">
            <h4
              className="text-[0.6rem] font-bold tracking-[0.35em] text-white"
            >
              SHOP
            </h4>
            {SHOP_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block text-xs text-gray-500 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Help */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[0.6rem] font-bold tracking-[0.35em] text-white">
              HELP
            </h4>
            {HELP_LINKS.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="block text-xs text-gray-500 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <span className="text-[0.55rem] tracking-[0.25em] text-gray-700">
            © 2026 ILUMINATEES. ALL RIGHTS RESERVED.
          </span>
          <div className="flex items-center gap-4 text-[0.55rem] tracking-[0.2em] text-gray-700">
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <span style={{ color: "#222" }}>·</span>
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
            <span style={{ color: "#222" }}>·</span>
            <a href="#" className="hover:text-white transition-colors">COOKIES</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
