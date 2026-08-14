"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Heart, Check, ArrowRight } from "lucide-react";
import { type Product } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
import { ProductMockup } from "./ProductMockup";
import { useWishlist } from "./WishlistProvider";
import { useCart } from "./CartProvider";

/* ── Tag badge ──────────────────────────────────────────── */
interface TagStyle { label: string; color: string; bg: string }

function getTag(p: Product): TagStyle {
  if (p.originalPrice) {
    const pct = Math.round((1 - p.price / p.originalPrice) * 100);
    return { label: `UPTO ${pct}% OFF`, color: "#fff", bg: "#e8000d" };
  }
  if (p.limited)                   return { label: "LIMITED EDITION", color: "#fff", bg: "#e8000d" };
  if (p.tags.includes("bestseller")) return { label: "BESTSELLER",    color: "#111", bg: "#ffd700" };
  if (p.category === "SAMURAI")    return { label: "⚔️ SAMURAI",     color: "#fff", bg: "#111"    };
  if (p.category === "MISFITS")    return { label: "⚡ MISFITS",     color: "#fff", bg: "#7c00cc" };
  if (p.category === "BASICS")     return { label: "👕 BASICS",      color: "#fff", bg: "#333"    };
  return                                  { label: "NEW ARRIVAL",    color: "#fff", bg: "#111"    };
}

/* ── Product tile ───────────────────────────────────────── */
function ProductTile({ product }: { product: Product }) {
  const { toggleItem, isWishlisted } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const tag = getTag(product);
  const wishlisted = isWishlisted(product.slug);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: "M",
      quantity: 1,
      shirtColor: product.shirtColor,
      symbol: product.symbol,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div
      className="product-card"
      style={{
        background: "#fff",
        border: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Tag badge */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
        <span
          style={{
            background: tag.bg,
            color: tag.color,
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "0.42rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "0.24rem 0.6rem",
            borderRadius: 5,
          }}
        >
          {tag.label}
        </span>
      </div>

      {/* Quick-add "+" button */}
      <button
        onClick={handleAddToCart}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: added ? "#111" : "#fff",
          border: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "background 0.2s, border-color 0.2s",
        }}
        aria-label="Add to cart"
      >
        {added ? (
          <Check size={14} color="#fff" strokeWidth={3} />
        ) : (
          <Plus size={14} color="#333" strokeWidth={2.5} />
        )}
      </button>

      {/* Product image */}
      <Link href={`/product/${product.slug}`} style={{ textDecoration: "none", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          className="card-img"
          style={{
            background: "#f8f8f8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 230,
            overflow: "hidden",
          }}
        >
          {product.customImage ? (
            <img
              src={product.customImage}
              alt={product.name}
              style={{ width: "100%", height: 230, objectFit: "cover" }}
            />
          ) : (
            <ProductMockup product={product} size={140} />
          )}
        </div>

        {/* Info */}
        <div className="card-info" style={{ padding: "0.95rem 1.1rem 1.1rem", borderTop: "1px solid #f2f2f2", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "#111",
                lineHeight: 1.35,
                marginBottom: 8,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.name}
            </div>

            {/* Price row */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  color: "#111",
                }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.62rem",
                    color: "#bbb",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          {/* Wishlist row */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product.slug);
            }}
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Heart
              size={12}
              color={wishlisted ? "#e8000d" : "#ccc"}
              fill={wishlisted ? "#e8000d" : "none"}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.48rem",
                color: wishlisted ? "#e8000d" : "#bbb",
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              {wishlisted ? "SAVED" : "WISHLIST"}
            </span>
          </button>
        </div>
      </Link>
    </div>
  );
}

/* ── Single Drop Section Component ──────────────────────── */
interface DropSectionProps {
  badge: string;
  title: string;
  subtitle: string;
  products: Product[];
  categoryKey: string;
  bg?: string;
}

function DropSection({ badge, title, subtitle, products, categoryKey, bg = "#fff" }: DropSectionProps) {
  if (products.length === 0) return null;

  return (
    <section style={{ background: bg, padding: "3.5rem 0", borderBottom: "1px solid #eee" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Section Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.52rem",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  background: "#111",
                  color: "#fff",
                  padding: "0.2rem 0.55rem",
                  borderRadius: 4,
                }}
              >
                {badge}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                letterSpacing: "0.04em",
                color: "#111",
                textTransform: "uppercase",
                lineHeight: 1.1,
                marginBottom: 6,
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.68rem",
                color: "#777",
                maxWidth: 540,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Explore Drop Link */}
          <Link
            href={`/shop?cat=${categoryKey}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#111",
              background: "#fafafa",
              border: "1.5px solid #111",
              borderRadius: 24,
              padding: "0.55rem 1.1rem",
              transition: "all 0.2s",
            }}
          >
            Explore Drop ({products.length}) <ArrowRight size={13} />
          </Link>
        </div>

        {/* Products Grid */}
        <div
          className="grid-products"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "18px",
          }}
        >
          {products.map((p) => (
            <ProductTile key={p.slug} product={p} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── Main Homepage TrendingSection Component ────────────── */
export function TrendingSection() {
  const allProducts = useProducts();

  const samuraiProducts = allProducts.filter((p) => p.category === "SAMURAI");
  const misfitsProducts = allProducts.filter((p) => p.category === "MISFITS");
  const basicsProducts  = allProducts.filter((p) => p.category === "BASICS");

  return (
    <>
      {/* ── 1. SAMURAI COLLECTION ── */}
      <DropSection
        badge="DROP 01 · ARCHIVE"
        title="Samurai Collection"
        subtitle="Forged in darkness. Heavyweight 240 GSM oversized cuts inspired by ancient blade discipline and anime lore."
        products={samuraiProducts}
        categoryKey="SAMURAI"
        bg="#fff"
      />

      {/* ── 2. MISFITS DROP ── */}
      <DropSection
        badge="DROP 02 · VAULT"
        title="The Misfits Drop"
        subtitle="Subversive graphics, midnight silhouettes, and unapologetic statements built for those outside the norm."
        products={misfitsProducts}
        categoryKey="MISFITS"
        bg="#fafafa"
      />

      {/* ── 3. ILUMINATEES BASICS ── */}
      <DropSection
        badge="DROP 03 · ESSENTIALS"
        title="Iluminatees Basics"
        subtitle="Everyday luxury essentials. 220 GSM heavyweight combed cotton in timeless neutral colourways."
        products={basicsProducts}
        categoryKey="BASICS"
        bg="#fff"
      />
    </>
  );
}
