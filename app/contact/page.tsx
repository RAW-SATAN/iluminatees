"use client";

import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const fieldStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    background: "#060606",
    border: `1px solid ${focusedField === name ? "var(--r)" : "rgba(240,236,232,0.1)"}`,
    color: "var(--w)",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "13px",
    padding: "14px 16px",
    outline: "none",
    transition: "border-color 0.2s",
    display: "block",
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "10px",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(240,236,232,0.45)",
    display: "block",
    marginBottom: "8px",
  };

  return (
    <main style={{ background: "var(--blk)", color: "var(--w)", overflowX: "hidden" }}>

      {/* ── 1. HEADER ──────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px 52px 60px",
          borderBottom: "1px solid rgba(240,236,232,0.06)",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--r)",
            display: "block",
            marginBottom: "16px",
          }}
        >
          GET IN TOUCH
        </span>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(52px, 8vw, 120px)",
            color: "var(--w)",
            lineHeight: 0.9,
            letterSpacing: "0.02em",
            marginBottom: "20px",
          }}
        >
          LET&apos;S TALK.
        </h1>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "14px",
            color: "rgba(240,236,232,0.5)",
            lineHeight: 1.6,
          }}
        >
          For collabs, wholesale, press &amp; general enquiries.
        </p>
      </section>

      {/* ── 2. CONTACT SPLIT ───────────────────────────────────── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 52px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* LEFT: Form */}
        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid rgba(240,236,232,0.06)",
            padding: "48px",
          }}
        >
          {submitted ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "320px",
                gap: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "32px",
                  color: "var(--r)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.35,
                }}
              >
                MESSAGE RECEIVED.
                <br />
                WE&apos;LL BE IN TOUCH.
              </div>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  color: "rgba(240,236,232,0.4)",
                }}
              >
                WITHIN 48 HOURS.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Name */}
              <div>
                <label htmlFor="name" style={labelStyle}>Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={fieldStyle("name")}
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" style={labelStyle}>Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={fieldStyle("email")}
                  placeholder="your@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" style={labelStyle}>Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("subject")}
                  onBlur={() => setFocusedField(null)}
                  style={fieldStyle("subject")}
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" style={labelStyle}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...fieldStyle("message"), resize: "vertical" }}
                  placeholder="Tell us everything."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                onMouseEnter={() => setHoveredBtn(true)}
                onMouseLeave={() => setHoveredBtn(false)}
                style={{
                  width: "100%",
                  background: "var(--r)",
                  border: "none",
                  color: "var(--w)",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px",
                  letterSpacing: "0.12em",
                  padding: "16px",
                  cursor: "none",
                  transition: "box-shadow 0.25s",
                  boxShadow: hoveredBtn ? "0 0 40px rgba(204,0,0,0.5)" : "none",
                }}
              >
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>

        {/* RIGHT: Info cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { symbol: "@", label: "EMAIL US", value: "hello@iluminatees.com" },
            { symbol: "◈", label: "INSTAGRAM", value: "@iluminatees" },
            { symbol: "◷", label: "RESPONSE TIME", value: "Within 48 hours" },
          ].map(({ symbol, label, value }) => (
            <div
              key={label}
              style={{
                background: "#0d0d0d",
                borderLeft: "3px solid var(--r)",
                padding: "24px 28px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "28px",
                  color: "var(--r)",
                  lineHeight: 1,
                  flexShrink: 0,
                  width: "32px",
                  textAlign: "center",
                }}
              >
                {symbol}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "var(--r)",
                    marginBottom: "6px",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "13px",
                    color: "var(--w)",
                  }}
                >
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. BOTTOM STRIP ────────────────────────────────────── */}
      <section
        style={{
          background: "var(--r)",
          padding: "28px 52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "28px",
            color: "var(--w)",
            letterSpacing: "0.05em",
          }}
        >
          FOLLOW THE MOVEMENT
        </span>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {["IG", "TK", "YT", "X"].map((handle) => (
            <span
              key={handle}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "rgba(240,236,232,0.85)",
                cursor: "none",
              }}
            >
              {handle}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
