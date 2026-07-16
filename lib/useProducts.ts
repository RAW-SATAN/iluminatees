"use client";
import { useState, useEffect } from "react";
import { products as staticProducts, type Product } from "@/lib/products";

const EDITS_KEY   = "iluminatees_product_edits";
const ADDED_KEY   = "iluminatees_added_products";
const DELETED_KEY = "iluminatees_deleted_products";

interface ProductEdit {
  price?: number; originalPrice?: number | null; inStock?: boolean;
  name?: string; description?: string; category?: "APEX"|"SACRED"|"CIPHER";
  sizes?: string; limited?: boolean; customImage?: string; customImages?: string[];
}
interface CustomProduct {
  id: string; slug: string; name: string; category: "APEX"|"SACRED"|"CIPHER";
  price: number; originalPrice?: number; sizes: string; inStock: boolean; limited: boolean;
}

export function useProducts(): Product[] {
  const [all, setAll] = useState<Product[]>(staticProducts);

  useEffect(() => {
    try {
      const edits: Record<string, ProductEdit> = JSON.parse(localStorage.getItem(EDITS_KEY) ?? "{}");
      const added: CustomProduct[]             = JSON.parse(localStorage.getItem(ADDED_KEY)   ?? "[]");
      const deleted: string[]                  = JSON.parse(localStorage.getItem(DELETED_KEY) ?? "[]");

      const staticMapped = staticProducts.map(p => {
        const e = edits[p.id] ?? {};
        return {
          ...p,
          name:          e.name          ?? p.name,
          description:   e.description   ?? p.description,
          category:      e.category      ?? p.category,
          sizes:         e.sizes ? (e.sizes.split(",").map(s => s.trim()) as Product["sizes"]) : p.sizes,
          limited:       e.limited       ?? p.limited,
          price:         e.price         ?? p.price,
          originalPrice: e.originalPrice === null ? undefined : (e.originalPrice ?? p.originalPrice),
          inStock:       e.inStock       ?? p.inStock,
        };
      });

      const customMapped: Product[] = added.map(cp => {
        const e = edits[cp.id] ?? {};
        return {
          id: cp.id, slug: cp.slug,
          name:          e.name        ?? cp.name,
          codename:      cp.id.toUpperCase(),
          category:      e.category   ?? cp.category,
          price:         e.price      ?? cp.price,
          originalPrice: e.originalPrice === null ? undefined : (e.originalPrice ?? cp.originalPrice),
          description:   e.description ?? "",
          lore: "", symbol: "eye" as const, shirtColor: "#111", accentColor: "#c9a84c",
          sizes: (e.sizes
            ? e.sizes.split(",").map(s => s.trim())
            : cp.sizes.split(",").map(s => s.trim())) as Product["sizes"],
          inStock: e.inStock ?? cp.inStock,
          limited: e.limited ?? cp.limited,
          tags: ["custom"],
        };
      });

      setAll([...staticMapped, ...customMapped].filter(p => !deleted.includes(p.id)));
    } catch {}
  }, []);

  return all;
}
