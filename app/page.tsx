import Link from "next/link";
import { Hero } from "@/components/Hero";
import { DropsCarousel } from "@/components/DropsCarousel";
import { TrendingSection } from "@/components/TrendingSection";
import { BrandStory } from "@/components/BrandStory";
import { NewsletterForm } from "@/components/NewsletterForm";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Drops Carousel ──────────────────────────── */}
      <DropsCarousel />

      {/* ── Trending Section ─────────────────────────── */}
      <TrendingSection />

      {/* ── Brand Story ──────────────────────────────── */}
      <BrandStory />

      {/* ── Manifesto strip ─────────────────────────── */}
      <div style={{
        background: "#111",
        borderTop: "1px solid #222",
        borderBottom: "1px solid #222",
        padding: "3.5rem 1.5rem",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.5) 30px, rgba(255,255,255,0.5) 31px)",
        }} />
        <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
          <svg width="32" height="32" viewBox="0 0 100 100" style={{ margin: "0 auto 20px", display: "block" }} aria-hidden>
            <polygon points="50,8 92,80 8,80" fill="none" stroke="#e8000d" strokeWidth="2.5" opacity="0.8" />
            <ellipse cx="50" cy="52" rx="11" ry="7" fill="none" stroke="#e8000d" strokeWidth="1.5" />
            <circle cx="50" cy="52" r="4" fill="#e8000d" />
          </svg>
          <blockquote style={{
            fontFamily: "Inter, sans-serif", fontWeight: 300, fontStyle: "italic",
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            color: "rgba(255,255,255,0.85)", lineHeight: 1.7,
          }}>
            &ldquo;The eye sees all. The mouth speaks nothing.<br />The shirt says everything.&rdquo;
          </blockquote>
          <p style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.46rem", letterSpacing: "0.45em",
            color: "rgba(255,255,255,0.25)", marginTop: 20,
          }}>
            — DOCUMENT 33, INTERNAL COMMUNIQUÉ
          </p>
        </div>
      </div>

      {/* ── Newsletter ──────────────────────────────── */}
      <section style={{
        background: "#fafafa",
        borderTop: "1px solid #eee",
        padding: "3.5rem 1.5rem",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <span style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.46rem", letterSpacing: "0.5em",
            color: "#e8000d", textTransform: "uppercase",
          }}>
            TAKE THE OATH
          </span>
          <h2 style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(1.6rem, 3vw, 2rem)",
            letterSpacing: "0.1em", color: "#111",
            marginTop: 8, marginBottom: 10,
          }}>
            Join The Inner Circle
          </h2>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.7rem", color: "#888",
            lineHeight: 1.7, marginBottom: 24,
          }}>
            Early access to limited drops. Secret lore documents. First to know when new files are declassified.
          </p>
          <NewsletterForm />
          <p style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.44rem", letterSpacing: "0.2em",
            color: "#ccc", marginTop: 16,
          }}>
            WE DON&apos;T SHARE. WE DON&apos;T SELL. WE REMEMBER.
          </p>
        </div>
      </section>
    </>
  );
}
