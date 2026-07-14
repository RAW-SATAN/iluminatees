"use client";

import { notFound } from "next/navigation";
import { useState, use } from "react";
import { getProductBySlug, products, type ProductSize } from "@/lib/products";
import { ProductMockup } from "@/components/ProductMockup";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/AddToCartButton";

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const handleNeedSize = () => {
    setSizeError(true);
    setTimeout(() => setSizeError(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10 text-[0.55rem] tracking-[0.3em]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-dim)" }}>
          <a href="/" className="hover:text-[var(--color-gold)] transition-colors">HOME</a>
          <span>·</span>
          <a href="/shop" className="hover:text-[var(--color-gold)] transition-colors">VAULT</a>
          <span>·</span>
          <span style={{ color: "var(--color-muted)" }}>{product.codename}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* ── Product visual ─────────────────────── */}
          <div className="flex flex-col items-center">
            {/* Main mockup */}
            <div
              className="relative w-full max-w-md flex items-center justify-center py-16 px-8"
              style={{
                background: `radial-gradient(ellipse 80% 70% at 50% 40%, ${product.shirtColor}cc, #030303)`,
                border: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              {product.limited && (
                <div
                  className="absolute top-4 left-4 text-[0.55rem] tracking-[0.3em] px-2 py-1"
                  style={{
                    border: "1px solid rgba(201,168,76,0.5)",
                    color: "var(--color-gold)",
                    fontFamily: "var(--font-mono)",
                    background: "rgba(201,168,76,0.08)",
                  }}
                >
                  LIMITED EDITION
                </div>
              )}
              {/* Subtle corner marks */}
              {[
                "top-2 left-2 border-l border-t",
                "top-2 right-2 border-r border-t",
                "bottom-2 left-2 border-l border-b",
                "bottom-2 right-2 border-r border-b",
              ].map((cls) => (
                <div
                  key={cls}
                  className={`absolute w-4 h-4 ${cls}`}
                  style={{ borderColor: "rgba(201,168,76,0.25)" }}
                />
              ))}
              <ProductMockup product={product} size={280} />
            </div>

            {/* Spec strip */}
            <div
              className="w-full max-w-md mt-4 grid grid-cols-3"
              style={{ background: "var(--color-onyx)", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              {[
                { label: "DOSSIER", value: product.codename },
                { label: "TIER", value: product.category },
                { label: "STOCK", value: product.inStock ? "ACTIVE" : "DEPLETED" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center py-3 px-2 gap-1">
                  <span className="text-[0.45rem] tracking-[0.4em]"
                    style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}>{label}</span>
                  <span className="text-[0.6rem] tracking-[0.2em]"
                    style={{ color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Product info ────────────────────────── */}
          <div className="flex flex-col gap-7">
            {/* Category */}
            <span
              className="text-[0.5rem] tracking-[0.5em]"
              style={{ color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}
            >
              {product.category} COLLECTION · {product.codename}
            </span>

            {/* Name */}
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold leading-tight"
                style={{ fontFamily: "var(--font-cinzel)", color: "var(--color-cream)" }}
              >
                {product.name}
              </h1>
              {/* Decorative underline */}
              <div
                className="h-px mt-3"
                style={{ background: "linear-gradient(90deg, var(--color-gold-deep), transparent)", width: "60%" }}
              />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold)" }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span
                  className="text-sm line-through"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-dim)" }}
                >
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {product.originalPrice && (
                <span
                  className="text-[0.5rem] tracking-[0.2em] px-2 py-1"
                  style={{
                    background: "rgba(107,0,0,0.2)",
                    border: "1px solid rgba(139,0,0,0.4)",
                    color: "#ff6b6b",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  SAVE ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-parchment)" }}>
              {product.description}
            </p>

            {/* Lore — the secret history */}
            <div
              className="p-5 space-y-2"
              style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)" }}
            >
              <span
                className="text-[0.5rem] tracking-[0.5em]"
                style={{ color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}
              >
                ⬡ CLASSIFIED LORE
              </span>
              <p
                className="text-xs leading-relaxed italic"
                style={{ color: "var(--color-muted)", fontFamily: "var(--font-cinzel)" }}
              >
                &ldquo;{product.lore}&rdquo;
              </p>
            </div>

            {/* Size selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className="text-[0.55rem] tracking-[0.4em]"
                  style={{ color: sizeError ? "#ff6b6b" : "var(--color-muted)", fontFamily: "var(--font-mono)" }}
                >
                  {sizeError ? "⚠ SELECT A SIZE TO PROCEED" : "SELECT SIZE"}
                </span>
                <a
                  href="#"
                  className="text-[0.5rem] tracking-[0.2em] transition-colors hover:text-[var(--color-gold)]"
                  style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}
                >
                  SIZE GUIDE
                </a>
              </div>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map((size) => {
                  const available = product.sizes.includes(size);
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      disabled={!available}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className="w-12 h-12 text-[0.65rem] font-bold tracking-[0.1em] transition-all duration-200"
                      style={{
                        fontFamily: "var(--font-mono)",
                        background: active ? "var(--color-gold)" : "transparent",
                        color: active
                          ? "var(--color-void)"
                          : available
                          ? "var(--color-cream)"
                          : "var(--color-dim)",
                        border: active
                          ? "1px solid var(--color-gold)"
                          : available
                          ? "1px solid rgba(201,168,76,0.25)"
                          : "1px solid rgba(201,168,76,0.08)",
                        opacity: available ? 1 : 0.35,
                        cursor: available ? "pointer" : "not-allowed",
                        textDecoration: !available ? "line-through" : "none",
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to cart */}
            <AddToCartButton
              product={product}
              selectedSize={selectedSize}
              onNeedSize={handleNeedSize}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.45rem] tracking-[0.3em] px-2 py-1"
                  style={{
                    border: "1px solid rgba(201,168,76,0.12)",
                    color: "var(--color-dim)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related products ────────────────────── */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex flex-col items-start gap-3 mb-10">
              <span
                className="text-[0.5rem] tracking-[0.5em]"
                style={{ color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}
              >
                RELATED DOSSIERS
              </span>
              <h2
                className="text-xl font-bold tracking-[0.15em]"
                style={{ fontFamily: "var(--font-cinzel)", color: "var(--color-cream)" }}
              >
                Same Clearance Level
              </h2>
              <div className="h-px w-20"
                style={{ background: "linear-gradient(90deg, var(--color-gold-deep), transparent)" }} />
            </div>
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-px"
              style={{ background: "rgba(201,168,76,0.05)" }}
            >
              {related.map((p, i) => (
                <div key={p.id} style={{ background: "var(--color-void)" }}>
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
