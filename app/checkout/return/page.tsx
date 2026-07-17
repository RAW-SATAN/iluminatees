"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { useCart } from "@/components/CartProvider";

interface StatusResp {
  id: string;
  paid: boolean;
  total: number;
  items: { name: string; size: string; qty: number }[];
  customer: string;
}

function ReturnInner() {
  const orderId = useSearchParams().get("order_id") ?? "";
  const { clearCart } = useCart();
  const [state, setState] = useState<"checking" | "paid" | "failed">("checking");
  const [order, setOrder] = useState<StatusResp | null>(null);

  useEffect(() => {
    if (!orderId) { setState("failed"); return; }
    let cancelled = false;

    async function check(attempt: number) {
      try {
        const res = await fetch(`/api/pay/status?orderId=${encodeURIComponent(orderId)}`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        const d: StatusResp = await res.json();
        if (cancelled) return;
        if (d.paid) {
          setOrder(d);
          setState("paid");
          clearCart();
          try { (window as any).fbq?.("track", "Purchase", { value: d.total, currency: "INR" }); } catch {}
          return;
        }
        /* Payment can take a few seconds to reflect — retry a couple of times */
        if (attempt < 3) setTimeout(() => check(attempt + 1), 2500);
        else { setOrder(d); setState("failed"); }
      } catch {
        if (!cancelled) setState("failed");
      }
    }
    check(0);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (state === "checking") {
    return (
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: "2rem" }}>
        <div style={{ width: 44, height: 44, border: "4px solid #eee", borderTopColor: "#111", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.74rem", color: "#666" }}>Payment verify ho raha hai…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (state === "paid" && order) {
    const summary = order.items.map(i => `${i.name} (${i.size}) × ${i.qty}`).join(", ");
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={30} color="#fff" strokeWidth={3} />
        </div>
        <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", letterSpacing: "0.06em", color: "#111", textTransform: "uppercase" }}>
          Payment Successful!
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#666", lineHeight: 1.8, maxWidth: 380 }}>
          Order <strong>{order.id}</strong> confirm ho gaya — ₹{order.total.toLocaleString("en-IN")} paid.
          Hum jaldi hi dispatch details WhatsApp par bhejenge.
        </p>
        <a
          href={`https://wa.me/917055470321?text=${encodeURIComponent(`Hi! Payment ho gaya.\n\nOrder: ${order.id}\nItems: ${summary}\nAmount: ₹${order.total} (PAID via Cashfree)\n\nPlease confirm.`)}`}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.06em", padding: "0.9rem 1.8rem", borderRadius: 24, textDecoration: "none" }}
        >
          💬 WhatsApp par order confirm karo
        </a>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/track" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#888", textDecoration: "underline" }}>
            Track order
          </Link>
          <Link href="/shop" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#888", textDecoration: "underline" }}>
            Continue shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "2rem 1.5rem", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e8000d", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={30} color="#fff" strokeWidth={3} />
      </div>
      <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", letterSpacing: "0.06em", color: "#111", textTransform: "uppercase" }}>
        Payment Complete Nahi Hua
      </h1>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#666", lineHeight: 1.8, maxWidth: 380 }}>
        {order ? <>Order <strong>{order.id}</strong> abhi unpaid hai.</> : "Payment verify nahi ho paya."} Tumhara bag safe hai — dobara try kar sakte ho.
        Agar paisa kat gaya hai to WhatsApp karo, hum turant check karenge.
      </p>
      <Link href="/checkout" style={{ display: "inline-block", background: "#111", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", padding: "0.85rem 2rem", borderRadius: 24, textDecoration: "none" }}>
        TRY AGAIN →
      </Link>
      <a href={`https://wa.me/917055470321?text=${encodeURIComponent(`Hi! Order ${order?.id ?? orderId} ka payment issue hai, please check.`)}`}
        style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#16a34a", fontWeight: 700, textDecoration: "none" }}>
        💬 WhatsApp support
      </a>
    </div>
  );
}

export default function CheckoutReturnPage() {
  return (
    <Suspense fallback={null}>
      <ReturnInner />
    </Suspense>
  );
}
