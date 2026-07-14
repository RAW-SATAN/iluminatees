import Link from "next/link";
import { Hero } from "@/components/Hero";
import { DropsCarousel } from "@/components/DropsCarousel";
import { TrendingSection } from "@/components/TrendingSection";
import { NewsletterForm } from "@/components/NewsletterForm";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Drops Carousel ──────────────────────────── */}
      <DropsCarousel />

      {/* ── Trending Section ─────────────────────────── */}
      <TrendingSection />

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

      {/* ── Categories ──────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3.5rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            letterSpacing: "0.12em", color: "#111",
            textTransform: "uppercase",
          }}>
            CLEARANCE LEVELS
          </h2>
          <div style={{ height: 2, width: 60, background: "#e8000d", margin: "10px auto 0" }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}>
          {[
            { label: "APEX",   desc: "Highest degree. Premium heavyweight drops for the architect class.",  href: "/shop?cat=APEX",   accent: "#7c00cc", note: "LEVEL 33 CLEARANCE" },
            { label: "CIPHER", desc: "Encoded for the informed. Knowledge hidden in every thread.",         href: "/shop?cat=CIPHER", accent: "#0090bb", note: "LEVEL 17 CLEARANCE" },
            { label: "SACRED", desc: "Ancient symbols for the everyday initiate. Entry to the order.",      href: "/shop?cat=SACRED", accent: "#00843d", note: "OPEN ENROLLMENT"   },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              style={{
                display: "block", padding: "2rem",
                background: "#fafafa",
                border: "1px solid #eee",
                textDecoration: "none",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
            >
              <span style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.44rem", letterSpacing: "0.4em",
                color: cat.accent, textTransform: "uppercase",
              }}>
                {cat.note}
              </span>
              <h3 style={{
                fontFamily: "Anton, sans-serif",
                fontSize: "2rem", letterSpacing: "0.12em",
                color: "#111", marginTop: 8, marginBottom: 10,
                textTransform: "uppercase",
              }}>
                {cat.label}
              </h3>
              <p style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.68rem", color: "#888",
                lineHeight: 1.7, marginBottom: 16,
              }}>
                {cat.desc}
              </p>
              <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: 700,
                fontSize: "0.55rem", letterSpacing: "0.2em",
                color: cat.accent, textTransform: "uppercase",
              }}>
                ENTER →
              </span>
            </Link>
          ))}
        </div>
      </section>

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
