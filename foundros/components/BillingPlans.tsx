"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    employees: 10,
    features: ["Up to 10 employees", "Attendance & leave management", "Payroll with salary slips", "Email notifications"],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 2499,
    employees: 25,
    features: ["Up to 25 employees", "All Starter features", "AI daily insights", "Excel reports"],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 4999,
    employees: 50,
    features: ["Up to 50 employees", "All Growth features", "Priority support", "Custom office locations"],
    popular: false,
  },
];

interface Props {
  slug: string;
  companyId: string;
  currentPlan: string;
  razorpayKeyId: string;
}

export default function BillingPlans({ slug, companyId, currentPlan, razorpayKeyId }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(planId: string) {
    setLoading(planId);
    try {
      const res = await fetch("/api/billing/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, planId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create subscription");
        return;
      }

      // Open Razorpay checkout
      const Razorpay = (window as any).Razorpay;
      const rzp = new Razorpay({
        key: razorpayKeyId,
        subscription_id: data.subscriptionId,
        name: "FoundrOS",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        handler: async (response: any) => {
          await fetch("/api/billing/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companyId, planId, ...response }),
          });
          window.location.href = `/app/${slug}/admin`;
        },
        theme: { color: "#E94560" },
      });
      rzp.open();
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border-2 p-6 relative ${plan.popular ? "border-[#E94560] shadow-lg shadow-red-100" : "border-[#E2E8F0]"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E94560] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-[#1A1A2E]">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-[#1A1A1A]">{formatCurrency(plan.price)}</span>
                <span className="text-[#64748B]">/month</span>
              </div>
              <p className="text-sm text-[#64748B] mb-4">Up to {plan.employees} employees</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#1A1A1A]">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent || !!loading}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  isCurrent
                    ? "bg-gray-100 text-[#64748B] cursor-default"
                    : plan.popular
                    ? "bg-[#E94560] text-white hover:bg-[#d63d57]"
                    : "border-2 border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white"
                } disabled:opacity-60`}
              >
                {loading === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCurrent ? "Current Plan" : `Subscribe — ${formatCurrency(plan.price)}/mo`}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
