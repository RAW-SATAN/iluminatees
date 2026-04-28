import Link from "next/link";
import Image from "next/image";
import { getProductsByCategory, type Product, type ProductCategory } from "@/lib/products";

const IMAGES = [
  "/hero-model.jpg",
  "/tee-floating.jpg",
  "/editorial-back.jpg",
  "/editorial-portrait.jpg",
  "/editorial-swirl.jpg",
];

function formatPrice(price: number): string {
  return `₹ ${price.toLocaleString("en-IN")}`;
}

const COLLECTION_DESCRIPTIONS: Record<ProductCategory, string> = {
  APEX: "The highest tier. No compromises. No excuses.",
  CIPHER: "Encoded knowledge. Hidden in plain sight.",
  SACRED: "Ancient symbols. Eternal resonance.",
};

function ProductCard({ product, imageIndex }: { product: Product; imageIndex: number }) {
  const image = IMAGES[imageIndex % IMAGES.length];
  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: "var(--s1)",
          border: "1px solid rgba(240,236,232,0.05)",
          overflow: "hidden",
          position: "relative",
        }}
        className="collection-card"
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            height: "220px",
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
            }}
            className="collection-card-img"
          />
          {/* Category badge */}
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
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

        {/* Info bar */}
        <div style={{ padding: "14px 16px" }}>
          {/* Codename */}
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "8px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--r)",
              display: "block",
              marginBottom: "6px",
            }}
          >
            {product.codename}
          </span>

          {/* Name */}
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--w)",
              marginBottom: "10px",
              letterSpacing: "0.02em",
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </p>

          {/* Price + Limited row */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "'Rubik Dirt', cursive",
                fontSize: "22px",
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
                  fontSize: "7px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  fontWeight: 700,
                }}
              >
                LIMITED
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function CollectionSection({
  category,
  globalOffset,
}: {
  category: ProductCategory;
  globalOffset: number;
}) {
  const products = getProductsByCategory(category);
  const description = COLLECTION_DESCRIPTIONS[category];

  return (
    <section style={{ marginBottom: "72px" }}>
      {/* Section header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "12px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "42px",
            letterSpacing: "0.06em",
            color: "var(--w)",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          {category}
        </h2>
        {/* Red line that fills remaining width */}
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "var(--r)",
          }}
        />
        {/* Product count */}
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "11px",
            color: "rgba(240,236,232,0.35)",
            flexShrink: 0,
            letterSpacing: "0.1em",
          }}
        >
          {products.length} DROPS
        </span>
      </div>

      {/* Description one-liner */}
      <p
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "13px",
          color: "rgba(240,236,232,0.35)",
          marginBottom: "28px",
          letterSpacing: "0.02em",
        }}
      >
        {description}
      </p>

      {/* Product grid: 4 columns, 1px gap */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          background: "rgba(240,236,232,0.05)",
        }}
      >
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            imageIndex={globalOffset + i}
          />
        ))}
      </div>
    </section>
  );
}

export default function CollectionsPage() {
  // Pre-calculate per-category offsets so images cycle globally
  const apexProducts = getProductsByCategory("APEX");
  const cipherProducts = getProductsByCategory("CIPHER");

  const apexOffset = 0;
  const cipherOffset = apexProducts.length;
  const sacredOffset = apexProducts.length + cipherProducts.length;

  return (
    <>
      <style>{`
        .collection-card:hover .collection-card-img {
          transform: scale(1.05);
        }
        .collection-card {
          transition: border-color 0.2s;
        }
        .collection-card:hover {
          border-color: rgba(204,0,0,0.25);
        }
      `}</style>

      <div style={{ background: "var(--blk)", minHeight: "100vh" }}>
        {/* PAGE TITLE SECTION */}
        <div
          style={{
            width: "100%",
            background: "var(--blk)",
            padding: "80px 52px 40px",
            borderBottom: "1px solid rgba(240,236,232,0.06)",
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
              display: "block",
              marginBottom: "16px",
            }}
          >
            SS26 · ALL COLLECTIONS
          </span>

          {/* Main title */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(52px,7vw,96px)",
              lineHeight: 0.9,
              color: "var(--w)",
              letterSpacing: "0.03em",
              marginBottom: "20px",
            }}
          >
            THE DROPS
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
              color: "rgba(240,236,232,0.35)",
              maxWidth: "480px",
              lineHeight: 1.7,
            }}
          >
            Every piece is a transmission. Wear what they didn&apos;t want you to find.
          </p>
        </div>

        {/* COLLECTIONS */}
        <div style={{ padding: "64px 52px" }}>
          <CollectionSection category="APEX" globalOffset={apexOffset} />
          <CollectionSection category="CIPHER" globalOffset={cipherOffset} />
          <CollectionSection category="SACRED" globalOffset={sacredOffset} />
        </div>
      </div>
    </>
  );
}
