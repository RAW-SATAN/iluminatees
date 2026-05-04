import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, employees, salarySlips, payrollRuns } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { formatCurrency, getMonthName } from "@/lib/utils";

interface Props { params: Promise<{ slug: string }> }

export default async function EmployeePayslipsPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [company] = await db.select({ id: companies.id }).from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const [employee] = await db.select({ id: employees.id }).from(employees).where(and(eq(employees.companyId, company.id), eq(employees.userId, (session.user as any).id))).limit(1);
  if (!employee) redirect("/login");

  const slips = await db
    .select({
      id: salarySlips.id,
      netSalary: salarySlips.netSalary,
      grossSalary: salarySlips.grossSalary,
      totalDeductions: salarySlips.totalDeductions,
      basic: salarySlips.basic,
      hra: salarySlips.hra,
      specialAllowance: salarySlips.specialAllowance,
      pfEmployee: salarySlips.pfEmployee,
      tds: salarySlips.tds,
      workingDays: salarySlips.workingDays,
      presentDays: salarySlips.presentDays,
      month: payrollRuns.month,
      year: payrollRuns.year,
    })
    .from(salarySlips)
    .leftJoin(payrollRuns, eq(salarySlips.payrollRunId, payrollRuns.id))
    .where(eq(salarySlips.employeeId, employee.id))
    .orderBy(desc(salarySlips.createdAt));

  return (
    <div className="p-4 space-y-4 pb-8">
      <h2 className="text-xl font-bold text-[#1A1A1A] pt-2">My Payslips</h2>

      {slips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center">
          <p className="text-[#94A3B8] text-sm">No payslips yet</p>
          <p className="text-[#C4CBD6] text-xs mt-1">Payslips will appear here after payroll is processed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slips.map((slip) => (
            <div key={slip.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-[#1A1A1A]">
                    {slip.month ? `${getMonthName(slip.month)} ${slip.year}` : "—"}
                  </p>
                  <p className="text-xs text-[#64748B]">{slip.presentDays}/{slip.workingDays} days present</p>
                </div>
                <a
                  href={`/api/payroll/slip-pdf?slipId=${slip.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-white bg-[#E94560] px-3 py-1.5 rounded-lg hover:bg-[#d63651] transition"
                >
                  View Slip
                </a>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E2E8F0]">
                <div className="text-center">
                  <p className="text-xs text-[#94A3B8]">Gross</p>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{formatCurrency(slip.grossSalary)}</p>
                </div>
                <div className="text-center border-x border-[#E2E8F0]">
                  <p className="text-xs text-[#94A3B8]">Deductions</p>
                  <p className="text-sm font-semibold text-red-500">-{formatCurrency(slip.totalDeductions)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#94A3B8]">Net Pay</p>
                  <p className="text-sm font-semibold text-green-600">{formatCurrency(slip.netSalary)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
