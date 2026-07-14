"use client";

export function NewsletterForm() {
  return (
    <form className="flex gap-0" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="your.signal@address.com"
        className="flex-1 px-4 py-3 text-xs outline-none"
        style={{
          background: "var(--color-onyx)",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRight: "none",
          color: "var(--color-cream)",
          fontFamily: "Space Mono, monospace",
        }}
      />
      <button
        type="submit"
        className="px-6 py-3 text-[0.6rem] font-bold tracking-[0.25em]"
        style={{
          background: "var(--color-gold)",
          color: "var(--color-void)",
          fontFamily: "Space Mono, monospace",
          border: "1px solid var(--color-gold)",
        }}
      >
        INITIATE
      </button>
    </form>
  );
}
