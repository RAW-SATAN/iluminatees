import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/ui/StatCard";
import { Building2, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const PLAN_PRICES: Record<string, number> = { starter: 999, growth: 2499, pro: 4999 };

export default async function SuperDashboard() {
  const supabase = await createClient();

  const { data: companies } = await supabase.from("companies").select("billing_status, plan, created_at");
  const { data: usageLogs } = await supabase
    .from("usage_logs")
    .select("tokens_input, tokens_output")
    .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

  const total = companies?.length || 0;
  const active = companies?.filter((c) => c.billing_status === "active").length || 0;
  const trial = companies?.filter((c) => c.billing_status === "trial").length || 0;
  const suspended = companies?.filter((c) => c.billing_status === "suspended").length || 0;

  const mrr = companies
    ?.filter((c) => c.billing_status === "active")
    .reduce((s, c) => s + (PLAN_PRICES[c.plan] || 0), 0) || 0;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisWeek = companies?.filter((c) => new Date(c.created_at) >= weekAgo).length || 0;
  const thisMonth = companies?.filter((c) => new Date(c.created_at) >= monthAgo).length || 0;

  const totalTokens = usageLogs?.reduce((s, l) => s + (l.tokens_input || 0) + (l.tokens_output || 0), 0) || 0;

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
            const count = companies?.filter((c) => c.plan === plan && c.billing_status === "active").length || 0;
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
