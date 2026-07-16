"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, Plus, Check, Heart } from "lucide-react";
import { type Product } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
import { ProductMockup } from "@/components/ProductMockup";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";

/* ── Filters ────────────────────────────────────────────── */
const FILTERS = [
  { key: "ALL",        label: "All"            },
  { key: "APEX",       label: "APEX"           },
  { key: "SACRED",     label: "Sacred Series"  },
  { key: "CIPHER",     label: "Cipher Series"  },
  { key: "BESTSELLER", label: "Bestsellers"    },
  { key: "LIMITED",    label: "Limited Drops"  },
  { key: "SALE",       label: "On Sale"        },
  { key: "NEW",        label: "New Arrivals"   },
];

function filterProducts(key: string, products: Product[]): Product[] {
  switch (key) {
    case "APEX":       return products.filter(p => p.category === "APEX");
    case "SACRED":     return products.filter(p => p.category === "SACRED");
    case "CIPHER":     return products.filter(p => p.category === "CIPHER");
    case "BESTSELLER": return products.filter(p => p.tags.includes("bestseller"));
    case "LIMITED":    return products.filter(p => p.limited);
    case "SALE":       return products.filter(p => !!p.originalPrice);
    case "NEW":        return products.filter(p => !p.originalPrice && !p.limited);
    default:           return products;
  }
}

function getTag(p: Product) {
  if (p.originalPrice) {
    const pct = Math.round((1 - p.price / p.originalPrice) * 100);
    return { label: `UPTO ${pct}% OFF`, color: "#fff", bg: "#e8000d" };
  }
  if (p.limited)                       return { label: "LIMITED EDITION", color: "#fff",  bg: "#e8000d" };
  if (p.tags.includes("bestseller"))   return { label: "BESTSELLER",      color: "#111",  bg: "#ffd700" };
  if (p.category === "APEX")           return { label: "⚡ APEX",          color: "#fff",  bg: "#7c00cc" };
  return                                      { label: "NEW ARRIVAL",      color: "#fff",  bg: "#111"    };
}

/* ── Product card ───────────────────────────────────────── */
function ShopCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);
  const tag = getTag(product);
  const emi = Math.round(product.price / 9);
  const wishlisted = isWishlisted(product.slug);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, size: "M", quantity: 1, shirtColor: product.shirtColor, symbol: product.symbol });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {/* Tag */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
        <span style={{ background: tag.bg, color: tag.color, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.4rem", letterSpacing: "0.2em", padding: "0.2rem 0.5rem", borderRadius: 4, textTransform: "uppercase" }}>
          {tag.label}
        </span>
      </div>

      {/* + button */}
      <button onClick={handleAdd} aria-label="Add to cart" style={{ position: "absolute", top: 8, right: 8, zIndex: 2, width: 30, height: 30, borderRadius: "50%", background: added ? "#111" : "#fff", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", transition: "background 0.2s" }}>
        {added ? <Check size={13} color="#fff" strokeWidth={3} /> : <Plus size={13} color="#555" />}
      </button>

      {/* Image */}
      <Link href={`/product/${product.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", flex: 1 }}>
        <div className="card-img" style={{ background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", padding: "2.8rem 1rem 1.8rem", minHeight: 230 }}>
          <ProductMockup product={product} size={150} />
        </div>

        <div style={{ height: 1, background: "#f0f0f0" }} />

        <div className="card-info" style={{ padding: "0.85rem 0.9rem 1rem", flex: 1 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.66rem", color: "#111", lineHeight: 1.4, marginBottom: 7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.name}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: "0.85rem", color: "#111" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", color: "#bbb", textDecoration: "line-through" }}>
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.48rem", color: "#bbb" }}>
            EMI @ ₹{emi.toLocaleString("en-IN")}/month
          </div>
        </div>
      </Link>

      {/* Wishlist */}
      <button onClick={() => toggleItem(product.slug)} style={{ position: "absolute", bottom: 12, right: 10, background: "none", border: "none", cursor: "pointer", padding: 2 }}>
        <Heart size={12} color={wishlisted ? "#e8000d" : "#ccc"} fill={wishlisted ? "#e8000d" : "none"} />
      </button>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function ShopPage() {
  const products = useProducts();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const filtered = filterProducts(activeFilter, products);

  const catLabel = FILTERS.find(f => f.key === activeFilter)?.label ?? "All";

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── Breadcrumb + header ──────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 1.5rem 1rem" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#aaa", marginBottom: 10, letterSpacing: "0.05em" }}>
          <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>HOME</Link>
          {" / "}
          <span style={{ color: "#555" }}>SHOP ALL T-SHIRTS</span>
        </div>
        <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "0.06em", color: "#111", textTransform: "uppercase", marginBottom: 4 }}>
          {catLabel}
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "#aaa" }}>
          Showing {filtered.length} Result{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Sticky filter bar ───────────────────── */}
      <div style={{ position: "sticky", top: 126, zIndex: 40, background: "#fff", borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: 8, overflowX: "auto" }} className="no-scrollbar">

          {/* Filters & Sort */}
          <button style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.1em", color: "#111", background: "#fff", border: "1.5px solid #111", borderRadius: 8, padding: "0.5rem 0.85rem", cursor: "pointer", margin: "8px 8px 8px 0" }}>
            <SlidersHorizontal size={12} />
            Filters &amp; Sort
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: "#eee", flexShrink: 0 }} />

          {/* Category chips */}
          {FILTERS.map(({ key, label }) => {
            const active = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  flexShrink: 0,
                  fontFamily: "Inter, sans-serif", fontWeight: active ? 700 : 500,
                  fontSize: "0.6rem", letterSpacing: "0.06em",
                  color: active ? "#fff" : "#555",
                  background: active ? "#111" : "transparent",
                  border: `1.5px solid ${active ? "#111" : "#e0e0e0"}`,
                  borderRadius: 20, padding: "0.42rem 0.9rem",
                  cursor: "pointer", whiteSpace: "nowrap",
                  margin: "8px 0",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Product grid ────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 1.5rem 4rem" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem", fontFamily: "Inter, sans-serif", color: "#ccc", fontSize: "0.8rem" }}>
            No products in this category yet.
          </div>
        ) : (
          <div className="grid-products" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {filtered.map(p => <ShopCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
