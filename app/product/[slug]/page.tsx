"use client";

import { notFound } from "next/navigation";
import { useState, use } from "react";
import Link from "next/link";
import { Star, ChevronDown, ChevronUp, TrendingUp, Heart, Check } from "lucide-react";
import { getProductBySlug, products, type ProductSize } from "@/lib/products";
import { ProductMockup } from "@/components/ProductMockup";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

const FAQS = [
  {
    q: "Shippings & EMIs",
    a: "We ship Pan-India within 3-5 business days. Express delivery available at checkout. EMI available on all orders above ₹999 via Razorpay / PhonePe Pay Later. No-cost EMI on select cards.",
  },
  {
    q: "FAQ",
    a: "Q: Are these 100% cotton? Yes — all ILUMINATEES use 220-260 GSM heavyweight ringspun cotton.\nQ: Can I wash them? Cold wash, inside out, no tumble dry.\nQ: Do you restock? Limited drops are never restocked. Sacred and Cipher series may restock once per season.",
  },
  {
    q: "Product Information",
    a: "220-260 GSM heavyweight cotton. Pre-washed, pre-shrunk. Oversized / boxy / relaxed fit depending on the style. All prints are screen-printed, not DTG. Sizing is unisex — refer to size chart for exact measurements.",
  },
];

const WA_CHATS = [
  {
    avatar: "R", name: "Rahul K.", color: "#128C7E",
    messages: [
      { text: "bhai ye eye of providence wali tshirt ekdum mast h 🔥", time: "11:32 AM", out: false },
      { text: "quality dekh ke shock ho gaya, itni thick hai", time: "11:33 AM", out: false },
      { text: "Glad you love it! Stay initiated. 🙌", time: "11:34 AM", out: true },
    ],
  },
  {
    avatar: "A", name: "Aryan S.", color: "#25D366",
    messages: [
      { text: "delivery bhi fast thi, 3 days mein aa gayi", time: "2:15 PM", out: false },
      { text: "packaging bhi premium tha, unboxing experience 10/10", time: "2:16 PM", out: false },
      { text: "Thanks bro! Welcome to the order 🕯️", time: "2:18 PM", out: true },
    ],
  },
  {
    avatar: "P", name: "Priya M.", color: "#34B7F1",
    messages: [
      { text: "size guide ekdum accurate h, M fit perfectly", time: "6:44 PM", out: false },
      { text: "logo bhi sharp h, 5 washes ke baad bhi nahi nikla 👌", time: "6:45 PM", out: false },
      { text: "That's our promise — screen print lasts! 💪", time: "6:47 PM", out: true },
    ],
  },
];

