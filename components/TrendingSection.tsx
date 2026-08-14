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
        border: "1px solid #eaeaea",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        borderRadius: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Tag badge */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
        <span
          style={{
            background: tag.bg,
            color: tag.color,
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "0.42rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "0.26rem 0.6rem",
            borderRadius: 4,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
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
          top: 10,
          right: 10,
          zIndex: 2,
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: added ? "#111" : "#fff",
          border: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
        }}
        aria-label="Add to cart"
      >
        {added ? (
          <Check size={14} color="#fff" strokeWidth={3} />
        ) : (
          <Plus size={15} color="#222" strokeWidth={2.5} />
        )}
      </button>

      {/* Product image link */}
      <Link href={`/product/${product.slug}`} style={{ textDecoration: "none", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          className="card-img"
          style={{
            background: "#f7f7f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "1 / 1.15",
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {product.customImage ? (
            <img
              src={product.customImage}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                transition: "transform 0.35s ease",
              }}
            />
          ) : (
            <ProductMockup product={product} size={150} />
          )}
        </div>

        {/* Product Details */}
        <div
          className="card-info"
          style={{
            padding: "1rem 1.1rem 1.1rem",
            borderTop: "1px solid #f0f0f0",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#fff",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.35,
                marginBottom: 8,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "1.9em",
              }}
            >
              {product.name}
            </div>

            {/* Price row */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  color: "#111",
                }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.64rem",
                    color: "#aaa",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product.slug);
            }}
            style={{
              marginTop: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              alignSelf: "flex-start",
            }}
          >
            <Heart
              size={12}
              color={wishlisted ? "#e8000d" : "#bbb"}
              fill={wishlisted ? "#e8000d" : "none"}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.48rem",
                color: wishlisted ? "#e8000d" : "#888",
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

/* ── Drop Section Component ─────────────────────────────── */
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
    <section style={{ background: bg, padding: "4rem 0", borderBottom: "1px solid #ebebeb" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Section Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "2.2rem",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.52rem",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  background: "#111",
                  color: "#fff",
                  padding: "0.22rem 0.6rem",
                  borderRadius: 4,
                }}
              >
                {badge}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
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
                fontSize: "0.72rem",
                color: "#666",
                maxWidth: 580,
                lineHeight: 1.55,
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
              fontSize: "0.64rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#111",
              background: "#fff",
              border: "1.5px solid #111",
              borderRadius: 24,
              padding: "0.6rem 1.25rem",
              transition: "all 0.2s",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            Explore Drop ({products.length}) <ArrowRight size={13} />
          </Link>
        </div>

        {/* Products Grid */}
        <div
          className="drop-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "22px",
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

      <style>{`
        @media (min-width: 1100px) {
          .drop-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .drop-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </>
  );
}
