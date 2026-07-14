"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product, ProductSize } from "@/lib/products";

interface Props {
  product: Product;
  selectedSize: ProductSize | null;
  onNeedSize: () => void;
}

export function AddToCartButton({ product, selectedSize, onNeedSize }: Props) {
  const { addItem } = useCart();
  const [state, setState] = useState<"idle" | "added" | "animating">("idle");

  const handleClick = () => {
    if (!selectedSize) {
      onNeedSize();
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      shirtColor: product.shirtColor,
      symbol: product.symbol,
    });
    setState("added");
    setTimeout(() => setState("idle"), 2200);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full btn-gold"
      style={
        state === "added"
          ? {
              background: "rgba(201,168,76,0.12)",
              color: "var(--color-gold)",
              borderColor: "var(--color-gold)",
            }
          : {}
      }
    >
      {state === "added" ? "✓ ADDED TO ORDER" : "ADD TO ORDER"}
    </button>
  );
}