const GUARANTEES = [
  { icon: "🏛️", title: "Luxury Sourcing", desc: "Premium 220-260 GSM heavyweight ringspun cotton — not the thin stuff. Every drop is quality-checked before it ships." },
  { icon: "⚡", title: "Direct From Source", desc: "We control the full production chain — no middlemen, no markup. That's how we keep prices honest." },
  { icon: "💰", title: "Best Price Promise", desc: "Find the same quality cheaper anywhere? We'll match it, no questions asked." },
  { icon: "🤝", title: "Community First", desc: "10,000+ initiates already in the order. We grow together or we don't grow at all." },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 0", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.7rem", color: "#111", textAlign: "left" }}
      >
        {q}
        {open ? <ChevronUp size={14} color="#555" /> : <ChevronDown size={14} color="#555" />}
      </button>
      {open && (
        <div style={{ paddingBottom: "0.9rem", fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#666", lineHeight: 1.75, whiteSpace: "pre-line" }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  const wishlisted = isWishlisted(product.slug);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const emi = Math.round(product.price / 9);
  const sold = (parseInt(product.id) * 97 + 124);

  const related = products.filter(p => p.id !== product.id).slice(0, 6);
  const byTheCulture = products.filter(p => p.id !== product.id).slice(0, 5);

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, size: selectedSize, quantity: 1, shirtColor: product.shirtColor, symbol: product.symbol });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── Main two-panel ─────────────────────────────── */}
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 1.5rem 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}
        className="product-grid"
      >
        {/* ── LEFT: Image panel ─────────────────────────── */}
        <div>
          <div style={{ display: "flex", gap: 10 }}>

            {/* Thumbnails */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[0, 1].map(i => (
                <div key={i} style={{ width: 68, height: 68, background: "#f5f5f5", borderRadius: 8, border: "1.5px solid #e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <ProductMockup product={product} size={50} />
                </div>
              ))}
            </div>

            {/* Main image */}
            <div style={{ flex: 1, position: "relative" }}>
              <div style={{ background: "#f5f5f5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 460, padding: "3rem 2rem" }}>
                <ProductMockup product={product} size={320} />
              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggleItem(product.slug)}
                style={{ position: "absolute", top: 14, right: 14, width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              >
                <Heart size={15} color={wishlisted ? "#e8000d" : "#ccc"} fill={wishlisted ? "#e8000d" : "none"} />
              </button>

              {/* Bottom bar: sold + rating */}
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.85rem", background: "#fff", border: "1px solid #eee", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <TrendingUp size={12} color="#e8000d" />
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.6rem", color: "#333" }}>
                    {sold} Sold In The Last 7 Days
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={11} color="#f5a623" fill="#f5a623" />
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", color: "#333" }}>4.3</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#aaa" }}>4.4K</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Info panel ─────────────────────────── */}
        <div style={{ paddingTop: "0.25rem" }}>

          {/* Breadcrumb */}
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.54rem", color: "#aaa", marginBottom: 12, letterSpacing: "0.03em" }}>
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>Home</Link>
            {" / "}
            <Link href="/shop" style={{ color: "#aaa", textDecoration: "none" }}>Shop</Link>
            {" / "}
            <span style={{ color: "#555" }}>{product.name}</span>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {["✅ Easy Exchanges", "⚡ On Time Guarantee", "🔒 Genuine Product"].map(b => (
              <span key={b} style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.46rem", color: "#333", background: "#f5f5f5", border: "1px solid #e8e8e8", borderRadius: 20, padding: "0.26rem 0.6rem", letterSpacing: "0.02em" }}>
                {b}
              </span>
            ))}
          </div>

          {/* Name */}
          <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", letterSpacing: "0.04em", color: "#111", textTransform: "uppercase", marginBottom: 10, lineHeight: 1.1 }}>
            {product.name}
          </h1>

          {/* Urgency bar */}
          <div style={{ background: "#fff8e6", border: "1px solid #ffc107", borderRadius: 6, padding: "0.38rem 0.8rem", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: "0.75rem" }}>🔥</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", color: "#8a5700", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Biggest Sale of the Season
            </span>
          </div>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "1.5rem", color: "#111" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.85rem", color: "#bbb", textDecoration: "line-through" }}>
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.52rem", color: "#fff", background: "#e8000d", borderRadius: 4, padding: "0.18rem 0.5rem" }}>
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#aaa", marginBottom: 20 }}>
            EMI @ ₹{emi.toLocaleString("en-IN")}/month · No Cost EMI Available
          </div>

          {/* Size selector */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem", color: sizeError ? "#e8000d" : "#111", letterSpacing: "0.05em" }}>
                {sizeError ? "⚠ Please select a size" : "SELECT SIZE"}
              </span>
              <a href="#" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#aaa", textDecoration: "underline" }}>
                Size Guide
              </a>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SIZES.map(size => {
                const avail = product.sizes.includes(size);
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={!avail}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    style={{
                      width: 46, height: 46, borderRadius: 8,
                      fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem",
                      background: active ? "#111" : "#fff",
                      color: active ? "#fff" : avail ? "#111" : "#ccc",
                      border: `1.5px solid ${active ? "#111" : avail ? "#ddd" : "#eee"}`,
                      cursor: avail ? "pointer" : "not-allowed",
                      textDecoration: !avail ? "line-through" : "none",
                      opacity: avail ? 1 : 0.4,
                      transition: "all 0.15s",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to bag */}
          <button
            onClick={handleAddToCart}
            style={{
              width: "100%", padding: "0.95rem", borderRadius: 10,
              background: added ? "#333" : "#111", color: "#fff", border: "none",
              fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.7rem",
              letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer",
              marginBottom: 12, transition: "background 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {added ? <><Check size={14} /> ADDED TO BAG</> : "ADD TO BAG"}
          </button>

          {/* Delivery info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[
              { icon: "🚚", title: "Free Delivery", sub: "On all orders" },
              { icon: "📦", title: "Ships Today", sub: "Order before 2 PM" },
              { icon: "🔄", title: "Easy Returns", sub: "7-day return policy" },
              { icon: "✅", title: "100% Authentic", sub: "Screen print guaranteed" },
            ].map(({ icon, title, sub }) => (
              <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "0.6rem 0.7rem", background: "#f9f9f9", borderRadius: 8, border: "1px solid #f0f0f0" }}>
                <span style={{ fontSize: "0.85rem" }}>{icon}</span>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", color: "#111" }}>{title}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.48rem", color: "#aaa" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ accordion */}
          <div style={{ borderTop: "1px solid #f0f0f0" }}>
            {FAQS.map(f => <AccordionItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </div>

      {/* ── WhatsApp Chats ─────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "3.5rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#e8000d", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
            STRAIGHT FROM THE DMs
          </div>
          <h2 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em", color: "#111", textTransform: "uppercase" }}>
            What The Culture Says
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
          {WA_CHATS.map(chat => (
            <div key={chat.name} style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.10)", border: "1px solid #e0e0e0" }}>
              {/* WA header */}
              <div style={{ background: "#075E54", padding: "0.65rem 1rem", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: chat.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#fff", flexShrink: 0 }}>
                  {chat.avatar}
                </div>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.64rem", color: "#fff" }}>{chat.name}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.46rem", color: "rgba(255,255,255,0.6)" }}>online</div>
                </div>
              </div>

              {/* Chat body */}
              <div style={{ background: "#ece5dd", padding: "0.8rem", display: "flex", flexDirection: "column", gap: 7 }}>
                {chat.messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.out ? "flex-end" : "flex-start" }}>
                    <div style={{
                      background: msg.out ? "#dcf8c6" : "#fff",
                      borderRadius: msg.out ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                      padding: "0.45rem 0.7rem",
                      maxWidth: "82%",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                    }}>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#111", lineHeight: 1.45 }}>{msg.text}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.42rem", color: "#aaa", textAlign: "right", marginTop: 3 }}>
                        {msg.time}{msg.out && " ✓✓"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Guarantee Best Prices ──────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "3rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ background: "#f9f9f9", borderRadius: 16, padding: "2rem 2rem 2rem" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
            HOW WE ALWAYS
          </div>
          <h3 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)", letterSpacing: "0.04em", color: "#111", textTransform: "uppercase", marginBottom: 22 }}>
            Guarantee The Best Prices?
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
            {GUARANTEES.map(({ icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, background: "#fff", borderRadius: 10, border: "1px solid #e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", color: "#111", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.54rem", color: "#888", lineHeight: 1.65 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Similar Product ────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "3rem auto 0", padding: "0 1.5rem 1rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
          SIMILAR PRODUCT
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: "0.5rem" }} className="no-scrollbar">
          {related.map(p => {
            const pDisc = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null;
            return (
              <Link key={p.id} href={`/product/${p.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", flexShrink: 0, width: 190, border: "1px solid #eee", borderRadius: 12, overflow: "hidden", background: "#fff", position: "relative" }}>
                {pDisc && (
                  <div style={{ position: "absolute", top: 8, left: 8, zIndex: 1, background: "#e8000d", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.42rem", letterSpacing: "0.1em", padding: "0.18rem 0.45rem", borderRadius: 4 }}>
                    UPTO {pDisc}% OFF
                  </div>
                )}
                <div style={{ background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.6rem 1rem", minHeight: 165 }}>
                  <ProductMockup product={p} size={115} />
                </div>
                <div style={{ padding: "0.65rem 0.75rem 0.8rem" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.6rem", color: "#111", marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 2 }}>
                    <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.78rem", color: "#111" }}>₹{p.price.toLocaleString("en-IN")}</span>
                    {p.originalPrice && <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.56rem", color: "#bbb", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString("en-IN")}</span>}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.46rem", color: "#bbb" }}>EMI @ ₹{Math.round(p.price / 9).toLocaleString("en-IN")}/month</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── By The Culture ────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "2.5rem auto 0", padding: "0 1.5rem 5rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
          YOU MAY ALSO LIKE
        </div>
        <h3 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em", color: "#111", textTransform: "uppercase", marginBottom: 20 }}>
          By The Culture
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 14 }}>
          {byTheCulture.map(p => (
            <Link key={p.id} href={`/product/${p.slug}`} style={{ textDecoration: "none", border: "1px solid #eee", borderRadius: 12, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>
              <div style={{ background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem 1rem", minHeight: 155 }}>
                <ProductMockup product={p} size={105} />
              </div>
              <div style={{ padding: "0.65rem 0.7rem 0.8rem" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.58rem", color: "#111", marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {p.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.75rem", color: "#111" }}>₹{p.price.toLocaleString("en-IN")}</span>
                  {p.originalPrice && <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.54rem", color: "#bbb", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString("en-IN")}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
