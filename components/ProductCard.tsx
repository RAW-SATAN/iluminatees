import Link from "next/link";
import type { Product } from "@/lib/products";
import { ProductMockup } from "./ProductMockup";

const categoryColor: Record<string, string> = {
  APEX: "var(--color-gold)",
  CIPHER: "var(--color-muted)",
  SACRED: "#6a8f6a",
};

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="product-card relative overflow-hidden flex flex-col" style={{ background: "var(--color-onyx)" }}>
        {/* Limited badge */}
        {product.limited && (
          <div
            className="absolute top-3 left-3 z-10 text-[0.55rem] tracking-[0.25em] px-2 py-1"
            style={{
              background: "rgba(201,168,76,0.12)",
              border: "1px solid rgba(201,168,76,0.4)",
              color: "var(--color-gold)",
              fontFamily: "Space Mono, monospace",
            }}
          >
            LIMITED
          </div>
        )}

        {/* Category */}
        <div
          className="absolute top-3 right-3 z-10 text-[0.5rem] tracking-[0.3em]"
          style={{ color: categoryColor[product.category], fontFamily: "Space Mono, monospace" }}
        >
          {product.category}
        </div>

        {/* Mockup area */}
        <div
          className="relative flex items-center justify-center py-8 px-4 overflow-hidden"
          style={{ background: `radial-gradient(circle at 50% 40%, ${product.shirtColor}dd, #050505)` }}
        >
          <div
            className="card-glow absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at 50% 50%, ${product.accentColor}08, transparent 70%)` }}
          />
          <ProductMockup product={product} size={180} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 p-5 flex-1">
          <span
            className="text-[0.5rem] tracking-[0.35em]"
            style={{ color: "var(--color-dim)", fontFamily: "Space Mono, monospace" }}
          >
            {product.codename}
          </span>

          <h3
            className="card-name text-sm font-semibold leading-tight"
            style={{ fontFamily: "Cinzel, serif", color: "var(--color-cream)" }}
          >
            {product.name}
          </h3>

          <div
            className="card-line h-px mt-1"
            style={{ background: "linear-gradient(90deg, var(--color-gold-deep), transparent)" }}
          />

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-baseline gap-2">
              <span
                className="text-base font-bold"
                style={{ fontFamily: "Space Mono, monospace", color: "var(--color-gold)" }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span
                  className="text-xs line-through"
                  style={{ color: "var(--color-dim)", fontFamily: "Space Mono, monospace" }}
                >
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <div
              className="card-view-btn text-[0.5rem] tracking-[0.2em] px-2 py-0.5"
              style={{
                border: "1px solid rgba(201,168,76,0.4)",
                color: "var(--color-gold)",
                fontFamily: "Space Mono, monospace",
              }}
            >
              VIEW →
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
