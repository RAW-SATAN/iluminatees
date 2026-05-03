import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  // Only check auth if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (supabaseUrl.startsWith("http")) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, company_id, companies(slug)")
        .eq("id", user.id)
        .single() as any;

      if (profile?.role === "super_admin") redirect("/super/dashboard");
      if (profile?.companies?.slug) {
        if (profile.role === "employee") redirect(`/app/${profile.companies.slug}/employee`);
        redirect(`/app/${profile.companies.slug}/admin`);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-white mb-4">FoundrOS</h1>
      <p className="text-white/60 text-xl mb-12 text-center max-w-lg">
        All-in-one HR, attendance, payroll &amp; compliance for Indian founders.
      </p>
      <div className="flex gap-4">
        <Link href="/signup" className="bg-[#E94560] text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-[#d63d57] transition">
          Start Free Trial
        </Link>
        <Link href="/login" className="border-2 border-white/30 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-white/10 transition">
          Sign in
        </Link>
      </div>
      <p className="text-white/30 text-sm mt-8">14 days free · No credit card required</p>
    </div>
  );
}
