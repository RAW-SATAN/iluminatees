"use client";

import { notFound } from "next/navigation";
import { useState, use } from "react";
import Link from "next/link";
import { Star, ChevronDown, ChevronUp, TrendingUp, Heart, Check, Share2 } from "lucide-react";
import { getProductBySlug, products, type ProductSize } from "@/lib/products";
import { ProductMockup } from "@/components/ProductMockup";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

const FAQS = [
  { q: "Check Check Authenticated", a: "Every ILUMINATEES drop undergoes a 5-level verification before dispatch — fabric GSM check, print quality, stitching, sizing accuracy, and packaging integrity. You get what you paid for, guaranteed." },
  { q: "Our Promise", a: "Heavyweight cotton, screen-printed graphics that outlast the trend, and drops that actually sell out. No filler. No fast fashion. Only pieces worth owning." },
  { q: "Money Back Guarantee", a: "If your order arrives damaged, wrong size, or not as described — we refund 100%, no questions asked. Just WhatsApp us within 48 hours of delivery." },
  { q: "Shippings & EMIs", a: "Ships Pan-India within 3-5 business days. Express delivery available. No-cost EMI on orders above ₹999 via Razorpay, PhonePe Pay Later, and select cards." },
  { q: "FAQ", a: "Q: 100% cotton? Yes — 220-260 GSM heavyweight ringspun cotton.\nQ: Wash care? Cold wash, inside out, no tumble dry.\nQ: Restocks? Limited drops never restock. Sacred/Cipher series may restock once per season." },
  { q: "Product Information", a: "220-260 GSM heavyweight cotton. Pre-washed, pre-shrunk. Oversized/boxy/relaxed fit depending on style. Screen-printed graphics — not DTG. Unisex sizing." },
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

const REVIEWS = [
  { name: "Aryan Dam", product: "Eye of Providence", rating: 4, text: "Got my tee from ILUMINATEES — quality is insane, fast shipping, print is crisp even after multiple washes...", initials: "AD" },
  { name: "Priya Sharma", product: "Sacred Geometry", rating: 4, text: "My Sacred Geometry tee is perfect! Quick delivery and the fabric is genuinely heavyweight, not like those cheap ones...", initials: "PS" },
  { name: "Raj Mehta", product: "Cipher 33", rating: 5, text: "Cipher 33 is stunning. The unboxing experience alone was worth it. Will definitely order again from ILUMINATEES...", initials: "RM" },
  { name: "Vikram Patel", product: "The Architect", rating: 4, text: "The Architect drop delivered faster than expected. Packaging is premium and the tee fits exactly as described...", initials: "VP" },
];

const GUARANTEES = [
  { icon: "🏛️", title: "Luxury Marketplace", desc: "Premium drops priced fairly. Less popular pieces sell below market because we don't inflate." },
  { icon: "⚡", title: "Competition Between Sellers", desc: "We constantly benchmark quality across the market so you always get the best value." },
  { icon: "💰", title: "Price Comparision", desc: "We compare our prices across the market so you never overpay for quality streetwear." },
  { icon: "🤝", title: "Helping Sellers, Helping You", desc: "We help our supply chain work smarter, passing the savings directly to you." },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "0.78rem", color: "#111", textAlign: "left" }}
      >
        {q}
        {open ? <ChevronUp size={14} color="#555" /> : <ChevronDown size={14} color="#555" />}
      </button>
      {open && (
        <div style={{ paddingBottom: "1rem", fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "#666", lineHeight: 1.75, whiteSpace: "pre-line" }}>
          {a}
        </div>
      )}
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13} color={i <= rating ? "#f5a623" : "#e0e0e0"} fill={i <= rating ? "#f5a623" : "none"} />
      ))}
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const productData = getProductBySlug(slug);
  if (!productData) notFound();
  const product = productData!;

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const availSizes = SIZES.filter(s => product.sizes.includes(s));
  const [selectedSize, setSelectedSize] = useState<ProductSize>(availSizes[2] ?? availSizes[0]);
  const [added, setAdded] = useState(false);
  const [priceTab, setPriceTab] = useState<"recommended" | "lowest" | "fastest">("fastest");

  const wishlisted = isWishlisted(product.slug);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const emi = Math.round(product.price / 9);
  const sold = parseInt(product.id) * 97 + 124;
  const related = products.filter(p => p.id !== product.id).slice(0, 6);
  const byTheCulture = products.filter(p => p.id !== product.id).slice(0, 5);

  function handleAddToCart() {
    addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, size: selectedSize, quantity: 1, shirtColor: product.shirtColor, symbol: product.symbol });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── Two-panel ─────────────────────────────── */}
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 1.5rem 0", display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: "2.5rem", alignItems: "start" }}
        className="product-grid"
      >

        {/* ── LEFT ──────────────────────────── */}
        <div style={{ position: "sticky", top: 130 }}>
          <div style={{ display: "flex", gap: 10 }}>

            {/* Thumbnails */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 62, height: 72, background: "#f5f5f5", borderRadius: 8, border: "1.5px solid #e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <ProductMockup product={product} size={46} />
                </div>
              ))}
            </div>

            {/* Main image */}
            <div style={{ flex: 1 }}>
              {/* Icons row */}
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <Share2 size={16} color="#555" />
                </button>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><path d="M18 21l-6-3-6 3V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" /></svg>
                </button>
                <button onClick={() => toggleItem(product.slug)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Heart size={16} color={wishlisted ? "#e8000d" : "#555"} fill={wishlisted ? "#e8000d" : "none"} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#555" }}>53.0k</span>
                </button>
              </div>

              <div style={{ background: "#f5f5f5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 420, padding: "2.5rem 2rem", position: "relative" }}>
                <div style={{ position: "absolute", top: 14, left: 14, opacity: 0.3 }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.34rem", color: "#111", letterSpacing: "0.04em", lineHeight: 1.3 }}>
                    AS SEEN ON<br />
                    <span style={{ fontFamily: "Anton, sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em" }}>SHARK TANK</span>
                  </div>
                </div>
                <ProductMockup product={product} size={300} />
              </div>

              {/* Sold + rating bar */}
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.55rem 0.85rem", background: "#fff", border: "1px solid #eee", borderRadius: 8 }}>
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

        {/* ── RIGHT ────────────────────────── */}
        <div>

          {/* Breadcrumb */}
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#aaa", marginBottom: 10, letterSpacing: "0.02em", textTransform: "uppercase" }}>
            <Link href="/shop" style={{ color: "#aaa", textDecoration: "none" }}>SHOP</Link>
            {" · "}
            <Link href={`/shop?cat=${product.category}`} style={{ color: "#aaa", textDecoration: "none" }}>{product.category}</Link>
          </div>

          {/* Product name */}
          <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)", color: "#111", marginBottom: 16, lineHeight: 1.25 }}>
            {product.name}
          </h1>

          {/* Trust badge buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: 8, padding: "0.65rem 0.85rem", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#2e7d32", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={11} color="#fff" strokeWidth={3} />
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.62rem", color: "#1b5e20" }}>Easy Exchanges</span>
              </div>
              <span style={{ fontSize: "0.7rem", color: "#2e7d32", fontWeight: 700 }}>›</span>
            </button>
            <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#e3f2fd", border: "1px solid #bbdefb", borderRadius: 8, padding: "0.65rem 0.85rem", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#1565c0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.62rem", color: "#0d47a1" }}>On Time Guarantee</span>
              </div>
              <span style={{ fontSize: "0.7rem", color: "#1565c0", fontWeight: 700 }}>›</span>
            </button>
          </div>

          {/* Size dropdown */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.62rem", color: "#111", letterSpacing: "0.04em" }}>SELECT YOUR SIZE</span>
              <div style={{ display: "flex", gap: 12 }}>
                <a href="#" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#555", textDecoration: "underline" }}>↗ Size Chart</a>
                <a href="#" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#555", textDecoration: "underline" }}>Find in store</a>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value as ProductSize)}
                style={{ width: "100%", padding: "0.85rem 2.5rem 0.85rem 1rem", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "#111", background: "#fff", border: "1.5px solid #ddd", borderRadius: 8, appearance: "none", cursor: "pointer", outline: "none" }}
              >
                {availSizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <ChevronDown size={14} color="#555" />
              </div>
            </div>
          </div>

          {/* Urgency bar */}
          <div style={{ background: "#fff1f2", border: "1px solid #ffd7d9", borderRadius: 8, padding: "0.6rem 0.9rem", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#e8000d", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.62rem", color: "#111" }}>Biggest Sale Of The Year</span>
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", color: "#e8000d", flexShrink: 0 }}>98% Claimed</span>
          </div>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#111" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "#999", textDecoration: "line-through" }}>
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discount && (
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#111" }}>
                {discount}% OFF
              </span>
            )}
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#888" }}>By ILUMINATEES</span>
          </div>

          {/* Delivery line */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5a623", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", color: "#111" }}>EXPRESS</span>
            <span style={{ color: "#ccc" }}>·</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#555" }}>Free Delivery</span>
            <span style={{ color: "#ccc" }}>·</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#555" }}>Ships Today</span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            style={{ width: "100%", padding: "1rem", borderRadius: 10, background: added ? "#333" : "#111", color: "#fff", border: "none", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", marginBottom: 10, transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            {added ? <><Check size={15} /> Added To Bag</> : "Add To Cart →"}
          </button>

          {/* Pay later */}
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#888", textAlign: "center", marginBottom: 12 }}>
            Get It At <strong style={{ color: "#111" }}>₹{emi.toLocaleString("en-IN")}/Month</strong> With ILUMINATEES Pay Later
          </div>

          {/* Auth row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 0.9rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, marginBottom: 16, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={11} color="#fff" strokeWidth={3} />
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.57rem", color: "#333", lineHeight: 1.4 }}>
                Each Product Includes A{" "}
                <span style={{ color: "#0066cc", textDecoration: "underline" }}>Quality Certificate</span>,{" "}
                <span style={{ color: "#0066cc", textDecoration: "underline" }}>Buyer Protection Policy</span>{" "}
                And{" "}
                <span style={{ color: "#0066cc", textDecoration: "underline" }}>Delivery Insurance</span>
              </span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#555", flexShrink: 0, marginLeft: 8 }}>›</span>
          </div>

          {/* Compare Prices */}
          <div style={{ border: "1.5px solid #eee", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem 1rem", borderBottom: "1px solid #eee" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#111" }}>
                COMPARE PRICES FOR{" "}
                <span style={{ color: "#0066cc" }}>{selectedSize}</span>
              </span>
              <ChevronDown size={14} color="#555" />
            </div>
            <div style={{ padding: "0.75rem 1rem 0" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {(["recommended", "lowest", "fastest"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPriceTab(tab)}
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.54rem", padding: "0.32rem 0.65rem", borderRadius: 20, border: "1.5px solid", borderColor: priceTab === tab ? "#111" : "#ddd", background: priceTab === tab ? "#111" : "#fff", color: priceTab === tab ? "#fff" : "#555", cursor: "pointer" }}
                  >
                    {tab === "recommended" ? "Recommended" : tab === "lowest" ? "Lowest Price" : "Fastest Delivery"}
                  </button>
                ))}
              </div>
              {/* Seller row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderTop: "1px solid #f5f5f5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "Anton, sans-serif", fontSize: "0.42rem", color: "#fff", letterSpacing: "0.05em" }}>ILMN</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#111", display: "flex", alignItems: "center", gap: 5 }}>
                      ILUMINATEES
                      <span style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 4, padding: "0.08rem 0.32rem", fontSize: "0.48rem", fontWeight: 700 }}>✓ Verified</span>
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#555", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f5a623", display: "inline-block" }} />
                      EXPRESS · Free Delivery · Ships Today
                    </div>
                  </div>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#111" }}>₹{product.price.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Delivery & Services */}
            <div style={{ borderTop: "1px solid #eee", padding: "0.8rem 1rem" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem", color: "#555", marginBottom: 12, letterSpacing: "0.06em" }}>
                DELIVERY AND SERVICES
              </div>
              {[
                { icon: "🔄", title: "Easy Exchange & Buyer Protection Policy", desc: "ILUMINATEES offers size exchange and 100% satisfaction guarantee on every drop." },
                { icon: "📦", title: "Cash on Delivery Available", desc: "Available on orders above ₹999" },
                { icon: "⚡", title: "Express Shipping", desc: "Your order ships today if placed before 2 PM." },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.6rem", color: "#111" }}>{title}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#888", marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WhatsApp Chats (instead of Certificate) ── */}
      <div style={{ maxWidth: 1280, margin: "3.5rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
          STRAIGHT FROM THE DMs
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em", color: "#111", textTransform: "uppercase" }}>
            What The Culture Says
          </h2>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#aaa" }}>5.8k+ Reviews</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
          {WA_CHATS.map(chat => (
            <div key={chat.name} style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.09)", border: "1px solid #e0e0e0" }}>
              <div style={{ background: "#075E54", padding: "0.65rem 1rem", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: chat.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#fff", flexShrink: 0 }}>
                  {chat.avatar}
                </div>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.64rem", color: "#fff" }}>{chat.name}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.46rem", color: "rgba(255,255,255,0.6)" }}>online</div>
                </div>
              </div>
              <div style={{ background: "#ece5dd", padding: "0.75rem", display: "flex", flexDirection: "column", gap: 6 }}>
                {chat.messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.out ? "flex-end" : "flex-start" }}>
                    <div style={{ background: msg.out ? "#dcf8c6" : "#fff", borderRadius: msg.out ? "10px 10px 2px 10px" : "10px 10px 10px 2px", padding: "0.42rem 0.65rem", maxWidth: "82%", boxShadow: "0 1px 2px rgba(0,0,0,0.07)" }}>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#111", lineHeight: 1.4 }}>{msg.text}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.42rem", color: "#aaa", textAlign: "right", marginTop: 2 }}>
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

      {/* ── Reviews ───────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "3rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
          LETS HEAR IT
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em", color: "#111", textTransform: "uppercase" }}>
            From The Culture
          </h2>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#aaa" }}>5.8k+ Reviews</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {REVIEWS.map(rev => (
            <div key={rev.name} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "1.1rem 0", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ flex: 1 }}>
                <StarRow rating={rev.rating} />
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#111", margin: "6px 0 2px" }}>{rev.product}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#555", lineHeight: 1.5 }}>{rev.text}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.6rem", color: "#111" }}>{rev.name}</div>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f0f0f0", marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#555" }}>{rev.initials}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "2.5rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.56rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
          MOST ASKED QUESTIONS
        </div>
        <div style={{ borderTop: "1px solid #f0f0f0" }}>
          {FAQS.map(f => <AccordionItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </div>

      {/* ── Guarantee Best Prices ─────────────────── */}
      <div style={{ maxWidth: 1280, margin: "3rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ background: "#f9f9f9", borderRadius: 16, padding: "2rem" }}>
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

      {/* ── Similar Product ───────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "3rem auto 0", padding: "0 1.5rem 1rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
          SIMILAR PRODUCT
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: "0.5rem" }} className="no-scrollbar">
          {related.map(p => {
            const pDisc = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null;
            return (
              <Link key={p.id} href={`/product/${p.slug}`} style={{ textDecoration: "none", flexShrink: 0, width: 190, border: "1px solid #eee", borderRadius: 12, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", position: "relative" }}>
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

      {/* ── By The Culture ────────────────────────── */}
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
          .product-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
