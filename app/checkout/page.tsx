"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ShoppingBag, ChevronLeft } from "lucide-react";
import { useCart } from "@/components/CartProvider";

const UPI_ID = "7055470321@ptaxis";
const PREPAID_DISCOUNT = 0.20;

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [payment, setPayment] = useState<"prepaid" | "cod">("prepaid");
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [placed, setPlaced] = useState<string | null>(null);
  const [placedSummary, setPlacedSummary] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [codEnabled, setCodEnabled] = useState(true);
  const [cfEnabled, setCfEnabled] = useState(false);
  const [cfMode, setCfMode] = useState<"production" | "sandbox">("production");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then(r => r.ok ? r.json() : {} as any)
      .then(d => { if (d.cod_enabled === "0") { setCodEnabled(false); if (payment === "cod") setPayment("prepaid"); } })
      .catch(() => {});
    fetch("/api/pay", { cache: "no-store" })
      .then(r => r.ok ? r.json() : { enabled: false })
      .then(d => { setCfEnabled(Boolean(d.enabled)); if (d.mode) setCfMode(d.mode); })
      .catch(() => {});
  }, []);

  /* Cashfree hosted checkout SDK */
  function loadCashfreeSdk(): Promise<any> {
    return new Promise((resolve, reject) => {
      const w = window as any;
      if (w.Cashfree) return resolve(w.Cashfree);
      const s = document.createElement("script");
      s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      s.onload = () => (w.Cashfree ? resolve(w.Cashfree) : reject(new Error("SDK load failed")));
      s.onerror = () => reject(new Error("SDK load failed"));
      document.head.appendChild(s);
    });
  }

  /* Bundle offer: any 2 tees → 10% off, any 3+ → 15% off (matches the cart nudge) */
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const bundleRate = totalQty >= 3 ? 0.15 : totalQty >= 2 ? 0.10 : 0;
  const bundleDiscount = Math.round(total * bundleRate);
  const afterBundle = total - bundleDiscount;
  const discount = payment === "prepaid" ? Math.round(afterBundle * PREPAID_DISCOUNT) : 0;
  const payable = afterBundle - discount;
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=ILUMINATEES&am=${payable}&cu=INR`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&data=${encodeURIComponent(upiLink)}`;

  function setField(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })); setErr(null); }

  async function placeOrder() {
    if (!form.name.trim() || !/^\d{10}$/.test(form.phone.trim()) || !form.address.trim() || !form.city.trim()) {
      setErr("Naam, 10-digit phone, address aur city bharna zaroori hai.");
      return;
    }
    const order = {
      id: `#${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
      customer: form.name.trim(),
      phone: form.phone.trim(),
      address: `${form.address.trim()}${form.pincode.trim() ? ", " + form.pincode.trim() : ""}`,
      city: form.city.trim(),
      items: items.map(i => ({ name: i.name, size: i.size, qty: i.quantity, price: i.price })),
      total: payable,
      payment: payment === "cod" ? "cod" : "unpaid",
    };
    let savedId = order.id;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) { setErr("Order place nahi ho paya. Dobara try karo."); return; }
      const saved = await res.json();
      savedId = saved.id ?? order.id;
      try { localStorage.setItem("iluminatees_orders", JSON.stringify([saved, ...JSON.parse(localStorage.getItem("iluminatees_orders") ?? "[]")])); } catch {}
    } catch {
      setErr("Server se connect nahi ho paya. Dobara try karo.");
      return;
    }
    /* ── Prepaid + Cashfree configured → hosted payment page ── */
    if (payment === "prepaid" && cfEnabled) {
      setPaying(true);
      try {
        const payRes = await fetch("/api/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: savedId }),
        });
        const payData = await payRes.json();
        if (!payRes.ok || !payData.paymentSessionId) throw new Error(payData.error || "payment session failed");
        const Cashfree = await loadCashfreeSdk();
        const cashfree = Cashfree({ mode: payData.mode ?? cfMode });
        /* Cart stays intact until the return page confirms payment */
        cashfree.checkout({ paymentSessionId: payData.paymentSessionId, redirectTarget: "_self" });
        return;
      } catch (e) {
        setPaying(false);
        setErr("Payment page load nahi hua — dobara try karo ya WhatsApp karo. Order save ho gaya hai.");
        return;
      }
    }

    setPlacedSummary(items.map(i => `${i.name} (${i.size}) × ${i.quantity}`).join(", "));
    /* Purchase conversion for Meta Pixel, if configured */
    try { (window as any).fbq?.("track", "Purchase", { value: payable, currency: "INR" }); } catch {}
    clearCart();
    setPlaced(savedId);
  }

  /* ── Success ── */
  if (placed) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={30} color="#fff" strokeWidth={3} />
        </div>
        <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", letterSpacing: "0.06em", color: "#111", textTransform: "uppercase" }}>
          Order Placed!
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#666", lineHeight: 1.8, maxWidth: 380 }}>
          Order <strong>{placed}</strong> mil gaya. Hum WhatsApp par confirm karenge.
          {payment === "prepaid" && <> Payment UPI se complete karna na bhoolein — <strong>{UPI_ID}</strong>.</>}
        </p>
        <a
          href={`https://wa.me/917055470321?text=${encodeURIComponent(`Hi! Maine order place kiya hai.\n\nOrder: ${placed}\nItems: ${placedSummary}\nPayment: ${payment === "cod" ? "COD" : "UPI (paid)"}\n\nPlease confirm.`)}`}
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

  /* ── Empty ── */
  if (items.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "2rem", textAlign: "center" }}>
        <ShoppingBag size={52} color="#e0e0e0" strokeWidth={1.2} />
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#888" }}>Bag khali hai — pehle kuch add karo.</p>
        <Link href="/shop" style={{ background: "#111", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", padding: "0.8rem 1.8rem", borderRadius: 24, textDecoration: "none" }}>
          SHOP NOW →
        </Link>
      </div>
    );
  }

  const inputStyle = { width: "100%", padding: "0.75rem 0.9rem", fontFamily: "Inter, sans-serif", fontSize: "0.74rem", color: "#111", border: "1.5px solid #ddd", borderRadius: 8, outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.8rem 1.25rem 5rem" }}>
        <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#888", textDecoration: "none", marginBottom: 14 }}>
          <ChevronLeft size={13} /> Back to bag
        </Link>
        <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", letterSpacing: "0.06em", color: "#111", textTransform: "uppercase", marginBottom: 20 }}>
          Checkout
        </h1>

        <div style={{ display: "grid", gap: 18 }} className="checkout-grid">
          {/* ── LEFT: details + payment ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Address */}
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "1.2rem" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#111", marginBottom: 14 }}>Delivery Details</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input placeholder="Full name" value={form.name} onChange={e => setField("name", e.target.value)} style={inputStyle} />
                <input placeholder="Phone (10 digit)" inputMode="numeric" maxLength={10} value={form.phone} onChange={e => setField("phone", e.target.value.replace(/\D/g, ""))} style={inputStyle} />
                <input placeholder="Address (house, street, area)" value={form.address} onChange={e => setField("address", e.target.value)} style={inputStyle} />
                <div style={{ display: "flex", gap: 10 }}>
                  <input placeholder="City" value={form.city} onChange={e => setField("city", e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                  <input placeholder="Pincode" inputMode="numeric" maxLength={6} value={form.pincode} onChange={e => setField("pincode", e.target.value.replace(/\D/g, ""))} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "1.2rem" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#111", marginBottom: 14 }}>Payment Method</div>

              {/* Prepaid */}
              <button onClick={() => setPayment("prepaid")}
                style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12, padding: "0.9rem 1rem", borderRadius: 10, border: `2px solid ${payment === "prepaid" ? "#111" : "#e5e5e5"}`, background: payment === "prepaid" ? "#f7fff9" : "#fff", cursor: "pointer", marginBottom: 10 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", border: `5px solid ${payment === "prepaid" ? "#111" : "#ccc"}`, flexShrink: 0, boxSizing: "border-box" }} />
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#111" }}>
                    Pay Now (UPI) <span style={{ background: "#16a34a", color: "#fff", fontSize: "0.5rem", fontWeight: 800, borderRadius: 4, padding: "0.15rem 0.45rem", marginLeft: 6, letterSpacing: "0.06em" }}>20% OFF</span>
                  </span>
                  <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#777", marginTop: 3 }}>{cfEnabled ? "UPI / Cards / NetBanking — instant 20% discount" : "GPay / PhonePe / Paytm — instant 20% discount"}</span>
                </span>
              </button>

              {/* COD */}
              {codEnabled && (
                <button onClick={() => setPayment("cod")}
                  style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12, padding: "0.9rem 1rem", borderRadius: 10, border: `2px solid ${payment === "cod" ? "#111" : "#e5e5e5"}`, background: "#fff", cursor: "pointer" }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", border: `5px solid ${payment === "cod" ? "#111" : "#ccc"}`, flexShrink: 0, boxSizing: "border-box" }} />
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#111" }}>Cash on Delivery</span>
                    <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#777", marginTop: 3 }}>Pay when your order arrives</span>
                  </span>
                </button>
              )}

              {/* UPI QR */}
              {payment === "prepaid" && cfEnabled && (
                <div style={{ marginTop: 14, border: "1px dashed #c9e5d2", background: "#f7fff9", borderRadius: 12, padding: "0.9rem 1rem", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "1.3rem" }}>🔒</span>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#333", lineHeight: 1.7 }}>
                    Place Order dabate hi <strong>secure payment page</strong> khulega — UPI, cards, netbanking sab chalega. Payment hote hi order automatically confirm ho jayega.
                  </div>
                </div>
              )}

              {payment === "prepaid" && !cfEnabled && (
                <div style={{ marginTop: 14, border: "1px dashed #c9e5d2", background: "#f7fff9", borderRadius: 12, padding: "1rem", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <img src={qrSrc} alt="UPI QR code" width={130} height={130} style={{ borderRadius: 8, background: "#fff", padding: 4, border: "1px solid #e5e5e5" }} />
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.66rem", color: "#111", marginBottom: 6 }}>Scan & Pay ₹{payable.toLocaleString("en-IN")}</div>
                    <div style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", color: "#333", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 6, padding: "0.4rem 0.6rem", marginBottom: 8, wordBreak: "break-all" }}>{UPI_ID}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.56rem", color: "#777", lineHeight: 1.6 }}>
                      Kisi bhi UPI app se scan karo ya UPI ID par pay karo, phir Place Order dabao. Hum WhatsApp par confirm karenge.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: summary ── */}
          <div>
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "1.2rem", position: "sticky", top: 16 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#111", marginBottom: 14 }}>Order Summary</div>
              {items.map(i => (
                <div key={`${i.productId}-${i.size}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#444", marginBottom: 8 }}>
                  <span style={{ flex: 1 }}>{i.name} · {i.size} × {i.quantity}</span>
                  <span style={{ fontFamily: "Space Mono, monospace" }}>₹{(i.price * i.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div style={{ height: 1, background: "#f0f0f0", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#666", marginBottom: 6 }}>
                <span>Subtotal</span><span style={{ fontFamily: "Space Mono, monospace" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
              {bundleDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#16a34a", fontWeight: 700, marginBottom: 6 }}>
                  <span>Bundle offer ({totalQty >= 3 ? "3+ tees · 15%" : "2 tees · 10%"})</span><span style={{ fontFamily: "Space Mono, monospace" }}>−₹{bundleDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#666", marginBottom: 6 }}>
                <span>Shipping</span><span style={{ color: "#16a34a", fontWeight: 700 }}>FREE</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#16a34a", fontWeight: 700, marginBottom: 6 }}>
                  <span>Prepaid discount (20%)</span><span style={{ fontFamily: "Space Mono, monospace" }}>−₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div style={{ height: 1, background: "#f0f0f0", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#111", marginBottom: 4 }}>
                <span>Total</span><span style={{ fontFamily: "Space Mono, monospace" }}>₹{payable.toLocaleString("en-IN")}</span>
              </div>
              {payment === "cod" && (
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.54rem", color: "#e8000d", marginBottom: 4 }}>
                  Pay Now select karo aur ₹{Math.round(afterBundle * PREPAID_DISCOUNT).toLocaleString("en-IN")} bacha lo 👀
                </div>
              )}

              {err && <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#e8000d", margin: "8px 0" }}>{err}</div>}

              <button onClick={placeOrder} disabled={paying}
                style={{ width: "100%", marginTop: 12, padding: "1rem", borderRadius: 10, background: "#111", color: "#fff", border: "none", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.06em", cursor: "pointer" }}>
                {paying ? "PAYMENT PAGE KHUL RAHA HAI…" : `PLACE ORDER — ₹${payable.toLocaleString("en-IN")}`}
              </button>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#aaa", textAlign: "center", marginTop: 10 }}>
                🔒 100% secure · Easy size exchange · Ships in 3–5 days
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-grid { grid-template-columns: 1fr; }
        @media (min-width: 860px) {
          .checkout-grid { grid-template-columns: 1.4fr 1fr; }
        }
      `}</style>
    </div>
  );
}
