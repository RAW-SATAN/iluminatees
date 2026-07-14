import { ProductCard } from "@/components/ProductCard";
import { products, type ProductCategory } from "@/lib/products";

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { cat } = await searchParams;

  const activeCategory = (cat && ["APEX", "CIPHER", "SACRED"].includes(cat))
    ? (cat as ProductCategory)
    : null;

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  const categories: { id: ProductCategory | "ALL"; label: string; note: string }[] = [
    { id: "ALL", label: "ALL FILES", note: `${products.length} ITEMS` },
    { id: "APEX", label: "APEX", note: `${products.filter((p) => p.category === "APEX").length} ITEMS` },
    { id: "CIPHER", label: "CIPHER", note: `${products.filter((p) => p.category === "CIPHER").length} ITEMS` },
    { id: "SACRED", label: "SACRED", note: `${products.filter((p) => p.category === "SACRED").length} ITEMS` },
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div
        className="px-6 py-16 text-center relative overflow-hidden"
        style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(201,168,76,0.8) 20px, rgba(201,168,76,0.8) 21px)",
          }}
        />
        <div className="relative space-y-3">
          <span
            className="text-[0.5rem] tracking-[0.6em]"
            style={{ color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}
          >
            RESTRICTED ACCESS ZONE
          </span>
          <h1
            className="text-3xl md:text-5xl font-black tracking-[0.2em]"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--color-cream)" }}
          >
            THE VAULT
          </h1>
          <p className="text-xs" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
            {filtered.length} DOSSIER{filtered.length !== 1 ? "S" : ""} DECLASSIFIED
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="sticky top-16 z-30 px-6 py-4 flex items-center gap-1 overflow-x-auto"
        style={{
          background: "rgba(3,3,3,0.95)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        {categories.map(({ id, label, note }) => {
          const isActive = id === "ALL" ? !activeCategory : activeCategory === id;
          return (
            <a
              key={id}
              href={id === "ALL" ? "/shop" : `/shop?cat=${id}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-[0.6rem] tracking-[0.25em] transition-all duration-300"
              style={{
                fontFamily: "var(--font-mono)",
                background: isActive ? "rgba(201,168,76,0.12)" : "transparent",
                border: isActive
                  ? "1px solid rgba(201,168,76,0.5)"
                  : "1px solid rgba(201,168,76,0.12)",
                color: isActive ? "var(--color-gold)" : "var(--color-muted)",
              }}
            >
              <span>{label}</span>
              <span className="opacity-50 text-[0.45rem]">{note}</span>
            </a>
          );
        })}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px"
          style={{ background: "rgba(201,168,76,0.05)" }}
        >
          {filtered.map((p, i) => (
            <div key={p.id} style={{ background: "var(--color-void)" }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-32 text-center space-y-4">
            <p
              className="text-lg tracking-[0.2em]"
              style={{ fontFamily: "var(--font-cinzel)", color: "var(--color-muted)" }}
            >
              DOSSIER NOT FOUND
            </p>
            <p className="text-xs" style={{ color: "var(--color-dim)", fontFamily: "var(--font-mono)" }}>
              THIS INFORMATION DOES NOT EXIST
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
