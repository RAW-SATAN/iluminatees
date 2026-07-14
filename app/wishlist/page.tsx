"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/components/WishlistProvider";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const { items, toggleItem } = useWishlist();
  const wishlisted = products.filter((p) => items.includes(p.slug));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Heart size={20} color="#e8000d" fill="#e8000d" />
          <h1 style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "2rem", letterSpacing: "0.06em", color: "#111",
          }}>
            WISHLIST
          </h1>
        </div>
        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.7rem",
          color: "#888", letterSpacing: "0.04em",
        }}>
          {wishlisted.length} {wishlisted.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {wishlisted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <Heart size={48} color="#e8e8e8" style={{ marginBottom: 16 }} />
          <h2 style={{
            fontFamily: "Anton, sans-serif", fontSize: "1.5rem",
            color: "#ccc", letterSpacing: "0.06em", marginBottom: 12,
          }}>
            YOUR WISHLIST IS EMPTY
          </h2>
          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: "0.7rem",
            color: "#aaa", marginBottom: 24,
          }}>
            Browse the collection and save your favorites.
          </p>
          <Link href="/shop" className="btn-black" style={{ textDecoration: "none", padding: "0.75rem 2rem" }}>
            EXPLORE COLLECTION →
          </Link>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}>
          {wishlisted.map((product) => (
            <div key={product.slug} style={{ position: "relative" }}>
              <ProductCard product={product} />
              <button
                onClick={() => toggleItem(product.slug)}
                title="Remove from wishlist"
                style={{
                  position: "absolute", top: 10, right: 10,
                  background: "#fff", border: "1px solid #eee",
                  borderRadius: "50%", width: 32, height: 32,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", zIndex: 5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <Heart size={14} color="#e8000d" fill="#e8000d" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
