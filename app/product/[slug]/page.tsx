"use client";

import { notFound } from "next/navigation";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductBySlug, getProductsByCategory, type Product, type ProductSize } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

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

  const router = useRouter();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 17) + 8);
  const [addedState, setAddedState] = useState<"idle" | "added">("idle");

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const productImageIdx = parseInt(product.id, 10) % IMAGES.length;
  const productImage = IMAGES[productImageIdx];

  // Stock scarcity: deterministic 2–5
  const stockCount = (parseInt(product.id) % 4) + 2;

  // Low-stock size indices: pick 1-2 based on product.id
  const lowIdx1 = parseInt(product.id) % 6;
  const lowIdx2 = (parseInt(product.id) + 2) % 6;
  const lowSizes = new Set([SIZES[lowIdx1], SIZES[lowIdx2]]);

  // Live viewers: update every 8–12s
  useEffect(() => {
    const tick = () => {
      setViewerCount(Math.floor(Math.random() * 17) + 8);
      const next = 8000 + Math.random() * 4000;
      timer = setTimeout(tick, next);
    };
    let timer = setTimeout(tick, 8000 + Math.random() * 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleNeedSize = () => {
    setSizeError(true);
    setTimeout(() => setSizeError(false), 2500);
  };

  const buildCartItem = () => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    size: selectedSize!,
    quantity: 1,
    shirtColor: product.shirtColor,
    symbol: product.symbol,
  });

  const handleAddToCart = () => {
    if (!selectedSize) { handleNeedSize(); return; }
    addItem(buildCartItem());
    setAddedState("added");
    setTimeout(() => setAddedState("idle"), 2200);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { handleNeedSize(); return; }
    addItem(buildCartItem());
    router.push("/cart");
  };

  const gsm = getGSM(product.description);
  const specs = [gsm, "OVERSIZED FIT", "FREE SHIPPING >₹999"];

  return (
    <div style={{ background: "var(--blk)", minHeight: "100vh" }}>
      {/* Responsive styles */}
      <style>{`
        @keyframes pulse-amber {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .product-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        @media (max-width: 768px) {
          .product-split {
            grid-template-columns: 1fr;
          }
          .product-img {
            height: 55vw;
            min-height: 280px;
          }
          .sticky-buy-bar {
            display: flex !important;
          }
        }
      `}</style>

      {/* ── HERO SPLIT ──────────────────────────────────────────── */}
      <div className="product-split">
        {/* LEFT: Product image */}
        <div className="product-img" style={{ position: "relative", overflow: "hidden" }}>
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

          {/* Star rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#f59e0b", fontSize: "13px", letterSpacing: "1px" }}>★★★★★</span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                color: "var(--w)",
                fontWeight: 600,
              }}
            >
              4.8
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                color: "rgba(240,236,232,0.4)",
              }}
            >
              (127 reviews)
            </span>
          </div>

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
                const isLow = available && lowSizes.has(size);
                return (
                  <div key={size} style={{ position: "relative" }}>
                    <button
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
                    {isLow && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          background: "#f59e0b",
                          color: "#000",
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "7px",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          padding: "1px 4px",
                          lineHeight: 1.3,
                          pointerEvents: "none",
                        }}
                      >
                        LOW
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stock scarcity */}
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              color: "#f59e0b",
              animation: "pulse-amber 2s ease-in-out infinite",
            }}
          >
            ⚡ Only {stockCount} left in stock — order soon
          </div>

          {/* Live viewers */}
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              color: "rgba(240,236,232,0.45)",
            }}
          >
            👁 {viewerCount} people viewing this right now
          </div>

          {/* ADD TO CART + BUY NOW */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "16px 24px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "16px",
                letterSpacing: "0.1em",
                background: addedState === "added" ? "rgba(204,0,0,0.12)" : "var(--r)",
                color: addedState === "added" ? "var(--r)" : "var(--w)",
                border: addedState === "added" ? "1px solid var(--r)" : "1px solid var(--r)",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {addedState === "added" ? "✓ ADDED TO CART" : "ADD TO CART"}
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "16px 24px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "16px",
                letterSpacing: "0.1em",
                background: "#ffffff",
                color: "#000000",
                border: "1px solid #ffffff",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#e0e0e0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
              }}
            >
              BUY NOW
            </button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
              borderTop: "1px solid rgba(240,236,232,0.06)",
              paddingTop: "16px",
            }}
          >
            {[
              { icon: "🔒", label: "Secure Checkout" },
              { icon: "📦", label: "Free Shipping >₹999" },
              { icon: "↩", label: "Easy Returns" },
              { icon: "✓", label: "Authentic Quality" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "14px" }}>{icon}</span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "9px",
                    color: "rgba(240,236,232,0.35)",
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

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

      {/* ── STICKY MOBILE BOTTOM BAR ─────────────────────────────── */}
      <div
        className="sticky-buy-bar"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#0d0d0d",
          borderTop: "1px solid rgba(204,0,0,0.3)",
          padding: "12px 20px",
          zIndex: 200,
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden", flex: 1 }}>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              color: "var(--w)",
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.name}
          </span>
          <span
            style={{
              fontFamily: "'Rubik Dirt', cursive",
              fontSize: "16px",
              color: "var(--r)",
              lineHeight: 1,
            }}
          >
            {formatPrice(product.price)}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          style={{
            flexShrink: 0,
            padding: "12px 20px",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "14px",
            letterSpacing: "0.1em",
            background: "var(--r)",
            color: "var(--w)",
            border: "none",
            cursor: "pointer",
          }}
        >
          ADD TO CART
        </button>
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
