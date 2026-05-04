import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, payrollRuns, employees, attendance } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import PageHeader from "@/components/ui/PageHeader";
import PayrollRunClient from "@/components/PayrollRunClient";
import { daysInMonth, getMonthName } from "@/lib/utils";
import { calculatePayroll } from "@/lib/payroll";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function RunPayrollPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { month: mParam, year: yParam } = await searchParams;

  const now = new Date();
  const month = mParam ? parseInt(mParam) : now.getMonth() + 1;
  const year = yParam ? parseInt(yParam) : now.getFullYear();

  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-${daysInMonth(year, month)}`;

  const [[existing], empRows, attRows] = await Promise.all([
    db.select({ id: payrollRuns.id, status: payrollRuns.status }).from(payrollRuns).where(and(eq(payrollRuns.companyId, company.id), eq(payrollRuns.month, month), eq(payrollRuns.year, year))).limit(1),
    db.select().from(employees).where(and(eq(employees.companyId, company.id), eq(employees.status, "active"))),
    db.select({ employeeId: attendance.employeeId, status: attendance.status }).from(attendance).where(and(eq(attendance.companyId, company.id), gte(attendance.date, monthStart), lte(attendance.date, monthEnd))),
  ]);

  const calculations = empRows.map((emp) => {
    const empAtt = attRows.filter((a) => a.employeeId === emp.id);
    const presentDays = empAtt.filter((a) => ["present", "late"].includes(a.status)).length;
    const leaveDays = empAtt.filter((a) => a.status === "leave").length;
    const absentDays = daysInMonth(year, month) - presentDays - leaveDays;

    const result = calculatePayroll({
      baseSalary: emp.baseSalary,
      salaryType: emp.salaryType as "monthly" | "daily",
      pfApplicable: emp.pfApplicable,
      esiApplicable: emp.esiApplicable,
      presentDays,
      leaveDays,
      absentDays: Math.max(0, absentDays),
      month,
      year,
      state: company.state || "other",
    });

    return { employee: emp, ...result };
  });

  return (
    <div>
      <PageHeader
        title={`Run Payroll — ${getMonthName(month)} ${year}`}
        breadcrumbs={[
          { label: company.name },
          { label: "Payroll", href: `/app/${slug}/admin/payroll` },
          { label: "Run Payroll" },
        ]}
      />

      {existing && existing.status !== "draft" ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 font-medium">
            Payroll for {getMonthName(month)} {year} has already been {existing.status}.
          </p>
          <a href={`/app/${slug}/admin/payroll/${existing.id}`} className="text-sm text-amber-700 underline mt-1 inline-block">
            View payroll run →
          </a>
        </div>
      ) : null}

      <PayrollRunClient
        slug={slug}
        companyId={company.id}
        month={month}
        year={year}
        calculations={calculations}
        existingRunId={existing?.id}
      />
    </div>
  );
}
