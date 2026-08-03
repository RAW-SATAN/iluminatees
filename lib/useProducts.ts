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

export interface ProductsState {
  products: Product[];
  loaded: boolean;
}

export function useProductsState(): ProductsState {
  const [all, setAll] = useState<Product[]>(staticProducts);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        /* ── Permanent images from server (overrides localStorage) ── */
        let permanentImages: Record<string, string[]> = {};
        try {
          const res = await fetch("/product-images.json", { cache: "no-store" });
          if (res.ok) permanentImages = await res.json();
        } catch {}

        /* ── Product edits from the DB (visible to every visitor) ── */
        let serverEdits: Record<string, ProductEdit> = {};
        try {
          const res = await fetch("/api/product-edits", { cache: "no-store" });
          if (res.ok) serverEdits = await res.json();
        } catch {}

        const localEdits: Record<string, ProductEdit> = JSON.parse(localStorage.getItem(EDITS_KEY) ?? "{}");
        /* server edits are the shared truth; the owner's fresh local edits win on their own device */
        const editIds = new Set([...Object.keys(serverEdits), ...Object.keys(localEdits)]);
        const edits: Record<string, ProductEdit> = {};
        for (const id of editIds) edits[id] = { ...serverEdits[id], ...localEdits[id] };
        const added: CustomProduct[]             = JSON.parse(localStorage.getItem(ADDED_KEY)   ?? "[]");
        const deleted: string[]                  = JSON.parse(localStorage.getItem(DELETED_KEY) ?? "[]");

        const applyEdit = (base: Product, e: ProductEdit, slug: string): Product => {
          const imgs = permanentImages[slug] || e.customImages || (e.customImage ? [e.customImage] : undefined);
          return {
            ...base,
            name:          e.name          ?? base.name,
            description:   e.description   ?? base.description,
            category:      e.category      ?? base.category,
            sizes:         e.sizes ? (e.sizes.split(",").map(s => s.trim()) as Product["sizes"]) : base.sizes,
            limited:       e.limited       ?? base.limited,
            price:         e.price         ?? base.price,
            originalPrice: e.originalPrice === null ? undefined : (e.originalPrice ?? base.originalPrice),
            inStock:       e.inStock       ?? base.inStock,
            customImage:   imgs?.[0] || base.customImage,
            customImages:  imgs || base.customImages,
          };
        };

        /* Collect images from custom products that duplicate static ones (by slug) */
        const customImageBySlug: Record<string, string> = {};
        added.forEach(cp => {
          const ce = edits[cp.id] ?? {};
          const img = permanentImages[cp.slug]?.[0] || ce.customImages?.[0] || ce.customImage;
          if (img) customImageBySlug[cp.slug] = img;
        });

        const staticMapped = staticProducts.map(p => {
          const e = edits[p.id] ?? {};
          const result = applyEdit(p, e, p.slug);
          if (!result.customImage && customImageBySlug[p.slug]) {
            return { ...result, customImage: customImageBySlug[p.slug] };
          }
          return result;
        });

        /* Deduplicate: skip custom products whose slug matches a static product */
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
            return applyEdit(base, e, cp.slug);
          });

        /* Static products are never deleted via localStorage */
        if (alive) setAll([...staticMapped, ...customMapped.filter(p => !deleted.includes(p.id))]);
      } catch {} finally {
        if (alive) setLoaded(true);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return { products: all, loaded };
}

export function useProducts(): Product[] {
  return useProductsState().products;
}
