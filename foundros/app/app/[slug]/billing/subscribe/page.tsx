import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import BillingPlans from "@/components/BillingPlans";

interface Props {
  params: Promise<{ slug: string }>;
}

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    employees: 10,
    features: ["Up to 10 employees", "Attendance & leave management", "Payroll with salary slips", "Email notifications"],
    razorpayPlanId: process.env.RAZORPAY_STARTER_PLAN_ID || "plan_starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: 2499,
    employees: 25,
    features: ["Up to 25 employees", "All Starter features", "AI daily insights", "Excel reports"],
    razorpayPlanId: process.env.RAZORPAY_GROWTH_PLAN_ID || "plan_growth",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 4999,
    employees: 50,
    features: ["Up to 50 employees", "All Growth features", "Priority support", "Custom office locations"],
    razorpayPlanId: process.env.RAZORPAY_PRO_PLAN_ID || "plan_pro",
  },
];

export default async function SubscribePage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#1A1A2E]">Choose your plan</h1>
          <p className="text-[#64748B] mt-2">All plans include a 14-day free trial. No credit card for trial.</p>
        </div>

        <BillingPlans
          slug={slug}
          companyId={company.id}
          currentPlan={company.plan || "starter"}
          razorpayKeyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""}
        />

        <p className="text-center text-sm text-[#64748B] mt-8">
          Prices are in INR and billed monthly. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
