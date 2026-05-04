"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const companyName = form.get("companyName") as string;
    const ownerName = form.get("ownerName") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    const password = form.get("password") as string;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, ownerName, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Sign in immediately after signup
      await signIn("credentials", { email, password, redirect: false });

      router.push(`/app/${data.slug}/admin`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A2E]">FoundrOS</h1>
          <p className="text-[#64748B] mt-2">HR & Payroll for Indian Founders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Create your account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                Company Name
              </label>
              <input
                name="companyName"
                type="text"
                required
                placeholder="Acme Pvt Ltd"
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                Your Name
              </label>
              <input
                name="ownerName"
                type="text"
                required
                placeholder="Aman Gupta"
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                Work Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="aman@acme.com"
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E94560] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#d63d57] transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Start free 14-day trial"}
            </button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#E94560] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#64748B] mt-4">
          No credit card required · 14 days free · Cancel anytime
        </p>
      </div>
    </div>
  );
}
