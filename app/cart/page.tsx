"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { ProductMockup } from "@/components/ProductMockup";
import { getProductBySlug, type ProductSize } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart, addItem } = useCart();
  const allProducts = useProducts();

  const inCart = new Set(items.map(i => i.slug));
  const suggestions = allProducts.filter(p => !inCart.has(p.slug) && p.inStock).slice(0, 3);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const nextTierMsg =
    totalQty === 1 ? "1 aur tee add karo → Any 2 par 10% OFF 🔥"
    : totalQty === 2 ? "1 aur tee add karo → Any 3 par 15% OFF 🔥"
    : null;

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
      <div className="cart-wrap" style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" }}>

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

            {/* Urgency strip */}
            <div className="cart-urgency" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#fff1f2", border: "1px solid #ffd7d9", borderRadius: 10, padding: "0.65rem 0.9rem" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", color: "#111" }}>
                🔥 Limited vault drop — items in your bag are NOT reserved
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.56rem", color: "#e8000d", flexShrink: 0 }}>Selling fast</span>
            </div>

            {/* Bundle offer nudge */}
            {nextTierMsg && (
              <div className="cart-bundle" style={{ background: "#f0fdf4", border: "1px dashed #86efac", borderRadius: 10, padding: "0.6rem 0.9rem", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", color: "#15803d" }}>
                {nextTierMsg}
              </div>
            )}

            {items.map((item) => {
              const product = allProducts.find(p => p.slug === item.slug) ?? getProductBySlug(item.slug);
              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="cart-item"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.9rem 1rem", border: "1px solid #eee", borderRadius: 12, background: "#fff" }}
                >
                  {/* Thumbnail */}
                  <div className="cart-thumb" style={{ width: 68, height: 84, flexShrink: 0, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {product && <ProductMockup product={product} size={54} />}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="cart-name" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#111", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", color: "#aaa", marginBottom: 6 }}>
                      Size: {item.size}
                    </div>
                    <div className="cart-price" style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.82rem", color: "#111" }}>
                      ₹{item.price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Qty + remove */}
                  <div className="cart-actions" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <div className="cart-qty" style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #e8e8e8", borderRadius: 8, padding: "0.28rem 0.55rem" }}>
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

            {/* ── Bought Together / upsell ── */}
            {suggestions.length > 0 && (
              <div style={{ border: "1px solid #eee", borderRadius: 12, marginTop: 8, overflow: "hidden" }}>
                <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", color: "#111" }}>USUALLY BOUGHT TOGETHER</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#16a34a", fontWeight: 700 }}>Bundle & save upto 15%</span>
                </div>
                <div className="no-scrollbar" style={{ display: "flex", gap: 10, padding: "0.9rem 1rem", overflowX: "auto" }}>
                  {suggestions.map(p => (
                    <div key={p.slug} style={{ flexShrink: 0, width: 150, border: "1px solid #f0f0f0", borderRadius: 10, overflow: "hidden" }}>
                      <Link href={`/product/${p.slug}`} style={{ textDecoration: "none" }}>
                        <div style={{ height: 120, background: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {p.customImage
                            ? <img src={p.customImage} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <ProductMockup product={p} size={70} />}
                        </div>
                      </Link>
                      <div style={{ padding: "0.55rem 0.6rem" }}>
                        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.56rem", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                          <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.62rem", color: "#111" }}>₹{p.price.toLocaleString("en-IN")}</span>
                          <button
                            onClick={() => addItem({ productId: p.id, slug: p.slug, name: p.name, price: p.price, size: "M" as ProductSize, quantity: 1, shirtColor: p.shirtColor, symbol: p.symbol })}
                            style={{ background: "#111", color: "#fff", border: "none", borderRadius: 6, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", padding: "0.3rem 0.6rem", cursor: "pointer" }}>
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
              {["🔄 Easy Returns", "📦 Cash on Delivery", "⚡ Fast Shipping", "💸 20% OFF on prepaid"].map(b => (
                <span key={b} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.56rem", color: "#888", background: "#f9f9f9", border: "1px solid #eee", borderRadius: 6, padding: "0.3rem 0.7rem" }}>{b}</span>
              ))}
            </div>
          </div>

          {/* ── Summary ── */}
          <div>
            <div className="cart-summary" style={{ border: "1px solid #eee", borderRadius: 12, padding: "1.4rem", background: "#fafafa", position: "sticky", top: 142 }}>
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
                <span className="cart-total" style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "1.25rem", color: "#111" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.56rem", color: "#16a34a", fontWeight: 700, textAlign: "center", marginBottom: 10 }}>
                ⚡ Pay online at checkout & get 20% OFF
              </div>
              <Link
                href="/checkout"
                style={{ display: "block", textAlign: "center", width: "100%", padding: "1rem 0", background: "#111", color: "#fff", border: "none", borderRadius: 10, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", cursor: "pointer", marginBottom: 10, textTransform: "uppercase", textDecoration: "none", boxSizing: "border-box" }}
              >
                Proceed To Checkout →
              </Link>

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
