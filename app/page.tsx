import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getFeaturedProducts } from "@/lib/products";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <Hero />

      {/* ── Featured Products ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col items-center gap-4 mb-16">
          <span
            className="text-[0.5rem] tracking-[0.6em]"
            style={{ color: "var(--color-gold)", fontFamily: "Space Mono, monospace" }}
          >
            CLASSIFIED CATALOG
          </span>
          <h2
            className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-center"
            style={{ fontFamily: "Cinzel, serif", color: "var(--color-cream)" }}
          >
            THE INITIATED FILES
          </h2>
          <div
            className="h-px w-32"
            style={{ background: "linear-gradient(90deg, transparent, var(--color-gold), transparent)" }}
          />
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "rgba(201,168,76,0.06)" }}
        >
          {featured.map((p, i) => (
            <div key={p.id} style={{ background: "var(--color-void)" }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/shop" className="btn-gold">
            ACCESS FULL VAULT
          </Link>
        </div>
      </section>

      {/* ── Manifesto strip ─────────────────────────── */}
      <div
        className="py-20 px-6 text-center relative overflow-hidden"
        style={{
          background: "var(--color-onyx)",
          borderTop: "1px solid rgba(201,168,76,0.08)",
          borderBottom: "1px solid rgba(201,168,76,0.08)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(201,168,76,0.5) 30px, rgba(201,168,76,0.5) 31px)",
          }}
        />
        <div className="relative max-w-2xl mx-auto space-y-6">
          <svg width="36" height="36" viewBox="0 0 100 100" className="mx-auto" aria-hidden>
            <polygon points="50,8 92,80 8,80" fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.7" />
            <ellipse cx="50" cy="52" rx="11" ry="7" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
            <circle cx="50" cy="52" r="4" fill="#c9a84c" />
          </svg>
          <blockquote
            className="text-lg md:text-xl font-light leading-relaxed"
            style={{ fontFamily: "Cinzel, serif", color: "var(--color-parchment)" }}
          >
            &ldquo;The eye sees all. The mouth speaks nothing.
            <br />The shirt says everything.&rdquo;
          </blockquote>
          <p className="text-[0.5rem] tracking-[0.5em]" style={{ color: "var(--color-muted)", fontFamily: "Space Mono, monospace" }}>
            — DOCUMENT 33, INTERNAL COMMUNIQUÉ
          </p>
        </div>
      </div>

      {/* ── Categories ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col items-center gap-4 mb-16">
          <h2
            className="text-xl font-bold tracking-[0.2em]"
            style={{ fontFamily: "Cinzel, serif", color: "var(--color-cream)" }}
          >
            CLEARANCE LEVELS
          </h2>
          <div
            className="h-px w-24"
            style={{ background: "linear-gradient(90deg, transparent, var(--color-gold), transparent)" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "APEX",
              description: "Highest degree. Premium heavyweight drops for the architect class.",
              href: "/shop?cat=APEX",
              note: "LEVEL 33 CLEARANCE",
              color: "var(--color-gold)",
            },
            {
              label: "CIPHER",
              description: "Encoded for the informed. Knowledge hidden in every thread.",
              href: "/shop?cat=CIPHER",
              note: "LEVEL 17 CLEARANCE",
              color: "var(--color-muted)",
            },
            {
              label: "SACRED",
              description: "Ancient symbols for the everyday initiate. Entry to the order.",
              href: "/shop?cat=SACRED",
              note: "OPEN ENROLLMENT",
              color: "#6a8f6a",
            },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="category-card relative p-8 flex flex-col gap-4"
              style={{ background: "var(--color-onyx)" }}
            >
              <span
                className="text-[0.5rem] tracking-[0.5em]"
                style={{ color: cat.color, fontFamily: "Space Mono, monospace" }}
              >
                {cat.note}
              </span>
              <h3
                className="text-2xl font-black tracking-[0.25em]"
                style={{ fontFamily: "Cinzel, serif", color: cat.color }}
              >
                {cat.label}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {cat.description}
              </p>
              <span
                className="cat-enter text-[0.55rem] tracking-[0.3em] mt-auto"
                style={{ color: cat.color, fontFamily: "Space Mono, monospace" }}
              >
                ENTER →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────── */}
      <section
        className="py-24 px-6 text-center"
        style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
      >
        <div className="max-w-md mx-auto space-y-6">
          <span
            className="text-[0.5rem] tracking-[0.6em]"
            style={{ color: "var(--color-gold)", fontFamily: "Space Mono, monospace" }}
          >
            TAKE THE OATH
          </span>
          <h2
            className="text-2xl font-bold tracking-[0.1em]"
            style={{ fontFamily: "Cinzel, serif", color: "var(--color-cream)" }}
          >
            Join The Inner Circle
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
            Early access to limited drops. Secret lore documents. First to know when new files are declassified.
          </p>
          <NewsletterForm />
          <p className="text-[0.5rem] tracking-[0.2em]" style={{ color: "var(--color-dim)", fontFamily: "Space Mono, monospace" }}>
            WE DON&apos;T SHARE. WE DON&apos;T SELL. WE REMEMBER.
          </p>
        </div>
      </section>
    </>
  );
}
