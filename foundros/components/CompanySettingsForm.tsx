"use client";

import { useState } from "react";

interface Company {
  id: string;
  name: string;
  address: string | null;
  gstin: string | null;
  state: string;
  slug: string;
}

export default function CompanySettingsForm({ company, states }: { company: Company; states: string[] }) {
  const [name, setName] = useState(company.name);
  const [address, setAddress] = useState(company.address || "");
  const [gstin, setGstin] = useState(company.gstin || "");
  const [state, setState] = useState(company.state || "other");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const res = await fetch("/api/company", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: company.id, name, address, gstin, state }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Company Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Registered Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder="Full company address (appears on salary slips)"
          className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">GSTIN</label>
          <input
            type="text"
            value={gstin}
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
            maxLength={15}
            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560] bg-white"
          >
            {states.map((s) => (
              <option key={s} value={s}>{s === "other" ? "Other / UT" : s}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Settings saved successfully!</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#1A1A2E] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#16213E] transition disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
