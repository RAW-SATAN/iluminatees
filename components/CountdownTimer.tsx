"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days:  Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins:  Math.floor((diff / (1000 * 60)) % 60),
    secs:  Math.floor((diff / 1000) % 60),
  };
}

const TARGET = new Date(Date.now() + 9 * 86400000 + 23 * 3600000 + 56 * 60000 + 48000);

export function CountdownTimer() {
  const [t, setT] = useState(getTimeLeft(TARGET));

  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft(TARGET)), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="space-y-3">
      <p className="text-[0.6rem] font-bold tracking-[0.3em] text-gray-500">NEXT DROP IN</p>
      <div className="flex items-end gap-2">
        {[
          { val: pad(t.days),  label: "DAYS" },
          { val: pad(t.hours), label: "HOURS" },
          { val: pad(t.mins),  label: "MINS" },
          { val: pad(t.secs),  label: "SECS" },
        ].map(({ val, label }, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="text-center">
              <div
                className="text-3xl font-bold tabular-nums text-white leading-none"
                style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "0.05em" }}
              >
                {val}
              </div>
              <div className="text-[0.45rem] text-gray-600 tracking-[0.2em] mt-1">{label}</div>
            </div>
            {i < 3 && (
              <span className="text-xl font-bold text-gray-600 mb-3" style={{ fontFamily: "Bebas Neue" }}>:</span>
            )}
          </div>
        ))}
      </div>
      <a
        href="#"
        className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-white hover:text-red-500 transition-colors pt-1"
      >
        JOIN THE WAITLIST <span>——→</span>
      </a>
    </div>
  );
}
