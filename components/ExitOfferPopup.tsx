"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SEEN_KEY = "iluminatees_exit_offer_seen";

export function ExitOfferPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { if (sessionStorage.getItem(SEEN_KEY)) return; } catch {}

    const trigger = () => {
      try {
        if (sessionStorage.getItem(SEEN_KEY)) return;
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setShow(true);
    };

    /* Desktop: cursor leaves the top of the window (heading for the close/back button) */
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 8) trigger();
    };

    /* Mobile: back button — push a state so the first back shows the offer instead of leaving */
    const onPopState = () => trigger();
    try { history.pushState({ iluExit: true }, ""); } catch {}

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      onClick={() => setShow(false)}
      style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.25rem" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 18, maxWidth: 380, width: "100%", padding: "2rem 1.6rem", textAlign: "center", position: "relative", overflow: "hidden" }}
      >
        <div aria-hidden style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "#e8000d", opacity: 0.12, filter: "blur(50px)", pointerEvents: "none" }} />
        <button
          onClick={() => setShow(false)}
          style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "1rem", cursor: "pointer" }}
        >✕</button>

        <div style={{ fontSize: "2rem", marginBottom: 10 }}>👁️</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.5rem", letterSpacing: "0.35em", color: "#e8000d", textTransform: "uppercase", marginBottom: 8 }}>
          RUKO — THE VAULT HAS AN OFFER
        </div>
        <h3 style={{ fontFamily: "Anton, sans-serif", fontSize: "1.6rem", letterSpacing: "0.04em", color: "#fff", textTransform: "uppercase", lineHeight: 1.15, marginBottom: 10 }}>
          Flat 20% OFF<br />On Prepaid Orders
        </h3>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 20 }}>
          Checkout par Pay Now (UPI) select karo — discount automatically apply hota hai.
          Limited drops kabhi restock nahi hote. 🔥
        </p>
        <Link
          href="/shop"
          onClick={() => setShow(false)}
          style={{ display: "block", background: "#e8000d", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.95rem", borderRadius: 12, textDecoration: "none", marginBottom: 10 }}
        >
          Claim 20% OFF →
        </Link>
        <button
          onClick={() => setShow(false)}
          style={{ background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: "0.56rem", color: "rgba(255,255,255,0.35)", cursor: "pointer", textDecoration: "underline" }}
        >
          Nahi chahiye, jaane do
        </button>
      </div>
    </div>
  );
}
