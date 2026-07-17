"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
 * Anonymous live-visitor heartbeat: a random session id (no cookies,
 * no personal data) pinged every 30s while the tab is visible.
 * The admin dashboard's "Live visitors" counts these.
 */
export function PresencePing() {
  const pathname = usePathname();

  useEffect(() => {
    /* don't count the owner browsing their own admin panel */
    if (pathname.startsWith("/adminn")) return;

    let id = "";
    try {
      id = sessionStorage.getItem("ilu_vid") ?? "";
      if (!id) {
        id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
        sessionStorage.setItem("ilu_vid", id);
      }
    } catch {
      id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    const ping = () => {
      if (document.visibilityState !== "visible") return;
      try {
        const body = JSON.stringify({ id });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/presence", new Blob([body], { type: "application/json" }));
        } else {
          fetch("/api/presence", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
        }
      } catch {}
    };

    ping();
    const iv = setInterval(ping, 30_000);
    document.addEventListener("visibilitychange", ping);
    return () => {
      clearInterval(iv);
      document.removeEventListener("visibilitychange", ping);
    };
  }, [pathname]);

  return null;
}
