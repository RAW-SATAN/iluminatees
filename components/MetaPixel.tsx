"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
 * Meta (Facebook) Pixel. Activates only when NEXT_PUBLIC_META_PIXEL_ID
 * is set in the environment (Vercel → Settings → Environment Variables).
 * Fires PageView on every route change; AddToCart is fired from
 * CartProvider and Purchase from the checkout success flow.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window { fbq?: (...args: unknown[]) => void; _fbq?: unknown }
}

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!PIXEL_ID || window.fbq) return;
    /* Standard Meta Pixel bootstrap */
    const n: any = (window.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    window.fbq("init", PIXEL_ID);
  }, []);

  useEffect(() => {
    if (!PIXEL_ID) return;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
