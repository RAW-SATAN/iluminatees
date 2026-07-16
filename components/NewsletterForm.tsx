"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr(true); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 24,
        padding: "0.8rem 1.5rem",
      }}>
        <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Check size={11} color="#fff" strokeWidth={3} />
        </span>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.68rem", color: "#166534" }}>
          You&apos;re in. Welcome to the inner circle.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <div style={{
        display: "flex", alignItems: "center",
        background: "#fff",
        border: `1.5px solid ${err ? "#e8000d" : "#e0e0e0"}`,
        borderRadius: 28,
        padding: "0.3rem 0.3rem 0.3rem 1.1rem",
        boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
        transition: "border-color 0.15s",
      }}>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErr(false); }}
          placeholder="Enter your email"
          style={{
            flex: 1, minWidth: 0,
            border: "none", outline: "none", background: "transparent",
            fontFamily: "Inter, sans-serif", fontSize: "0.74rem", color: "#111",
          }}
        />
        <button
          type="submit"
          disabled={busy}
          style={{
            flexShrink: 0,
            background: "#111", color: "#fff",
            border: "none", borderRadius: 22,
            padding: "0.68rem 1.4rem",
            fontFamily: "Inter, sans-serif", fontWeight: 700,
            fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: busy ? "wait" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? "…" : "Join →"}
        </button>
      </div>
      {err && (
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#e8000d", marginTop: 8 }}>
          Sahi email daalo — tabhi vault ke messages milenge.
        </div>
      )}
    </form>
  );
}
