import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency, formatDate, getMonthName } from "@/lib/utils";
import { DollarSign, Users, Play } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PayrollPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, billing_status")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/login");

  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();

  const [
    { data: payrollRuns },
    { data: employees },
    { data: thisMonthRun },
  ] = await Promise.all([
    supabase.from("payroll_runs").select("*").eq("company_id", company.id).order("year", { ascending: false }).order("month", { ascending: false }),
    supabase.from("employees").select("id, base_salary").eq("company_id", company.id).eq("status", "active"),
    supabase.from("payroll_runs").select("*").eq("company_id", company.id).eq("month", thisMonth).eq("year", thisYear).single(),
  ]);

  const totalPayroll = employees?.reduce((s, e) => s + (e.base_salary || 0), 0) || 0;
  const isSuspended = company.billing_status === "suspended";

  return (
    <div>
      <PageHeader
        title="Payroll"
        breadcrumbs={[{ label: company.name }, { label: "Payroll" }]}
        actions={
          !thisMonthRun && !isSuspended ? (
            <Link
              href={`/app/${slug}/admin/payroll/run`}
              className="flex items-center gap-2 bg-[#E94560] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d63d57] transition"
            >
              <Play className="w-4 h-4" />
              Run Payroll
            </Link>
          ) : null
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="This Month Status"
          value={thisMonthRun ? thisMonthRun.status.charAt(0).toUpperCase() + thisMonthRun.status.slice(1) : "Not Run"}
          icon={DollarSign}
          iconBg={thisMonthRun ? "bg-green-50" : "bg-gray-100"}
          iconColor={thisMonthRun ? "text-green-600" : "text-gray-500"}
        />
        <StatCard
          label="Total Payout This Month"
          value={thisMonthRun ? formatCurrency(thisMonthRun.total_net) : formatCurrency(totalPayroll)}
          icon={DollarSign}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Active Employees"
          value={employees?.length || 0}
          icon={Users}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Payroll Runs */}
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Payroll History</h2>
      {!payrollRuns || payrollRuns.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-[#1A1A1A]">No payroll runs yet</p>
          <p className="text-sm text-[#64748B] mt-1">Run your first payroll to get started.</p>
          {!isSuspended && (
            <Link href={`/app/${slug}/admin/payroll/run`} className="inline-flex items-center gap-2 mt-4 bg-[#E94560] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d63d57] transition">
              <Play className="w-4 h-4" />
              Run Payroll
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Period</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Gross</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Deductions</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Net Payout</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {payrollRuns.map((run) => (
                <tr key={run.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="px-4 py-3 font-medium text-[#1A1A1A]">
                    {getMonthName(run.month)} {run.year}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{formatCurrency(run.total_gross)}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{formatCurrency(run.total_deductions)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#1A1A1A]">{formatCurrency(run.total_net)}</td>
                  <td className="px-4 py-3"><Badge label={run.status} /></td>
                  <td className="px-4 py-3">
                    <Link href={`/app/${slug}/admin/payroll/${run.id}`} className="text-xs text-[#E94560] hover:underline font-medium">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
