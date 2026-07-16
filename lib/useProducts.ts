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

      const applyEdit = (base: Product, e: ProductEdit): Product => ({
        ...base,
        name:          e.name          ?? base.name,
        description:   e.description   ?? base.description,
        category:      e.category      ?? base.category,
        sizes:         e.sizes ? (e.sizes.split(",").map(s => s.trim()) as Product["sizes"]) : base.sizes,
        limited:       e.limited       ?? base.limited,
        price:         e.price         ?? base.price,
        originalPrice: e.originalPrice === null ? undefined : (e.originalPrice ?? base.originalPrice),
        inStock:       e.inStock       ?? base.inStock,
        customImage:   e.customImages?.[0] || e.customImage || base.customImage,
      });

      const staticMapped = staticProducts.map(p => applyEdit(p, edits[p.id] ?? {}));

      // Deduplicate: skip custom products whose slug matches a static product
      const staticSlugs = new Set(staticMapped.map(p => p.slug));
      const customMapped: Product[] = added
        .filter(cp => !staticSlugs.has(cp.slug))
        .map(cp => {
          const e = edits[cp.id] ?? {};
          const base: Product = {
            id: cp.id, slug: cp.slug,
            name:          cp.name,
            codename:      cp.id.toUpperCase(),
            category:      cp.category,
            price:         cp.price,
            originalPrice: cp.originalPrice,
            description:   "",
            lore: "", symbol: "eye" as const, shirtColor: "#111", accentColor: "#c9a84c",
            sizes: cp.sizes.split(",").map(s => s.trim()) as Product["sizes"],
            inStock: cp.inStock,
            limited: cp.limited,
            tags: ["custom"],
          };
          return applyEdit(base, e);
        });

      // Static products are never deleted via localStorage — only custom products filter by deletedIds
      setAll([...staticMapped, ...customMapped.filter(p => !deleted.includes(p.id))]);
    } catch {}
  }, []);

  return all;
}
