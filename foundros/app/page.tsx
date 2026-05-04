import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    const user = session.user as any;
    if (user.role === "super_admin") redirect("/super/dashboard");
    if (user.companyId) {
      const [company] = await db
        .select({ slug: companies.slug })
        .from(companies)
        .where(eq(companies.id, user.companyId))
        .limit(1);
      if (company?.slug) {
        redirect(user.role === "employee" ? `/app/${company.slug}/employee` : `/app/${company.slug}/admin`);
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
