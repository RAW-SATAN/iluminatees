"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const INVITE_ERRORS: Record<string, string> = {
  invalid_invite: "This invite link is invalid or has expired.",
  invite_used: "This invite link has already been used. Please sign in.",
  invite_expired: "This invite link has expired. Ask your employer to resend it.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const errKey = searchParams.get("error");
    if (errKey && INVITE_ERRORS[errKey]) setError(INVITE_ERRORS[errKey]);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // Fetch session to get role/companyId for redirect
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;
    const companyId = session?.user?.companyId;

    if (email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || role === "super_admin") {
      router.push("/super/dashboard");
      return;
    }

    if (companyId) {
      // Get company slug
      const slugRes = await fetch(`/api/auth/company-slug?companyId=${companyId}`);
      const { slug } = await slugRes.json();
      if (slug) {
        router.push(role === "employee" ? `/app/${slug}/employee` : `/app/${slug}/admin`);
        return;
      }
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A2E]">FoundrOS</h1>
          <p className="text-[#64748B] mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="aman@acme.com"
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E94560] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#d63d57] transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#E94560] font-medium hover:underline">
              Start free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
