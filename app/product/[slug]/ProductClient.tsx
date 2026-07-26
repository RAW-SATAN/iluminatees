"use client";

import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Star, ChevronDown, ChevronUp, TrendingUp, Heart, Check, Share2 } from "lucide-react";
import { getProductBySlug, products as staticProducts, type ProductSize } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
import { useSiteAssets } from "@/lib/useSiteAssets";
import { ProductMockup } from "@/components/ProductMockup";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { TryOnModal } from "@/components/TryOnModal";

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

const FAQS = [
  { q: "Check Check Authenticated", a: "Every ILUMINATEES drop undergoes a 5-level verification before dispatch — fabric GSM check, print quality, stitching, sizing accuracy, and packaging integrity. You get what you paid for, guaranteed." },
  { q: "Our Promise", a: "Heavyweight cotton, screen-printed graphics that outlast the trend, and drops that actually sell out. No filler. No fast fashion. Only pieces worth owning." },
  { q: "Money Back Guarantee", a: "If your order arrives damaged, wrong size, or not as described — we refund 100%, no questions asked. Just WhatsApp us within 48 hours of delivery." },
  { q: "Shipping", a: "Ships Pan-India within 3-5 business days. Express delivery available on orders placed before 2 PM." },
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
  { name: "Aryan Dam", productName: "Eye of Providence", slug: "eye-of-providence", rating: 4, text: "Got my tee from ILUMINATEES — quality is insane, fast shipping, print is crisp even after multiple washes..." },
  { name: "Priya Sharma", productName: "Sacred Geometry", slug: "sacred-geometry", rating: 4, text: "My Sacred Geometry tee is perfect! Quick delivery and the fabric is genuinely heavyweight, not like those cheap ones..." },
  { name: "Raj Mehta", productName: "Cipher 33", slug: "cipher-33", rating: 5, text: "Cipher 33 is stunning. The unboxing experience alone was worth it. Will definitely order again from ILUMINATEES..." },
  { name: "Vikram Patel", productName: "The Architect", slug: "the-architect", rating: 4, text: "The Architect drop delivered faster than expected. Packaging is premium and the tee fits exactly as described..." },
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

export default function ProductClient({ slug }: { slug: string }) {
  const allProducts = useProducts();

  // Use merged product (with localStorage edits/images) if available, else static
  const productData = allProducts.find(p => p.slug === slug) ?? getProductBySlug(slug);
  if (!productData) notFound();
  const product = productData!;

  const router = useRouter();
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const availSizes = SIZES.filter(s => product.sizes.includes(s));
  const [selectedSize, setSelectedSize] = useState<ProductSize>(availSizes[2] ?? availSizes[0]);
  const availColors = product.colors ?? [];
  const [selectedColor, setSelectedColor] = useState<string>(availColors[0]?.hex ?? product.shirtColor);
  const [added, setAdded] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [bundleSize, setBundleSize] = useState<1 | 2 | 3>(1);
  const [bundlePicks, setBundlePicks] = useState<string[]>([]);

  const wishlisted = isWishlisted(product.slug);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const { misc } = useSiteAssets();
  const sizeChartImg = misc["sizechart"];
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const sold = parseInt(product.id.replace("custom-", "")) % 500 + 124;
  const otherProducts = allProducts.filter(p => p.id !== product.id);
  const related = otherProducts.slice(0, 6);
  const byTheCult = otherProducts.slice(0, 5);

  const fbtProducts = otherProducts.slice(0, 2);
  const [fbtSelected, setFbtSelected] = useState<string[]>(fbtProducts.map(p => p.slug));
  const fbtTotal = product.price + fbtProducts.filter(p => fbtSelected.includes(p.slug)).reduce((s, p) => s + p.price, 0);

  function toggleBundlePick(slug: string) {
    const slots = bundleSize - 1;
    setBundlePicks(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : prev.length < slots ? [...prev, slug] : [...prev.slice(1), slug]
    );
  }

  function handleAddToCart() {
    addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, size: selectedSize, quantity: 1, shirtColor: product.shirtColor, symbol: product.symbol });
    const bundleDiscount = bundleSize === 2 ? 0.10 : bundleSize === 3 ? 0.15 : 0;
    bundlePicks.forEach(s => {
      const p = allProducts.find(x => x.slug === s);
      if (p) addItem({ productId: p.id, slug: p.slug, name: p.name, price: Math.round(p.price * (1 - bundleDiscount)), size: selectedSize in p.sizes ? selectedSize : (p.sizes[0] as ProductSize), quantity: 1, shirtColor: p.shirtColor, symbol: p.symbol });
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── Two-panel grid ─────────────────────────── */}
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 1.5rem 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}
        className="product-grid"
      >

        {/* ── LEFT (sticky) ──────────────────────────── */}
        <div className="product-sticky-col" style={{ position: "sticky", top: 130, alignSelf: "start" }}>
          <div className="product-gallery" style={{ display: "flex", gap: 10 }}>

            {/* Thumbnails */}
            {(() => {
              const imgs = product.customImages ?? (product.customImage ? [product.customImage] : []);
              const thumbs = imgs.length > 0 ? imgs : [null, null, null];
              return (
                <div className="product-thumbnails" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {thumbs.map((img, i) => (
                    <div key={i} onClick={() => img && setActiveImgIdx(i)}
                      className="product-thumbnail-item"
                      style={{ width: 68, height: 84, background: "#f5f5f5", borderRadius: 8, border: `1.5px solid ${activeImgIdx === i && img ? "#111" : "#e8e8e8"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: img ? "pointer" : "default", flexShrink: 0, overflow: "hidden" }}>
                      {img
                        ? <img src={img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <ProductMockup product={product} size={52} colorOverride={selectedColor} />
                      }
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Main image */}
            {(() => {
              const imgs = product.customImages ?? (product.customImage ? [product.customImage] : []);
              const activeImg = imgs[activeImgIdx] ?? imgs[0] ?? null;
              return (
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

                  <div className="product-main-img" style={{ background: "#f5f5f5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 500, padding: activeImg ? 0 : "3rem 2rem", position: "relative", overflow: "hidden" }}>
                    {activeImg ? (
                      <img src={activeImg} alt={product.name} style={{ width: "100%", height: "100%", minHeight: 500, objectFit: "cover", borderRadius: 12 }} />
                    ) : (
                      <>
                        <div style={{ position: "absolute", top: 14, left: 14, opacity: 0.3 }}>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.34rem", color: "#111", letterSpacing: "0.04em", lineHeight: 1.3 }}>
                            AS SEEN ON<br />
                            <span style={{ fontFamily: "Anton, sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em" }}>SHARK TANK</span>
                          </div>
                        </div>
                        <ProductMockup product={product} size={340} colorOverride={selectedColor} />
                      </>
                    )}
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

                  {/* TRY ON button — hidden until feature is ready */}
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── RIGHT (all scrollable content) ──────────── */}
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
          <div className="product-trust-badges" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
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

          {/* Color picker */}
          {availColors.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.62rem", color: "#111", letterSpacing: "0.04em" }}>
                  COLOR:
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#555" }}>
                  {availColors.find(c => c.hex === selectedColor)?.name ?? ""}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {availColors.map(col => {
                  const active = selectedColor === col.hex;
                  const isLight = parseInt(col.hex.replace("#", ""), 16) > 0x888888;
                  return (
                    <button
                      key={col.hex}
                      title={col.name}
                      onClick={() => setSelectedColor(col.hex)}
                      style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: col.hex,
                        border: active
                          ? `3px solid ${isLight ? "#111" : col.hex === "#050505" ? "#555" : "#111"}`
                          : "2px solid #e0e0e0",
                        boxShadow: active ? `0 0 0 2px #fff, 0 0 0 4px ${isLight ? "#333" : col.hex}` : "none",
                        cursor: "pointer", padding: 0, flexShrink: 0,
                        transition: "box-shadow 0.15s, border 0.15s",
                        outline: "none",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size dropdown */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.62rem", color: "#111", letterSpacing: "0.04em" }}>SELECT YOUR SIZE</span>
              {sizeChartImg && (
                <button onClick={() => setShowSizeChart(true)} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#555", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  ↗ Size Chart
                </button>
              )}
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

          {/* Button row */}
          <div className="product-btn-row" style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <button
              onClick={handleAddToCart}
              style={{ flex: 1, padding: "1rem", borderRadius: 10, background: added ? "#333" : "#fff", color: added ? "#fff" : "#111", border: "1.5px solid #111", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              {added ? <><Check size={15} /> Added</> : "Add To Cart"}
            </button>
            <button
              onClick={() => {
                addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, size: selectedSize, quantity: 1, shirtColor: product.shirtColor, symbol: product.symbol });
                const bundleDiscount = bundleSize === 2 ? 0.10 : bundleSize === 3 ? 0.15 : 0;
                bundlePicks.forEach(s => {
                  const p = allProducts.find(x => x.slug === s);
                  if (p) addItem({ productId: p.id, slug: p.slug, name: p.name, price: Math.round(p.price * (1 - bundleDiscount)), size: selectedSize in p.sizes ? selectedSize : (p.sizes[0] as ProductSize), quantity: 1, shirtColor: p.shirtColor, symbol: p.symbol });
                });
                router.push("/cart");
              }}
              style={{ flex: 1, padding: "1rem", borderRadius: 10, background: "#111", color: "#fff", border: "none", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              Buy Now →
            </button>
          </div>

          {/* Auth row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 0.9rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, marginBottom: 16, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={11} color="#fff" strokeWidth={3} />
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.57rem", color: "#333", lineHeight: 1.4 }}>
                Each Product Includes A{" "}
                <span style={{ color: "#0066cc", textDecoration: "underline" }}>Quality Certificate</span>{" "}
                And{" "}
                <span style={{ color: "#0066cc", textDecoration: "underline" }}>Delivery Insurance</span>
              </span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#555", flexShrink: 0, marginLeft: 8 }}>›</span>
          </div>

          {/* Bundles */}
          <div style={{ border: "1.5px solid #eee", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "0.8rem 1rem", borderBottom: "1px solid #eee" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#111" }}>BUNDLE &amp; SAVE</span>
            </div>

            {/* Bundle size selector */}
            <div style={{ padding: "0.85rem 1rem 0.75rem", display: "flex", flexDirection: "column", gap: 8 }}>
              {([
                { size: 1 as const, label: "Just This One", discount: 0, badge: null },
                { size: 2 as const, label: "Any 2 Shirts", discount: 10, badge: "POPULAR" },
                { size: 3 as const, label: "Any 3 Shirts", discount: 15, badge: "BEST DEAL" },
              ]).map(({ size, label, discount: d, badge }) => {
                const sel = bundleSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => { setBundleSize(size); setBundlePicks([]); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 0.85rem", borderRadius: 8, border: `1.5px solid ${sel ? "#111" : "#e8e8e8"}`, background: sel ? "#111" : "#fafafa", cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${sel ? "#fff" : "#bbb"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {sel && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.63rem", color: sel ? "#fff" : "#111", display: "flex", alignItems: "center", gap: 6 }}>
                          {label}
                          {badge && <span style={{ background: sel ? "rgba(255,255,255,0.18)" : "#111", color: "#fff", borderRadius: 4, padding: "0.05rem 0.38rem", fontSize: "0.42rem", fontWeight: 700, letterSpacing: "0.05em" }}>{badge}</span>}
                        </div>
                        {d > 0 && <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.5rem", color: sel ? "rgba(255,255,255,0.6)" : "#888", marginTop: 1 }}>{d}% off each shirt</div>}
                      </div>
                    </div>
                    {d > 0 && (
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: sel ? "#fff" : "#111" }}>
                        SAVE {d}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Product picker — shown when bundle size > 1 */}
            {bundleSize > 1 && (
              <div style={{ borderTop: "1px solid #f0f0f0", padding: "0.85rem 1rem" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.56rem", color: "#555", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: "#111" }}>+ Pick {bundleSize - 1} more shirt{bundleSize > 2 ? "s" : ""}</span>
                  {" "}· {bundlePicks.length}/{bundleSize - 1} selected
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {otherProducts.slice(0, 8).map(p => {
                    const picked = bundlePicks.includes(p.slug);
                    return (
                      <button
                        key={p.slug}
                        onClick={() => toggleBundlePick(p.slug)}
                        style={{ position: "relative", width: 64, height: 80, borderRadius: 8, border: `2px solid ${picked ? "#111" : "#e8e8e8"}`, background: picked ? "#111" : "#f5f5f5", cursor: "pointer", padding: 0, overflow: "hidden", flexShrink: 0 }}
                        title={p.name}
                      >
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ProductMockup product={p} size={50} />
                        </div>
                        {picked && (
                          <div style={{ position: "absolute", top: 3, right: 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", border: "1.5px solid #111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={9} color="#111" strokeWidth={3} />
                          </div>
                        )}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: picked ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)", padding: "0.2rem 0.3rem", textAlign: "center" }}>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.38rem", color: "#fff", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {bundlePicks.length === bundleSize - 1 && (
                  <div style={{ marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: "0.54rem", color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <Check size={11} color="#16a34a" strokeWidth={3} /> Bundle ready! {bundleSize} shirts · {bundleSize === 2 ? "10" : "15"}% off
                  </div>
                )}
              </div>
            )}

            {/* Delivery & Services */}
            <div style={{ borderTop: "1px solid #eee", padding: "0.8rem 1rem" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem", color: "#555", marginBottom: 12, letterSpacing: "0.06em" }}>
                DELIVERY AND SERVICES
              </div>
              {[
                { icon: "🔄", title: "Easy Exchange Policy", desc: "ILUMINATEES offers size exchange and 100% satisfaction guarantee on every drop." },
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

          {/* ── Frequently Bought Together ── */}
          <div style={{ marginTop: "1.5rem", border: "1.5px solid #eee", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "0.8rem 1rem", borderBottom: "1px solid #eee" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#111" }}>USUALLY BOUGHT TOGETHER</span>
            </div>
            <div style={{ padding: "1rem" }}>
              {/* Product thumbnails row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                {[{ p: product, fixed: true }, ...fbtProducts.map(p => ({ p, fixed: false }))].map(({ p, fixed }, idx) => (
                  <div key={p.slug} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {idx > 0 && <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#ccc" }}>+</span>}
                    <div style={{ position: "relative" }}>
                      <div style={{ width: 70, height: 84, background: "#f5f5f5", borderRadius: 8, border: `1.5px solid ${!fixed && !fbtSelected.includes(p.slug) ? "#e0e0e0" : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: !fixed && !fbtSelected.includes(p.slug) ? 0.4 : 1, transition: "opacity 0.15s" }}>
                        <ProductMockup product={p} size={54} />
                      </div>
                      {!fixed && (
                        <button
                          onClick={() => setFbtSelected(prev => prev.includes(p.slug) ? prev.filter(s => s !== p.slug) : [...prev, p.slug])}
                          style={{ position: "absolute", top: -5, right: -5, width: 18, height: 18, borderRadius: "50%", border: `2px solid ${fbtSelected.includes(p.slug) ? "#111" : "#ccc"}`, background: fbtSelected.includes(p.slug) ? "#111" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        >
                          {fbtSelected.includes(p.slug) && <Check size={9} color="#fff" strokeWidth={3} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Names + prices list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {[{ p: product, fixed: true }, ...fbtProducts.map(p => ({ p, fixed: false }))].map(({ p, fixed }) => (
                  <div key={p.slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: !fixed && !fbtSelected.includes(p.slug) ? 0.4 : 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {fixed
                        ? <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", background: "#111", color: "#fff", borderRadius: 3, padding: "0.08rem 0.35rem", fontWeight: 700 }}>THIS</span>
                        : <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#aaa" }}>+</span>
                      }
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#333", fontWeight: 500 }}>{p.name}</span>
                    </div>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", color: "#111" }}>₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              {/* Total + CTA */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "#888" }}>Total for {1 + fbtSelected.length} item{fbtSelected.length > 0 ? "s" : ""}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#111" }}>₹{fbtTotal.toLocaleString("en-IN")}</div>
                </div>
                <button
                  onClick={() => {
                    addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, size: selectedSize, quantity: 1, shirtColor: product.shirtColor, symbol: product.symbol });
                    fbtProducts.filter(p => fbtSelected.includes(p.slug)).forEach(p => {
                      addItem({ productId: p.id, slug: p.slug, name: p.name, price: p.price, size: (p.sizes.includes(selectedSize) ? selectedSize : p.sizes[0]) as ProductSize, quantity: 1, shirtColor: p.shirtColor, symbol: p.symbol });
                    });
                  }}
                  style={{ padding: "0.65rem 1.2rem", borderRadius: 8, background: "#111", color: "#fff", border: "none", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", cursor: "pointer" }}
                >
                  Add All To Cart
                </button>
              </div>
            </div>
          </div>

          {/* ── WhatsApp Chats ── */}
          <div style={{ marginTop: "2.5rem" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
              STRAIGHT FROM THE DMs
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em", color: "#111", textTransform: "uppercase" }}>
                What The Cult Says
              </h2>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#aaa" }}>5.8k+ Reviews</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
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

          {/* ── Dark "Join The Order" banner ── */}
          <div style={{ marginTop: "2rem" }}>
            <div style={{ background: "#0d0d0d", borderRadius: 16, padding: "2rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", right: "30%", top: "50%", transform: "translateY(-50%)", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                  CUT THE HASSLE AND
                </div>
                <div style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#fff", letterSpacing: "0.04em", marginBottom: 20 }}>
                  Join The Order
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "0.5rem 1.1rem" }}>
                  <span style={{ fontSize: "0.85rem" }}>📱</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.14em", color: "#fff", textTransform: "uppercase" }}>
                    Mobile App — Coming Soon
                  </span>
                </div>
              </div>
              {/* QR + phone mockup */}
              <div className="product-dark-banner-side" style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
                <div style={{ width: 70, height: 70, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}>
                  <svg width="58" height="58" viewBox="0 0 58 58">
                    <rect width="58" height="58" fill="#fff"/>
                    {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => (
                      <rect key={`${r}-${c}`} x={4 + c * 7} y={4 + r * 7} width={6} height={6} fill={((r + c) % 3 === 0 || (r === 0 || r === 6) || (c === 0 || c === 6)) ? "#111" : "#fff"} />
                    )))}
                  </svg>
                </div>
                <div style={{ width: 90, height: 130, background: "#1a1a1a", borderRadius: 14, border: "3px solid #333", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg, #111 0%, #1a1a1a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <div style={{ fontFamily: "Anton, sans-serif", fontSize: "0.55rem", color: "#fff", letterSpacing: "0.1em" }}>ILUMINATEES</div>
                    <div style={{ width: 40, height: 40, background: "#222", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "1.2rem" }}>👁</span>
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.32rem", color: "rgba(255,255,255,0.4)" }}>TAP TO EXPLORE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Reviews ── */}
          <div style={{ marginTop: "2rem" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
              LETS HEAR IT
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em", color: "#111", textTransform: "uppercase" }}>
                From The Cult
              </h2>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#aaa" }}>5.8k+ Reviews</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {REVIEWS.map(rev => {
                const revProduct = allProducts.find(p => p.slug === rev.slug);
                return (
                  <div key={rev.name} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "1.1rem 0", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ flex: 1 }}>
                      <StarRow rating={rev.rating} />
                      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#111", margin: "6px 0 2px" }}>{rev.productName}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#555", lineHeight: 1.5 }}>{rev.text}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.6rem", color: "#111", marginBottom: 6 }}>{rev.name}</div>
                      <div style={{ width: 52, height: 52, borderRadius: 8, background: "#f5f5f5", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {revProduct
                          ? <ProductMockup product={revProduct} size={40} />
                          : <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", color: "#aaa" }}>{rev.name.slice(0, 2).toUpperCase()}</span>
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ marginTop: "2.5rem" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.56rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
              MOST ASKED QUESTIONS
            </div>
            <div style={{ borderTop: "1px solid #f0f0f0" }}>
              {FAQS.map(f => <AccordionItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>

          {/* ── Guarantee Best Prices ── */}
          <div style={{ marginTop: "2rem", paddingBottom: "3rem" }}>
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

        </div>
        {/* ── /RIGHT ── */}

      </div>
      {/* ── /GRID ── */}

      {/* ── Similar Products (FULL WIDTH) ── */}
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
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── By The Cult (FULL WIDTH) ── */}
      <div style={{ maxWidth: 1280, margin: "2.5rem auto 0", padding: "0 1.5rem 5rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.54rem", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
          YOU MAY ALSO LIKE
        </div>
        <h3 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em", color: "#111", textTransform: "uppercase", marginBottom: 20 }}>
          By The Cult
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 14 }}>
          {byTheCult.map(p => (
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

      {/* ── Size Chart Modal ── */}
      {showSizeChart && sizeChartImg && (
        <div onClick={() => setShowSizeChart(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, maxWidth: 640, width: "100%", maxHeight: "85vh", overflow: "auto", position: "relative" }}>
            <button onClick={() => setShowSizeChart(false)} style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: "50%", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.8rem", zIndex: 1 }}>✕</button>
            <div style={{ padding: "1rem 1rem 0.5rem", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#111" }}>Size Chart</div>
            <img src={sizeChartImg} alt="Size chart" style={{ width: "100%", display: "block" }} />
          </div>
        </div>
      )}

      {/* TRY ON modal */}
      {showTryOn && (
        <TryOnModal
          productName={product.name}
          garmentImageUrl={
            product.customImages?.[0] ?? product.customImage ?? null
          }
          onClose={() => setShowTryOn(false)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .product-sticky-col { position: static !important; }
          .product-gallery { flex-direction: column-reverse !important; }
          .product-thumbnails { flex-direction: row !important; overflow-x: auto; gap: 8px !important; }
          .product-thumbnail-item { flex-shrink: 0 !important; }
          .product-main-img { min-height: 340px !important; }
        }
      `}</style>
    </div>
  );
}
