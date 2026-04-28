import { Globe } from "lucide-react";

export function InfoBar() {
  return (
    <div
      className="border-y"
      style={{ background: "#000", borderColor: "#111" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Left — Email signup */}
          <div
            className="flex flex-col gap-3 px-6 py-6"
            style={{ borderRight: "1px solid #111" }}
          >
            <h3
              className="text-white"
              style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em" }}
            >
              GET EARLY ACCESS TO EXCLUSIVE DROPS
            </h3>
            <form action="#" className="flex gap-0 max-w-sm">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="flex-1 bg-transparent border border-white/15 px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.15em] text-white placeholder:text-gray-600 outline-none focus:border-red-600 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2.5"
                style={{ background: "var(--color-red)", minWidth: "44px" }}
              >
                <span className="text-white text-[0.7rem]">——→</span>
              </button>
            </form>
          </div>

          {/* Right — Trust items */}
          <div className="flex items-center px-6 py-6 gap-6">
            <Globe size={22} style={{ color: "var(--color-red)", flexShrink: 0 }} />
            <div className="flex flex-col gap-1.5">
              {["WORLDWIDE SHIPPING", "SECURE PAYMENTS", "EASY RETURNS"].map((item) => (
                <span key={item} className="text-[0.6rem] font-bold tracking-[0.2em] text-gray-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
