import { Truck, ShieldCheck, RefreshCw, Zap } from "lucide-react";

const ITEMS = [
  { icon: Truck,       text: "WORLDWIDE SHIPPING",   sub: "All orders tracked" },
  { icon: ShieldCheck, text: "SECURE PAYMENTS",      sub: "256-bit encrypted" },
  { icon: RefreshCw,   text: "EASY RETURNS",         sub: "7-day no-questions" },
  { icon: Zap,         text: "LIMITED DROPS ONLY",   sub: "No restocks. Ever." },
];

export function InfoBar() {
  return (
    <div
      className="border-y"
      style={{ background: "#0a0a0a", borderColor: "#1a1a1a" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {ITEMS.map(({ icon: Icon, text, sub }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-5"
              style={{
                borderRight: i < ITEMS.length - 1 ? "1px solid #1a1a1a" : "none",
              }}
            >
              <Icon size={16} style={{ color: "var(--color-red)", flexShrink: 0 }} />
              <div>
                <p className="text-[0.6rem] font-bold tracking-[0.18em] text-white">{text}</p>
                <p className="text-[0.55rem] text-gray-600 tracking-wide mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
