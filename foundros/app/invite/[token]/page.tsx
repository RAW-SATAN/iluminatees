"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Auto sign-in after account creation
      const result = await signIn("credentials", {
        email: data.email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        // Fetch company slug to redirect to employee portal
        const slugRes = await fetch(`/api/auth/company-slug?companyId=${data.companyId}`).catch(() => null);
        const slugData = slugRes ? await slugRes.json() : null;
        if (slugData?.slug) {
          router.push(`/app/${slugData.slug}/employee`);
        } else {
          router.push("/login");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1A1A2E] rounded-2xl p-6 text-center mb-6">
          <h1 className="text-2xl font-bold text-white">FoundrOS</h1>
          <p className="text-white/60 text-sm mt-1">Set up your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Welcome!</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Your employer has invited you to FoundrOS. Set your name and password to get started.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E94560] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#d63651] transition disabled:opacity-60"
            >
              {loading ? "Setting up..." : "Create Account & Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
