"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Search } from "lucide-react";

const STEPS = ["pending", "confirmed", "shipped", "delivered"];
const STEP_LABELS: Record<string, string> = {
  pending: "Order Received",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface TrackedOrder {
  id: string;
  status: string;
  payment: string;
  total: number;
  items: { name: string; size: string; qty: number }[];
  city: string;
  date: string;
}

export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setOrder(null);
    if (!orderId.trim() || !/^\d{10}$/.test(phone.trim())) {
      setErr("Order ID aur 10-digit phone number dono chahiye.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      if (!res.ok) { setErr("Order nahi mila — ID aur phone number check karo."); return; }
      setOrder(await res.json());
    } catch {
      setErr("Server se connect nahi ho paya. Dobara try karo.");
    } finally {
      setBusy(false);
    }
  }

  const stepIdx = order ? STEPS.indexOf(order.status) : -1;
  const inputStyle = { width: "100%", padding: "0.8rem 1rem", fontFamily: "Inter, sans-serif", fontSize: "0.76rem", color: "#111", border: "1.5px solid #ddd", borderRadius: 10, outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ minHeight: "80vh", background: "#fafafa" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "3rem 1.25rem 5rem" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <Package size={36} color="#111" strokeWidth={1.4} style={{ margin: "0 auto 12px", display: "block" }} />
          <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "0.05em", color: "#111", textTransform: "uppercase" }}>
            Track Your Order
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.66rem", color: "#888", marginTop: 6 }}>
            Order ID aur wahi phone number daalo jo order par diya tha.
          </p>
        </div>

        <form onSubmit={lookup} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "1.2rem", display: "flex", flexDirection: "column", gap: 10 }}>
          <input placeholder="Order ID (e.g. #MBX4K201)" value={orderId} onChange={e => { setOrderId(e.target.value); setErr(null); }} style={inputStyle} />
          <input placeholder="Phone (10 digit)" inputMode="numeric" maxLength={10} value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setErr(null); }} style={inputStyle} />
          {err && <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#e8000d" }}>{err}</div>}
          <button type="submit" disabled={busy}
            style={{ padding: "0.95rem", borderRadius: 10, background: "#111", color: "#fff", border: "none", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.76rem", letterSpacing: "0.08em", cursor: busy ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: busy ? 0.7 : 1 }}>
            <Search size={14} /> {busy ? "SEARCHING…" : "TRACK ORDER"}
          </button>
        </form>

        {order && (
          <div style={{ marginTop: 18, background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "1.4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.85rem", color: "#111" }}>{order.id}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#999" }}>
                {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#777", marginBottom: 18 }}>
              {order.items.map(i => `${i.name} (${i.size}) × ${i.qty}`).join(" · ")} — ₹{order.total.toLocaleString("en-IN")} · {order.city}
            </div>

            {order.status === "cancelled" ? (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "0.8rem 1rem", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.66rem", color: "#b91c1c" }}>
                Ye order cancel ho chuka hai. Koi sawaal ho to WhatsApp karo.
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                {STEPS.map((s, i) => {
                  const reached = i <= stepIdx;
                  return (
                    <div key={s} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                      {i > 0 && (
                        <div style={{ position: "absolute", top: 10, right: "50%", width: "100%", height: 3, background: i <= stepIdx ? "#16a34a" : "#e5e5e5", zIndex: 0 }} />
                      )}
                      <div style={{ position: "relative", zIndex: 1, width: 22, height: 22, borderRadius: "50%", margin: "0 auto 8px", background: reached ? "#16a34a" : "#fff", border: `2.5px solid ${reached ? "#16a34a" : "#d5d5d5"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {reached && <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 800 }}>✓</span>}
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", fontWeight: reached ? 700 : 500, color: reached ? "#111" : "#aaa" }}>
                        {STEP_LABELS[s]}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <a href={`https://wa.me/917055470321?text=${encodeURIComponent(`Hi! Order ${order.id} ka update chahiye.`)}`}
              style={{ display: "block", textAlign: "center", marginTop: 20, fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#16a34a", fontWeight: 700, textDecoration: "none" }}>
              💬 WhatsApp par live update lo →
            </a>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 22 }}>
          <Link href="/shop" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#888", textDecoration: "underline" }}>
            ← Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}
