"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { ProductMockup } from "@/components/ProductMockup";
import { getProductBySlug } from "@/lib/products";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-8 px-6">
        <svg width="80" height="80" viewBox="0 0 100 100" aria-hidden className="opacity-20">
          <polygon points="50,8 92,80 8,80" fill="none" stroke="#c9a84c" strokeWidth="2" />
          <ellipse cx="50" cy="52" rx="11" ry="7" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
          <circle cx="50" cy="52" r="4" fill="#c9a84c" />
        </svg>
        <div className="text-center space-y-3">
          <h1
            className="text-2xl font-bold tracking-[0.2em]"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--color-muted)" }}
          >
            YOUR ORDER IS EMPTY
          </h1>
          <p className="text-xs tracking-[0.2em]" style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}>
            THE VAULT AWAITS YOUR INITIATION
          </p>
        </div>
        <Link href="/shop" className="btn-gold inline-block">
          ENTER THE VAULT
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-10">
          <div className="space-y-1">
            <span
              className="text-[0.5rem] tracking-[0.5em]"
              style={{ color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}
            >
              ORDER MANIFEST
            </span>
            <h1
              className="text-2xl font-bold tracking-[0.15em]"
              style={{ fontFamily: "var(--font-cinzel)", color: "var(--color-cream)" }}
            >
              Your Order
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-[0.5rem] tracking-[0.3em] transition-colors hover:text-[var(--color-crimson)]"
            style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}
          >
            CLEAR ALL
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Items ───────────────────────────────── */}
          <div className="lg:col-span-2 space-y-px" style={{ background: "rgba(201,168,76,0.04)" }}>
            {items.map((item) => {
              const product = getProductBySlug(item.slug);
              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center gap-5 p-5"
                  style={{ background: "var(--color-onyx)", border: "1px solid rgba(201,168,76,0.08)" }}
                >
                  {/* Mockup thumbnail */}
                  <div
                    className="w-20 h-24 flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: product
                        ? `radial-gradient(circle, ${product.shirtColor}cc, #030303)`
                        : "var(--color-obsidian)",
                    }}
                  >
                    {product && (
                      <ProductMockup product={product} size={64} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span
                      className="text-[0.45rem] tracking-[0.35em]"
                      style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}
                    >
                      {item.productId.padStart(2, "0")} · {item.size}
                    </span>
                    <h3
                      className="text-sm font-semibold truncate"
                      style={{ fontFamily: "var(--font-cinzel)", color: "var(--color-cream)" }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="text-xs font-bold"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold)" }}
                    >
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center transition-all duration-200"
                      style={{
                        border: "1px solid rgba(201,168,76,0.2)",
                        color: "var(--color-muted)",
                      }}
                    >
                      <Minus size={10} />
                    </button>
                    <span
                      className="w-8 text-center text-sm font-bold"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--color-cream)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center transition-all duration-200"
                      style={{
                        border: "1px solid rgba(201,168,76,0.2)",
                        color: "var(--color-muted)",
                      }}
                    >
                      <Plus size={10} />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p
                      className="text-sm font-bold"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold)" }}
                    >
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="transition-colors hover:text-[var(--color-crimson)] flex-shrink-0"
                    style={{ color: "var(--color-dim)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Summary ─────────────────────────────── */}
          <div className="lg:col-span-1">
            <div
              className="p-6 space-y-5 sticky top-24"
              style={{ background: "var(--color-onyx)", border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <span
                className="text-[0.5rem] tracking-[0.5em] block"
                style={{ color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}
              >
                ORDER SUMMARY
              </span>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex justify-between text-xs"
                  >
                    <span style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}>
                      {item.name} ×{item.quantity}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-cream)" }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="pt-4 border-t"
                style={{ borderColor: "rgba(201,168,76,0.1)" }}
              >
                <div className="flex justify-between items-baseline">
                  <span
                    className="text-[0.55rem] tracking-[0.3em]"
                    style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
                  >
                    TOTAL (INCL. TAXES)
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold)" }}
                  >
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                className="btn-gold w-full"
                onClick={() => alert("Checkout coming soon. The Order is being assembled.")}
              >
                PROCEED TO INITIATION
              </button>

              <Link
                href="/shop"
                className="block text-center text-[0.55rem] tracking-[0.25em] transition-colors hover:text-[var(--color-gold)]"
                style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}
              >
                ← CONTINUE BROWSING
              </Link>

              {/* Security note */}
              <div
                className="pt-3 border-t"
                style={{ borderColor: "rgba(201,168,76,0.06)" }}
              >
                <p
                  className="text-[0.45rem] tracking-[0.2em] leading-relaxed"
                  style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}
                >
                  ⬡ ENCRYPTED TRANSMISSION · SECURE CHECKOUT · YOUR DATA IS SACRED
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
