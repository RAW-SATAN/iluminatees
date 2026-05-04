import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, payrollRuns, salarySlips, employees } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { formatCurrency, getMonthName } from "@/lib/utils";
import MarkPaidButton from "@/components/MarkPaidButton";
import SalarySlipPDF from "@/components/SalarySlipPDF";

interface Props {
  params: Promise<{ slug: string; runId: string }>;
}

export default async function PayrollRunDetailPage({ params }: Props) {
  const { slug, runId } = await params;

  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const [run] = await db.select().from(payrollRuns).where(and(eq(payrollRuns.id, runId), eq(payrollRuns.companyId, company.id))).limit(1);
  if (!run) redirect(`/app/${slug}/admin/payroll`);

  const slips = await db
    .select({
      id: salarySlips.id,
      grossSalary: salarySlips.grossSalary,
      netSalary: salarySlips.netSalary,
      pfEmployee: salarySlips.pfEmployee,
      esiEmployee: salarySlips.esiEmployee,
      professionalTax: salarySlips.professionalTax,
      presentDays: salarySlips.presentDays,
      leaveDays: salarySlips.leaveDays,
      absentDays: salarySlips.absentDays,
      workingDays: salarySlips.workingDays,
      employeeName: employees.name,
      employeeDept: employees.department,
      employeeRole: employees.role,
    })
    .from(salarySlips)
    .leftJoin(employees, eq(salarySlips.employeeId, employees.id))
    .where(and(eq(salarySlips.payrollRunId, runId), eq(salarySlips.companyId, company.id)))
    .orderBy(salarySlips.createdAt);

  return (
    <div>
      <PageHeader
        title={`Payroll — ${getMonthName(run.month)} ${run.year}`}
        breadcrumbs={[
          { label: company.name },
          { label: "Payroll", href: `/app/${slug}/admin/payroll` },
          { label: `${getMonthName(run.month)} ${run.year}` },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {run.status !== "paid" && <MarkPaidButton runId={runId} />}
            <Badge label={run.status} />
          </div>
        }
      />

      {/* Run Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B]">Total Gross</p>
          <p className="text-xl font-bold text-[#1A1A1A]">{formatCurrency(run.totalGross)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B]">Total Deductions</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(run.totalDeductions)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B]">Net Payout</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(run.totalNet)}</p>
        </div>
      </div>

      {/* Salary Slips */}
      <div className="space-y-3">
        {slips.map((slip) => (
          <div key={slip.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-[#1A1A1A]">{slip.employeeName}</p>
                <p className="text-sm text-[#64748B]">{slip.employeeDept || slip.employeeRole || "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748B]">Net Salary</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(slip.netSalary)}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-[#64748B]">Gross</p><p className="font-medium">{formatCurrency(slip.grossSalary)}</p></div>
              <div><p className="text-xs text-[#64748B]">PF (Employee)</p><p className="font-medium text-red-500">{formatCurrency(slip.pfEmployee)}</p></div>
              <div><p className="text-xs text-[#64748B]">ESI (Employee)</p><p className="font-medium text-red-500">{formatCurrency(slip.esiEmployee)}</p></div>
              <div><p className="text-xs text-[#64748B]">Prof Tax</p><p className="font-medium text-red-500">{formatCurrency(slip.professionalTax)}</p></div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#64748B]">
              <span>{slip.presentDays}P</span>
              <span>·</span>
              <span>{slip.leaveDays}L</span>
              <span>·</span>
              <span>{slip.absentDays}A</span>
              <span>·</span>
              <span>{slip.workingDays} working days</span>
            </div>
            <div className="mt-3 flex justify-end">
              <SalarySlipPDF
                slip={slip}
                company={company}
                month={run.month}
                year={run.year}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
