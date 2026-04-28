import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

const DROP_ITEMS = [
  { slug: "eye-of-providence", name: "LIQUID METAL TEE",  price: "₹ 1,899", img: "/hero-model.jpg",        imgPos: "center top" },
  { slug: "the-architect",     name: "VOID HOODIE",       price: "₹ 2,999", img: "/tee-floating.jpg",      imgPos: "center center" },
  { slug: "cipher-33",         name: "SHADOW CARGO",      price: "₹ 2,499", img: "/editorial-back.jpg",    imgPos: "center top" },
  { slug: "sacred-geometry",   name: "ABSTRACT TEE",      price: "₹ 1,799", img: "/editorial-portrait.jpg",imgPos: "center top" },
  { slug: "quantum-eye",       name: "DISTORT CAP",       price: "₹ 999",   img: "/editorial-swirl.jpg",   imgPos: "center center" },
];

export function DropStrip() {
  return (
    <section style={{ background: "#000", borderTop: "1px solid #111", borderBottom: "1px solid #111" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex">

          {/* ── Left label ─────────────────────────── */}
          <div
            className="flex-shrink-0 flex flex-col justify-center gap-3 px-6 py-8"
            style={{ width: "150px", borderRight: "1px solid #111" }}
          >
            <span className="tag-red text-[0.48rem]">FEATURED</span>
            <h2
              className="text-white leading-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem", letterSpacing: "0.05em" }}
            >
              DROP
              <br />
              PIECES
            </h2>
            <button className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 hover:border-red-600 hover:bg-red-600/10 transition-all">
              <ArrowRight size={14} className="text-white" />
            </button>
          </div>

          {/* ── Horizontal scroll ──────────────────── */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex" style={{ minWidth: "max-content" }}>
              {DROP_ITEMS.map((item, i) => (
                <Link
                  key={i}
                  href={`/product/${item.slug}`}
                  className="strip-card flex-shrink-0 flex flex-col group"
                  style={{
                    width: "190px",
                    borderRight: "1px solid #111",
                    borderLeft: "none",
                    borderTop: "none",
                    borderBottom: "none",
                    background: "#070707",
                  }}
                >
                  {/* NEW badge */}
                  <div className="pt-3 px-3">
                    <span className="tag-red text-[0.45rem] px-1.5 py-0.5">NEW</span>
                  </div>

                  {/* Real product photo */}
                  <div
                    className="overflow-hidden mx-0 mt-2"
                    style={{ height: "170px" }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: item.imgPos,
                        filter: "brightness(0.85) contrast(1.05)",
                        transition: "transform 0.5s ease",
                      }}
                      className="group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="px-4 py-4 space-y-1 mt-auto">
                    <p className="text-[0.72rem] font-bold text-white tracking-wide group-hover:text-red-500 transition-colors">{item.name}</p>
                    <p className="text-[0.7rem] text-gray-500">{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Countdown ──────────────────────────── */}
          <div
            className="flex-shrink-0 flex items-center px-7 py-8"
            style={{ width: "210px", borderLeft: "1px solid #111" }}
          >
            <CountdownTimer />
          </div>
        </div>
      </div>
    </section>
  );
}
