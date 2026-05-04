import { db } from "@/lib/db";
import { companies, usageLogs } from "@/lib/db/schema";
import { gte } from "drizzle-orm";
import StatCard from "@/components/ui/StatCard";
import { Building2, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const PLAN_PRICES: Record<string, number> = { starter: 999, growth: 2499, pro: 4999 };

export default async function SuperDashboard() {
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [allCompanies, monthLogs] = await Promise.all([
    db.select({ billingStatus: companies.billingStatus, plan: companies.plan, createdAt: companies.createdAt }).from(companies),
    db.select({ tokensInput: usageLogs.tokensInput, tokensOutput: usageLogs.tokensOutput }).from(usageLogs).where(gte(usageLogs.createdAt, monthStart)),
  ]);

  const total = allCompanies.length;
  const active = allCompanies.filter((c) => c.billingStatus === "active").length;
  const trial = allCompanies.filter((c) => c.billingStatus === "trial").length;
  const suspended = allCompanies.filter((c) => c.billingStatus === "suspended").length;

  const mrr = allCompanies
    .filter((c) => c.billingStatus === "active")
    .reduce((s, c) => s + (PLAN_PRICES[c.plan] || 0), 0);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisWeek = allCompanies.filter((c) => new Date(c.createdAt) >= weekAgo).length;
  const thisMonth = allCompanies.filter((c) => new Date(c.createdAt) >= monthAgo).length;
  const totalTokens = monthLogs.reduce((s, l) => s + (l.tokensInput || 0) + (l.tokensOutput || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Super Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Companies" value={total} icon={Building2} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Active (Paying)" value={active} icon={Building2} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard label="On Trial" value={trial} icon={Building2} iconBg="bg-yellow-50" iconColor="text-yellow-600" />
        <StatCard label="Suspended" value={suspended} icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-red-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="MRR" value={formatCurrency(mrr)} icon={DollarSign} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard label="New This Week" value={thisWeek} icon={TrendingUp} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard label="New This Month" value={thisMonth} icon={TrendingUp} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Claude Tokens (Month)" value={totalTokens.toLocaleString()} icon={DollarSign} iconBg="bg-orange-50" iconColor="text-orange-600" />
      </div>

      {/* Plan Breakdown */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Plan Breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          {["starter", "growth", "pro"].map((plan) => {
            const count = allCompanies.filter((c) => c.plan === plan && c.billingStatus === "active").length;
            const revenue = count * PLAN_PRICES[plan];
            return (
              <div key={plan} className="text-center p-4 bg-[#F8FAFC] rounded-xl">
                <p className="text-sm font-medium text-[#64748B] capitalize">{plan}</p>
                <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{count}</p>
                <p className="text-xs text-green-600 mt-1">{formatCurrency(revenue)}/mo</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
