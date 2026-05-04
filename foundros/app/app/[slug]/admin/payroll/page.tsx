import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, payrollRuns as payrollRunsTable, employees } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { DollarSign, Users, Play } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PayrollPage({ params }: Props) {
  const { slug } = await params;

  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();

  const [payrollRuns, empRows, [thisMonthRun]] = await Promise.all([
    db.select().from(payrollRunsTable).where(eq(payrollRunsTable.companyId, company.id)).orderBy(desc(payrollRunsTable.year), desc(payrollRunsTable.month)),
    db.select({ id: employees.id, baseSalary: employees.baseSalary }).from(employees).where(and(eq(employees.companyId, company.id), eq(employees.status, "active"))),
    db.select().from(payrollRunsTable).where(and(eq(payrollRunsTable.companyId, company.id), eq(payrollRunsTable.month, thisMonth), eq(payrollRunsTable.year, thisYear))).limit(1),
  ]);

  const totalPayroll = empRows.reduce((s, e) => s + parseFloat(e.baseSalary || "0"), 0);
  const isSuspended = company.billingStatus === "suspended";

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
          value={thisMonthRun ? formatCurrency(thisMonthRun.totalNet) : formatCurrency(totalPayroll)}
          icon={DollarSign}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Active Employees"
          value={empRows.length}
          icon={Users}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Payroll Runs */}
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Payroll History</h2>
      {payrollRuns.length === 0 ? (
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
                  <td className="px-4 py-3 text-sm text-[#64748B]">{formatCurrency(run.totalGross)}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{formatCurrency(run.totalDeductions)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#1A1A1A]">{formatCurrency(run.totalNet)}</td>
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
