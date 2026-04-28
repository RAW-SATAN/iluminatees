import { HeroSection } from "@/components/HeroSection";
import { DropStrip } from "@/components/DropStrip";
import { EditorialGrid } from "@/components/EditorialGrid";
import { InfoBar } from "@/components/InfoBar";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <InfoBar />
      <DropStrip />
      <EditorialGrid />
      <NewsletterBanner />
    </>
  );
}

function NewsletterBanner() {
  return (
    <section
      className="relative overflow-hidden py-20 px-6"
      style={{ background: "#000", borderTop: "1px solid #111" }}
    >
      {/* Red glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(232,0,13,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[600px] mx-auto text-center space-y-6">
        <span className="tag-red text-[0.5rem] mx-auto">INNER CIRCLE</span>

        <h2
          className="text-white leading-none"
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            letterSpacing: "0.04em",
          }}
        >
          GET EARLY ACCESS
          <br />
          <span style={{ color: "var(--color-red)" }}>TO EVERY DROP.</span>
        </h2>

        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Join thousands who never miss a limited release. No spam — just drops, before everyone else.
        </p>

        <form
          className="flex gap-0 max-w-sm mx-auto"
          action="#"
        >
          <input
            type="email"
            placeholder="YOUR EMAIL"
            className="flex-1 bg-transparent border border-white/20 px-4 py-3 text-[0.7rem] font-semibold tracking-[0.15em] text-white placeholder:text-gray-600 outline-none focus:border-red-600 transition-colors"
          />
          <button
            type="submit"
            className="btn-red px-6 py-3 text-[0.7rem]"
            style={{ letterSpacing: "0.15em" }}
          >
            JOIN
          </button>
        </form>

        <p className="text-[0.5rem] tracking-[0.25em] text-gray-700">
          NO SPAM. UNSUBSCRIBE ANYTIME. WE DON&apos;T SELL YOUR DATA.
        </p>
      </div>
    </section>
  );
}
