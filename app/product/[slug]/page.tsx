"use client";

import { notFound } from "next/navigation";
import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProductsByCategory, type Product, type ProductSize } from "@/lib/products";
import { AddToCartButton } from "@/components/AddToCartButton";

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];
const IMAGES = [
  "/hero-model.jpg",
  "/tee-floating.jpg",
  "/editorial-back.jpg",
  "/editorial-portrait.jpg",
  "/editorial-swirl.jpg",
];

function getGSM(description: string): string {
  const match = description.match(/(\d{3})\s*GSM/i);
  return match ? `${match[1]} GSM` : "220 GSM";
}

function formatPrice(price: number): string {
  return `₹ ${price.toLocaleString("en-IN")}`;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const productImageIdx = parseInt(product.id, 10) % IMAGES.length;
  const productImage = IMAGES[productImageIdx];

  const handleNeedSize = () => {
    setSizeError(true);
    setTimeout(() => setSizeError(false), 2500);
  };

  const gsm = getGSM(product.description);
  const specs = [gsm, "OVERSIZED FIT", "FREE SHIPPING >₹999"];

  return (
    <div style={{ background: "var(--blk)", minHeight: "100vh" }}>
      {/* ── HERO SPLIT ──────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
        }}
      >
        {/* LEFT: Product image */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <Image
            src={productImage}
            alt={product.name}
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
          {/* Subtle dark overlay on edges */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(6,6,6,0.15) 0%, transparent 30%, transparent 70%, rgba(6,6,6,0.45) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* RIGHT: Product info */}
        <div
          style={{
            background: "var(--s1)",
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            overflowY: "auto",
            paddingTop: "calc(48px + 72px)",
          }}
        >
          {/* Eyebrow */}
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--r)",
            }}
          >
            {product.codename} · {product.category}
          </span>

          {/* Product name */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(42px,5vw,80px)",
              lineHeight: 0.95,
              color: "var(--w)",
              letterSpacing: "0.02em",
            }}
          >
            {product.name}
          </h1>

          {/* Price + Limited badge row */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "'Rubik Dirt', cursive",
                fontSize: "36px",
                color: "var(--r)",
                lineHeight: 1,
              }}
            >
              {formatPrice(product.price)}
            </span>
            {product.limited && (
              <span
                style={{
                  background: "var(--r)",
                  color: "var(--w)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  fontWeight: 700,
                }}
              >
                LIMITED EDITION
              </span>
            )}
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
              color: "rgba(240,236,232,0.6)",
              lineHeight: 1.8,
            }}
          >
            {product.description}
          </p>

          {/* SIZE SELECTOR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: sizeError ? "var(--r)" : "rgba(240,236,232,0.4)",
              }}
            >
              {sizeError ? "SELECT A SIZE FIRST" : "SELECT SIZE"}
            </span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {SIZES.map((size) => {
                const available = product.sizes.includes(size);
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={!available}
                    onClick={() => {
                      if (available) {
                        setSelectedSize(size);
                        setSizeError(false);
                      }
                    }}
                    style={{
                      width: "48px",
                      height: "48px",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      fontWeight: 600,
                      background: active ? "var(--r)" : "transparent",
                      color: active ? "var(--w)" : available ? "var(--w)" : "rgba(240,236,232,0.2)",
                      border: active
                        ? "1px solid var(--r)"
                        : available
                        ? "1px solid rgba(240,236,232,0.15)"
                        : "1px solid rgba(240,236,232,0.06)",
                      opacity: available ? 1 : 0.35,
                      cursor: available ? "pointer" : "not-allowed",
                      textDecoration: !available ? "line-through" : "none",
                      transition: "background 0.2s, border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (available && !active) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--r)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (available && !active) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          "rgba(240,236,232,0.15)";
                      }
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ADD TO CART */}
          <AddToCartButton
            product={product}
            selectedSize={selectedSize}
            onNeedSize={handleNeedSize}
          />

          {/* LORE SECTION */}
          <div
            style={{
              borderTop: "1px solid var(--r)",
              paddingTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "8px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--r)",
                fontWeight: 700,
              }}
            >
              ◈ LORE
            </span>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                color: "rgba(240,236,232,0.5)",
                lineHeight: 1.8,
                fontStyle: "italic",
              }}
            >
              &ldquo;{product.lore}&rdquo;
            </p>
          </div>

          {/* SPECS STRIP */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr auto 1fr",
              alignItems: "center",
              marginTop: "auto",
              paddingTop: "24px",
              borderTop: "1px solid rgba(240,236,232,0.06)",
            }}
          >
            {specs.map((spec, i) => (
              <span
                key={spec}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(240,236,232,0.4)",
                  textAlign: i === 1 ? "center" : i === 2 ? "right" : "left",
                  gridColumn: i === 0 ? 1 : i === 1 ? 3 : 5,
                }}
              >
                {spec}
              </span>
            ))}
            <div
              style={{
                gridColumn: 2,
                width: "1px",
                height: "20px",
                background: "rgba(240,236,232,0.12)",
                margin: "0 16px",
                justifySelf: "center",
              }}
            />
            <div
              style={{
                gridColumn: 4,
                width: "1px",
                height: "20px",
                background: "rgba(240,236,232,0.12)",
                margin: "0 16px",
                justifySelf: "center",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── RELATED DROPS ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          style={{
            padding: "80px 48px",
            background: "var(--blk)",
          }}
        >
          {/* Heading */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <div style={{ width: "4px", height: "32px", background: "var(--r)", flexShrink: 0 }} />
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "28px",
                letterSpacing: "0.1em",
                color: "var(--w)",
              }}
            >
              RELATED DROPS
            </h2>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
            {related.map((p, i) => {
              const imgIdx = (parseInt(p.id, 10) + i) % IMAGES.length;
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <RelatedCard product={p} image={IMAGES[imgIdx]} />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function RelatedCard({ product, image }: { product: Product; image: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0d0d0d",
        border: "1px solid rgba(240,236,232,0.06)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s",
        borderColor: hovered ? "rgba(204,0,0,0.3)" : "rgba(240,236,232,0.06)",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          height: "200px",
          overflow: "hidden",
        }}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center top",
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        {/* Category badge top-right */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "var(--r)",
            color: "var(--w)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "7px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            padding: "3px 8px",
            fontWeight: 700,
            zIndex: 1,
          }}
        >
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: "16px" }}>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--w)",
            marginBottom: "8px",
            letterSpacing: "0.04em",
          }}
        >
          {product.name}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Rubik Dirt', cursive",
              fontSize: "20px",
              color: "var(--r)",
            }}
          >
            ₹ {product.price.toLocaleString("en-IN")}
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: hovered ? "var(--r)" : "rgba(240,236,232,0.35)",
              transition: "color 0.2s",
            }}
          >
            VIEW DROP →
          </span>
        </div>
      </div>
    </div>
  );
}
