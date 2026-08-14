export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type ProductCategory = "SAMURAI" | "MISFITS" | "BASICS";

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
  /* ── 1. SAMURAI DROP ── */
  {
    id: "13",
    slug: "the-katana",
    name: "the KATANA",
    codename: "DOSSIER-13",
    category: "SAMURAI",
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
    tags: ["samurai", "heavyweight", "oversized", "bestseller"],
    customImage: "/products/the-katana/0.jpg",
    customImages: [
      "/products/the-katana/0.jpg",
      "/products/the-katana/1.jpg",
      "/products/the-katana/2.jpg",
      "/products/the-katana/3.jpg",
      "/products/the-katana/4.jpg",
      "/products/the-katana/5.jpg",
      "/products/the-katana/6.jpg",
      "/products/the-katana/7.jpg",
      "/products/the-katana/8.jpg",
      "/products/the-katana/9.jpg",
      "/products/the-katana/10.jpg",
    ],
  },
  {
    id: "14",
    slug: "the-black-samurai",
    name: "The Black. Samurai",
    codename: "DOSSIER-14",
    category: "SAMURAI",
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
    tags: ["samurai", "heavyweight", "oversized", "bestseller"],
    customImage: "/products/the-black-samurai/0.jpg",
    customImages: [
      "/products/the-black-samurai/0.jpg",
      "/products/the-black-samurai/1.jpg",
      "/products/the-black-samurai/2.jpg",
    ],
  },
  {
    id: "15",
    slug: "the-bankai",
    name: "The Bankai",
    codename: "DOSSIER-15",
    category: "SAMURAI",
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
    tags: ["samurai", "heavyweight", "oversized"],
    customImage: "/products/the-bankai/0.jpg",
    customImages: [
      "/products/the-bankai/0.jpg",
      "/products/the-bankai/1.jpg",
      "/products/the-bankai/2.jpg",
      "/products/the-bankai/3.jpg",
    ],
  },
  {
    id: "custom-1784201245342",
    slug: "the-sakura",
    name: "The Sakura",
    codename: "DOSSIER-1784201245342",
    category: "SAMURAI",
    price: 2899,
    originalPrice: 4399,
    description: "Cherry blossom storm meets the blade. Heavyweight premium cotton with Japanese calligraphy print.",
    lore: "Under the falling blossoms, the blade remains silent.",
    symbol: "rose",
    shirtColor: "#111111",
    accentColor: "#c9a84c",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["samurai", "limited"],
    customImage: "/products/the-sakura/0.jpg",
    customImages: [
      "/products/the-sakura/0.jpg",
      "/products/the-sakura/1.jpg",
    ],
  },

  /* ── 2. MISFITS DROP ── */
  {
    id: "custom-1785720114346",
    slug: "the-crime-scene",
    name: "The Crime Scene",
    codename: "DOSSIER-1785720114346",
    category: "MISFITS",
    price: 1999,
    originalPrice: 2499,
    description: "Caution tape, midnight drop. Heavyweight dark streetwear piece for the outliers.",
    lore: "No witness, no evidence, just the statement.",
    symbol: "cross",
    shirtColor: "#111111",
    accentColor: "#ffd700",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["misfits", "oversized"],
    customImage: "/products/the-crime-scene/0.jpg",
    customImages: [
      "/products/the-crime-scene/0.jpg",
      "/products/the-crime-scene/1.jpg",
      "/products/the-crime-scene/2.jpg",
      "/products/the-crime-scene/3.jpg",
      "/products/the-crime-scene/4.jpg",
      "/products/the-crime-scene/5.jpg",
      "/products/the-crime-scene/6.jpg",
    ],
  },
  {
    id: "custom-1785720180160",
    slug: "the-pink-panther",
    name: "The Pink Panther",
    codename: "DOSSIER-1785720180160",
    category: "MISFITS",
    price: 999,
    originalPrice: 1599,
    description: "Subversive pastel statement piece. Premium heavyweight drop-shoulder tee.",
    lore: "Silent steps in a loud world.",
    symbol: "star",
    shirtColor: "#111111",
    accentColor: "#ff8da1",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["misfits", "graphic"],
    customImage: "/products/the-pink-panther/0.jpg",
    customImages: [
      "/products/the-pink-panther/0.jpg",
      "/products/the-pink-panther/1.jpg",
      "/products/the-pink-panther/2.jpg",
      "/products/the-pink-panther/3.jpg",
      "/products/the-pink-panther/4.jpg",
      "/products/the-pink-panther/5.jpg",
    ],
  },
  {
    id: "custom-1785720298589",
    slug: "the-capybara",
    name: "The Capybara",
    codename: "DOSSIER-1785720298589",
    category: "MISFITS",
    price: 999,
    originalPrice: 1499,
    description: "Ultimate relaxed vibe. High GSM streetwear tee with cult capybara artwork.",
    lore: "Unbothered, moisturized, in their lane.",
    symbol: "compass",
    shirtColor: "#111111",
    accentColor: "#c9a84c",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["misfits", "graphic"],
    customImage: "/products/the-capybara/0.jpg",
    customImages: [
      "/products/the-capybara/0.jpg",
      "/products/the-capybara/1.jpg",
      "/products/the-capybara/2.jpg",
      "/products/the-capybara/3.jpg",
      "/products/the-capybara/4.jpg",
      "/products/the-capybara/5.jpg",
      "/products/the-capybara/6.jpg",
      "/products/the-capybara/7.jpg",
      "/products/the-capybara/8.jpg",
      "/products/the-capybara/9.jpg",
      "/products/the-capybara/10.jpg",
    ],
  },

  /* ── 3. BASICS COLLECTION ── */
  {
    id: "custom-1785720857482",
    slug: "iluminatees-basics-black",
    name: "ILUMINATEES BASICS BLACK",
    codename: "DOSSIER-1785720857482",
    category: "BASICS",
    price: 499,
    originalPrice: 999,
    description: "Essential luxury staple. 220 GSM heavyweight combed cotton in deep jet black.",
    lore: "The foundation of the order.",
    symbol: "sigil",
    shirtColor: "#111111",
    accentColor: "#c9a84c",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["basics", "staple"],
    customImage: "/products/iluminatees-basics-black/0.jpg",
    customImages: [
      "/products/iluminatees-basics-black/0.jpg",
    ],
  },
  {
    id: "custom-1785720923813",
    slug: "iluminatees-basics-beige",
    name: "ILUMINATEES BASICS BEIGE",
    codename: "DOSSIER-1785720923813",
    category: "BASICS",
    price: 499,
    originalPrice: 999,
    description: "Neutral earth tone essential. Relaxed silhouette in soft-touch heavyweight cotton.",
    lore: "Subtle authority.",
    symbol: "sigil",
    shirtColor: "#111111",
    accentColor: "#c9a84c",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["basics", "staple"],
    customImage: "/products/iluminatees-basics-beige/0.jpg",
    customImages: [
      "/products/iluminatees-basics-beige/0.jpg",
    ],
  },
  {
    id: "custom-1785720952213",
    slug: "-iluminatees-basics-navy-blue",
    name: "ILUMINATEES BASICS NAVY BLUE",
    codename: "DOSSIER-1785720952213",
    category: "BASICS",
    price: 499,
    originalPrice: 999,
    description: "Deep midnight navy essential. Premium heavyweight combed cotton with ribbed collar.",
    lore: "Shadow of the deep.",
    symbol: "sigil",
    shirtColor: "#111111",
    accentColor: "#c9a84c",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["basics", "staple"],
    customImage: "/products/-iluminatees-basics-navy-blue/0.jpg",
    customImages: [
      "/products/-iluminatees-basics-navy-blue/0.jpg",
    ],
  },
  {
    id: "custom-1785720976061",
    slug: "iluminatees-basics-white",
    name: "ILUMINATEES BASICS WHITE",
    codename: "DOSSIER-1785720976061",
    category: "BASICS",
    price: 499,
    originalPrice: 999,
    description: "Crisp optical white luxury basic. Heavyweight 220 GSM non-see-through fabric.",
    lore: "Clean canvas.",
    symbol: "sigil",
    shirtColor: "#111111",
    accentColor: "#c9a84c",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    limited: false,
    tags: ["basics", "staple"],
    customImage: "/products/iluminatees-basics-white/0.jpg",
    customImages: [
      "/products/iluminatees-basics-white/0.jpg",
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
