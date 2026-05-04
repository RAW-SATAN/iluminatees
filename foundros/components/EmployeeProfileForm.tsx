"use client";

import { useState } from "react";

export default function EmployeeProfileForm({ employeeId, currentPhone }: { employeeId: string; currentPhone: string }) {
  const [phone, setPhone] = useState(currentPhone);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const res = await fetch("/api/employees/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, phone }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="10-digit mobile number"
        className="flex-1 px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#1A1A2E] text-white px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap disabled:opacity-60"
      >
        {loading ? "..." : success ? "Saved!" : "Update"}
      </button>
      {error && <p className="text-xs text-red-500 mt-1 absolute">{error}</p>}
    </form>
  );
}
