import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

const BASE = "https://www.iluminatees.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/shop", "/about", "/contact", "/track", "/returns", "/shipping", "/terms", "/privacy"].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const productPages = products.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...productPages];
}
