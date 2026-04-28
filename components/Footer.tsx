import Link from "next/link";

const FOOTER_LINKS = ["SHIPPING", "RETURNS", "TERMS", "PRIVACY", "FAQS"];

export function Footer() {
  return (
    <footer style={{ background: "#000", borderTop: "1px solid #111" }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5">

          {/* Left — copyright */}
          <span className="text-[0.55rem] font-bold tracking-[0.25em] text-gray-600">
            © ILUMINATEES 2024
          </span>

          {/* Center — nav links */}
          <nav className="flex items-center gap-5">
            {FOOTER_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                className="text-[0.55rem] font-bold tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right — social */}
          <div className="flex items-center gap-4">
            <span className="text-[0.55rem] font-bold tracking-[0.2em] text-gray-600">FOLLOW US</span>
            {[
              { label: "IG",  href: "#" },
              { label: "TK",  href: "#" },
              { label: "YT",  href: "#" },
              { label: "X",   href: "#" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="w-7 h-7 flex items-center justify-center border border-white/10 text-[0.5rem] font-bold text-gray-500 hover:border-white/30 hover:text-white transition-all"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
