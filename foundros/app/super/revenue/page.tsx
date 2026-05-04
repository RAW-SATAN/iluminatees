import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { formatCurrency, getMonthName } from "@/lib/utils";

const PLAN_PRICES: Record<string, number> = { starter: 999, growth: 2499, pro: 4999 };

export default async function SuperRevenuePage() {
  const allCompanies = await db
    .select({ plan: companies.plan, billingStatus: companies.billingStatus, createdAt: companies.createdAt })
    .from(companies)
    .orderBy(companies.createdAt);

  const now = new Date();
  const monthlyRevenue: Record<string, number> = {};

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyRevenue[key] = 0;
  }

  allCompanies.forEach((c) => {
    if (c.billingStatus === "active") {
      const key = new Date(c.createdAt).toISOString().slice(0, 7);
      if (monthlyRevenue[key] !== undefined) {
        monthlyRevenue[key] += PLAN_PRICES[c.plan] || 0;
      }
    }
  });

  const currentMRR = allCompanies
    .filter((c) => c.billingStatus === "active")
    .reduce((s, c) => s + (PLAN_PRICES[c.plan] || 0), 0);

  const maxRevenue = Math.max(...Object.values(monthlyRevenue), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Revenue</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-sm text-[#64748B]">Current MRR</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{formatCurrency(currentMRR)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-sm text-[#64748B]">ARR (Est.)</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{formatCurrency(currentMRR * 12)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-sm text-[#64748B]">Paying Customers</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-1">
            {allCompanies.filter((c) => c.billingStatus === "active").length}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Monthly Revenue (Last 12 Months)</h2>
        <div className="flex items-end gap-2 h-48">
          {Object.entries(monthlyRevenue).map(([month, revenue]) => {
            const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
            const [year, m] = month.split("-");
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-[#64748B]">{revenue > 0 ? `₹${(revenue / 1000).toFixed(0)}k` : ""}</span>
                <div
                  className="w-full bg-[#E94560] rounded-t-md transition-all"
                  style={{ height: `${Math.max(height, revenue > 0 ? 5 : 0)}%` }}
                />
                <span className="text-[10px] text-[#64748B]">{getMonthName(parseInt(m)).slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
