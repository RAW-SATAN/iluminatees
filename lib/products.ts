export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type ProductCategory = "SACRED" | "CIPHER" | "APEX";

export interface Product {
  id: string;
  slug: string;
  name: string;
  codename: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  lore: string;
  symbol: "eye" | "pyramid" | "compass" | "star" | "spiral" | "cross" | "ouroboros" | "hexagon" | "rose" | "ankh" | "omega" | "sigil";
  shirtColor: string;
  accentColor: string;
  sizes: ProductSize[];
  inStock: boolean;
  limited: boolean;
  tags: string[];
  colors?: { name: string; hex: string }[];
  customImage?: string;
  customImages?: string[];
}

export const products: Product[] = [
  {
    id: "13",
    slug: "the-katana",
    name: "the KATANA",
    codename: "DOSSIER-13",
    category: "APEX",
    price: 2890,
    originalPrice: 4999,
    description: "Premium 240 GSM heavyweight cotton, forged for those who cut through noise. Oversized drop-shoulder silhouette — the blade of the streetwear vault.\n\n• 100% ring-spun cotton — zero compromise\n• Oversized drop-shoulder cut\n• Pre-shrunk fabric\n• Ribbed crew neck\n\n⚠️ Limited vault drop.",
    lore: "The katana is not a weapon. It is a philosophy. Drawn only when there is no other path. Sheathed only when the work is complete. This shirt does not ask permission.",
    symbol: "omega",
    shirtColor: "#080808",
    accentColor: "#c0c0c0",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["apex", "heavyweight", "oversized"],
    colors: [
      { name: "Void Black", hex: "#080808" },
      { name: "Steel Grey", hex: "#6e6e6e" },
      { name: "Deep Navy", hex: "#0d1b2a" },
    ],
  },
  {
    id: "14",
    slug: "the-black-samurai",
    name: "The Black. Samurai",
    codename: "DOSSIER-14",
    category: "APEX",
    price: 2999,
    originalPrice: 4999,
    description: "The ronin who bowed to no lord. 240 GSM heavyweight cotton, oversized and unapologetic.\n\n• 100% ring-spun cotton\n• Oversized drop-shoulder cut\n• Pre-shrunk — holds shape\n• Reactive dye print — does not fade\n\n⚠️ Once gone, it does not return.",
    lore: "He served no clan. He carried no flag. He walked into every room as if he had already decided the outcome. The Black Samurai was not feared because he was dangerous — he was feared because he was free.",
    symbol: "sigil",
    shirtColor: "#0a0a0a",
    accentColor: "#e8e8e8",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["apex", "heavyweight", "oversized"],
    colors: [
      { name: "Obsidian", hex: "#0a0a0a" },
      { name: "Ash Grey", hex: "#9e9e9e" },
      { name: "Maroon", hex: "#5c0a14" },
    ],
  },
  {
    id: "15",
    slug: "the-bankai",
    name: "The Bankai",
    codename: "DOSSIER-15",
    category: "APEX",
    price: 2199,
    originalPrice: 3499,
    description: "Final release. Full power. 240 GSM heavyweight cotton built for those who have nothing left to hide.\n\n• 100% ring-spun cotton\n• Oversized drop-shoulder cut\n• Pre-shrunk fabric — zero post-wash distortion\n• Ribbed crew neck — holds shape, wash after wash\n\n⚠️ Limited vault drop. Once it sells out, it does not return.",
    lore: "Bankai is not a move. It is a revelation. The point at which the soul can no longer be contained by the body that holds it. Every great thing you have done — this is what came before it.",
    symbol: "spiral",
    shirtColor: "#05050a",
    accentColor: "#9090ff",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["apex", "heavyweight", "oversized"],
    colors: [
      { name: "Soul Black", hex: "#05050a" },
      { name: "Void Black", hex: "#0d0d0d" },
      { name: "Deep Navy", hex: "#0d1b2a" },
      { name: "Ash Grey", hex: "#9e9e9e" },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products;
}
