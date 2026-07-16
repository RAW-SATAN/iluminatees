"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, TrendingUp, Heart, Check } from "lucide-react";
import { type Product } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
import { ProductMockup } from "./ProductMockup";
import { useWishlist } from "./WishlistProvider";
import { useCart } from "./CartProvider";

/* ── Category tabs ──────────────────────────────────────── */
const CATS = [
  { key: "ALL",        label: "ALL" },
  { key: "APEX",       label: "APEX" },
  { key: "SACRED",     label: "SACRED" },
  { key: "CIPHER",     label: "CIPHER" },
  { key: "BESTSELLER", label: "BESTSELLER" },
  { key: "LIMITED",    label: "LIMITED DROPS" },
  { key: "SALE",       label: "SALE" },
];

function filterProducts(cat: string, products: Product[]): Product[] {
  switch (cat) {
    case "APEX":       return products.filter((p) => p.category === "APEX");
    case "SACRED":     return products.filter((p) => p.category === "SACRED");
    case "CIPHER":     return products.filter((p) => p.category === "CIPHER");
    case "BESTSELLER": return products.filter((p) => p.tags.includes("bestseller"));
    case "LIMITED":    return products.filter((p) => p.limited);
    case "SALE":       return products.filter((p) => !!p.originalPrice);
    default:           return products;
  }
}

/* ── Tag badge ──────────────────────────────────────────── */
interface TagStyle { label: string; color: string; bg: string }

function getTag(p: Product): TagStyle {
  if (p.originalPrice) {
    const pct = Math.round((1 - p.price / p.originalPrice) * 100);
    return { label: `UPTO ${pct}% OFF`, color: "#fff", bg: "#e8000d" };
  }
  if (p.limited)              return { label: "LIMITED EDITION", color: "#fff",  bg: "#e8000d" };
  if (p.tags.includes("bestseller")) return { label: "BESTSELLER",     color: "#111",  bg: "#ffd700" };
  if (p.category === "APEX")  return { label: "⚡ APEX",          color: "#fff",  bg: "#7c00cc" };
  return                               { label: "NEW ARRIVAL",     color: "#fff",  bg: "#111"    };
}

/* ── Product tile ───────────────────────────────────────── */
function ProductTile({ product }: { product: Product }) {
  const { toggleItem, isWishlisted } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const tag  = getTag(product);
  const wishlisted = isWishlisted(product.slug);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, size: "M", quantity: 1, shirtColor: product.shirtColor, symbol: product.symbol });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div
      className="product-card"
      style={{
        background: "#fff",
        border: "1px solid #eee",
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
        borderRadius: 16,
      }}
    >
      {/* Tag badge */}
      <div style={{
        position: "absolute", top: 10, left: 10, zIndex: 2,
      }}>
        <span style={{
          background: tag.bg, color: tag.color,
          fontFamily: "Inter, sans-serif", fontWeight: 800,
          fontSize: "0.4rem", letterSpacing: "0.2em",
          textTransform: "uppercase", padding: "0.22rem 0.55rem",
          borderRadius: 5,
        }}>
          {tag.label}
        </span>
      </div>

      {/* Quick-add "+" button */}
      <button
        onClick={handleAddToCart}
        style={{
          position: "absolute", top: 8, right: 8, zIndex: 2,
          width: 30, height: 30, borderRadius: "50%",
          background: added ? "#111" : "#fff",
          border: "1px solid #e0e0e0",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          transition: "background 0.2s, border-color 0.2s",
        }}
        aria-label="Add to cart"
      >
        {added
          ? <Check size={13} color="#fff" strokeWidth={3} />
          : <Plus size={13} color="#555" strokeWidth={2.5} />
        }
      </button>

      {/* Product image */}
      <Link href={`/product/${product.slug}`} style={{ textDecoration: "none", flex: 1 }}>
        <div className="card-img" style={{
          background: "#f9f9f9",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: product.customImage ? 0 : "2.4rem 1rem 1.2rem",
          minHeight: 210, overflow: "hidden",
        }}>
          {product.customImage
            ? <img src={product.customImage} alt={product.name} style={{ width: "100%", height: 210, objectFit: "cover" }} />
            : <ProductMockup product={product} size={140} />
          }
        </div>

        {/* Info */}
        <div className="card-info" style={{ padding: "0.85rem 1rem 1rem", borderTop: "1px solid #f5f5f5" }}>
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.64rem", fontWeight: 600,
            color: "#111", lineHeight: 1.35,
            marginBottom: 7,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {product.name}
          </div>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
            <span style={{
              fontFamily: "Space Mono, monospace",
              fontWeight: 700, fontSize: "0.82rem", color: "#111",
            }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.6rem", color: "#bbb",
                textDecoration: "line-through",
              }}>
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Wishlist row */}
          <button
            onClick={(e) => { e.preventDefault(); toggleItem(product.slug); }}
            style={{
              marginTop: 10,
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              padding: 0,
            }}
          >
            <Heart
              size={11}
              color={wishlisted ? "#e8000d" : "#ccc"}
              fill={wishlisted ? "#e8000d" : "none"}
            />
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.46rem", color: wishlisted ? "#e8000d" : "#bbb",
              fontWeight: 600, letterSpacing: "0.08em",
            }}>
              {wishlisted ? "SAVED" : "WISHLIST"}
            </span>
          </button>
        </div>
      </Link>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export function TrendingSection() {
  const products = useProducts();
  const [activeCat, setActiveCat] = useState("ALL");
  const filtered = filterProducts(activeCat, products);

  return (
    <section style={{ background: "#fff", padding: "3rem 0" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.8rem" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
          }}>
            <TrendingUp size={14} color="#e8000d" />
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.56rem", fontWeight: 600,
              color: "#e8000d", letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}>
              WHAT&apos;S NEW &amp;
            </span>
          </div>
          <h2 style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            letterSpacing: "0.04em", color: "#111",
            textTransform: "uppercase", marginBottom: 4,
          }}>
            Trending in the Vault
          </h2>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.65rem", color: "#999",
          }}>
            The Collection That Made It To The Top Drops
          </p>
        </div>

        {/* Category tabs */}
        <div
          className="no-scrollbar"
          style={{
            display: "flex", gap: 0,
            borderBottom: "2px solid #f0f0f0",
            overflowX: "auto",
            marginBottom: "1.8rem",
          }}
        >
          {CATS.map(({ key, label }) => {
            const active = activeCat === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCat(key)}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700, fontSize: "0.58rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: active ? "#111" : "#aaa",
                  background: "none", border: "none",
                  borderBottom: active ? "2px solid #111" : "2px solid transparent",
                  padding: "0.6rem 1.1rem",
                  cursor: "pointer", whiteSpace: "nowrap",
                  marginBottom: -2,
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "3rem",
            fontFamily: "Inter, sans-serif", color: "#ccc",
            fontSize: "0.7rem",
          }}>
            No products in this category yet.
          </div>
        ) : (
          <div className="grid-products" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "14px",
          }}>
            {filtered.map((product) => (
              <ProductTile key={product.slug} product={product} />
            ))}
          </div>
        )}

        {/* View all */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <Link
            href="/shop"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "Inter, sans-serif", fontWeight: 700,
              fontSize: "0.6rem", letterSpacing: "0.14em",
              textTransform: "uppercase", textDecoration: "none",
              color: "#111", borderBottom: "1.5px solid #111",
              paddingBottom: 2,
            }}
          >
            VIEW ALL {filtered.length} DROPS →
          </Link>
        </div>

      </div>
    </section>
  );
}
