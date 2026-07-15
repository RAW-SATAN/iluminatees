"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { ProductMockup } from "@/components/ProductMockup";
import { getProductBySlug } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "2rem 1.5rem", textAlign: "center" }}>
        <ShoppingBag size={56} color="#e0e0e0" strokeWidth={1.2} />
        <div>
          <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.4rem, 4vw, 2rem)", letterSpacing: "0.1em", color: "#111", marginBottom: 8, textTransform: "uppercase" }}>
            Your Bag Is Empty
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#aaa" }}>
            Looks like you haven&apos;t added anything yet.
          </p>
        </div>
        <Link href="/shop" style={{ display: "inline-block", background: "#111", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em", padding: "0.85rem 2rem", borderRadius: 10, textDecoration: "none" }}>
          SHOP NOW →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "0.06em", color: "#111", textTransform: "uppercase" }}>
              Your Bag
            </h1>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#aaa" }}>
              {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
            </span>
          </div>
          <button onClick={clearCart} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#bbb", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Clear All
          </button>
        </div>

        {/* Two-column on desktop, stacked on mobile */}
        <div style={{ display: "grid", gap: 20 }} className="cart-grid">

          {/* ── Items ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item) => {
              const product = getProductBySlug(item.slug);
              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.9rem 1rem", border: "1px solid #eee", borderRadius: 12, background: "#fff" }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: 68, height: 84, flexShrink: 0, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {product && <ProductMockup product={product} size={54} />}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#111", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", color: "#aaa", marginBottom: 6 }}>
                      Size: {item.size}
                    </div>
                    <div style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.82rem", color: "#111" }}>
                      ₹{item.price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Qty + remove */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #e8e8e8", borderRadius: 8, padding: "0.28rem 0.55rem" }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "flex", alignItems: "center", color: "#555" }}
                      >
                        <Minus size={11} />
                      </button>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#111", minWidth: 18, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "flex", alignItems: "center", color: "#555" }}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#ccc" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Line total — hidden on mobile via CSS */}
                  <div className="cart-line-total" style={{ textAlign: "right", flexShrink: 0, minWidth: 72 }}>
                    <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.82rem", color: "#111" }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
              {["🔄 Easy Returns", "📦 Cash on Delivery", "⚡ Fast Shipping"].map(b => (
                <span key={b} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.56rem", color: "#888", background: "#f9f9f9", border: "1px solid #eee", borderRadius: 6, padding: "0.3rem 0.7rem" }}>{b}</span>
              ))}
            </div>
          </div>

          {/* ── Summary ── */}
          <div>
            <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "1.4rem", background: "#fafafa", position: "sticky", top: 142 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", letterSpacing: "0.18em", color: "#aaa", textTransform: "uppercase", marginBottom: 16 }}>
                Order Summary
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#555", flex: 1 }}>
                      {item.name} <span style={{ color: "#aaa" }}>×{item.quantity}</span>
                    </span>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", fontWeight: 700, color: "#111", flexShrink: 0 }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: 12, marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#555" }}>Delivery</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", fontWeight: 700, color: "#16a34a" }}>FREE</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #eee" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#111" }}>Total</span>
                <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "1.25rem", color: "#111" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={() => alert("Checkout coming soon!")}
                style={{ width: "100%", padding: "1rem", background: "#111", color: "#fff", border: "none", borderRadius: 10, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", cursor: "pointer", marginBottom: 10, textTransform: "uppercase" }}
              >
                Proceed To Checkout →
              </button>

              <Link href="/shop" style={{ display: "block", textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#aaa", textDecoration: "none" }}>
                ← Continue Shopping
              </Link>

              <div style={{ marginTop: 16, padding: "0.8rem", background: "#f5f5f5", borderRadius: 8 }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.5rem", color: "#bbb", textAlign: "center", letterSpacing: "0.06em", lineHeight: 1.7 }}>
                  🔒 SECURE CHECKOUT · YOUR DATA IS SAFE
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
