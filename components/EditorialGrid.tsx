import Link from "next/link";

const TILES = [
  {
    img: "/editorial-portrait.jpg",
    imgPosition: "center top",
    label: null,
    title: "OVERSIZED FIT.\nMAXIMUM IMPACT.",
    cta: "EXPLORE FITS",
    href: "/shop",
  },
  {
    img: "/editorial-swirl.jpg",
    imgPosition: "center center",
    label: "QUALITY",
    title: "PREMIUM\nHEAVYWEIGHT\n240 GSM",
    cta: "FEEL THE QUALITY",
    href: "/shop",
  },
  {
    img: "/tee-floating.jpg",
    imgPosition: "center center",
    label: null,
    title: "DESIGNED\nTO BREAK\nRULES.",
    cta: "OUR STORY",
    href: "/#about",
  },
  {
    img: "/editorial-back.jpg",
    imgPosition: "center top",
    label: null,
    title: "A COMMUNITY\nTHAT CREATES.",
    cta: "JOIN US",
    href: "/#community",
    sideText: true,
  },
];

export function EditorialGrid() {
  return (
    <section style={{ background: "#000", borderTop: "1px solid #111" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ minHeight: "400px" }}>
          {TILES.map((tile, i) => (
            <Link
              key={i}
              href={tile.href}
              className="editorial-tile group relative flex flex-col justify-end overflow-hidden"
              style={{
                background: "#000",
                borderRight: i < TILES.length - 1 ? "1px solid #111" : "none",
                minHeight: "400px",
              }}
            >
              {/* Real photo background */}
              <img
                src={tile.img}
                alt=""
                aria-hidden
                className="tile-img absolute inset-0"
                style={{
                  objectPosition: tile.imgPosition,
                  opacity: 0.72,
                }}
              />

              {/* Bottom gradient */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 75%)" }}
              />

              {/* Content */}
              <div className="relative z-10 p-5 space-y-2">
                {tile.label && (
                  <p className="text-[0.5rem] font-bold tracking-[0.3em]" style={{ color: "var(--color-red)" }}>
                    {tile.label}
                  </p>
                )}
                <h3
                  className="text-white leading-none"
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "1.5rem",
                    letterSpacing: "0.04em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {tile.title}
                </h3>
                <a
                  href={tile.href}
                  className="flex items-center gap-2 text-[0.6rem] font-bold tracking-[0.2em] group-hover:text-red-500 transition-colors"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {tile.cta} <span>——→</span>
                </a>
              </div>

              {/* Sideways ILUMINATEES text on last tile */}
              {tile.sideText && (
                <div
                  className="absolute right-0 top-0 bottom-0 flex items-center justify-center"
                  style={{ width: "28px", background: "var(--color-red)" }}
                >
                  <span
                    className="text-white text-[0.55rem] font-bold"
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      letterSpacing: "0.3em",
                    }}
                  >
                    ILUMINATEES
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
